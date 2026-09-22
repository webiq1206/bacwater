import fs from 'node:fs/promises';
import dns from 'node:dns/promises';
import {chromium} from '@playwright/test';
const out='audit-evidence/public-observation';await fs.mkdir(out,{recursive:true});
const production='https://bacwater.ai', local='http://127.0.0.1:3000';
const result={checkedAt:new Date().toISOString(),requests:[],dns:{},lab:[],limitations:['Public GET requests only. No submissions, login, customer records or vendor messages.','Cloud-runner Chromium emulation is not a real device. Lab observations are not field Core Web Vitals or ranking evidence.','Self-declared crawler user agents do not establish provider identity, successful indexing or a citation.']};
for(const route of ['/version.json','/robots.txt','/sitemap.xml','/llms.txt','/methodology']){
 try{const start=Date.now(),r=await fetch(production+route,{signal:AbortSignal.timeout(20000)});const text=await r.text();result.requests.push({path:route,status:r.status,finalUrl:r.url,elapsedMs:Date.now()-start,headers:Object.fromEntries(r.headers),body:route==='/methodology'?text.slice(0,300):text.slice(0,30000)});}catch(e){result.requests.push({path:route,error:String(e)});}
}
for(const [key,name,kind]of[['mx','bacwater.ai','MX'],['spf','bacwater.ai','TXT'],['dmarc','_dmarc.bacwater.ai','TXT']]){
 try{result.dns[key]={query:name,type:kind,records:await dns.resolve(name,kind)};}catch(e){result.dns[key]={query:name,error:String(e.code||e)};}
}
result.dns.dkim={status:'not verified',reason:'No authorized sender-provider selector inventory was supplied. Selector guessing cannot verify configured delivery.'};
const browser=await chromium.launch();
try{for(const origin of [local,production])for(const path of ['/','/tools/mg-to-mcg','/peptide-calculator'])for(let run=1;run<=3;run++){
 const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await c.route(/google-analytics|googletagmanager|clarity\.ms|doubleclick|googlesyndication/,r=>r.abort());await c.addCookies([{name:'bacwater_age_ok',value:'1',url:origin}]);
 const p=await c.newPage();const session=await c.newCDPSession(p);await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:225000,uploadThroughput:93750});await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.addInitScript(()=>{window.__lab={lcp:0,cls:0,longTasks:0};for(const type of ['largest-contentful-paint','layout-shift','longtask']){try{new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(type==='largest-contentful-paint')window.__lab.lcp=e.startTime;else if(type==='layout-shift'&&!e.hadRecentInput)window.__lab.cls+=e.value;else if(type==='longtask')window.__lab.longTasks+=1;})).observe({type,buffered:true});}catch{}}});
 try{const r=await p.goto(origin+path,{waitUntil:'load',timeout:45000});await p.waitForTimeout(3500);const values=await p.evaluate(()=>({status:window.__lab,navigation:performance.getEntriesByType('navigation').map(n=>({ttfb:n.responseStart-n.requestStart,domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})),resources:performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,transferSize:r.transferSize,duration:r.duration})),overflow:document.documentElement.scrollWidth>innerWidth+1}));result.lab.push({origin,path,run,http:r.status(),viewport:'390x844',cpuSlowdown:4,network:{latencyMs:150,downloadBytesPerSecond:225000,uploadBytesPerSecond:93750},...values});if(run===1)await p.screenshot({path:out+'/'+(origin===local?'test':'live')+'-'+path.replace(/[^a-z0-9]/gi,'_')+'.png',fullPage:true});}catch(e){result.lab.push({origin,path,run,error:String(e)});}finally{await c.close();}
 }}finally{await browser.close();await fs.writeFile(out+'/results.json',JSON.stringify(result,null,2));}
console.log(JSON.stringify({requests:result.requests.map(r=>({path:r.path,status:r.status,error:r.error})),labRuns:result.lab.length}));
