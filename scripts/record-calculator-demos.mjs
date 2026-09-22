/** Original, silent recordings of the actual local UI. Never record customer data. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/demos';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();
const demos=[
 {id:'mass-prefix',path:'/tools/mg-to-mcg',title:'mg and mcg are two ways to write the same mass',captions:['0 to 6 seconds: Enter 0.125 mg.','6 to 14 seconds: The converter shows 125 mcg.','14 to 22 seconds: Edit the other field to reverse the relationship.','22 to 30 seconds: Mass alone does not specify mL or a syringe reading.'],run:async(p)=>{await p.getByLabel('Milligrams (mg)',{exact:true}).fill('0.125');await expect(p.getByLabel('Micrograms (mcg)',{exact:true})).toHaveValue('125');await p.waitForTimeout(8000);await p.getByLabel('Micrograms (mcg)',{exact:true}).fill('500');await p.waitForTimeout(8000);}},
 {id:'u100-scale',path:'/tools/syringe-units',title:'A U-100 unit is a volume-scale marking, not a milligram',captions:['0 to 6 seconds: Enter 25 U-100 units.','6 to 14 seconds: The converter shows 0.25 mL.','14 to 22 seconds: Reverse it with 0.08 mL, which is 8 U-100 units.','22 to 30 seconds: Check the actual device scale. Capacity and tick spacing are separate.'],run:async(p)=>{await p.getByLabel('U-100 syringe units',{exact:true}).fill('25');await expect(p.getByLabel('Milliliters (mL)',{exact:true})).toHaveValue('0.25');await p.waitForTimeout(8000);await p.getByLabel('Milliliters (mL)',{exact:true}).fill('0.08');await p.waitForTimeout(8000);}},
 {id:'concentration-volume',path:'/tools/dose',title:'Use known concentration to check an entered amount',captions:['0 to 6 seconds: Enter a known concentration of 3 mg/mL.','6 to 14 seconds: Enter 300 mcg as an arithmetic example.','14 to 22 seconds: The result is 0.1 mL, equal to 10 U-100 units.','22 to 30 seconds: The calculation does not choose a treatment, preparation or device.'],run:async(p)=>{await p.getByLabel('Known concentration (mg/mL)').fill('3');await p.waitForTimeout(4000);await p.getByLabel('Entered amount (mcg)').fill('300');await expect(p.getByRole('status').filter({hasText:'0.1 mL'})).toBeVisible();await p.waitForTimeout(12000);}},
];
const manifest=[];
try{for(const d of demos){
 const c=await browser.newContext({viewport:{width:430,height:900},reducedMotion:'reduce',recordVideo:{dir:out,size:{width:430,height:900}}});
 await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
 const p=await c.newPage();const start=Date.now();await p.goto(origin+d.path);await p.waitForTimeout(4000);await d.run(p);await p.getByRole('heading',{level:1}).scrollIntoViewIfNeeded();await p.waitForTimeout(Math.max(0,30000-(Date.now()-start)));
 const video=p.video();await c.close();await video.saveAs(`${out}/${d.id}.webm`);await video.delete();
 const vtt='WEBVTT\n\n'+d.captions.map((text,i)=>`${i+1}\n00:00:${String([0,6,14,22][i]).padStart(2,'0')}.000 --> 00:00:${String([6,14,22,30][i]).padStart(2,'0')}.000\n${text.replace(/^.*seconds: /,'')}\n`).join('\n');await fs.writeFile(`${out}/${d.id}.vtt`,vtt);await fs.writeFile(`${out}/${d.id}.txt`,`${d.title}\n\nSilent screen recording of BACwater.ai test build. Compound-neutral examples, not treatment advice.\n\n${d.captions.join('\n')}`);
 manifest.push({id:d.id,title:d.title,page:d.path,video:`${d.id}.webm`,captions:`${d.id}.vtt`,transcript:`${d.id}.txt`,durationTargetSeconds:30,producedAt:new Date().toISOString(),source:'Original screen recording of this code revision, no customer data or third-party imagery',publication:'not uploaded to external social accounts',limitations:'Silent demonstration. Captions describe actions; recorded timing may vary slightly with rendering.'});
}}
finally{await browser.close();await fs.writeFile(`${out}/manifest.json`,JSON.stringify(manifest,null,2));}
