import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, webkit, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000', 'Run only against the isolated test build.');
const out = 'audit-evidence/restored-hero';
await fs.mkdir(out, { recursive: true });
const require = createRequire(import.meta.url);
const axe = await fs.readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const results = [], errors = [];
async function check(name, run) {
  try { await run(); results.push({ name, status: 'passed' }); }
  catch (error) { results.push({ name, status: 'failed', error: String(error) }); throw error; }
}
for (const [engine, driver] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await driver.launch();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await context.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await check(`${engine}: restored composition keeps following content below the opening viewport`, async () => {
      for (const [width, height] of [[320,568], [375,667], [390,844], [430,932], [768,1024], [1024,768], [1440,900], [1920,1080]]) {
        await page.setViewportSize({ width, height });
        await page.goto(origin, { waitUntil: 'networkidle' });
        const hero = page.locator('[data-home-hero]');
        await expect(hero).toHaveAttribute('data-hero-design', 'editorial-restored');
        await expect(hero.getByRole('heading', { level: 1 })).toContainText('Your numbers.');
        await expect(hero.getByRole('heading', { level: 1 })).toContainText('BAC water calculator');
        await expect(hero.getByRole('region', { name: 'Calculator preview' })).toBeVisible();
        const bounds = await hero.boundingBox();
        const cta = await hero.getByRole('link', { name: 'Open calculator', exact: true }).boundingBox();
        const next = await page.locator('#toolkit').boundingBox();
        assert.ok(bounds && bounds.y + bounds.height >= height - 1, JSON.stringify({ width, height, bounds }));
        assert.ok(next && next.y >= height - 1, JSON.stringify({ width, height, next }));
        assert.ok(cta && cta.y >= 0 && cta.y + cta.height <= height, JSON.stringify({ width, height, cta }));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        // Preview values must not be mistaken for an editable homepage calculator.
        await expect(hero.locator('input,select,textarea,[role="tab"]')).toHaveCount(0);
        await expect(hero.getByText('Example numbers, not mixing instructions.', { exact: true })).toBeVisible();
        if (engine === 'chromium' && [320,390,1440].includes(width)) await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: false });
      }
    });
    await check(`${engine}: calculator links enter the existing focused workspaces`, async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      for (const [name, path] of [['Concentration','/tools/bac-water'], ['mg to mcg','/tools/mg-to-mcg'], ['U-100 to mL','/tools/syringe-units']]) {
        await page.goto(origin);
        const link = page.locator('[data-home-hero]').getByRole('link', { name, exact: true });
        await expect(link).toHaveAttribute('href', path);
        await link.click(); await expect(page).toHaveURL(origin + path);
        await expect(page.locator('[data-calculator-workspace]')).toBeVisible();
        await expect(page.locator('[data-supplier-shelf]')).toHaveCount(0);
        await expect(page.getByRole('contentinfo')).toHaveCount(0);
      }
      await page.goto(origin);
      await page.locator('[data-home-hero]').getByRole('link', { name: 'Open calculator', exact: true }).click();
      await expect(page).toHaveURL(origin + '/peptide-calculator');
      await expect(page.getByRole('combobox', { name: 'Compound', exact: true })).toBeVisible();
      await page.goBack(); await expect(page.locator('[data-home-hero]')).toBeVisible();
    });
    if (engine === 'chromium') {
      await check('Default and enlarged typography remain readable without horizontal page overflow', async () => {
        for (const width of [320,390,1440]) {
          await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
          await page.goto(origin);
          await page.evaluate(axe);
          const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
          assert.deepEqual(violations, []);
          await page.addStyleTag({ content: 'html{font-size:200%}p,a,dt,dd{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}' });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          const cta = page.locator('[data-home-hero]').getByRole('link', { name: 'Open calculator', exact: true });
          await cta.scrollIntoViewIfNeeded(); await expect(cta).toBeVisible();
        }
      });
    }
  } catch (error) {
    process.exitCode = 1;
    console.error(error);
    await page.screenshot({ path: `${out}/${engine}-failure.png`, fullPage: true }).catch(() => {});
  } finally { await browser.close(); }
}
if (errors.length) process.exitCode = 1;
await fs.writeFile(`${out}/results.json`, JSON.stringify({ results, errors, limitations: ['Tests use isolated fixture data and browser viewport emulation, not physical phones.', 'Enlarged text may extend the hero vertically; content is not clipped to force it into one screen.', 'Supplier catalog expansion and supplier-name cleanup are separate from this hero-only release.'] }, null, 2));
console.log(JSON.stringify(results));
