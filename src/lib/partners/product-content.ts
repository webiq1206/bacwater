/** Manually reviewed product names and plain-language compound context, September 25, 2026.
 * The partner controls product naming. Compound research does not validate a supplier batch.
 * No prices, purity scores, treatment claims or dosing instructions are supplied here.
 */
export interface ProductResearch {
  name: string;
  aliases: readonly string[];
  summary: string;
  what: string;
  study: string;
  how: string;
  limit: string;
  sources: readonly { label: string; url: string; type: "product" | "paper" }[];
}
export const PRODUCT_RESEARCH: Readonly<Record<string, ProductResearch>> = {
  "amino-h2o": {
    "name": "Amino H2O",
    "aliases": [
      "BAC water",
      "bacteriostatic water",
      "H2O"
    ],
    "summary": "Water with a preservative, made for lab work.",
    "what": "Amino H2O is water with 0.9% benzyl alcohol, a preservative. It is a lab supply, not a peptide.",
    "study": "Labs use this type of water as a liquid for suitable research samples. It is not the same as plain sterile water or salt water.",
    "how": "The water holds dissolved material. The preservative slows bacterial growth; it does not make every sample germ-free.",
    "limit": "Not every compound can be mixed with this water. The product label and the lab protocol must agree.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/amino-h2o",
        "type": "product"
      }
    ]
  },
  "glp-1": {
    "name": "GLP-1 (SM)",
    "aliases": [
      "Semaglutide",
      "SM",
      "glp1"
    ],
    "summary": "A research peptide that acts at one cell-signal target.",
    "what": "GLP-1 (SM) is a lab-made peptide. A peptide is a chain of small building blocks called amino acids.",
    "study": "Researchers study how it attaches to the GLP-1 receptor. A receptor is a tiny receiver that picks up a message at a cell.",
    "how": "It fits this receiver and starts a signal inside the cell. Researchers measure that signal to learn how the receiver works.",
    "limit": "This research product is not an approved medicine. Findings about medicines do not establish this product’s safety or quality.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/glp-1",
        "type": "product"
      }
    ]
  },
  "glp-2": {
    "name": "GLP-2 (TR)",
    "aliases": [
      "Tirzepatide",
      "TR",
      "glp2"
    ],
    "summary": "One research peptide with two cell-signal targets.",
    "what": "GLP-2 (TR) is a lab-made peptide with 39 amino-acid building blocks.",
    "study": "Scientists study how one molecule can act at two cell receivers: GIP and GLP-1. These are targets used in cell-message research.",
    "how": "The peptide can attach to either receiver and start a signal. Lab tests compare how strongly it acts at each target.",
    "limit": "GLP-2 (TR) is the partner’s product name. It does not mean the natural GLP-2 hormone or a GLP-2 receptor target.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/glp-2",
        "type": "product"
      }
    ]
  },
  "glp-3": {
    "name": "GLP-3 (RT)",
    "aliases": [
      "Retatrutide",
      "RT",
      "LY3437943",
      "glp3"
    ],
    "summary": "One research peptide with three cell-signal targets.",
    "what": "GLP-3 (RT) is a lab-made peptide with 39 amino-acid building blocks.",
    "study": "Scientists study how one molecule can act at three cell receivers: GIP, GLP-1 and glucagon. A receiver picks up a message at a cell.",
    "how": "The peptide fits these receivers and starts signals inside the cell. Researchers compare the fit and the signals at each target.",
    "limit": "The three targets describe the compound’s lab research, not three proven benefits of this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/glp-3",
        "type": "product"
      },
      {
        "label": "Three-receptor structure study",
        "url": "https://www.nature.com/articles/s41421-024-00700-0",
        "type": "paper"
      }
    ]
  },
  "bpc-157": {
    "name": "BPC-157",
    "aliases": [
      "bpc157"
    ],
    "summary": "A short peptide studied in cell movement and tissue models.",
    "what": "BPC-157 is a lab-made chain of 15 amino acids, the small building blocks of peptides.",
    "study": "Lab studies look at how cells move, attach to surfaces and respond when tissue is damaged.",
    "how": "Some studies track signals linked to cell attachment and blood-vessel formation. The full chain of events is not settled.",
    "limit": "These experiments do not prove that this product repairs an injury or is suitable for personal use.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/bpc-157",
        "type": "product"
      },
      {
        "label": "BPC-157 experimental ligament study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/20225319/",
        "type": "paper"
      }
    ]
  },
  "ghk-cu": {
    "name": "GHK-Cu",
    "aliases": [
      "ghkcu"
    ],
    "summary": "A three-part peptide that binds copper.",
    "what": "GHK-Cu is a chain of three amino acids joined to copper. The letters name the three building blocks; Cu means copper.",
    "study": "Researchers study copper binding and how cells make or break down the material around them, including collagen.",
    "how": "The small chain holds a copper ion. Studies measure changes in cell signals and collagen, a protein that forms strong fibers.",
    "limit": "Research on cells or tissue does not establish cosmetic benefits or performance of this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ghk-cu",
        "type": "product"
      },
      {
        "label": "Copper-peptide tissue study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/",
        "type": "paper"
      }
    ]
  },
  "tb-500": {
    "name": "TB-500",
    "aliases": [
      "tb500",
      "thymosin beta 4"
    ],
    "summary": "A peptide product related to thymosin beta-4 research.",
    "what": "TB-500 is a name used for peptide products related to thymosin beta-4. The exact amino-acid chain matters.",
    "study": "Related research looks at actin, a protein that helps cells keep their shape and move.",
    "how": "Thymosin beta-4 binds small actin units and affects how they form fibers. A shorter fragment may not act like the full peptide.",
    "limit": "Do not assume TB-500 is the full thymosin beta-4 molecule. Studies of one form are not proof for another.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/tb-500",
        "type": "product"
      },
      {
        "label": "Thymosin beta-4 cell and tissue study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/10469335/",
        "type": "paper"
      }
    ]
  },
  "tesamorlin": {
    "name": "Tesamorlin",
    "aliases": [
      "Tesamorelin",
      "TES"
    ],
    "summary": "A research peptide modeled on a natural cell signal.",
    "what": "Tesamorlin is the partner’s name for a lab-made peptide modeled on growth hormone-releasing hormone, often shortened to GHRH.",
    "study": "Research examines how this peptide fits the GHRH receiver on a cell and how its changed structure affects that signal.",
    "how": "It attaches to the GHRH receiver, like a key fitting a lock. That can start a message inside the cell.",
    "limit": "The product name is kept exactly as the partner writes it. No hormonal result or personal-use benefit is promised.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/tesamorlin",
        "type": "product"
      }
    ]
  },
  "mots-c": {
    "name": "MOTS-C",
    "aliases": [
      "motsc"
    ],
    "summary": "A small peptide studied in cell fuel and stress signals.",
    "what": "MOTS-C is a 16-part peptide linked to mitochondria, the tiny structures that help cells release energy from fuel.",
    "study": "Researchers look at how cells handle fuel and respond to stress when this peptide is present.",
    "how": "Studies connect it with AMPK, a protein that acts like a fuel gauge in cells. The research follows changes in cell chemistry.",
    "limit": "A change in a cell’s fuel signals is not evidence that this product improves energy or exercise performance.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/mots-c",
        "type": "product"
      },
      {
        "label": "MOTS-c cell-metabolism study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/25738459/",
        "type": "paper"
      }
    ]
  },
  "nad-plus": {
    "name": "NAD+",
    "aliases": [
      "NAD",
      "nicotinamide adenine dinucleotide"
    ],
    "summary": "A helper molecule used in cell-energy reactions.",
    "what": "NAD+ is a small molecule found in cells. It helps enzymes, the tiny workers that carry out chemical reactions. It is not a peptide.",
    "study": "Scientists study how cells move energy through chemical reactions and how certain enzymes use NAD+.",
    "how": "NAD+ accepts electrons, tiny charged particles, and becomes NADH. This exchange helps link one cell reaction to another.",
    "limit": "Its role inside cells does not prove that a purchased product reaches cells or changes how they work.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/nad-plus",
        "type": "product"
      }
    ]
  },
  "cjc-ipa-no-dac": {
    "name": "CJC-1295 / Ipamorelin (No DAC)",
    "aliases": [
      "CJC IPA",
      "CJC1295 Ipamorelin"
    ],
    "summary": "A two-peptide blend for cell-receiver research.",
    "what": "This product combines CJC-1295 without DAC and Ipamorelin. DAC is an added chemical group used in a different form of CJC-1295.",
    "study": "Research on the separate compounds looks at two receivers on cells: the GHRH receiver and the ghrelin receiver.",
    "how": "The two compounds fit different receivers. Lab tests can measure each signal, but that does not prove how this blend acts.",
    "limit": "No DAC and with DAC are different forms. Research on either ingredient alone does not establish a result for the mixture.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/cjc-ipa-no-dac",
        "type": "product"
      }
    ]
  },
  "kpv": {
    "name": "KPV",
    "aliases": [],
    "summary": "A three-part peptide studied in cell alarm signals.",
    "what": "KPV is a very short peptide made from three amino acids: lysine, proline and valine.",
    "study": "Cell studies examine how it enters cells and changes the signals cells use during an inflammatory response, a type of alarm response.",
    "how": "A carrier called PepT1 can bring KPV into some cells. Researchers then measure activity in alarm-signal pathways inside them.",
    "limit": "Cell studies do not establish that this product treats inflammation or any health condition.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/kpv",
        "type": "product"
      },
      {
        "label": "KPV cell-uptake study",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2431115/",
        "type": "paper"
      }
    ]
  },
  "klow": {
    "name": "KLOW",
    "aliases": [],
    "summary": "Four named compounds in one research blend.",
    "what": "KLOW combines BPC-157, TB-500, GHK-Cu and KPV. Each is a separate compound within the same product.",
    "study": "Research on the ingredients covers cell movement, copper binding and cell alarm signals. Those are different research questions.",
    "how": "GHK-Cu binds copper. KPV is studied in cell signal tests. No single, proven mechanism describes the whole four-part blend.",
    "limit": "A study of one ingredient does not show that KLOW works the same way. Check all four ingredient amounts; do not guess the ratio.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/klow",
        "type": "product"
      }
    ]
  },
  "semax": {
    "name": "SEMAX",
    "aliases": [
      "Semax"
    ],
    "summary": "A short peptide studied in nerve-cell messages.",
    "what": "SEMAX is a lab-made chain of seven amino acids. Its design is based on a piece of another peptide called ACTH.",
    "study": "Researchers measure nerve-cell signals and gene activity. One focus is BDNF, a protein that helps nerve cells send growth signals.",
    "how": "Experiments track changes in BDNF and its cell receiver. They do not yet give a complete account of how every change occurs.",
    "limit": "These findings do not establish improved focus, memory or other personal-use benefits.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/semax",
        "type": "product"
      },
      {
        "label": "SEMAX nerve-signal study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/",
        "type": "paper"
      }
    ]
  },
  "glutathione": {
    "name": "Glutathione",
    "aliases": [
      "GSH"
    ],
    "summary": "A three-part molecule studied in chemical balance inside cells.",
    "what": "Glutathione is made from three amino acids. Cells make it and use it in many chemical reactions.",
    "study": "Researchers study how it reacts with oxygen-related chemicals and how cells keep these reactions in balance.",
    "how": "Part of the molecule can give up electrons in a reaction. Enzymes help cycle it between two forms so it can take part again.",
    "limit": "A known role inside cells is not proof of a detox, health or other benefit from this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/glutathione",
        "type": "product"
      }
    ]
  },
  "melanotan-ii": {
    "name": "Melanotan II",
    "aliases": [
      "Melanotan 2",
      "MTII"
    ],
    "summary": "A ring-shaped peptide studied at melanocortin cell receivers.",
    "what": "Melanotan II is a lab-made peptide shaped like a small ring. It is related to a natural signal called alpha-MSH.",
    "study": "Scientists use receptor tests to study how it attaches to members of the melanocortin family of cell receivers.",
    "how": "Its ring shape helps determine how it fits a receiver. After it binds, researchers can measure signals inside the test cells.",
    "limit": "Melanotan I is a different molecule. This product is not for tanning, cosmetic or other personal use.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/melanotan-ii",
        "type": "product"
      }
    ]
  },
  "glow": {
    "name": "GLOW",
    "aliases": [
      "GLOW blend"
    ],
    "summary": "A research blend of BPC-157, TB-500 and GHK-Cu.",
    "what": "GLOW contains three compounds: BPC-157, TB-500 and GHK-Cu. It is not the four-compound KLOW blend.",
    "study": "Studies of the separate ingredients explore cell movement and the material that surrounds cells.",
    "how": "GHK-Cu binds copper, while related peptide studies track cell signals and cell structure. These do not establish one mechanism for GLOW.",
    "limit": "The mix has its own composition. Separate-ingredient studies are not proof of a combined effect or a cosmetic benefit.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/glow",
        "type": "product"
      }
    ]
  },
  "selank": {
    "name": "SELANK",
    "aliases": [
      "Selank"
    ],
    "summary": "A seven-part peptide studied in nerve-cell signal pathways.",
    "what": "SELANK is a lab-made peptide based on tuftsin, another short peptide. It has seven amino-acid building blocks.",
    "study": "Researchers examine gene activity linked to nerve messages, including GABA. GABA is a chemical message used by nerve cells.",
    "how": "Studies measure changes in signal-related genes and proteins. This does not establish that SELANK directly switches on a GABA receiver.",
    "limit": "Its full mechanism is still being studied. No effect on mood, anxiety or thinking is promised.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/selank",
        "type": "product"
      }
    ]
  },
  "melanotan-i": {
    "name": "Melanotan I",
    "aliases": [
      "Melanotan 1",
      "MTI"
    ],
    "summary": "A linear peptide used in melanocortin-receiver research.",
    "what": "Melanotan I is a lab-made chain related to alpha-MSH, a natural cell signal. It is different from ring-shaped Melanotan II.",
    "study": "Researchers study the MC1 receptor, a cell receiver involved in pigment-related signals. Pigment is material that gives cells color.",
    "how": "The peptide binds the receiver and starts a signal inside a test cell. Its structure affects how strongly it binds.",
    "limit": "A cell pigment signal is not a promise of tanning or a cosmetic result. Not for application to people or animals.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/melanotan-i",
        "type": "product"
      }
    ]
  },
  "igf-1-lr3": {
    "name": "IGF-1 LR3",
    "aliases": [
      "IGF1 LR3"
    ],
    "summary": "A changed form of IGF-1 for cell-signaling studies.",
    "what": "IGF-1 LR3 is a lab-made version of IGF-1, a protein signal. It has an added section and a changed building block.",
    "study": "Researchers study its cell receiver and compare how it attaches to proteins that normally hold IGF-1.",
    "how": "The changed structure alters binding to those holding proteins. It can also activate the IGF-1 receiver in cell tests.",
    "limit": "LR3 is not the same molecule as unmodified IGF-1. This description does not promise muscle growth or any other benefit.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/igf-1-lr3",
        "type": "product"
      }
    ]
  },
  "5-amino-1mq": {
    "name": "5-Amino-1MQ",
    "aliases": [
      "1MQ",
      "5 amino 1 mq"
    ],
    "summary": "A small molecule studied as an enzyme blocker.",
    "what": "5-Amino-1MQ is a small chemical compound, not a peptide. Its target is an enzyme called NNMT.",
    "study": "Scientists study how blocking NNMT changes the way cells handle a form of vitamin B3 and related chemicals.",
    "how": "NNMT normally moves a small chemical group onto another molecule. In lab tests, 5-Amino-1MQ blocks that enzyme’s work.",
    "limit": "Enzyme blocking in lab tests does not establish weight, fitness or health benefits for this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/5-amino-1mq",
        "type": "product"
      }
    ]
  },
  "wolverine-stack": {
    "name": "BPC-157/TB-500 (Wolverine)",
    "aliases": [
      "Wolverine",
      "BPC TB blend"
    ],
    "summary": "BPC-157 and TB-500 together in one research blend.",
    "what": "This product combines BPC-157 and TB-500. Wolverine is the partner’s name for this two-compound blend.",
    "study": "Research on the separate compounds looks at cell movement, cell attachment and tissue models.",
    "how": "The research follows different cell signals and structural proteins. It does not establish a single mechanism for this mixture.",
    "limit": "Two ingredients do not mean twice the effect. The blend and the spray version need their own product documentation.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/wolverine-stack",
        "type": "product"
      }
    ]
  },
  "pt-141": {
    "name": "PT-141",
    "aliases": [
      "Bremelanotide",
      "pt141"
    ],
    "summary": "A ring-shaped peptide for melanocortin signal studies.",
    "what": "PT-141 is a lab-made, ring-shaped peptide related to alpha-MSH, a natural cell signal.",
    "study": "Researchers study melanocortin receivers, including MC3R and MC4R. These are proteins that receive messages at cells.",
    "how": "PT-141 attaches to these receivers. Cell tests measure the signals that follow to learn how the molecule and receiver interact.",
    "limit": "This research product, and its spray version, are not approved medicines or suitable for personal use.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/pt-141",
        "type": "product"
      }
    ]
  },
  "cagrilintide": {
    "name": "Cagrilintide",
    "aliases": [
      "CAG"
    ],
    "summary": "A research peptide modeled on the signal amylin.",
    "what": "Cagrilintide is a changed form of amylin, a natural peptide signal. It has 37 amino-acid building blocks.",
    "study": "Researchers compare how it binds to amylin and calcitonin receivers. These are related cell-signal targets.",
    "how": "It fits the receivers and starts a message inside a test cell. Its changed structure helps scientists study binding and signal strength.",
    "limit": "Receptor activity does not establish a health or weight-related benefit from this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/cagrilintide",
        "type": "product"
      }
    ]
  },
  "aod-9604": {
    "name": "AOD-9604",
    "aliases": [
      "AOD"
    ],
    "summary": "A short peptide based on part of a larger protein.",
    "what": "AOD-9604 is a lab-made peptide modeled on a small end section of growth hormone. It is not the whole hormone.",
    "study": "Researchers compare this short fragment with the full protein and study related chemical activity in cells.",
    "how": "A small fragment can have a different shape and behavior from a whole protein. Its exact cell targets are not fully established.",
    "limit": "The name does not show that it acts like growth hormone. No hormonal, weight or body-composition result is promised.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/aod-9604",
        "type": "product"
      }
    ]
  },
  "dsip": {
    "name": "DSIP",
    "aliases": [],
    "summary": "A nine-part peptide studied in brain-wave research.",
    "what": "DSIP is a short peptide with nine amino-acid building blocks.",
    "study": "Research examines brain-wave patterns and timing signals in experimental models. Scientists record these patterns to compare conditions.",
    "how": "Its full mechanism is not clear. There is no well-established single receiver that explains all of the reported findings.",
    "limit": "The name and early research are not proof of a sleep benefit. This is not a personal-use sleep product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/dsip",
        "type": "product"
      }
    ]
  },
  "epithalon": {
    "name": "Epithalon",
    "aliases": [
      "Epitalon",
      "EPI"
    ],
    "summary": "A four-part peptide studied in cell and DNA research.",
    "what": "Epithalon is a lab-made chain of four amino acids. It is a short peptide, not a whole protein.",
    "study": "Some cell studies examine telomerase. This is an enzyme that adds material to the protective ends of chromosomes, which hold DNA.",
    "how": "Researchers measure enzyme activity and gene signals in cells. The exact steps linking the peptide to those changes are not settled.",
    "limit": "A result in a cell test does not show that this product changes aging or extends life.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/epithalon",
        "type": "product"
      }
    ]
  },
  "ipamorelin": {
    "name": "Ipamorelin",
    "aliases": [
      "IPA"
    ],
    "summary": "A five-part peptide studied at the ghrelin cell receiver.",
    "what": "Ipamorelin is a lab-made peptide with five amino-acid building blocks.",
    "study": "Research focuses on GHSR, also called the ghrelin receiver. A cell uses this protein to receive certain chemical messages.",
    "how": "The peptide binds that receiver and starts signals in test cells. Researchers compare the response with other molecules that fit it.",
    "limit": "This is the single compound, not the CJC-1295 / Ipamorelin (No DAC) blend. No hormonal or personal-use outcome is promised.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ipamorelin",
        "type": "product"
      }
    ]
  },
  "snap-8": {
    "name": "SNAP-8",
    "aliases": [
      "Acetyl octapeptide 3"
    ],
    "summary": "An eight-part peptide modeled on a cell-message protein.",
    "what": "SNAP-8 is a lab-made peptide with eight amino acids. Its design copies a small part of the protein SNAP-25.",
    "study": "Researchers examine how cells release chemical messages from tiny packets. SNAP-25 is one of the proteins involved.",
    "how": "The peptide is designed to interfere with how those proteins join together. Evidence about that design is not proof for every finished product.",
    "limit": "Studies of the related six-part peptide do not prove the same result for SNAP-8. This product is not for cosmetic use.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/snap-8",
        "type": "product"
      }
    ]
  },
  "thymosin-alpha-1": {
    "name": "Thymosin Alpha-1",
    "aliases": [
      "Thymalfasin",
      "TA1"
    ],
    "summary": "A 28-part peptide studied in immune-cell signals.",
    "what": "Thymosin Alpha-1 is a lab-made version of a peptide with 28 amino acids.",
    "study": "Researchers study how immune cells send messages and respond to signals in controlled cell and tissue models.",
    "how": "Experiments follow pathways linked to Toll-like receptors. These receivers help cells detect certain danger signals.",
    "limit": "A measured immune-cell response is not a promise of stronger immunity or disease protection.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/thymosin-alpha-1",
        "type": "product"
      }
    ]
  },
  "ll-37": {
    "name": "LL-37",
    "aliases": [],
    "summary": "A charged peptide studied with membranes and cell signals.",
    "what": "LL-37 is a peptide with 37 amino acids. It belongs to a group called host-defense peptides.",
    "study": "Researchers study how it interacts with microbial membranes, the thin outer layers around microbes, and with cell signals.",
    "how": "Its positive charge can draw it toward negatively charged membranes. This can change a membrane’s structure in lab tests.",
    "limit": "Effects depend on the test conditions. This product is not an antibiotic or a treatment for infection.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ll-37",
        "type": "product"
      }
    ]
  },
  "cartalax": {
    "name": "Cartalax",
    "aliases": [
      "AED"
    ],
    "summary": "A three-part peptide studied in connective-tissue cell models.",
    "what": "Cartalax is a lab-made peptide of three amino acids. Their sequence is often shortened to AED.",
    "study": "Early research examines cell activity in connective tissue, the material that supports and holds tissues together.",
    "how": "Scientists measure changes in cell growth and gene activity. A confirmed single cell target has not been established here.",
    "limit": "The available research is limited. A short peptide sequence does not prove cartilage repair or a joint benefit.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/cartalax",
        "type": "product"
      }
    ]
  },
  "sermorelin": {
    "name": "Sermorelin",
    "aliases": [
      "SERM"
    ],
    "summary": "A short piece of a natural signal, made for research.",
    "what": "Sermorelin is a 29-part peptide based on the active end of growth hormone-releasing hormone, or GHRH.",
    "study": "Scientists study how this short piece attaches to the GHRH receiver and compare it with the full signal.",
    "how": "The peptide binds the receiver and starts a message inside the cell. The receiver is a protein, not a whole organ or treatment.",
    "limit": "Sermorelin and Tesamorlin are separate products. Similar names do not make them interchangeable.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/sermorelin",
        "type": "product"
      }
    ]
  },
  "kisspeptin": {
    "name": "Kisspeptin",
    "aliases": [
      "Kisspeptin-10",
      "KP10"
    ],
    "summary": "A short peptide studied at the KISS1R cell receiver.",
    "what": "This product is the 10-part form of kisspeptin, a peptide signal. The partner names it Kisspeptin.",
    "study": "Researchers study KISS1R, a receiver on some nerve cells. They measure the signals that follow when kisspeptin binds.",
    "how": "This short piece can fit the receiver and activate a message inside the cell. Longer forms of kisspeptin also exist.",
    "limit": "The exact form matters. No fertility, hormonal or personal-use benefit is claimed.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/kisspeptin",
        "type": "product"
      }
    ]
  },
  "dihexa": {
    "name": "Dihexa",
    "aliases": [
      "PNB-0408"
    ],
    "summary": "A small research compound linked to HGF cell signals.",
    "what": "Dihexa is a small lab-made compound modeled on part of a peptide called angiotensin IV.",
    "study": "Early research looks at HGF, a protein message, and c-Met, its receiver. These signals are studied in cell growth and cell connections.",
    "how": "Reports describe an interaction with HGF that changes signals through c-Met. This remains research, not a verified effect of the retail product.",
    "limit": "The evidence is early. It does not establish improved memory or any other personal-use benefit.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/dihexa",
        "type": "product"
      }
    ]
  },
  "vip": {
    "name": "VIP",
    "aliases": [
      "Vasoactive intestinal peptide"
    ],
    "summary": "A 28-part peptide used to study two cell-signal receivers.",
    "what": "VIP is a peptide made from 28 amino acids. It acts as a chemical message between cells.",
    "study": "Researchers study two receivers called VPAC1 and VPAC2 and the signals they pass into cells.",
    "how": "When VIP binds, test cells can make more cAMP, a small messenger molecule. Scientists use that signal to track receiver activity.",
    "limit": "A cell-signal result is not proof of safety or a health benefit from this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/vip",
        "type": "product"
      }
    ]
  },
  "ara-290": {
    "name": "ARA-290",
    "aliases": [
      "Cibinetide"
    ],
    "summary": "A short peptide modeled on one surface of EPO.",
    "what": "ARA-290 is an 11-part peptide modeled on a small surface of erythropoietin, often shortened to EPO.",
    "study": "Researchers study how cells respond to stress and compare this fragment with the much larger EPO protein.",
    "how": "The research examines a proposed two-part cell receiver involved in stress responses. It is not the same as using the whole EPO protein.",
    "limit": "The receiver model does not establish nerve repair, pain relief or any other result from this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ara-290",
        "type": "product"
      }
    ]
  },
  "pinealon": {
    "name": "Pinealon",
    "aliases": [
      "EDR"
    ],
    "summary": "A three-part peptide used in early nerve-cell research.",
    "what": "Pinealon is a lab-made peptide of three amino acids. Their sequence is often shortened to EDR.",
    "study": "Early studies examine nerve-cell activity, gene signals and responses to chemical stress in lab models.",
    "how": "Researchers track what changes in the cells. The exact target and the full path from peptide to response remain uncertain.",
    "limit": "Early cell findings are not proof of a memory, focus or other personal-use benefit.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/pinealon",
        "type": "product"
      }
    ]
  },
  "ahk-cu": {
    "name": "AHK-Cu",
    "aliases": [
      "ahkcu"
    ],
    "summary": "A three-part copper peptide, distinct from GHK-Cu.",
    "what": "AHK-Cu joins three amino acids to copper. Its first building block differs from GHK-Cu, so they are not the same molecule.",
    "study": "Researchers study cultured tissue cells, including cells found at the base of hair follicles. They measure cell division and cell signals.",
    "how": "The peptide holds a copper ion. Experiments examine how the complex affects cell activity; not every step is understood.",
    "limit": "A result in cultured cells does not prove hair growth or a cosmetic benefit from this product.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ahk-cu",
        "type": "product"
      }
    ]
  },
  "ghkcu-spray": {
    "name": "GHK-Cu SPRAY",
    "aliases": [],
    "summary": "A prepared copper-peptide solution for lab research.",
    "what": "GHK-Cu SPRAY is a prepared liquid containing GHK-Cu. It is a different product from the non-spray form.",
    "study": "Researchers study copper binding and how cells make or break down the material around them, including collagen. These studies concern the compound, not proof for this finished solution.",
    "how": "The small chain holds a copper ion. Studies measure changes in cell signals and collagen, a protein that forms strong fibers.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/ghkcu-spray",
        "type": "product"
      },
      {
        "label": "Copper-peptide tissue study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/8227353/",
        "type": "paper"
      }
    ]
  },
  "nad-plus-spray": {
    "name": "NAD+ SPRAY",
    "aliases": [],
    "summary": "NAD+ in a prepared research solution, not a peptide.",
    "what": "NAD+ SPRAY is a prepared liquid containing NAD+. It is a different product from the non-spray form.",
    "study": "Scientists study how cells move energy through chemical reactions and how certain enzymes use NAD+. These studies concern the compound, not proof for this finished solution.",
    "how": "NAD+ accepts electrons, tiny charged particles, and becomes NADH. This exchange helps link one cell reaction to another.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/nad-plus-spray",
        "type": "product"
      }
    ]
  },
  "semax-spray": {
    "name": "SEMAX SPRAY",
    "aliases": [],
    "summary": "The solution form of a peptide studied in nerve-cell signals.",
    "what": "SEMAX SPRAY is a prepared liquid containing SEMAX. It is a different product from the non-spray form.",
    "study": "Researchers measure nerve-cell signals and gene activity. One focus is BDNF, a protein that helps nerve cells send growth signals. These studies concern the compound, not proof for this finished solution.",
    "how": "Experiments track changes in BDNF and its cell receiver. They do not yet give a complete account of how every change occurs.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/semax-spray",
        "type": "product"
      },
      {
        "label": "SEMAX nerve-signal study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/16996037/",
        "type": "paper"
      }
    ]
  },
  "selank-spray": {
    "name": "SELANK SPRAY",
    "aliases": [],
    "summary": "A prepared solution of the seven-part SELANK peptide.",
    "what": "SELANK SPRAY is a prepared liquid containing SELANK. It is a different product from the non-spray form.",
    "study": "Researchers examine gene activity linked to nerve messages, including GABA. GABA is a chemical message used by nerve cells. These studies concern the compound, not proof for this finished solution.",
    "how": "Studies measure changes in signal-related genes and proteins. This does not establish that SELANK directly switches on a GABA receiver.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/selank-spray",
        "type": "product"
      }
    ]
  },
  "pt-141-spray": {
    "name": "PT-141 SPRAY",
    "aliases": [],
    "summary": "A prepared solution for melanocortin-receiver research.",
    "what": "PT-141 SPRAY is a prepared liquid containing PT-141. It is a different product from the non-spray form.",
    "study": "Researchers study melanocortin receivers, including MC3R and MC4R. These are proteins that receive messages at cells. These studies concern the compound, not proof for this finished solution.",
    "how": "PT-141 attaches to these receivers. Cell tests measure the signals that follow to learn how the molecule and receiver interact.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/pt-141-spray",
        "type": "product"
      }
    ]
  },
  "melanotan-ii-spray": {
    "name": "Melanotan II Spray",
    "aliases": [],
    "summary": "The solution form of the ring-shaped Melanotan II peptide.",
    "what": "Melanotan II Spray is a prepared liquid containing Melanotan II. It is a different product from the non-spray form.",
    "study": "Scientists use receptor tests to study how it attaches to members of the melanocortin family of cell receivers. These studies concern the compound, not proof for this finished solution.",
    "how": "Its ring shape helps determine how it fits a receiver. After it binds, researchers can measure signals inside the test cells.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/melanotan-ii-spray",
        "type": "product"
      }
    ]
  },
  "dsip-spray": {
    "name": "DSIP Spray",
    "aliases": [],
    "summary": "The solution form of the nine-part DSIP peptide.",
    "what": "DSIP Spray is a prepared liquid containing DSIP. It is a different product from the non-spray form.",
    "study": "Research examines brain-wave patterns and timing signals in experimental models. Scientists record these patterns to compare conditions. These studies concern the compound, not proof for this finished solution.",
    "how": "Its full mechanism is not clear. There is no well-established single receiver that explains all of the reported findings.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/dsip-spray",
        "type": "product"
      }
    ]
  },
  "bpc-tb-spray": {
    "name": "BPC-157/TB-500 Spray (Wolverine)",
    "aliases": [],
    "summary": "Two research compounds together in a prepared solution.",
    "what": "BPC-157/TB-500 Spray (Wolverine) is a prepared liquid containing BPC-157 and TB-500. It is a different product from the non-spray form.",
    "study": "Research on the separate compounds looks at cell movement, cell attachment and tissue models. These studies concern the compounds, not proof for this finished solution.",
    "how": "The research follows different cell signals and structural proteins. It does not establish a single mechanism for this mixture.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/bpc-tb-spray",
        "type": "product"
      }
    ]
  },
  "bpc-spray": {
    "name": "BPC-157 Spray",
    "aliases": [],
    "summary": "BPC-157 supplied as a prepared research solution.",
    "what": "BPC-157 Spray is a prepared liquid containing BPC-157. It is a different product from the non-spray form.",
    "study": "Lab studies look at how cells move, attach to surfaces and respond when tissue is damaged. These studies concern the compound, not proof for this finished solution.",
    "how": "Some studies track signals linked to cell attachment and blood-vessel formation. The full chain of events is not settled.",
    "limit": "The spray name describes the product format, not a route of use. Check this solution’s own concentration and full label.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/bpc-spray",
        "type": "product"
      },
      {
        "label": "BPC-157 experimental ligament study",
        "url": "https://pubmed.ncbi.nlm.nih.gov/20225319/",
        "type": "paper"
      }
    ]
  },
  "adalank-spray": {
    "name": "Adalank Spray",
    "aliases": [
      "N acetyl Selank amidate"
    ],
    "summary": "A changed form of SELANK with limited direct research.",
    "what": "The partner describes Adalank Spray as a liquid form of N-acetyl Selank amidate. This means the ends of the SELANK chain have been changed.",
    "study": "The partner cites studies on the parent compound, SELANK, rather than direct studies of Adalank itself.",
    "how": "Changing a peptide’s ends can change its behavior. We cannot assume it acts like SELANK or state a proven mechanism for this product.",
    "limit": "Parent-compound findings are not Adalank results. No stronger, longer-lasting or personal-use effect is established.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/adalank-spray",
        "type": "product"
      }
    ]
  },
  "adamax-spray": {
    "name": "Adamax Spray",
    "aliases": [
      "Ac MEHFPGPAG"
    ],
    "summary": "A changed form of SEMAX without established product effects.",
    "what": "The partner describes Adamax Spray as a liquid containing a modified SEMAX-like peptide. Its chain differs from SEMAX.",
    "study": "The partner points to parent-compound SEMAX research. It states that Adamax has no dedicated peer-reviewed studies of its own.",
    "how": "A changed chain can behave differently at a cell. SEMAX studies therefore do not establish how Adamax works.",
    "limit": "There is no basis here to promise a stronger or longer-lasting result. The spray is not for human or animal use.",
    "sources": [
      {
        "label": "Partner product information",
        "url": "https://www.aminoclub.com/us/products/adamax-spray",
        "type": "product"
      }
    ]
  }
};
