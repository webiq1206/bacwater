import { chooseAuditMassProduct, openAuditOptional } from "./audit-flow-helpers.mjs";
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
   await chooseAuditMassProduct(p,p.locator('[data-hero-calculator]'));
   await p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true}).click();
   const hero=p.locator('[data-hero-focus]');
   await hero.getByLabel('Amount in vial',{exact:true}).fill('40');
   await hero.getByLabel('Final liquid volume',{exact:true}).fill('2');
   await expect(hero.locator('[data-live-result]')).toContainText('20 mg/mL');
   await hero.getByRole('button',{name:'Choose product',exact:true}).click();
   const picker=p.getByRole('dialog',{name:'Choose a product',exact:true});
   await picker.getByLabel('Find a product',{exact:true}).fill('Retatrutide');
   await picker.locator('[data-product-choice="glp-3"]').click();
   await expect(p).toHaveURL(origin+'/calculate/product/glp-3');
   await expect(p.getByLabel('Total in container (mg)',{exact:true})).toHaveValue('40');
   await expect(p.getByLabel('Final volume (mL)',{exact:true})).toHaveValue('2');
   await expect(p.locator('[data-product-result]')).toContainText('20 mg/mL');
   await expect(p.locator('[data-selected-product="glp-3"] [data-product-artwork]')).toBeVisible();
   await expect(p.getByRole('contentinfo')).toHaveCount(0);
  });
  await check('Frequency never silently divides a per-time amount',async()=>{
   await openAuditOptional(p,'Optional: amount and schedule');
   await p.getByLabel('Amount for one time',{exact:true}).fill('2');
   await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('2');
   await expect(p.locator('[data-product-result]')).toContainText('0.1 mL = 10 U-100');
   await expect(p.locator('[data-amount-schedule]')).toContainText('4 mg');
   await p.getByRole('radio',{name:/For the whole week/}).check();
   await expect(p.getByLabel('Total amount for one week',{exact:true})).toHaveValue('2');
   await expect(p.locator('[data-product-result]')).toContainText('0.05 mL = 5 U-100');
   await p.reload({waitUntil:'networkidle'});
   await expect(p.getByRole('radio',{name:/For the whole week/})).toBeChecked();
   await expect(p.getByLabel('How often do your instructions say?',{exact:true})).toHaveValue('2');
   await expect(p.locator('[data-product-result]')).toContainText('0.05 mL = 5 U-100');
   await p.screenshot({path:`${out}/${name}-schedule-mobile.png`,fullPage:false});
  });
  await check('Guided and all-at-once views inherit the same values and meaning',async()=>{
   await p.goto(origin+'/plan',{waitUntil:'networkidle'});
   await expect(p.getByRole('combobox',{name:'Product',exact:true})).toContainText('GLP-3 (RT)');
   await p.getByRole('button',{name:'Continue',exact:false}).click();
   await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('40');
   await p.getByRole('button',{name:'Continue',exact:false}).click();
   await expect(p.getByRole('heading',{name:'How much, and how often?',exact:true})).toBeVisible();
   await expect(p.getByLabel('Total amount for one week',{exact:true})).toHaveValue('2');
   await p.getByRole('button',{name:'All at once',exact:true}).click();
   await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');
   await expect(p.getByLabel('Total amount for one week',{exact:true})).toHaveValue('2');
   await p.reload({waitUntil:'networkidle'});
   await expect(p.getByRole('button',{name:'All at once',exact:true})).toHaveAttribute('aria-pressed','true');
  });
  await check('Unit conversion preserves mass and product switching preserves fields',async()=>{
   await p.getByLabel('Amount unit',{exact:true}).selectOption('mcg');
   await expect(p.getByLabel('Total amount for one week',{exact:true})).toHaveValue('2000');
   await p.getByRole('combobox',{name:'Product',exact:true}).click();
   await p.getByRole('option',{name:'BPC-157',exact:true}).click();
   await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('40');
   await expect(p.getByLabel('Total amount for one week',{exact:true})).toHaveValue('2000');
   await expect(p.getByText(/Your numbers came with you/)).toBeVisible();
  });
  await check('Daily totals and invalid schedules show the correct meaning',async()=>{
   await p.getByRole('radio',{name:/For the whole day/}).check();
   await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('14');
   await expect(p.locator('[data-amount-schedule]')).toContainText('1000 mcg');
   await p.getByLabel('How often do your instructions say?',{exact:true}).selectOption('2');
   await expect(p.locator('[data-amount-schedule]').getByRole('alert')).toContainText('daily schedule');
   await expect(p.getByRole('button',{name:'Save my plan',exact:true})).toBeDisabled();
  });
  await check('Incompatible product types do not reinterpret amounts',async()=>{
   await p.goto(origin+'/calculate/product/amino-h2o',{waitUntil:'networkidle'});
   await expect(p.getByLabel('Volume per bottle (mL)',{exact:true})).toHaveValue('');
   await expect(p.getByLabel('Liquid volume per container (mL)',{exact:true})).toHaveValue('');
   await p.goto(origin+'/calculate/hcg',{waitUntil:'networkidle'});
   await expect(p.getByLabel('Total in container (IU)',{exact:true})).toHaveValue('');
   await p.goto(origin,{waitUntil:'networkidle'});
   await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('40');
  });
  await check('Clear does not allow old values to return on refresh',async()=>{
   await p.getByRole('button',{name:'Open hero calculator full screen',exact:true}).click();
   await p.locator('[data-hero-focus]').getByRole('button',{name:'Clear',exact:true}).click();
   await p.reload({waitUntil:'networkidle'});
   await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');
   assert.deepEqual(errors,[]);
  });
 }catch(e){process.exitCode=1;await p.screenshot({path:`${out}/${name}-failure.png`,fullPage:true}).catch(()=>{});console.error(e);}
 finally{await browser.close();}
}
await fs.writeFile(`${out}/browser-results.json`,JSON.stringify({results,limitations:['Isolated test server only. No production database or external product requests.','Viewport and browser-engine testing is not physical-phone or medical validation.']},null,2));
