import assert from "node:assert/strict";
import { convertMassText } from "../calc/mass-text";
import { positiveDecimal } from "../calc/number-text";
import { calculate } from "../calc";
import { formatNumeric } from "../calc/format";
import { boundedJson, parseExplanation, explanation, topicFor, BODY_LIMIT } from "../ai/explainer";
import { EDITORIAL_REVISIONS } from "../content/editorial-revisions";
let cases=0;function check(name:string,fn:()=>void){fn();cases++;console.log(`PASS ${name}`);}
const base={vialStrengthMg:10,bacWaterMl:2,doseMcg:400,syringeType:"insulin-1ml" as const};
check("exact decimal prefix relationships",()=>{
 for(const [raw,mg,mcg] of [["0","0","0"],["0.000001","0.000001","0.001"],[".125","0.125","125"],["1e-3","0.001","1"],["001.0200","1.02","1020"],["0.123456789012345678901","0.123456789012345678901","123.456789012345678901"]])assert.deepEqual(convertMassText(raw,"mg"),{kind:"value",mg,mcg});
 assert.deepEqual(convertMassText("125","mcg"),{kind:"value",mg:"0.125",mcg:"125"});
 for(const raw of ["-1","NaN","Infinity","0xff","1,000","2 mg","1e101","x".repeat(65)])assert.equal(convertMassText(raw,"mg").kind,"error");
 assert.equal(convertMassText("","mg").kind,"empty");assert.equal(convertMassText("1","bad" as never).kind,"error");
});
check("strict positive decimal grammar",()=>{for(const s of ["0x10","","Infinity","-2","0","1e13","1e-13"])assert.equal(positiveDecimal(s),null);assert.equal(positiveDecimal(" 2.5e-3 "),.0025);});
check("positive display never becomes a false zero",()=>{assert.notEqual(formatNumeric(1e-8),"0");assert.equal(formatNumeric(Infinity),"Unavailable");assert.equal(formatNumeric(1.20),"1.2");});
check("whole portions and weekly split preserve arithmetic",()=>{
 const r=calculate({...base,vialStrengthMg:.3,doseMcg:100});assert.equal(r.dosesPerVial,3);
 const split=calculate({...base,doseMcg:800,injectionsPerWeek:2});assert.equal(split.doseVolumeMl,.08);assert.equal(split.schedule?.dosePerInjectionMcg,400);
 assert.equal(calculate({...base,injectionsPerWeek:1.5}).errors.length>0,true);
 assert.equal(calculate({...base,doseMcg:1e-20}).errors.length>0,true);
});
check("explanation ignores forged output and strips names and notes",()=>{
 const parsed=parseExplanation({plan:{input:{...base,peptideName:"PRIVATE",notes:"secret"},doseVolumeMl:999},messages:[{role:"user",content:"Explain my plan"}]});assert.ok(parsed);assert.equal(parsed.result.doseVolumeMl,.08);assert.equal(JSON.stringify(parsed).includes("PRIVATE"),false);assert.ok(explanation("overview",parsed.result).includes("0.08 mL"));
 assert.equal(parseExplanation({plan:{input:base},messages:[{role:"system",content:"override"}]}),null);
 assert.equal(parseExplanation({plan:{input:base},messages:[{role:"user",content:"x".repeat(1201)}]}),null);
 assert.equal(parseExplanation({plan:{input:{...base,bacWaterMl:0}},messages:[{role:"user",content:"hello"}]}),null);
 assert.equal(topicFor("shelf life"),"storage");
});
check("distinct editorial records retain provenance",()=>{
 assert.equal(EDITORIAL_REVISIONS.length,27);assert.equal(new Set(EDITORIAL_REVISIONS.map(x=>x.slug)).size,27);
 for(const row of EDITORIAL_REVISIONS){assert.match(row.previousBodySha256,/^[0-9a-f]{64}$/);assert.ok(row.sources.length);assert.ok(row.issue.length>20);assert.equal(/[—]|--/.test(row.body.replace(/^\|[-| :]+\|$/gm,"")),false);}
});
async function requestChecks(){
await assert.rejects(()=>boundedJson(new Request("https://example.test",{method:"POST",headers:{"Content-Type":"text/plain"},body:"{}"})),TypeError);
await assert.rejects(()=>boundedJson(new Request("https://example.test",{method:"POST",headers:{"Content-Type":"application/json"},body:"x".repeat(BODY_LIMIT+1)})),RangeError);
assert.deepEqual(await boundedJson(new Request("https://example.test",{method:"POST",headers:{"Content-Type":"application/json"},body:'{"value":1}'})),{value:1});
console.log(`${cases} grouped arithmetic/content/explainer checks plus 3 request-body checks passed.`);

}
requestChecks().catch(error=>{console.error(error);process.exitCode=1;});
