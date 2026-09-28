/**
 * Reads every placement in backlinks/ledger.json off the live web and records
 * what is actually there.
 *
 * Run: npm run backlinks:verify            (checks, writes the report)
 *      npm run backlinks:verify -- --promote  (also updates statuses in place)
 *
 * The rule this script exists to enforce: a placement is dofollow only when
 * this run read the page and found an anchor to our host with no equity-blocking
 * rel and no page-level nofollow. A high Domain Rating is not evidence, a
 * platform's documentation is not evidence, and a successful submission is not
 * evidence. Anything this run could not read stays where it was, marked with
 * the reason, and is reported separately from what was confirmed.
 *
 * Without --promote nothing in the ledger changes; the report shows what would.
 * Exit code is non-zero when the ledger's own claims contradict what was read,
 * so the check can gate a release.
 */
import fs from "node:fs";
import path from "node:path";
import { scanPage, type FoundLink } from "../src/lib/seo/link-attributes";
import { verifyLedger, countByStatus, LIVE_STATUSES, type Ledger, type Placement, type PlacementStatus, type VerifiedAttributes } from "../src/lib/seo/backlink-ledger";

// scripts/test-backlinks.ts points this at a temporary directory so the whole
// fetch, scan, promote and report path can be exercised against a local server
// without touching the real register.
const DIR = process.env.BACKLINK_DIR || "backlinks";
const LEDGER_PATH = path.join(DIR, "ledger.json");
const REPORT_PATH = path.join(DIR, "verification-report.md");
const RESULT_PATH = path.join(DIR, "verification.json");
const PROMOTE = process.argv.includes("--promote");
const TIMEOUT_MS = 20000;

type Outcome = "dofollow" | "nofollow" | "link-missing" | "page-error" | "unreachable" | "not-submitted";

interface Checked {
  placement: Placement;
  outcome: Outcome;
  httpStatus: number | null;
  detail: string;
  link: FoundLink | null;
  pageNofollow: boolean;
  pageNoindex: boolean;
  suggestedStatus: PlacementStatus | null;
}

/**
 * Fetches a page as an ordinary browser would. A placement that only renders
 * its links for a search-engine user agent is not a placement we would count,
 * so no crawler UA is spoofed.
 */
async function readPage(url: string): Promise<{ status: number; html: string; xRobotsTag: string | null } | { error: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BACwaterLinkCheck/1.0; +https://bacwater.ai/embed)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await response.text();
    return { status: response.status, html, xRobotsTag: response.headers.get("x-robots-tag") };
  } catch (error) {
    return { error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  } finally {
    clearTimeout(timer);
  }
}

/** Prefers the anchor pointing at the destination this placement claims. */
function pickLink(links: FoundLink[], destinationPath: string): FoundLink | null {
  if (!links.length) return null;
  const onDestination = links.filter(l => {
    if (!l.resolved) return false;
    try { return new URL(l.resolved).pathname.replace(/\/$/, "") === destinationPath.replace(/\/$/, ""); } catch { return false; }
  });
  const pool = onDestination.length ? onDestination : links;
  // A dofollow anchor is the one that matters if the page carries several.
  return pool.find(l => l.dofollow) ?? pool[0];
}

async function check(placement: Placement, host: string): Promise<Checked> {
  const base = { placement, link: null, pageNofollow: false, pageNoindex: false, httpStatus: null as number | null };
  if (!placement.placementUrl) {
    return { ...base, outcome: "not-submitted", detail: "No placement URL yet, so there is nothing to read.", suggestedStatus: null };
  }
  const page = await readPage(placement.placementUrl);
  if ("error" in page) {
    return {
      ...base,
      outcome: "unreachable",
      detail: `Could not read the page (${page.error}). Nothing is concluded from this; the record is unchanged.`,
      suggestedStatus: null,
    };
  }
  if (page.status >= 400) {
    return {
      ...base,
      outcome: "page-error",
      detail: `The page returned HTTP ${page.status}. A removed or gated page carries no link.`,
      httpStatus: page.status,
      suggestedStatus: page.status === 404 || page.status === 410 ? "rejected" : null,
    };
  }
  const scan = scanPage(page.html, { host, xRobotsTag: page.xRobotsTag });
  const link = pickLink(scan.links, placement.destinationPath);
  const shared = { placement, httpStatus: page.status, link, pageNofollow: scan.pageNofollow, pageNoindex: scan.pageNoindex };
  if (!link) {
    return {
      ...shared,
      outcome: "link-missing",
      detail: `The page loaded (HTTP ${page.status}) but carries no anchor to ${host}. It may have been edited out, or rendered only by client-side script.`,
      // A lead a source handed us, whose page turns out not to link here, is a
      // false lead and is closed. Something WE submitted stays pending, because
      // a publisher may not have put it up yet.
      suggestedStatus: placement.status === "discovered" ? "rejected" : null,
    };
  }
  return {
    ...shared,
    outcome: link.dofollow ? "dofollow" : "nofollow",
    detail: link.reason,
    suggestedStatus: link.dofollow ? "live" : "live-nofollow",
  };
}

function attributesFrom(checked: Checked): VerifiedAttributes {
  return {
    checkedAt: new Date().toISOString(),
    httpStatus: checked.httpStatus,
    rel: checked.link?.rel ?? [],
    dofollow: checked.outcome === "dofollow",
    anchorText: checked.link?.anchorText ?? null,
    destination: checked.link?.resolved ?? null,
    pageNofollow: checked.pageNofollow,
    pageNoindex: checked.pageNoindex,
    note: checked.detail,
  };
}

function table(rows: string[][], header: string[]): string {
  if (!rows.length) return "_None._\n";
  const head = `| ${header.join(" | ")} |\n| ${header.map(() => "---").join(" | ")} |\n`;
  return head + rows.map(r => `| ${r.map(c => c.replace(/\|/g, "\\|")).join(" | ")} |\n`).join("");
}

function report(ledger: Ledger, checks: Checked[], problems: string[]): string {
  const counts = countByStatus(ledger);
  const of = (...outcomes: Outcome[]) => checks.filter(c => outcomes.includes(c.outcome));
  const lines: string[] = [];
  lines.push("# Backlink verification\n");
  lines.push(`Generated ${new Date().toISOString()} from \`${LEDGER_PATH}\`. Destination site: ${ledger.site}.\n`);
  lines.push(
    "Every row below is the result of reading the live page in this run. A placement is reported as dofollow " +
    "only when an anchor to the destination host was found with no equity-blocking `rel` and no page-level " +
    "nofollow. Rows under **Could not verify** are exactly that: no conclusion, in either direction.\n"
  );
  lines.push(`Ledger statuses: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}.\n`);

  lines.push("\n## Published and verified dofollow\n");
  lines.push(table(of("dofollow").map(c => [
    c.placement.domain, `[link](${c.placement.placementUrl})`, c.placement.destinationPath,
    c.link?.anchorText || "(no text)", c.link?.rel.length ? `rel="${c.link.rel.join(" ")}"` : "no rel", String(c.httpStatus),
  ]), ["Domain", "Placement", "Destination", "Anchor text", "Attributes", "HTTP"]));

  lines.push("\n## Published but nofollow, ugc or sponsored\n");
  lines.push("These are live links that pass no ranking signal. They are kept in the register so the distinction stays visible.\n\n");
  lines.push(table(of("nofollow").map(c => [
    c.placement.domain, `[link](${c.placement.placementUrl})`, c.placement.destinationPath,
    c.link?.rel.length ? `rel="${c.link.rel.join(" ")}"` : "page-level nofollow", c.detail,
  ]), ["Domain", "Placement", "Destination", "Attributes", "Why"]));

  lines.push("\n## Found or submitted, not yet confirmed live\n");
  lines.push(table(of("link-missing", "page-error").map(c => [
    c.placement.domain, c.placement.placementUrl ? `[link](${c.placement.placementUrl})` : "—",
    c.placement.status, c.detail,
  ]), ["Domain", "Placement", "Ledger status", "What was found"]));

  lines.push("\n## Could not verify\n");
  lines.push("The page could not be read in this run, so nothing is claimed about it. Re-run once the blocker is gone.\n\n");
  lines.push(table(of("unreachable").map(c => [
    c.placement.domain, c.placement.placementUrl ? `[link](${c.placement.placementUrl})` : "—", c.detail,
  ]), ["Domain", "Placement", "Reason"]));

  lines.push("\n## Opportunities, nothing submitted\n");
  lines.push("No link exists for any row here. Each one names the method and what has to happen next.\n\n");
  lines.push(table(of("not-submitted").map(c => [
    c.placement.domain, c.placement.status, c.placement.method, c.placement.destinationPath, c.placement.nextStep,
  ]), ["Domain", "Ledger status", "Method", "Intended destination", "Next step"]));

  const wouldChange = checks.filter(c => c.suggestedStatus && c.suggestedStatus !== c.placement.status);
  lines.push("\n## Status changes\n");
  if (!wouldChange.length) lines.push("_The ledger already matches what was read._\n");
  else {
    lines.push(PROMOTE ? "Applied to the ledger by this run.\n\n" : "Not applied. Re-run with `--promote` to write them.\n\n");
    lines.push(table(wouldChange.map(c => [c.placement.id, c.placement.status, c.suggestedStatus!, c.detail]),
      ["Placement", "From", "To", "Why"]));
  }

  if (problems.length) {
    lines.push("\n## Ledger problems\n");
    for (const problem of problems) lines.push(`- ${problem}\n`);
  }
  return lines.join("");
}

async function main() {
  const ledger: Ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  const structural = verifyLedger(ledger);

  const checks: Checked[] = [];
  for (const placement of ledger.placements) checks.push(await check(placement, ledger.host));

  // A ledger claim the live page contradicts is the failure this gates on.
  const contradictions: string[] = [];
  for (const checked of checks) {
    const claimed = checked.placement.status;
    if (!LIVE_STATUSES.includes(claimed)) continue;
    if (checked.outcome === "dofollow" && claimed !== "live") contradictions.push(`${checked.placement.id}: recorded "${claimed}" but the live anchor is dofollow.`);
    if (checked.outcome === "nofollow" && claimed !== "live-nofollow") contradictions.push(`${checked.placement.id}: recorded "${claimed}" but the live anchor is ${checked.link?.rel.join(" ") || "page-level nofollow"}.`);
    if (checked.outcome === "link-missing") contradictions.push(`${checked.placement.id}: recorded "${claimed}" but the page carries no link to ${ledger.host}.`);
    if (checked.outcome === "page-error") contradictions.push(`${checked.placement.id}: recorded "${claimed}" but the page returned HTTP ${checked.httpStatus}.`);
  }

  if (PROMOTE) {
    for (const checked of checks) {
      if (!checked.suggestedStatus) continue;
      checked.placement.status = checked.suggestedStatus;
      if (LIVE_STATUSES.includes(checked.suggestedStatus)) {
        checked.placement.attributes = attributesFrom(checked);
        checked.placement.nextStep = "";
      } else {
        delete checked.placement.attributes;
      }
    }
    ledger.updated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`);
  }

  const problems = [...structural, ...contradictions];
  fs.writeFileSync(REPORT_PATH, report(ledger, checks, problems));
  fs.writeFileSync(RESULT_PATH, `${JSON.stringify({
    checkedAt: new Date().toISOString(),
    host: ledger.host,
    results: checks.map(c => ({
      id: c.placement.id, domain: c.placement.domain, placementUrl: c.placement.placementUrl,
      destinationPath: c.placement.destinationPath, outcome: c.outcome, httpStatus: c.httpStatus,
      rel: c.link?.rel ?? [], dofollow: c.outcome === "dofollow", anchorText: c.link?.anchorText ?? null,
      pageNofollow: c.pageNofollow, detail: c.detail,
    })),
    problems,
  }, null, 2)}\n`);

  const tally = (o: Outcome) => checks.filter(c => c.outcome === o).length;
  console.log(`Backlink verification: ${tally("dofollow")} verified dofollow, ${tally("nofollow")} live but nofollow, ` +
    `${tally("link-missing") + tally("page-error")} submitted and not live, ${tally("unreachable")} unreadable, ${tally("not-submitted")} not submitted.`);
  console.log(`Report: ${REPORT_PATH}`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s) the ledger must not keep:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exitCode = 1;
  }
}

void main();
