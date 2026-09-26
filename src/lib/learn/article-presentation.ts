export type ArticlePresentation = {title:string;description:string;cta:string;href:string;related:string[]};
export const ARTICLE_GUIDES: Record<string,ArticlePresentation> = {
  "what-is-bac-water": {
    "title": "What Is BAC Water? Ingredients & Purpose",
    "description": "Understand bacteriostatic water, its preservative and label limits. Compare water products and find storage guidance.",
    "cta": "Compare water products",
    "href": "/learn/vs/sterile-water",
    "related": [
      "/learn/vs/benzyl-alcohol",
      "/learn/bac-water-shelf-life",
      "/learn/bac-water-for-peptides"
    ]
  },
  "how-peptide-reconstitution-works": {
    "title": "Peptide Concentration: How the Math Works",
    "description": "Separate mass, final volume and concentration. Follow a worked equation using known label values without choosing a preparation.",
    "cta": "Calculate concentration",
    "href": "/tools/bac-water",
    "related": [
      "/learn/how-to-read-a-peptide-vial",
      "/learn/peptide-reconstitution-chart",
      "/methodology"
    ]
  },
  "how-to-read-a-peptide-vial": {
    "title": "How to Read Vial Labels: Mass, Volume & Concentration",
    "description": "Learn the difference between total mass, concentration and final volume with a fictitious label example and a notation checklist.",
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
    "description": "Understand what device instructions must establish before interpreting scale markings. This guide explains units, not administration.",
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
    "description": "Convert U-100 markings to volume, then use a known concentration to connect volume with mass. Product IU are a separate unit.",
    "cta": "Convert U-100 units and mL",
    "href": "/tools/syringe-units",
    "related": [
      "/learn/how-to-read-an-insulin-syringe",
      "/tools/dose",
      "/learn/glossary"
    ]
  },
  "how-to-store-reconstituted-peptides": {
    "title": "Peptide Storage: Read the Exact Product Instructions",
    "description": "Record product-specific storage temperature, light protection, opening limits and discard instructions. Math cannot set a shelf life.",
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
    "description": "Check common input mistakes, including mg versus mcg, total mass versus concentration and stale values from another product.",
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
    "description": "Review known input requirements and evidence limits for BPC-157. This is a calculation reference, not a preparation recipe.",
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
    "description": "Distinguish exact formulation instructions from concentration math. Check mass, volume and unit inputs without assuming a preparation.",
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
    "description": "Learn why concentration and formulation must come from the exact product. Understand U-100 volume markings and mass without dose advice.",
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
    "description": "Count intervals between labeled numbers without assuming tick size. Use a readable number-line example and check actual device instructions.",
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
    "description": "Separate syringe capacity from graduation spacing. Compare volume labels and understand why device markings must be checked independently.",
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
    "description": "See how a larger final volume changes concentration while idealized total mass stays constant. Product compatibility is a separate question.",
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
    "description": "Read and print a concentration chart with transparent mass and final-volume examples. The chart does not select product mixing instructions.",
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
