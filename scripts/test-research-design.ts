import assert from "node:assert/strict";
import fs from "node:fs";
import { quickCalculation, QUICK_EXAMPLE, type QuickValues } from "../src/lib/brand/quick-calculation";
import { getAminoPartner } from "../src/lib/partners/amino-club";
let count=0;
function check(name:string,fn:()=>void){fn();count++;console.log(`PASS ${name}`);}
const withValues=(values:Partial<QuickValues>)=>({...QUICK_EXAMPLE,...values});
check("Example concentration uses entered mass and final volume",()=>assert.equal(quickCalculation("concentration",QUICK_EXAMPLE)?.value,"3"));
check("A changed volume changes the actual result",()=>assert.equal(quickCalculation("concentration",withValues({volume:"6"}))?.value,"2"));
check("Decimal concentration is calculated",()=>assert.equal(quickCalculation("concentration",withValues({amount:"0.125",volume:"0.5"}))?.value,"0.25"));
check("Displayed formula describes the same entered values",()=>assert.equal(quickCalculation("concentration",QUICK_EXAMPLE)?.formula,"12 mg ÷ 4 mL = 3 mg/mL"));
for(const amount of ["","-1","0","NaN","Infinity","0x10","1,000","1e999","1e13"]){check(`Reject invalid concentration mass ${JSON.stringify(amount)}`,()=>assert.equal(quickCalculation("concentration",withValues({amount})),null));}
check("Division by zero is rejected",()=>assert.equal(quickCalculation("concentration",withValues({volume:"0"})),null));
check("Small positive result is not shown as zero",()=>{const r=quickCalculation("concentration",withValues({amount:"1e-12",volume:"1e12"}));assert.ok(r);assert.notEqual(r.value,"0");assert.equal(r.value,"1E-24");});
check("Mass conversion uses the existing exact decimal engine",()=>assert.equal(quickCalculation("mass",QUICK_EXAMPLE)?.value,"125"));
check("Small mass conversion remains exact",()=>assert.equal(quickCalculation("mass",withValues({mass:"0.0000000000001"}))?.value,"0.0000000001"));
check("Zero mass is a valid prefix conversion",()=>assert.equal(quickCalculation("mass",withValues({mass:"0"}))?.value,"0"));
check("Negative mass is rejected",()=>assert.equal(quickCalculation("mass",withValues({mass:"-0.2"})),null));
check("Mass unit suffixes are not silently parsed",()=>assert.equal(quickCalculation("mass",withValues({mass:"3mg"})),null));
check("U-100 example is a volume ratio",()=>assert.equal(quickCalculation("units",QUICK_EXAMPLE)?.value,"0.25"));
check("U-100 does not cap arithmetic at a device capacity",()=>assert.equal(quickCalculation("units",withValues({units:"200"}))?.value,"2"));
check("U-100 alternate-base notation is rejected",()=>assert.equal(quickCalculation("units",withValues({units:"0x10"})),null));
check("Rendering does not mutate example defaults",()=>{const old=JSON.stringify(QUICK_EXAMPLE);quickCalculation("mass",QUICK_EXAMPLE);assert.equal(JSON.stringify(QUICK_EXAMPLE),old);});
check("Paid referrals remain disabled by default",()=>assert.deepEqual(getAminoPartner({}),{active:false,reason:"disabled"}));
check("An enabled flag does not bypass account/link verification",()=>assert.deepEqual(getAminoPartner({AMINO_CLUB_ENABLED:"true"}),{active:false,reason:"approval-pending"}));
check("The homepage composes supplier listings, not preview fixtures",()=>{const src=fs.readFileSync("src/app/page.tsx","utf8");assert.ok(src.includes("<AminoRecommendations/>"));assert.equal(src.includes("AMINO_PRODUCTS"),false);assert.equal(src.includes("preview"),false);});
check("New public copy avoids em dashes",()=>{for(const path of ["src/components/brand/research-home.tsx","src/components/brand/research-hero.tsx","src/components/brand/quick-calculator.tsx","src/components/partners/amino-recommendations.tsx"]){assert.equal(fs.readFileSync(path,"utf8").includes("\u2014"),false,path);}});
console.log(`${count} focused design and calculator checks passed.`);
