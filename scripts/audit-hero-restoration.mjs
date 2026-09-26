import { chooseAuditMassProduct, completeAuditHero } from "./audit-flow-helpers.mjs";
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
  await check(`${engine}: full-height opening and primary CTA at eight widths`,async()=>{
   for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[768,1024],[1024,768],[1440,900],[1920,1080]])await journey(width,height,async p=>{
    const hero=p.locator('[data-home-hero]');await expect(hero).toHaveAttribute('data-hero-design','editorial-live');
    const h=await hero.boundingBox(),next=await p.locator('#toolkit').boundingBox(),cta=await hero.getByRole('link',{name:'Open calculator',exact:true}).boundingBox();
    assert.ok(h&&h.y+h.height>=height-1,JSON.stringify({width,height,h}));assert.ok(next&&next.y>=height-1);
    assert.ok(cta&&cta.y>=0&&cta.y+cta.height<=height,JSON.stringify({width,height,cta}));
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await expect(p.locator('[data-hero-calculator]').getByRole('combobox',{name:'Product',exact:true})).toBeVisible();
    await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveCount(0);
    if(engine==='chromium'&&[320,390,1440].includes(width))await p.screenshot({path:`${out}/home-${width}.png`,fullPage:false});
   });
  });
  await check(`${engine}: product-first steps, unit conversion, review, editing, validation and copy`,async()=>journey(1440,1000,async p=>{
   const calc=p.locator('[data-hero-calculator]'),result=calc.locator('[data-live-result]');
   await expect(calc.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();
   await expect(result).toContainText('Choose your product first');
   await completeAuditHero(p,calc);
   await expect(result).toContainText('12 mg ÷ 4 mL = 3 mg/mL');
   await expect(result).toContainText('0.1 mL');
   await expect(calc.getByRole('button',{name:'Save my plan',exact:true})).toBeEnabled();
   await calc.getByLabel('Edit final liquid volume',{exact:true}).click();
   await calc.getByLabel('Final liquid volume',{exact:true}).fill('6');
   await expect(result).toContainText('0.15 mL');await expect(result).toContainText('15 units');
   await calc.getByLabel('Final liquid volume',{exact:true}).fill('0');
   await expect(calc.getByRole('alert').filter({hasText:'greater than zero'})).toBeVisible();
   await expect(result).not.toContainText('0.15 mL');await expect(calc.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();
   await calc.getByLabel('Final liquid volume',{exact:true}).fill('6');await calc.getByRole('button',{name:'Continue',exact:true}).click();
   await calc.getByRole('button',{name:'Review result',exact:true}).click();
   await calc.getByRole('button',{name:'Copy result',exact:true}).click();assert.match(await p.evaluate(()=>window.__copied),/0\.15 mL/);
   await calc.getByLabel('Edit entered amount',{exact:true}).click();
   await calc.getByLabel('Amount unit',{exact:true}).selectOption('mcg');await expect(calc.getByLabel('Amount for one time',{exact:true})).toHaveValue('300');
   await calc.getByLabel('Amount for one time',{exact:true}).fill('-1');await expect(calc.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();await expect(result).not.toContainText('units');
   await calc.getByRole('button',{name:'Clear',exact:true}).click();
   await expect(calc.getByRole('combobox',{name:'Product',exact:true})).toContainText('BPC-157');
   await calc.getByRole('button',{name:'Continue',exact:true}).click();
   await expect(calc.getByLabel('Amount in vial',{exact:true})).toHaveValue('');await expect(calc.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();
   if(engine==='chromium')await p.screenshot({path:`${out}/live-desktop.png`,fullPage:false});
  }));
  await check(`${engine}: homepage review saves through the shared plan action`,async()=>journey(1440,1000,async p=>{
   const calc=p.locator('[data-hero-calculator]');
   await completeAuditHero(p,calc);
   await calc.getByLabel('Plan name',{exact:true}).fill('Hero acceptance calculation');
   await calc.getByRole('button',{name:'Save my plan',exact:true}).click();
   const saved=p.getByRole('dialog',{name:'Plan saved',exact:true});await expect(saved).toBeVisible();
   await expect(saved.locator('a[href$="/pdf"]')).toHaveAttribute('href',/^\/plan\/[^/]+\/pdf$/);
  }));
  await check(`${engine}: converter tabs are real controls and preserve values through refresh`,async()=>journey(1440,900,async p=>{
   let calc=p.locator('[data-hero-calculator]');await calc.getByRole('tab',{name:'BAC water',exact:true}).focus();await p.keyboard.press('ArrowRight');await expect(calc.getByRole('tab',{name:'mg to mcg',exact:true})).toHaveAttribute('aria-selected','true');
   await calc.getByLabel('Amount in milligrams',{exact:true}).fill('0.125');await expect(calc.locator('[data-live-result]')).toContainText('125 mcg');
   await calc.getByRole('tab',{name:'U-100 to mL',exact:true}).click();await calc.getByLabel('U-100 scale units',{exact:true}).fill('25');await expect(calc.locator('[data-live-result]')).toContainText('0.25 mL');
   await p.reload({waitUntil:'networkidle'});calc=p.locator('[data-hero-calculator]');await expect(calc.getByLabel('U-100 scale units',{exact:true})).toHaveValue('25');
   await calc.getByRole('tab',{name:'mg to mcg',exact:true}).click();await expect(calc.getByLabel('Amount in milligrams',{exact:true})).toHaveValue('0.125');
  }));
  await check(`${engine}: mobile inline steps and full-screen state survive close, converters and refresh`,async()=>journey(390,844,async p=>{
   const inline=p.locator('[data-hero-calculator]'),focus=p.locator('[data-hero-focus]');
   await chooseAuditMassProduct(p,inline);await inline.getByRole('button',{name:'Continue',exact:true}).click();
   await inline.getByLabel('Amount in vial',{exact:true}).fill('12');await expect(focus).toHaveCount(0);
   await inline.getByRole('button',{name:'Continue',exact:true}).click();await inline.getByLabel('Amount for one time',{exact:true}).fill('0.3');
   await p.getByRole('button',{name:'Open hero calculator full screen'}).click();await expect(focus).toBeVisible();
   await expect(p.locator('[data-hero-guided]')).toHaveCount(1);await expect(focus.getByLabel('Amount for one time',{exact:true})).toHaveValue('0.3');
   await focus.getByRole('button',{name:'Continue',exact:true}).click();await focus.getByLabel('Final liquid volume',{exact:true}).fill('4');await expect(focus.locator('[data-live-result]')).toContainText('3 mg/mL');
   await focus.getByRole('button',{name:'Continue',exact:true}).click();await focus.getByRole('button',{name:'Review result',exact:true}).click();
   await focus.getByLabel('Plan name',{exact:true}).fill('My label calculation');
   await expect(focus.getByRole('link',{name:'View Amino H2O, opens a new tab',exact:true})).toHaveAttribute('href','https://www.aminoclub.com/us/products/amino-h2o?utm_source=affiliate_marketing&code=WEBIQ');
   const r=await focus.boundingBox();assert.ok(r&&r.x>=0&&r.y>=0&&r.y+r.height<=846);await p.screenshot({path:`${out}/${engine}-mobile-focus.png`,fullPage:false});
   await focus.getByRole('button',{name:'Return to homepage',exact:true}).click();await expect(focus).toHaveCount(0);await expect(p.getByRole('button',{name:'Open hero calculator full screen'})).toBeFocused();
   await expect(inline.getByLabel('Plan name',{exact:true})).toHaveValue('My label calculation');
   await inline.getByRole('tab',{name:'mg to mcg',exact:true}).click();await inline.getByRole('tab',{name:'BAC water',exact:true}).click();await expect(inline.locator('[data-live-result]')).toContainText('0.1 mL');
   await p.reload({waitUntil:'networkidle'});await expect(inline.getByLabel('Plan name',{exact:true})).toHaveValue('My label calculation');
   await p.getByRole('button',{name:'Open hero calculator full screen'}).click();await p.setViewportSize({width:390,height:420});
   await expect.poll(()=>focus.evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(420);const back=focus.getByRole('button',{name:'Back to homepage',exact:true});await expect(back).toBeInViewport();await back.click();
  }));
  await check(`${engine}: product-first routes retain product-specific blend, solution, water and IU tools`,async()=>{
   for(const [name,path] of [['GLOW','/calculate/product/glow'],['KLOW','/calculate/product/klow'],['CJC-1295 / Ipamorelin (No DAC)','/calculate/product/cjc-ipa-no-dac'],['BPC-157/TB-500 (Wolverine)','/calculate/product/wolverine-stack'],['BPC-157/TB-500 Spray (Wolverine)','/calculate/product/bpc-tb-spray'],['Amino H2O','/calculate/product/amino-h2o'],['HCG (Research)','/calculate/hcg']])await journey(390,844,async p=>{
    await p.locator('[data-hero-calculator]').getByRole('combobox',{name:'Product',exact:true}).click();
    const picker=p.getByRole('dialog',{name:'Choose your product',exact:true});await picker.getByRole('searchbox',{name:'Search products',exact:true}).fill(name);
    await picker.getByRole('option',{name,exact:true}).click();await expect(p).toHaveURL(origin+path);await expect(p.locator('[data-calculator-workspace]')).toBeVisible();
    if(['glow','klow','cjc-ipa-no-dac','wolverine-stack'].includes(path.split('/').pop()))await expect(p.getByLabel('Total blend in container (mg)',{exact:true})).toBeVisible();
   });
  });
  await check(`${engine}: supplier picker stays available inside focused hero`,async()=>journey(390,844,async p=>{
   await p.getByRole('button',{name:'Open hero calculator full screen'}).click();const focus=p.locator('[data-hero-focus]');await focus.getByRole('button',{name:'Choose product',exact:true}).click();
   const picker=p.getByRole('dialog').filter({has:p.getByLabel('Find a product',{exact:true})});await expect(picker).toBeVisible();await picker.getByLabel('Find a product',{exact:true}).fill('BPC-157');await expect(picker.locator('a[href="/calculate/product/bpc-157"]')).toBeVisible();
   await picker.locator('a[href="/calculate/product/bpc-157"]').click();await expect(p).toHaveURL(origin+'/calculate/product/bpc-157');await expect(p.locator('[data-calculator-workspace]')).toBeVisible();await expect(p.locator('[data-supplier-shelf]')).toHaveCount(0);
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
    await p.getByRole('button',{name:'Open hero calculator full screen'}).click();const focus=p.locator('[data-hero-focus]');await completeAuditHero(p,focus);await expect(focus.locator('[data-live-result]')).toContainText('3 mg/mL');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await p.evaluate(axe);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);
    await focus.getByRole('button',{name:'Back to homepage',exact:true}).click();
   });
  });
 }finally{await browser.close();}
}
if(errors.length)process.exitCode=1;
await fs.writeFile(`${out}/results.json`,JSON.stringify({results,errors,teardownErrors,limitations:['Isolated localhost fixtures, not a live deployment.','Chromium/WebKit viewport emulation, not physical phone keyboard or screen-reader certification.','Enlarged text may extend the hero vertically to keep controls usable.','No supplier purchase, account registration, product inventory or conversion attribution is tested.']},null,2));
console.log(JSON.stringify({results,errors,teardownErrors}));
