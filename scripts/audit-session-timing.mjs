import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, webkit, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/session-timing';await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const results=[],errors=[];
async function check(name,fn){try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});process.exitCode=1;}}
for(const [engine,driver]of[['chromium',chromium],['webkit',webkit]]){
 const b=await driver.launch();
 async function journey(fn,{blocked=false,width=390}={}){
  const c=await b.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
  await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
  if(blocked)await c.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
  const p=await c.newPage();let closing=false;p.on('pageerror',e=>{if(!closing)errors.push({engine,error:String(e)});});
  try{await p.goto(origin,{waitUntil:'networkidle'});await fn(p,c);await p.waitForLoadState('networkidle');}
  catch(e){await p.screenshot({path:`${out}/${engine}-failure-${Date.now()}.png`,fullPage:true}).catch(()=>{});throw e;}
  finally{closing=true;await c.close();}
 }
 async function choose(p,id,scope=p){await scope.getByRole('button',{name:/^(Choose|Change) product$/}).click();const d=p.getByRole('dialog',{name:'Choose a product',exact:true});await d.locator(`[data-product-choice="${id}"]`).click();await expect(p).toHaveURL(origin+`/calculate/product/${id}`);}
 async function entry(p,{basis='each',amount='2',frequency=''}={}){await p.getByRole('radio',{name:basis==='each'?/^Each time/:/^Whole week/}).check();await p.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mg');await p.getByLabel('Amount from your instructions',{exact:true}).fill(amount);if(frequency)await p.getByRole('button',{name:frequency,exact:true}).click();}
 async function seed(p){await p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true}).click();const f=p.locator('[data-hero-focus]');await f.getByLabel('Amount in vial',{exact:true}).fill('40');await f.getByLabel('Final liquid volume',{exact:true}).fill('2');return f;}
 try{
  await check(`${engine}: homepage to a product retains 40 mg and 2 mL immediately`,()=>journey(async p=>{
   const f=await seed(p);await choose(p,'glp-3',f);
   await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');await expect(p.locator('[data-concentration]')).toContainText('20 mg/mL');await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('');
   await expect(p.locator('[data-supplier-shelf]')).toHaveCount(0);await expect(p.getByRole('contentinfo')).toHaveCount(0);
   await expect(p.getByRole('link',{name:'View BAC water, opens a new tab',exact:true})).toHaveAttribute('href',/\/products\/amino-h2o$/);
   await expect(p.locator('[data-selected-product-link]')).toHaveAttribute('href',/\/products\/glp-3$/);
  }));
  await check(`${engine}: weekly vs each-time math is explicit and consistent after changing products`,()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await entry(p,{basis:'week',amount:'4',frequency:'Twice a week'});
   await expect(p.locator('[data-mass-result]')).toContainText('0.1 mL each time');await expect(p.locator('[data-mass-result]')).toContainText('10 U-100 units each time');await expect(p.locator('[data-amount-timing]')).toContainText('4 mg for the week ÷ 2 uses = 2 mg each time');
   await choose(p,'bpc-157');await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('4');await expect(p.getByRole('button',{name:'Twice a week',exact:true})).toHaveAttribute('aria-pressed','true');await expect(p.getByRole('radio',{name:/^Whole week/})).toBeChecked();await expect(p.locator('[data-mass-result]')).toContainText('0.1 mL each time');
   await p.getByRole('radio',{name:/^Each time/}).check();await expect(p.locator('[data-mass-result]')).toContainText('0.2 mL each time');await expect(p.locator('[data-amount-timing]')).toContainText('8 mg for the week');
   await p.getByRole('button',{name:'Once a day',exact:true}).click();await expect(p.locator('[data-mass-result]')).toContainText('0.2 mL each time');await expect(p.locator('[data-amount-timing]')).toContainText('28 mg for the week');await expect(p.locator('[data-concentration]')).toContainText('20 mg/mL');
   await p.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mcg');await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('4000');await expect(p.locator('[data-mass-result]')).toContainText('0.2 mL');
   await p.reload();await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('4000');await expect(p.getByRole('radio',{name:/^Each time/})).toBeChecked();await p.goBack();await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');
  }));
  await check(`${engine}: guided flow inherits values, explains timing and retains step through refresh`,()=>journey(async p=>{
   await choose(p,'bpc-157',await seed(p));await entry(p,{basis:'week',amount:'4',frequency:'Twice a week'});await p.getByRole('link',{name:'Save as a plan',exact:true}).click();await expect(p).toHaveURL(origin+'/plan');
   await p.getByRole('button',{name:'Continue',exact:false}).click();await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('40');await p.getByRole('button',{name:'Continue',exact:false}).click();await expect(p.getByRole('heading',{name:'What do your instructions say?',exact:true})).toBeVisible();await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('4');await expect(p.getByRole('radio',{name:/^Whole week/})).toBeChecked();
   await p.reload();await expect(p.getByRole('heading',{name:'What do your instructions say?',exact:true})).toBeVisible();await p.getByRole('button',{name:'Continue',exact:false}).click();await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByRole('button',{name:'Continue',exact:false}).click();await expect(p.getByRole('heading',{name:'Here are your numbers.',exact:true})).toBeVisible();await expect(p.locator('[data-calculator-scroll]')).toContainText('10 units');
   if(engine==='chromium')await p.screenshot({path:`${out}/guided-result-mobile.png`,fullPage:false});
  }));
  await check(`${engine}: weekly totals cannot calculate without timing; custom counts do not guess`,()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await entry(p,{basis:'week',amount:'4'});await expect(p.locator('[data-mass-result]')).not.toContainText('U-100 units each time');await expect(p.locator('[data-amount-timing]')).toContainText('How many times in the week?');
   await p.getByRole('button',{name:'Other timing',exact:true}).click();await p.getByLabel('Uses per week',{exact:true}).fill('0');await expect(p.locator('[data-amount-timing]')).toContainText('whole number from 1 to 28');await p.getByLabel('Uses per week',{exact:true}).fill('2');await expect(p.locator('[data-mass-result]')).toContainText('0.1 mL');
  }));
  await check(`${engine}: blends, ready-made solutions and product IU never inherit mass fields`,()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await entry(p,{basis:'each',amount:'2'});await choose(p,'glow');await expect(p.getByLabel('Ingredient 1 amount (mg)',{exact:true})).toHaveValue('');await expect(p.getByLabel('Final volume (mL)',{exact:true})).toHaveValue('');
   await choose(p,'nad-plus-spray');await expect(p.getByLabel('Label concentration (mg/mL)',{exact:true})).toHaveValue('');await expect(p.getByLabel('Sample volume (mL)',{exact:true})).toHaveValue('');
   await p.goto(origin+'/calculate/hcg',{waitUntil:'networkidle'});await expect(p.getByLabel('Total in container (IU)',{exact:true})).toHaveValue('');await p.getByLabel('Total in container (IU)',{exact:true}).fill('1000');
   await p.goto(origin+'/calculate/product/glp-3',{waitUntil:'networkidle'});await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('2');
  }));
  await check(`${engine}: clear resets compatible calculators and never resurrects an older draft`,()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await entry(p,{basis:'week',amount:'4',frequency:'Twice a week'});await p.getByRole('button',{name:'Clear inputs',exact:true}).click();await choose(p,'bpc-157');await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('');await expect(p.getByLabel('Amount from your instructions',{exact:true})).toHaveValue('');await p.goto(origin,{waitUntil:'networkidle'});await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');await p.reload();await expect(p.locator('[data-hero-calculator]').getByLabel('Amount in vial',{exact:true})).toHaveValue('');
  }));
  await check(`${engine}: blocked storage still supports same-document product handoff`,()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await expect(p.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('40');await expect(p.getByLabel('Final liquid volume in mL',{exact:true})).toHaveValue('2');
  },{blocked:true}));
  if(engine==='chromium')await check('Mobile, enlarged text and keyboard access keep the whole amount/timing flow usable',()=>journey(async p=>{
   await choose(p,'glp-3',await seed(p));await entry(p,{basis:'week',amount:'4',frequency:'Twice a week'});
   for(const width of[320,390,768,1440]){
    await p.setViewportSize({width,height:width>780?1000:844});await p.evaluate(axe);const issues=await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(issues,[]);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   }
   await p.setViewportSize({width:390,height:844});await p.locator('[data-amount-timing]').scrollIntoViewIfNeeded();await p.screenshot({path:out+'/amount-timing-mobile.png',fullPage:false});
   await p.setViewportSize({width:320,height:568});await p.addStyleTag({content:'html{font-size:200%} p,label,input,button,a{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await p.getByLabel('Amount from your instructions',{exact:true}).scrollIntoViewIfNeeded();await p.getByLabel('Amount from your instructions',{exact:true}).focus();await expect(p.getByLabel('Amount from your instructions',{exact:true})).toBeFocused();await p.screenshot({path:out+'/amount-timing-enlarged-320.png',fullPage:false});
  }));
 }finally{await b.close();}
}
if(errors.length)process.exitCode=1;
await fs.writeFile(out+'/results.json',JSON.stringify({results,errors,limitations:['Localhost test data only. No medical dose or timing is recommended.','Session persistence is scoped to the current tab and requires storage for reload survival.','Blocked storage retains in-memory values during client-side navigation, not after reload.','Browser viewport emulation is not physical-phone keyboard or screen-reader certification.']},null,2));
console.log(JSON.stringify({results,errors}));
