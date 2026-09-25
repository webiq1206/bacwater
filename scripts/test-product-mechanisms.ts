import assert from "node:assert/strict";
import fs from "node:fs";
import { PRODUCT_RESEARCH } from "../src/lib/partners/product-content";

let checks=0;
function check(name:string,run:()=>void){run();checks++;console.log(`PASS mechanism content: ${name}`);}
// Independent editorial anchors. These checks protect specific distinctions, not just word counts.
const anchors:Record<string,RegExp[]>={
 "amino-h2o":[/dissolv/i,/benzyl alcohol/i,/not.*sterile/i],
 "glp-1":[/GLP-1 receptor/,/insulin/,/glucose/,/albumin/],
 "glp-2":[/GIP/,/GLP-1/,/insulin/,/not.*equally/],
 "glp-3":[/glucagon/i,/liver/i,/release stored glucose/,/do not all lower glucose/],
 "bpc-157":[/FAK/,/paxillin/,/grip/,/not firmly established/],
 "ghk-cu":[/copper ion/,/collagen/,/scaffold/],
 "tb-500":[/actin/,/full thymosin beta-4/,/fragment/,/not.*proven/],
 "tesamorlin":[/pituitary/,/GHRH receptor/,/stored growth hormone/],
 "mots-c":[/AICAR/,/AMPK/,/fuel-budget switch/],
 "nad-plus":[/electrons/,/NADH/,/sirtuins/,/does not demonstrate/],
 "cjc-ipa-no-dac":[/GHRH/,/ghrelin receptor/,/No DAC/,/must not be borrowed/],
 "kpv":[/PepT1/,/NF-kB/,/cytokines/,/alarm/],
 "klow":[/KPV/,/GHK-Cu/,/no established whole-blend/],
 "semax":[/BDNF/,/TrkB/,/does not show/,/uncertain/],
 "glutathione":[/peroxidase/,/peroxide into water/,/GSSG/,/NADPH/],
 "melanotan-ii":[/MC1/,/MC4/,/several targets/],
 "glow":[/BPC-157/,/TB-500/,/GHK-Cu/,/does not prove/],
 "selank":[/GABA/,/brake/,/no gene-expression change/,/does not establish/],
 "melanotan-i":[/MC1/,/cAMP/,/melanin/],
 "igf-1-lr3":[/binding proteins/,/receptor/,/depended on whether/],
 "5-amino-1mq":[/NNMT/,/nicotinamide/,/1-MNA/,/not a peptide/],
 "wolverine-stack":[/FAK/,/actin/,/fragment/,/does not establish/],
 "pt-141":[/MC3/,/MC4/,/hypothalamus/,/nerve-signaling route/],
 "cagrilintide":[/amylin/i,/calcitonin receptor/,/food-intake pathway/],
 "aod-9604":[/beta-3/,/not.*complete/,/mechanism remains/],
 "dsip":[/Met-enkephalin/,/calcium/,/did not directly bind opioid receptors/],
 "epithalon":[/telomeres/i,/telomerase/i,/not been fully established/],
 "ipamorelin":[/ghrelin receptor/,/GHSR/,/stored growth hormone/],
 "snap-8":[/packets/,/SNARE/,/SNAP-25/,/design hypothesis/],
 "thymosin-alpha-1":[/dendritic cells/,/Toll-like receptors/,/IL-12/],
 "ll-37":[/positive charge/,/membrane/,/non-microbial cells/],
 "cartalax":[/IGF1/,/first target/,/uncertain/],
 "sermorelin":[/GHRH receptor/,/pituitary/,/not.*supply of growth hormone/],
 "kisspeptin":[/KISS1R/,/GnRH/,/LH and FSH/],
 "dihexa":[/HGF/,/c-Met/,/retracted in 2025/,/not a verified explanation/],
 "vip":[/VPAC1 and VPAC2/,/cAMP/,/salt and fluid/],
 "ara-290":[/EPO receptor/,/CD131/,/proposed/],
 "pinealon":[/reactive oxygen/,/ERK/,/not.*complete/],
 "ahk-cu":[/dermal papilla/,/survival/,/not every.*statistically significant/],
 "ghkcu-spray":[/collagen/,/prepared liquid/,/does not.*mechanism/],
 "nad-plus-spray":[/electrons/,/NADH/,/not the same as.*inside/],
 "semax-spray":[/BDNF/,/TrkB/,/do not show/],
 "selank-spray":[/GABA/,/SELANK alone/,/does not prove/],
 "pt-141-spray":[/MC3 and MC4/,/hypothalamus/,/no new proven mechanism/],
 "melanotan-ii-spray":[/MC1/,/MC4/,/not evidence of delivery/],
 "dsip-spray":[/Met-enkephalin/,/calcium/,/not.*demonstrated function/],
 "bpc-tb-spray":[/actin/,/exact TB-500 form/,/mechanism remains unestablished/],
 "bpc-spray":[/FAK/,/paxillin/,/does not identify a complete/],
 "adalank-spray":[/caps at both ends/,/GABA/,/not identified/,/parent-compound studies do not establish/],
 "adamax-spray":[/extra amino acids/,/BDNF/,/not identified/,/unknown/],
};
check("Every product has independently defined mechanism anchors",()=>assert.deepEqual(Object.keys(PRODUCT_RESEARCH).sort(),Object.keys(anchors).sort()));
for(const [id,d] of Object.entries(PRODUCT_RESEARCH)){
 check(`${id}: target, action and boundary are retained`,()=>{for(const anchor of anchors[id])assert.match(d.how,anchor,id);});
 check(`${id}: two readable paragraphs, with specific sources`,()=>{
  const paragraphs=d.how.split("\n\n");assert.equal(paragraphs.length,2);
  assert.ok(d.how.split(/\s+/).length>=70&&d.how.split(/\s+/).length<=145);
  for(const paragraph of paragraphs)assert.ok(paragraph.split(/\s+/).length>=25&&paragraph.split(/\s+/).length<=85);
  if(id!=="amino-h2o")assert.ok(d.sources.some(s=>s.type==="paper"),`${id}: missing scientific source or evidence notice`);
  assert.equal(new Set(d.sources.map(s=>s.url)).size,d.sources.length);
  assert.doesNotMatch(d.how,/you should (?:take|inject)|recommended dose|clinically proven|guaranteed results|\u2014|--/i);
 });
}
check("The Dihexa retraction is visible and never labeled as supporting evidence",()=>{
 const d=PRODUCT_RESEARCH.dihexa;assert.match(d.study,/retracted/);assert.match(d.limit,/retracted/);
 const source=d.sources.find(s=>s.url==="https://pubmed.ncbi.nlm.nih.gov/40312093/")!;
 assert.ok(source);assert.match(source.label,/Retraction/);assert.match(source.note!,/not evidence supporting/);
});
check("Parent and background papers do not masquerade as formulation results",()=>{
 for(const id of ["adalank-spray","adamax-spray","snap-8"]){
  const sources=PRODUCT_RESEARCH[id].sources.filter(s=>s.type!=="product");
  assert.ok(sources.every(s=>s.note&&/not|only/i.test(s.note)),id);
 }
});
check("Shared detail component renders paragraphs and source-specific qualifications",()=>{
 const text=fs.readFileSync("src/components/partners/product-quick-view.tsx","utf8");
 assert.match(text,/data-product-mechanism/);assert.match(text,/data-mechanism-paragraph/);
 assert.match(text,/detail\.how\.split\("\\n\\n"\)/);assert.match(text,/source\.note/);
});
console.log(`${checks} mechanism checks passed. Content anchors do not substitute for scientific review or certify a reading grade.`);
