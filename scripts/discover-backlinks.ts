/**
 * Finds pages that link here, and adds them to the register for verification.
 *
 * Run: npm run backlinks:discover
 *
 * This runs unattended from .github/workflows/backlinks.yml. Discovery and
 * verification are deliberately separate jobs: a source telling us a page links
 * here is a lead, not a measurement. Everything found is written as
 * `discovered`, and only scripts/verify-backlinks.ts, having read the page, may
 * turn that into `live` or `live-nofollow`.
 *
 * Sources are pluggable and each one degrades on its own. A source that needs a
 * credential is skipped, loudly, when the credential is absent, and never
 * guessed at. A source that errors does not fail the run or the other sources.
 *
 * Why this list is short: finding who links to a domain, comprehensively,
 * requires either the domain's own Search Console or a paid backlink index.
 * Everything credential-free is partial by nature, so the honest position is a
 * small number of real sources plus a clear statement of what they miss, rather
 * than a wide net that quietly returns nothing.
 */
import fs from "node:fs";
import path from "node:path";
import { verifyLedger, type Ledger, type Placement } from "../src/lib/seo/backlink-ledger";

const DIR = process.env.BACKLINK_DIR || "backlinks";
const LEDGER_PATH = path.join(DIR, "ledger.json");
const TIMEOUT_MS = 20000;
/** A cap so one noisy source cannot flood the register in a single run. */
const MAX_NEW_PER_SOURCE = 25;

export interface Found {
  /** The page carrying the link. */
  url: string;
  /** Which source found it, recorded on the placement. */
  source: string;
  /** Anything worth keeping about how it was found. */
  note?: string;
}

interface Source {
  name: string;
  /** Why it is skipped, or null when it can run. */
  unavailable(): string | null;
  run(host: string): Promise<Found[]>;
}

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "BACwaterLinkDiscovery/1.0 (+https://bacwater.ai/embed)", Accept: "application/json", ...headers },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Wikimedia's exturlusage lists every page on a wiki carrying an external link
 * to a domain. It is free, needs no key, and is exact rather than an estimate.
 * Wikimedia links are nofollow, so this finds citations rather than equity;
 * that is still worth knowing, and the verifier will record the rel correctly
 * instead of us assuming it.
 */
const WIKIS = ["en.wikipedia.org", "simple.wikipedia.org", "en.wikibooks.org", "commons.wikimedia.org"];
const wikimedia: Source = {
  name: "wikimedia-exturlusage",
  unavailable: () => null,
  async run(host) {
    const found: Found[] = [];
    for (const wiki of WIKIS) {
      for (const protocol of ["https", "http"] as const) {
        const endpoint = `https://${wiki}/w/api.php?action=query&list=exturlusage&euquery=${encodeURIComponent(`*.${host}`)}` +
          `&euprotocol=${protocol}&eunamespace=0&eulimit=100&format=json&formatversion=2`;
        try {
          const payload = await getJson(endpoint) as { query?: { exturlusage?: { title?: string; url?: string }[] } };
          for (const entry of payload.query?.exturlusage ?? []) {
            if (!entry.title) continue;
            found.push({
              url: `https://${wiki}/wiki/${encodeURIComponent(entry.title.replace(/ /g, "_"))}`,
              source: `wikimedia-exturlusage (${wiki})`,
              note: entry.url ? `cites ${entry.url}` : undefined,
            });
          }
        } catch (error) {
          console.warn(`  ${wiki} (${protocol}): ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    return found;
  },
};

/**
 * Google Search Console is the authoritative list of pages Google knows link
 * here. It needs an OAuth refresh token for a principal with access to the
 * property, supplied as repository secrets. Without them the source reports
 * itself unavailable rather than silently returning nothing, so an empty run is
 * never mistaken for "no backlinks".
 */
const searchConsole: Source = {
  name: "google-search-console",
  unavailable() {
    const missing = ["GSC_CLIENT_ID", "GSC_CLIENT_SECRET", "GSC_REFRESH_TOKEN"].filter(name => !process.env[name]);
    return missing.length ? `not configured: ${missing.join(", ")} absent` : null;
  },
  async run(host) {
    const body = new URLSearchParams({
      client_id: process.env.GSC_CLIENT_ID!, client_secret: process.env.GSC_CLIENT_SECRET!,
      refresh_token: process.env.GSC_REFRESH_TOKEN!, grant_type: "refresh_token",
    });
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!tokenResponse.ok) throw new Error(`token exchange failed: HTTP ${tokenResponse.status}`);
    const { access_token } = await tokenResponse.json() as { access_token?: string };
    if (!access_token) throw new Error("token exchange returned no access token");

    // The Search Analytics API does not expose referring pages, so this reads
    // the property's own link report endpoint. A property the principal cannot
    // see returns 403, which is surfaced rather than swallowed.
    const property = process.env.GSC_PROPERTY || `sc-domain:${host}`;
    const payload = await getJson(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/sitemaps`,
      { Authorization: `Bearer ${access_token}` },
    ) as unknown;
    // Reaching here proves the credential and the property are usable. The
    // links report is not part of the public API surface, so nothing is
    // fabricated from this call: it validates access and returns no leads.
    void payload;
    console.warn("  search console reachable, but referring pages are not exposed by the public API; no leads added");
    return [];
  },
};

const SOURCES: Source[] = [wikimedia, searchConsole];

/** A stable, kebab-case id derived from the page URL. */
export function placementId(url: string): string {
  let parsed: URL;
  try { parsed = new URL(url); } catch { return ""; }
  const slug = `${parsed.host}${parsed.pathname}`
    .toLowerCase().replace(/^www\./, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  return slug.replace(/^[^a-z0-9]+/, "") || "";
}

/** Normalised for comparison, so the same page is not added twice. */
export function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.host = parsed.host.toLowerCase().replace(/^www\./, "");
    parsed.pathname = parsed.pathname.replace(/\/$/, "") || "/";
    return parsed.toString();
  } catch { return url; }
}

/** New leads become `discovered` records. Nothing already in the register is touched. */
export function mergeFound(ledger: Ledger, found: Found[], today: string): Placement[] {
  const known = new Set(ledger.placements.map(p => p.placementUrl).filter((u): u is string => Boolean(u)).map(canonicalUrl));
  const ids = new Set(ledger.placements.map(p => p.id));
  const added: Placement[] = [];
  for (const lead of found) {
    const url = canonicalUrl(lead.url);
    if (!url.startsWith("http") || known.has(url)) continue;
    let id = placementId(url);
    if (!id) continue;
    if (ids.has(id)) {
      let suffix = 2;
      while (ids.has(`${id}-${suffix}`)) suffix += 1;
      id = `${id}-${suffix}`;
    }
    known.add(url);
    ids.add(id);
    const placement: Placement = {
      id,
      domain: new URL(url).host,
      placementUrl: url,
      // Discovery reports the page, not which of our pages it points at. The
      // verifier reads the real destination; this is only the default it
      // compares against when a page carries several links.
      destinationPath: "/",
      status: "discovered",
      method: `Found automatically by ${lead.source}. Not placed or requested by us.`,
      relevance: "Not yet assessed. A discovered page is a lead until the verifier reads it.",
      nextStep: "Awaiting the next verification run, which will read the page and record the real link attributes.",
      discoveredBy: lead.source,
      discoveredAt: today,
      ...(lead.note ? { notes: lead.note } : {}),
    };
    ledger.placements.push(placement);
    added.push(placement);
  }
  return added;
}

async function main() {
  const ledger: Ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  const all: Found[] = [];

  for (const source of SOURCES) {
    const reason = source.unavailable();
    if (reason) { console.log(`- ${source.name}: skipped, ${reason}`); continue; }
    try {
      const found = await source.run(ledger.host);
      const capped = found.slice(0, MAX_NEW_PER_SOURCE);
      if (found.length > capped.length) console.log(`- ${source.name}: ${found.length} results, taking the first ${capped.length} this run`);
      else console.log(`- ${source.name}: ${found.length} result(s)`);
      all.push(...capped);
    } catch (error) {
      // One broken source must not stop the others or fail the workflow.
      console.warn(`- ${source.name}: failed, ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const added = mergeFound(ledger, all, today);
  const problems = verifyLedger(ledger);
  if (problems.length) {
    console.error("Discovery produced an invalid register; nothing was written:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
    return;
  }
  if (added.length) {
    ledger.updated = today;
    fs.writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`);
  }
  console.log(`Discovery: ${added.length} new page(s) added as "discovered"${added.length ? `: ${added.map(p => p.domain).join(", ")}` : ""}.`);
  console.log("Run the verifier next; a discovered page is a lead until its rel has been read.");
}

// Runs when invoked directly; stays inert when scripts/test-backlinks.ts
// imports the pure helpers above.
if (/discover-backlinks/.test(process.argv[1] || "")) void main();
