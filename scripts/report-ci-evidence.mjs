/** Log-only evidence: no uploads, cache writes, private values or credentials. */
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';
const root='audit-evidence';
const sha=value=>createHash('sha256').update(value).digest('hex');
const safe=value=>String(value).replace(/https?:\/\/\S+/g,'[URL]').replace(/[A-Za-z0-9_-]{40,}/g,'[identifier]').slice(0,300);
console.log(JSON.stringify({kind:'verification-identity',commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),tree:execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),jobStatus:process.env.VERIFY_JOB_STATUS||'local',storage:'log only; no artifact or cache upload'}));
async function walk(dir){
 const entries=await readdir(dir,{withFileTypes:true}).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
 for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.isSymbolicLink())continue;
  const path=join(dir,entry.name);
  if(entry.isDirectory()){await walk(path);continue;}
  if(!entry.isFile())continue;
  const bytes=await readFile(path);
  console.log(JSON.stringify({kind:'evidence-file',path:safe(relative(root,path)),bytes:bytes.length,sha256:sha(bytes)}));
  if(!path.endsWith('.json'))continue;
  const data=JSON.parse(bytes.toString('utf8'));
  const rows=Array.isArray(data)?data:Array.isArray(data.results)?data.results:[];
  const checks=rows.filter(r=>r&&typeof r==='object'&&typeof r.status==='string');
  if(checks.length)console.log(JSON.stringify({kind:'check-outcomes',path:safe(relative(root,path)),checks:checks.map(r=>({name:safe(r.name||r.title||r.path||'check'),engine:r.engine,status:r.status,errorPresent:Boolean(r.error)}))}));
 }
}
await walk(root);
