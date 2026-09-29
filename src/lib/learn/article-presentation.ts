export type ArticleFaq = { q: string; a: string };
/** Code-defined presentation for a database article: search copy, next step, related reading and, where search demand shows repeated questions, a FAQ block rendered with FAQPage schema. */
export type ArticlePresentation = {title:string;description:string;cta:string;href:string;related:string[];faqs?:ArticleFaq[]};
export const ARTICLE_GUIDES: Record<string,ArticlePresentation> = {
  "what-is-bac-water": {
    "title": "What Is BAC Water? Ingredients & Purpose",
    "description": "Learn what BAC water contains, what its preservative does and why each product needs its own label and storage instructions.",
    "cta": "Compare water products",
    "href": "/learn/vs/sterile-water",
    "related": [
      "/learn/vs/benzyl-alcohol",
      "/learn/bac-water-shelf-life",
      "/learn/bac-water-for-peptides",
      "/learn/where-to-buy-bacteriostatic-water"
    ],
    "faqs": [
      { "q": "What does BAC water stand for?", "a": "BAC water is short for bacteriostatic water. The referenced water product has benzyl alcohol added to slow bacterial growth. Its label describes a container intended for more than one entry under set rules. BAC is a short name, not a brand." },
      { "q": "What is BAC water used for?", "a": "Pfizer’s label describes using this water to dissolve or dilute drugs only as their instructions direct. Dilute means spread the same amount of material through more liquid. The label does not list it as a fluid replacement and says it must not be used in newborns." },
      { "q": "What is BAC water made of?", "a": "Water for injection plus benzyl alcohol as the preservative. Pfizer's labeling describes products with 0.9% or 1.1% benzyl alcohol, so the exact container states the concentration. It contains no sodium chloride and no other active ingredient." },
      { "q": "Is BAC water the same as sterile water or saline?", "a": "No. Sterile water for injection lists no preservative, and saline is a sodium chloride solution. Similar names do not mean the products can replace one another. The exact drug instructions must name the liquid to use." }
    ]
  },
  "how-peptide-reconstitution-works": {
    "title": "Peptide Concentration: How the Math Works",
    "description": "See how total mg and final mL give the amount in each mL. Follow simple math examples without choosing a mixing method.",
    "cta": "Calculate concentration",
    "href": "/tools/bac-water",
    "related": [
      "/learn/how-to-read-a-peptide-vial",
      "/learn/peptide-reconstitution-chart",
      "/methodology"
    ]
  },
  "how-to-read-a-peptide-vial": {
    "title": "How to Read a Vial Label: Mass vs Concentration",
    "description": "Tell total mg apart from mg in each mL. Use simple label examples to check each number and its unit.",
    "cta": "Check concentration",
    "href": "/tools/bac-water",
    "related": [
      "/learn/glossary",
      "/learn/how-peptide-reconstitution-works",
      "/learn/what-you-cannot-know"
    ]
  },
  "how-to-use-an-insulin-syringe": {
    "title": "Syringe Scale Basics & Calculation Limits",
    "description": "Learn which scale details a calculator needs. Check the actual device instructions. This page does not teach injection use.",
    "cta": "Read scale intervals",
    "href": "/learn/how-to-read-an-insulin-syringe",
    "related": [
      "/learn/insulin-syringe-sizes",
      "/learn/what-syringe-units-mean",
      "/tools/syringe-units"
    ]
  },
  "what-syringe-units-mean": {
    "title": "U-100 Units, mL & Mass: What Each Means",
    "description": "See how U-100 marks show liquid volume and why mg needs another number. Learn why product IU is a different unit.",
    "cta": "Convert U-100 units and mL",
    "href": "/tools/syringe-units",
    "related": [
      "/learn/how-to-read-an-insulin-syringe",
      "/tools/dose",
      "/learn/glossary"
    ]
  },
  "how-to-store-reconstituted-peptides": {
    "title": "Storing Reconstituted Peptides: Follow the Label",
    "description": "Find the temperature, light and date instructions for an exact product. Learn why a calculation cannot set a storage time.",
    "cta": "Make a record label",
    "href": "/tools/vial-labels",
    "related": [
      "/learn/bac-water-shelf-life",
      "/learn/what-you-cannot-know",
      "/learn/how-to-read-a-peptide-vial"
    ]
  },
  "common-mistakes-to-avoid": {
    "title": "Calculator Mistakes: Units, Labels & Saved Results",
    "description": "Catch common mistakes with mg, mcg, mL, blend amounts and old saved values before relying on a calculation.",
    "cta": "Choose a calculation tool",
    "href": "/tools",
    "related": [
      "/tools/mg-to-mcg",
      "/learn/how-to-read-a-peptide-vial",
      "/learn/what-syringe-units-mean"
    ]
  },
  "how-to-reconstitute-bpc-157": {
    "title": "BPC-157: Calculation Inputs & Evidence Limits",
    "description": "Learn which label numbers the BPC-157 calculator needs and what the research cannot prove. This is not a mixing recipe.",
    "cta": "Open BPC-157 calculator",
    "href": "/calculate/product/bpc-157",
    "related": [
      "/peptides/bpc-157",
      "/learn/how-to-read-a-peptide-vial",
      "/learn/what-you-cannot-know"
    ]
  },
  "how-to-reconstitute-tirzepatide": {
    "title": "Tirzepatide Calculation Inputs & Units",
    "description": "Check the exact product, total amount, final liquid and units. A tirzepatide name alone is not a mixing instruction.",
    "cta": "Check an amount and concentration",
    "href": "/tools/dose",
    "related": [
      "/learn/what-syringe-units-mean",
      "/learn/how-to-read-a-peptide-vial",
      "/peptides/tirzepatide"
    ]
  },
  "how-to-reconstitute-semaglutide": {
    "title": "Semaglutide: Concentration, Formulation & Units",
    "description": "Learn why the amount in each mL must come from the exact product. U-100 marks show liquid, not a fixed amount in mg.",
    "cta": "Check an amount and concentration",
    "href": "/tools/dose",
    "related": [
      "/learn/what-syringe-units-mean",
      "/learn/how-to-read-a-peptide-vial",
      "/peptides/semaglutide"
    ]
  },
  "how-to-read-an-insulin-syringe": {
    "title": "Read Syringe Scale Intervals & U-100 Units",
    "description": "Count the gaps between scale numbers with a simple example. Check the actual device before applying a U-100 conversion.",
    "cta": "Convert U-100 units and mL",
    "href": "/tools/syringe-units",
    "related": [
      "/learn/insulin-syringe-sizes",
      "/learn/what-syringe-units-mean",
      "/learn/how-to-use-an-insulin-syringe"
    ]
  },
  "insulin-syringe-sizes": {
    "title": "Syringe Capacity, U-100 Scale & Tick Spacing",
    "description": "Compare how much a syringe holds with the gaps between its marks. Size alone does not tell you the value of each mark.",
    "cta": "Read scale intervals",
    "href": "/learn/how-to-read-an-insulin-syringe",
    "related": [
      "/tools/syringe-units",
      "/learn/what-syringe-units-mean",
      "/learn/how-to-use-an-insulin-syringe"
    ]
  },
  "too-much-bac-water": {
    "title": "More BAC Water: What Dilution Math Tells You",
    "description": "See how more liquid changes the amount in each mL while total mg stays the same. The math cannot check a mixing mistake.",
    "cta": "Compare concentration values",
    "href": "/tools/bac-water",
    "related": [
      "/learn/how-peptide-reconstitution-works",
      "/learn/what-you-cannot-know",
      "/methodology"
    ]
  },
  "peptide-reconstitution-chart": {
    "title": "Peptide Concentration Chart: Worked Arithmetic",
    "description": "Follow a chart of made-up mg and mL examples. See the division clearly. The chart does not choose mixing amounts or doses.",
    "cta": "Check a calculation",
    "href": "/tools/bac-water",
    "related": [
      "/learn/how-to-read-a-peptide-vial",
      "/learn/what-syringe-units-mean",
      "/methodology"
    ]
  }
};
/** Move only exact, known correction sentences; preserve all other published copy. */
const CORRECTIONS = [
 "The site's previous table of generic peptide-specific day counts has been removed for that reason.",
 "The earlier step-by-step preparation recipe and unsourced research-dose recommendation are no longer provided here.",
 "The site previously described each barrel size as having a fixed graduation and recommended a default size. Those claims have been removed.",
 "This corrects the earlier statement that a more dilute vial would automatically be used up twice as fast.",
 "This site's earlier compound-specific recipe chart has been replaced with transparent arithmetic.",
];
export function presentArticle(body: string) {
 const corrections = CORRECTIONS.filter(sentence => body.includes(sentence));
 const text = corrections.reduce((value, sentence) => value.replace(sentence, ""), body).replace(/ +\n/g, "\n").trim();
 const split = text.indexOf("\n\n");
 return { opening: split < 0 ? text : text.slice(0,split), body: split < 0 ? "" : text.slice(split+2), corrections };
}
