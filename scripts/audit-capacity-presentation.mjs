import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit, expect } from '@playwright/test';
import { chooseAuditMassProduct, nextQuestion, goQuestion, selectAuditOption } from './audit-flow-helpers.mjs';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/capacity-presentation';await fs.mkdir(out,{recursive:true});
const results=[];
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]) {
 const browser=await driver.launch();
 try { for(const viewport of [{width:390,height:844},{width:1440,height:900}]) {
  const c=await browser.newContext({viewport,reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
  await c.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__capacityCopy=text},configurable:true}));
  const p=await c.newPage();
  try {
   await p.goto(origin,{waitUntil:'networkidle'});
   const scope=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]');
   await chooseAuditMassProduct(p,scope);await nextQuestion(scope);
   await scope.getByLabel('Amount in vial',{exact:true}).fill('10');await nextQuestion(scope);
   await scope.getByLabel('Amount per portion',{exact:true}).fill('10');
   await selectAuditOption(p,scope,'Amount unit','mcg');
   await expect(scope.getByLabel('Amount per portion',{exact:true})).toHaveValue('10000');
   await nextQuestion(scope);
   for(const [volume,units,over] of [['0.99','99',false],['1','100',false],['1.01','101',true],['2','200',true]]) {
    await goQuestion(scope,'volume');await scope.getByLabel('Final liquid volume',{exact:true}).fill(volume);await nextQuestion(scope);
    const result=scope.locator('[data-live-result]'),warning=result.locator('[data-capacity-mismatch]');
    await expect(result).toContainText(`${units} units`);await expect(result).toContainText(`${volume} mL`);
    await expect(warning).toHaveCount(over?1:0);await expect(scope.locator('[data-syringe-visual]')).toHaveCount(over?0:1);
    if(over){await expect(warning).toContainText('1 mL capacity (100 U-100 units)');await expect(warning).toBeInViewport();
     assert.ok(await warning.evaluate(n=>n.getBoundingClientRect().bottom<=n.nextElementSibling.getBoundingClientRect().top+1));}
    assert.doesNotMatch(await scope.innerText(),/fill (?:your|the) syringe|use less water|add more water|use a bigger syringe/i);
   }
   await scope.getByRole('button',{name:'Copy result',exact:true}).click();
   assert.match(await p.evaluate(()=>window.__capacityCopy),/Selected scale cannot represent this volume/);
   await goQuestion(scope,'amount');await selectAuditOption(p,scope,'Amount unit','mg');
   await expect(scope.getByLabel('Amount per portion',{exact:true})).toHaveValue('10');
   await nextQuestion(scope);await nextQuestion(scope);await expect(scope.locator('[data-live-result]')).toContainText('200 units');
   const summary=scope.locator('summary').filter({hasText:'Using a '});await summary.click();
   await selectAuditOption(p,scope,'Syringe size and scale','1 mL tuberculin (mL scale)');
   await expect(scope.locator('[data-capacity-mismatch]')).toContainText('1 mL capacity');
   await expect(scope.locator('[data-live-result]')).toContainText('2 mL');
   await selectAuditOption(p,scope,'Syringe size and scale','3 mL syringe (mL scale)');
   await expect(scope.locator('[data-capacity-mismatch]')).toHaveCount(0);await expect(scope.locator('[data-syringe-visual]')).toHaveCount(1);
   await selectAuditOption(p,scope,'Syringe size and scale','1 mL insulin syringe (100 units)');
   await summary.click();await scope.locator('[data-step-scroll]').evaluate(n=>n.scrollTop=0);
   await expect(scope.locator('[data-capacity-mismatch]')).toBeInViewport();
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   await p.screenshot({path:`${out}/${engine}-${viewport.width}-over-capacity.png`});
   results.push({name:`Capacity boundary and unit toggles at ${viewport.width}x${viewport.height}`,engine,status:'passed'});
  }catch(e){results.push({name:`Capacity at ${viewport.width}`,engine,status:'failed',error:String(e)});process.exitCode=1;await p.screenshot({path:`${out}/${engine}-${viewport.width}-failure.png`}).catch(()=>{});}
  finally{await c.close();await fs.writeFile(out+'/results.json',JSON.stringify(results,null,2));}
 }}finally{await browser.close();}
}
console.log(JSON.stringify(results,null,2));
