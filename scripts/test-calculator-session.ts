import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate, type CalcInput } from "../src/lib/calc";
import { amountSchedule, scheduleLabel, amountScheduleText } from "../src/lib/calc/amount-schedule";
import { CALCULATOR_SESSION_KEY, EMPTY_MASS, parseMassDraft, readCalculatorSession, serverCalculatorSession, subscribeCalculatorSession, patchMassDraft, clearMassNumbers, selectMassProduct, writeSessionTool, massText, sessionToolValue } from "../src/lib/calculator-session";
import { parseExplanation } from "../src/lib/ai/explainer";
import { productCalculation, emptyProductValues } from "../src/lib/partners/product-calculation";
import { SUPPLIER_PRODUCTS } from "../src/lib/partners/supplier-catalog";
let count=0;
function test(name:string,fn:()=>void){fn();count++;console.log(`PASS session/schedule: ${name}`);}
const base:CalcInput={vialStrengthMg:40,doseMcg:4000,bacWaterMl:2,syringeType:"insulin-1ml"};
test("Each-time and weekly totals are different, explicit interpretations",()=>{
 const each=amountSchedule({amount:"4",unit:"mg",basis:"each",frequency:2});
 const week=amountSchedule({amount:"4",unit:"mg",basis:"week",frequency:2});
 assert.equal(each.kind,"value");assert.equal(week.kind,"value");
 if(each.kind==="value"&&week.kind==="value"){
  assert.equal(each.eachMcg,4000);assert.equal(each.weeklyMcg,8000);assert.equal(week.eachMcg,2000);assert.equal(week.weeklyMcg,4000);
 }
});
test("Changing frequency never divides an explicitly per-time amount",()=>{
 for(const n of [1,2,3,7,14,28]){
  const r=calculate({...base,amountBasis:"each",injectionsPerWeek:n});
  assert.equal(r.errors.length,0);assert.equal(r.schedule?.dosePerInjectionMcg,4000);assert.equal(r.doseVolumeMl,.2);assert.equal(r.syringeUnits,20);assert.equal(r.schedule?.weeklyDoseMcg,4000*n);
 }
});
test("Weekly input is split by the actual chosen count without guessing",()=>{
 for(const n of [1,2,3,7,14,28]){
  const r=calculate({...base,amountBasis:"week",injectionsPerWeek:n});
  assert.equal(r.errors.length,0);assert.ok(Math.abs(r.doseVolumeMl-.2/n)<1e-12);assert.equal(r.schedule?.weeklyDoseMcg,4000);
 }
 assert.ok(calculate({...base,amountBasis:"week"}).errors.some(e=>/times per week/.test(e)));
});
test("Each-time arithmetic works without inventing a frequency",()=>{
 const r=calculate({...base,amountBasis:"each"});assert.equal(r.errors.length,0);assert.equal(r.doseVolumeMl,.2);assert.equal(r.schedule?.frequencyKnown,false);assert.match(r.schedule!.label,/No schedule chosen/);assert.equal(scheduleLabel(null),"No schedule chosen");
 const s=amountSchedule({amount:"4",unit:"mg",basis:"each",frequency:null});assert.equal(s.kind,"value");if(s.kind==="value")assert.equal(s.weeklyMcg,null);
});
test("Legacy saved inputs retain their original weekly-split results",()=>{
 const old=calculate({...base,injectionsPerWeek:2});const explicit=calculate({...base,injectionsPerWeek:2,amountBasis:"week"});
 assert.equal(old.doseVolumeMl,explicit.doseVolumeMl);assert.equal(old.syringeUnits,10);assert.equal(old.input.amountBasis,undefined);
});
test("Invalid amounts and frequency counts cannot produce schedule results",()=>{
 for(const amount of ["-1","0","0x10","3mg","NaN","Infinity","1,000","1e13"])assert.equal(amountSchedule({amount,unit:"mg",basis:"each",frequency:2}).kind,"error");
 for(const frequency of [0,-1,1.5,29,Infinity,NaN]){
  assert.equal(amountSchedule({amount:"4",unit:"mg",basis:"each",frequency}).kind,"error");
  assert.ok(calculate({...base,amountBasis:"each",injectionsPerWeek:frequency}).errors.length);
 }
 assert.equal(amountSchedule({amount:"4",unit:"mg",basis:"week",frequency:null}).kind,"error");
});
test("mg/mcg switches preserve the physical amount, never convert to IU",()=>{
 assert.equal(massText("4","mg","mcg"),"4000");assert.equal(massText("4000","mcg","mg"),"4");assert.equal(massText("0.3","mg","mcg"),"300");assert.equal(massText("","mg","mcg"),"");assert.equal(massText("3mg","mg","mcg"),"3mg");
 const s=parseMassDraft({amount:"4",amountUnit:"IU",vialUnit:"IU"});assert.equal(s.amountUnit,"mcg");assert.equal(s.vialUnit,"mg");assert.equal(s.amount,"");assert.equal(parseMassDraft({vial:"40",vialUnit:"IU"}).vial,"");
});
test("Saved JSON and server explanation retain each-time semantics",()=>{
 const r=calculate({...base,amountBasis:"each",injectionsPerWeek:2});const saved=JSON.parse(JSON.stringify(r));
 assert.equal(saved.input.amountBasis,"each");assert.equal(calculate(saved.input).syringeUnits,20);
 const explanation=parseExplanation({plan:saved,messages:[{role:"user",content:"Explain the concentration"}]});assert.equal(explanation?.result.syringeUnits,20);
});
test("Mass product can show concentration before an amount or schedule is known",()=>{
 const p=SUPPLIER_PRODUCTS.find(p=>p.kind==="single")!;
 const result=productCalculation(p,{...emptyProductValues(),total:"40",volume:"2"});assert.equal(result.ready,true);assert.match(result.lines[0],/20 mg\/mL/);assert.match(result.lines[1],/Add an amount/);
});
test("Draft parsing bounds keys and values without completing partial numbers",()=>{
 const r=parseMassDraft({...EMPTY_MASS,vial:"40.",amount:"0.",volume:"2",step:99,productId:"x".repeat(200),frequency:1.5});
 assert.equal(r.vial,"40.");assert.equal(r.amount,"0.");assert.equal(r.step,0);assert.equal(r.productId?.length,100);assert.equal(r.frequency,1.5);
 assert.deepEqual(parseMassDraft(null),EMPTY_MASS);assert.deepEqual(parseMassDraft([]),EMPTY_MASS);
 const fallback={text:"",unit:"mg"};assert.deepEqual(sessionToolValue({text:null},fallback),fallback);assert.deepEqual(sessionToolValue([],fallback),fallback);assert.deepEqual(sessionToolValue({text:"40",unit:"mg"},fallback),{text:"40",unit:"mg"});
});
// This process exercises one browser-tab instance without any database/network.
const stored=new Map<string,string>();Object.defineProperty(globalThis,"window",{value:{},configurable:true});
Object.defineProperty(globalThis,"sessionStorage",{value:{getItem:(k:string)=>stored.get(k)??null,setItem:(k:string,v:string)=>stored.set(k,v)},configurable:true});
test("Draft writes are synchronous so an immediate product navigation cannot lose input",()=>{
 let notifications=0;const stop=subscribeCalculatorSession(()=>notifications++);
 patchMassDraft({vial:"40",volume:"2",amount:"4",amountUnit:"mg",basis:"week",frequency:2});
 selectMassProduct("glp-3","retatrutide");const s=readCalculatorSession();
 assert.equal(s.mass.vial,"40");assert.equal(s.mass.volume,"2");assert.equal(s.mass.amount,"4");assert.equal(s.mass.basis,"week");assert.equal(s.mass.frequency,2);assert.equal(s.mass.reviewProduct,true);assert.ok(notifications>=2);
 assert.equal(JSON.parse(stored.get(CALCULATOR_SESSION_KEY)!).mass.volume,"2");stop();
});
test("Selecting the same product on route mount does not dismiss its review warning",()=>{
 selectMassProduct("glp-3","retatrutide");assert.equal(readCalculatorSession().mass.reviewProduct,true);
 patchMassDraft({reviewProduct:false});selectMassProduct("glp-3","retatrutide");assert.equal(readCalculatorSession().mass.reviewProduct,false);
 selectMassProduct("bpc-157","bpc-157");assert.equal(readCalculatorSession().mass.reviewProduct,true);
});
test("Tool records, UI progress and incompatible product fields remain isolated",()=>{
 patchMassDraft({step:2});writeSessionTool("bacwater.product.amino-h2o.v1",{total:"10",volume:"1",amount:"",count:"2",ingredient:"",ingredients:[]},{});
 writeSessionTool("bacwater.compound.hcg.amount","500","");writeSessionTool("bacwater.tool.mass.v2",{unit:"mg",text:".125"},{unit:"mg",text:""});
 assert.equal(readCalculatorSession().mass.vial,"40");assert.equal(readCalculatorSession().mass.amount,"4");assert.equal(readCalculatorSession().mass.step,2);
 assert.equal(readCalculatorSession().tools["bacwater.compound.hcg.amount"],"500");assert.equal(serverCalculatorSession().mass.amount,"");
});
test("Clear writes a blank shared draft and does not revive old route values",()=>{
 writeSessionTool("bacwater.plan.secondaryMass",20,0);clearMassNumbers();
 const s=readCalculatorSession();assert.equal(s.mass.vial,"");assert.equal(s.mass.amount,"");assert.equal(s.mass.frequency,null);assert.equal(s.mass.step,0);assert.equal(s.mass.productId,"bpc-157");assert.equal(s.tools["bacwater.plan.secondaryMass"],undefined);assert.equal(s.tools["bacwater.compound.hcg.amount"],"500");
 assert.equal(JSON.parse(stored.get(CALCULATOR_SESSION_KEY)!).mass.vial,"");
});
test("Unavailable browser storage still allows same-tab in-memory calculations",()=>{
 Object.defineProperty(globalThis,"sessionStorage",{value:{getItem:()=>{throw new Error("blocked")},setItem:()=>{throw new Error("blocked")}},configurable:true});
 patchMassDraft({vial:"12",volume:"4"});assert.equal(readCalculatorSession().mass.vial,"12");
});
test("Active draft contains no analytics, network writes, plan ownership or user identity",()=>{
 const source=fs.readFileSync("src/lib/calculator-session.ts","utf8");assert.equal(/\bfetch\(|\bgtag\(|sendBeacon|dataLayer|localStorage\.(getItem|setItem)/.test(source),false);
 for(const field of ["claimToken","email","password","notes","userId"])assert.equal(field in readCalculatorSession().mass,false);
 const actions=fs.readFileSync("src/lib/plan-actions.ts","utf8");assert.ok(actions.includes('amountBasis: parsed.data.amountBasis'));
});
test("Clearing a converter does not clear vial numbers",()=>{
 patchMassDraft({vial:"40",volume:"2"});writeSessionTool("bacwater.tool.mass.v2",{unit:"mg",text:""},{unit:"mg",text:""});assert.equal(readCalculatorSession().mass.vial,"40");
});
test("Copied results retain per-time versus weekly meaning",()=>{
 assert.match(amountScheduleText({amount:"4",unit:"mg",basis:"each",frequency:2}),/4 mg each time.*8 mg for the whole week/);
 assert.match(amountScheduleText({amount:"4",unit:"mg",basis:"week",frequency:2}),/2 mg each time.*4 mg for the whole week/);
 assert.match(amountScheduleText({amount:"4",unit:"mg",basis:"each",frequency:null}),/No schedule chosen/);
 assert.equal(amountScheduleText({amount:"4",unit:"mg",basis:"week",frequency:null}),"");
});
console.log(`${count} shared-session and schedule groups passed.`);
