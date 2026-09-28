import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ORIGIN = "https://bacwater.ai";
const KEY = (await readFile(new URL("../public/27a00f2a35ea4c5f9ccf890a624f8259.txt", import.meta.url), "utf8")).trim();
const statePath = ".indexnow-state/fingerprint";

export function publicUrl(value) {
  const url = new URL(value);
  const publicFacet = url.pathname === "/learn" && /^\?(?:type=(?:guide|peptide-guide|comparison|faq|buying-guide|safety)|topic=(?:dosage|storage|safety|ingredients|where-to-buy|injection-supplies|reconstitution-method))$/.test(url.search);
  if (url.origin !== ORIGIN || (url.search && !publicFacet) || url.hash || /%(?:2f|5c|2e)/i.test(url.pathname)) throw new Error(`Unsafe sitemap URL: ${value}`);
  if (/^\/(?:admin|api|account|auth|plans|share)(?:\/|$)/.test(url.pathname) || /^\/plan\//.test(url.pathname) || /^\/embed\//.test(url.pathname)) throw new Error("Private URL in sitemap");
  return url.href;
}

async function get(url) {
  publicUrl(url);
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { "User-Agent": "BACwater-IndexNow/1.0" } });
  if (!response.ok) throw new Error(`Could not verify live content: HTTP ${response.status}`);
  return response.text();
}

export async function submitIndexNow() {
  if (process.env.INDEXNOW_ENABLED === "false") return console.log("IndexNow explicitly disabled.");
  const ownership = await get(`${ORIGIN}/${KEY}.txt`);
  if (ownership.trim() !== KEY) throw new Error("Live IndexNow ownership file does not match.");
  const seen = new Set();
  const urls = new Set();
  const sitemapBodies = [];
  async function sitemap(url) {
    publicUrl(url);
    if (seen.has(url)) return;
    if (seen.size >= 20) throw new Error("Unexpected sitemap count");
    seen.add(url);
    const xml = await get(url);
    if (!/<(?:sitemapindex|urlset)\b/.test(xml)) throw new Error("Invalid sitemap XML");
    sitemapBodies.push(xml);
    const locations = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => publicUrl(m[1].replaceAll("&amp;", "&")));
    if (/<sitemapindex\b/.test(xml)) {
      for (const child of locations) await sitemap(child);
    } else for (const page of locations) urls.add(page);
  }
  await sitemap(`${ORIGIN}/sitemap.xml`);
  if (!urls.size || urls.size > 10000) throw new Error("Unexpected URL count");
  // Next's content-hashed scripts change after deployment. Dynamic request IDs
  // do not participate, preventing repeated notifications for unchanged pages.
  const home = await get(`${ORIGIN}/`);
  const scripts = [...home.matchAll(/<script[^>]*src="([^"]*\/_next\/static\/[^"?]+)[^"]*"/g)].map(m => m[1]).sort();
  if (!scripts.length) throw new Error("Could not identify the live Next build");
  const fingerprint = createHash("sha256").update(JSON.stringify([scripts, sitemapBodies])).digest("hex");
  const previous = await readFile(statePath, "utf8").catch(() => "");
  if (previous === fingerprint && !process.argv.includes("--force")) return console.log(`No live deployment or sitemap changes; skipped ${urls.size} URLs.`);
  if (process.argv.includes("--dry-run")) return console.log(`Validated ${urls.size} public URLs, ${seen.size} sitemaps, live key, and deployment fingerprint. No submission made.`);
  // Deliberately one POST. A timeout has an unknown outcome and isn't replayed.
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", redirect: "error", signal: AbortSignal.timeout(30000),
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "bacwater.ai", key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: [...urls] }),
  });
  console.log(`IndexNow: HTTP ${response.status}, ${urls.size} URLs.`);
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow did not accept the submission: HTTP ${response.status}`);
  await mkdir(".indexnow-state", { recursive: true });
  await writeFile(statePath, fingerprint);
  console.log(response.status === 200 ? "Submission received. Index inclusion is not guaranteed." : "Submission accepted; ownership validation is pending.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  submitIndexNow().catch(error => { console.error(error.message); process.exitCode = 1; });
}
