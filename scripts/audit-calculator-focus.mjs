import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {chromium,webkit,expect} from '@playwright/test';
const require=createRequire(import.meta.url),origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/calculator-focus';await fs.mkdir(out,{recursive:true});
const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const browser=await chromium.launch(),c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
const page=await c.newPage(),results=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
async function check(name,fn){try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}}
async function fit(p){
 const geometry=await p.evaluate(()=>{const root=document.querySelector('[data-calculator-workspace]')?.getBoundingClientRect(),body=document.querySelector('[data-calculator-scroll]')?.getBoundingClientRect();return {x:root.x,y:root.y,right:root.right,bottom:root.bottom,vh:innerHeight,vw:innerWidth,scroll:document.documentElement.scrollWidth,bodyHeight:body.height};});
 assert.ok(geometry.x>=-1&&geometry.y>=-1&&geometry.right<=geometry.vw+1&&geometry.bottom<=geometry.vh+2,JSON.stringify(geometry));
 assert.ok(geometry.scroll<=geometry.vw+1&&geometry.bodyHeight>50,JSON.stringify(geometry));
 await expect(p.getByRole('navigation',{name:'Primary navigation',exact:true})).toHaveCount(0);
 await expect(p.getByRole('navigation',{name:'Mobile primary navigation',exact:true})).toHaveCount(0);
 await expect(p.getByRole('contentinfo')).toHaveCount(0);
 await expect(p.locator('[data-supplier-shelf]')).toHaveCount(0);
 await expect(p.getByRole('region',{name:'Calculator help and supplies'})).not.toBeVisible();
 await expect(p.getByRole('region',{name:'Analytics preferences'})).not.toBeVisible();
}
async function accessibility(p){await p.evaluate(axe);const found=await p.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(found,[]);}
try{
 await check('Opening scene fills the screen and makes the primary calculator visible',async()=>{
  for(const [width,height]of [[320,568],[390,844],[430,932],[768,1024],[1024,768],[1440,900]]){
   await page.setViewportSize({width,height});await page.goto(origin,{waitUntil:'networkidle'});
   const hero=page.locator('[data-home-hero]'),primary=hero.getByRole('link',{name:'Open calculator',exact:true});
   const h=await hero.boundingBox(),cta=await primary.boundingBox();assert.ok(h&&h.y+h.height>=height-1,JSON.stringify({width,height,h}));
   assert.ok(cta&&cta.y>=0&&cta.y+cta.height<=height,JSON.stringify({width,height,cta}));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   await expect(page.getByRole('navigation',{name:'Mobile primary navigation',exact:true})).toHaveCount(0);
   if([390,1440].includes(width))await page.screenshot({path:`${out}/home-${width}.png`,fullPage:false});
  }
 });
 await check('Every calculator starts on its own viewport without website chrome or products',async()=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ['/peptide-calculator','/plan','/plan/new','/tools/bac-water','/tools/mg-to-mcg','/tools/syringe-units','/tools/dose','/tools/reverse-bac','/tools/supplies','/calculate/bpc-157','/calculate/hcg']){
   await page.goto(origin+route,{waitUntil:'networkidle'});await fit(page);await accessibility(page);
   const first=page.locator('[data-calculator-scroll] input,[data-calculator-scroll] [role="combobox"]').first(),bounds=await first.boundingBox();
   assert.ok(bounds&&bounds.y<700,`${route}: first control displaced`);
  }
 });
 await check('Guided calculation keeps one step and one Continue action in view',async()=>{
  await page.goto(origin+'/peptide-calculator');await page.evaluate(()=>localStorage.removeItem('bacwater.planDraft'));await page.reload();
  await page.getByRole('combobox',{name:'Product',exact:true}).click();await page.getByRole('option',{name:/Other.*Custom/}).click();
  await page.getByLabel('Custom peptide name',{exact:true}).fill('Viewport test compound');
  const next=page.getByRole('button',{name:'Continue',exact:false});await expect(next).toHaveCount(1);await expect(next).toBeEnabled();
  const bounds=await next.boundingBox();assert.ok(bounds&&bounds.y+bounds.height<=844);
  await next.click();await expect(page.getByRole('heading',{name:'What amount is on the vial?',exact:true})).toBeVisible();
  await page.getByLabel('Vial strength',{exact:true}).fill('12');
  await page.screenshot({path:`${out}/guided-step-390.png`,fullPage:false});
 });
 await check('Help is deliberate, retains the BAC water link and returns to the same entries',async()=>{
  await page.getByLabel('Open calculator help',{exact:true}).click();
  await expect(page.getByRole('region',{name:'Calculation workspace',exact:true})).not.toBeVisible();
  const help=page.getByRole('region',{name:'Calculator help and supplies'});
  await expect(help).toBeVisible();await expect(help.locator('[data-bac-water-link] a').first()).toHaveAttribute('href','https://www.aminoclub.com/us/products/amino-h2o?utm_source=affiliate_marketing&code=WEBIQ');
  await accessibility(page);await page.screenshot({path:`${out}/help-390.png`,fullPage:false});
  await page.keyboard.press('Escape');await expect(page.getByLabel('Open calculator help',{exact:true})).toBeFocused();
  await expect(page.getByLabel('Vial strength',{exact:true})).toHaveValue('12');await fit(page);
 });
 await check('Draft values and the current guided step survive refresh, Back and return',async()=>{
  await page.reload();await expect(page.getByRole('heading',{name:'What amount is on the vial?',exact:true})).toBeVisible();await expect(page.getByLabel('Vial strength',{exact:true})).toHaveValue('12');
  await page.getByRole('link',{name:'Back to website',exact:true}).click();await expect(page).toHaveURL(origin+'/');
  await page.goBack();await expect(page.getByLabel('Vial strength',{exact:true})).toHaveValue('12');
 });
 await check('Short screens, rotation and text enlargement preserve reachable controls',async()=>{
  for(const [width,height]of [[390,420],[844,390],[320,568]]){
   await page.setViewportSize({width,height});await expect.poll(()=>page.locator('[data-calculator-workspace]').evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(height);
   await fit(page);await page.getByLabel('Vial strength',{exact:true}).scrollIntoViewIfNeeded();await page.getByLabel('Vial strength',{exact:true}).focus();
   const input=await page.getByLabel('Vial strength',{exact:true}).boundingBox(),dock=await page.locator('[data-calculator-actions]').boundingBox();
   assert.ok(input&&dock&&input.y+input.height<=dock.y+1,JSON.stringify({input,dock}));
   const next=await page.getByRole('button',{name:'Continue',exact:false}).boundingBox();assert.ok(next&&next.y+next.height<=height);
  }
  await page.addStyleTag({content:'html{font-size:200%} p,label,input,button,a,summary{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
  await fit(page);await page.screenshot({path:`${out}/guided-enlarged-320.png`,fullPage:false});
 });
 await check('Help follows the actual enlarged header and desktop questions remain centered',async()=>{
  await page.getByLabel('Open calculator help',{exact:true}).click();
  const bar=await page.locator('[data-calculator-workspace] > header').boundingBox(),help=await page.getByRole('region',{name:'Calculator help and supplies'}).boundingBox();
  assert.ok(bar&&help&&help.y>=bar.y+bar.height-1,JSON.stringify({bar,help}));
  await page.getByRole('button',{name:'Return to calculation',exact:true}).click();
  await page.setViewportSize({width:1440,height:900});await page.goto(origin+'/peptide-calculator');
  const question=await page.locator('.bac-step-panel').first().boundingBox();
  assert.ok(question&&Math.abs(question.x+question.width/2-720)<2,JSON.stringify(question));
  await page.screenshot({path:`${out}/guided-step-1440.png`,fullPage:false});
 });
 await check('All-at-once is optional and its save control stays in the app action dock',async()=>{
  await page.setViewportSize({width:390,height:844});await page.goto(origin+'/plan');
  await page.getByRole('button',{name:'All at once',exact:true}).click();
  const save=page.locator('[data-calculator-actions]').getByRole('button',{name:'Save my plan',exact:true});await expect(save).toBeVisible();await expect(save).toBeDisabled();
  const bounds=await save.boundingBox();assert.ok(bounds&&bounds.y+bounds.height<=844);await fit(page);
 });
 await check('Compound references launch isolated tools; hCG keeps IU and utilities are noindex',async()=>{
  await page.goto(origin+'/peptides/hcg');
  // Clinical reference pages keep calculation launchers but no paid product shelf.
  await expect(page.locator('[data-calculator-workspace]')).toHaveCount(0);
  await expect(page.locator('main input')).toHaveCount(0);
  await expect(page.locator('[data-supplier-shelf]')).toHaveCount(0);
  await expect(page.locator('main input:not([type="search"])')).toHaveCount(0);
  await page.getByRole('link',{name:/^Open hcg calculator$/i}).click();await expect(page).toHaveURL(origin+'/calculate/hcg');
  await expect(page.getByLabel('Total in container (IU)',{exact:true})).toBeVisible();await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content',/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',origin+'/peptides/hcg');
  await fit(page);await page.screenshot({path:`${out}/hcg-390.png`,fullPage:false});
  const r=await c.request.get(origin+'/calculate/not-a-compound');assert.equal(r.status(),404);
 });
 await check('Direct first visit presents age confirmation above the calculator, not behind it',async()=>{
  const fresh=await browser.newContext({viewport:{width:390,height:844}});await fresh.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());const p=await fresh.newPage();
  await p.goto(origin+'/tools/mg-to-mcg');const gate=p.getByRole('dialog',{name:'Age check: are you 21 or older?'});await expect(gate).toBeVisible();
  await expect(p.locator('main')).toHaveAttribute('inert','');await gate.getByRole('button',{name:'Yes, I am 21 or older',exact:true}).click();await expect(gate).toHaveCount(0);await fit(p);
  await p.getByLabel('Milligrams (mg)',{exact:true}).fill('0.125');await expect(p.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('125');await fresh.close();
 });
 await check('WebKit engine uses the dedicated screen and preserves a converter result',async()=>{
  const b=await webkit.launch(),ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await ctx.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);const p=await ctx.newPage();
  await p.goto(origin+'/tools/mg-to-mcg');await fit(p);await p.getByLabel('Milligrams (mg)',{exact:true}).fill('0.125');await expect(p.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('125');await p.reload();await expect(p.getByLabel('Milligrams (mg)',{exact:true})).toHaveValue('0.125');await p.screenshot({path:`${out}/converter-webkit-390.png`,fullPage:false});await b.close();
 });
 assert.deepEqual(errors,[]);
}catch(e){process.exitCode=1;console.error(e);await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});await fs.writeFile(`${out}/failure.html`,await page.content());}
finally{await browser.close();await fs.writeFile(`${out}/results.json`,JSON.stringify({date:new Date().toISOString(),results,errors,limitations:['Test-only localhost fixtures. No production account, database or external product action.','Chromium and WebKit engines with CSS viewports; no physical phone, real software keyboard or screen reader.','Height changes exercise resizing and reachable controls, not a claim that every browser keyboard has been tested.']},null,2));}
