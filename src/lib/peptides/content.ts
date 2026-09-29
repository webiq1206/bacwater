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
  "healing": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "growth": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "metabolic": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "cognitive": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "cosmetic": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "reproductive": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "longevity": "This group helps you browse. It does not choose a mixing method or show that a product treats anything.",
  "other": "This group helps you browse. It does not choose a mixing method or show that a product treats anything."
};
export const PEPTIDE_CONTENT: Record<string, PeptideContent> = {
  "bpc-157": {
    "what": "The linked studies tested BPC-157 in rats, including tissues that join muscle to bone or bone to bone. They did not test the supplier’s vial.",
    "uses": "A study’s test conditions are not instructions for use in people. This page explains the label numbers and keeps them separate from the research.",
    "caveat": "FDA notes gaps in the safety information for BPC-157. A name, a math result or an animal study cannot tell you that a product is safe or suitable.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/20225319/",
      "https://pubmed.ncbi.nlm.nih.gov/16583442/"
    ]
  },
  "tb-500": {
    "what": "Check exactly what the TB-500 label names. A whole chemical chain called thymosin beta-4 and a shorter piece of it may act differently.",
    "uses": "The linked study tested full thymosin beta-4. Do not assume that its results apply to a different chain sold as TB-500.",
    "caveat": "Check the order of the chain’s building blocks. Correct math cannot show that two products with similar names contain the same material.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/10469335/"
    ]
  },
  "ipamorelin": {
    "what": "The linked study tested ipamorelin in a rat bone-growth experiment. It is a record of that test, not a result for a purchased vial.",
    "uses": "The study describes what researchers tested. It does not give a schedule for a reader. A blend label must also state the amount of each ingredient.",
    "caveat": "Do not choose a measuring device or schedule from a study amount. The calculator needs numbers from instructions you already have.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/10373343/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "cjc-1295-no-dac": {
    "what": "No DAC names a particular CJC form. It lacks an added chemical part found in another form. The linked longer-acting CJC study tested that other form.",
    "uses": "Similar names do not mean the products have the same contents or act for the same length of time. Keep the No DAC difference with your records.",
    "caveat": "Check the exact form and each ingredient in a blend. This page does not set a storage time for an unknown product.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://pubmed.ncbi.nlm.nih.gov/17018654/"
    ],
    "aka": "Search labels may include CJC no DAC or Mod GRF 1-29; verify the exact identity rather than assuming equivalence."
  },
  "cjc-1295-with-dac": {
    "what": "The linked CJC-1295 study measured hormone release in adult men. Hormones are chemical messages. This study concerned the form with DAC, an added chemical part.",
    "uses": "The No DAC form is different. This experiment does not give preparation instructions for every vial with a CJC name.",
    "caveat": "Keep the full product name in your records. Do not copy an amount, schedule or storage date from a different form.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/17018654/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "sermorelin": {
    "what": "This page checks label numbers for Sermorelin. It is not a prescription or a review of every study.",
    "uses": "Total mg means how much material the vial holds. mg/mL means how much is in each mL of liquid. Also, 1 mg equals 1,000 mcg.",
    "caveat": "The page does not choose one mixing method or storage time for all products named Sermorelin.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "hexarelin": {
    "what": "This reference uses the stated amount of material and final liquid amount to check math. It cannot check what is really in the vial.",
    "uses": "Keep the full number, including its decimal places, until the calculation is done. A displayed mark does not prove that an actual device can measure that amount.",
    "caveat": "The calculator cannot rank strength or recommend an amount. Match the exact product and units in your existing instructions.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "semaglutide": {
    "what": "Products with a semaglutide name can differ in what they contain. Check the full product name, ingredients and label.",
    "uses": "FDA warns about unapproved GLP-1 products, including different salt forms of semaglutide. A research powder is not the same item as an approved medicine.",
    "caveat": "A ready-made liquid may already state the amount in each mL. A calculator page is not a reason to add more liquid.",
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
    "what": "This page checks the math for numbers on a tirzepatide label. It does not choose a product or how to prepare one.",
    "uses": "A label such as 30 mg or 60 mg states the amount of material. It does not state how much liquid there is. You need that liquid amount to find mg/mL.",
    "caveat": "A research vial is not interchangeable with a finished medicine. More mg does not tell you how much liquid to add or how long a product lasts.",
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
    "what": "Retatrutide is being studied in drug research. A research product with that name is not established here as an approved medicine.",
    "uses": "FDA states that retatrutide is not an ingredient in an FDA-approved drug. A study does not check the contents of a product sold under the same name.",
    "caveat": "The calculator does not choose a schedule or help prepare an unapproved product for personal use.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ],
    "aka": "A shortened search label such as reta still needs exact product identification."
  },
  "cagrilintide": {
    "what": "Cagrilintide is being studied in drug research. A paper about it is not a test of every product sold with the same name.",
    "uses": "FDA states that cagrilintide is not an ingredient in an FDA-approved drug. Instructions for another product do not automatically apply to it.",
    "caveat": "A blend name does not tell you each ingredient amount or prove that separate materials can be mixed.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ]
  },
  "mots-c": {
    "what": "FDA includes MOTS-c in its information about gaps in the safety data for some substances used in compounding, which means making a medicine to order.",
    "uses": "A research category describes a topic. It does not show that the product gives a reader more energy or a longer life.",
    "caveat": "Check whether the number is total mg or mg in each mL. The calculator does not guess a schedule or storage time.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "epithalon": {
    "what": "You may see the spellings Epithalon and Epitalon. Check the exact chemical named in the label and batch report.",
    "uses": "FDA lists Epitalon among substances with gaps in the safety data. Similar names do not prove the same contents or tell you what can be mixed.",
    "caveat": "The calculator does not choose a schedule. A portion count shows how many entered amounts fit in the total, not when to use them.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "ghk-cu": {
    "what": "GHK-Cu is a short chemical chain that holds copper. The linked study tested it in a rat tissue experiment.",
    "uses": "The experiment used one defined material under set conditions. It did not check every lab, skin or other product with a similar name.",
    "caveat": "Color cannot show that a liquid is free of germs or unwanted chemicals. A blue tint is not a quality test.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/8227353/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "melanotan-2": {
    "what": "A small human study tested Melanotan-II in 1998. The link records that earlier experiment and its limits.",
    "uses": "The paper also reported unwanted effects. It is not an instruction to try a small amount or change a personal schedule.",
    "caveat": "This page does not recommend tanning use or a mixing method. A calculator cannot decide that a product is right for a person.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/9679884/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ],
    "aka": "Also searched as Melanotan II, MT2 or MT-2."
  },
  "ss-31": {
    "what": "SS-31 is also called elamipretide. FDA approved a specific medicine called Forzinity in September 2025 for a specific use.",
    "uses": "That approval does not check every powder or vial named SS-31. Instructions for the approved medicine do not apply to a different product just because a name is similar.",
    "caveat": "Check the exact product and its label. Keep the approved medicine separate from other research materials with the same chemical name.",
    "sources": [
      "https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-forzinity"
    ]
  },
  "selank": {
    "what": "This Selank reference checks label units and the amount in each mL. It does not claim a memory or focus benefit.",
    "uses": "FDA notes gaps in safety data for Selank acetate. Acetate is part of the chemical form’s name, so it belongs in the identity check.",
    "caveat": "Do not copy use or mixing instructions from another entry. A research category is a way to browse, not a lab procedure.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "semax": {
    "what": "A 2006 study measured chemical signals and behavior in rats after Semax exposure. The linked record explains that test.",
    "uses": "A rat experiment does not set an amount for people or check every product sold as Semax. This page does not review every human study.",
    "caveat": "Do not copy a study’s method to a different vial. The calculator checks numbers, not whether two products are the same.",
    "sources": [
      "https://pubmed.ncbi.nlm.nih.gov/16996037/",
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "aod-9604": {
    "what": "FDA lists gaps in the safety information for AOD-9604. Check the full chemical name on the label.",
    "uses": "This page does not pick an amount based on a growth-hormone category. A category is a research topic, not an approved use.",
    "caveat": "A small piece of a protein may act differently from the whole chain. The same number of mg does not mean the same effect.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks"
    ]
  },
  "kisspeptin-10": {
    "what": "The 10 in Kisspeptin-10 is part of its name. It is not the vial amount or a mark to read on a scale.",
    "uses": "Keep a product’s name separate from the amount fields. A number in a name should not automatically become a number in the calculator.",
    "caveat": "Check the exact label and units. This page does not choose a health treatment or a schedule.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "pt-141": {
    "what": "PT-141 is also called bremelanotide. A chemical name does not identify every detail of a finished product.",
    "uses": "A study or an approved medicine does not show that another product has the same amount in each mL or the same instructions.",
    "caveat": "The 141 is part of the name, not an amount. The calculator does not select a dose, schedule or way to use a product.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "aka": "Also searched as bremelanotide."
  },
  "hcg": {
    "what": "An hCG label may use international units, or IU. These measure an effect in a standard test. They do not measure mass in mg.",
    "uses": "Use the hCG IU calculator for a label in IU. Product IU and U-100 scale units are different: U-100 units describe the amount of liquid.",
    "caveat": "There is no one conversion from mg to IU for every substance. Do not put an IU number in a field that asks for mg.",
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
    "what": "The catalog GLOW blend lists BPC-157, TB-500 and GHK-Cu. Other products with a similar name may differ. Read each ingredient and its amount.",
    "uses": "To find the amount of each ingredient in each mL, you need that ingredient’s mg and the final liquid volume. A total blend amount does not tell you each share.",
    "caveat": "The GLOW calculator accepts a known blend total or separately stated ingredient amounts. It does not guess the shares, check that the mixture is even or prove the ingredients can be mixed.",
    "sources": [
      "https://www.aminoclub.com/us/products/glow",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  },
  "custom": {
    "what": "Use this option for a named material outside the list when you already know its amount and final liquid volume.",
    "uses": "The same math can apply to different materials. That does not mean they need the same liquid or can be prepared in the same way.",
    "caveat": "Mass fields use mg or mcg, not IU. Typing a name does not let the calculator check the contents of a product.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ]
  }
};
