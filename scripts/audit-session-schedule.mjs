import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit, expect } from '@playwright/test';

const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000', 'Run against the isolated test build only.');
const out = 'audit-evidence/session-schedule';
await fs.mkdir(out, { recursive: true });
const results = [], errors = [];

for (const [engine, driver] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await driver.launch();
  async function journey(name, viewport, run) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
    const page = await context.newPage();
    let closing = false;
    page.on('pageerror', error => { if (!closing) errors.push({ engine, name, error: String(error) }); });
    try {
      await page.goto(origin, { waitUntil: 'networkidle' });
      await run(page, context);
      await page.waitForLoadState('networkidle');
      results.push({ engine, name, status: 'passed' });
    } catch (error) {
      results.push({ engine, name, status: 'failed', error: String(error) });
      process.exitCode = 1;
      await page.screenshot({ path: `${out}/${engine}-${results.length}-failure.png`, fullPage: true }).catch(() => {});
    } finally { closing = true; await context.close(); }
  }
  try {
    for (const width of [390, 1440]) {
      await journey('Homepage to product to guided calculator retains exact entries and meaning', { width, height: 1000 }, async page => {
        let hero = page.locator('[data-hero-calculator]');
        if (width < 781) {
          await hero.getByLabel('Amount in vial', { exact: true }).click();
          hero = page.locator('[data-hero-focus]');
        }
        await hero.getByLabel('Amount in vial', { exact: true }).fill('40');
        await hero.getByLabel('Final liquid volume', { exact: true }).fill('2');
        await expect(hero.locator('[data-hero-result]')).toContainText('20 mg/mL');
        await hero.getByRole('button', { name: 'Choose product', exact: true }).click();
        const picker = page.getByRole('dialog', { name: 'Choose a product', exact: true });
        await picker.getByLabel('Find a product', { exact: true }).fill('retatrutide');
        await picker.locator('[data-product-choice="glp-3"]').click();
        await expect(page).toHaveURL(origin + '/calculate/product/glp-3');
        await expect(page.getByLabel('Total in container (mg)', { exact: true })).toHaveValue('40');
        await expect(page.getByLabel('Final volume (mL)', { exact: true })).toHaveValue('2');
        await expect(page.locator('[data-session-notice]')).toContainText('Your numbers were kept');
        await expect(page.locator('[data-supplier-shelf]')).toHaveCount(0);
        await expect(page.getByRole('contentinfo')).toHaveCount(0);

        const amount = page.locator('[data-amount-schedule]');
        await amount.getByLabel('Amount unit', { exact: true }).selectOption('mg');
        await amount.getByLabel('Amount for one time', { exact: true }).fill('4');
        await amount.getByRole('radio', { name: 'Twice a week', exact: true }).check();
        await expect(amount.getByRole('status')).toContainText('8 mg in one week');
        await expect(page.locator('.bac-result-card')).toContainText('0.2 mL = 20 U-100');
        await amount.getByRole('radio', { name: /Total for the week/ }).check();
        await expect(amount.getByLabel('Total amount for the whole week', { exact: true })).toHaveValue('4');
        await expect(amount.getByRole('status')).toContainText('2 mg each time');
        await expect(page.locator('.bac-result-card')).toContainText('0.1 mL = 10 U-100');
        await page.reload({ waitUntil: 'networkidle' });
        await expect(amount.getByLabel('Total amount for the whole week', { exact: true })).toHaveValue('4');
        await expect(amount.getByRole('radio', { name: 'Twice a week', exact: true })).toBeChecked();

        await page.goto(origin + '/peptide-calculator', { waitUntil: 'networkidle' });
        await page.getByRole('button', { name: 'Continue', exact: false }).click();
        await expect(page.getByLabel('Vial strength', { exact: true })).toHaveValue('40');
        await page.getByRole('button', { name: 'Continue', exact: false }).click();
        await expect(page.getByRole('heading', { name: 'How much each time, and how often?', exact: true })).toBeVisible();
        await expect(amount.getByLabel('Total amount for the whole week', { exact: true })).toHaveValue('4');
        await page.reload({ waitUntil: 'networkidle' });
        await expect(page.locator('[data-guided-step]')).toHaveAttribute('data-guided-step', '2');
        await expect(amount.getByLabel('Total amount for the whole week', { exact: true })).toHaveValue('4');
        await page.goto(origin, { waitUntil: 'networkidle' });
        await expect(page.locator('[data-hero-calculator] [data-hero-result]')).toContainText('2 mg each time');
        await expect(page.getByLabel('Amount in vial', { exact: true })).toHaveValue('40');
        await page.goBack({ waitUntil: 'networkidle' });
        await expect(amount.getByRole('radio', { name: 'Twice a week', exact: true })).toBeChecked();
        if (engine === 'chromium') await page.screenshot({ path: `${out}/schedule-${width}.png`, fullPage: false });
      });
    }
    await journey('Frequency cannot silently divide a per-time amount; invalid weekly schedules block results', { width: 390, height: 844 }, async page => {
      await page.goto(origin + '/calculate/product/glp-3', { waitUntil: 'networkidle' });
      await page.getByLabel('Total in container (mg)', { exact: true }).fill('40');
      await page.getByLabel('Final volume (mL)', { exact: true }).fill('2');
      const amount = page.locator('[data-amount-schedule]');
      await amount.getByLabel('Amount unit', { exact: true }).selectOption('mg');
      await amount.getByLabel('Amount for one time', { exact: true }).fill('4');
      for (const name of ['Once a week', 'Twice a week', 'Once a day', 'Twice a day']) {
        await amount.getByRole('radio', { name, exact: true }).check();
        await expect(page.locator('.bac-result-card')).toContainText('0.2 mL = 20 U-100');
      }
      await amount.getByRole('radio', { name: /Total for the week/ }).check();
      await amount.getByRole('radio', { name: 'Other schedule', exact: true }).check();
      await amount.getByLabel('Times per week', { exact: true }).fill('1.5');
      await expect(amount.getByRole('alert')).toContainText('whole number');
      await expect(page.getByRole('button', { name: 'Copy result', exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Clear inputs', exact: true }).click();
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page.getByLabel('Total in container (mg)', { exact: true })).toHaveValue('');
      await expect(amount.getByLabel('Amount for one time', { exact: true })).toHaveValue('');
      await expect(amount.getByRole('radio', { name: 'Twice a day', exact: true })).not.toBeChecked();
    });
    await journey('Converter, liquid-supply, blend and activity-unit records cannot overwrite the shared vial', { width: 1440, height: 1000 }, async page => {
      await page.getByLabel('Amount in vial', { exact: true }).fill('40');
      await page.getByLabel('Final liquid volume', { exact: true }).fill('2');
      await page.goto(origin + '/tools/mg-to-mcg', { waitUntil: 'networkidle' });
      await page.getByLabel('Milligrams (mg)', { exact: true }).fill('.125');
      await page.goto(origin, { waitUntil: 'networkidle' });
      await page.getByRole('tab', { name: 'mg to mcg', exact: true }).click();
      await expect(page.getByLabel('Amount in milligrams', { exact: true })).toHaveValue('.125');
      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await page.getByRole('tab', { name: 'BAC water', exact: true }).click();
      await expect(page.getByLabel('Amount in vial', { exact: true })).toHaveValue('40');
      for (const path of ['/calculate/product/amino-h2o', '/calculate/product/glow', '/calculate/product/ghkcu-spray', '/calculate/hcg']) {
        await page.goto(origin + path, { waitUntil: 'networkidle' });
        const inputs = page.locator('[data-calculator-scroll] input');
        assert.ok(await inputs.count() > 0, path);
        for (const input of await inputs.all()) await expect(input).toHaveValue('');
      }
      await page.goto(origin, { waitUntil: 'networkidle' });
      await expect(page.getByLabel('Amount in vial', { exact: true })).toHaveValue('40');
      await expect(page.getByLabel('Final liquid volume', { exact: true })).toHaveValue('2');
    });
  } finally { await browser.close(); }
}
if (errors.length) process.exitCode = 1;
await fs.writeFile(`${out}/results.json`, JSON.stringify({ results, errors, limitations: ['Isolated Next.js build and test fixtures only. No supplier, production database, or real-device action.', 'This suite is supplied for CI. Local offline component tests are reported separately, not substituted for this real-router suite.'] }, null, 2));
console.log(JSON.stringify({ results, errors }));
