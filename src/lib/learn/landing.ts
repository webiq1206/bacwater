import { CONTENT_TYPE_LABEL, TOPIC_LABEL, TOPICS } from "./taxonomy";

export interface LearnFilters { type?: string; topic?: string; peptide?: string; q?: string; }
type Copy = { title: string; description: string };
const HUB: Copy = {
  title: "BAC Water & Peptide Reconstitution Guides",
  description: "Understand concentration, syringe scales, product labels and storage limits. Find a guide, compare diluents, or check the arithmetic with a free calculator.",
};
const TYPES: Record<string, Copy> = {
  guide: { title: "BAC Water and Reconstitution Guides", description: "Start with the meaning of BAC water, then work through concentration, measurement and label checks. These guides explain the arithmetic and its limits without choosing a dose or diluent for you." },
  "peptide-guide": { title: "Peptide References and Calculation Examples", description: "Look up a compound to review its identity, selected research and concentration examples. Product-specific instructions still determine the formulation, preparation and storage requirements." },
  comparison: { title: "BAC Water and Diluent Comparisons", description: "Compare preserved water, sterile water, saline and other solution labels. Check ingredients and product instructions before treating similar names as interchangeable." },
  faq: { title: "BAC Water Questions and Calculation Checks", description: "Find answers to common questions about BAC water, concentration and measurement. Each answer separates what the numbers establish from what requires product-specific instructions." },
  "buying-guide": { title: "BAC Water Buying and Label Guides", description: "Check product identity, ingredients, packaging and seller information before choosing a supply. Research products and pharmaceutical diluents have different labels and intended uses." },
  safety: { title: "BAC Water Safety and Calculation Limits", description: "Understand what a concentration calculator cannot verify: identity, sterility, compatibility or stability. Use original product instructions and appropriate qualified review for those decisions." },
};
const TOPIC_COPY: Record<string, Copy> = {
  dosage: { title: "Amounts, Concentration and Syringe Units", description: "Distinguish mg, mcg, mL and U-100 scale units. Work through conversions using an amount and concentration you already know; the tools do not select a dose or schedule." },
  storage: { title: "BAC Water Storage and Shelf Life", description: "Separate unopened expiry, opened-container guidance and the instructions for a mixed product. A concentration result or clear appearance cannot establish a safe storage period." },
  safety: TYPES.safety,
  ingredients: { title: "BAC Water Ingredients and Solution Labels", description: "Learn how water, benzyl alcohol and sodium chloride appear on diluent labels. Ingredient names and concentrations matter when comparing preserved water, saline and other solutions." },
  "where-to-buy": { title: "Where to Buy BAC Water: Supplier and Product Checks", description: "Find the right questions to ask about supplier identity, formulation, packaging and intended use. Verify current availability and supply requirements with the appropriate licensed supplier." },
  "injection-supplies": { title: "Syringe Scales and Measurement Supplies", description: "Read syringe capacity and graduation spacing, distinguish U-100 units from mL, and check whether a calculated volume fits the stated scale. Device suitability comes from its instructions." },
  "reconstitution-method": { title: "Peptide Reconstitution Basics and Math", description: "Understand how a stated amount and final liquid volume determine concentration. Check the formulation and diluent instructions first, then use the calculator to verify the numbers." },
};

/** One policy for metadata, visible copy, structured data and XML discovery. */
export function learnLanding(filters: LearnFilters, count: number, peptideName?: string) {
  const dimensions = (["type", "topic", "peptide"] as const).filter(key => filters[key]);
  const single = !filters.q && dimensions.length === 1 ? dimensions[0] : null;
  const unfiltered = !filters.q && dimensions.length === 0;
  const collision = single === "type" && TOPICS.some(topic => topic.key === filters.type);
  const indexable = unfiltered || Boolean(single && count >= 3 && !collision);
  const canonical = collision ? `/learn?topic=${encodeURIComponent(filters.type!)}`
    : indexable && single ? `/learn?${single}=${encodeURIComponent(filters[single]!)}` : "/learn";
  let copy = HUB;
  if (single === "type") copy = TYPES[filters.type!] || { title: `${CONTENT_TYPE_LABEL[filters.type!] || "BAC Water"} Resources`, description: HUB.description };
  if (single === "topic") copy = TOPIC_COPY[filters.topic!] || { title: `${TOPIC_LABEL[filters.topic!] || "BAC Water"} Resources`, description: HUB.description };
  if (single === "peptide") copy = { title: `${peptideName || filters.peptide} References and Calculation Guides`, description: `Find identity context, measurement examples and related references for ${peptideName || filters.peptide}. Use instructions for the exact product; a name alone does not establish a dose, dilution or storage period.` };
  if (!unfiltered && !single) copy = { title: "Find a BAC Water Guide", description: "Narrow the learning center by topic, type or compound. Remove a filter if the results do not answer your question." };
  return { ...copy, canonical, indexable };
}
