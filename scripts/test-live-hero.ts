import assert from "node:assert/strict";
import fs from "node:fs";
import { EMPTY_HERO, HERO_DRAFT_KEY, heroMeasurement, heroResult, changeTargetUnit, parseHeroDraft, type HeroValues } from "../src/lib/brand/hero-calculation";
let count = 0;
const test = (name: string, run: () => void) => { run(); count++; console.log(`PASS hero: ${name}`); };
const v = (overrides: Partial<HeroValues> = {}): HeroValues => ({ ...EMPTY_HERO, amount: "12", volume: "4", ...overrides });
test("initial values are blank and never imply a selected dose or dilution", () => { assert.equal(heroResult("concentration", EMPTY_HERO), null); assert.deepEqual(heroMeasurement(EMPTY_HERO), {kind:"empty"}); });
test("live concentration uses entered values", () => { assert.equal(heroResult("concentration", v())?.value, "3"); assert.equal(heroResult("concentration", v({volume:"6"}))?.value,"2"); });
test("target in mcg returns the matching mL and U-100 values", () => { const r = heroMeasurement(v({target:"300"})); assert.equal(r.kind,"value"); if(r.kind==="value"){assert.equal(r.ml,"0.1");assert.equal(r.units,"10");} });
test("target in mg has the same physical result", () => {const r=heroMeasurement(v({target:"0.3",targetUnit:"mg"})); assert.equal(r.kind,"value");if(r.kind==="value")assert.equal(r.ml,"0.1");});
test("unit switching preserves mass without a thousand-fold reinterpretation", () => {const start=v({target:"300"});const mg=changeTargetUnit(start,"mg");assert.equal(mg.target,"0.3");assert.deepEqual(heroMeasurement(mg),heroMeasurement(start));assert.equal(changeTargetUnit(mg,"mcg").target,"300");});
test("blank unit switching stays blank", () => assert.equal(changeTargetUnit(v(),"mg").target,""));
test("invalid target conversion never becomes a valid answer", () => {const changed=changeTargetUnit(v({target:"3mg"}),"mg");assert.equal(heroMeasurement(changed).kind,"error");});
for (const input of ["0", "-1", "NaN", "Infinity", "1,000", "3mg", "0x10", "1e999", "1e13", "1e-13"]) {
 test(`invalid vial or volume ${input}`,()=>{assert.equal(heroResult("concentration",v({amount:input})),null);assert.equal(heroResult("concentration",v({volume:input})),null);});
}
test("invalid target cannot leave an earlier measurement result",()=>assert.equal(heroMeasurement(v({target:"0"})).kind,"error"));
test("target exceeding total vial mass is explicitly flagged",()=>{const r=heroMeasurement(v({target:"13",targetUnit:"mg"}));assert.equal(r.kind,"value");if(r.kind==="value")assert.match(r.warning,/greater than the total/);});
test("device capacity is not inferred from a U-100 conversion",()=>{const r=heroMeasurement(v({target:"6",targetUnit:"mg"}));assert.equal(r.kind,"value");if(r.kind==="value")assert.match(r.warning,/greater than 1 mL/);});
test("very small positive concentration and measurement never display zero",()=>{assert.notEqual(heroResult("concentration",v({amount:"1e-12",volume:"1e12"}))?.value,"0");const r=heroMeasurement(v({amount:"1e12",volume:"1e-12",target:"1e-12"}));assert.equal(r.kind,"value");if(r.kind==="value"){assert.notEqual(r.ml,"0");assert.notEqual(r.units,"0");}});
test("mass conversion remains exact including zero",()=>{assert.equal(heroResult("mass",v({mass:"0.125"}))?.value,"125");assert.equal(heroResult("mass",v({mass:"0"}))?.value,"0");});
test("U-100 is a volume ratio, not a mass conversion",()=>{assert.equal(heroResult("units",v({units:"25"}))?.value,"0.25");assert.equal(heroResult("units",v({units:"200"}))?.value,"2");});
test("session persistence accepts only known bounded shape",()=>{const draft={mode:"concentration",values:v()};assert.deepEqual(parseHeroDraft(JSON.stringify(draft)),draft);for(const bad of [null,"{","[]",'{}',"x".repeat(2049),JSON.stringify({...draft,mode:"dose"}),JSON.stringify({...draft,values:v({amount:"x".repeat(65)})}),JSON.stringify({...draft,values:{...v(),targetUnit:"IU"}})])assert.equal(parseHeroDraft(bad),null);});
test("original value objects are not mutated",()=>{const original=v({target:"300"});const copy=JSON.stringify(original);changeTargetUnit(original,"mg");heroMeasurement(original);assert.equal(JSON.stringify(original),copy);});
test("homepage title, copy and metadata match the calculator task",()=>{const home=fs.readFileSync("src/app/page.tsx","utf8");assert.ok(home.includes("BAC Water Calculator | Peptide Reconstitution | BACwater.ai"));assert.ok(home.includes("absolute: title"));assert.ok(home.includes("<SoftwareAppJsonLd"));const hero=fs.readFileSync("src/components/brand/research-hero.tsx","utf8");assert.ok(hero.includes("<HeroCalculator"));assert.ok(hero.includes("peptide reconstitution calculator"));assert.ok(hero.includes('id="quick-calculator"'));});
test("new hero does not send raw entries to analytics or external services",()=>{const src=fs.readFileSync("src/components/brand/hero-calculator.tsx","utf8");assert.equal(/\bfetch\(|\bgtag\(|dataLayer|sendBeacon/.test(src),false);const shared=fs.readFileSync("src/lib/calculator-session.ts","utf8");assert.ok(shared.includes("sessionStorage"));assert.equal(/\bfetch\(|\bgtag\(|dataLayer|sendBeacon/.test(shared),false);assert.equal(HERO_DRAFT_KEY,"bacwater.heroDraft.v1");});
console.log(`${count} live hero calculation, validation, persistence and metadata checks passed.`);
