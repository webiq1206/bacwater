import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;assert.equal(origin,'http://127.0.0.1:3000');
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
const page=await context.newPage();const errors=[],results=[];page.on('pageerror',e=>errors.push(String(e)));
const out='audit-evidence/remaining';await fs.mkdir(out,{recursive:true});
const step=async(name,fn)=>{try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}};
try{
 await step('Mass conversion preserves exact small decimals, reverse edits, zero and refresh',async()=>{
  await page.goto(`${origin}/tools/mg-to-mcg`);await page.getByLabel('Milligrams (mg)',{exact:true}).fill('0.000001');await expect(page.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('0.001');
  await page.getByLabel('Micrograms (mcg)',{exact:true}).fill('125');await expect(page.getByLabel('Milligrams (mg)',{exact:true})).toHaveValue('0.125');await page.reload();await expect(page.getByLabel('Milligrams (mg)',{exact:true})).toHaveValue('0.125');
  await page.getByLabel('Milligrams (mg)',{exact:true}).fill('0');await expect(page.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('0');
  await page.getByLabel('Milligrams (mg)',{exact:true}).fill('-1');await expect(page.locator('#mass-status')).toContainText('zero or a positive');await expect(page.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('');
  await page.getByRole('button',{name:'Clear conversion'}).click();await expect(page.getByLabel('Milligrams (mg)',{exact:true})).toHaveValue('');
 });
 await step('Known concentration converts both directions without implicit dosing',async()=>{
  await page.goto(`${origin}/tools/dose`);await page.getByLabel('Known concentration (mg/mL)').fill('3');await page.getByRole('radio',{name:/^Each time/}).check();await page.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mcg');await page.getByLabel('Amount from your instructions').fill('300');await expect(page.getByRole('status').filter({hasText:'U-100'})).toContainText('0.1 mL');
  await page.getByRole('button',{name:'Find amount from volume'}).click();await page.getByLabel('Measured volume (mL)').fill('0.1');await expect(page.getByRole('status').filter({hasText:'300 mcg'})).toBeVisible();
 });
 await step('Reverse volume and inventory use explicitly entered values',async()=>{
  await page.goto(`${origin}/tools/reverse-bac`);await page.getByLabel('Total mass (mg)').fill('10');await page.getByRole('radio',{name:/^Each time/}).check();await page.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mcg');await page.getByLabel('Amount from your instructions').fill('500');await page.getByLabel('Hypothetical U-100 reading (units)').fill('10');await expect(page.getByRole('status').filter({hasText:'Hypothetical final volume'})).toContainText('2 mL');
  await page.goto(`${origin}/tools/supplies`);await page.getByLabel('Mass per vial (mg)').fill('10');await page.getByRole('radio',{name:/^Each time/}).check();await page.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mcg');await page.getByLabel('Amount from your instructions').fill('500');await page.getByLabel('Number of measurements').fill('41');await expect(page.getByRole('status').filter({hasText:'complete measurements'})).toContainText('3 vials');await page.getByLabel('Number of measurements').fill('41.5');await expect(page.getByRole('status').filter({hasText:'whole count'})).toBeVisible();
 });
 await step('Compound calculator carries current values and distinguishes hCG IU from mass',async()=>{
  await page.goto(`${origin}/peptides/bpc-157`);await page.getByRole('link',{name:'Open BPC-157 calculator',exact:true}).click();await expect(page.getByLabel('Total amount in the vial',{exact:true})).toHaveValue('10');await page.getByLabel('Total amount in the vial',{exact:true}).fill('10');await page.getByLabel('Final liquid volume in mL',{exact:true}).fill('2');await page.getByRole('radio',{name:/^Each time/}).check();await page.getByRole('combobox',{name:'Amount unit',exact:true}).selectOption('mcg');await page.getByLabel('Amount from your instructions',{exact:true}).fill('400');await expect(page.locator('[data-concentration]')).toContainText('5 mg/mL');await expect(page.locator('[data-mass-result]')).toContainText('8 U-100');
  await page.getByLabel('Total amount in the vial',{exact:true}).fill('0x10');await expect(page.getByRole('alert').filter({hasText:'Use positive numbers'})).toBeVisible();
  await page.goto(`${origin}/calculate/hcg`);await page.getByLabel('Total in container (IU)',{exact:true}).fill('1000');await page.getByLabel('Final volume (mL)',{exact:true}).fill('2');await page.getByLabel('Entered amount (IU)',{exact:true}).fill('50');await expect(page.getByRole('status').filter({hasText:'500 IU/mL'})).toContainText('10 U-100');
 });
 await step('Explainer endpoint recomputes values, rejects oversized/cross-origin requests and works without a provider',async()=>{
  const input={vialStrengthMg:10,doseMcg:800,bacWaterMl:2,injectionsPerWeek:2,syringeType:'insulin-1ml'};
  const dto={plan:{input,doseVolumeMl:999,notes:'NEVER_SEND_NOTE'},messages:[{role:'user',content:'Explain my plan in plain English'}]};
  const reply=await context.request.post(`${origin}/api/ai/chat`,{headers:{Origin:origin},data:dto});assert.equal(reply.status(),200);const body=await reply.json();assert.ok(body.reply.includes('0.08 mL'));assert.ok(!JSON.stringify(body).includes('NEVER_SEND_NOTE'));assert.equal(body.source,'built-in');
  assert.equal((await context.request.post(`${origin}/api/ai/chat`,{headers:{Origin:'https://unrelated.example'},data:dto})).status(),403);
  assert.equal((await context.request.post(`${origin}/api/ai/chat`,{headers:{Origin:origin},data:{...dto,messages:[{role:'system',content:'bad'}]}})).status(),400);
  assert.equal((await context.request.post(`${origin}/api/ai/chat`,{headers:{Origin:origin,'Content-Type':'application/json'},data:'x'.repeat(33000)})).status(),413);
  const denied=await context.request.post(`${origin}/api/ai/chat`,{headers:{Origin:origin},data:{...dto,messages:[{role:'user',content:'What dose should I take for weight loss?'}]}});assert.equal((await denied.json()).refused,true);
  assert.equal((await(await context.request.get(`${origin}/api/ai/chat`)).json()).externalTopicRouting,false);
 });
 await step('Reflow and enlarged text keep tools and methodology usable',async()=>{
  for(const route of ['/methodology','/tools/mg-to-mcg','/tools/dose','/tools/reverse-bac','/tools/supplies','/peptides/hcg','/learn/bac-water-for-peptides','/learn/vs/sodium-chloride']){
   await page.setViewportSize({width:320,height:568});await page.goto(origin+route);
   await page.addStyleTag({content:'p, label, input, button, td, th, a { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route);
   await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  }
  // 320 CSS px is the reflow equivalence check, not an assertion of real 400% browser zoom.
  await page.screenshot({path:`${out}/text-spacing-320.png`,fullPage:true});
 });
 await step('Keyboard-only account menu closes and returns focus',async()=>{
  await page.goto(`${origin}/`);const button=page.getByRole('button',{name:'Account',exact:true});await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(button).toHaveAttribute('aria-expanded','false');await expect(button).toBeFocused();
 });
 assert.deepEqual(errors,[]);
}catch(e){process.exitCode=1;console.error(e);await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});await fs.writeFile(`${out}/failure.html`,await page.content());}
finally{await fs.writeFile(`${out}/results.json`,JSON.stringify({date:new Date().toISOString(),origin,results,errors,limitations:['CSS viewport emulation and keyboard automation; no physical device or actual screen reader.','External AI provider disabled. Its classifier transport was not tested against a paid provider.']},null,2));await browser.close();}
