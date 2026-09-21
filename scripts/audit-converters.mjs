import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const origin = process.env.AUDIT_ORIGIN; assert.equal(origin, 'http://127.0.0.1:3000');
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:320,height:844}});
await context.route('**/*',r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
const page = await context.newPage(); const results=[];
const step=async(name,fn)=>{try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}};
try {
  await page.goto(`${origin}/tools/syringe-units`);
  await step('Convert units to mL',async()=>{await page.getByLabel('U-100 syringe units',{exact:true}).fill('25');await expect(page.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('0.25');});
  await step('Convert mL to units and retain values on refresh',async()=>{await page.getByLabel('Milliliters (mL)',{exact:true}).fill('0.08');await expect(page.getByLabel('U-100 syringe units',{exact:true})).toHaveValue('8');await page.reload();await expect(page.getByLabel('U-100 syringe units',{exact:true})).toHaveValue('8');});
  await step('Reject negative values without displaying a valid result',async()=>{await page.getByLabel('U-100 syringe units',{exact:true}).fill('-1');await expect(page.locator('#u100-error')).toHaveAttribute('role','alert');await expect(page.locator('#u100-error')).toContainText('non-negative');await expect(page.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('');});
  await step('Handle zero, small decimals and explicit clearing',async()=>{await page.getByLabel('U-100 syringe units',{exact:true}).fill('0');await expect(page.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('0');await page.getByLabel('U-100 syringe units',{exact:true}).fill('0.001');await expect(page.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('0.00001');await page.getByRole('button',{name:'Clear values'}).click();await expect(page.getByLabel('U-100 syringe units',{exact:true})).toHaveValue('');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);});
  await fs.mkdir('audit-evidence/converters',{recursive:true});await page.screenshot({path:'audit-evidence/converters/mobile-320.png',fullPage:true});
} catch(e){console.error(e);process.exitCode=1;}
finally {await fs.mkdir('audit-evidence/converters',{recursive:true});await fs.writeFile('audit-evidence/converters/results.json',JSON.stringify({environment:'Chromium, 320 CSS pixels, localhost',results},null,2));await browser.close();}
