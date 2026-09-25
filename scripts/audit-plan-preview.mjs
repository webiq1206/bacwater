import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3000';
assert.equal(new URL(origin).hostname, '127.0.0.1', 'Only the isolated test site is allowed');
const out = 'audit-evidence/plan-preview';
await fs.mkdir(out, { recursive: true });
const axe = await fs.readFile('node_modules/axe-core/axe.min.js', 'utf8');
const configurations = [
  ['chromium-desktop', chromium, 1440, 1000], ['chromium-tablet', chromium, 1024, 768],
  ['chromium-phone', chromium, 390, 844], ['chromium-small', chromium, 320, 740],
  ['webkit-desktop', webkit, 1440, 1000], ['webkit-phone', webkit, 390, 844],
];
const reports = [];
async function fit(page) {
  const sizes = await page.evaluate(() => ({ page: document.documentElement.scrollWidth - innerWidth, scroll: Array.from(document.querySelectorAll('[data-calculator-scroll], [data-live-plan-preview]')).map(e => e.scrollWidth - e.clientWidth) }));
  assert(sizes.page <= 1 && sizes.scroll.every(n => n <= 1), JSON.stringify(sizes));
}
async function accessible(page) {
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
  assert.deepEqual(violations, []);
}
for (const [name, engine, width, height] of process.env.AUDIT_QUICK ? configurations.slice(0, 1) : configurations) {
  const browser = await engine.launch(), context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage(), errors = [], report = { name, checks: [], errors };
  page.on('pageerror', e => errors.push(e.message));
  reports.push(report);
  try {
    await page.goto(origin + (name.includes('phone') ? '/plan' : '/peptide-calculator'), { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'All at once', exact: true }).click();
    const builder = page.locator('[data-plan-builder="advanced"]'), preview = page.locator('[data-live-plan-preview]');
    const vial = builder.getByRole('textbox', { name: 'Vial strength', exact: true });
    const amount = builder.locator('[data-schedule-amount]');
    const volume = builder.getByRole('textbox', { name: 'Final liquid volume in mL', exact: true });
    const save = page.getByRole('button', { name: 'Save my plan', exact: true });
    await expect(preview).toHaveAttribute('data-preview-state', 'incomplete');
    await expect(preview).toContainText('0 of 4');
    await expect(preview.locator('[data-preview-answer]')).toHaveCount(0);
    await expect(save).toBeDisabled();
    await builder.getByRole('combobox', { name: 'Product', exact: true }).click();
    const picker = page.getByRole('dialog', { name: 'Choose your product', exact: true });
    await picker.getByRole('searchbox', { name: 'Search products', exact: true }).fill('CJC-1295');
    await picker.getByRole('option', { name: 'CJC-1295 (no DAC)', exact: true }).click();
    await vial.fill('5');
    await expect(preview).toContainText('2 of 4');
    await expect(preview.locator('[data-preview-product]')).toHaveText('CJC-1295 (no DAC)');
    if (width < 1024) await preview.getByRole('button', { name: 'Show calculation details', exact: true }).click();
    await expect(preview.locator('[data-preview-field="vial"]')).toContainText('5 mg');
    await page.locator('[data-calculator-scroll]').evaluate(el => { el.scrollTop = 0; });
    await page.screenshot({ path: `${out}/${name}-partial.png` });
    report.checks.push('Empty and screenshot-equivalent partial states reflect entered product and vial amount');
    await preview.getByRole('button', { name: 'Enter final liquid volume', exact: true }).click();
    await expect(volume).toBeFocused();
    await volume.fill('2');
    await expect(preview.locator('[data-preview-concentration]')).toHaveText('2.5 mg/mL');
    await expect(save).toBeDisabled();
    await amount.fill('0.25');
    await expect(preview).toHaveAttribute('data-preview-state', 'ready');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('10 units');
    await expect(preview.locator('[data-preview-portions]')).toHaveText('20 per vial');
    await expect(save).toBeEnabled();
    await amount.fill('0.5');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('20 units');
    await amount.fill('');
    await expect(preview.locator('[data-preview-answer]')).toHaveCount(0);
    await expect(preview.locator('[data-preview-concentration]')).toHaveText('2.5 mg/mL');
    await expect(save).toBeDisabled();
    await amount.fill('0.25');
    for (const invalid of ['0', '-1', 'abc']) {
      await volume.fill(invalid);
      await expect(preview).toHaveAttribute('data-preview-state', 'incomplete');
      await expect(preview.locator('[data-preview-concentration]')).toHaveCount(0);
      await expect(save).toBeDisabled();
    }
    await volume.fill('2');
    await builder.locator('[data-plan-section="2"]').getByRole('button', { name: 'mcg', exact: true }).click();
    await expect(vial).toHaveValue('5000');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('10 units');
    await builder.getByLabel('Amount unit', { exact: true }).selectOption('mcg');
    await expect(amount).toHaveValue('250');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('10 units');
    report.checks.push('Immediate updates, partial concentration, clearing, invalid values and equivalent unit changes');
    if (width >= 1024) {
      const scroller = page.locator('[data-calculator-scroll]');
      await scroller.evaluate(el => { el.scrollTop = 650; });
      const top = await scroller.boundingBox(), bounds = await preview.boundingBox();
      const inset = await scroller.evaluate(el => parseFloat(getComputedStyle(el).paddingTop));
      assert(bounds.y >= top.y && bounds.y <= top.y + inset + 22, `Preview did not stick to its actual scroll container: ${JSON.stringify({top,bounds})}`);
      assert(bounds.y + bounds.height <= top.y + top.height + 1, 'Preview must not overlap the save dock');
    } else {
      await amount.scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: 'View calculation', exact: true }).click();
      await expect(preview).toBeFocused();
      await expect(preview.locator('[data-preview-answer]')).toBeInViewport();
    }
    await expect(save).toBeInViewport();
    await fit(page);
    await page.screenshot({ path: `${out}/${name}-ready.png` });
    await accessible(page);
    report.checks.push('Desktop sticky placement or mobile jump-to-preview, readable result, reachable save, no overflow or automated accessibility findings');
    await builder.locator('[data-plan-section="2"]').getByRole('button', { name: 'mg', exact: true }).click();
    await vial.fill('40');
    await builder.getByLabel('Amount unit', { exact: true }).selectOption('mg');
    await amount.fill('4');
    await builder.getByRole('radio', { name: /For the whole week/ }).check();
    await expect(preview).toHaveAttribute('data-preview-state', 'incomplete');
    await builder.getByLabel('How often do your instructions say?', { exact: true }).selectOption('2');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('10 units');
    await expect(preview).toContainText('2 times per week');
    await builder.getByRole('combobox', { name: 'Syringe size and scale', exact: true }).click();
    await page.getByRole('option', { name: /^3 mL/ }).click();
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('0.1 mL');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(preview).toHaveAttribute('data-preview-state', 'ready');
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('0.1 mL');
    await page.getByRole('button', { name: 'Step by step', exact: true }).click();
    await page.getByRole('button', { name: 'All at once', exact: true }).click();
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('0.1 mL');
    report.checks.push('Weekly totals split once, device scale changes, refresh and mode switching preserve entries');
    // Search from the calculator must never reset its entered values.
    await page.getByRole('link', { name: 'Search site', exact: true }).click();
    let searchDialog = page.locator('[data-unified-search-dialog]');
    await searchDialog.getByRole('button', { name: 'Products', exact: true }).click();
    await searchDialog.getByRole('searchbox').fill('RT');
    await searchDialog.getByRole('button', { name: 'Open product details for GLP-3 (RT)', exact: true }).click();
    await expect(page.locator('[data-product-detail]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(searchDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(searchDialog).toHaveCount(0);
    await expect(preview.locator('[data-preview-answer] strong')).toHaveText('0.1 mL');
    report.checks.push('Unified product search and nested details leave the calculation intact');
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const header = page.locator('header').filter({ has: page.getByRole('link', { name: 'BACwater.ai home', exact: true }) });
    await expect(header.getByRole('link', { name: 'Search site', exact: true })).toHaveCount(1);
    await expect(header.getByRole('link', { name: 'Research supplies', exact: true })).toHaveCount(0);
    await expect(header.getByRole('button', { name: 'Search products', exact: true })).toHaveCount(0);
    await expect(header.getByRole('link', { name: 'Search site', exact: true }).locator('span')).toBeVisible();
    if (width < 1024) {
      await header.getByRole('button', { name: 'Open navigation', exact: true }).click();
      await expect(header.getByRole('link', { name: 'Search site', exact: true })).toHaveCount(1);
    }
    await header.getByRole('link', { name: 'Search site', exact: true }).click();
    searchDialog = page.locator('[data-unified-search-dialog]');
    await searchDialog.getByRole('searchbox').fill('RT');
    await searchDialog.getByRole('button', { name: 'Read research details for GLP-3 (RT)', exact: true }).click();
    await expect(page.locator('[data-product-detail]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(searchDialog.getByRole('searchbox')).toHaveValue('RT');
    await searchDialog.getByRole('button', { name: 'Products', exact: true }).click();
    await expect(searchDialog.locator('[data-product-match]')).toHaveCount(1);
    await expect(searchDialog.locator('[data-product-match]').getByRole('img')).toBeVisible();
    await expect(searchDialog.getByRole('link', { name: 'Browse all products', exact: true })).toHaveAttribute('href', '/recommendations');
    await page.screenshot({ path: `${out}/${name}-unified-search.png` });
    await fit(page); await accessible(page);
    await searchDialog.getByRole('link', { name: 'Browse all products', exact: true }).click();
    await expect(page).toHaveURL(origin + '/recommendations');
    await expect(page.getByRole('searchbox', { name: 'Find a product', exact: true })).toBeVisible();
    report.checks.push('One visible labeled search entry, all categories, images, quick details, and direct directory navigation');
    assert.deepEqual(errors, []);
    report.ok = true;
  } catch (error) {
    report.ok = false; report.error = String(error.stack || error);
    await page.screenshot({ path: `${out}/${name}-failure.png`, fullPage: true }).catch(() => {});
  } finally {
    await browser.close(); await fs.writeFile(`${out}/results.json`, JSON.stringify(reports, null, 2)); console.log(JSON.stringify(report));
  }
}
if (reports.some(report => !report.ok)) process.exitCode = 1;
