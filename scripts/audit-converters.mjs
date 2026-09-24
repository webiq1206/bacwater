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
  await step('BAC calculator starts blank without an assumed amount or schedule', async()=>{
    await expect(page.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('');
    await expect(page.locator('[data-amount-timing] input[type=radio]:checked')).toHaveCount(0);
    await expect(page.locator('[data-mass-result]')).not.toContainText('U-100 units each time');
  });
  await step('Known label values produce concentration and per-use measurement', async()=>{
    await page.getByLabel('Total amount in the vial',{exact:true}).fill('10');
    await page.getByLabel('Final liquid volume in mL',{exact:true}).fill('2');
    await page.getByRole('radio',{name:/^Each time/}).check();
    await page.getByLabel('Amount from your instructions',{exact:true}).fill('0.4');
    await expect(page.locator('[data-concentration]')).toContainText('5 mg/mL');
    await expect(page.locator('[data-mass-result]')).toContainText('0.08 mL');
    await expect(page.locator('[data-mass-result]')).toContainText('8 U-100 units');
  });
  await step('Changed volume recalculates and inputs survive refresh', async()=>{
    await page.getByLabel('Final liquid volume in mL',{exact:true}).fill('4');
    await expect(page.locator('[data-concentration]')).toContainText('2.5 mg/mL');
    await expect(page.locator('[data-mass-result]')).toContainText('0.16 mL');
    await page.reload();await expect(page.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('4');
    await expect(page.locator('[data-mass-result]')).toContainText('16 U-100 units');
  });
  await step('Timing changes weekly totals but not per-use volumes', async()=>{
    await page.getByRole('button',{name:'Once a day',exact:true}).click();
    await expect(page.locator('[data-mass-result]')).toContainText('0.16 mL');
    await expect(page.locator('[data-mass-result]')).toContainText('2.8 mg for the week');
    await page.getByRole('radio',{name:/^Whole week/}).check();
    await page.getByLabel('Amount from your instructions',{exact:true}).fill('2.8');
    await expect(page.locator('[data-mass-result]')).toContainText('0.16 mL');
  });
  await step('Invalid volume blocks stale results and clear stays blank after reload', async()=>{
    await page.getByLabel('Final liquid volume in mL',{exact:true}).fill('-1');
    await expect(page.getByRole('alert')).toContainText('Use positive numbers');
    await expect(page.locator('[data-mass-result]')).not.toContainText('0.16 mL');
    await page.getByRole('button',{name:'Clear inputs',exact:true}).click();
    await page.reload();await expect(page.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('');
    await expect(page.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
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
