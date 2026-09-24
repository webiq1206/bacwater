import { type SupplierProduct, type ProductKind } from "./supplier-catalog";

export const DIRECTORY_KINDS: readonly [ProductKind | "all", string][] = [
  ["all", "All products"], ["single", "Single compounds"], ["blend", "Blends"],
  ["spray", "Sprays and solutions"], ["water", "Lab water"],
];
export const PRODUCT_FORMATS: Record<ProductKind, string> = {
  single: "Individual compound listing", blend: "Multi-ingredient listing",
  spray: "Prepared research solution", water: "Laboratory water supply",
};
const distinctions: Record<string,string> = {
  "amino-h2o":"This is the laboratory water entry, not a peptide or a compound blend. Verify the bottle label and listed composition rather than treating different kinds of laboratory water as interchangeable.",
  "glp-1":"This directory associates the supplier's GLP-1 (SM) entry with the Semaglutide name. It is separate from the GLP-2 (TR) and GLP-3 (RT) entries. Match the complete supplier label before comparing documentation.",
  "glp-2":"This is the Tirzepatide entry, listed by the supplier as GLP-2 (TR). It is separate from the GLP-1 (SM) and GLP-3 (RT) entries; the abbreviated listing names do not make them interchangeable.",
  "glp-3":"This is the Retatrutide entry, listed by the supplier as GLP-3 (RT). It is separate from the GLP-1 (SM) and GLP-2 (TR) entries. Use the exact product identity when reviewing a batch report.",
  "bpc-157":"The individual BPC-157 entry is separate from BPC-157 Spray and the BPC-157 / TB-500 blend. A report for one of those entries does not establish the contents of another.",
  "ghk-cu":"This is the GHK-Cu entry. GHK-Cu Spray and AHK-Cu are separate listings. Similar abbreviations should not be used to substitute one label or batch report for another.",
  "tb-500":"The individual TB-500 entry is separate from the combined BPC-157 / TB-500 listings. Check the full product name rather than assuming that the combined listing contains the same amount of each ingredient.",
  "tesamorlin":"This directory uses the spelling Tesamorelin; the supplier's listing title and destination use Tesamorlin. That spelling difference is recorded here to help match the correct listing, not to establish chemical identity.",
  "mots-c":"MOTS-C is presented as an individual research compound entry. Preserve the full name, including the C suffix, when comparing the label with the exact batch report.",
  "nad-plus":"NAD+ is listed separately from NAD+ Spray. The plus sign is part of the listing name. Package amounts for one format should not be read as a solution concentration for another.",
  "cjc-ipa-no-dac":"This entry names CJC-1295 and Ipamorelin together and includes the No DAC qualifier. It is separate from the individual Ipamorelin entry. Verify all ingredients and their individual amounts on the current label.",
  "kpv":"KPV is an individual compound listing. The abbreviation identifies this catalog entry; it does not establish the ingredients or proportions of a separately named blend.",
  "klow":"KLOW is a named blend entry, separate from GLOW. The name alone does not specify each ingredient or its amount. Check the current full label and the report for that exact blend and batch.",
  "semax":"This is the individual SEMAX entry, not SEMAX Spray. Review documentation for the selected format rather than carrying information between the two listings.",
  "glutathione":"Glutathione is listed as an individual research compound. GSH is used as an abbreviation in this directory's artwork. The artwork is not a product label or a batch certificate.",
  "melanotan-ii":"This is the Melanotan II entry. Melanotan I and Melanotan II Spray are separate listings; the Roman numeral and the format are important parts of the product name.",
  "glow":"GLOW is a named blend entry, separate from KLOW. Its listing name does not establish the quantity of any ingredient. Verify the complete composition and individual amounts with the supplier.",
  "selank":"This is the individual SELANK entry, not SELANK Spray. Each format has its own label and documentation, which should be checked independently.",
  "melanotan-i":"This is the Melanotan I entry, not Melanotan II. The Roman numeral distinguishes the listing and should remain part of any label or batch-document comparison.",
  "igf-1-lr3":"This entry includes the LR3 qualifier in its name. Do not drop that qualifier or use documentation for another similarly named entry as evidence for this product.",
  "5-amino-1mq":"This is the 5-Amino-1MQ listing. Preserve the full numbered name when matching supplier documentation; the short 1MQ artwork mark is not a complete product specification.",
  "wolverine-stack":"This blend entry names BPC-157 and TB-500 together. It is separate from the two individual compounds and from the similarly named spray. No ingredient ratio is inferred from the name.",
  "pt-141":"This is the individual PT-141 entry, separate from PT-141 Spray. Review the exact selected format and its batch report rather than assuming shared package details.",
  "cagrilintide":"Cagrilintide is an individual compound entry. It is not presented here as a combination product. The supplier's current label is the source for its exact package contents.",
  "aod-9604":"This is the AOD-9604 entry. The numeric suffix is part of the product name and should remain present when matching the label to supporting documentation.",
  "dsip":"This is the individual DSIP entry, not DSIP Spray. A dry-package amount and a prepared-solution concentration are different label fields and should not be treated as equivalent.",
  "epithalon":"Epithalon is listed as an individual compound. This directory does not assume that similarly spelled names on other sites identify the same specification or batch.",
  "ipamorelin":"This is the individual Ipamorelin entry, not the CJC-1295 / Ipamorelin (No DAC) blend. Verify the selected product's own composition and label.",
  "snap-8":"This is the SNAP-8 entry. The numeric suffix is part of the name. The listing is not presented as a cosmetic product or as suitable for application to people or animals.",
  "thymosin-alpha-1":"This is the Thymosin Alpha-1 entry. Keep Alpha-1 in the complete name when checking documentation; a report for a differently named thymosin entry is not evidence for this listing.",
  "ghkcu-spray":"This is the prepared GHK-Cu solution entry, separate from the individual GHK-Cu listing. Check the solution's complete composition, container volume and stated concentration on its current label.",
  "nad-plus-spray":"This is the prepared NAD+ solution entry, not the individual NAD+ listing. Check its own concentration, composition and container volume rather than borrowing amounts from the other format.",
  "semax-spray":"This is the prepared SEMAX solution entry, not the individual SEMAX listing. Its format name does not indicate a permitted route of administration.",
  "selank-spray":"This is the prepared SELANK solution entry, separate from individual SELANK. Review the full solution composition and exact batch documentation.",
  "pt-141-spray":"This is the prepared PT-141 solution entry, not the individual PT-141 listing. Availability and package specifications must be checked with the supplier.",
  "melanotan-ii-spray":"This is the prepared Melanotan II solution entry. It is separate from individual Melanotan II and Melanotan I. Match both the Roman numeral and format.",
  "ll-37":"This is the individual LL-37 entry. Preserve both the letters and the numeric suffix when matching the exact product label to a batch document.",
  "cartalax":"Cartalax is presented as an individual research compound entry. No composition, package quantity or performance specification is inferred from the name alone.",
  "sermorelin":"Sermorelin is a separate listing from Tesamorelin despite their similar names. This directory does not treat the two products as substitutes.",
  "kisspeptin":"This directory uses Kisspeptin-10 for the supplier's Kisspeptin entry. Verify the exact molecular identity and the complete supplier label rather than relying on the shortened catalog title.",
  "dihexa":"Dihexa is listed as an individual research compound. A catalog category or product name does not establish molecular identity, suitability or a batch-specific result.",
  "vip":"VIP is an individual research compound listing. This directory preserves the supplier's abbreviated name; confirm the full identity and specification in supplier documentation.",
  "ara-290":"This is the ARA-290 entry. Its numeric identifier is part of the full name and should be retained when checking the product against its batch report.",
  "dsip-spray":"This is the prepared DSIP solution entry, separate from individual DSIP. The solution requires its own label and batch documentation.",
  "adalank-spray":"This is the Adalank Spray entry, not Adamax Spray. The similar spelling does not make the two solution listings interchangeable.",
  "adamax-spray":"This is the Adamax Spray entry, not Adalank Spray. Check the complete name and composition of the selected solution.",
  "bpc-tb-spray":"This is the prepared BPC-157 / TB-500 solution entry. It is separate from BPC-157 Spray and the similarly named non-spray blend. No ingredient ratios are inferred.",
  "bpc-spray":"This is the prepared BPC-157 solution entry, not individual BPC-157 or BPC-157 / TB-500 Spray. Check the selected solution's complete label.",
  "pinealon":"Pinealon is listed as an individual research compound. Review the exact supplier entry and batch identification rather than using the shortened PINE artwork mark as a specification.",
  "ahk-cu":"This is the AHK-Cu entry, not GHK-Cu. The first letter distinguishes these listings. Similar artwork or abbreviations do not establish interchangeable product specifications.",
};
export function productOverview(product: SupplierProduct): string {
  return distinctions[product.id] || `${product.name} is a ${product.label.toLowerCase()} listing. Verify the exact identity, composition and current supplier documentation.`;
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
    const aliases=[p.name,p.id,p.mark,p.reference];
    const words=normalize(aliases.join(" ")).split(" ");
    return tokens.every(t=>words.some(w=>w.startsWith(t))||aliases.some(a=>compact(a).includes(t)));
  });
  // Unknown or unsupported criteria produce no matches, never a guessed substitution.
  if(text&&!tokens.length&&!desired&&!/^(?:all|all products|products|all compounds|compounds|all peptides|peptides)$/.test(text)) return {products:[],scope:"unmatched",message:"Add a product name or format, such as BPC-157, blends or lab water. This is a catalog search, not a suitability recommendation."};
  return {products:matches,scope:matches.length?"catalog":"unmatched",message:matches.length?"Matches use listing names and formats only, not health information or suitability.":"No products match. Try a shorter product name, change the product type, or clear the search. We do not guess alternatives."};
}
