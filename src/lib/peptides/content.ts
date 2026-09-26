/**
 * Editorial content for the /peptides/[slug] cluster.
 *
 * The numeric dosage tables, syringe math, and reconstitution steps are all
 * derived deterministically from the calculator and peptides.ts. This file
 * carries the genuinely unique, human-written context per peptide so the pages
 * are not templated text with a single word swapped. All copy is framed for
 * research and education only, never as medical or dosing advice.
 */

import type { PeptideCategory } from "@/lib/calc/peptides";

export interface PeptideContent {
  /** One or two sentences: what this peptide is. */
  what: string;
  /** What it is researched or reconstituted for, framed as research. */
  uses: string;
  /** Peptide-specific mixing, handling, or storage caveat. Optional. */
  caveat?: string;
  sources?: string[];
  /** Brand names, alternate spellings, or commonly-searched aliases. Optional. */
  aka?: string;
  /** Extra FAQ entries beyond the auto-generated per-strength and storage ones. */
  faqs?: { q: string; a: string }[];
}

/** Shared framing per category, used as supporting context on each page. */
export const CATEGORY_CONTEXT: Record<PeptideCategory, string> = {
  "healing": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "growth": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "metabolic": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "cognitive": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "cosmetic": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "reproductive": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "longevity": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication.",
  "other": "This grouping is for navigation. It does not identify a preparation method or establish a treatment indication."
};
export const PEPTIDE_CONTENT: Record<string, PeptideContent> = {
  "bpc-157": {
    "what": "BPC-157 appears in published preclinical research, including the rat ligament and tendon studies linked below.",
    "uses": "Those experimental conditions are not a human preparation method. This page separates the research references from concentration arithmetic.",
    "caveat": "FDA identifies safety uncertainties for BPC-157. A vial name, numerical result or cited animal study cannot resolve the identity and suitability of a specific product.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/20225319/",
      "https://pubmed.ncbi.nlm.nih.gov/16583442/"
    ]
  },
  "tb-500": {
    "what": "The TB-500 label needs an identity check. Full-length thymosin beta-4 and a peptide fragment are not interchangeable research materials.",
    "uses": "The cited wound study concerns thymosin beta-4. Its observations should not be silently assigned to a different material sold under a shorthand name.",
    "caveat": "Confirm the exact sequence or product identity. A correct mg/mL calculation cannot establish that two similarly named materials are the same.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/10469335/"
    ]
  },
  "ipamorelin": {
    "what": "Ipamorelin was investigated in a published rat bone-growth experiment. The original study record is linked below.",
    "uses": "That reference describes a specific experimental design, not a current regimen for a reader. A combination-product label also needs each component amount.",
    "caveat": "Do not choose a syringe or schedule from a research amount on this page. Use the actual concentration and the instructions already supplied for the product.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/10373343/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "cjc-1295-no-dac": {
    "what": "This entry preserves the distinct no-DAC label rather than treating it as the long-acting preparation in the linked CJC-1295 research.",
    "uses": "The long-acting CJC-1295 study is not displayed here as a study of the no-DAC product. Similar names do not establish an identical formulation.",
    "caveat": "Verify the exact variant and any blend ratio. The former fixed three-week storage claim was removed because it was not tied to an identified formulation.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/17018654/"
    ],
    "aka": "Search labels may include CJC no DAC or Mod GRF 1-29; verify the exact identity rather than assuming equivalence."
  },
  "cjc-1295-with-dac": {
    "what": "The long-acting CJC-1295 research below examined hormone secretion after a single administration in healthy adult men.",
    "uses": "This is a different reference question from a no-DAC product. The experiment does not establish the preparation instructions for an unidentified vial.",
    "caveat": "Do not borrow an amount, frequency or storage period from a similarly named variant. Preserve the full variant name with your records.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/17018654/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "sermorelin": {
    "what": "The sermorelin entry is a label-based calculation reference, not a prescription or a complete evidence review.",
    "uses": "Distinguish a total vial amount from a solution concentration. An amount written in mg and an amount written in mcg differ by a factor of 1,000.",
    "caveat": "This page does not assign a fixed storage period or standard mixing method to every sermorelin formulation.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "hexarelin": {
    "what": "This hexarelin reference accepts a stated mass and final solution volume. It does not verify the supplied material.",
    "uses": "For a small stated amount, retain all relevant decimal places before calculating. A convenient displayed mark does not establish measurable device precision.",
    "caveat": "No potency comparison or recommended amount follows from this calculator. Match the exact product identity and units in your existing instructions.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "semaglutide": {
    "what": "Semaglutide products must be distinguished by formulation and actual labeling, not only by a familiar brand or active-ingredient name.",
    "uses": "FDA warns about unapproved GLP-1 products and differences involving semaglutide salt forms. An unrelated powder cannot be treated as an approved finished product.",
    "caveat": "An existing liquid may already have a stated concentration. Do not add a vehicle merely because a page is called a reconstitution calculator.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ],
    "faqs": [
      {
        "q": "Can I transfer syringe units from a different semaglutide product?",
        "a": "Not from the unit count alone. A different concentration changes the mass represented by the same liquid volume. Confirm the exact label and instructions with the dispensing professional."
      }
    ]
  },
  "tirzepatide": {
    "what": "This page checks concentration relationships for numbers associated with a tirzepatide label. It does not select a formulation.",
    "uses": "A total such as 30 mg or 60 mg is not a final liquid volume. Without the actual volume or concentration, many different numerical solutions are possible.",
    "caveat": "Do not treat a research-labeled vial as interchangeable with a finished medicine. A larger stated mass also does not establish a safe mixing volume or use period.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ],
    "faqs": [
      {
        "q": "How much water corresponds to a 30 mg or 60 mg label?",
        "a": "Mass alone does not specify a volume. Use the exact product instructions or the stated concentration of an existing solution. The calculator checks the arithmetic after those facts are known."
      }
    ]
  },
  "retatrutide": {
    "what": "Retatrutide is discussed in ongoing drug-development research, not established here as an approved consumer product.",
    "uses": "FDA states that retatrutide is not a component of an FDA-approved drug. A trial mention does not verify a product marketed under the same name.",
    "caveat": "The calculator is not a route to choosing a research regimen or preparing an unapproved product for personal use.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ],
    "aka": "A shortened search label such as reta still needs exact product identification."
  },
  "cagrilintide": {
    "what": "Cagrilintide is another drug-development name that requires a clear distinction between research and an identified finished product.",
    "uses": "FDA states that cagrilintide is not a component of an FDA-approved drug. This page does not extend another product's instructions to it.",
    "caveat": "A combined-product or combination-study name does not supply the individual amounts or establish that separate substances can be mixed.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ]
  },
  "mots-c": {
    "what": "MOTS-c is listed among the substances discussed in FDA's compounding safety-risk information.",
    "uses": "This reference does not convert a category such as metabolic or longevity research into evidence of a benefit for the reader.",
    "caveat": "Confirm whether a label states total mg, mg/mL or an amount per container. The calculator will not infer a duration, cycle or storage period.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "epithalon": {
    "what": "The spellings epithalon and epitalon can appear in search and product descriptions. Use the exact identity supplied in the product documentation.",
    "uses": "FDA lists Epitalon in its information about compounding safety uncertainties. Naming similarity is not a quality or compatibility test.",
    "caveat": "No research cycle is preselected here. A count of portions is an arithmetic result, not a schedule.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "ghk-cu": {
    "what": "GHK-Cu is a copper-peptide complex examined in the rat wound-chamber experiment linked below.",
    "uses": "That experiment concerns a defined material and experimental conditions. It does not verify cosmetic, laboratory or injectable products found under similar names.",
    "caveat": "Color cannot establish sterility or purity. The earlier claim that a blue tint is not a sign of contamination was too broad and has been removed.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/8227353/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "melanotan-2": {
    "what": "A small 1998 human experiment investigated Melanotan-II under controlled conditions. Its record is linked as historical research.",
    "uses": "The published experiment and its reported adverse effects are not instructions to start with a test amount or adjust a personal regimen.",
    "caveat": "This page does not recommend pigmentation use or a preparation method. A calculator cannot determine whether a product is appropriate for someone.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/9679884/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ],
    "aka": "Also searched as Melanotan II, MT2 or MT-2."
  },
  "ss-31": {
    "what": "SS-31 is also known as elamipretide. FDA approved the specific product Forzinity in September 2025 for a defined indication.",
    "uses": "An approval of that product does not authenticate any powder or vial carrying the SS-31 name. This site does not transfer the finished product's instructions to an unrelated formulation.",
    "caveat": "Use the exact formulation and its label. The former blanket research-only classification did not capture the approved-product distinction.",
    "sources": [
      "https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-forzinity"
    ]
  },
  "selank": {
    "what": "The Selank reference is a place to check label units and concentration, not a claim about a cognitive benefit.",
    "uses": "FDA's compounding information notes safety-data limitations for Selank acetate. The acetate qualifier is part of the identity question.",
    "caveat": "Do not substitute route or preparation instructions from another cognitive-research entry. The category is navigation, not a protocol.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "semax": {
    "what": "A 2006 Semax experiment measured molecular and behavioral effects in rats. The source below identifies the species and study setting.",
    "uses": "That animal experiment cannot establish a human amount or validate all products sold under the same name. This is not a comprehensive review of clinical evidence.",
    "caveat": "Do not transfer a study's route or formulation to an unrelated vial. The calculator checks numbers, not product equivalence.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/16996037/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "aod-9604": {
    "what": "AOD-9604 appears in FDA's discussion of compounding safety uncertainties. The label should identify the exact material.",
    "uses": "This entry does not infer an amount from the growth-hormone category or present that category as a treatment indication.",
    "caveat": "A comparison with another fragment or full protein requires identity and formulation evidence; equal milligram totals do not establish equivalent biological effects.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "kisspeptin-10": {
    "what": "The numeric suffix in kisspeptin-10 is part of the name, not a vial mass or a syringe-unit instruction.",
    "uses": "Keep a product identifier separate from fields for amount and final volume. A number in a compound name must not become a calculator input automatically.",
    "caveat": "Verify the exact label and units. This page does not choose a reproductive-health intervention or infer a regimen.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "pt-141": {
    "what": "PT-141 is a search name associated with bremelanotide. A product name and its finished formulation still need to be verified separately.",
    "uses": "A historical or approved-product reference is not evidence that another supplied material has the same concentration or instructions.",
    "caveat": "The number 141 is part of the compound label, not an amount. The calculator does not select a route, dose or schedule.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "aka": "Also searched as bremelanotide."
  },
  "hcg": {
    "what": "An HCG label may express biological activity in international units, abbreviated IU, rather than mass in mg.",
    "uses": "Open the dedicated hCG IU calculator when that is how the product is labeled. Product IU and U-100 syringe-volume units are different quantities.",
    "caveat": "There is no universal mg-to-IU conversion. The generic mass-based plan builder must not receive an IU value in its milligram field.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "faqs": [
      {
        "q": "Are 100 IU of a product the same as 100 syringe units?",
        "a": "No. A product's IU describes activity. U-100 syringe units describe liquid volume. The product concentration in IU/mL is needed to connect an entered activity amount with a volume."
      }
    ]
  },
  "glow-blend": {
    "what": "The catalog product GLOW lists BPC-157, TB-500 and GHK-Cu. Other products using a similar blend name may differ. Read every component and its stated amount on the exact label; no ratio is assumed here.",
    "uses": "For a defined, uniformly mixed solution, each component concentration depends on its own stated mass and the final volume. A combined mass does not identify the amount of BPC-157, TB-500 or GHK-Cu separately.",
    "caveat": "Use the GLOW product calculator to enter each of its three component amounts. Neither that calculator nor this reference validates compatibility, identity or uniform mixing. Do not treat combined mass as the amount of one component.",
    "sources": [
      "https://www.aminoclub.com/us/products/glow",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "custom": {
    "what": "Use the custom reference for a material not listed by name, once its relevant mass and final volume are known.",
    "uses": "The arithmetic is general, but formulation and compatibility are not. This page does not impose one preparation method on every substance.",
    "caveat": "The mass fields accept mg or mcg, not biological IU. A name typed into a free-text field does not create verified product facts.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  }
};
