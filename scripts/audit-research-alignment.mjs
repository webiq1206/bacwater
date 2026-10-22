import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit, expect } from '@playwright/test';
import { chooseAuditMassProduct, nextQuestion, goQuestion } from './audit-flow-helpers.mjs';
const origin = process.env.AUDIT_ORIGIN;
assert.equal(origin, 'http://127.0.0.1:3000');
const out='audit-evidence/research-alignment';await fs.mkdir(out,{recursive:true});
const results=[];
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await driver.launch();
 try { for(const width of [320,390,768,1440]) {
  const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];
  await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
  await c.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__copied=text},configurable:true}));
  const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));p.setDefaultTimeout(10000);
  try {
   await p.goto(origin,{waitUntil:'networkidle'});
   let scope=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]');
   await chooseAuditMassProduct(p,scope);await nextQuestion(scope);
   await scope.getByLabel('Amount in vial',{exact:true}).fill('10');await nextQuestion(scope);
   await scope.getByLabel('Amount per portion',{exact:true}).fill('0.4');await nextQuestion(scope);
   const volume=scope.getByLabel('Final liquid volume',{exact:true});
   await expect(volume).toHaveValue('');await expect(scope.locator('[data-water-suggestion]')).toHaveCount(0);
   await expect(scope.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
   for(const invalid of ['0','-1','2mL']) {await volume.fill(invalid);await expect(scope.getByRole('button',{name:'Next',exact:true})).toBeDisabled();await expect(scope.locator('[data-live-result]')).toHaveCount(0);}
   await volume.fill('2');await volume.focus();await p.keyboard.press('Tab');
   assert.equal(await p.evaluate(()=>document.activeElement===document.body),false);
   await nextQuestion(scope);await expect(scope.locator('[data-live-result]')).toContainText('0.08 mL');
   assert.doesNotMatch(await scope.innerText(),/fill your syringe|add this much bac water/i);
   await scope.getByRole('button',{name:'Copy result',exact:true}).click();
   const copied=await p.evaluate(()=>window.__copied);assert.match(copied,/10 mg ÷ 2 mL = 5 mg\/mL/);assert.match(copied,/not dosing or preparation advice/);assert.doesNotMatch(copied,/Add .*BAC water|fill the syringe/i);
   await goQuestion(scope,'volume');await volume.fill('4');await nextQuestion(scope);await expect(scope.locator('[data-live-result]')).toContainText('0.16 mL');
   await goQuestion(scope,'volume');await volume.fill('');await expect(volume).toHaveValue('');await expect(scope.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
   await volume.fill('2');
   if(width<=780){await p.setViewportSize({width,height:420});await volume.focus();await volume.scrollIntoViewIfNeeded();await expect(volume).toBeInViewport();await scope.getByRole('button',{name:'Next',exact:true}).scrollIntoViewIfNeeded();await expect(scope.getByRole('button',{name:'Next',exact:true})).toBeInViewport();await p.setViewportSize({width,height:900});}
   await nextQuestion(scope);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   await p.screenshot({path:`${out}/${engine}-${width}-result.png`});
   if(width<=780){await scope.getByRole('button',{name:'Return to homepage',exact:true}).click();await expect(p.getByRole('button',{name:'Open hero calculator full screen'})).toBeFocused();}
   await p.reload({waitUntil:'networkidle'});await expect(scope.locator('[data-live-result]')).toContainText('0.08 mL');
   await p.goto(origin+'/tools/bac-water');await expect(p.getByLabel('Final liquid volume (mL)',{exact:true})).toHaveValue('2');
   await p.getByRole('button',{name:'Clear entered values',exact:true}).click();await expect(p.getByLabel('Final liquid volume (mL)',{exact:true})).toHaveValue('');
   assert.deepEqual(errors,[]);results.push({engine,width,status:'passed',checks:'manual volume, invalid/blank gating, exact arithmetic, clipboard, volume changes, keyboard focus, reduced viewport, fullscreen return, refresh and cross-tool clear'});
  } catch(e){results.push({engine,width,status:'failed',error:String(e)});process.exitCode=1;await p.screenshot({path:`${out}/${engine}-${width}-failure.png`}).catch(()=>{});}
  finally{await c.close();await fs.writeFile(out+'/acceptance.json',JSON.stringify(results,null,2));}
 }}finally{await browser.close();}
}
console.log(JSON.stringify(results,null,2));
