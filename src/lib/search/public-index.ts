import { PEPTIDES } from "@/lib/calc/peptides";
import { SUPPLIER_PRODUCTS, productDetailPath, productForReference, type SupplierProduct } from "@/lib/partners/supplier-catalog";
import { searchScore } from "./matching";
export type SearchKind = "calculator" | "product" | "guide" | "reference" | "page";
export interface SearchItem { id: string; title: string; description: string; href: string; kind: SearchKind; keywords: string; productId?: string; reference?: string; }
export const SEARCH_KIND_LABEL: Record<SearchKind,string> = {calculator:"Calculator", product:"Product", guide:"Guide", reference:"Reference", page:"Page"};
const tools: [string,string,string,string][] = [
 ["/peptide-calculator","Peptide calculator","Answer one question at a time using your label.","bac water reconstitution measurement dose mixing start"],
 ["/tools/bac-water","BAC water calculator","Find how much is in each mL.","concentration liquid vial amount dilution bacteriostatic"],
 ["/tools/mg-to-mcg","mg to mcg converter","Change milligrams to micrograms, or the other way around.","mass units mg mcg conversion"],
 ["/tools/syringe-units","Syringe units to mL","Convert a U-100 scale reading to liquid volume.","100 units syringe insulin milliliter"],
 ["/tools/dose","Amount to measure","Use a known concentration to find mL.","dose volume measurement"],
 ["/tools/reverse-bac","Find a total volume","Check the math for a concentration you already know.","reverse bac water dilution"],
 ["/tools/supplies","Count equal measurements","See how many entered amounts fit in a vial.","supplies portions vial count"],
 ["/tools/vial-labels","Printable vial labels","Make a label from your saved numbers.","pdf label print qr"],
];
export const BASE_SEARCH_ITEMS: readonly SearchItem[] = [
 ...tools.map(([href,title,description,keywords])=>({id:`tool:${href}`,href,title,description,keywords,kind:"calculator" as const})),
 ...SUPPLIER_PRODUCTS.map(p=>({id:`product:${p.id}`,title:p.name,description:p.kind==="blend"?"Several ingredients. Check each amount on the label.":p.kind==="spray"?"Ready-made liquid. Use its stated concentration.":p.kind==="water"?"View the water listing and check its label.":"Read its research identity, format and documentation checklist. Not for human use.",href:productDetailPath(p.id),kind:"product" as const,productId:p.id,reference:p.reference,keywords:`${p.id} ${p.reference} ${p.mark} ${p.label} supplier buy product details ${p.name.includes("Semaglutide")?"glp1 glp 1":p.name==="Tirzepatide"?"glp2 glp 2":p.name==="Retatrutide"?"glp3 glp 3":""}`})),
 ...PEPTIDES.filter(p=>p.slug!=="custom").map(p=>({id:`reference:${p.slug}`,title:`${p.name} reference`,description:"Read the label context and find the right calculator.",href:`/peptides/${p.slug}`,kind:"reference" as const,reference:p.slug,productId:productForReference(p.slug)?.id,keywords:`${p.slug} ${(p.aliases||[]).join(" ")} calculator reconstitution`})),
 ...[["/learn","Guides and answers","Understand the labels, units and limits.","help learn beginners"],["/faq","Common questions","Find straightforward answers about this site.","help questions faq"],["/methodology","How the math works","See the formulas and calculation limits.","formulas methodology accuracy"],["/products","Research product directory","Filter laboratory materials by name and format. Not for human use.","supplies products water directory catalog"],["/recommendations","Affiliate disclosure","How supplier relationships and commission links work.","affiliate disclosure supplier"],["/tools","All calculators","Choose a tool for the question you have.","tools calculators"],["/contact","Contact us","Ask a question or report a problem.","contact support"],["/privacy","Privacy","See how this site handles information.","privacy data"],["/disclaimer","Important limits","What these tools do and do not tell you.","safety disclaimer"],["/learn/glossary","What the words mean","Plain definitions for unfamiliar words and units.","glossary definitions beginner milligram microgram reconstitution mg mcg ml u100 units"]].map(([href,title,description,keywords])=>({id:`page:${href}`,href,title,description,keywords,kind:"page" as const})),
];
export function searchItems(items: readonly SearchItem[], query: string, kind: SearchKind | "all" = "all"): SearchItem[] {
 return items.filter(item=>kind==="all"||item.kind===kind).map((item,index)=>({item,index,score:searchScore(query,item.title,`${item.description} ${item.keywords}`)+(/\b(mean|means|meaning|definition)\b/i.test(query)&&item.href==="/learn/glossary"?100:0)}))
  .filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);
}
/** Original artwork for references without a corresponding supplier listing. */
export function referenceArtwork(slug: string): SupplierProduct | undefined {
 const match=productForReference(slug);if(match)return match;
 const p=PEPTIDES.find(p=>p.slug===slug);if(!p||slug==="custom")return undefined;
 return {id:`reference-${slug}`,name:p.name,mark:slug==="hcg"?"hCG":p.name.replace(/\(.*?\)/g,"").trim().slice(0,7),kind:"single",reference:slug,label:"Reference",summary:"Check the exact label.",sourceUrl:"",artworkTone:PEPTIDES.indexOf(p)%7};
}
export interface ProductChoice { value:string; name:string; description:string; product?:SupplierProduct; }
export function productChoices(referencesOnly=false): ProductChoice[] {
 const known=PEPTIDES.map(p=>({value:p.slug,name:p.name,description:p.slug==="custom"?"Enter a different name from your label.":p.slug==="hcg"?"Uses IU, not mg. Needs the IU calculator.":"Match the exact name on your label.",product:referenceArtwork(p.slug)}));
 if(referencesOnly)return known.filter(p=>p.value!=="hcg");
 return [...known,...SUPPLIER_PRODUCTS.filter(p=>!p.reference||!PEPTIDES.some(ref=>ref.slug===p.reference)).map(p=>({value:`product:${p.id}`,name:p.name,description:p.kind==="blend"?"Blend: several ingredients in one product.":p.kind==="spray"?"Ready-made liquid: use the label concentration.":p.kind==="water"?"Water supply: opens a volume tool.":"Match the exact name on your label.",product:p}))];
}
