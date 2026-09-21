import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
const origin = process.env.AUDIT_ORIGIN || '';
const db = new URL(process.env.DATABASE_URL || 'postgresql://invalid/invalid');
assert.equal(origin, 'http://127.0.0.1:3000', 'Writes are restricted to the disposable local test site.');
assert.equal(db.hostname, '127.0.0.1'); assert.equal(db.pathname, '/bacwater_audit');
for (const key of ['RESEND_API_KEY','ANTHROPIC_API_KEY','STRIPE_SECRET_KEY']) assert.ok(!process.env[key], 'No live provider credentials permitted.');
const out = 'audit-evidence/journeys'; await fs.mkdir(out,{recursive:true});
const prisma = new PrismaClient(); const browser = await chromium.launch();
const prefix = `audit-${Date.now()}`; const email = `${prefix}@example.test`;
const results = []; const planIds = []; const contactIds = []; const userIds = [];
const errors = [];
async function context(width=390) {
  const c=await browser.newContext({viewport:{width,height:900}});
  await c.route('**/*',(r)=>new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
  await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
  return c;
}
async function step(name,fn) {try {await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});throw e;}}
const owner=await context(1440), stranger=await context(390);
const page=await owner.newPage(); page.on('pageerror',(e)=>errors.push(String(e)));
let publicId, notesRequest;
try {
  await step('Load blank wizard and switch to all-at-once layout',async()=>{
    await page.goto(`${origin}/plan`); await page.getByRole('button',{name:'All at once',exact:true}).click();
    await expect(page.getByRole('combobox',{name:'Primary compound',exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Save my plan',exact:true})).toBeDisabled();
  });
  await step('Enter label inputs and save a guest plan',async()=>{
    await page.getByRole('combobox',{name:'Primary compound',exact:true}).click();
    await page.getByRole('option',{name:/Other.*Custom/}).click();
    await page.getByLabel('Custom peptide name',{exact:true}).fill(`${prefix} compound`);
    await page.getByRole('button',{name:'Other size...',exact:true}).click();
    await page.getByLabel('Vial strength',{exact:true}).fill('10');
    await page.getByLabel('Dose amount',{exact:true}).fill('0.4');
    await page.getByLabel('Final liquid volume in mL',{exact:true}).fill('2');
    await page.getByRole('button',{name:'Save my plan',exact:true}).click();
    await expect(page.getByRole('dialog')).toContainText('Plan saved');
    const local=await page.evaluate(()=>JSON.parse(localStorage.getItem('bacwater.savedPlans')||'[]'));
    assert.ok(local[0]?.publicId); publicId=local[0].publicId; planIds.push(publicId);
    assert.ok(local[0].claimToken?.length===24);
    const saved=await prisma.plan.findUniqueOrThrow({where:{publicId}});
    assert.equal(saved.userId,null); assert.equal(saved.vialStrengthMg,10); assert.equal(saved.doseMcg,400);
    assert.equal(saved.bacWaterMl,2); assert.equal(saved.finalConcentrationMgPerMl,5); assert.equal(saved.doseVolumeMl,0.08);
    assert.equal(saved.expirationDate,null);
    await page.getByRole('button',{name:'Continue without an account'}).click();
    await expect(page).toHaveURL(`${origin}/plan/${publicId}`);
  });
  await step('Owner can save private notes; capture the real server action request',async()=>{
    await expect(page.getByLabel('Private plan notes')).toBeVisible();
    await page.getByLabel('Private plan notes').fill(`${prefix} PRIVATE NOTE`);
    const request=page.waitForRequest((r)=>r.method()==='POST'&&Boolean(r.headers()['next-action']));
    await page.getByRole('button',{name:'Save notes',exact:true}).click(); notesRequest=await request;
    await expect.poll(async()=>(await prisma.plan.findUnique({where:{publicId}}))?.notes).toBe(`${prefix} PRIVATE NOTE`);
    await page.screenshot({path:`${out}/owner-saved-plan.png`,fullPage:true});
  });
  await step('Shared viewer cannot see private notes or use edit routes',async()=>{
    const p=await stranger.newPage();await p.goto(`${origin}/plan/${publicId}`);
    await expect(p.getByLabel('Private plan notes')).toHaveCount(0);
    assert.equal((await p.content()).includes(`${prefix} PRIVATE NOTE`),false);
    await p.goto(`${origin}/plan/${publicId}/edit`);await expect(p).toHaveURL(`${origin}/plan/${publicId}`);
    await p.screenshot({path:`${out}/shared-read-only.png`,fullPage:true});await p.close();
  });
  await step('Server rejects replayed owner write from an unrelated browser',async()=>{
    const headers=notesRequest.headers(); const response=await stranger.request.post(notesRequest.url(),{
      headers:{'Next-Action':headers['next-action'],'Content-Type':headers['content-type'],Origin:origin},
      data:notesRequest.postData(),
    });
    const body=await response.text();assert.ok(body.includes('Not authorized')||response.status()===403,body.slice(0,400));
    const saved=await prisma.plan.findUniqueOrThrow({where:{publicId}});assert.equal(saved.notes,`${prefix} PRIVATE NOTE`);
  });
  await step('Owner and public PDF routes return valid PDFs without shared caching',async()=>{
    for(const [name,c]of[['owner',owner],['shared',stranger]]){
      const response=await c.request.get(`${origin}/plan/${publicId}/pdf`);assert.equal(response.status(),200);
      const bytes=await response.body();assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
      assert.ok(response.headers()['cache-control']?.includes('no-store'));assert.ok(response.headers()['x-robots-tag']?.includes('noindex'));
      await fs.writeFile(`${out}/${name}.pdf`,bytes);
    }
  });
  await step('Contact record is actually saved once and retry is idempotent',async()=>{
    const p=await stranger.newPage();await p.goto(`${origin}/contact`);
    await p.getByLabel('Name',{exact:true}).fill(prefix);await p.getByLabel('Email',{exact:true}).fill(email);
    await p.getByLabel('Message',{exact:true}).fill(`${prefix} controlled contact fixture`);
    const request=p.waitForRequest((r)=>r.method()==='POST'&&Boolean(r.headers()['next-action']));
    await p.getByRole('button',{name:'Send message',exact:true}).click();const actual=await request;
    await expect(p.getByRole('heading',{name:'Your message has been saved.'})).toBeVisible();
    const rows=await prisma.contactMessage.findMany({where:{email}});assert.equal(rows.length,1);contactIds.push(rows[0].id);
    const h=actual.headers();await stranger.request.post(actual.url(),{headers:{'Next-Action':h['next-action'],'Content-Type':h['content-type'],Origin:origin},data:actual.postData()});
    assert.equal(await prisma.contactMessage.count({where:{email}}),1);await p.close();
  });
  await step('Signup creates an ordinary user, and guest plans are claimed by their creator',async()=>{
    await page.goto(`${origin}/signup`);await page.getByLabel('Your name').fill(prefix);await page.getByLabel('Email',{exact:true}).fill(email);
    await page.getByLabel('Password (6+ characters)').fill('FixtureOnly!93842');
    await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page).toHaveURL(`${origin}/plans`);
    const u=await prisma.user.findUniqueOrThrow({where:{email}});userIds.push(u.id);assert.equal(u.role,'user');
    await expect.poll(async()=>(await prisma.plan.findUnique({where:{publicId}}))?.userId).toBe(u.id);
    await page.goto(`${origin}/admin`);await expect(page).not.toHaveURL(/\/admin/);
  });
  await step('Stored role changes are enforced on the next authenticated request',async()=>{
    const id=userIds[0];await prisma.user.update({where:{id},data:{role:'admin'}});
    await page.goto(`${origin}/admin`);await expect(page).toHaveURL(/\/admin/);
    await prisma.user.update({where:{id},data:{role:'user'}});
    await page.goto(`${origin}/admin`);await expect(page).not.toHaveURL(/\/admin/);
  });
  await step('No browser runtime errors occurred during these journeys',async()=>assert.deepEqual(errors,[]));
} catch(e){
  await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});
  await fs.writeFile(`${out}/failure-dom.html`,await page.content().catch(()=>''));process.exitCode=1;
} finally {
  await fs.writeFile(`${out}/results.json`,JSON.stringify({date:new Date().toISOString(),origin,environment:'disposable PostgreSQL and Chromium viewport emulation',results,errors,limitations:['No real email delivery, OAuth provider, GA4 receiving system or physical device was tested.','The test fixture contains no customer data.']},null,2));
  await prisma.plan.deleteMany({where:{publicId:{in:planIds}}});
  await prisma.contactMessage.deleteMany({where:{id:{in:contactIds}}});
  await prisma.user.deleteMany({where:{email}});
  await prisma.$disconnect();await browser.close();
}
console.log(JSON.stringify(results));
