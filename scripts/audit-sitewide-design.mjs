import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Use the disposable test site.');
const out='audit-evidence/sitewide-design';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const external=[],errors=[],results=[];
await c.route('**/*',r=>{if(new URL(r.request().url()).origin===origin)return r.continue();external.push(r.request().url());return r.abort();});
await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
const p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));
async function check(name,fn){try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}}
const expected=['amino-h2o','glp-1','glp-2','glp-3','bpc-157','ghk-cu','tb-500'];
try{
 await check('Homepage presents the calculator before supplier browsing',async()=>{await p.goto(origin);await expect(p.locator('#quick-calculator').getByRole('link',{name:'Open calculator',exact:true})).toBeVisible();const pos=await p.evaluate(()=>document.querySelector('#quick-calculator').compareDocumentPosition(document.querySelector('[data-supplier-shelf]')));assert.ok(pos&4);await p.locator('#quick-calculator').getByRole('link',{name:'Open calculator',exact:true}).click();await expect(p.locator('[data-calculator-workspace]')).toBeVisible();await expect(p.getByRole('combobox',{name:'Product',exact:true})).toBeVisible();});
 await check('Every supplier shelf includes all 50 product listings and the featured destinations',async()=>{for(const route of ['/','/tools','/peptides/bpc-157','/learn','/recommendations']){await p.goto(origin+route);const shelf=p.locator('[data-supplier-shelf]');await expect(shelf).toHaveCount(1);assert.equal(await shelf.locator('[data-product]').count(),50);assert.deepEqual(await shelf.locator('[data-product]').evaluateAll(els=>els.slice(0,7).map(e=>e.dataset.product)),expected);for(const slug of expected){const a=shelf.locator(`[data-product="${slug}"] a[target="_blank"]`);await expect(a).toHaveAttribute('href',`https://www.aminoclub.com/us/products/${slug}`);await expect(a).toHaveAttribute('referrerpolicy','no-referrer');await expect(a).toHaveAttribute('rel',/sponsored/);}await expect(shelf.locator('[data-bac-water-link] a')).toHaveAttribute('href','https://www.aminoclub.com/us/products/amino-h2o');}});
 await check('Carousel arrows and keyboard move cards; water link stays outside track',async()=>{await p.goto(origin+'/recommendations');const track=p.getByRole('region',{name:'Research products'}).getByLabel('Scrollable product cards');await p.getByRole('button',{name:'Next supplier products'}).click();await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeGreaterThan(100);await track.focus();await p.keyboard.press('End');await expect(p.getByRole('button',{name:'Next supplier products'})).toBeDisabled();await p.keyboard.press('Home');await expect(p.getByRole('button',{name:'Previous supplier products'})).toBeDisabled();assert.equal(await p.locator('[data-supplier-shelf] [data-bac-water-link]').evaluate(el=>Boolean(el.closest('[aria-label="Scrollable product cards"]'))),false);});
 await check('BAC water link available on every calculator without a result or signup',async()=>{for(const route of ['bac-water','dose','supplies','reverse-bac','mg-to-mcg','syringe-units']){await p.goto(origin+'/tools/'+route);await expect(p.locator('[data-supplier-shelf]')).toHaveCount(0);await p.getByLabel('Open calculator help',{exact:true}).click();await expect(p.locator('[data-bac-water-link] a').first()).toBeVisible();}});
 await check('All seven widths preserve page width, logo and sitewide template style',async()=>{for(const width of [320,375,390,430,768,1024,1440]){await p.setViewportSize({width,height:900});for(const route of ['/','/peptide-calculator','/tools/bac-water','/learn','/peptides/hcg','/plans','/signin','/contact','/recommendations']){await p.goto(origin+route,{waitUntil:'networkidle'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} at ${width}`);if(await p.locator('[data-calculator-workspace]').count())await expect(p.getByRole('link',{name:'Choose a calculator',exact:true})).toBeVisible();else await expect(p.locator('header .bac-wordmark img')).toBeVisible();if([390,1440].includes(width))await p.screenshot({path:`${out}/${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});}}});
 await check('Enlarged text retains calculator, supplier and privacy actions',async()=>{
   for(const width of [320,390]) for(const route of ['/','/peptide-calculator','/recommendations']) {
     await p.setViewportSize({width,height:900});
     await p.goto(origin+route,{waitUntil:'networkidle'});
     await p.addStyleTag({content:'html{font-size:200%}'});
     const layout=await p.evaluate(()=>({
       viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
       overflow:[...document.querySelectorAll('body *')].filter(el=>{
         const r=el.getBoundingClientRect();
         return r.width>0&&r.right>innerWidth+1&&!el.closest('[aria-label="Scrollable product cards"]');
       }).slice(0,20).map(el=>({tag:el.tagName,class:String(el.className),right:el.getBoundingClientRect().right})),
     }));
     assert.ok(layout.scrollWidth<=layout.viewport+1,`${route} at ${width}px, 200% text: ${JSON.stringify(layout)}`);
     if(route==='/peptide-calculator'){await expect(p.locator('[data-supplier-shelf]')).toHaveCount(0);await p.getByLabel('Open calculator help',{exact:true}).click();}else await expect(p.getByRole('button',{name:'Next supplier products'})).toBeVisible();
     const privacy=p.getByRole('region',{name:'Analytics preferences'});
     const paragraph=await privacy.locator('p').boundingBox();
     assert.ok(paragraph&&paragraph.x>=0&&paragraph.x+paragraph.width<=width+1,'Privacy explanation must wrap within the viewport.');
     await privacy.getByRole('button',{name:'Keep analytics off',exact:true}).click();
     await expect(privacy.getByRole('button',{name:'Keep analytics off',exact:true})).toHaveAttribute('aria-pressed','true');
     const name=route==='/'?'home':route.slice(1);
     await p.screenshot({path:`${out}/${name}-text-200-${width}.png`,fullPage:true});
   }
 });
 await check('New ordinary links appear in sitemap and no vendor scripts load',async()=>{const r=await c.request.get(origin+'/sitemap-pages.xml');assert.ok((await r.text()).includes('/recommendations</loc>'));assert.equal(external.some(u=>new URL(u).hostname.endsWith('aminoclub.com')),false);assert.deepEqual(errors,[]);});
}catch(e){process.exitCode=1;console.error(e);await p.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});await fs.writeFile(out+'/failure.html',await p.content());}finally{await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify({date:new Date().toISOString(),results,errors,external,limitations:['Browser engines and viewport emulation only; no physical device or screen reader was used.','No supplier signup, attribution, purchase or live catalog stock check occurs in these tests.']},null,2));}
