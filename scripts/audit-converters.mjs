import { chooseAuditMassProduct, openAuditOptional } from "./audit-flow-helpers.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 320, height: 844 } });
await context.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
// Model a queued animation frame during a fast edit/clear interaction.
// Screen focus must settle before the next user action, not in that later frame.
await context.addInitScript(() => {
  const frame = window.requestAnimationFrame.bind(window);
  window.__converterFrames = [];
  window.__holdConverterFrames = false;
  window.requestAnimationFrame = callback => frame(time => {
    if (window.__holdConverterFrames) window.__converterFrames.push(() => callback(time));
    else callback(time);
  });
});
const page = await context.newPage();
const results = [], errors = [];
page.on('pageerror', e => errors.push(String(e)));
const out = 'audit-evidence/converters';
await fs.mkdir(out, { recursive: true });
const step = async (name, fn) => {
  try { await fn(); results.push({ name, status: 'passed' }); }
  catch (e) { results.push({ name, status: 'failed', error: String(e) }); throw e; }
};
try {
  await page.goto(`${origin}/tools/syringe-units`);
  await step('Convert U-100 scale units to mL', async () => {
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('25');
    await expect(page.getByLabel('Milliliters (mL)', { exact: true })).toHaveValue('0.25');
  });
  await step('Convert mL to U-100 scale units and retain values on refresh', async () => {
    await page.getByLabel('Milliliters (mL)', { exact: true }).fill('0.08');
    await expect(page.getByLabel('U-100 syringe units', { exact: true })).toHaveValue('8');
    await page.reload();
    await expect(page.getByLabel('U-100 syringe units', { exact: true })).toHaveValue('8');
  });
  await step('Reject negative values without displaying a valid conversion', async () => {
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('-1');
    await expect(page.locator('#u100-error')).toHaveAttribute('role', 'alert');
    await expect(page.locator('#u100-error')).toHaveText('Enter zero or a positive value.');
    await expect(page.getByLabel('Milliliters (mL)', { exact: true })).toHaveValue('');
  });
  await step('Handle zero, small decimals and explicit clearing', async () => {
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('0');
    await expect(page.getByLabel('Milliliters (mL)', { exact: true })).toHaveValue('0');
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('0.001');
    await expect(page.getByLabel('Milliliters (mL)', { exact: true })).toHaveValue('0.00001');
    await page.getByRole('button', { name: 'Clear values' }).click();
    await expect(page.getByLabel('U-100 syringe units', { exact: true })).toHaveValue('');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  });
  await page.screenshot({ path: `${out}/u100-mobile-320.png`, fullPage: true });
  await page.goto(`${origin}/tools/bac-water`);
  await chooseAuditMassProduct(page);
  await step('BAC calculator starts empty with no assumed answer', async () => {
    await expect(page.getByLabel('Final liquid volume (mL)', { exact: true })).toHaveValue('');
    await expect(page.getByRole('button',{name:'See my result',exact:true})).toBeDisabled();
    await expect(page.locator('#bac-result')).not.toBeVisible();
  });
  await step('Known label values produce the expected concentration and measurement', async () => {
    await page.getByLabel('Total amount in the vial', { exact: true }).fill('10');
    const amount=page.getByLabel('Amount to measure', { exact: true });
    await amount.fill('');
    // A whole-string fill misses a controlled field discarding "0." while typing.
    await amount.pressSequentially('0.4');
    await expect(amount).toHaveValue('0.4');
    await page.getByLabel('Final liquid volume (mL)', { exact: true }).fill('2');
    await page.getByRole('button',{name:'See my result',exact:true}).click();
    await expect(page.locator('#bac-result')).toBeVisible();
    await expect(page.locator('#bac-result')).toContainText('5 mg/mL');
    await expect(page.locator('#bac-result')).toContainText('0.08 mL');
    await expect(page.locator('#bac-result')).toContainText('8 U-100 scale units');
  });
  await step('Incomplete and invalid optional amounts stay editable and block results', async () => {
    await page.getByRole('button',{name:'Edit numbers',exact:true}).click();
    const amount=page.getByLabel('Amount to measure', { exact: true });
    for(const text of ['0.','1e','-1','1,000']) {
      await amount.fill(text);
      await expect(amount).toHaveValue(text);
      await expect(amount).toHaveAttribute('aria-invalid','true');
      await expect(page.getByRole('button',{name:'See my result',exact:true})).toBeDisabled();
    }
    await amount.fill('');
    await amount.pressSequentially('.4');
    await expect(amount).toHaveValue('.4');
    await page.getByRole('button',{name:'See my result',exact:true}).click();
    await expect(page.locator('#bac-result')).toContainText('0.08 mL');
  });
  await step('Changed volume recalculates and persisted inputs survive refresh', async () => {
    await page.getByRole('button',{name:'Edit numbers',exact:true}).click();
    await page.getByLabel('Final liquid volume (mL)', { exact: true }).fill('4');
    await page.getByRole('button',{name:'See my result',exact:true}).click();
    await expect(page.locator('#bac-result')).toContainText('2.5 mg/mL');
    await expect(page.locator('#bac-result')).toContainText('0.16 mL');
    await page.reload();
    await expect(page.getByLabel('Final liquid volume (mL)', { exact: true })).toHaveValue('4');
    await page.getByRole('button',{name:'See my result',exact:true}).click();
    await expect(page.locator('#bac-result')).toContainText('16 U-100 scale units');
  });
  await step('Unknown final volume stays empty and blocks results without suggesting preparation', async () => {
    await page.evaluate(() => { window.__holdConverterFrames = true; });
    await page.getByRole('button',{name:'Edit numbers',exact:true}).click();
    await expect(page.locator('#volume-inputs-heading')).toBeFocused();
    await page.getByLabel('Final liquid volume (mL)', { exact: true }).fill('');
    await page.evaluate(() => { window.__holdConverterFrames = false; window.__converterFrames.splice(0).forEach(callback => callback()); });
    await expect(page.getByLabel('Final liquid volume (mL)', { exact: true })).toBeFocused();
    await expect(page.locator('[data-water-suggestion]')).toHaveCount(0);
    await expect(page.getByLabel('Final liquid volume (mL)', { exact: true })).toHaveValue('');
    await expect(page.getByRole('button',{name:'See my result',exact:true})).toBeDisabled();
    await expect(page.locator('#bac-result')).not.toContainText('mg/mL');
    await page.getByLabel('Final liquid volume (mL)', { exact: true }).fill('4');
    await expect(page.locator('#bac-result')).toContainText('16 U-100 scale units');
  });
  await step('Invalid volume blocks the result and clear removes saved inputs', async () => {
    await page.getByLabel('Final liquid volume (mL)', { exact: true }).fill('-1');
    await expect(page.locator('#bac-input-error')).toHaveAttribute('role', 'alert');
    await expect(page.locator('#bac-input-error')).toContainText('greater than zero');
    await expect(page.locator('#bac-result')).not.toContainText('mg/mL');
    await page.getByRole('button', { name: 'Clear entered values' }).click();
    await expect(page.getByLabel('Total amount in the vial', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Final liquid volume (mL)', { exact: true })).toHaveValue('');
    await page.reload();
    await expect(page.getByLabel('Amount to measure', { exact: true })).toHaveValue('');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.deepEqual(errors, []);
  });
  await page.screenshot({ path: `${out}/bac-mobile-320.png`, fullPage: true });
  await step('Updated tools show their heading first without duplicate legacy wrappers', async () => {
    for (const slug of ['bac-water', 'syringe-units']) {
      await page.goto(`${origin}/tools/${slug}`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toHaveCount(1);
      const bounds = await heading.boundingBox();
      assert.ok(bounds && bounds.y >= 0 && bounds.y < 360, `${slug}: heading displaced by a legacy wrapper`);
      const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent || '{}')));
      assert.equal(schema.filter(value => value['@type'] === 'WebPage').length, 1, `${slug}: duplicate page schema`);
      const text = await page.locator('main').innerText();
      assert.equal(text.includes('Adding more is not a safety problem'), false);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: `${out}/${slug}-heading-320.png`, fullPage: false });
    }
    assert.deepEqual(errors, []);
  });
} catch (e) {
  await page.screenshot({ path: `${out}/failure.png`, fullPage: true }).catch(() => {});
  console.error(e); process.exitCode = 1;
} finally {
  await fs.writeFile(`${out}/results.json`, JSON.stringify({ environment: 'Chromium, 320 CSS pixels, localhost', results, errors }, null, 2));
  await browser.close();
}
