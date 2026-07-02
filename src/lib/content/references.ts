/**
 * Curated, verified scientific / regulatory references.
 *
 * Every URL here was checked against the primary authority (FDA labeling via
 * DailyMed, NIH PubChem, CDC) before inclusion. This is a YMYL topic, so we do
 * not fabricate citations or guess at PMIDs/DOIs. When adding a reference,
 * verify the URL resolves and that it actually supports the claim.
 */

export interface Reference {
  /** Citation title. */
  title: string;
  /** Publishing authority. */
  source: string;
  /** Verified, stable URL. */
  url: string;
  /** What claim this reference supports (shown to readers). */
  note?: string;
}

// ---------------------------------------------------------------------------
// Verified primary sources (checked 2026-07)
// ---------------------------------------------------------------------------

export const REF = {
  dailymedBacWater: {
    title: "Bacteriostatic Water for Injection, USP - prescribing information",
    source: "U.S. FDA labeling via DailyMed (NIH / NLM)",
    url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=87d6e9dc-fe3b-4593-ac9a-d7493d1959c7",
    note: "Defines bacteriostatic water as sterile water with 0.9% benzyl alcohol added as a bacteriostatic preservative, supplied in a multiple-dose container for diluting or dissolving drugs; contraindicated in neonates.",
  },
  pubchemBenzylAlcohol: {
    title: "Benzyl alcohol (Compound CID 244)",
    source: "NIH PubChem, National Library of Medicine",
    url: "https://pubchem.ncbi.nlm.nih.gov/compound/244",
    note: "Chemical identity, properties, and safety data for benzyl alcohol, the bacteriostatic preservative in BAC water.",
  },
  cdcMultiDoseVial: {
    title: "Preventing Unsafe Injection Practices - multi-dose vials",
    source: "U.S. Centers for Disease Control and Prevention",
    url: "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
    note: "Once opened or first punctured, a multi-dose vial should be dated and discarded within 28 days unless the manufacturer specifies otherwise.",
  },
} satisfies Record<string, Reference>;

// ---------------------------------------------------------------------------
// Common bundles
// ---------------------------------------------------------------------------

/** Core "what BAC water is" sourcing. */
export const CORE_BACWATER_REFERENCES: Reference[] = [
  REF.dailymedBacWater,
  REF.pubchemBenzylAlcohol,
];

/** Storage / shelf-life sourcing (adds the CDC 28-day guidance). */
export const SHELF_LIFE_REFERENCES: Reference[] = [
  REF.dailymedBacWater,
  REF.cdcMultiDoseVial,
  REF.pubchemBenzylAlcohol,
];

// ---------------------------------------------------------------------------
// Per-page maps
// ---------------------------------------------------------------------------

/** References for DB-backed guide slugs (rendered on /learn/[slug]). */
export const GUIDE_REFERENCES: Record<string, Reference[]> = {
  "what-is-bac-water": CORE_BACWATER_REFERENCES,
  "how-peptide-reconstitution-works": [REF.dailymedBacWater],
  "how-to-store-reconstituted-peptides": SHELF_LIFE_REFERENCES,
  "how-long-bac-water-lasts": SHELF_LIFE_REFERENCES,
  "too-much-bac-water": [REF.dailymedBacWater],
};

/** References for comparison topics (rendered on /learn/vs/[topic]). */
export const TOPIC_REFERENCES: Record<string, Reference[]> = {
  "benzyl-alcohol": [REF.pubchemBenzylAlcohol, REF.dailymedBacWater],
  "sterile-water": [REF.dailymedBacWater],
  "saline": [REF.dailymedBacWater],
  "sodium-chloride": [REF.dailymedBacWater],
  "distilled-water": [REF.dailymedBacWater],
  "acetic-acid": [REF.dailymedBacWater],
  "reconstitution-solution": [REF.dailymedBacWater],
};

export function guideReferences(slug: string): Reference[] | undefined {
  return GUIDE_REFERENCES[slug];
}

export function topicReferences(slug: string): Reference[] | undefined {
  return TOPIC_REFERENCES[slug];
}
