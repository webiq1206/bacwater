import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/calculator-reflow';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch(),c=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'});
await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
const p=await c.newPage(),results=[],errors=[];p.on('pageerror',e=>errors.push(String(e)));
async function check(name,fn){try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}}
async function compactDock(){
 const geometry=await p.evaluate(()=>{const body=document.querySelector('[data-calculator-scroll]'),dock=document.querySelector('[data-calculator-actions]');return {body:body.getBoundingClientRect().height,dock:dock.getBoundingClientRect().height,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,dockOverflow:dock.scrollWidth>dock.clientWidth+1};});
 assert.ok(geometry.body>=220&&geometry.dock<=190&&!geometry.pageOverflow&&!geometry.dockOverflow,JSON.stringify(geometry));
 for(const button of await p.locator('[data-calculator-actions] button').all()){
  const clipped=await button.evaluate(el=>el.scrollWidth>el.clientWidth+1);assert.equal(clipped,false);
  const lines=await button.evaluate(el=>Array.from(el.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE&&/^(Back|Continue)$/i.test(n.textContent.trim())).map(n=>{const r=document.createRange();r.selectNodeContents(n);return r.getClientRects().length;}));
  assert.ok(lines.every(n=>n===1),`Action words split across lines: ${JSON.stringify(lines)}`);
 }
}
try{
 await check('Enlarged guided controls keep complete words and leave space for the form',async()=>{
  await p.goto(origin+'/peptide-calculator');await p.getByRole('combobox',{name:'Product',exact:true}).click();await p.getByRole('option',{name:/Other.*Custom/}).click();await p.getByLabel('Custom peptide name',{exact:true}).fill('Reflow fixture');
  await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByLabel('Vial strength',{exact:true}).fill('12');
  await p.addStyleTag({content:'html{font-size:200%} p,label,input,button,a,summary{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}'});
  await compactDock();await p.getByLabel('Vial strength',{exact:true}).scrollIntoViewIfNeeded();
  const input=await p.getByLabel('Vial strength',{exact:true}).boundingBox(),body=await p.locator('[data-calculator-scroll]').boundingBox();assert.ok(input&&body&&input.y>=body.y-1&&input.y+input.height<=body.y+body.height+1,JSON.stringify({input,body}));
  await p.screenshot({path:out+'/guided-320-enlarged.png',fullPage:false});
 });
 await check('Help stays below the real header after text enlargement',async()=>{
  await p.getByLabel('Open calculator help',{exact:true}).click();await expect(p.getByRole('region',{name:'Calculator help and supplies'})).toBeVisible();
  const bar=await p.locator('[data-calculator-workspace] > header').boundingBox(),help=await p.getByRole('region',{name:'Calculator help and supplies'}).boundingBox();assert.ok(bar&&help&&help.y>=bar.y+bar.height-1,JSON.stringify({bar,help}));
  await p.screenshot({path:out+'/help-320-enlarged.png',fullPage:false});await p.getByRole('button',{name:'Return to calculation',exact:true}).click();await expect(p.getByLabel('Vial strength',{exact:true})).toHaveValue('12');
 });
 await check('Enlarged all-at-once save control remains readable without taking over the viewport',async()=>{
  await p.locator('[data-calculator-scroll]').evaluate(el=>el.scrollTo(0,0));await p.getByRole('button',{name:'All at once',exact:true}).click();await expect(p.locator('[data-calculator-actions] button')).toHaveText(['View calculation', 'Save my plan']);await compactDock();
  await p.getByRole('button',{name:'View calculation',exact:true}).click();await expect(p.locator('[data-live-plan-preview]')).toBeFocused();await expect(p.getByRole('button',{name:'Save my plan',exact:true})).toBeInViewport();
  await p.screenshot({path:out+'/all-at-once-320-enlarged.png',fullPage:false});
 });
 assert.deepEqual(errors,[]);
}catch(e){process.exitCode=1;console.error(e);await p.screenshot({path:out+'/failure.png',fullPage:false}).catch(()=>{});}finally{await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify({date:new Date().toISOString(),results,errors,scope:'Chromium viewport 320x568, 200% root text size and expanded text spacing. Not a physical device or screen-reader test.'},null,2));}
