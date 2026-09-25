import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, firefox, webkit, expect } from '@playwright/test';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3000';
const out = 'audit-evidence/live-product-search';
await fs.mkdir(out, { recursive: true });
const axe = await fs.readFile('node_modules/axe-core/axe.min.js', 'utf8');
const names = JSON.parse(await fs.readFile('scripts/fixtures/partner-product-names.json', 'utf8'));
const reports = [];
const configurations = [
  { engine: chromium, name: 'chromium-desktop', width: 1440, height: 960 },
  { engine: chromium, name: 'chromium-tablet', width: 1024, height: 768 },
  { engine: chromium, name: 'chromium-mobile', width: 390, height: 844 },
  { engine: chromium, name: 'chromium-small', width: 320, height: 740 },
  { engine: webkit, name: 'webkit-mobile', width: 390, height: 844 },
  { engine: firefox, name: 'firefox-desktop', width: 1440, height: 960 },
];
async function noOverflow(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, 'Page must not overflow horizontally');
}
async function accessible(page) {
  await page.addScriptTag({ content: axe });
  const result = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })));
  assert.deepEqual(result, [], JSON.stringify(result));
}
for (const config of configurations) {
  const browser = await config.engine.launch();
  const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(`${request.url()} ${request.postData() || ''}`));
  const report = { browser: config.name, checks: [], errors };
  reports.push(report);
  try {
    await page.goto(`${origin}/recommendations`);
    const directory = page.locator('[data-product-directory]');
    const input = directory.getByRole('searchbox', { name: 'Find a product', exact: true });
    await expect(input).toBeVisible();
    const bounds = await input.boundingBox();
    report.searchTop = Math.round(bounds.y);
    assert(bounds.y < 380, `Search must be near the top, not below the large introduction (${bounds.y})`);
    assert(bounds.y + bounds.height < config.height, 'Search must be visible without scrolling');
    await page.screenshot({ path: `${out}/${config.name}-directory.png`, fullPage: false });
    await noOverflow(page);
    report.checks.push('Search visible near top without scrolling');

    await input.focus();
    for (const letter of 'bpc') {
      await input.pressSequentially(letter);
      await expect(directory.locator('[data-product-match]').first()).toBeVisible();
    }
    const rows = directory.locator('[data-product-match]');
    assert((await rows.count()) > 0);
    for (const row of await rows.all()) {
      await expect(row.locator('strong')).toContainText(/BPC/i);
      await expect(row.getByRole('img')).toBeVisible();
    }
    await page.screenshot({ path: `${out}/${config.name}-live-matches.png`, fullPage: false });
    report.checks.push('Live matching on every keystroke, with images on every visible result');

    await input.fill('RT');
    const rt = directory.getByRole('button', { name: 'Open product details for GLP-3 (RT)', exact: true });
    await expect(rt).toBeVisible();
    await input.press('ArrowDown');
    await expect(rt).toBeFocused();
    await rt.press('Enter');
    const detail = page.locator('[data-product-detail]');
    await expect(detail.getByRole('heading', { name: 'GLP-3 (RT)', exact: true })).toBeVisible();
    const supplier = detail.getByRole('link', { name: 'View GLP-3 (RT) on the supplier website, opens a new tab', exact: true });
    const href = new URL(await supplier.getAttribute('href'));
    assert.equal(href.searchParams.get('code'), 'WEBIQ');
    assert.equal(href.searchParams.get('utm_source'), 'affiliate_marketing');
    assert.match(await supplier.getAttribute('rel'), /sponsored/);
    await page.keyboard.press('Escape');
    await expect(detail).toHaveCount(0);
    await expect(rt).toBeFocused();
    await rt.press('ArrowUp');
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('RT');
    report.checks.push('Exact partner naming, keyboard navigation, quick view, focus restoration and affiliate attribution');

    await input.fill('Show me lab water');
    await expect(directory.locator('[data-product-match]')).toHaveCount(1);
    await expect(directory.locator('[data-product-match] strong')).toHaveText(names['amino-h2o']);
    await input.fill('bpc-private-probe-zz91');
    await expect(directory.locator('[data-product-match]')).toHaveCount(0);
    await expect(directory.locator('[data-product-search-matches]')).toContainText('No matching products');
    await input.fill('best dose for sleep');
    await expect(directory.locator('[data-product-match]')).toHaveCount(0);
    await expect(directory.locator('[data-product-search-matches]')).toContainText('Search by product name or format only');
    assert(!requests.some(request => request.includes('bpc-private-probe-zz91')), 'Private search text must not be sent in requests');
    await directory.getByRole('button', { name: 'Clear product search', exact: true }).click();
    await expect(input).toHaveValue('');
    await expect(directory.locator('[data-product]')).toHaveCount(50);
    await directory.getByLabel('Product type', { exact: true }).selectOption('spray');
    assert((await directory.locator('[data-product]').count()) > 0);
    await directory.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await expect(directory.locator('[data-product]')).toHaveCount(50);
    report.checks.push('Format search, empty and restricted states, privacy, clearing and filters');
    if (config.name === 'chromium-desktop') await accessible(page);

    for (const route of ['/', '/learn', '/tools', '/privacy', '/search', '/recommendations', '/tools/bac-water', '/calculate/product/bpc-157']) {
      await page.goto(`${origin}${route}`);
      const workspace = await page.locator('[data-calculator-workspace]').count();
      if (config.width < 1024 && !workspace) await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
      const trigger = page.getByRole('button', { name: 'Search products', exact: true });
      await expect(trigger).toBeVisible();
      await noOverflow(page);
      await trigger.click();
      const dialog = page.locator('[data-product-search-dialog]');
      await expect(dialog).toBeVisible();
      const search = dialog.getByRole('searchbox', { name: 'Find a product', exact: true });
      await expect(search).toBeFocused();
      if (route === '/' && config.name === 'chromium-desktop') {
        await expect(dialog.locator('[data-product-match]')).toHaveCount(6);
        await dialog.getByRole('button', { name: 'Show more products', exact: true }).click();
        await expect(dialog.locator('[data-product-match]')).toHaveCount(18);
        await dialog.locator('[data-product-search-matches]').evaluate(el => { el.scrollTop = 400; });
        for (const [id, name] of Object.entries(names)) {
          await search.fill(name);
          const result = dialog.locator(`[data-product-match="${id}"]`);
          await expect(result.locator('strong')).toHaveText(name);
          await expect(result.getByRole('img')).toBeVisible();
        }
        report.checks.push('All 50 independently verified product names find their corresponding image; show-more and new-query reset work');
      }
      await search.fill('RT');
      await expect(dialog.locator('[data-product-match]')).toHaveCount(1);
      await expect(dialog.locator('[data-product-match]').getByRole('img')).toBeVisible();
      await dialog.getByRole('button', { name: 'Open product details for GLP-3 (RT)', exact: true }).click();
      await expect(page.locator('[data-product-detail]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-product-detail]')).toHaveCount(0);
      await expect(dialog).toBeVisible();
      await expect(search).toHaveValue('RT');
      await noOverflow(page);
      if (route === '/') {
        await page.screenshot({ path: `${out}/${config.name}-menu-search.png`, fullPage: false });
        if (config.name === 'chromium-desktop') await accessible(page);
        if (config.name === 'chromium-mobile' || config.name === 'webkit-mobile') {
          await page.setViewportSize({ width: config.width, height: 430 });
          await search.focus();
          await expect(search).toBeInViewport();
          await expect(dialog.locator('[data-product-match]')).toBeInViewport();
          await noOverflow(page);
          await page.screenshot({ path: `${out}/${config.name}-keyboard-height.png` });
          await page.setViewportSize({ width: config.width, height: config.height });
        }
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      report.checks.push(`Menu product search and nested detail close/return: ${route}`);
    }
    assert.deepEqual(errors, [], 'No browser runtime errors');
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error.stack || error);
    await page.screenshot({ path: `${out}/${config.name}-failure.png`, fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
    await fs.writeFile(`${out}/results.json`, JSON.stringify(reports, null, 2));
    console.log(JSON.stringify(report));
  }
}
if (reports.some(report => !report.ok)) process.exitCode = 1;
