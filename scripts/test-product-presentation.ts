import assert from "node:assert/strict";
import fs from "node:fs";
import { PRODUCT_RESEARCH } from "../src/lib/partners/product-content";
import { SUPPLIER_PRODUCTS, getSupplierCatalog, productDisplayName, productForReference } from "../src/lib/partners/supplier-catalog";
import { matchDirectory } from "../src/lib/partners/product-directory";
import { BASE_SEARCH_ITEMS, productChoices, searchItems } from "../src/lib/search/public-index";
import { calculate } from "../src/lib/calc";
const names:Record<string,string>=JSON.parse(fs.readFileSync("scripts/fixtures/partner-product-names.json","utf8"));
let count=0;
function check(name:string,run:()=>void){run();count++;console.log(`PASS product presentation: ${name}`);}
check("independent partner-name fixture covers all fifty stable IDs",()=>{assert.equal(Object.keys(names).length,50);assert.deepEqual(SUPPLIER_PRODUCTS.map(p=>p.id).sort(),Object.keys(names).sort());});
for(const product of SUPPLIER_PRODUCTS){
 check(`${product.id}: exact product name in catalog, artwork and searchable result`,()=>{
  assert.equal(product.name,names[product.id]);assert.equal(product.mark,names[product.id]);assert.equal(product.sourceUrl,`https://www.aminoclub.com/us/products/${product.id}`);
  const result=BASE_SEARCH_ITEMS.find(i=>i.id===`product:${product.id}`)!;assert.equal(result.title,names[product.id]);assert.equal(result.description,product.summary);assert.equal(result.href,`/calculate/product/${product.id}`);
  assert.ok(productChoices().some(p=>p.product?.id===product.id&&p.name===product.name));
  assert.ok(matchDirectory(SUPPLIER_PRODUCTS,product.name).products.some(p=>p.id===product.id));
 });
 check(`${product.id}: three useful sections with a specific evidence limit`,()=>{
  const detail=PRODUCT_RESEARCH[product.id];assert.equal(detail.name,product.name);assert.equal(product.summary,detail.summary);
  for(const key of ["what","study","how","limit"] as const){assert.ok(detail[key].length>=45,`${product.id}.${key}`);assert.ok(detail[key].split(/\s+/).length<=75,`${product.id}.${key} is too long`);assert.doesNotMatch(detail[key],/\blistings?\b|Listing review|\u2014|--/i);}
  assert.equal(new Set([detail.what,detail.study,detail.how]).size,3);
  assert.equal(detail.sources.filter(s=>s.type==="product").length,1);
  assert.equal(detail.sources.find(s=>s.type==="product")!.url,product.sourceUrl);
  for(const source of detail.sources){const u=new URL(source.url);assert.equal(u.protocol,"https:");assert.ok(["www.aminoclub.com","pubmed.ncbi.nlm.nih.gov","pmc.ncbi.nlm.nih.gov","www.nature.com"].includes(u.hostname));assert.equal(u.search,"");}
  assert.doesNotMatch([detail.what,detail.study,detail.how].join(" "),/you should (?:take|inject)|recommended dose|burns fat|boosts testosterone|promotes healing|guaranteed results|clinically proven/i);
 });
}
for(const [alias,id] of [["Retatrutide","glp-3"],["Tirzepatide","glp-2"],["Semaglutide","glp-1"],["Tesamorelin","tesamorlin"],["Kisspeptin-10","kisspeptin"],["BAC water","amino-h2o"]]){
 check(`search alias ${alias} returns the exact partner label`,()=>{assert.ok(matchDirectory(SUPPLIER_PRODUCTS,alias).products.some(p=>p.id===id&&p.name===names[id]));assert.ok(searchItems(BASE_SEARCH_ITEMS,alias,"product").some(p=>p.productId===id&&p.title===names[id]));});
}
check("reference names keep stable scientific URL identifiers",()=>{assert.equal(productDisplayName("retatrutide","Retatrutide"),"GLP-3 (RT)");assert.equal(productForReference("retatrutide")!.id,"glp-3");assert.equal(productDisplayName("custom","A user label"),"A user label");});
check("calculation names update without changing numbers or explicit saved names",()=>{
 const input={peptideSlug:"retatrutide",vialStrengthMg:12,doseMcg:300,bacWaterMl:4,syringeType:"insulin-1ml" as const};
 const before=calculate({...input,peptideName:"Retatrutide"}),after=calculate(input);
 assert.deepEqual(after.errors,[]);assert.equal(after.input.peptideName,"GLP-3 (RT)");assert.equal(before.input.peptideName,"Retatrutide");
 // The existing numeric engine uses binary floating point. Label changes must preserve its results exactly.
 assert.equal(after.finalConcentrationMgPerMl,3);assert.ok(Math.abs(after.doseVolumeMl-.1)<1e-12);assert.ok(Math.abs(after.syringeUnits-10)<1e-12);assert.equal(after.dosesPerVial,40);
 for(const key of ["finalConcentrationMgPerMl","doseVolumeMl","syringeUnits","dosesPerVial"] as const){assert.equal(after[key],before[key]);}
 assert.equal(calculate({...input,peptideName:"My exact stored label"}).input.peptideName,"My exact stored label");
});
check("non-peptides and uncertain research forms are not misrepresented",()=>{assert.match(PRODUCT_RESEARCH["nad-plus"].what,/not a peptide/);assert.match(PRODUCT_RESEARCH["5-amino-1mq"].what,/not a peptide/);assert.match(PRODUCT_RESEARCH["tb-500"].limit,/full thymosin|one form/);assert.match(PRODUCT_RESEARCH["adalank-spray"].limit,/parent|direct|not/i);assert.match(PRODUCT_RESEARCH["adamax-spray"].how,/not|unknown|unclear/i);});
check("all outbound product links retain owner attribution",()=>{for(const p of getSupplierCatalog()){assert.ok(p.paid);const u=new URL(p.href);assert.equal(u.search,"?utm_source=affiliate_marketing&code=WEBIQ");}});
check("detail panel removes review metadata and attributes source product links",()=>{const s=fs.readFileSync("src/components/partners/product-quick-view.tsx","utf8");assert.doesNotMatch(s,/Listing review|CATALOG_CHECKED_AT|Catalog identifier|<time/);assert.match(s,/source.type===\"product\"\?product.href:source.url/);for(const h of ["What it is","What researchers study","How it works","Sources &amp; product checks"])assert.ok(s.includes(h));});
check("public commerce components use products, not listings",()=>{for(const folder of ["src/components/partners"]){for(const file of fs.readdirSync(folder).filter(f=>f.endsWith(".tsx"))){assert.doesNotMatch(fs.readFileSync(`${folder}/${file}`,"utf8"),/\blistings\b|Listing review|What this listing is/i);}}});
console.log(`${count} product naming, research content and presentation checks passed.`);
