import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate, type CalcInput } from "../src/lib/calc";
import { CALCULATOR_ROUTES } from "../src/lib/calculator-routes";
import { STATIC_PAGES } from "../src/lib/seo/sitemap";
import { searchSnippet } from "../src/lib/seo/search-appearance";
import { EMBED_WIDGETS, findEmbedWidget, embedSnippet, embedUrl, attributionUrl, SITE_URL } from "../src/lib/embed/registry";

/**
 * The widget builds absolute URLs from NEXT_PUBLIC_SITE_URL, and the acceptance
 * workflows run the app against http://127.0.0.1:3000. Assertions about the
 * SERVED document therefore have to come from the same value the code uses;
 * hardcoding the production host makes the suite pass locally and fail in CI.
 * Assertions about the SNIPPET still pin a literal origin, because there the
 * origin is an explicit argument rather than ambient configuration.
 */
const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SITE_HOST = new URL(SITE_URL).host;
import { concentrationMgPerMl, mgToMcg, mcgToMg, mlToU100, u100ToMl, positiveInput, displayNumber } from "../src/lib/embed/widget-math";
import { GET } from "../src/app/embed/[tool]/route";

// 1. The widget arithmetic is the SITE's arithmetic. An embedded copy that
// quietly disagreed with the tool page it links to would be worse than no
// widget, so concentration is checked against calculate() rather than against
// a hand-written expectation.
for (const [vialMg, volumeMl] of [[5,1],[10,2],[12,4],[2.5,0.5],[30,3],[0.5,5]] as const) {
  const input: CalcInput = {vialStrengthMg:vialMg,doseMcg:250,injectionsPerWeek:1,bacWaterMl:volumeMl,syringeType:"insulin-1ml",dateMixed:null};
  assert.ok(Math.abs(concentrationMgPerMl(vialMg, volumeMl) - calculate(input).finalConcentrationMgPerMl) < 1e-12,
    `embed concentration diverged from calculate() at ${vialMg}mg/${volumeMl}mL`);
}
assert.equal(mgToMcg(1), 1000); assert.equal(mcgToMg(1000), 1);
assert.equal(mlToU100(1), 100); assert.equal(u100ToMl(100), 1);
for (const ml of [0.05,0.1,0.25,1,2.5]) assert.ok(Math.abs(u100ToMl(mlToU100(ml)) - ml) < 1e-12);

// 2. Untrusted query input. Anything that is not a plain positive decimal is
// rejected outright, so the document can never echo a caller's string back.
for (const bad of ["","  ","0","-1","abc","1e3","Infinity","NaN","1,5","1.2.3","2e308","<script>","1 OR 1","9999999999999",null,undefined])
  assert.equal(positiveInput(bad as string | null), null, `positiveInput accepted ${JSON.stringify(bad)}`);
for (const [raw, expected] of [["5",5],[" 2.5 ",2.5],["0.001",0.001],["1000",1000]] as const)
  assert.equal(positiveInput(raw), expected);
assert.equal(displayNumber(Number.NaN), "—");
assert.equal(displayNumber(2.5), "2.5");

// 3. The snippet is the whole point of the feature, so its shape is pinned.
// The attribution anchor MUST sit outside the iframe: a link inside the frame
// belongs to this site's own document and earns the host page nothing.
const routePaths = new Set<string>([...CALCULATOR_ROUTES.map(r => r.href), ...STATIC_PAGES.map(p => p.path)]);
assert.ok(EMBED_WIDGETS.length >= 3);
for (const widget of EMBED_WIDGETS) {
  assert.equal(findEmbedWidget(widget.slug), widget);
  // Attribution may only point at a real, indexable public page.
  assert.ok(routePaths.has(widget.canonicalPath), `${widget.slug} points at unknown route ${widget.canonicalPath}`);
  const snippet = embedSnippet(widget, { origin: "https://bacwater.ai" });
  const iframeEnd = snippet.indexOf("</iframe>");
  const anchorAt = snippet.indexOf("<a href=");
  assert.ok(iframeEnd > 0 && anchorAt > iframeEnd, `${widget.slug}: attribution anchor is not outside the iframe`);
  // A rel the snippet ships itself would discard the link before the host ever
  // sees it. The host may still add one, which is what verification is for.
  // Comments are stripped first: the snippet deliberately MENTIONS nofollow in
  // a comment to hand the publisher editorial control, which is not the same as
  // setting the attribute.
  const markup = snippet.replace(/<!--[\s\S]*?-->/g, "");
  assert.doesNotMatch(markup, /rel=["'][^"']*(nofollow|ugc|sponsored)/);
  // Editorial control has to be visible where it is installed, not only on our
  // own page, or the placement is a widget link scheme.
  assert.match(snippet, /<!--[\s\S]*rel="nofollow"[\s\S]*delete the line[\s\S]*-->/);
  assert.match(snippet, new RegExp(`<a href="https://bacwater\\.ai${widget.canonicalPath.replace(/\//g, "\\/")}">`));
  assert.ok(snippet.includes(widget.anchorText));
  assert.ok(snippet.includes(`src="https://bacwater.ai/embed/${widget.slug}"`));
  assert.match(snippet, /loading="lazy"/);
  // Anchor text stays a brand credit. A commercial keyword phrase forced onto
  // every host is a link scheme, not attribution.
  assert.ok(/BACwater\.ai$/.test(widget.anchorText), `${widget.slug}: anchor text must end in the brand`);
  assert.ok(widget.anchorText.length <= 60);
  assert.doesNotMatch(widget.anchorText, /\b(buy|cheap|best|order|shop|price)\b/i);
  // Attribution is optional. A widget that breaks without it is coercive.
  const bare = embedSnippet(widget, { origin: "https://bacwater.ai", includeAttribution: false });
  assert.ok(!bare.includes("<a href="));
  assert.ok(bare.includes(`src="https://bacwater.ai/embed/${widget.slug}"`));
  assert.equal(embedUrl(widget, "https://bacwater.ai/"), `https://bacwater.ai/embed/${widget.slug}`);
  assert.equal(attributionUrl(widget, "https://bacwater.ai/"), `https://bacwater.ai${widget.canonicalPath}`);
}
assert.equal(findEmbedWidget("does-not-exist"), null);

async function main() {
  // 4. The framed document: served, noindex, self-canonical to the tool page,
  // script-free, and never reflecting raw input.
  const call = (tool: string, query = "") => GET(new Request(`https://bacwater.ai/embed/${tool}${query}`), { params: Promise.resolve({ tool }) });
  const notFound = await call("nope");
  assert.equal(notFound.status, 404);
  for (const widget of EMBED_WIDGETS) {
    const response = await call(widget.slug);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
    assert.match(response.headers.get("x-robots-tag") || "", /noindex/);
    const html = await response.text();
    assert.match(html, /^<!doctype html>/);
    assert.match(html, new RegExp(`<link rel="canonical" href="${escapeRe(SITE_URL + widget.canonicalPath)}">`));
    assert.match(html, /<meta name="robots" content="noindex,follow">/);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    // No scripting and no third-party fetch inside somebody else's page.
    assert.doesNotMatch(html, /<script|onclick=|onload=|javascript:/i);
    assert.doesNotMatch(html, new RegExp(`https?://(?!${escapeRe(SITE_HOST)})`), "the framed document must not reference any host but our own");
    assert.match(html, /<form method="get"/);
    // The boundary statement travels with the widget.
    assert.match(html, /does not choose an amount/);
  }
  // A result actually renders, and a hostile value renders no result at all.
  const computed = await (await call("bac-water", "?amount=10&volume=2")).text();
  assert.match(computed, /5 mg\/mL/);
  assert.match(computed, /5000 mcg\/mL/);
  const hostile = await (await call("bac-water", '?amount=%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E&volume=2'));
  const hostileHtml = await hostile.text();
  assert.doesNotMatch(hostileHtml, /<script|alert\(/i);
  assert.match(hostileHtml, /value=""/);
  const units = await (await call("syringe-units", "?units=40")).text();
  assert.match(units, /0\.4 mL/);
  const mass = await (await call("mg-to-mcg", "?mg=0.25")).text();
  assert.match(mass, /250 mcg/);

  // 5. The framing carve-out. Without it the widget cannot load anywhere, and a
  // careless edit to next.config.ts would drop the ban for the whole site.
  const config = fs.readFileSync("next.config.ts", "utf8");
  assert.match(config, /source: "\/\(\(\?!embed\/\)\.\*\)"/, "sitewide header block must exclude /embed/*");
  assert.match(config, /source: "\/embed\/:path\+"/, "missing /embed/* header block");
  const sitewide = config.slice(config.indexOf('source: "/((?!embed/).*)"'), config.indexOf('source: "/embed/:path+"'));
  assert.match(sitewide, /X-Frame-Options", value: "DENY"/);
  assert.match(sitewide, /frame-ancestors 'none'/);
  const embedBlock = config.slice(config.indexOf('source: "/embed/:path+"'));
  assert.match(embedBlock, /frame-ancestors \*/);
  assert.doesNotMatch(embedBlock, /X-Frame-Options/);
  assert.match(embedBlock, /script-src 'none'/);
  assert.match(embedBlock, /nosniff/);

  // 6. The hub page is the indexable half and must stay discoverable.
  assert.ok(STATIC_PAGES.some(p => p.path === "/embed"), "/embed missing from the sitemap");
  const hub = fs.readFileSync("src/app/embed/page.tsx", "utf8");
  assert.match(hub, /alternates: \{ canonical: PATH \}/);
  assert.match(hub, /<FaqJsonLd items=\{FAQ\}/);
  assert.match(hub, /<h1 /);
  assert.ok(fs.readFileSync("src/app/tools/page.tsx", "utf8").includes('href="/embed"'), "/tools must link to /embed");

  // Putting a path in STATIC_PAGES without a search-appearance snippet breaks
  // npm run test:search-appearance, which is a separate CI step rather than
  // part of npm test, so the failure surfaces late. Assert it here.
  const snippet = searchSnippet("/embed");
  assert.ok(snippet, "/embed is in the sitemap, so it needs a SEARCH_SNIPPETS entry");
  // withSocialMetadata resolves title and description from the registry, so the
  // page's own constants are what a reader sees in the source and the registry
  // is what ships. They must not drift apart.
  assert.ok(hub.includes(`const TITLE = "${snippet.title}"`), "the hub page's TITLE must match its SEARCH_SNIPPETS entry");
  assert.ok(hub.includes(snippet.description), "the hub page's DESCRIPTION must match its SEARCH_SNIPPETS entry");

  console.log("PASS embed widgets: shared arithmetic, rejected input, host-side dofollow attribution outside the frame, optional and non-coercive anchor text, script-free noindex framed document, framing carve-out scoped to /embed, and a discoverable hub page.");
}

void main();
