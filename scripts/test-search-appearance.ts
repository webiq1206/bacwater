import { ARTICLE_GUIDES } from "../src/lib/learn/article-presentation";
import assert from "node:assert/strict";
import fs from "node:fs";
import { withSocialMetadata } from "../src/lib/seo/social-metadata";
import { SEARCH_SNIPPETS, FACET_SNIPPETS, searchSnippet, shareImage } from "../src/lib/seo/search-appearance";
import { STATIC_PAGES } from "../src/lib/seo/sitemap";
import { PEPTIDES } from "../src/lib/calc/peptides";
import { COMPARISONS } from "../src/lib/comparisons/content";
import { GET } from "../src/app/share-image/route";
import { GET as favicon } from "../src/app/favicon.ico/route";

async function main() {
  const paths = [...Object.keys(ARTICLE_GUIDES).map(slug => `/learn/${slug}`), ...Object.keys(SEARCH_SNIPPETS), ...Object.keys(FACET_SNIPPETS), ...PEPTIDES.map(p => `/peptides/${p.slug}`), ...COMPARISONS.map(c => `/learn/vs/${c.slug}`)];
  for (const page of STATIC_PAGES) assert.ok(searchSnippet(page.path || "/"), `Missing static page: ${page.path}`);
  const titles = new Set<string>();
  for (const path of paths) {
    const snippet = searchSnippet(path)!;
    assert.ok(snippet.title && snippet.description, path);
    assert.ok(!titles.has(snippet.title), `Duplicate title: ${path}`);
    titles.add(snippet.title);
    const m = withSocialMetadata({ title: "Previous title", description: "Previous description", alternates: { canonical: path } });
    const title = (m.title as { absolute: string }).absolute;
    assert.equal(title.match(/BACwater\.ai/g)?.length, 1, path);
    assert.equal(m.openGraph?.title, title);
    assert.equal(m.twitter?.title, title);
    assert.equal(m.description, snippet.description);
    assert.equal(m.alternates?.canonical, path);
    const image = shareImage(path);
    assert.match(image.alt, /droplet logo and .+ title card/);
    const response = await GET(new Request(`https://bacwater.ai${image.url}`));
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") || "", /image\/png/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(1, 4).toString(), "PNG", path);
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);
    if (["/", "/tools/mg-to-mcg", "/learn/vs/reconstitution-solution"].includes(path)) {
      fs.mkdirSync("audit-evidence/search-appearance", { recursive: true });
      fs.writeFileSync(`audit-evidence/search-appearance/${path === "/" ? "home" : path.split("/").at(-1)}.png`, bytes);
    }
  }
  for (const path of ["/admin", "/plan/private-id", "/learn/unpublished", "/learn/__proto__", "/learn/constructor", "__proto__", "<script>alert(1)</script>", "a".repeat(200)]) {
    assert.equal(searchSnippet(path), undefined);
    assert.equal((await GET(new Request(`https://bacwater.ai/share-image?path=${encodeURIComponent(path)}`))).status, 404);
  }
  const privatePage = withSocialMetadata({ title: "Private plan", description: "Not public", robots: { index: false, follow: false }, alternates: { canonical: "/plan" } });
  assert.deepEqual(privatePage.robots, { index: false, follow: false });
  const guide = withSocialMetadata({ title: "An editor's guide", description: "An editor's description", alternates: { canonical: "/learn/editor-guide" } });
  assert.equal(guide.description, "An editor's description");
  assert.equal(shareImage("/learn/editor-guide").url, "/opengraph-image");
  const icon = Buffer.from(await (favicon()).arrayBuffer());
  assert.equal(icon.readUInt32BE(16), 192);
  assert.equal(icon.readUInt32BE(20), 192);
  fs.writeFileSync("audit-evidence/search-appearance/brand-icon.png", icon);
  console.log(`PASS: ${paths.length} page-specific metadata/image pairs, PNG dimensions, brand icon, private/unknown exclusion, CMS fallback and single-brand titles.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
