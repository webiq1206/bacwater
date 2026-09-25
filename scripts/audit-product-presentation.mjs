import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {chromium,webkit,expect} from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Only the disposable test site is allowed.');
const out='audit-evidence/product-presentation';await fs.mkdir(out,{recursive:true});
const names=JSON.parse(await fs.readFile('scripts/fixtures/partner-product-names.json','utf8'));
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const results=[],errors=[],teardownErrors=[],external=[];
const check=async(name,fn)=>{try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}};
const link=id=>`https://www.aminoclub.com/us/products/${id}?utm_source=affiliate_marketing&code=WEBIQ`;
async function a11y(p){await p.evaluate(axe);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);}
async function fit(p,d){const geom=await d.evaluate(el=>{const r=el.getBoundingClientRect(),scroll=el.querySelector('[data-product-detail-scroll]').getBoundingClientRect(),a=el.querySelector('footer a').getBoundingClientRect(),close=el.querySelector('button:last-child')?.getBoundingClientRect();return{left:r.x,top:r.y,right:r.right,bottom:r.bottom,vw:innerWidth,vh:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,scrollHeight:scroll.height,action:{y:a.y,bottom:a.bottom},close:close?{y:close.y,bottom:close.bottom}:null}});assert.ok(geom.left>=-1&&geom.top>=-1&&geom.right<=geom.vw+1&&geom.bottom<=geom.vh+2,JSON.stringify(geom));assert.equal(geom.overflow,false,JSON.stringify(geom));assert.ok(geom.scrollHeight>45,JSON.stringify(geom));assert.ok(geom.action.y>=0&&geom.action.bottom<=geom.vh+1,JSON.stringify(geom));}
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]){
 const b=await driver.launch(),c=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
 await c.route('**/*',r=>{if(new URL(r.request().url()).origin===origin)return r.continue();external.push(r.request().url());return r.abort();});
 const p=await c.newPage();let closing=false;
 p.on('pageerror',e=>(closing?teardownErrors:errors).push({engine,error:String(e),url:p.url()}));
 // Drain automatic prefetches before deliberate document replacement; do not attribute teardown aborts to a new page.
 async function visit(path){await p.waitForLoadState('networkidle');await p.goto(origin+path,{waitUntil:'networkidle'});}
 try{
  await check(`${engine}: canonical names and complete readable details for every product`,async()=>{
   await visit('/recommendations');
   const field=p.getByRole('searchbox',{name:'Find a product',exact:true});
   for(const [id,name] of Object.entries(names)){
    await field.fill(id);const card=p.locator(`[data-product="${id}"]`);
    await expect(card.locator('h3')).toHaveText(name);await expect(card.locator('[data-artwork-name]')).toHaveText(name);
    await card.getByRole('button',{name:`Read research details for ${name}`,exact:true}).click();
    const d=p.locator(`[data-product-detail="${id}"]`);await expect(d.getByRole('heading',{level:2})).toHaveText(name);
    for(const h of ['What it is','What researchers study','How it works'])await expect(d.getByRole('heading',{name:h,exact:true})).toBeVisible();
    assert.doesNotMatch(await d.innerText(),/\blistings?\b|Listing review|Catalog identifier/i);
    await expect(d.getByRole('link',{name:/on the supplier website/})).toHaveAttribute('href',link(id));
    await d.getByRole('button',{name:'Read the sources'}).click();
    await expect(d.locator('details')).toHaveAttribute('open','');
    const partnerSource=d.getByRole('link',{name:'Partner product information'});
    await expect(partnerSource).toHaveAttribute('href',link(id));await expect(partnerSource).toHaveAttribute('rel',/sponsored/);
    await fit(p,d);await p.waitForLoadState('networkidle');await p.keyboard.press('Escape');await expect(card.getByRole('button',{name:/Read research details/})).toBeFocused();
   }
  });
  await check(`${engine}: scientific-name searches return partner titles on all product surfaces`,async()=>{
   await visit('/recommendations');await p.getByRole('searchbox',{name:'Find a product',exact:true}).fill('Retatrutide');
   await expect(p.locator('[data-product="glp-3"] h3')).toHaveText('GLP-3 (RT)');
   await visit('/search');await p.getByRole('searchbox',{name:'What are you looking for?'}).fill('tirzepetide');
   await expect(p.locator('[data-search-result="product:glp-2"] strong')).toHaveText('GLP-2 (TR)');
   await visit('/peptide-calculator');await p.getByRole('combobox',{name:'Product',exact:true}).click();
   await p.getByLabel('Search products',{exact:true}).fill('Retatrutide');await p.getByRole('option',{name:'GLP-3 (RT)',exact:true}).click();
   await expect(p.locator('[data-selected-product="glp-3"]')).toContainText('GLP-3 (RT)');
   for(const route of ['/calculate/retatrutide','/calculate/product/glp-3','/peptides/retatrutide']){await visit(route);await expect(p.locator('h1')).toContainText('GLP-3 (RT)');}
  });
  await check(`${engine}: desktop, phone, long names and short screens keep content and actions reachable`,async()=>{
   for(const [width,height,id] of [[1440,1000,'glp-3'],[390,844,'glp-3'],[320,568,'cjc-ipa-no-dac'],[430,932,'bpc-tb-spray'],[844,390,'glp-3']]){
    await p.setViewportSize({width,height});await visit('/recommendations');await p.getByRole('searchbox',{name:'Find a product',exact:true}).fill(id);
    await p.locator(`[data-product="${id}"]`).getByRole('button',{name:/Read research details/}).click();const d=p.locator(`[data-product-detail="${id}"]`);
    await fit(p,d);await expect(d.getByRole('heading',{name:'What it is',exact:true})).toBeInViewport();await a11y(p);await p.screenshot({path:`${out}/${engine}-details-${id}-${width}.png`,fullPage:false});
    await d.getByRole('button',{name:'Read the sources'}).click();await expect(d.getByRole('link',{name:'Partner product information'})).toBeVisible();
    await d.getByRole('button',{name:'Close',exact:true}).click();await expect(p.getByRole('searchbox',{name:'Find a product',exact:true})).toHaveValue(id);
   }
  });
  await check(`${engine}: directory, enlarged text and no obsolete review section`,async()=>{
   await p.setViewportSize({width:1440,height:1000});await visit('/recommendations');await a11y(p);await p.screenshot({path:`${out}/${engine}-directory-desktop.png`,fullPage:false});
   await p.setViewportSize({width:390,height:844});await p.screenshot({path:`${out}/${engine}-directory-mobile.png`,fullPage:false});
   await p.setViewportSize({width:320,height:700});await p.getByRole('searchbox',{name:'Find a product',exact:true}).fill('cjc-ipa-no-dac');
   await p.getByRole('button',{name:/Read research details/}).click();const d=p.locator('[data-product-detail="cjc-ipa-no-dac"]');
   await p.addStyleTag({content:'html{font-size:200%} p,a,button,label{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
   await fit(p,d);await d.getByRole('heading',{name:'How it works',exact:true}).scrollIntoViewIfNeeded();await expect(d.getByRole('heading',{name:'How it works',exact:true})).toBeInViewport();
   await d.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  });
 }catch(e){process.exitCode=1;console.error(e);await p.screenshot({path:`${out}/${engine}-failure.png`,fullPage:true}).catch(()=>{});await fs.writeFile(`${out}/${engine}-failure.html`,await p.content().catch(()=>''));}finally{try{await p.waitForLoadState('networkidle');}finally{closing=true;await b.close();}}
}
if(errors.length||external.some(u=>new URL(u).hostname.endsWith('aminoclub.com')))process.exitCode=1;
await fs.writeFile(`${out}/results.json`,JSON.stringify({date:new Date().toISOString(),results,errors,teardownErrors,external,limitations:['Test database and browser emulation only, not the live deployment or physical devices.','External requests are blocked; no referral clicks, purchases, stock checks or conversion-credit claims.','Readability checks are editorial and structural, not a certified school reading-grade assessment.']},null,2));
console.log(JSON.stringify({results,errors,teardownErrors}));
