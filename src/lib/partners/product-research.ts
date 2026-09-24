import type { SupplierProduct } from "./supplier-catalog";

/** Independent, non-therapeutic catalog notes. No effect, purity, stock or dose claims.
 * Source of listing names/formats: each SupplierProduct.sourceUrl, checked 2026-09-23.
 * Names identify references, not the verified contents of an individual batch.
 */
const IDENTITIES: Record<string, string> = {
  "amino-h2o": "A laboratory water listing. Water is a supply, not a peptide; the exact composition, preservative and container volume belong to the current label.",
  "glp-1": "The supplier's GLP-1 / SM listing, identified here as Semaglutide. It is a different named compound from the GLP-2 / TR and GLP-3 / RT listings.",
  "glp-2": "The supplier's GLP-2 / TR listing, identified here as Tirzepatide. The catalog abbreviation is a listing name, not a substitute for the full compound identity.",
  "glp-3": "The supplier's GLP-3 / RT listing, identified here as Retatrutide. It is kept separate from Semaglutide and Tirzepatide rather than grouped as an interchangeable product.",
  "bpc-157": "A single-compound listing under the BPC-157 identifier. This entry is separate from BPC-157 solutions and from mixtures that also list TB-500.",
  "ghk-cu": "A copper-peptide complex identified by GHK-Cu. The GHK peptide identity, its copper-bound form and the separately listed solution format are important distinctions.",
  "tb-500": "A single-compound listing named TB-500. Check the exact sequence and molecular identity in the batch documentation rather than inferring them from the abbreviated name.",
  "tesamorlin": "The supplier lists this entry under the spelling Tesamorlin; the catalog uses Tesamorelin for name matching. Confirm the full identity on the current label and batch report.",
  "mots-c": "A research listing identified as MOTS-C. The letter C is part of the name; this entry is not treated as equivalent to another similarly named peptide.",
  "nad-plus": "The single-compound NAD+ listing. The plus sign is part of the chemical notation, and this listing is separate from the ready-made NAD+ solution.",
  "cjc-ipa-no-dac": "A combined listing naming CJC-1295 and Ipamorelin, with a No DAC qualifier. A combined product is not the same as either separately listed ingredient.",
  "kpv": "A single-compound listing using the KPV peptide identifier. Check the full sequence and formulation in the documentation rather than relying only on the three-letter name.",
  "klow": "KLOW is a named research blend, not a single-compound identity. Its name alone does not establish the current ingredients, their individual amounts or their ratio.",
  "semax": "The single-compound SEMAX listing. Keep this entry distinct from SEMAX Spray and other separately named compounds rather than assuming matching formulations.",
  "glutathione": "A listing named Glutathione. Confirm the stated chemical form and analytical identity on its documentation; the name alone does not specify every formulation detail.",
  "melanotan-ii": "A single-compound listing named Melanotan II. The Roman numeral matters: Melanotan I is a different catalog entry, and the solution is listed separately.",
  "glow": "GLOW is a named multi-ingredient research blend. Read the current ingredient list and each stated amount; the blend name does not establish a composition or research outcome.",
  "selank": "The single-compound SELANK listing. It is distinct from SELANK Spray and from similarly named modified compounds in the solution catalog.",
  "melanotan-i": "The Melanotan I listing. It is intentionally separated from Melanotan II; similar names do not establish the same sequence, identity or formulation.",
  "igf-1-lr3": "A research listing carrying the IGF-1 LR3 identifier. The LR3 qualifier is part of the named variant and should be retained when matching a label or report.",
  "5-amino-1mq": "A compound listing named 5-Amino-1MQ. Preserve the complete identifier, including the number, when comparing its label with the corresponding analytical documentation.",
  "wolverine-stack": "A BPC-157 / TB-500 blend also labeled Wolverine. The nickname identifies this listing; it does not describe a benefit or establish the amount of either ingredient.",
  "pt-141": "The single-compound PT-141 listing. This identifier is kept separate from PT-141 Spray so that a name match does not conceal a difference in product format.",
  "cagrilintide": "A separately named Cagrilintide research listing. It is not a Semaglutide blend or a substitute for another compound simply because listings appear near each other.",
  "aod-9604": "A research listing identified as AOD-9604. Retain the numbered identifier when matching the product label and the batch-specific identity documentation.",
  "dsip": "The single-compound DSIP listing. Its abbreviated name identifies the entry; the separate DSIP Spray listing has a different product format.",
  "epithalon": "A research listing named Epithalon, also searched as Epitalon. Name variants help locate a listing but do not replace verification of the exact sequence and form.",
  "ipamorelin": "The standalone Ipamorelin listing. It is separate from the combined CJC-1295 / Ipamorelin product, which requires documentation for more than one ingredient.",
  "snap-8": "A single-compound listing using the SNAP-8 identifier. The number is part of the name; this directory does not treat differently numbered SNAP materials as interchangeable.",
  "thymosin-alpha-1": "The Thymosin Alpha-1 listing. Alpha-1 is an identity qualifier, not a reference to every thymosin-family material or to the separately listed TB-500 product.",
  "ll-37": "A research listing identified as LL-37. Match the complete letter-and-number identifier and the documented sequence, not a shortened or similar-looking name.",
  "cartalax": "A single-compound listing named Cartalax. Its catalog name is an identifier, not evidence of a particular effect, and the exact material must be checked against the label.",
  "sermorelin": "A separately named Sermorelin listing. Do not infer that it is the same material as Tesamorelin or another similarly named research compound.",
  "kisspeptin": "The supplier's Kisspeptin listing, identified here as Kisspeptin-10. The numbered form is retained to distinguish it from other kisspeptin variants in research literature.",
  "dihexa": "A research compound listed as Dihexa. Being included in this catalog does not establish a shared chemical class, format or specification with every other listed material.",
  "vip": "A research listing under the VIP identifier. An abbreviation should be matched to the complete identity in the label and analytical report before comparing materials.",
  "ara-290": "A separately named ARA-290 research listing. Match the exact numbered identifier in the supplier documentation rather than inferring identity from a related compound.",
  "pinealon": "A single-compound research listing named Pinealon. The catalog separates it from other short-name peptide listings; sequence and chemical form require their own documentation.",
  "ahk-cu": "A copper-peptide listing identified as AHK-Cu. It is not GHK-Cu: the different first letter is a meaningful identity distinction, not an alternate spelling.",
};
const ALIASES: Record<string, string> = {
  "amino-h2o": "bacteriostatic water bac water h2o laboratory diluent solvent",
  "glp-1": "glp1 glp 1 sm semaglutide",
  "glp-2": "glp2 glp 2 tr tirzepatide tirzepetide",
  "glp-3": "glp3 glp 3 rt retatrutide",
  "ghk-cu": "ghk copper copper peptide complex metal binding coordination",
  "ghkcu-spray": "ghk copper copper peptide complex metal binding coordination solution",
  "ahk-cu": "ahk copper copper peptide complex metal binding coordination",
  "nad-plus": "nad plus nicotinamide adenine dinucleotide",
  "nad-plus-spray": "nad plus nicotinamide adenine dinucleotide solution",
  "glutathione": "gsh",
  "epithalon": "epitalon",
  "tesamorlin": "tesamorelin tesamorlin",
  "kisspeptin": "kisspeptin 10 kisspeptin10",
  "cjc-ipa-no-dac": "cjc1295 cjc 1295 ipamorelin no dac",
  "wolverine-stack": "bpc157 bpc 157 tb500 tb 500 wolverine blend",
  "bpc-tb-spray": "bpc157 bpc 157 tb500 tb 500 wolverine solution",
};
export const PRODUCT_TYPE_LABELS = { single: "Single compounds", blend: "Blends", spray: "Solutions", water: "Lab water" } as const;
export function getProductResearch(product: SupplierProduct) {
  const copper = ["ghk-cu", "ghkcu-spray", "ahk-cu"].includes(product.id);
  const topic = copper ? "Copper complexes" : product.kind === "water" ? "Laboratory diluents" :
    product.kind === "blend" ? "Mixture characterization" : product.kind === "spray" ? "Solution characterization" : "Compound identity";
  const identity = IDENTITIES[product.id] || `${product.name} is a separately listed research solution. Its format is not interchangeable with a dry-material listing of a similar name. The spray label describes the supplier's presentation, not an instruction for application.`;
  const context = copper
    ? "A useful distinction in analytical research is the peptide identity versus the copper-complex identity. Compare the specified chemical form and the method used to establish it; a name or illustration alone cannot resolve that distinction."
    : product.kind === "blend"
    ? "Mixture characterization looks at each named component separately. A total mass or combined purity statement cannot, on its own, establish the amount or identity of every component."
    : product.kind === "spray"
    ? "Solution characterization distinguishes identity, concentration and solvent composition. A container format or product nickname does not establish those properties, and no spray count or administration instructions are provided here."
    : product.kind === "water"
    ? "Laboratory diluent comparisons depend on the specified water composition and the needs of a documented laboratory method. The word water alone does not establish compatibility with another material."
    : "Compound characterization begins with the full identity, stated form and batch-specific documentation. A similarly named material in a paper is not proof of what is in a particular supplier vial.";
  const checks = product.kind === "blend"
    ? ["Full ingredient names and identities", "Amount of each component, not only the total", "The matching batch report and analytical methods"]
    : product.kind === "spray"
    ? ["Exact compound or ingredient list", "Stated concentration, solvent and total volume", "Batch documentation for this solution, not a different format"]
    : product.kind === "water"
    ? ["Composition and any listed preservative", "Container volume and the exact laboratory specification", "Product-specific storage and handling documentation"]
    : ["Full name, sequence or chemical identity, and stated form", "Labeled amount and the matching batch identifier", "Analytical methods and the limits of the reported results"];
  return { identity, context, checks, topic, aliases: ALIASES[product.id] || "" };
}
