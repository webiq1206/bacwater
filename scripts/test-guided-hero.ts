import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate, type CalcInput } from "../src/lib/calc";
import { planPreviewState, type PlanPreviewInput } from "../src/lib/calc/plan-preview";
import { canContinueGuided, guidedStep, GUIDED_STEPS } from "../src/lib/calc/guided-steps";
const input: CalcInput = {peptideSlug:"bpc-157",peptideName:"BPC-157",vialStrengthMg:12,doseMcg:300,injectionsPerWeek:1,bacWaterMl:4,syringeType:"insulin-1ml",dateMixed:null};
const base: PlanPreviewInput = {input,result:calculate(input),hasProduct:true,vialText:"12",vialUnit:"mg",volumeText:"4",amount:{amount:"0.3",amountUnit:"mg",basis:"each",timesPerWeek:""},secondaryReady:true,hydrated:true};
const preview=planPreviewState(base);
assert.equal(GUIDED_STEPS.length,6);
for(let step=0;step<6;step++){assert.equal(guidedStep(step,preview),step);assert.equal(canContinueGuided(step,preview),true);}
for(const invalid of [-1,6,NaN,Infinity,1.5]) assert.equal(guidedStep(invalid,preview),0);
const cases: [number,Partial<PlanPreviewInput>][] = [[0,{hasProduct:false}],[1,{vialText:"0"}],[2,{amount:{...base.amount,amount:"-1"}}],[3,{volumeText:"0"}]];
for(const [missing,changes] of cases){const p=planPreviewState({...base,...changes});assert.equal(p.ready,false);assert.equal(guidedStep(5,p),missing);assert.equal(canContinueGuided(missing,p),false);assert.equal(guidedStep(0,p),0);}
for(const changes of [{hydrated:false},{secondaryReady:false}]){const p=planPreviewState({...base,...changes});assert.equal(p.ready,false);assert.equal(canContinueGuided(4,p),false);}
assert.ok(Math.abs(base.result.doseVolumeMl - 0.1) < 1e-12);
const weekly={...base,input:{...input,doseMcg:600,injectionsPerWeek:2},amount:{amount:"0.6",amountUnit:"mg" as const,basis:"week" as const,timesPerWeek:"2"}};
const week=planPreviewState({...weekly,result:calculate(weekly.input)});assert.equal(week.ready,true);assert.ok(Math.abs(calculate(weekly.input).doseVolumeMl - 0.1) < 1e-12);
const iu=planPreviewState({...base,input:{...input,peptideSlug:"hcg"}});assert.equal(guidedStep(5,iu),0);assert.equal(iu.ready,false);
const hero=fs.readFileSync("src/components/brand/hero-calculator.tsx","utf8"),form=fs.readFileSync("src/components/plan/plan-form.tsx","utf8"),view=fs.readFileSync("src/components/brand/hero-plan-steps.tsx","utf8");
assert.match(hero,/<GuidedPlan mode="beginner" presentation="hero"/);
assert.match(hero,/!open \? content\("inline"\)/);
assert.match(form,/onSave=\{handleSave\}/);
assert.doesNotMatch(view,/fetch\(|sendBeacon|dataLayer|gtag\(/);
assert.match(view,/clearCalculation\(\); move\(0\)/);
console.log("PASS guided hero: product-first prerequisites, six steps, restored draft bounds, invalid input gating, shared math, schedule meaning, save action and privacy.");
