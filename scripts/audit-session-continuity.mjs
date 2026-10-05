import { completeAuditHero, openAuditOptional } from "./audit-flow-helpers.mjs";
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
   await completeAuditHero(p,hero,{vial:'40',amount:'2',volume:'2',review:false});
   await expect(hero.locator('[data-live-result]')).toContainText('0.1 mL');
   await expect(hero.locator('[data-live-result]')).toContainText('10 units on U-100 scale');
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});
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
   await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');
   await p.getByLabel('Go back',{exact:true}).click();
   await p.getByLabel('Go back',{exact:true}).click();
   await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('40');
   await p.getByLabel('Go back',{exact:true}).click();
   await expect(p.getByRole('combobox',{name:'Product',exact:true})).toContainText('GLP-3 (RT)');
   await p.getByRole('button',{name:'Continue',exact:false}).click();
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
   await expect(p.locator('[data-hero-calculator] [data-hero-guided]')).toHaveAttribute('data-guided-step','2');
   await p.locator('[data-hero-calculator]').getByRole('button',{name:'Back',exact:true}).click();
   await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('40');
  });
  await check('Clear does not allow old values to return on refresh',async()=>{
   await p.getByRole('button',{name:'Open hero calculator full screen',exact:true}).click();
   await p.locator('[data-hero-focus]').getByRole('button',{name:'Clear',exact:true}).click();
   await p.reload({waitUntil:'networkidle'});
   await p.locator('[data-hero-calculator]').getByRole('button',{name:'Continue',exact:true}).click();
   await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');
   assert.deepEqual(errors,[]);
  });
  await check('Independent browser tabs retain their own edits through reload',async()=>{
   const first=await context.newPage(),second=await context.newPage();
   for(const tab of [first,second])tab.on('pageerror',e=>errors.push(String(e)));
   try{
    await first.goto(origin+'/calculate/product/bpc-157',{waitUntil:'networkidle'});
    await first.getByLabel('Total in container (mg)',{exact:true}).fill('40');
    await first.getByLabel('Final volume (mL)',{exact:true}).fill('2');
    await second.goto(origin+'/calculate/product/bpc-157',{waitUntil:'networkidle'});
    await expect(second.getByLabel('Total in container (mg)',{exact:true})).toHaveValue('');
    await second.getByLabel('Total in container (mg)',{exact:true}).fill('12');
    await second.getByLabel('Final volume (mL)',{exact:true}).fill('4');
    await expect(first.getByLabel('Total in container (mg)',{exact:true})).toHaveValue('40');
    for(const [tab,amount,volume] of [[first,'40','2'],[second,'12','4']]){
     await tab.reload({waitUntil:'networkidle'});
     await expect(tab.getByLabel('Total in container (mg)',{exact:true})).toHaveValue(amount);
     await expect(tab.getByLabel('Final volume (mL)',{exact:true})).toHaveValue(volume);
    }
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
    await completeAuditHero(tab,hero,{vial:'40',amount:'2',volume:'2',review:false});
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
