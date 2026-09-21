import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { chromium, firefox, webkit } from '@playwright/test';

const require = createRequire(import.meta.url);
const origin = process.env.AUDIT_ORIGIN || 'https://bacwater.ai';
const out = process.env.AUDIT_OUT || 'audit-evidence/live-baseline';
const screenshotAll = process.env.AUDIT_SCREENSHOTS !== '0';
await fs.mkdir(`${out}/html`, { recursive: true });
await fs.mkdir(`${out}/screenshots`, { recursive: true });
const idFor = (u) => crypto.createHash('sha256').update(u).digest('hex').slice(0, 14);
const canonicalOrigin = new URL(origin).origin;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const unescapeXml = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const xmlLocations = (s) => [...s.matchAll(/<loc>(.*?)<\/loc>/gs)].map((m) => unescapeXml(m[1]));
const endpoints = [];
const discovered = new Map();
function add(u, source) {
  try {
    const url = new URL(u, origin); url.hash = '';
    if (url.origin !== canonicalOrigin) return;
    if (/^\/(api|admin|plan\/[^/]+\/(pdf|edit|label))\b/.test(url.pathname)) return;
    if (/\.(svg|png|jpg|jpeg|webp|ico|pdf|xml|txt|css|js)$/i.test(url.pathname)) return;
    if (url.pathname.startsWith('/plan/') && !['/plan/new', '/plan/advanced'].includes(url.pathname)) return;
    // Include only intentionally curated filter combinations, not infinite query variants.
    if (url.search && !(url.pathname === '/learn' && [...url.searchParams.keys()].length === 1 && (url.searchParams.has('type') || url.searchParams.has('topic')))) return;
    const key = url.href;
    const row = discovered.get(key) || { url: key, sources: [] };
    if (!row.sources.includes(source)) row.sources.push(source);
    discovered.set(key, row);
  } catch {}
}
async function get(u) {
  const started = Date.now();
  try {
    const r = await fetch(u, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'BACWater-Authorized-Audit/1.0', 'Accept': 'text/html,application/xml,text/plain' } });
    const text = await r.text();
    return { requested: u, finalUrl: r.url, status: r.status, headers: Object.fromEntries(r.headers), elapsedMs: Date.now() - started, bytes: Buffer.byteLength(text), text };
  } catch (e) { return { requested: u, error: String(e), elapsedMs: Date.now() - started }; }
}
const root = await get(`${origin}/sitemap.xml`); endpoints.push(root);
const segmentUrls = root.text ? xmlLocations(root.text) : [];
if (root.text?.includes('<sitemapindex')) {
  for (const u of segmentUrls) {
    const r = await get(u); endpoints.push(r);
    for (const loc of xmlLocations(r.text || '')) add(loc, u);
  }
} else { for (const u of segmentUrls) add(u, 'sitemap.xml'); }
for (const p of ['/', '/sitemap', '/signin', '/signup', '/plans', '/plan', '/plan/new', '/tools', '/learn', '/peptides']) add(p, 'source-route');
const queue = [...discovered.keys()]; const crawled = new Set(); const pages = [];
// Bound discovery defensively; report any remaining queue rather than claiming complete.
while (queue.length && crawled.size < 250) {
  const batch = queue.splice(0, 3).filter((u) => !crawled.has(u));
  await Promise.all(batch.map(async (u) => {
    crawled.add(u); const r = await get(u);
    const key = idFor(u); const filename = `html/${key}.html`;
    if (r.text) await fs.writeFile(`${out}/${filename}`, r.text);
    const row = { ...discovered.get(u), ...r, htmlFile: filename }; delete row.text;
    pages.push(row);
    if (r.text && r.headers?.['content-type']?.includes('text/html')) {
      for (const m of r.text.matchAll(/<a\b[^>]*href=["']([^"']+)["']/g)) {
        const before = discovered.size; add(m[1].replace(/&amp;/g, '&'), u);
        if (discovered.size > before) queue.push([...discovered.keys()].at(-1));
      }
    }
  }));
  await sleep(200);
}
for (const p of ['/robots.txt', '/llms.txt', '/does-not-exist-audit-20260921', '/learn/does-not-exist-audit-20260921', '/peptides/does-not-exist-audit-20260921', '/peptides/semaglutide/10mg', '/tools/ml-to-units', '/shop', '/cart', '/checkout', '/plan/advanced', '/admin']) endpoints.push(await get(`${origin}${p}`));
if (origin === 'https://bacwater.ai') {
  for (const u of ['http://bacwater.ai/', 'https://www.bacwater.ai/tools/syringe-units', 'https://bacwater.ai/tools/bac-water/']) endpoints.push(await get(u));
}
await fs.writeFile(`${out}/http-inventory.json`, JSON.stringify({ date: new Date().toISOString(), origin, pages, endpoints, unvisited: [...discovered.keys()].filter((u) => !crawled.has(u)), queueRemaining: queue }, null, 2));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
// No production analytics pollution or third-party ad requests during tests.
await context.route(/google-analytics|googletagmanager|clarity\.ms|doubleclick|googlesyndication/, (route) => route.abort());
const first = await context.newPage();
await first.goto(origin, { waitUntil: 'domcontentloaded' }); await first.waitForTimeout(700);
await first.screenshot({ path: `${out}/screenshots/first-visit-390.png`, fullPage: false });
await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
await first.close();
const axe = await fs.readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const renderResults = [];
const targets = pages.filter((r) => r.status === 200 && r.headers?.['content-type']?.includes('text/html'));
async function inspect(page, url, width, engine, accessibility) {
  const errors = []; const onError = (e) => errors.push(String(e)); page.on('pageerror', onError);
  try {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);
    const data = await page.evaluate(() => {
      const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
      const main = document.querySelector('main') || document.body;
      const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent); } catch { return { parseError: true }; } });
      return {
        title: document.title, description: document.querySelector('meta[name="description"]')?.content || null,
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        robots: [...document.querySelectorAll('meta[name="robots"]')].map((m) => m.content),
        h1: [...document.querySelectorAll('h1')].map((e) => e.textContent),
        headings: [...main.querySelectorAll('h1,h2,h3,h4')].map((e) => ({ tag: e.tagName, text: e.textContent })),
        mainText: main.innerText, links: [...document.querySelectorAll('a[href]')].map((e) => ({ href: e.href, text: e.innerText, ...rect(e) })),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        overflowElements: [...main.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 2 || r.left < -2); }).slice(0, 30).map((e) => ({ tag: e.tagName, class: String(e.className).slice(0, 160), text: e.textContent?.slice(0, 80), ...rect(e) })),
        images: [...document.images].map((e) => ({ src: e.currentSrc, alt: e.getAttribute('alt'), loaded: e.complete && e.naturalWidth > 0, ...rect(e) })),
        schema, forms: [...main.querySelectorAll('form')].map((f) => ({ inputs: [...f.querySelectorAll('input,select,textarea')].map((e) => ({ type: e.type, name: e.name, id: e.id, autocomplete: e.autocomplete, label: e.labels?.[0]?.textContent || e.getAttribute('aria-label') })) })),
        inputs: [...main.querySelectorAll('input,select,textarea')].map((e) => ({ id: e.id, type: e.type, label: e.labels?.[0]?.textContent || e.getAttribute('aria-label'), value: e.type === 'password' ? '[redacted]' : e.value, ...rect(e) })),
        fixed: [...document.querySelectorAll('body *')].filter((e) => ['fixed','sticky'].includes(getComputedStyle(e).position)).map((e) => ({ tag: e.tagName, class: String(e.className).slice(0, 100), text: e.textContent?.slice(0, 120), ...rect(e) })),
      };
    });
    let violations = null;
    if (accessibility) {
      await page.evaluate(axe);
      const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } }));
      violations = result.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.map((n) => ({ target: n.target, html: n.html, summary: n.failureSummary })) }));
    }
    const screenshot = `screenshots/${idFor(url)}-${engine}-${width}.png`;
    if (screenshotAll) await page.screenshot({ path: `${out}/${screenshot}`, fullPage: true });
    return { url, finalUrl: page.url(), width, engine, emulation: 'desktop engine with CSS viewport; not a real device', status: res?.status(), errors, ...data, violations, screenshot: screenshotAll ? screenshot : null };
  } catch (e) { return { url, width, engine, error: String(e), errors }; }
  finally { page.off('pageerror', onError); }
}
let index = 0;
await Promise.all([0,1,2].map(async () => {
  const page = await context.newPage();
  while (index < targets.length) {
    const item = targets[index++];
    renderResults.push(await inspect(page, item.url, 390, 'chromium', true));
    renderResults.push(await inspect(page, item.url, 1440, 'chromium', false));
    await fs.writeFile(`${out}/rendered-pages.json`, JSON.stringify(renderResults, null, 2));
  }
  await page.close();
}));
const templates = ['/', '/peptide-calculator', '/plan/new', '/tools/bac-water', '/tools/syringe-units', '/learn', '/learn/bac-water-shelf-life', '/peptides/bpc-157', '/contact'];
const responsive = [];
const page = await context.newPage();
for (const width of [320, 375, 430, 768, 1024]) {
  for (const p of templates) responsive.push(await inspect(page, `${origin}${p}`, width, 'chromium', false));
}
await page.close(); await browser.close();
for (const [name, engine] of [['firefox', firefox], ['webkit', webkit]]) {
  try {
    const b = await engine.launch(); const c = await b.newContext();
    await c.route(/google-analytics|googletagmanager|clarity\.ms|doubleclick|googlesyndication/, (r) => r.abort());
    await c.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
    const p = await c.newPage();
    for (const route of templates) responsive.push(await inspect(p, `${origin}${route}`, name === 'webkit' ? 390 : 1440, name, false));
    await b.close();
  } catch (e) { responsive.push({ engine: name, error: String(e) }); }
}
await fs.writeFile(`${out}/responsive-engines.json`, JSON.stringify(responsive, null, 2));
await fs.writeFile(`${out}/summary.json`, JSON.stringify({ date: new Date().toISOString(), origin, httpPages: pages.length, rendered: renderResults.length, responsive: responsive.length, errors: renderResults.filter((r) => r.error).length, pagesWithOverflow: renderResults.filter((r) => r.horizontalOverflow).map((r) => ({url:r.url,width:r.width})), violations: renderResults.filter((r) => r.violations?.length).map((r) => ({url:r.url,violations:r.violations.map((v)=>({id:v.id,nodes:v.nodes.length}))})), limitations: ['Read-only production checks. No real submissions, external notifications, AI calls, or account changes.', 'Automated checks and CSS viewport emulation do not establish WCAG conformance or real-device compatibility.', 'Raw fetch timing is not Core Web Vitals. Browser screenshots require visual review.'] }, null, 2));
console.log(`Audit captured ${pages.length} HTTP pages, ${renderResults.length} page renders, ${responsive.length} responsive/engine checks.`);
