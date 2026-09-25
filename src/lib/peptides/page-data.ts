import { productDisplayName } from "@/lib/partners/supplier-catalog";
/**
 * Deterministic per-peptide page data derived from the calculator engine and
 * peptides.ts. Everything numeric on a /peptides/[slug] page flows through
 * here so the dosage tables, direct answers, and reconstitution steps stay
 * consistent with the calculator itself.
 */

import { recommendBacWaterMl } from "@/lib/calc";
import type { PeptideRef } from "@/lib/calc/peptides";
import { round } from "@/lib/utils";

export interface DosageRow {
  vialMg: number;
  bacMl: number;
  concentrationMgPerMl: number;
  doseMcg: number;
  doseLabel: string;
  units: number;
}

/** Short display name: strip the parenthetical, e.g. "TB-500 (Thymosin Beta-4)" -> "TB-500". */
export function shortName(name: string): string {
  if (/\(no DAC\)/i.test(name)) return name.trim();
  return name.replace(/\s*\(.*\)\s*/, "").trim();
}

export function formatDose(mcg: number): string {
  if (mcg >= 1000) {
    const mg = mcg / 1000;
    return `${round(mg, mg % 1 === 0 ? 0 : 2)} mg`;
  }
  return `${round(mcg, 0)} mcg`;
}

/** One illustrative row per listed vial amount; no compound dose is inferred. */
export function dosageRows(p: PeptideRef): DosageRow[] {
  // The same compound-neutral mass demonstrates arithmetic, not a research regimen.
  const doseMcg = 100;
  const doseMg = doseMcg / 1000;
  return p.commonVialStrengthsMg.map((vialMg) => {
    const bacMl = 2; // Fixed illustrative final volume, not a recommended dilution.
    const concentrationMgPerMl = vialMg / bacMl;
    const doseVolumeMl = doseMg / concentrationMgPerMl;
    const units = doseVolumeMl * 100;
    return {
      vialMg,
      bacMl: round(bacMl, 2),
      concentrationMgPerMl: round(concentrationMgPerMl, 2),
      doseMcg,
      doseLabel: formatDose(doseMcg),
      units: round(units, 1),
    };
  });
}

/** Representative vial strength used for the opening direct answer. */
export function representativeStrength(p: PeptideRef): number {
  return p.commonVialStrengthsMg[0];
}

/** 40-60 word direct-answer paragraph that opens the page. */
export function directAnswer(p: PeptideRef): string {
  const name = productDisplayName(p.slug, shortName(p.name));
  return `Use this ${name} calculator to convert your stated vial amount and final liquid volume into concentration and U-100 syringe units. Enter an amount to measure from instructions you already have. Vial strength alone cannot determine a suitable diluent, mixing volume, dose or storage time.`;
}

/** Reconstitution steps for the HowTo block, tuned to this peptide. */
export function reconstitutionSteps(p: PeptideRef): { name: string; text: string }[] {
  return [
    { name: "Check the product instructions", text: `Confirm the identity, amount and units on your ${productDisplayName(p.slug, shortName(p.name))} label. A name alone does not establish formulation, purity or suitability for use.` },
    { name: "Enter the known volume", text: "Use the liquid volume specified for your product or the actual final volume of an existing solution. A convenient calculator result is not permission to change those instructions." },
    { name: "Check the concentration", text: "Divide the total amount in milligrams by the final volume in milliliters to obtain mg/mL. The calculation assumes the stated amount is fully dissolved in that final volume." },
    { name: "Check the measurement", text: "Convert the amount you entered to milliliters using that concentration. U-100 markings represent 100 units per mL, not milligrams of a compound." },
    { name: "Keep storage instructions separate", text: "Use the product-specific storage and discard instructions. This calculation cannot determine a safe use period or verify sterility." },
  ];
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Auto-generated + curated FAQ entries, each an answerable FAQPage unit. */
export function buildFaqs(
  p: PeptideRef,
  extra: FaqItem[] = []
): FaqItem[] {
  const name = productDisplayName(p.slug, shortName(p.name));
  const rows = dosageRows(p);
  const faqs: FaqItem[] = [];

  // Per-strength answerable units (the core "how much bac water for Xmg" intent).
  for (const r of rows) {
    faqs.push({
      q: `How much bac water for ${r.vialMg} mg ${name}?`,
      a: `A ${r.vialMg} mg vial in a final volume of ${r.bacMl} mL would have a concentration of ${r.concentrationMgPerMl} mg/mL. In that arithmetic example, ${r.doseLabel} corresponds to ${r.units} U-100 units. These are illustrative inputs, not a recommended dilution or dose. Follow the product-specific instructions.`,
    });
  }

  // Storage / shelf life.
  faqs.push({
    q: `How long does reconstituted ${name} last?`,
    a: `A reliable storage period for ${name} cannot be inferred from the compound name or concentration alone. Follow the instructions for the exact formulation. This calculator does not establish sterility, stability or a discard date.`,
  });

  // Extra curated entries.
  faqs.push(...extra);

  return faqs;
}
