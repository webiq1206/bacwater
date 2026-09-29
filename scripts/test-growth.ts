import assert from 'node:assert/strict';
import vm from 'node:vm';
import { publicToolShareUrl, growthArrivalEvent } from '../src/lib/growth/sharing';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';

assert.equal(publicToolShareUrl('/plan/private-secret'), null);
assert.equal(publicToolShareUrl('/plan/private-secret/edit'), null);
assert.equal(publicToolShareUrl('https://evil.example/'), null);
const shared = publicToolShareUrl('/tools/mg-to-mcg?amount=125&note=private#secret')!;
assert.equal(new URL(shared).pathname,'/tools/mg-to-mcg');
assert.equal(new URL(shared).origin,'https://bacwater.ai');
assert.equal(shared.includes('125'),false);
assert.equal(shared.includes('secret'),false);
assert.equal(growthArrivalEvent('?utm_source=embed&note=private'),'arrival_embed');
assert.equal(growthArrivalEvent('?utm_source=private-patient-name'),null);
assert.equal(growthArrivalEvent('', 'https://www.google.com/search?q=private-health-query'), 'arrival_google');
assert.equal(growthArrivalEvent('', 'https://www.bing.com/search?q=private'), 'arrival_bing');
assert.equal(growthArrivalEvent('', 'https://chatgpt.com/c/private-conversation'), 'arrival_ai_search');
assert.equal(growthArrivalEvent('?utm_source=chatgpt.com'), 'arrival_ai_search');
assert.equal(growthArrivalEvent('', 'https://chatgpt.com.attacker.example/'), null);
assert.equal(growthArrivalEvent('', 'https://bacwater.ai/plan/private-id'), null);
assert.equal(growthArrivalEvent('', 'not a URL'), null);
assert.equal(growthArrivalEvent('?utm_source=embed', 'https://www.google.com/'), 'arrival_embed');

// Exercise the generated distributed script, not just its source helper.
const definitions = new Map<string, any>();
class Element {
  value=''; textContent=''; attrs=new Map(); listeners=new Map(); focused=false;
  setAttribute(k:string,v:string){this.attrs.set(k,v);}
  removeAttribute(k:string){this.attrs.delete(k);}
  addEventListener(k:string,fn:any){this.listeners.set(k,fn);}
  focus(){this.focused=true;}
}
class Host {
  shadowRoot:any;
  attachShadow(){const fields:Record<string,Element>={mg:new Element(),mcg:new Element(),result:new Element(),button:new Element()};return this.shadowRoot={innerHTML:'',fields,getElementById:(id:string)=>fields[id],querySelector:()=>fields.button};}
}
const script=readFileSync('public/embed/mass-converter.js','utf8');
const rebuilt=buildSync({entryPoints:['src/lib/growth/widget-entry.ts'],bundle:true,format:'iife',platform:'browser',target:'es2020',minify:true,write:false}).outputFiles[0].text;
assert.equal(script,rebuilt,'Distributed widget must match its source and the site converter.');
assert.doesNotMatch(script,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\b/);
const context={HTMLElement:Host,customElements:{get:(n:string)=>definitions.get(n),define:(n:string,c:any)=>definitions.set(n,c)}};
vm.runInNewContext(script,context);
vm.runInNewContext(script,context); // duplicate script tags must be harmless
const Widget=definitions.get('bacwater-mass-converter');
const first=new Widget();first.connectedCallback();first.connectedCallback();
const f=first.shadowRoot.fields;
for(const [mg,mcg] of [['0.125','125'],['0','0'],['0.000001','0.001'],['1e-3','1'],['12','12000']]) {
  f.mg.value=mg;f.mg.listeners.get('input')();assert.equal(f.mcg.value,mcg);
}
f.mcg.value='125';f.mcg.listeners.get('input')();assert.equal(f.mg.value,'0.125');
for(const invalid of ['-1','NaN','1,000','12 mg','1e101']) {
  f.mg.value=invalid;f.mg.listeners.get('input')();assert.equal(f.mcg.value,'');assert.equal(f.mg.attrs.get('aria-invalid'),'true');
}
f.button.listeners.get('click')();assert.equal(f.mg.value,'');assert.equal(f.mcg.value,'');assert.equal(f.mg.focused,true);assert.equal(f.mg.attrs.has('aria-invalid'),false);
const second=new Widget();second.connectedCallback();assert.equal(second.shadowRoot.fields.mg.value,'');
console.log('PASS clean share URLs, bounded attribution, and standalone widget conversion, validation, isolation and clear.');
