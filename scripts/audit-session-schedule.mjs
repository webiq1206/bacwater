import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, webkit, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000', 'Only run against the disposable local test build.');
const out = 'audit-evidence/session-schedule';
await fs.mkdir(out, { recursive: true });
const axe = await fs.readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const results = [], errors = [];
async function check(name, run) { try { await run(); results.push({ name, status: 'passed' }); } catch (e) { results.push({ name, status: 'failed', error: String(e) }); process.exitCode = 1; } }
async function accessibility(p) {
  await p.evaluate(axe);
  const found = await p.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
  assert.deepEqual(found, []);
}
for (const [engine, driver] of [['chromium', chromium], ['webkit', webkit]]) {
 const b = await driver.launch();
 async function journey(width, height, run) {
  const c = await b.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await c.addCookies([{ name: 'bacwater_age_ok', value: '1', url: origin }]);
  await c.route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
  const p = await c.newPage(); let closing = false;
  p.on('pageerror', e => { if (!closing) errors.push({ engine, error: String(e) }); });
  try { await p.goto(origin, { waitUntil: 'networkidle' }); await run(p,c); await p.waitForLoadState('networkidle'); }
  catch (e) { await p.screenshot({ path: `${out}/${engine}-failure.png`, fullPage: true }).catch(()=>{}); throw e; }
  finally { closing=true; await c.close(); }
 }
 try {
  await check(`${engine}: homepage to product keeps raw vial amount and volume`, async () => journey(1440,1000,async p => {
   const hero = p.locator('[data-hero-calculator]');
   await hero.getByLabel('Amount in vial',{exact:true}).fill('40');
   await hero.getByLabel('Final liquid volume',{exact:true}).fill('2');
   await hero.getByRole('button',{name:'Choose product',exact:true}).click();
   const d = p.getByRole('dialog',{name:'Choose a product'});
   await d.getByRole('searchbox',{name:'Find a product'}).fill('Retatrutide');
   await d.locator('[data-product-choice="glp-3"]').click();
   await expect(p).toHaveURL(origin+'/calculate/product/glp-3');
   await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');
   await expect(p.getByLabel('Final liquid volume (mL)',{exact:true})).toHaveValue('2');
   await expect(p.getByRole('status').filter({hasText:'20 mg/mL'})).toBeVisible();
   await expect(p.getByLabel('Amount each time',{exact:true})).toHaveValue('');
   await p.getByLabel('Amount each time',{exact:true}).fill('0.4');
   await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('2');
   await expect(p.getByRole('status').filter({hasText:'Each time:'})).toContainText('0.02 mL');
   await expect(p.getByRole('status').filter({hasText:'Each time:'})).toContainText('0.8 mg total');
   await p.reload({waitUntil:'networkidle'}); await expect(p.getByLabel('Amount each time',{exact:true})).toHaveValue('0.4');
   await p.getByRole('button',{name:'Change product',exact:true}).click(); await p.locator('[data-product-choice="bpc-157"]').click();
   await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');
   await expect(p.getByLabel('How often do your instructions say?',{exact:true})).toHaveValue('2');
   await p.goBack({waitUntil:'networkidle'});await expect(p.getByLabel('Amount each time',{exact:true})).toHaveValue('0.4');
   await p.goto(origin,{waitUntil:'networkidle'});await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('40');
   await expect(p.locator('[data-hero-result]')).toContainText('0.02 mL');
  }));
  await check(`${engine}: mobile guided flow separates each time and whole week`, async () => journey(390,844,async p => {
   await p.goto(origin+'/peptide-calculator',{waitUntil:'networkidle'});
   await p.getByRole('combobox',{name:'Product',exact:true}).click();await p.getByLabel('Search products',{exact:true}).fill('bpc');await p.getByRole('option',{name:'BPC-157',exact:true}).click();
   await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByLabel('Vial strength',{exact:true}).fill('40');await p.getByRole('button',{name:'Continue',exact:false}).click();
   await expect(p.getByRole('heading',{name:'How much each time?',exact:true})).toBeVisible();
   const firstAmount=await p.getByLabel('Amount each time',{exact:true}).boundingBox();assert.ok(firstAmount&&firstAmount.y+firstAmount.height<770,'The amount field must appear before the mobile action dock.');
   await p.getByLabel('Amount each time',{exact:true}).fill('0.4');await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('7');
   await expect(p.locator('[data-amount-schedule] [role="status"]').first()).toContainText('2.8 mg per week');
   await p.getByRole('radio',{name:/Whole week/}).check();
   await expect(p.getByLabel('Total amount for the whole week',{exact:true})).toHaveValue('2.8');
   await p.getByLabel('Total amount for the whole week',{exact:true}).fill('1.4');
   await expect(p.locator('[data-amount-schedule] [role="status"]').first()).toContainText('0.2 mg each time');
   await p.getByRole('button',{name:'mcg',exact:true}).click();
   await expect(p.getByLabel('Total amount for the whole week',{exact:true})).toHaveValue('1400');
   await p.reload({waitUntil:'networkidle'});await expect(p.getByLabel('Total amount for the whole week',{exact:true})).toHaveValue('1400');
   await accessibility(p);await p.screenshot({path:`${out}/${engine}-amount-schedule-mobile.png`,fullPage:false});
   await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByLabel('Final liquid volume in mL',{exact:true}).fill('2');await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByRole('button',{name:'Continue',exact:false}).click();
   await expect(p.getByRole('heading',{name:'Here are your numbers.',exact:true})).toBeVisible();
   assert.match(await p.locator('[data-calculator-scroll]').innerText(),/0\.010 mL/);
   await expect(p.getByRole('button',{name:'Save my plan',exact:true})).toBeEnabled();
  }));
  await check(`${engine}: custom schedules require a count and never silently become one amount`,async()=>journey(390,844,async p=>{
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});
   await p.getByLabel('Total amount in the vial',{exact:true}).fill('40');await p.getByLabel('Final liquid volume (mL)',{exact:true}).fill('2');
   await p.getByLabel('Amount each time',{exact:true}).fill('0.4');await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('custom');
   await expect(p.locator('[data-amount-schedule]').getByRole('alert')).toContainText('whole number');await expect(p.getByRole('button',{name:'Copy result',exact:true})).toHaveCount(0);
   await p.reload({waitUntil:'networkidle'});await expect(p.getByLabel('Times per week',{exact:true})).toHaveValue('');
   await p.getByLabel('Times per week',{exact:true}).fill('4');await expect(p.locator('[data-amount-schedule] [role="status"]').first()).toContainText('1.6 mg per week');
   await p.getByLabel('Times per week',{exact:true}).fill('');await expect(p.locator('[data-amount-schedule]').getByRole('alert')).toContainText('whole number');
   await p.getByLabel('Times per week',{exact:true}).fill('29');await expect(p.locator('[data-amount-schedule]').getByRole('alert')).toContainText('1 to 28');
   await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('');await expect(p.getByLabel('Amount each time',{exact:true})).toHaveValue('0.4');
   await expect(p.getByRole('button',{name:'Copy result',exact:true})).toBeVisible();
  }));
  await check(`${engine}: incompatible product types and IU keep separate drafts`,async()=>journey(390,844,async p=>{
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});await p.getByLabel('Total amount in the vial',{exact:true}).fill('40');await p.getByLabel('Final liquid volume (mL)',{exact:true}).fill('2');
   await p.goto(origin+'/calculate/hcg',{waitUntil:'networkidle'});await expect(p.getByLabel('Total in container (IU)',{exact:true})).toHaveValue('');await p.getByLabel('Total in container (IU)',{exact:true}).fill('1000');
   await p.goto(origin+'/calculate/product/glow',{waitUntil:'networkidle'});await expect(p.getByLabel('Ingredient 1 amount (mg)',{exact:true})).toHaveValue('');await expect(p.getByLabel('Final volume (mL)',{exact:true})).toHaveValue('');
   await p.goto(origin+'/calculate/product/nad-plus-spray',{waitUntil:'networkidle'});await expect(p.getByLabel('Label concentration (mg/mL)',{exact:true})).toHaveValue('');await p.getByLabel('Label concentration (mg/mL)',{exact:true}).fill('25');
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');
   await p.goto(origin+'/calculate/product/nad-plus-spray',{waitUntil:'networkidle'});await expect(p.getByLabel('Label concentration (mg/mL)',{exact:true})).toHaveValue('25');
   await p.goto(origin+'/calculate/hcg',{waitUntil:'networkidle'});await expect(p.getByLabel('Total in container (IU)',{exact:true})).toHaveValue('1000');
  }));
  await check(`${engine}: Clear resets connected fields and does not restore obsolete drafts`,async()=>journey(390,844,async p=>{
   await p.goto(origin+'/calculate/product/bpc-157',{waitUntil:'networkidle'});await p.getByLabel('Total amount in the vial',{exact:true}).fill('20');await p.getByLabel('Final liquid volume (mL)',{exact:true}).fill('2');
   await p.evaluate(()=>localStorage.setItem('bacwater.planDraft',JSON.stringify({vialInput:999,doseInput:999,peptideSlug:'bpc-157'})));
   await p.getByRole('button',{name:'Clear inputs',exact:true}).click();
   await p.goto(origin,{waitUntil:'networkidle'});await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');
   await p.goto(origin+'/peptide-calculator',{waitUntil:'networkidle'});await expect(p.getByRole('heading',{name:'What is the name on your vial?',exact:true})).toBeVisible();
   await p.reload({waitUntil:'networkidle'});await expect(p.getByRole('button',{name:'Continue',exact:false})).toBeDisabled();
  }));
  await check(`${engine}: utilities reuse only matching quantities and converters share their own entries`,async()=>journey(1440,1000,async p=>{
   const hero=p.locator('[data-hero-calculator]');await hero.getByLabel('Amount in vial',{exact:true}).fill('40');await hero.getByLabel('Final liquid volume',{exact:true}).fill('2');
   await hero.getByText('Amount each time & schedule',{exact:true}).click();await hero.getByLabel('Amount each time',{exact:true}).fill('0.4');
   await p.goto(origin+'/tools/supplies',{waitUntil:'networkidle'});await expect(p.getByLabel('Mass per vial (mg)',{exact:true})).toHaveValue('40');await expect(p.getByLabel('Amount each time (mcg)',{exact:true})).toHaveValue('400');
   await p.goto(origin+'/tools/dose',{waitUntil:'networkidle'});await expect(p.getByLabel('Known concentration (mg/mL)',{exact:true})).toHaveValue('20');
   await p.goto(origin+'/tools/reverse-bac',{waitUntil:'networkidle'});await p.getByLabel('Amount each time (mcg)',{exact:true}).fill('');await p.getByLabel('Amount each time (mcg)',{exact:true}).pressSequentially('0.125');await expect(p.getByLabel('Amount each time (mcg)',{exact:true})).toHaveValue('0.125');
   await p.goto(origin+'/tools/mg-to-mcg',{waitUntil:'networkidle'});await p.getByLabel('Milligrams (mg)',{exact:true}).fill('0.125');
   await p.goto(origin,{waitUntil:'networkidle'});await p.locator('[data-hero-calculator]').getByRole('tab',{name:'mg to mcg',exact:true}).click();await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in milligrams',{exact:true})).toHaveValue('0.125');
  }));
  if(engine==='chromium') {
   await check('Enlarged narrow screens preserve labels and buttons',async()=>journey(320,568,async p=>{
    await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});await p.addStyleTag({content:'html{font-size:200%}p,label,button,input,a,select{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await p.getByLabel('Amount each time',{exact:true}).scrollIntoViewIfNeeded();await p.getByLabel('Amount each time',{exact:true}).fill('0.4');
    await expect(p.getByRole('button',{name:'Clear inputs',exact:true})).toBeVisible();await accessibility(p);
   }));
   await check('Independent browser tabs do not overwrite each other',async()=>journey(1440,1000,async(p,c)=>{
    await p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true}).fill('40');
    const q=await c.newPage();await q.goto(origin,{waitUntil:'networkidle'});await expect(q.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');await q.close();
   }));
   await check('Unavailable storage does not prevent same-page or app-navigation calculations',async()=>journey(1440,1000,async p=>{
    await p.evaluate(()=>Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('blocked','SecurityError')},configurable:true}));
    const hero=p.locator('[data-hero-calculator]');await hero.getByLabel('Amount in vial',{exact:true}).fill('40');await hero.getByLabel('Final liquid volume',{exact:true}).fill('2');
    await hero.getByRole('button',{name:'Choose product',exact:true}).click();await p.locator('[data-product-choice="glp-3"]').click();await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');
   }));
  }
 } finally { await b.close(); }
}
if(errors.length)process.exitCode=1;
await fs.writeFile(`${out}/results.json`,JSON.stringify({results,errors,limitations:['Browser-engine emulation and disposable test records only; not physical-phone keyboard or screen-reader certification.','Session storage is tab-local. Browser-restored sessions can survive tab restoration. If storage is blocked, a hard reload cannot retain memory-only state.','No amount, schedule, product suitability or mixing method is recommended.']},null,2));
console.log(JSON.stringify({results,errors}));
