import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 320, height: 844 } });
await context.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
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
  await step('Convert U-100 units to mL', async () => {
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('25');
    await expect(page.getByLabel('Milliliters (mL)', { exact: true })).toHaveValue('0.25');
  });
  await step('Convert mL to U-100 units and retain values on refresh', async () => {
    await page.getByLabel('Milliliters (mL)', { exact: true }).fill('0.08');
    await expect(page.getByLabel('U-100 syringe units', { exact: true })).toHaveValue('8');
    await page.reload();
    await expect(page.getByLabel('U-100 syringe units', { exact: true })).toHaveValue('8');
  });
  await step('Reject negative values without displaying a valid conversion', async () => {
    await page.getByLabel('U-100 syringe units', { exact: true }).fill('-1');
    await expect(page.locator('#u100-error')).toHaveAttribute('role', 'alert');
    await expect(page.locator('#u100-error')).toContainText('non-negative');
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
  await step('BAC calculator starts with known-volume mode and no assumed answer', async () => {
    await expect(page.getByRole('button', { name: 'Use a known volume' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Final liquid volume in mL', { exact: true })).toHaveValue('');
    await expect(page.locator('#bac-result')).toContainText('Enter both amounts');
  });
  await step('Known label values produce the expected concentration and measurement', async () => {
    await page.getByLabel('Total amount in the vial', { exact: true }).fill('10');
    await page.getByLabel('Amount to measure', { exact: true }).fill('0.4');
    await page.getByLabel('Final liquid volume in mL', { exact: true }).fill('2');
    await expect(page.locator('#bac-result')).toContainText('5 mg/mL');
    await expect(page.locator('#bac-result')).toContainText('0.08 mL');
    await expect(page.locator('#bac-result')).toContainText('8 U-100 units');
  });
  await step('Changed volume recalculates and persisted inputs survive refresh', async () => {
    await page.getByLabel('Final liquid volume in mL', { exact: true }).fill('4');
    await expect(page.locator('#bac-result')).toContainText('2.5 mg/mL');
    await expect(page.locator('#bac-result')).toContainText('0.16 mL');
    await page.reload();
    await expect(page.getByLabel('Final liquid volume in mL', { exact: true })).toHaveValue('4');
    await expect(page.locator('#bac-result')).toContainText('16 U-100 units');
  });
  await step('An explicit math example does not replace the entered volume', async () => {
    await page.getByRole('button', { name: 'Show a math example' }).click();
    await expect(page.getByRole('heading', { name: 'Illustrative result' })).toBeVisible();
    await expect(page.locator('#bac-result')).toContainText('2.5 mL');
    await expect(page.locator('#bac-result')).toContainText('10 U-100 units');
    await page.getByRole('button', { name: 'Use a known volume' }).click();
    await expect(page.getByLabel('Final liquid volume in mL', { exact: true })).toHaveValue('4');
    await expect(page.locator('#bac-result')).toContainText('16 U-100 units');
  });
  await step('Invalid volume blocks the result and clear removes saved inputs', async () => {
    await page.getByLabel('Final liquid volume in mL', { exact: true }).fill('-1');
    await expect(page.locator('#bac-input-error')).toHaveAttribute('role', 'alert');
    await expect(page.locator('#bac-input-error')).toContainText('greater than zero');
    await expect(page.locator('#bac-result')).not.toContainText('mg/mL');
    await page.getByRole('button', { name: 'Clear entered values' }).click();
    await expect(page.getByLabel('Total amount in the vial', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Final liquid volume in mL', { exact: true })).toHaveValue('');
    await page.reload();
    await expect(page.getByLabel('Amount to measure', { exact: true })).toHaveValue('');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    assert.deepEqual(errors, []);
  });
  await page.screenshot({ path: `${out}/bac-mobile-320.png`, fullPage: true });
} catch (e) {
  await page.screenshot({ path: `${out}/failure.png`, fullPage: true }).catch(() => {});
  console.error(e); process.exitCode = 1;
} finally {
  await fs.writeFile(`${out}/results.json`, JSON.stringify({ environment: 'Chromium, 320 CSS pixels, localhost', results, errors }, null, 2));
  await browser.close();
}
