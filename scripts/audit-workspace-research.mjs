import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium, webkit, expect} from '@playwright/test';
import {goQuestion,nextQuestion} from './audit-flow-helpers.mjs';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Only use disposable local fixtures.');
const out='audit-evidence/workspace-research',results=[];
await fs.mkdir(out,{recursive:true});
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch();
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 try{
  for(const [width,height,enlarged] of [[320,568,false],[375,812,false],[390,844,false],[430,932,false],[768,1024,false],[844,390,false],[1024,768,false],[1440,900,false],[320,568,true]]){
   await page.setViewportSize({width,height});
   for(const route of ['/calculate/product/ahk-cu','/calculate/bpc-157']){
    await page.goto(origin+route);
    if(enlarged)await page.addStyleTag({content:'html{font-size:200%} p,label,input,button,a{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
    const product=route.startsWith('/calculate/product/');
    const openMass=async()=>{if(product){if(await page.locator('[data-guided-step]').getAttribute('data-guided-step')==='total-unit')await nextQuestion(page);await expect(page.locator('[data-guided-step]')).toHaveAttribute('data-guided-step','total');}else await goQuestion(page,'vial');};
    await openMass();
    const input=product?page.getByLabel('Total in container (mg)',{exact:true}):page.getByLabel('Amount in vial',{exact:true});
    await input.fill('10');
    // A real pointer click must succeed: no force, DOM click or hidden launcher.
    await page.getByRole('button',{name:'Clear',exact:true}).click();
    await openMass();
    await expect(input).toHaveValue('');
    await input.fill('12');
    const launcher=page.getByRole('button',{name:'Open research assistant',exact:true});
    await expect(launcher).toHaveCount(1);
    assert.equal(await launcher.evaluate(el=>getComputedStyle(el).position),'static');
    await launcher.click();
    await expect(page.getByRole('dialog',{name:'Research assistant',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog',{name:'Research assistant',exact:true})).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await expect(input).toHaveValue('12');
    await page.getByRole('button',{name:'Clear',exact:true}).click();
    await openMass();
    await expect(input).toHaveValue('');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    results.push({engine:engineName,route,width,height,enlarged,status:'passed'});
   }
  }
  assert.deepEqual(errors,[]);
 }catch(error){process.exitCode=1;results.push({engine:engineName,status:'failed',error:String(error)});console.error(error);await page.screenshot({path:`${out}/${engineName}-failure.png`,fullPage:false}).catch(()=>{});}
 finally{await browser.close();}
}
await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
