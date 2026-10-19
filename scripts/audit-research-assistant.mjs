/** Run against the isolated CI build, never a production session. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {chromium,webkit,expect} from '@playwright/test';
const origin=process.env.AUDIT_ORIGIN;
assert.equal(origin,'http://127.0.0.1:3000');
const out='audit-evidence/research-assistant';await fs.mkdir(out,{recursive:true});
const require=createRequire(import.meta.url),axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8'),results=[];
async function check(name,fn){try{await fn();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:String(e)});process.exitCode=1;}}
for(const [engine,driver] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await driver.launch();
 try{
  for(const [width,height] of [[320,568],[375,667],[390,844],[768,1024],[1024,768],[1440,900]])await check(`${engine} ${width}x${height}: contained chat, research, tools, nested details and restoration`,async()=>{
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
   await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
   try{
    await page.goto(origin,{waitUntil:'networkidle'});
    if(width>=1024)await expect(page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Products',exact:true})).toBeVisible();
    const launch=page.getByRole('button',{name:'Open research assistant',exact:true});
    const calc=await page.locator('[data-hero-calculator]').boundingBox(),launchBox=await launch.boundingBox();
    assert.ok(calc&&calc.y>=0&&calc.y+calc.height<=height,JSON.stringify({calc,width,height}));
    if(width<=780)assert.ok(calc.y+calc.height<=launchBox.y+1,'Launcher must not cover the calculator');
    await page.evaluate(()=>window.scrollTo(0,400));const before=await page.evaluate(()=>scrollY);
    await launch.click();const panel=page.locator('[data-research-panel]'),input=panel.getByRole('textbox',{name:'Your research question'});
    await expect(panel.getByRole('heading',{name:'Research assistant',exact:true})).toBeFocused();
    async function contained(){for(const selector of ['[data-research-panel]','[data-research-panel] textarea','[data-research-panel] button[aria-label="Send research question"]','[data-research-panel] button[aria-label="Close research assistant"]']){const box=await page.locator(selector).boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=(page.viewportSize()?.height||height)+1,JSON.stringify({selector,box,width,height}));}assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
    await contained();await expect(panel.getByRole('button',{name:/^What products are studied for /})).toHaveCount(6);if([390,1440].includes(width))await page.screenshot({path:`${out}/${engine}-${width}-suggestions.png`});await panel.getByRole('button',{name:'What products are studied for weight loss?',exact:true}).click();await expect(panel.locator('[data-research-match]')).toHaveCount(3);await panel.getByRole('button',{name:'New chat'}).click();await input.fill('what could help with weight loss');await input.press('Enter');
    await expect(panel.locator('[data-research-match]')).toHaveCount(3);await expect(panel).toContainText('Research products only.');await expect(input).toBeFocused();
    assert.equal(await page.evaluate(()=>scrollY),before);
    const card=panel.locator('[data-research-match="glp-1"]');await card.locator('summary').click();await expect(card).toContainText('STEP 1');await expect(card.locator('a[href="https://pubmed.ncbi.nlm.nih.gov/33567185/"]')).toBeVisible();
    await card.getByRole('button',{name:/Read research details/}).click();await expect(page.getByRole('dialog').last()).toContainText('View Full Details');await page.keyboard.press('Escape');await expect(panel).toBeVisible();
    await input.fill('Which product should I take to lose weight?');await input.press('Enter');
    const last=panel.locator('section[aria-labelledby]').last();await expect(last).toContainText('licensed health professional');await expect(last.locator('[data-research-match]')).toHaveCount(0);
    await input.fill('Explain weight-loss research');await input.press('Enter');await expect(panel.locator('section[aria-labelledby]').last().locator('[data-research-match]')).toHaveCount(3);
    await input.fill('Can I use the calculator?');await input.press('Enter');await expect(panel.locator('section[aria-labelledby]').last().getByRole('link',{name:'Product-first calculator'})).toHaveAttribute('href','/peptide-calculator');
    await input.fill('draft stays');await input.press('Shift+Enter');await expect(input).toHaveValue('draft stays\n');
    await panel.getByRole('button',{name:'Close research assistant'}).click();await expect(launch).toBeFocused();assert.equal(await page.evaluate(()=>scrollY),before);
    await launch.click();await expect(input).toHaveValue('draft stays\n');
    // Resize models a reduced viewport; physical iOS/Android keyboards still need a device pass.
    if(width<=780){await page.setViewportSize({width,height:360});await expect.poll(()=>panel.evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(348);await contained();await input.fill('cell movement');await input.press('Enter');await contained();await page.setViewportSize({width,height});}
    await panel.getByRole('link',{name:'Browse products',exact:true}).click();await expect(page).toHaveURL(origin+'/recommendations');await expect(panel).toHaveCount(0);await page.getByRole('button',{name:'Open research assistant',exact:true}).click();await expect(panel.locator('[data-research-match]')).not.toHaveCount(0);
    await page.screenshot({path:`${out}/${engine}-${width}.png`});await page.evaluate(axe);
    const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(violations,[]);
    await panel.getByRole('button',{name:'New chat'}).click();await expect(panel.locator('[data-research-match]')).toHaveCount(0);await expect(input).toHaveValue('');assert.deepEqual(errors,[]);
   }finally{await context.close();}
  });
  await check(`${engine}: direct page and menu entry`,async()=>{
   const context=await browser.newContext({viewport:{width:390,height:844}});await context.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);const page=await context.newPage();
   try{await page.goto(origin,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('navigation',{name:'Expanded mobile navigation'}).getByRole('link',{name:'Products',exact:true})).toHaveAttribute('href','/recommendations');await page.getByRole('navigation',{name:'Expanded mobile navigation'}).getByRole('button',{name:'Research assistant',exact:true}).click();await expect(page.locator('[data-research-panel]')).toBeVisible();await page.keyboard.press('Escape');await page.goto(origin+'/research-finder',{waitUntil:'networkidle'});const input=page.getByRole('textbox',{name:'Your research question'});await input.fill('Weight-loss research');await input.press('Enter');await expect(page.locator('[data-research-match]')).toHaveCount(3);const box=await input.boundingBox();assert.ok(box.y+box.height<=844);await page.setViewportSize({width:390,height:360});await expect.poll(()=>page.locator('[data-research-page]').evaluate(el=>Math.round(el.getBoundingClientRect().height))).toBe(360);await expect(input).toBeInViewport();}finally{await context.close();}
  });
 }finally{await browser.close();}
}
await fs.writeFile(`${out}/results.json`,JSON.stringify({results,limitations:['Browser viewport and reduced-height emulation, not a physical phone keyboard or screen-reader certification.','No production database, medical advice, external messages or purchases used.']},null,2));console.log(JSON.stringify(results));
