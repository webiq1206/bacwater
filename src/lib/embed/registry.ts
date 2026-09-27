/**
 * The embeddable widget catalog and the snippet a third-party site pastes.
 *
 * WHY THE ATTRIBUTION LINK SITS OUTSIDE THE IFRAME
 * A link inside an iframe belongs to the framed document, which is this site.
 * Search engines credit it to bacwater.ai, not to the page doing the framing,
 * so an in-frame "powered by" line is a self-link and earns nothing. The
 * attribution anchor therefore lives in the snippet's own markup, next to the
 * iframe, where it is part of the host page's HTML and is a real external link
 * to this site.
 *
 * The host decides the rel value. A paste of this snippet is dofollow because
 * it carries no rel, but a CMS, a comment filter or a theme can add
 * rel="nofollow" or rel="ugc" on output, and some hosts will. That is exactly
 * why a placement is only counted once scripts/verify-backlinks.ts has read
 * the live page. Nothing here may be recorded as a dofollow link on the
 * strength of the snippet alone.
 *
 * The anchor text is the brand plus a plain description of the tool. It is not
 * a commercial keyword phrase, the snippet is optional, and removing the line
 * does not disable the widget. Attribution that is keyword-stuffed or required
 * as a condition of use is a link scheme under Google's spam policies, and
 * this catalog is built so the snippet cannot become one.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

export type WidgetKind = "concentration" | "syringe-units" | "mass-convert";

export interface EmbedWidget {
  /** Path segment under /embed. */
  slug: string;
  /** The public tool page this widget mirrors, and where attribution points. */
  canonicalPath: string;
  kind: WidgetKind;
  /** Heading inside the frame. */
  title: string;
  /** One sentence, used in the frame and on the hub page. */
  description: string;
  /** Anchor text for the host-side attribution link. Brand plus plain label. */
  anchorText: string;
  /** Default iframe height in CSS pixels. */
  height: number;
}

export const EMBED_WIDGETS: readonly EmbedWidget[] = [
  {
    slug: "bac-water",
    canonicalPath: "/tools/bac-water",
    kind: "concentration",
    title: "BAC water concentration",
    description:
      "Divides the vial amount by the final liquid volume to show the amount in each mL.",
    anchorText: "BAC water calculator by BACwater.ai",
    height: 470,
  },
  {
    slug: "syringe-units",
    canonicalPath: "/tools/syringe-units",
    kind: "syringe-units",
    title: "U-100 units and mL",
    description:
      "Converts between millilitres and U-100 syringe units, where 100 units is 1 mL.",
    anchorText: "Syringe unit converter by BACwater.ai",
    height: 430,
  },
  {
    slug: "mg-to-mcg",
    canonicalPath: "/tools/mg-to-mcg",
    kind: "mass-convert",
    title: "mg and mcg",
    description: "Converts between milligrams and micrograms, where 1 mg is 1,000 mcg.",
    anchorText: "mg to mcg converter by BACwater.ai",
    height: 430,
  },
] as const;

export function findEmbedWidget(slug: string): EmbedWidget | null {
  return EMBED_WIDGETS.find(w => w.slug === slug) ?? null;
}

/** Absolute URL of the framed widget document. */
export function embedUrl(widget: EmbedWidget, origin: string = SITE_URL): string {
  return `${origin.replace(/\/$/, "")}/embed/${widget.slug}`;
}

/** Absolute URL of the page the attribution link points at. */
export function attributionUrl(widget: EmbedWidget, origin: string = SITE_URL): string {
  return `${origin.replace(/\/$/, "")}${widget.canonicalPath}`;
}

/** Minimal escaping for text placed into the generated snippet. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export interface SnippetOptions {
  origin?: string;
  /** Omits the attribution line. The widget still works; no link is earned. */
  includeAttribution?: boolean;
}

/**
 * The exact HTML a third-party site pastes. The iframe frames this site; the
 * anchor on the line below it is the part that becomes a backlink, because it
 * is in the host document rather than in the frame.
 */
export function embedSnippet(widget: EmbedWidget, options: SnippetOptions = {}): string {
  const origin = options.origin ?? SITE_URL;
  const includeAttribution = options.includeAttribution !== false;
  const src = escapeHtml(embedUrl(widget, origin));
  const title = escapeHtml(`${widget.title} calculator`);
  const frame =
    `<iframe src="${src}" title="${title}" width="100%" height="${widget.height}" loading="lazy" ` +
    `style="border:1px solid #e2e8f0;border-radius:12px;max-width:620px;display:block"></iframe>`;
  if (!includeAttribution) return frame;
  // Google treats a widget link as a link scheme when the publisher did not
  // editorially place it and does not control the anchor text. This comment
  // ships inside the pasted markup so that control is explicit and in front of
  // whoever installs it, rather than buried on our own page.
  const notice =
    `<!-- Attribution is optional: reword it, add rel="nofollow", or delete the line.\n` +
    `     The calculator keeps working either way. -->`;
  const attribution =
    `<p style="font:400 14px/1.5 system-ui,sans-serif;margin:8px 0 0">` +
    `<a href="${escapeHtml(attributionUrl(widget, origin))}">${escapeHtml(widget.anchorText)}</a></p>`;
  return `${frame}\n${notice}\n${attribution}`;
}
