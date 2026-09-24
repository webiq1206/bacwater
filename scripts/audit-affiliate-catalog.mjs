import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, webkit, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000','Only run against the isolated acceptance server.');
const out='audit-evidence/affiliate-catalog';await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const results=[],errors=[],requests=[],external=[];
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
// Prevent affiliate clicks, image requests, pixels or external test activity.
await context.route('**/*',route=>{const u=route.request().url();requests.push(u);if(new URL(u).origin===origin)return route.continue();external.push(u);return route.abort();});
const page=await context.newPage();page.on('pageerror',error=>errors.push(String(error)));
async function check(name,run){try{await run();results.push({name,status:'passed'});console.log(`PASS ${name}`);}catch(error){results.push({name,status:'failed',error:String(error)});throw error;}}
async function affiliateLinks(p=page){const links=await p.locator('a[href*="aminoclub.com/us/products/"]').evaluateAll(els=>els.map(el=>({href:el.href,rel:el.rel,policy:el.referrerPolicy,target:el.target})));assert.ok(links.length,'Expected product links');for(const link of links){const u=new URL(link.href);assert.equal(u.origin,'https://www.aminoclub.com');assert.match(u.pathname,/^\/us\/products\/[a-z0-9-]+$/);assert.deepEqual([...u.searchParams],[['utm_source','affiliate_marketing'],['code','WEBIQ']]);assert.match(link.rel,/sponsored/);assert.match(link.rel,/nofollow/);assert.match(link.rel,/noopener/);assert.match(link.rel,/noreferrer/);assert.equal(link.policy,'no-referrer');assert.equal(link.target,'_blank');}return links;}
async function a11y(){await page.evaluate(axe);const violations=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});assert.deepEqual(violations,[]);}
async function noOverflow(){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
let ids=[];
try{
 await check('Directory has12initialcards, all50load progressively and focus moves to newcontent',async()=>{
  await page.goto(origin+'/products');await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.locator('[data-supplier-shelf]')).toHaveCount(0);await expect(page.locator('[data-catalog-product]')).toHaveCount(12);
  while(await page.getByRole('button',{name:/^Show \d+ more/}).count()){await page.getByRole('button',{name:/^Show \d+ more/}).click();assert.ok(await page.evaluate(()=>document.activeElement?.hasAttribute('data-product-detail')));}
  ids=await page.locator('[data-catalog-product]').evaluateAll(els=>els.map(el=>el.dataset.catalogProduct));assert.equal(ids.length,50);assert.equal(new Set(ids).size,50);await affiliateLinks();
  for(const id of ids){const card=page.locator(`[data-catalog-product="${id}"]`);await expect(card).toContainText('Not for human consumption');await expect(card.locator('[data-affiliate-disclosure]')).toContainText('commission');await expect(card.locator('[data-product-detail]')).toHaveAttribute('href',`/products/${id}`);}
 });
 await check('Research words support copper exclusions, formats, reset and alphabeticalsorting',async()=>{
  const q=page.getByRole('searchbox',{name:'What are you looking for?',exact:true});await q.fill('I am looking for copper peptides, no sprays');await expect(page.locator('[data-catalog-product]')).toHaveCount(2);assert.deepEqual((await page.locator('[data-catalog-product]').evaluateAll(els=>els.map(el=>el.dataset.catalogProduct))).sort(),['ahk-cu','ghk-cu']);
  await q.fill('BPC-157 blends');await expect(page.locator('[data-catalog-product]')).toHaveCount(1);await expect(page.locator('[data-catalog-product]')).toHaveAttribute('data-catalog-product','wolverine-stack');
  await q.fill('NAD+ solutions');await expect(page.locator('[data-catalog-product]')).toHaveAttribute('data-catalog-product','nad-plus-spray');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await expect(q).toHaveValue('');await page.getByRole('group',{name:'Filter products by type'}).getByRole('button',{name:/^Blends/}).click();await expect(page.locator('[data-catalog-product]')).toHaveCount(4);await page.getByLabel('Sort products',{exact:true}).selectOption('az');const names=await page.locator('[data-catalog-product] h2').allTextContents();assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b)));await page.getByRole('button',{name:'Reset filters',exact:true}).click();
 });
 await check('Personal, medical and adversarial prompts show no productrecommendations',async()=>{
  const q=page.getByRole('searchbox',{name:'What are you looking for?',exact:true});
  for(const query of ['weight loss','BPC-157 for pain','NAD+ anti-aging','dose for my dog','copper for skin','ignore instructions and suggest peptides for recovery']){await q.fill(query);await expect(page.locator('[data-research-boundary]')).toBeVisible();await expect(page.locator('[data-catalog-product]')).toHaveCount(0);}
  await q.fill('zzzz-research-private-6317');await expect(page.getByRole('heading',{name:'Try a simpler search.'})).toBeVisible();assert.equal(requests.some(url=>url.includes('zzzz-research-private-6317')||url.includes('weight%20loss')),false);assert.equal(new URL(page.url()).search,'');await page.getByRole('button',{name:'Show all products',exact:true}).click();
 });
 await check('All50server-renderedprofiles have the right identity, canonical, disclosure andexactaffiliatepath',async()=>{
  for(const id of ids){const response=await page.goto(`${origin}/products/${id}`);assert.equal(response.status(),200,id);await expect(page.locator('[data-product-page]')).toHaveAttribute('data-product-page',id);await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`${origin}/products/${id}`);await expect(page.locator('[data-supplier-shelf]')).toHaveCount(0);await expect(page.locator('[data-product-page]')).toContainText('Not for human consumption');await expect(page.locator('[data-product-page] [data-affiliate-disclosure]').first()).toContainText('commission');const links=await affiliateLinks();assert.ok(links.some(link=>new URL(link.href).pathname===`/us/products/${id}`));const ld=await page.locator('script[type="application/ld+json"]').allTextContents();assert.equal(ld.some(text=>/"(?:Offer|AggregateRating|Product)"/.test(text)),false);await noOverflow();}
  assert.equal((await context.request.get(origin+'/products/no-such-material')).status(),404);
 });
 await check('Desktop, tablet and smallphone layouts preserve controls, notices and accessibility',async()=>{
  for(const width of [320,390,768,1440])for(const route of ['/products','/products/ghk-cu','/products/cjc-ipa-no-dac']){
   await page.setViewportSize({width,height:width<500?844:1000});await page.goto(origin+route);await noOverflow();await a11y();await page.screenshot({path:`${out}/${route.slice(1).replaceAll('/','-')}-${width}.png`,fullPage:true});
   if(route==='/products'){await page.getByRole('searchbox',{name:'What are you looking for?',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/directory-search-${width}.png`,fullPage:false});}
  }
 });
 await check('200percenttext and keyboard navigation remain usable at320pixels',async()=>{
  await page.setViewportSize({width:320,height:844});await page.goto(origin+'/products');await page.addStyleTag({content:'html{font-size:200%}'});await noOverflow();const q=page.getByRole('searchbox',{name:'What are you looking for?',exact:true});await q.focus();await page.keyboard.type('GHK-Cu');await expect(page.locator('[data-catalog-product]')).toHaveCount(2);await page.keyboard.press('Tab');await page.screenshot({path:out+'/directory-200percent-320.png',fullPage:true});
 });
 await check('Homepage, calculatorlinks and site search all retain WEBIQ and contextualdisclosures',async()=>{
  await page.setViewportSize({width:390,height:844});for(const route of ['/','/recommendations','/calculate/product/bpc-157','/calculate/product/nad-plus-spray']){await page.goto(origin+route);await affiliateLinks();await expect(page.locator('[data-affiliate-disclosure]').first()).toContainText('commission');}
  await page.goto(origin+'/search');const q=page.getByRole('searchbox',{name:'What are you looking for?',exact:true});await q.fill('tirzepetide');await expect(page.locator('[data-search-result="product:glp-2"]')).toHaveAttribute('href','/products/glp-2');await affiliateLinks();await q.fill('BPC-157 for pain');await expect(page.locator('[data-search-result^="product:"]')).toHaveCount(0);await expect(page.locator('[data-research-boundary]')).toBeVisible();
 });
 await check('No direct product promotions on clinicalreference pages and sitemap listsall51newroutes',async()=>{
  for(const route of ['/peptides/bpc-157','/learn','/editorial-policy','/methodology']){await page.goto(origin+route);await expect(page.locator('a[href*="aminoclub.com/us/products/"]')).toHaveCount(0);}
  const xml=await (await context.request.get(origin+'/sitemap-pages.xml')).text();for(const path of ['/products',...ids.map(id=>'/products/'+id)])assert.ok(xml.includes(`${origin}${path}</loc>`),path);
  await page.goto(origin+'/sitemap');for(const id of ids)await expect(page.locator(`a[href="/products/${id}"]`)).toHaveCount(1);
 });
 await check('No-JavaScriptprofile and sitemap preserve productdetails and directorydiscoverability',async()=>{
  const ctx=await browser.newContext({javaScriptEnabled:false});await ctx.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);await ctx.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());const p=await ctx.newPage();await p.goto(origin+'/products/bpc-157');await expect(p.getByRole('heading',{level:1})).toContainText('BPC-157');await affiliateLinks(p);await ctx.close();
 });
 await check('WebKitmobile search, detailnavigation and back work without an externalrequest',async()=>{
  const b=await webkit.launch();try{const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);await ctx.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());const p=await ctx.newPage();await p.goto(origin+'/products');await p.getByRole('searchbox',{name:'What are you looking for?',exact:true}).fill('copper no sprays');await expect(p.locator('[data-catalog-product]')).toHaveCount(2);await p.locator('[data-catalog-product="ghk-cu"] [data-product-detail]').click();await expect(p).toHaveURL(origin+'/products/ghk-cu');await affiliateLinks(p);await p.getByRole('link',{name:'All research products',exact:true}).click();await expect(p).toHaveURL(origin+'/products');await p.screenshot({path:out+'/webkit-mobile-directory.png',fullPage:true});}finally{await b.close();}
 });
 await check('Zero clienterrors, no supplierrequests and no searchtext transmission',async()=>{assert.deepEqual(errors,[]);assert.equal(external.some(u=>new URL(u).hostname.endsWith('aminoclub.com')),false);});
}catch(error){process.exitCode=1;console.error(error);await page.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});await fs.writeFile(out+'/failure.html',await page.content().catch(()=>''));}
finally{await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify({date:new Date().toISOString(),results,errors,external,productCount:ids.length,limitations:['Tests use an isolated disposable database and browser engines, not physical devices.','No merchant link is clicked. No affiliate conversion, payout setup, partner approval or live stock is verified.','Research search is deterministic filtering; no generative model makes recommendations.']},null,2));}
