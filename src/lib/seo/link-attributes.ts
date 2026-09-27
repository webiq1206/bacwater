/**
 * Reads the real link attributes of a published page.
 *
 * A high-authority domain is not evidence of a dofollow link. Platforms add
 * rel="nofollow" or rel="ugc" on output, themes add it per-widget, and a page
 * can disable every link on itself at once with a robots directive. So a
 * placement counts as dofollow only after the live HTML has been read and all
 * four of these have been checked:
 *
 *   1. the anchor's own rel attribute,
 *   2. a page-level <meta name="robots"> (or googlebot) nofollow/none,
 *   3. an X-Robots-Tag response header carrying nofollow/none,
 *   4. that the href actually resolves to our host rather than a redirector.
 *
 * Parsing is done with regular expressions rather than a DOM because this runs
 * as a build-time script with no browser. That is sufficient here: the input is
 * server HTML, and anything unparseable is reported as unknown instead of being
 * optimistically counted. Nothing in this module ever infers "dofollow" from
 * absence of evidence.
 */

/** rel tokens that stop a link passing ranking signals. */
export const EQUITY_BLOCKING_REL = ["nofollow", "ugc", "sponsored"] as const;
export type BlockingRel = (typeof EQUITY_BLOCKING_REL)[number];

export interface FoundLink {
  /** href exactly as authored. */
  href: string;
  /** Absolute form, when it could be resolved. */
  resolved: string | null;
  /** Visible text, tags stripped and whitespace collapsed. */
  anchorText: string;
  /** Lowercased rel tokens on the anchor. */
  rel: string[];
  /** True only when nothing on the anchor OR the page blocks equity. */
  dofollow: boolean;
  /** Why it is or is not dofollow, for the report. */
  reason: string;
}

export interface PageScan {
  /** A page-level robots directive that nofollows every link on the page. */
  pageNofollow: boolean;
  pageNofollowSource: string | null;
  pageNoindex: boolean;
  /** Only links resolving to the target host. */
  links: FoundLink[];
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

/** Attributes of a start tag, lowercased names, entity-decoded values. */
export function parseAttributes(tagBody: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>`]+))?/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(tagBody))) {
    const name = match[1].toLowerCase();
    let value = match[2] ?? "";
    if (value.startsWith('"') || value.startsWith("'")) value = value.slice(1, -1);
    attributes[name] = decodeEntities(value);
  }
  return attributes;
}

/** rel split on whitespace and commas, lowercased, deduplicated. */
export function parseRel(rel: string | undefined): string[] {
  if (!rel) return [];
  return [...new Set(rel.toLowerCase().split(/[\s,]+/).filter(Boolean))];
}

/**
 * True when the href points at the target host. www is treated as the same
 * site; any other subdomain is not, because a link to a different subdomain is
 * a different destination and should not be silently credited.
 */
export function targetsHost(href: string, host: string): { match: boolean; resolved: string | null } {
  const bare = host.toLowerCase().replace(/^www\./, "");
  const candidate = href.trim();
  if (!candidate || /^(#|mailto:|tel:|javascript:|data:)/i.test(candidate)) return { match: false, resolved: null };
  const absolute = candidate.startsWith("//") ? `https:${candidate}` : candidate;
  let url: URL;
  try {
    url = new URL(absolute);
  } catch {
    return { match: false, resolved: null };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { match: false, resolved: null };
  const hrefHost = url.host.toLowerCase().replace(/^www\./, "");
  return { match: hrefHost === bare, resolved: url.toString() };
}

/** Visible anchor text with markup and comments removed. */
export function anchorText(inner: string): string {
  return decodeEntities(inner.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** A page-level robots directive that nofollows or noindexes the whole page. */
function scanRobots(html: string, xRobotsTag?: string | null): Pick<PageScan, "pageNofollow" | "pageNofollowSource" | "pageNoindex"> {
  let pageNofollow = false, pageNoindex = false, pageNofollowSource: string | null = null;
  const header = (xRobotsTag || "").toLowerCase();
  if (/\b(nofollow|none)\b/.test(header)) { pageNofollow = true; pageNofollowSource = `X-Robots-Tag: ${xRobotsTag}`; }
  if (/\b(noindex|none)\b/.test(header)) pageNoindex = true;
  const metaPattern = /<meta\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = metaPattern.exec(html))) {
    const attributes = parseAttributes(match[1]);
    const name = (attributes.name || "").toLowerCase();
    if (name !== "robots" && name !== "googlebot") continue;
    const content = (attributes.content || "").toLowerCase();
    if (/\b(nofollow|none)\b/.test(content)) {
      pageNofollow = true;
      pageNofollowSource ??= `<meta name="${name}" content="${attributes.content}">`;
    }
    if (/\b(noindex|none)\b/.test(content)) pageNoindex = true;
  }
  return { pageNofollow, pageNofollowSource, pageNoindex };
}

/** Every anchor on the page that resolves to `host`, with its real attributes. */
export function scanPage(html: string, options: { host: string; xRobotsTag?: string | null }): PageScan {
  const robots = scanRobots(html, options.xRobotsTag);
  // Comments are stripped first so a commented-out anchor is never counted as a
  // live link. Tags are matched loosely because host markup is often invalid.
  const body = html.replace(/<!--[\s\S]*?-->/g, "");
  const links: FoundLink[] = [];
  const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchorPattern.exec(body))) {
    const attributes = parseAttributes(match[1]);
    const href = attributes.href;
    if (!href) continue;
    const { match: isTarget, resolved } = targetsHost(href, options.host);
    if (!isTarget) continue;
    const rel = parseRel(attributes.rel);
    const blocking = rel.filter((token): token is BlockingRel => (EQUITY_BLOCKING_REL as readonly string[]).includes(token));
    let dofollow: boolean, reason: string;
    if (blocking.length) {
      dofollow = false;
      reason = `anchor carries rel="${blocking.join(" ")}"`;
    } else if (robots.pageNofollow) {
      dofollow = false;
      reason = `page-level nofollow applies to every link (${robots.pageNofollowSource})`;
    } else {
      dofollow = true;
      reason = rel.length ? `rel="${rel.join(" ")}" does not block equity` : "no rel attribute and no page-level nofollow";
    }
    links.push({ href, resolved, anchorText: anchorText(match[2]), rel, dofollow, reason });
  }
  return { ...robots, links };
}
