import { PEPTIDES } from "@/lib/calc/peptides";
import { shortName } from "@/lib/peptides/page-data";
import { COMPARISONS } from "@/lib/comparisons/content";
import { learnLanding } from "@/lib/learn/landing";
import { CONTENT_TYPES, TOPICS } from "@/lib/learn/taxonomy";

export const BRAND_ICON = "/icon";
export const BRAND_IMAGE_ALT = "BACwater.ai droplet logo beside a BAC water concentration calculator worksheet";
type Snippet = { title: string; description: string };

/** Editorial copy, not inferred keyword volume or a promise of search placement. */
export const SEARCH_SNIPPETS: Record<string, Snippet> = {
  "/": { title: "BAC Water Calculator | Peptide Reconstitution | BACwater.ai", description: "Free BAC water and peptide reconstitution calculator. Check concentration, mL and U-100 units from your own numbers. Live results, no signup." },
  "/peptide-calculator": { title: "Peptide Reconstitution Calculator", description: "Calculate peptide concentration, mL and U-100 units from your label values. See the math, save a calculation or print a vial label. No dose advice." },
  "/tools": { title: "Free BAC Water and Peptide Calculators", description: "Choose a free calculator for concentration, mg to mcg, U-100 units, volume or vial counts. Check formulas and make printable labels from saved calculations." },
  "/tools/bac-water": { title: "BAC Water Volume and Concentration Calculator", description: "Check how final liquid volume changes concentration. Enter your vial amount and volume to see the math. Product instructions determine the diluent." },
  "/tools/mg-to-mcg": { title: "mg to mcg Converter: Milligrams to Micrograms", description: "Convert mg to mcg or mcg to mg instantly. See the 1,000-to-1 conversion, worked examples and a clear explanation of mass units. Free, no signup." },
  "/tools/syringe-units": { title: "U-100 Syringe Units to mL Converter", description: "Convert U-100 syringe units to mL and back. See the formula and worked examples, including 100 units = 1 mL. Scale conversion, not dose advice." },
  "/tools/dose": { title: "mg and mcg to mL Calculator", description: "Convert an entered amount in mg or mcg to mL using a known concentration, or calculate mass from volume. See each formula. No dose is selected." },
  "/tools/reverse-bac": { title: "Reverse BAC Water Calculator: Final Volume", description: "Calculate final liquid volume from stated mass, an entered amount and a U-100 scale reading. Check the formula; this does not choose a mixing recipe." },
  "/tools/supplies": { title: "Vial Count Calculator", description: "Calculate how many vials cover a known number of measurements using your stated vial amount and amount per measurement. No schedule is recommended." },
  "/tools/vial-labels": { title: "Printable Peptide Vial Labels: Free PDF Tool", description: "Create a PDF of small vial labels from a saved calculation. Choose label dimensions, include concentration and entered dates, then print at actual size." },
  "/peptides": { title: "Peptide Calculators and Compound References", description: "Find a peptide reconstitution calculator by compound. Check concentration examples, label units, original references and what the calculation cannot verify." },
  "/recommendations": { title: "Research Peptides and BAC Water Directory", description: "Search research compounds, blends and BAC water listings by name or format. Review product details and supplier links. Research only; affiliate disclosure." },
  "/faq": { title: "BAC Water FAQ: Ingredients, Storage and Math", description: "Get clear answers about BAC water ingredients, storage, final volume and syringe units, with links to product labeling and free calculation tools." },
  "/learn/glossary": { title: "BAC Water Glossary: mg, mcg, mL and U-100", description: "Look up BAC water, reconstitution, concentration, benzyl alcohol and syringe-scale terms. Understand label language without confusing mass and volume." },
  "/learn/bac-water-shelf-life": { title: "BAC Water Shelf Life and Storage Explained", description: "How long does BAC water last? Understand unopened expiry, opened-vial dating and mixed-product storage. Check the exact label, not a universal expiry rule." },
  "/learn/bac-water-for-peptides": { title: "BAC Water for Peptides: Compatibility and Math", description: "Does a peptide need BAC water? Learn why formulation and product instructions come before concentration math, and which label details you need to check." },
  "/learn/where-to-buy-bacteriostatic-water": { title: "Where to Buy BAC Water: Product and Seller Checks", description: "Know what to check before buying bacteriostatic water: product identity, label, supplier license and traceability. BACwater.ai does not sell or verify products." },
  "/compare-calculators": { title: "Compare Peptide Calculators: Features and Limits", description: "Compare peptide calculators by inputs, formulas, saved plans and verification limits. Includes BACwater.ai's own tools, with ownership clearly disclosed." },
  "/methodology": { title: "Calculator Formulas, Units and Rounding Limits", description: "Check the concentration, mass, volume and syringe-scale formulas behind BACwater.ai. Follow worked examples and understand rounding and verification limits." },
  "/plan": { title: "Peptide Reconstitution Plan Builder", description: "Enter your stated amount and final liquid volume. Check concentration and scale readings, save a calculation or print a PDF. No dose or diluent is selected." },
  "/peptides/compare": { title: "BPC-157 vs TB-500: Labels and Evidence", description: "Compare BPC-157 and TB-500 identity, label units, linked references and calculation limits. Select other compounds to compare. No dosing recommendation." },
  "/sitemap": { title: "Site Map: Calculators, Compounds and Guides", description: "Find BACwater.ai calculators, compound references, BAC water guides and site policies in one organized directory." },
  "/learn": learnLanding({}, 0),
  "/learn/what-you-cannot-know": { title: "Peptide Calculator Limits: What Math Cannot Verify", description: "Understand why a calculation cannot verify vial identity, sterility, compatibility or shelf life. Learn which questions require product-specific evidence." },
  "/about": { title: "About BACwater.ai: Free Calculation Tools", description: "Learn about BACwater.ai's free concentration calculators, unit converters, saved calculations and printable labels, including the limits of these tools." },
  "/contact": { title: "Contact BACwater.ai: Calculator and Account Help", description: "Report a calculator issue or ask about saved plans, account access, privacy or the website. Include the page and steps to reproduce the problem." },
  "/editorial-policy": { title: "Editorial Policy: Sources and Corrections", description: "How BACwater.ai handles calculation methods, original sources, corrections and review limitations, while separating arithmetic from medical advice." },
  "/preferred-source": { title: "Choose BACwater.ai as a Preferred Google Source", description: "Learn how to look for BACwater.ai in Google's source preferences, what the setting changes and how to remove a preference later. Availability varies." },
  "/terms": { title: "BACwater.ai Terms of Service", description: "Read the terms for using BACwater.ai, including educational calculations, accuracy limitations and site usage." },
  "/privacy": { title: "BACwater.ai Privacy and Data Use", description: "See how BACwater.ai handles accounts, saved calculation plans, support messages and optional analytics, including your privacy choices." },
  "/disclaimer": { title: "BACwater.ai Disclaimer and Calculation Limits", description: "Understand the educational and research limits of BACwater.ai. Calculations are not medical advice, and research products are not for human use." },
};

// Image rendering reuses existing facet copy. Actual index eligibility still
// depends on the live result count in /learn and is never changed here.
export const FACET_SNIPPETS: Record<string, Snippet> = Object.fromEntries([
  ...CONTENT_TYPES.map(t => learnLanding({ type: t.key }, 3)),
  ...TOPICS.map(t => learnLanding({ topic: t.key }, 3)),
  ...PEPTIDES.map(p => learnLanding({ peptide: p.slug }, 3, shortName(p.name))),
].filter(p => p.indexable).map(p => [p.canonical, { title: p.title, description: p.description }]));

/** A bounded catalog prevents arbitrary/private text from becoming public image URLs. */
export function searchSnippet(path: string): Snippet | undefined {
  if (Object.hasOwn(SEARCH_SNIPPETS, path)) return SEARCH_SNIPPETS[path];
  if (Object.hasOwn(FACET_SNIPPETS, path)) return FACET_SNIPPETS[path];
  const peptide = PEPTIDES.find(p => path === `/peptides/${p.slug}`);
  if (peptide) {
    const name = shortName(peptide.name);
    return {
      title: peptide.slug === "custom" ? "Custom Peptide Reconstitution Calculator" : `${name} Reconstitution Calculator`,
      description: peptide.slug === "hcg"
        ? "Calculate hCG IU per mL and measurement volume from your label values. Product IU are not mg or U-100 syringe units. No dose or dilution is selected."
        : `Calculate ${peptide.slug === "custom" ? "peptide" : name} concentration, mL and U-100 units from your own values. Review formulas and calculation limits. No dose or diluent is selected.`,
    };
  }
  const comparison = COMPARISONS.find(c => path === `/learn/vs/${c.slug}`);
  if (comparison) return { title: comparison.metaTitle, description: comparison.metaDescription };
}

export function shareImage(path: string) {
  const snippet = searchSnippet(path);
  return snippet
    ? { url: `/share-image?path=${encodeURIComponent(path)}`, width: 1200, height: 630, alt: `BACwater.ai droplet logo and ${snippet.title.replace(/ \| BACwater\.ai$/, "")} title card` }
    : { url: "/opengraph-image", width: 1200, height: 630, alt: BRAND_IMAGE_ALT };
}
