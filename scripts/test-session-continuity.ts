import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { buildSync } from "esbuild";
import { amountSchedule, eachAmountText } from "@/lib/calc/amount-schedule";
import { calculate } from "@/lib/calc";
import { productCalculation, emptyProductValues } from "@/lib/partners/product-calculation";
import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import type * as Store from "@/lib/session/calculation-session";
const checks: string[] = [];
function check(name: string, run: () => void) { run(); checks.push(name); console.log("PASS", name); }
const require = createRequire(import.meta.url);
const bundle = buildSync({ entryPoints:["src/lib/session/calculation-session.ts"],bundle:true,platform:"node",format:"cjs",packages:"external",write:false,tsconfig:"tsconfig.json" }).outputFiles[0].text;
function fresh(backing = new Map<string,string>(), blocked=false): typeof Store {
  const module={exports:{}};
  const sessionStorage={getItem:(k:string)=>{if(blocked)throw Error("Storage disabled");return backing.get(k)||null;},setItem:(k:string,v:string)=>{if(blocked)throw Error("Storage disabled");backing.set(k,v);},removeItem:(k:string)=>{if(blocked)throw Error("Storage disabled");backing.delete(k);}};
  vm.runInNewContext(bundle,{module,exports:module.exports,require,window:{sessionStorage},console},{timeout:1000});
  return module.exports as typeof Store;
}
const base={amount:"2",amountUnit:"mg" as const,basis:"each" as const,timesPerWeek:"2"};
check("A per-time amount is not divided when frequency changes",()=>{
  for(const count of [1,2,3,7,14,21,28]) { const r=amountSchedule({...base,timesPerWeek:String(count)});assert.equal(r.ready,true);assert.equal(r.eachMcg,2000);assert.equal(r.weeklyMcg,2000*count); }
});
check("Weekly total is divided exactly once",()=>{const r=amountSchedule({...base,basis:"week"});assert.equal(r.eachMcg,1000);assert.equal(r.weeklyMcg,2000);});
check("Daily total is divided by times per day, not times per week",()=>{const r=amountSchedule({...base,basis:"day",timesPerWeek:"14"});assert.equal(r.eachMcg,1000);assert.equal(r.weeklyMcg,14000);});
check("Once daily means seven times weekly; once weekly means one",()=>{assert.equal(amountSchedule({...base,timesPerWeek:"7"}).weeklyMcg,14000);assert.equal(amountSchedule({...base,timesPerWeek:"1"}).weeklyMcg,2000);});
check("No schedule means no inferred weekly recommendation",()=>{const r=amountSchedule({...base,timesPerWeek:""});assert.equal(r.ready,true);assert.equal(r.scheduled,false);assert.equal(r.eachMcg,2000);});
check("Daily or weekly totals cannot calculate without an explicit count",()=>{for(const basis of ["day","week"] as const)assert.equal(amountSchedule({...base,basis,timesPerWeek:""}).ready,false);});
check("Daily totals reject weekly-only or fractional daily schedules",()=>{for(const n of [1,2,3,4,8,15])assert.equal(amountSchedule({...base,basis:"day",timesPerWeek:String(n)}).ready,false);});
check("Invalid amounts and frequencies do not produce stale results",()=>{
  for(const value of ["","0","-1","NaN","Infinity","2mg","1,000","1e999","0x10"," "])assert.equal(amountSchedule({...base,amount:value}).ready,false);
  for(const n of ["0","-1","1.5","29","100","NaN","2 days","1e1"])assert.equal(amountSchedule({...base,timesPerWeek:n}).ready,false);
});
check("Mass units have identical meaning",()=>{assert.equal(amountSchedule({...base,amount:"0.3"}).eachMcg,300);assert.equal(amountSchedule({...base,amount:"300",amountUnit:"mcg"}).eachMcg,300);});
check("Existing saved-plan engine retains its weekly-total contract",()=>{
  for(const [basis,ml] of [["each",0.1],["week",0.05]] as const){const r=amountSchedule({...base,basis});const c=calculate({vialStrengthMg:40,bacWaterMl:2,doseMcg:r.weeklyMcg,injectionsPerWeek:r.count,syringeType:"insulin-1ml"});assert.equal(c.errors.length,0);assert.equal(c.doseVolumeMl,ml);}
});
check("Homepage to selected product retains 40 mg and 2 mL immediately",()=>{
  const backing=new Map<string,string>(),s=fresh(backing);s.patchCalculation({vialInput:"40",finalVolume:"2"});s.chooseCalculationProduct("glp-3","single","retatrutide");const c=s.readCalculation();assert.equal(c.vialInput,"40");assert.equal(c.finalVolume,"2");assert.equal(c.carried,true);assert.equal(Number(c.vialInput)/Number(c.finalVolume),20);
  const sameTab=fresh(backing);assert.equal(sameTab.readCalculation().vialInput,"40");assert.equal(sameTab.readCalculation().productId,"glp-3");
});
check("Every single-compound catalog selection preserves compatible entries",()=>{const s=fresh();s.patchCalculation({vialInput:"40",finalVolume:"2",...base});for(const p of SUPPLIER_PRODUCTS.filter(p=>p.kind==="single")){s.chooseCalculationProduct(p.id,p.kind,p.reference||"");const c=s.readCalculation();assert.equal(c.vialInput,"40",p.id);assert.equal(c.amount,"2",p.id);assert.equal(c.basis,"each",p.id);assert.equal(c.timesPerWeek,"2",p.id);}});
check("Product, planner and hero use the same per-time amount",()=>{const s=fresh();s.patchCalculation({vialInput:"40",finalVolume:"2",...base,basis:"week"});s.chooseCalculationProduct("glp-3","single","retatrutide");const c=s.readCalculation();const p=SUPPLIER_PRODUCTS.find(p=>p.id==="glp-3")!;const result=productCalculation(p,{...emptyProductValues(),total:c.vialInput,volume:c.finalVolume,amount:eachAmountText(c)});assert.equal(result.ready,true);assert.match(result.text,/0\.05 mL = 5 U-100/);});
check("Unit switches preserve exact mass and the selected schedule",()=>{const s=fresh();s.patchCalculation({...base,vialInput:"40",finalVolume:"2"});s.setMassUnit("vial","mcg");assert.equal(s.readCalculation().vialInput,"40000");s.setMassUnit("vial","mg");assert.equal(s.readCalculation().vialInput,"40");s.setMassUnit("amount","mcg");assert.equal(s.readCalculation().amount,"2000");assert.equal(s.readCalculation().timesPerWeek,"2");s.setMassUnit("amount","mg");assert.equal(s.readCalculation().amount,"2");});
check("Invalid text cannot be relabeled as a different unit",()=>{const s=fresh();s.patchCalculation({amount:"1..5",amountUnit:"mg"});s.setMassUnit("amount","mcg");assert.equal(s.readCalculation().amountUnit,"mg");assert.equal(s.readCalculation().amount,"1..5");});
check("IU, blends, water and ready-made solutions never inherit mass or dose",()=>{for(const kind of ["iu","blend","water","spray"] as const){const s=fresh();s.patchCalculation({vialInput:"40",finalVolume:"2",...base});s.chooseCalculationProduct("different",kind);assert.equal(s.readCalculation().vialInput,"");assert.equal(s.readCalculation().amount,"");assert.equal(s.readCalculation().timesPerWeek,"");s.resumeMassCalculation();assert.equal(s.readCalculation().vialInput,"40");assert.equal(s.readCalculation().amount,"2");assert.equal(s.readCalculation().timesPerWeek,"2");}});
check("Clear prevents values returning through a remembered context or legacy hero draft",()=>{const backing=new Map<string,string>([["bacwater.heroDraft.v1",JSON.stringify({values:{amount:"40",volume:"2",target:"2",targetUnit:"mg"}})]]);const s=fresh(backing);assert.equal(s.readCalculation().vialInput,"40");s.chooseCalculationProduct("water","water");s.clearCalculation();s.resumeMassCalculation();assert.equal(s.readCalculation().vialInput,"");assert.equal(fresh(backing).readCalculation().amount,"");});
check("Distinct tab storage does not share edits",()=>{const a=fresh(),b=fresh();a.patchCalculation({vialInput:"40"});assert.equal(b.readCalculation().vialInput,"");});
check("Unavailable storage keeps client navigation data in memory without throwing",()=>{const s=fresh(new Map(),true);s.patchCalculation({vialInput:"40",finalVolume:"2"});s.chooseCalculationProduct("glp-3","single");assert.equal(s.readCalculation().vialInput,"40");assert.equal(s.readCalculation().finalVolume,"2");});
check("Malformed, oversized and wrong-version session records fail closed",()=>{for(const raw of ["{","null","[]",'"x"',JSON.stringify({version:2,shared:{vialInput:"99"}}),"x".repeat(250001)]){const s=fresh(new Map([["bacwater.calculationSession.v1",raw]]));assert.equal(s.readCalculation().vialInput,"");}});
check("Corrupt unit and period discriminators cannot reinterpret a stored number",()=>{const s=fresh();for(const patch of [{vialInput:"40",vialUnit:"IU"},{amount:"2",amountUnit:"IU"},{amount:"2",basis:"unknown"}]){const x=s.sanitizeShared(patch);assert.equal(patch.vialInput?x.vialInput:x.amount,"");}});
check("Shared state is not transmitted in URLs, analytics or network requests",()=>{const source=fs.readFileSync("src/lib/session/calculation-session.ts","utf8");assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|trackUsage|localStorage|searchParams|location\./);assert.match(source,/sessionStorage/);});
check("Saved-plan edits are isolated; new plans use the shared session",()=>{const form=fs.readFileSync("src/components/plan/plan-form.tsx","utf8");assert.match(form,/isolated\?local:session\[key\]/);assert.doesNotMatch(form,/localStorage\.(setItem|getItem).*planDraft/);assert.match(form,/doseMcg = scheduleResult.ready \? scheduleResult.weeklyMcg/);assert.match(form,/How much, and how often\?/);});
fs.mkdirSync("audit-evidence/session-continuity",{recursive:true});fs.writeFileSync("audit-evidence/session-continuity/unit-results.json",JSON.stringify({passed:checks.length,checks,limits:["Pure arithmetic, isolated storage, state-transition and source-contract tests. Not browser UI tests.","A newly opened tab can initially inherit a browser copy of opener sessionStorage; subsequent edits remain independent."]},null,2));
console.log(`${checks.length} session and schedule groups passed.`);
