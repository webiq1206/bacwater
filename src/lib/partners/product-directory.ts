import { PRODUCT_RESEARCH } from "./product-content";
import { type SupplierProduct, type ProductKind } from "./supplier-catalog";

export const DIRECTORY_KINDS: readonly [ProductKind | "all", string][] = [
  ["all", "All products"], ["single", "Single compounds"], ["blend", "Blends"],
  ["spray", "Sprays and solutions"], ["water", "Lab water"],
];
export const PRODUCT_FORMATS: Record<ProductKind, string> = {
  single: "Single compound", blend: "Compound blend",
  spray: "Prepared research solution", water: "Laboratory water supply",
};
/** Facts and limits are read from the same reviewed record as product cards. */
export function productOverview(product: SupplierProduct): string {
  const details = PRODUCT_RESEARCH[product.id];
  return details ? `${details.what} ${details.study} ${details.how}` : product.summary;
}

function normalize(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\+/g," plus ").replace(/&/g," and ").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
}
const outOfScope = /\b(?:human|people|person|animal|pet|dog|cat|veterinary|consume|consumption|take|taking|inject\w*|dos\w*|administr\w*|cycl\w*|weight|fat|sleep\w*|anxiety|pain\w*|heal\w*|recover\w*|skin|cosmetic\w*|muscle\w*|strength|libido|aging|ageing|benefit\w*|insomnia|athlet\w*|best|recommend\w*|safest|safe|effective|cancer|diabet\w*|treat\w*|cure\w*|symptom\w*|lose|loss|hormone\w*|fitness|performance|energy|focus|hair|joint\w*|wound\w*)\b/i;
const filler = new Set("i im i'm am looking look searching search find show me a an the some all any please want need would like can could you for by named called containing with and or product products research laboratory lab compound compounds peptide peptides entry entries catalog only of".split(" "));
export type DirectoryMatch<T> = { products:T[]; scope:"catalog"|"restricted"|"unmatched"; message:string };

/** A closed-vocabulary local matcher, not an LLM or a clinical recommendation system. */
export function matchDirectory<T extends SupplierProduct>(products:readonly T[], input:string, kind:ProductKind|"all"="all"):DirectoryMatch<T> {
  const text=normalize(input);
  const scoped=products.filter(p=>kind==="all"||p.kind===kind);
  if(input.length>160||outOfScope.test(text)) return {products:[],scope:"restricted",message:"This finder matches product names and formats only. It cannot recommend products for human or animal use, health goals, dosing or administration. Try a product name or a format such as lab water."};
  let desired:ProductKind|undefined;
  if(/\b(?:water|h2o|bacteriostatic)\b/.test(text)) desired="water";
  else if(/\b(?:spray|sprays|solution|solutions)\b/.test(text)) desired="spray";
  else if(/\b(?:blend|blends)\b/.test(text)) desired="blend";
  else if(/\b(?:single|individual)\b/.test(text)) desired="single";
  const formats=new Set("spray sprays solution solutions blend blends single individual water h2o bacteriostatic".split(" "));
  const tokens=text.split(" ").filter(t=>t&&!filler.has(t)&&!formats.has(t));
  const compact=(s:string)=>normalize(s).replace(/ /g,"");
  const matches=scoped.filter(p=>{
    if(desired&&p.kind!==desired)return false;
    const aliases=[p.name,p.id,p.mark,p.reference,...(p.aliases||[])];
    const words=normalize(aliases.join(" ")).split(" ");
    return tokens.every(t=>words.some(w=>w.startsWith(t))||aliases.some(a=>compact(a).includes(t)));
  });
  // Unknown or unsupported criteria produce no matches, never a guessed substitution.
  if(text&&!tokens.length&&!desired&&!/^(?:all|all products|products|all compounds|compounds|all peptides|peptides)$/.test(text)) return {products:[],scope:"unmatched",message:"Add a product name or format, such as BPC-157, blends or lab water. This is a catalog search, not a suitability recommendation."};
  return {products:matches,scope:matches.length?"catalog":"unmatched",message:matches.length?"Matches use product names and formats only, not health information or suitability.":"No products match. Try a shorter product name, change the product type, or clear the search. We do not guess alternatives."};
}
