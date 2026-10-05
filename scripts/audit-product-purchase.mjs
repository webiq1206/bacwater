import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {chromium,webkit,expect} from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/product-purchase';await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const results=[],errors=[];let catalog=[];
const destination=id=>`https://www.aminoclub.com/us/products/${id}?utm_source=affiliate_marketing&code=WEBIQ`;
async function check(name,run){try{await run();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});process.exitCode=1;}console.log(JSON.stringify(results.at(-1)));}
async function linkCheck(link,id){await expect(link).toHaveAttribute('href',destination(id));await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','sponsored nofollow noopener noreferrer');await expect(link).toHaveAttribute('referrerpolicy','no-referrer');await expect(link).toHaveAttribute('aria-label',new RegExp('^Buy .+ from our partner, opens a new tab$'));}
async function reachable(link){await expect(link).toBeVisible();let geometry;await expect.poll(async()=>{geometry=await link.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight,hit:hit===el||el.contains(hit)};});const g=geometry;return g.x>=-1&&g.y>=-1&&g.right<=g.width+1&&g.bottom<=g.height+1&&g.hit;},{message:'Purchase/control fits the settled visual viewport and is not covered'}).toBe(true).catch(e=>{throw new Error(`${e} ${JSON.stringify(geometry)}`);});}
async function neutral(p){const text=await p.evaluate(()=>document.body.innerText+' '+document.title+' '+[...document.querySelectorAll('[aria-label],img[alt],meta[name="description"]')].map(el=>[el.getAttribute('aria-label'),el.getAttribute('alt'),el.getAttribute('content')].join(' ')).join(' '));assert.doesNotMatch(text,/amino\s*club/i);}
async function noOverflow(p){assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
async function accessible(p){await p.evaluate(axe);assert.deepEqual(await p.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))),[]);}
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await driver.launch();
 async function journey(name,width,height,path,run,options={}){
  await check(`${engine}: ${name}`,async()=>{
   const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',...options});
   await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);const external=[];
   await c.route('**/*',r=>{const url=new URL(r.request().url());if(url.origin===origin)return r.continue();external.push(url.href);return url.hostname==='www.aminoclub.com'?r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Intercepted partner destination</title><p>No external request was made.</p>'}):r.abort();});
   const p=await c.newPage();let closing=false;p.on('pageerror',e=>{if(!closing)errors.push({engine,name,error:String(e)});});
   try{await p.goto(origin+path,{waitUntil:'networkidle'});await run(p,c,external);}
   catch(e){await p.screenshot({path:`${out}/${engine}-${name.replaceAll(/[^a-z0-9]+/gi,'-')}-failure.png`,fullPage:false}).catch(()=>{});throw e;}
   finally{closing=true;await c.close();}
  });
 }
 try{
  if(engine==='chromium'){
   await journey('all 50 cards, full pages and quick looks retain exact affiliate attribution',1440,900,'/recommendations',async p=>{
    catalog=await p.locator('[data-product]').evaluateAll(els=>els.map(el=>({id:el.dataset.product,name:el.querySelector('h3').textContent})));
    assert.equal(catalog.length,50);assert.equal(new Set(catalog.map(p=>p.id)).size,50);
    for(const {id} of catalog){const card=p.locator(`[data-product="${id}"]`);await expect(card.locator('[data-product-buy]')).toHaveCount(1);await linkCheck(card.locator('[data-product-buy]'),id);}
    const q=p.getByRole('searchbox',{name:'Find a product',exact:true});
    for(const {id} of catalog){
     await q.fill(id);const card=p.locator(`[data-product="${id}"]`);await card.getByRole('button',{name:/Read research details/}).click();const d=p.locator(`[data-product-detail="${id}"]`);
     await linkCheck(d.locator('[data-product-buy]'),id);await reachable(d.locator('[data-product-buy]'));await neutral(p);await expect(d.getByRole('link',{name:'View Full Details',exact:true})).toHaveAttribute('href',`/products/${id}`);await expect(d.locator('[data-purchase-disclosure]')).toContainText('may earn a commission');await expect(d.locator('[data-study-summary]')).toContainText('What the study found');await d.getByRole('button',{name:'Close',exact:true}).click();await expect(card.getByRole('button',{name:/Read research details/})).toBeFocused();
    }
    for(const {id,name} of catalog){
     const response=await p.goto(origin+`/products/${id}`,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,id);await expect(p.locator('h1')).toHaveText(name);const root=p.locator(`[data-full-product="${id}"]`);await expect(root).toBeVisible();await expect(root.locator('[data-product-purchase-panel]')).toBeVisible();await linkCheck(root.locator('[data-product-purchase-panel] [data-product-buy]'),id);await linkCheck(root.locator('[data-product-purchase-dock] [data-product-buy]'),id);await expect(root.locator('[data-product-mechanism]')).toHaveCount(1);await expect(root.locator('[data-product-sources]')).toHaveCount(1);await expect(root.locator('[data-overview-finding]')).toContainText('What the study found');await expect(p.locator('link[rel="canonical"]')).toHaveAttribute('href',origin+`/products/${id}`);await noOverflow(p);await neutral(p);
    }
   });
  }
  for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844],[375,667],[320,568]]){
   await journey(`full page stays readable with a reachable purchase action at ${width}x${height}`,width,height,'/products/adalank-spray',async p=>{
    const buy=p.locator(width>=1024?'[data-product-purchase-panel] [data-product-buy]':'[data-product-purchase-dock] [data-product-buy]');
    for(const anchor of ['overview','how-it-works','research','details','questions','sources']){await p.locator('nav[aria-label="On this product page"]').getByRole('link',{name:({overview:'Overview','how-it-works':'How it works',research:'Research',details:'Details',questions:'Questions',sources:'Sources'})[anchor],exact:true}).click();await reachable(buy);await noOverflow(p);}
    await p.locator('#questions summary').first().click();await expect(p.locator('#questions details').first()).toHaveAttribute('open','');
    if(width<1024){await expect(p.getByRole('navigation',{name:'Mobile primary navigation',exact:true})).toHaveCount(0);await reachable(p.locator('[data-research-launcher]'));}
    if(width===390||width===1440)await accessible(p);
    await p.evaluate(()=>scrollTo(0,0));await p.evaluate(()=>document.fonts.ready);await reachable(buy);await p.screenshot({path:`${out}/${engine}-full-product-${width}.png`,fullPage:width===1440});
    if(width===390){await p.locator('nav[aria-label="On this product page"]').getByRole('link',{name:'How it works',exact:true}).click();await p.screenshot({path:`${out}/${engine}-mechanism-mobile.png`,fullPage:false});}
   });
  }
  await journey('long blend names, lightbox scrolling, short viewport and enlarged text',320,568,'/recommendations',async p=>{
   const longest=[...catalog].sort((a,b)=>b.name.length-a.name.length)[0];assert.ok(longest);await p.getByRole('searchbox',{name:'Find a product',exact:true}).fill(longest.id);await p.locator(`[data-product="${longest.id}"]`).getByRole('button',{name:/Read research details/}).click();const d=p.locator(`[data-product-detail="${longest.id}"]`),buy=d.locator('[data-product-buy]');await expect(d).toBeVisible();
   for(const [width,height] of [[320,568],[390,400],[844,390]]){await p.setViewportSize({width,height});await reachable(buy);await reachable(d.getByRole('link',{name:'View Full Details',exact:true}));await d.locator('[data-product-detail-scroll]').evaluate(el=>el.scrollTop=el.scrollHeight);await reachable(buy);assert.ok(await d.locator('[data-product-detail-scroll]').evaluate(el=>el.clientHeight)>45);await noOverflow(p);await p.screenshot({path:`${out}/${engine}-quick-look-${width}.png`,fullPage:false});}
   await p.setViewportSize({width:320,height:568});await p.addStyleTag({content:'html{font-size:200%} p,a,button,label{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});await reachable(buy);await noOverflow(p);await accessible(p);await d.getByRole('link',{name:'View Full Details',exact:true}).click();await expect(p).toHaveURL(origin+`/products/${longest.id}`);await reachable(p.locator('[data-product-purchase-dock] [data-product-buy]'));await noOverflow(p);await p.screenshot({path:`${out}/${engine}-long-name-enlarged.png`,fullPage:false});
  });
  await journey('search and research results lead to the correct product without losing the conversation',390,844,'/contact',async(p,c,external)=>{
   await p.getByRole('link',{name:'Search site',exact:true}).click();const search=p.getByRole('dialog',{name:'Find what you need',exact:true});await search.getByLabel('What are you looking for?',{exact:true}).fill('bpc157');await linkCheck(search.locator('[data-product-buy="bpc-157"]').first(),'bpc-157');await search.getByRole('button',{name:'Products',exact:true}).click();await linkCheck(search.locator('[data-product-buy="bpc-157"]'),'bpc-157');await search.locator('[data-product-match="bpc-157"] > button').click();const d=p.locator('[data-product-detail="bpc-157"]');await reachable(d.locator('[data-product-buy]'));await d.getByRole('button',{name:'Close',exact:true}).click();await expect(search.getByLabel('What are you looking for?',{exact:true})).toHaveValue('bpc157');await search.getByRole('button',{name:'Close',exact:true}).click();
   await p.locator('[data-research-launcher]').click();await p.getByRole('button',{name:'What products are studied for weight loss?',exact:true}).click();const cards=p.locator('[data-research-match]');assert.ok(await cards.count()>0);for(const card of await cards.all()){const id=await card.getAttribute('data-research-match');await linkCheck(card.locator('[data-product-buy]'),id);await expect(card.locator('[data-purchase-disclosure]')).toContainText('may earn a commission');}await neutral(p);const card=cards.first();await card.locator('[data-product-buy]').scrollIntoViewIfNeeded();await reachable(card.locator('[data-product-buy]'));await expect(p.getByRole('textbox',{name:'Your research question',exact:true})).toBeVisible();await p.screenshot({path:`${out}/${engine}-research-purchase.png`,fullPage:false});
   assert.equal(external.some(url=>new URL(url).hostname==='www.aminoclub.com'),false,'No partner request before a purchase click');
   const popupPromise=c.waitForEvent('page');await card.locator('[data-product-buy]').click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),destination(await card.getAttribute('data-research-match')));await expect(popup).toHaveTitle('Intercepted partner destination');await popup.close();await expect(p.locator('[data-research-finder]')).toBeVisible();
  });
  if(engine==='chromium')await journey('disclaimer and footer describe the affiliate relationship without partner branding',390,844,'/disclaimer',async p=>{await neutral(p);await expect(p.getByRole('link',{name:'Our partner’s affiliate terms (opens a new tab)',exact:true})).toHaveAttribute('href','https://www.aminoclub.com/us/affiliate-terms');});
  if(engine==='chromium')await journey('direct product pages preserve purchase access without JavaScript',390,844,'/products/glow',async p=>{await reachable(p.locator('[data-product-purchase-dock] [data-product-buy]'));await p.locator('#questions summary').first().click();await expect(p.locator('#questions details').first()).toHaveAttribute('open','');await noOverflow(p);},{javaScriptEnabled:false});
 }finally{await browser.close();}
}
if(errors.length)process.exitCode=1;
await fs.writeFile(`${out}/results.json`,JSON.stringify({results,errors,catalogCount:catalog.length,limitations:['Chromium and WebKit viewport emulation, not physical phone or screen-reader certification.','Partner navigation was intercepted locally. Referral credit, purchases, inventory and payout were not tested.']},null,2));
console.log(JSON.stringify({results,errors}));
