/**
 * Curated reference of common research peptides.
 *
 * All values are typical research references, NOT medical dosing.
 * BACwater.ai does not provide medical advice. Users should verify
 * every value against the label on their vial.
 */

export type PeptideCategory =
  | "healing"
  | "growth"
  | "metabolic"
  | "cognitive"
  | "cosmetic"
  | "reproductive"
  | "longevity"
  | "other";

export interface PeptideRef {
  slug: string;
  name: string;
  aliases?: string[];
  category: PeptideCategory;
  /** Common vial strengths available on the market (mg) */
  commonVialStrengthsMg: number[];
  /** Typical research dose range in mcg */
  typicalDoseMcgRange: [number, number];
  /** Typical single dose users search for in mcg */
  suggestedDoseMcg: number;
  /** Shelf life after reconstitution, refrigerated (days) */
  refrigeratedShelfDays: number;
  /** Human-readable storage note */
  storageNote: string;
  /** Assumption / caution note */
  note?: string;
}

export const PEPTIDES: PeptideRef[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "healing",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [200, 500],
    suggestedDoseMcg: 250,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate at 36-46°F (2-8°C). Protect from light.",
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    aliases: ["thymosin beta 4", "tb500"],
    category: "healing",
    commonVialStrengthsMg: [2, 5, 10],
    typicalDoseMcgRange: [1000, 5000],
    suggestedDoseMcg: 2500,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate at 36-46°F (2-8°C). Larger doses typical.",
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "growth",
    commonVialStrengthsMg: [2, 5],
    typicalDoseMcgRange: [100, 300],
    suggestedDoseMcg: 200,
    refrigeratedShelfDays: 28,
    storageNote: "Refrigerate. Consider splitting into smaller batches.",
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (no DAC)",
    aliases: ["cjc no dac", "mod grf 1-29"],
    category: "growth",
    commonVialStrengthsMg: [2, 5],
    typicalDoseMcgRange: [100, 300],
    suggestedDoseMcg: 100,
    refrigeratedShelfDays: 21,
    storageNote: "Less stable. Use within ~3 weeks after mixing.",
  },
  {
    slug: "cjc-1295-with-dac",
    name: "CJC-1295 with DAC",
    aliases: ["cjc with dac"],
    category: "growth",
    commonVialStrengthsMg: [2, 5],
    typicalDoseMcgRange: [500, 2000],
    suggestedDoseMcg: 1000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate. Longer half-life than non-DAC.",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "growth",
    commonVialStrengthsMg: [2, 5, 15],
    typicalDoseMcgRange: [100, 500],
    suggestedDoseMcg: 200,
    refrigeratedShelfDays: 21,
    storageNote: "Refrigerate immediately. Use within ~3 weeks.",
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    category: "growth",
    commonVialStrengthsMg: [2, 5],
    typicalDoseMcgRange: [100, 300],
    suggestedDoseMcg: 200,
    refrigeratedShelfDays: 28,
    storageNote: "Refrigerate.",
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "metabolic",
    commonVialStrengthsMg: [3, 5, 10],
    typicalDoseMcgRange: [250, 2400],
    suggestedDoseMcg: 250,
    refrigeratedShelfDays: 56,
    storageNote:
      "Refrigerate. Typical protocols start very low and titrate upward.",
    note: "Research chemical dose ranges vary widely. Confirm the exact strength printed on your vial.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "metabolic",
    commonVialStrengthsMg: [5, 10, 15, 30, 60],
    typicalDoseMcgRange: [2500, 15000],
    suggestedDoseMcg: 2500,
    refrigeratedShelfDays: 42,
    storageNote:
      "Refrigerate at 36-46°F. Do not freeze reconstituted solution.",
    note: "Research chemical dose ranges vary. Verify vial strength before mixing.",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "metabolic",
    commonVialStrengthsMg: [5, 10, 15],
    typicalDoseMcgRange: [500, 12000],
    suggestedDoseMcg: 2000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate. Emerging research compound.",
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    category: "metabolic",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [300, 2400],
    suggestedDoseMcg: 300,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "longevity",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [5000, 10000],
    suggestedDoseMcg: 5000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "epithalon",
    name: "Epithalon (Epitalon)",
    category: "longevity",
    commonVialStrengthsMg: [10, 20, 50],
    typicalDoseMcgRange: [5000, 10000],
    suggestedDoseMcg: 5000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "cosmetic",
    commonVialStrengthsMg: [50, 100, 200],
    typicalDoseMcgRange: [1000, 3000],
    suggestedDoseMcg: 2000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate. Blue tint is normal.",
  },
  {
    slug: "melanotan-2",
    name: "Melanotan II",
    aliases: ["mt2", "mt-2"],
    category: "cosmetic",
    commonVialStrengthsMg: [10],
    typicalDoseMcgRange: [250, 1000],
    suggestedDoseMcg: 500,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate. Start with a very low test dose.",
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "longevity",
    commonVialStrengthsMg: [5, 10, 50],
    typicalDoseMcgRange: [1000, 5000],
    suggestedDoseMcg: 3000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "selank",
    name: "Selank",
    category: "cognitive",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [250, 900],
    suggestedDoseMcg: 300,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "semax",
    name: "Semax",
    category: "cognitive",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [200, 900],
    suggestedDoseMcg: 300,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "metabolic",
    commonVialStrengthsMg: [2, 5],
    typicalDoseMcgRange: [250, 600],
    suggestedDoseMcg: 300,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    category: "reproductive",
    commonVialStrengthsMg: [1, 5, 10],
    typicalDoseMcgRange: [100, 500],
    suggestedDoseMcg: 200,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "reproductive",
    commonVialStrengthsMg: [10],
    typicalDoseMcgRange: [500, 2000],
    suggestedDoseMcg: 1000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
  },
  {
    slug: "hcg",
    name: "HCG (Research)",
    category: "reproductive",
    commonVialStrengthsMg: [5, 10],
    typicalDoseMcgRange: [100, 5000],
    suggestedDoseMcg: 500,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate.",
    note: "HCG strength is often stated in IU. Confirm vial units before proceeding.",
  },
  {
    slug: "glow-blend",
    name: "GHK-Cu + BPC-157 (Glow Blend)",
    category: "cosmetic",
    commonVialStrengthsMg: [50],
    typicalDoseMcgRange: [500, 2000],
    suggestedDoseMcg: 1000,
    refrigeratedShelfDays: 30,
    storageNote: "Refrigerate. Blends: reference the label for exact ratios.",
    note: "Blends contain multiple peptides. Verify each component strength.",
  },
  {
    slug: "custom",
    name: "Other / Custom",
    category: "other",
    commonVialStrengthsMg: [1, 2, 5, 10],
    typicalDoseMcgRange: [100, 1000],
    suggestedDoseMcg: 250,
    refrigeratedShelfDays: 28,
    storageNote:
      "Refrigerate. Refer to the label on your vial for storage guidance.",
    note: "For peptides not in our reference list, verify every input against the label.",
  },
];

export function findPeptide(query: string): PeptideRef | null {
  const q = query.toLowerCase().trim();
  return (
    PEPTIDES.find(
      (p) =>
        p.slug === q ||
        p.name.toLowerCase() === q ||
        p.aliases?.some((a) => a.toLowerCase() === q)
    ) ?? null
  );
}
