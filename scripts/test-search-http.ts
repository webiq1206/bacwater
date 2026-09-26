import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import { withSocialMetadata } from "../src/lib/seo/social-metadata";
import { shareImage } from "../src/lib/seo/search-appearance";
import { SUPPLIER_PRODUCTS } from "../src/lib/partners/supplier-catalog";
import { ARTICLE_GUIDES } from "../src/lib/learn/article-presentation";

async function main() {
  const origin = "http://127.0.0.1:3037";
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3037"], { env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"] });
  const closed = once(child, "exit");
  child.stderr.on("data", () => {}); // Drain server diagnostics without logging test input or tokens.
  const results: object[] = [];
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Test server did not start")), 30000);
      child.stdout.on("data", chunk => { if (String(chunk).includes("Ready")) { clearTimeout(timer); resolve(); } });
      child.once("error", error => { clearTimeout(timer); reject(error); });
      child.once("exit", code => { clearTimeout(timer); reject(new Error(`Test server exited: ${code}`)); });
    });
    for (const path of ["/", "/tools/bac-water", "/tools/mg-to-mcg", "/tools/syringe-units", "/learn/bac-water-shelf-life", "/peptide-calculator", "/recommendations", "/privacy"]) {
      const response = await fetch(origin + path, { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200, path);
      const html = await response.text();
      const expected = withSocialMetadata({ title: "fallback", description: "fallback", alternates: { canonical: path } });
      const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
      const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(m => m[0]);
      const meta = (key: string) => tags.filter(t => t.includes(`="${key}"`)).map(t => decode(t.match(/content="([^"]*)"/)?.[1] || ""));
      assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1] || ""), (expected.title as { absolute: string }).absolute, path);
      assert.ok(meta("description").includes(expected.description!), path);
      assert.ok(meta("og:image:alt").includes(shareImage(path).alt), path);
      assert.ok(meta("twitter:image:alt").includes(shareImage(path).alt), path);
      assert.ok(tags.some(t => t.includes('rel="icon"') && /href="[^\"]*\/icon(?:\?|\")/.test(t)), path);
      if (["/tools/bac-water", "/tools/mg-to-mcg", "/tools/syringe-units"].includes(path)) {
        assert.ok(html.includes("data-calculator-reference"), `Reference content missing from server HTML: ${path}`);
        assert.ok(html.indexOf("data-calculator-reference") > html.indexOf("</details>"), `Reference must be outside the Help disclosure: ${path}`);
      }
      results.push({ path, status: response.status, title: expected.title, imageAlt: shareImage(path).alt });
    }
    for (const path of ["/forgot-password", "/reset-password", "/calculate/hcg", ...SUPPLIER_PRODUCTS.map(p=>`/calculate/product/${p.id}`), ...(process.env.DATABASE_URL ? Object.keys(ARTICLE_GUIDES).map(slug=>`/learn/${slug}`) : [])]) {
      const response=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});
      assert.equal(response.status,200,path);
      const html=await response.text();
      assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1,path);
      if(path.includes("password")) {
        assert.match(html,/<meta name="robots" content="noindex, nofollow"/);
        assert.match(html,/<meta name="referrer" content="no-referrer"/);
      }
      const product=SUPPLIER_PRODUCTS.find(p=>path===`/calculate/product/${p.id}`);
      if(product?.kind==="blend") {
        assert.ok(html.includes("Total premixed blend"),path);
        assert.ok(html.includes("Total blend in container (mg)"),path);
        assert.ok(html.includes("Optional: calculate the amount in a sample"),path);
      }
      if(path.startsWith("/learn/")) {
        assert.ok(html.includes(shareImage(path).url),path);
        assert.ok(html.includes('"@type":"Article"')||html.includes('&quot;@type&quot;:&quot;Article&quot;'),path);
      }
      results.push({path,status:response.status,headings:1});
    }
    for (const path of ["/icon", "/favicon.ico", shareImage("/tools/mg-to-mcg").url]) {
      const response = await fetch(origin + path);
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get("content-type") || "", /image\/png/);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.subarray(1, 4).toString(), "PNG");
      results.push({ path, status: response.status, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });
    }
    fs.mkdirSync("audit-evidence/search-appearance", { recursive: true });
    fs.writeFileSync("audit-evidence/search-appearance/http-results.json", JSON.stringify(results, null, 2));
    console.log(`PASS: ${results.length} built-server HTML/image checks; explicit metadata and brand icon survive Next.js rendering.`);
  } finally {
    child.kill("SIGTERM");
    await closed;
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
