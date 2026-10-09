import { chooseAuditMassProduct, completeAuditHero, openAuditOptional, goQuestion, nextQuestion, selectAuditOption } from "./audit-flow-helpers.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, webkit, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Use only the isolated test build.');
const out='audit-evidence/live-hero';await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const results=[],errors=[],teardownErrors=[];
async function check(name,run){try{await run();results.push({name,status:'passed'});}catch(error){results.push({name,status:'failed',error:String(error)});process.exitCode=1;}}
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await driver.launch();
 async function journey(width,height,run){
  const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
  await c.addInitScript(()=>{window.__copied='';Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}},configurable:true});});
  const p=await c.newPage();let closing=false;
  p.on('pageerror',e=>(closing?teardownErrors:errors).push({engine,error:String(e)}));
  try{await p.goto(origin,{waitUntil:'networkidle'});await run(p,c);await p.waitForLoadState('networkidle');}
  catch(e){await p.screenshot({path:`${out}/${engine}-${width}-failure.png`,fullPage:true}).catch(()=>{});throw e;}
  finally{closing=true;await c.close();}
 }
 try{
  await check(`${engine}: full, balanced hero and usable calculator above the fold at eight widths`,async()=>{
   const layoutFailures=[];
   for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[768,1024],[1024,768],[1440,900],[1920,1080]])try{await journey(width,height,async p=>{
    const hero=p.locator('[data-home-hero]');await expect(hero).toHaveAttribute('data-hero-design','editorial-live');
    const h=await hero.boundingBox(),next=await p.locator('#toolkit').boundingBox(),cta=await hero.locator('[data-hero-calculator]').boundingBox();
    assert.ok(h&&h.y+h.height>=height-1,JSON.stringify({width,height,h}));assert.ok(next&&next.y>=height-1);
    assert.ok(cta&&cta.y>=0&&cta.y+cta.height<=height,JSON.stringify({width,height,cta}));
    if(width>=1440)assert.ok(cta.width>=640&&cta.height>=550,JSON.stringify({width,height,cta}));
    if(width<=780)assert.ok(height-(cta.y+cta.height)<=130,JSON.stringify({width,height,cta,issue:'Unused lower hero space'}));
    const body=await hero.locator('[data-step-scroll]').evaluate(el=>({available:el.clientHeight,content:el.scrollHeight}));
    assert.ok(body.content<=body.available+2,JSON.stringify({width,height,body,issue:'Initial step should not need an inner scroll'}));
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await expect(p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]').getByRole('combobox',{name:'Product',exact:true})).toBeVisible();
    await expect(p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]').getByLabel('Amount in vial',{exact:true})).toHaveCount(0);
    await p.screenshot({path:`${out}/${engine}-home-${width}.png`,fullPage:false});
   });}catch(error){layoutFailures.push({width,height,error:String(error)});}
   assert.deepEqual(layoutFailures,[]);
  });
  await check(`${engine}: product-first steps, unit conversion, review, editing, validation and copy`,async()=>journey(1440,1000,async p=>{
   const calc=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]'),result=calc.locator('[data-live-result]');
   await expect(calc.getByRole('button',{name:'Next',exact:true})).toBeDisabled();await expect(result).toHaveCount(0);
   await completeAuditHero(p,calc);await expect(calc.locator('[data-syringe-visual]')).toBeVisible();await expect(result).toContainText('0.1 mL');await expect(calc.getByRole('button',{name:'Save my plan',exact:true})).toBeEnabled();
   await openAuditOptional(calc,'Review or change answers');await calc.getByLabel('Edit final liquid volume',{exact:true}).click();await expect(calc.locator('[data-guided-heading]')).toBeFocused();
   await calc.getByLabel('Total liquid after mixing',{exact:true}).fill('0');await expect(calc.getByRole('alert')).toContainText('greater than zero');await expect(result).toHaveCount(0);await expect(calc.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
   await calc.getByLabel('Total liquid after mixing',{exact:true}).fill('6');await nextQuestion(calc);await nextQuestion(calc);await nextQuestion(calc);await expect(result).toContainText('0.15 mL');await expect(result).toContainText('15 units');await calc.getByRole('button',{name:'Copy result',exact:true}).click();assert.match(await p.evaluate(()=>window.__copied),/0\.15 mL/);
   await goQuestion(calc,'amount');await selectAuditOption(p,calc,'Amount unit','mcg');await expect(calc.getByLabel(/^Amount to measure/)).toHaveValue('300');await calc.getByLabel(/^Amount to measure/).fill('-1');await expect(calc.getByRole('button',{name:'Next',exact:true})).toBeDisabled();await expect(result).toHaveCount(0);
   await calc.getByRole('button',{name:'Clear',exact:true}).click();await expect(calc.getByRole('combobox',{name:'Product',exact:true})).toContainText('BPC-157');await nextQuestion(calc);await expect(calc.getByLabel('Amount in vial',{exact:true})).toHaveValue('');await expect(calc.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
  }));
  await check(`${engine}: homepage review saves through the shared plan action`,async()=>journey(1440,1000,async p=>{
   const calc=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]');
   await completeAuditHero(p,calc);
   await openAuditOptional(calc,'Plan name:');
   await calc.getByLabel('Plan name',{exact:true}).fill('Hero acceptance calculation');
   await calc.getByRole('button',{name:'Save my plan',exact:true}).click();
   const saved=p.getByRole('dialog',{name:'Plan saved',exact:true});await expect(saved).toBeVisible();
   await expect(saved.locator('a[href$="/pdf"]')).toHaveAttribute('href',/^\/plan\/[^/]+\/pdf$/);
  }));
  await check(`${engine}: homepage offers only the guided BAC water calculator`,async()=>journey(390,844,async p=>{
   const calc=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]');
   await expect(calc.getByRole('tab')).toHaveCount(0);
   await expect(calc.getByRole('combobox',{name:'Product',exact:true})).toBeVisible();
  }));
  await check(`${engine}: mobile inline steps and full-screen state survive close, converters and refresh`,async()=>journey(390,844,async p=>{
   const inline=p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]'),focus=p.locator('[data-hero-focus]');await completeAuditHero(p,inline,{review:false});
   await expect(focus).toBeVisible();await expect(p.locator('[data-hero-guided]')).toHaveCount(1);await expect(focus.getByLabel('Amount to measure',{exact:true})).toHaveValue('0.3');await nextQuestion(focus);await nextQuestion(focus);await expect(focus.locator('[data-live-result]')).toContainText('0.1 mL');
   await openAuditOptional(focus,'Plan name:');await focus.getByLabel('Plan name',{exact:true}).fill('My label calculation');await expect(focus.locator('[data-selected-product-link]')).toHaveCount(0);const r=await focus.boundingBox();assert.ok(r&&r.x>=0&&r.y>=0&&r.y+r.height<=846);await p.screenshot({path:`${out}/${engine}-mobile-focus.png`});
   await focus.getByRole('button',{name:'Return to homepage',exact:true}).click();await expect(focus).toHaveCount(0);await expect(p.getByRole('button',{name:'Open hero calculator full screen'})).toBeFocused();await openAuditOptional(inline,'Plan name:');await expect(inline.getByLabel('Plan name',{exact:true})).toHaveValue('My label calculation');await expect(inline.locator('[data-live-result]')).toContainText('0.1 mL');await p.reload({waitUntil:'networkidle'});await openAuditOptional(inline,'Plan name:');await expect(inline.getByLabel('Plan name',{exact:true})).toHaveValue('My label calculation');
   await p.getByRole('button',{name:'Open hero calculator full screen'}).click();await p.setViewportSize({width:390,height:420});await expect.poll(()=>focus.evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(404);const back=focus.getByRole('button',{name:'Return to homepage',exact:true});await expect(back).toBeInViewport();await back.click();
  }));
  await check(`${engine}: product-first routes retain product-specific blend, solution, water and IU tools`,async()=>{
   for(const [name,path] of [['GLOW','/calculate/product/glow'],['KLOW','/calculate/product/klow'],['CJC-1295 / Ipamorelin (No DAC)','/calculate/product/cjc-ipa-no-dac'],['BPC-157/TB-500 (Wolverine)','/calculate/product/wolverine-stack'],['BPC-157/TB-500 Spray (Wolverine)','/calculate/product/bpc-tb-spray'],['BAC Water','/calculate/product/amino-h2o'],['HCG (Research)','/calculate/hcg']])await journey(390,844,async p=>{
    await p.locator('[data-hero-calculator]:has([data-hero-guided]), [data-hero-focus]').getByRole('combobox',{name:'Product',exact:true}).click();
    const picker=p.getByRole('dialog',{name:'Choose your product',exact:true});await picker.getByRole('searchbox',{name:'Search products',exact:true}).fill(name);
    await picker.getByRole('option',{name,exact:true}).click();await expect(p).toHaveURL(origin+path);await expect(p.locator('[data-calculator-workspace]')).toBeVisible();
    if(['glow','klow','cjc-ipa-no-dac','wolverine-stack'].includes(path.split('/').pop()))await expect(p.getByRole('combobox',{name:'Blend calculation',exact:true})).toBeVisible();
   });
  });
  await check(`${engine}: focused hero has one product selector and readable unit help`,async()=>journey(390,844,async p=>{
   const focus=p.locator('[data-hero-focus]');
   await expect(focus.getByRole('button',{name:/^(Choose|Change) product$/})).toHaveCount(0);
   await chooseAuditMassProduct(p,focus);
   await expect(focus.getByRole('combobox',{name:'Product',exact:true})).toContainText('BPC-157');
   await focus.getByRole('button',{name:'What do these units mean?',exact:true}).click();
   const help=p.getByRole('dialog',{name:'Units, explained simply'});await expect(help).toBeVisible();
   await expect(help.getByRole('heading',{name:'Units, explained simply'})).toBeFocused();
   const box=await help.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=390&&box.y+box.height<=844);
   await p.screenshot({path:`${out}/${engine}-unit-help-mobile.png`,fullPage:false});
   await expect(help).toContainText('5 mg/mL means each 1 mL holds 5 mg.');
   await help.getByRole('button',{name:'Got it, go back',exact:true}).click();
   await expect(help,'Help closes after its return button').toHaveCount(0);await expect(focus).toBeVisible();
   await expect(focus.getByRole('button',{name:'What do these units mean?',exact:true})).toBeFocused();
   for(let reopen=0;reopen<3;reopen++) {
    await focus.getByRole('button',{name:'What do these units mean?',exact:true}).click();
    // Click completion does not guarantee the nested dialog has mounted and taken focus.
    await expect(help).toBeVisible();
    await expect(help.getByRole('heading',{name:'Units, explained simply'})).toBeFocused();
    if(reopen===1)await help.getByRole('button',{name:'Got it, go back',exact:true}).focus();
    if(reopen===2)await help.getByRole('region',{name:'Unit definitions and examples',exact:true}).focus();
    await p.keyboard.press('Escape');await expect(help,`Help closes after Escape in reopen cycle ${reopen+1}`).toHaveCount(0);await expect(focus).toBeVisible();
    await expect(focus.getByRole('button',{name:'What do these units mean?',exact:true})).toBeFocused();
   }
   await p.keyboard.press('Escape');await expect(focus).toHaveCount(0);
   await expect(p.getByRole('button',{name:'Open hero calculator full screen'})).toBeFocused();
  }));
  await check(`${engine}: priority calculators expose reference content without opening Help`,async()=>{
   for(const width of [320,390,768,1440])for(const [path,heading] of [['/tools/syringe-units','U-100 conversion examples'],['/tools/mg-to-mcg','Check the relationship'],['/tools/bac-water','How the volume changes concentration']])await journey(width,900,async p=>{
    await p.goto(origin+path,{waitUntil:'networkidle'});
    const reference=p.locator('[data-calculator-reference]');
    await expect(reference.getByRole('heading',{name:heading,exact:true})).toBeVisible();
    assert.equal(await reference.evaluate(el=>Boolean(el.closest('details'))),false);
    await expect(p.getByLabel('Open calculator help',{exact:true})).toBeVisible();
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(path==='/tools/syringe-units'){
     await p.getByLabel('U-100 syringe units',{exact:true}).fill('25');await expect(p.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('0.25');
     await expect(reference.getByRole('heading',{name:'Can you convert mg directly to syringe units?',exact:true})).toBeVisible();
    }
    await reference.getByRole('heading',{name:heading,exact:true}).scrollIntoViewIfNeeded();
    if(engine==='chromium'&&[390,1440].includes(width))await p.screenshot({path:`${out}/reference-${path.split('/').pop()}-${width}.png`});
   });
  });
  if(engine==='chromium')await check('SEO metadata, visible primary heading and reflow are consistent',async()=>{
   for(const width of [320,390,1440])await journey(width,900,async p=>{
    await expect(p).toHaveTitle('BAC Water Calculator | Peptide Reconstitution | BACwater.ai');await expect(p.locator('h1')).toHaveCount(1);await expect(p.locator('h1')).toContainText('BAC water');await expect(p.locator('h1')).toContainText('calculator.');
    await expect(p.locator('meta[property="og:title"]')).toHaveAttribute('content',await p.title());await expect(p.locator('meta[name="twitter:title"]')).toHaveAttribute('content',await p.title());
    await expect(p.locator('link[rel="canonical"]')).toHaveAttribute('href',/^http:\/\/127\.0\.0\.1:3000\/?$/);
    const data=await p.locator('script[type="application/ld+json"]').allTextContents();assert.ok(data.some(s=>JSON.parse(s)['@type']==='SoftwareApplication'));await expect(p.getByRole('heading',{name:'How this peptide reconstitution calculator works'})).toBeVisible();
    await p.evaluate(axe);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
    await p.addStyleTag({content:'html{font-size:200%}p,label,input,button,a,summary{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    const focus=p.locator('[data-hero-focus]');await completeAuditHero(p,focus);await expect(focus.locator('[data-live-result]')).toContainText('3 mg/mL');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await p.evaluate(axe);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
    await focus.getByRole('button',{name:'Back to homepage',exact:true}).click();
   });
  });
 }finally{await browser.close();}
}
if(errors.length)process.exitCode=1;
await fs.writeFile(`${out}/results.json`,JSON.stringify({results,errors,teardownErrors,limitations:['Isolated localhost fixtures, not a live deployment.','Chromium/WebKit viewport emulation, not physical phone keyboard or screen-reader certification.','Enlarged text may extend the hero vertically to keep controls usable.','No supplier purchase, account registration, product inventory or conversion attribution is tested.']},null,2));
console.log(JSON.stringify({results,errors,teardownErrors}));
