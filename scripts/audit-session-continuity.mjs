import { completeAuditHero, completeAuditProduct, editProductQuestion, goQuestion, nextQuestion, selectAuditOption } from "./audit-flow-helpers.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Only run against the isolated local test build.');
const out='audit-evidence/session-continuity';await fs.mkdir(out,{recursive:true});
const results=[];
for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch();
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
 await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));
 async function check(title,run){try{await run();results.push({engine:name,title,status:'passed'});}catch(e){results.push({engine:name,title,status:'failed',error:String(e)});throw e;}}
 try{
  await check('Homepage to product keeps 40 mg, 2 mL and 20 mg/mL',async()=>{
   await p.goto(origin,{waitUntil:'networkidle'});
   await p.getByRole('button',{name:'Open hero calculator full screen'}).click();
   const hero=p.locator('[data-hero-focus]');
   await completeAuditHero(p,hero,{vial:'40',amount:'2',volume:'2',review:true});
   await expect(hero.locator('[data-live-result]')).toContainText('0.1 mL');
   await expect(hero.locator('[data-live-result]')).toContainText('10 units on U-100 scale');
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});
   await expect(p).toHaveURL(origin+'/calculate/product/glp-3');
   await completeAuditProduct(p,{single:true});
   await expect(p.locator('[data-product-result]')).toContainText('20 mg/mL');
   await expect(p.locator('[data-selected-product="glp-3"] [data-product-artwork]')).toBeVisible();
   await expect(p.getByRole('contentinfo')).toHaveCount(0);
  });
  await check('Frequency preserves per-time amount; changing meaning requires a fresh total',async()=>{
   await editProductQuestion(p,'schedule');await selectAuditOption(p,p,'Schedule from your instructions','Twice a week');await nextQuestion(p);
   await expect(p.locator('[data-product-result]')).toContainText('0.1 mL = 10 U-100');
   await editProductQuestion(p,'basis');await p.getByRole('radio',{name:/^Whole week/}).check();await nextQuestion(p);await nextQuestion(p);
   await expect(p.getByLabel(/^Total amount for one week/)).toHaveValue('');await p.getByLabel(/^Total amount for one week/).fill('2');await nextQuestion(p);
   await expect(p.getByRole('button',{name:'Next',exact:true})).toBeDisabled();await selectAuditOption(p,p,'Schedule from your instructions','Twice a week');await nextQuestion(p);
   await expect(p.locator('[data-product-result]')).toContainText('0.05 mL = 5 U-100');await p.reload({waitUntil:'networkidle'});await expect(p.locator('[data-product-result]')).toContainText('0.05 mL = 5 U-100');
   await p.screenshot({path:`${out}/${name}-schedule-mobile.png`,fullPage:false});
  });
  await check('Guided and all-at-once views inherit the same values and meaning',async()=>{
   await p.goto(origin+'/plan',{waitUntil:'networkidle'});await goQuestion(p,'vial');await expect(p.getByLabel('Amount in vial',{exact:true})).toHaveValue('40');
   await goQuestion(p,'amount');await expect(p.getByLabel(/^Total amount for one week/)).toHaveValue('2');await goQuestion(p,'volume');await expect(p.getByLabel('Final liquid volume',{exact:true})).toHaveValue('2');
   await p.getByRole('button',{name:'All at once',exact:true}).click();await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');await expect(p.getByLabel(/^Total amount for one week/)).toHaveValue('2');await p.reload({waitUntil:'networkidle'});await expect(p.getByRole('button',{name:'All at once',exact:true})).toHaveAttribute('aria-pressed','true');
  });
  await check('Unit conversion preserves mass and product switching preserves fields',async()=>{
   await selectAuditOption(p,p,'Amount unit','mcg');
   await expect(p.getByLabel(/^Total amount for one week/)).toHaveValue('2000');
   await p.getByRole('combobox',{name:'Product',exact:true}).click();
   await p.getByRole('option',{name:'BPC-157',exact:true}).click();
   await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('40');
   await expect(p.getByLabel(/^Total amount for one week/)).toHaveValue('2000');
   await expect(p.getByText(/Your numbers came with you/)).toBeVisible();
  });
  await check('Daily totals and invalid schedules show the correct meaning',async()=>{
   await p.getByRole('radio',{name:/^Whole day/}).check();await p.getByLabel('Total amount for one day',{exact:true}).fill('2000');
   await selectAuditOption(p,p,'Schedule from your instructions','Twice a day');
   await expect(p.locator('[data-amount-schedule]')).toContainText('1000 mcg');
   await selectAuditOption(p,p,'Schedule from your instructions','Other number of times each week');await p.getByLabel('Times in a full week',{exact:true}).fill('2');
   await expect(p.locator('[data-amount-schedule]').getByRole('alert')).toContainText('daily schedule');
   await expect(p.getByRole('button',{name:'Save my plan',exact:true})).toBeDisabled();
  });
  await check('Incompatible product types do not reinterpret amounts',async()=>{
   await p.goto(origin+'/calculate/product/amino-h2o',{waitUntil:'networkidle'});await expect(p.getByLabel('Liquid volume per container (mL)',{exact:true})).toHaveValue('');
   await p.goto(origin+'/calculate/hcg',{waitUntil:'networkidle'});await expect(p.getByLabel('Total in container (IU)',{exact:true})).toHaveValue('');
   await p.goto(origin,{waitUntil:'networkidle'});const hero=p.locator('[data-hero-calculator]');await goQuestion(hero,'vial');await expect(hero.getByLabel('Amount in vial',{exact:true})).toHaveValue('40');
  });
  await check('Clear does not allow old values to return on refresh',async()=>{
   await p.getByRole('button',{name:'Open hero calculator full screen',exact:true}).click();await p.locator('[data-hero-focus]').getByRole('button',{name:'Clear',exact:true}).click();await p.reload({waitUntil:'networkidle'});const hero=p.locator('[data-hero-calculator]');await nextQuestion(hero);await nextQuestion(hero);await expect(hero.getByLabel('Amount in vial',{exact:true})).toHaveValue('');assert.deepEqual(errors,[]);
  });
  await check('Independent browser tabs retain their own edits through reload',async()=>{
   const first=await context.newPage(),second=await context.newPage();
   for(const tab of [first,second])tab.on('pageerror',e=>errors.push(String(e)));
   try{
    await first.goto(origin+'/calculate/product/bpc-157',{waitUntil:'networkidle'});
    await completeAuditProduct(first,{total:'40',volume:'2'});
    await second.goto(origin+'/calculate/product/bpc-157',{waitUntil:'networkidle'});await nextQuestion(second);await expect(second.getByLabel('Total in container (mg)',{exact:true})).toHaveValue('');await second.getByRole('button',{name:'Back',exact:true}).click();await completeAuditProduct(second,{total:'12',volume:'4'});
    for(const [tab,concentration] of [[first,'20 mg/mL'],[second,'3 mg/mL']]){await tab.reload({waitUntil:'networkidle'});await expect(tab.locator('[data-product-result]')).toContainText(concentration);}

   }finally{await first.close();await second.close();}
   assert.deepEqual(errors,[]);
  });
  await check('Blocked storage retains client navigation but not a hard reload',async()=>{
   const blocked=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   try{
    await blocked.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
    await blocked.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
    await blocked.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{configurable:true,get(){throw new DOMException('Blocked by audit','SecurityError');}}));
    const tab=await blocked.newPage();tab.on('pageerror',e=>errors.push(String(e)));
    await tab.goto(origin,{waitUntil:'networkidle'});
    await tab.getByRole('button',{name:'Open hero calculator full screen'}).click();
    const hero=tab.locator('[data-hero-focus]');
    await completeAuditHero(tab,hero,{vial:'40',amount:'2',volume:'2',review:true});
    await expect(hero.locator('[data-live-result]')).toContainText('0.1 mL');
    await tab.evaluate(()=>{window.__sessionAuditDocument='same-document';});
    await hero.getByRole('link',{name:'Guided workspace',exact:true}).click();
    await expect(tab).toHaveURL(origin+'/peptide-calculator');
    assert.equal(await tab.evaluate(()=>window.__sessionAuditDocument),'same-document','Use actual client navigation, not a replacement document');
    await tab.getByRole('button',{name:'All at once',exact:true}).click();
    await expect(tab.getByLabel('Vial strength',{exact:true})).toHaveValue('40');
    await expect(tab.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');
    await expect(tab.getByLabel('Amount for one time',{exact:true})).toHaveValue('2');
    await tab.reload({waitUntil:'networkidle'});
    assert.equal(await tab.evaluate(()=>window.__sessionAuditDocument),undefined);
    await tab.getByRole('button',{name:'All at once',exact:true}).click();
    await expect(tab.getByLabel('Vial strength',{exact:true})).toHaveValue('');
    await expect(tab.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('');
    assert.deepEqual(errors,[]);
   }finally{await blocked.close();}
  });
 }catch(e){process.exitCode=1;await p.screenshot({path:`${out}/${name}-failure.png`,fullPage:true}).catch(()=>{});console.error(e);}
 finally{await browser.close();}
}
await fs.writeFile(`${out}/browser-results.json`,JSON.stringify({results,limitations:['Isolated test server only. No production database or external product requests.','Viewport and browser-engine testing is not physical-phone or medical validation.']},null,2));
