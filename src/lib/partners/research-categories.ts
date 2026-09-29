/** Catalog navigation adapted from the supplied Amino H2O screenshot, 2026-09-29.
 * These 29 assignments are visible in that source. Do not infer assignments for
 * other products, including sprays, from an ingredient or a similar name.
 * Tissue-Repair is rendered as Tissue research to avoid a promised outcome.
 */
export const RESEARCH_CATEGORIES = [
  {id:"metabolic",label:"Metabolic",products:["glp-3","tesamorlin","aod-9604","mots-c","cagrilintide","5-amino-1mq"]},
  {id:"tissue",label:"Tissue research",products:["bpc-157","tb-500","wolverine-stack"]},
  {id:"dermal",label:"Dermal",products:["ghk-cu","glow","klow","snap-8"]},
  {id:"melanocortin",label:"Melanocortin",products:["melanotan-ii","pt-141","melanotan-i"]},
  {id:"cellular",label:"Cellular",products:["nad-plus"]},
  {id:"growth-factor",label:"Growth factor",products:["cjc-ipa-no-dac","ipamorelin","igf-1-lr3"]},
  {id:"circadian",label:"Circadian",products:["dsip"]},
  {id:"neuropeptide",label:"Neuropeptide",products:["semax","selank"]},
  {id:"tripeptide",label:"Tripeptide",products:["kpv"]},
  {id:"antioxidant",label:"Antioxidant",products:["glutathione"]},
  {id:"gerontological",label:"Gerontological",products:["epithalon","cartalax"]},
  {id:"immunomodulatory",label:"Immunomodulatory",products:["thymosin-alpha-1","ll-37"]},
  {id:"lab-supplies",label:"Lab supplies",products:["amino-h2o"]},
  {id:"additional",label:"Additional compounds",products:[]},
] as const;
export type ResearchCategory = typeof RESEARCH_CATEGORIES[number]["id"];
export function researchCategory(id:string) {
  return RESEARCH_CATEGORIES.find(category=>(category.products as readonly string[]).includes(id)) ?? RESEARCH_CATEGORIES[RESEARCH_CATEGORIES.length-1];
}
export function matchesResearchCategory(id:string,category:ResearchCategory|"all") {
  return category==="all" || researchCategory(id).id===category;
}
