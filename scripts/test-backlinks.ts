import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { scanPage, parseRel, parseAttributes, targetsHost, anchorText } from "../src/lib/seo/link-attributes";
import { verifyLedger, countByStatus, type Ledger } from "../src/lib/seo/backlink-ledger";
import { mergeFound, canonicalUrl, placementId } from "../scripts/discover-backlinks";

const HOST = "bacwater.ai";
const scan = (html: string, xRobotsTag?: string) => scanPage(html, { host: HOST, xRobotsTag });
const only = (html: string, xRobotsTag?: string) => {
  const result = scan(html, xRobotsTag);
  assert.equal(result.links.length, 1, `expected exactly one matched link in: ${html}`);
  return result.links[0];
};

// 1. Attribute parsing has to survive the markup real platforms emit: unquoted
// values, single quotes, mixed case, valueless attributes, odd whitespace.
assert.deepEqual(parseAttributes(' href="/a" rel=nofollow'), { href: "/a", rel: "nofollow" });
assert.deepEqual(parseAttributes(" HREF='/a' REL='UGC'"), { href: "/a", rel: "UGC" });
assert.equal(parseAttributes(' href = "/a"  target=_blank').target, "_blank");
assert.equal(parseAttributes(" download href=/a").href, "/a");
assert.equal(parseAttributes(' href="?a=1&amp;b=2"').href, "?a=1&b=2");
assert.deepEqual(parseRel("  NoFollow   noopener,UGC "), ["nofollow", "noopener", "ugc"]);
assert.deepEqual(parseRel(undefined), []);
assert.equal(anchorText("<span>BAC <b>water</b></span>\n calculator"), "BAC water calculator");
assert.equal(anchorText("a<!-- hidden -->b"), "ab"); // a comment is not a word break

// 2. Host matching. www is the same site; another subdomain is not, and a
// redirector that merely mentions us in a query string is not either.
for (const href of ["https://bacwater.ai/x", "http://bacwater.ai/x", "https://www.bacwater.ai/x", "//bacwater.ai/x"])
  assert.equal(targetsHost(href, HOST).match, true, href);
for (const href of ["https://notbacwater.ai/x", "https://bacwater.ai.evil.com/", "https://cdn.bacwater.ai/x", "/relative", "#anchor", "mailto:a@bacwater.ai", "javascript:void(0)", "https://t.co/?u=https://bacwater.ai", "not a url"])
  assert.equal(targetsHost(href, HOST).match, false, href);
assert.equal(targetsHost("//bacwater.ai/x", HOST).resolved, "https://bacwater.ai/x");

// 3. The core judgement. Anything that blocks equity must be caught, and
// nothing may be called dofollow on absence of evidence alone.
assert.equal(only('<a href="https://bacwater.ai/tools/bac-water">BAC water</a>').dofollow, true);
assert.equal(only('<a href="https://bacwater.ai/x" rel="noopener noreferrer">x</a>').dofollow, true);
for (const rel of ["nofollow", "ugc", "sponsored", "NOFOLLOW", "noopener nofollow", "ugc,noopener", "external sponsored"]) {
  const link = only(`<a href="https://bacwater.ai/x" rel="${rel}">x</a>`);
  assert.equal(link.dofollow, false, `rel="${rel}" was treated as dofollow`);
  assert.match(link.reason, /anchor carries rel=/);
}
// A page-level directive nofollows every link on the page, however clean the
// anchor looks. Missing this is the classic false positive.
for (const [html, label] of [
  ['<meta name="robots" content="noindex, nofollow"><a href="https://bacwater.ai/x">x</a>', "meta robots"],
  ['<meta name="googlebot" content="nofollow"><a href="https://bacwater.ai/x">x</a>', "meta googlebot"],
  ['<meta name="robots" content="none"><a href="https://bacwater.ai/x">x</a>', "meta none"],
] as const) {
  const result = scan(html);
  assert.equal(result.pageNofollow, true, label);
  assert.equal(result.links[0].dofollow, false, label);
  assert.match(result.links[0].reason, /page-level nofollow/);
}
const viaHeader = scan('<a href="https://bacwater.ai/x">x</a>', "noindex, nofollow");
assert.equal(viaHeader.pageNofollow, true);
assert.equal(viaHeader.pageNoindex, true);
assert.equal(viaHeader.links[0].dofollow, false);
assert.equal(scan('<a href="https://bacwater.ai/x">x</a>', "noarchive").links[0].dofollow, true);

// 4. What must NOT be counted: a commented-out anchor, a link to someone else,
// an anchor with no href, or our URL appearing as plain text.
assert.equal(scan('<!-- <a href="https://bacwater.ai/x">x</a> -->').links.length, 0);
assert.equal(scan('<a href="https://example.com/">other</a>').links.length, 0);
assert.equal(scan("<a>no href</a>").links.length, 0);
assert.equal(scan("<p>see https://bacwater.ai/x</p>").links.length, 0);
// Several anchors on one page: each is reported with its own attributes.
const many = scan('<a href="https://bacwater.ai/a" rel="nofollow">a</a><a href="https://bacwater.ai/b">b</a><a href="https://example.com/">c</a>');
assert.equal(many.links.length, 2);
assert.deepEqual(many.links.map(l => l.dofollow), [false, true]);
assert.deepEqual(many.links.map(l => l.anchorText), ["a", "b"]);
// Multiline and attribute-heavy anchors, as a CMS would emit them.
assert.equal(only('<a\n  class="x"\n  href="https://bacwater.ai/x"\n  title="t"\n>\n  BAC water\n</a >').anchorText, "BAC water");

// 5. Ledger invariants. The register must refuse to hold a dofollow claim that
// nothing verified, which is the whole reason it is machine-checked.
const base: Ledger = { site: "https://bacwater.ai", host: HOST, updated: "2026-09-27", placements: [] };
const opportunity = { id: "x", domain: "example.com", placementUrl: null, destinationPath: "/tools/bac-water", status: "opportunity" as const, method: "m", relevance: "r", nextStep: "n" };
assert.deepEqual(verifyLedger({ ...base, placements: [opportunity] }), []);
const claims = (overrides: Record<string, unknown>) => verifyLedger({ ...base, placements: [{ ...opportunity, ...overrides } as Ledger["placements"][number]] });
assert.match(claims({ status: "live", placementUrl: "https://example.com/p", nextStep: "" })[0], /without verified attributes/);
const verified = { checkedAt: "2026-09-27T00:00:00.000Z", httpStatus: 200, rel: [], dofollow: true, anchorText: "BACwater.ai", destination: "https://bacwater.ai/tools/bac-water", pageNofollow: false, pageNoindex: false, note: "ok" };
assert.deepEqual(claims({ status: "live", placementUrl: "https://example.com/p", nextStep: "", attributes: verified }), []);
assert.match(claims({ status: "live", placementUrl: "https://example.com/p", nextStep: "", attributes: { ...verified, dofollow: false } })[0], /verified attributes say it is not dofollow/);
assert.match(claims({ status: "live-nofollow", placementUrl: "https://example.com/p", nextStep: "", attributes: verified })[0], /say it is dofollow/);
assert.match(claims({ status: "live", nextStep: "", attributes: verified })[0], /needs the page the link is on/);
assert.match(claims({ placementUrl: "https://example.com/p" })[0], /an opportunity has no placement URL/);
assert.match(claims({ attributes: verified })[0], /only written for a verified live placement/);
assert.match(claims({ nextStep: "" })[0], /must say what happens next/);
assert.match(claims({ id: "Bad_Id" })[0], /kebab-case/);
assert.match(claims({ destinationPath: "tools" })[0], /site-relative path/);
assert.equal(verifyLedger({ ...base, placements: [opportunity, { ...opportunity }] }).filter(p => /duplicate id/.test(p)).length, 1);

// 6. The register that ships must itself be valid, and must not claim a live
// link that no verification run produced.
const shipped: Ledger = JSON.parse(fs.readFileSync(path.join("backlinks", "ledger.json"), "utf8"));
assert.deepEqual(verifyLedger(shipped), [], "backlinks/ledger.json is invalid");
assert.equal(shipped.host, HOST);
assert.ok(shipped.placements.length > 0);
for (const placement of shipped.placements) {
  if (placement.status === "live" || placement.status === "live-nofollow") assert.ok(placement.attributes, `${placement.id} claims a live status`);
}


// 6b. Automated discovery. Its job is to add leads without ever adding a claim,
// and without adding the same page twice however it is spelled.
assert.equal(canonicalUrl("https://WWW.Example.com/a/?x=1#frag"), "https://example.com/a?x=1");
assert.equal(canonicalUrl("https://example.com/a/"), "https://example.com/a");
assert.equal(canonicalUrl("https://example.com"), "https://example.com/");
assert.equal(placementId("https://en.wikipedia.org/wiki/Peptide"), "en-wikipedia-org-wiki-peptide");
assert.equal(placementId("not a url"), "");
assert.ok(placementId(`https://example.com/${"x".repeat(200)}`).length <= 70);

{
  const ledger: Ledger = {
    site: "https://bacwater.ai", host: HOST, updated: "2026-09-27",
    placements: [{ ...opportunity, id: "en-wikipedia-org-wiki-peptide", placementUrl: null }],
  };
  const added = mergeFound(ledger, [
    { url: "https://en.wikipedia.org/wiki/Peptide", source: "wikimedia" },
    { url: "https://en.wikipedia.org/wiki/Peptide/", source: "wikimedia" },   // same page
    { url: "https://WWW.en.wikipedia.org/wiki/Peptide", source: "wikimedia" }, // same page
    { url: "ftp://example.com/x", source: "wikimedia" },                       // not a web page
    { url: "nonsense", source: "wikimedia" },
  ], "2026-09-28");
  assert.equal(added.length, 1, "discovery must collapse the same page to one record");
  // The id already existed on an unrelated record, so it must not be reused.
  assert.equal(added[0].id, "en-wikipedia-org-wiki-peptide-2");
  assert.equal(added[0].status, "discovered");
  assert.equal(added[0].discoveredBy, "wikimedia");
  assert.equal(added[0].discoveredAt, "2026-09-28");
  assert.equal(added[0].attributes, undefined, "discovery must never write attributes");
  // Whatever discovery produces has to satisfy the register's own invariants.
  assert.deepEqual(verifyLedger(ledger), []);
  // A second pass over the same leads adds nothing.
  assert.equal(mergeFound(ledger, [{ url: "https://en.wikipedia.org/wiki/Peptide", source: "wikimedia" }], "2026-09-29").length, 0);
}

async function main() {
  // 7. End to end. The verifier is the thing that decides what gets claimed, so
  // it is run for real against a local server that serves the three cases that
  // matter: a clean dofollow anchor, a nofollowed one, and a page that 404s.
  const pages: Record<string, { status: number; body: string; headers?: Record<string, string> }> = {
    "/good": { status: 200, body: '<html><head><title>g</title></head><body><p>Handy: <a href="https://bacwater.ai/tools/bac-water">BAC water calculator by BACwater.ai</a></p></body></html>' },
    "/ugc": { status: 200, body: '<html><body><a href="https://bacwater.ai/tools/bac-water" rel="ugc noopener">calc</a></body></html>' },
    "/gone": { status: 404, body: "not found" },
    "/nolink": { status: 200, body: "<html><body><p>An article that mentions nothing.</p></body></html>" },
  };
  const server = http.createServer((request, response) => {
    const page = pages[(request.url || "").split("?")[0]];
    if (!page) { response.writeHead(404); response.end("no"); return; }
    response.writeHead(page.status, { "Content-Type": "text/html", ...(page.headers || {}) });
    response.end(page.body);
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as { port: number }).port;
  const origin = `http://127.0.0.1:${port}`;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "backlink-e2e-"));
  try {
    const fixture: Ledger = {
      site: "https://bacwater.ai", host: HOST, updated: "2026-09-27",
      placements: [
        { id: "good", domain: "127.0.0.1", placementUrl: `${origin}/good`, destinationPath: "/tools/bac-water", status: "submitted", method: "m", relevance: "r", nextStep: "wait" },
        { id: "ugc", domain: "127.0.0.1", placementUrl: `${origin}/ugc`, destinationPath: "/tools/bac-water", status: "submitted", method: "m", relevance: "r", nextStep: "wait" },
        { id: "gone", domain: "127.0.0.1", placementUrl: `${origin}/gone`, destinationPath: "/tools/bac-water", status: "submitted", method: "m", relevance: "r", nextStep: "wait" },
        { id: "unreachable", domain: "127.0.0.1", placementUrl: "http://127.0.0.1:1/x", destinationPath: "/tools/bac-water", status: "submitted", method: "m", relevance: "r", nextStep: "wait" },
        { id: "future", domain: "example.com", placementUrl: null, destinationPath: "/peptide-calculator", status: "opportunity", method: "m", relevance: "r", nextStep: "decide" },
        // A lead a source handed us that turns out not to link here at all.
        { id: "falselead", domain: "127.0.0.1", placementUrl: `${origin}/nolink`, destinationPath: "/tools/bac-water", status: "discovered", method: "found automatically", relevance: "unassessed", nextStep: "verify", discoveredBy: "wikimedia", discoveredAt: "2026-09-28" },
      ],
    };
    fs.writeFileSync(path.join(dir, "ledger.json"), JSON.stringify(fixture, null, 2));
    // execFile, not execFileSync: the fixture server runs in THIS process, so a
    // synchronous child would block the event loop and every fetch would look
    // unreachable.
    const exec = promisify(execFile);
    const run = async (extra: string[] = []) => (await exec("node", ["--import", "tsx", "scripts/verify-backlinks.ts", ...extra],
      { encoding: "utf8", env: { ...process.env, BACKLINK_DIR: dir } })).stdout;

    // A dry run reports, and changes nothing.
    const dry = await run();
    assert.match(dry, /1 verified dofollow/);
    assert.match(dry, /1 live but nofollow/);
    assert.match(dry, /1 not submitted/);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, "ledger.json"), "utf8")).placements[0].status, "submitted",
      "a run without --promote must not modify the ledger");
    const dryReport = fs.readFileSync(path.join(dir, "verification-report.md"), "utf8");
    assert.match(dryReport, /Re-run with `--promote`/);

    // --promote writes only what was read, and writes the evidence with it.
    await run(["--promote"]);
    const promoted: Ledger = JSON.parse(fs.readFileSync(path.join(dir, "ledger.json"), "utf8"));
    const byId = Object.fromEntries(promoted.placements.map(p => [p.id, p]));
    assert.equal(byId.good.status, "live");
    assert.equal(byId.good.attributes?.dofollow, true);
    assert.equal(byId.good.attributes?.httpStatus, 200);
    assert.equal(byId.good.attributes?.anchorText, "BAC water calculator by BACwater.ai");
    assert.equal(byId.good.attributes?.destination, "https://bacwater.ai/tools/bac-water");
    assert.equal(byId.ugc.status, "live-nofollow");
    assert.deepEqual(byId.ugc.attributes?.rel, ["ugc", "noopener"]);
    assert.equal(byId.ugc.attributes?.dofollow, false);
    assert.equal(byId.gone.status, "rejected");
    assert.equal(byId.gone.attributes, undefined);
    // The two the run could not read are left exactly as they were. Silence is
    // never converted into a conclusion.
    assert.equal(byId.unreachable.status, "submitted");
    assert.equal(byId.unreachable.attributes, undefined);
    assert.equal(byId.future.status, "opportunity");
    // A false lead is closed rather than left pending forever. Something WE
    // submitted would stay pending, because a publisher may not have put it up.
    assert.equal(byId.falselead.status, "rejected");
    assert.equal(byId.falselead.attributes, undefined);
    assert.deepEqual(verifyLedger(promoted), [], "promoted ledger must still satisfy its own invariants");

    const report = fs.readFileSync(path.join(dir, "verification-report.md"), "utf8");
    assert.match(report, /## Published and verified dofollow/);
    assert.match(report, /## Published but nofollow, ugc or sponsored/);
    assert.match(report, /## Could not verify/);
    assert.match(report, /## Opportunities, nothing submitted/);
    assert.match(report, /BAC water calculator by BACwater\.ai/);
    assert.match(report, /rel="ugc noopener"/);
    const results = JSON.parse(fs.readFileSync(path.join(dir, "verification.json"), "utf8"));
    assert.deepEqual(results.results.map((r: { outcome: string }) => r.outcome), ["dofollow", "nofollow", "page-error", "unreachable", "not-submitted", "link-missing"]);

    // A hand-written claim the live page contradicts must fail the run.
    const lying = { ...promoted, placements: promoted.placements.map(p => p.id === "ugc" ? { ...p, status: "live" as const, attributes: { ...p.attributes!, dofollow: true } } : p) };
    fs.writeFileSync(path.join(dir, "ledger.json"), JSON.stringify(lying, null, 2));
    let failed = false, stderr = "";
    try { await run(); } catch (error) { failed = true; stderr = String((error as { stderr?: string }).stderr || ""); }
    assert.ok(failed, "the verifier must exit non-zero when the ledger contradicts the live page");
    assert.match(stderr, /ugc/);
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }

  const workflow = fs.readFileSync(path.join(".github", "workflows", "backlinks.yml"), "utf8");
  assert.match(workflow, /schedule:/, "the workflow must run on a schedule, not only by hand");
  assert.match(workflow, /cron: '40 6 \* \* \*'/);
  assert.match(workflow, /contents: write/, "it commits the register back to main");
  assert.match(workflow, /issues: write/, "it raises an issue on a regression");
  assert.match(workflow, /npm run backlinks:discover/);
  assert.match(workflow, /npm run backlinks:verify -- --promote/);
  assert.match(workflow, /report-backlink-changes\.ts/);
  // A force-push from a scheduled job would silently discard a human commit.
  assert.doesNotMatch(workflow, /--force/);
  assert.match(workflow, /git pull --rebase origin main/);
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  for (const script of ["backlinks:verify", "backlinks:discover"]) assert.ok(pkg.scripts[script], `package.json is missing ${script}`);
  assert.match(pkg.scripts.test, /test-backlinks\.ts/, "the backlink suite must run in npm test");

  const counts = countByStatus(shipped);
  console.log(`PASS backlinks: attribute parsing across real-world markup, host matching, rel and page-level nofollow detection, ledger invariants refusing unverified dofollow claims, and an end-to-end verifier run that promotes only what it read. Shipped register: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
}

void main();
