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
  return name.replace(/\s*\(.*\)\s*/, "").trim();
}

export function formatDose(mcg: number): string {
  if (mcg >= 1000) {
    const mg = mcg / 1000;
    return `${round(mg, mg % 1 === 0 ? 0 : 2)} mg`;
  }
  return `${round(mcg, 0)} mcg`;
}

/** One dosage row per common vial strength, using the peptide's typical dose. */
export function dosageRows(p: PeptideRef): DosageRow[] {
  const doseMcg = p.suggestedDoseMcg;
  const doseMg = doseMcg / 1000;
  return p.commonVialStrengthsMg.map((vialMg) => {
    const bacMl = recommendBacWaterMl(vialMg, doseMcg);
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
  const name = shortName(p.name);
  const vialMg = representativeStrength(p);
  const doseMcg = p.suggestedDoseMcg;
  const bacMl = recommendBacWaterMl(vialMg, doseMcg);
  const conc = round(vialMg / bacMl, 2);
  const units = round(((doseMcg / 1000) / (vialMg / bacMl)) * 100, 1);
  return (
    `To mix a ${vialMg} mg vial of ${name}, add about ${round(bacMl, 2)} mL of BAC water. ` +
    `Now each 1 mL of liquid holds ${conc} mg of peptide. So a ${formatDose(doseMcg)} dose is about ` +
    `${units} units on a 1 mL insulin syringe. Want a rounder number? Add a little more or a little less water.`
  );
}

/** Reconstitution steps for the HowTo block, tuned to this peptide. */
export function reconstitutionSteps(
  p: PeptideRef
): { name: string; text: string }[] {
  const name = shortName(p.name);
  const vialMg = representativeStrength(p);
  const bacMl = round(recommendBacWaterMl(vialMg, p.suggestedDoseMcg), 2);
  return [
    {
      name: "Gather your supplies",
      text: `Wash your hands and lay out your ${name} vial, a vial of bacteriostatic water, an insulin syringe, and alcohol prep pads on a clean surface.`,
    },
    {
      name: "Swab both vial tops",
      text: "Wipe the rubber stopper of both the peptide vial and the bacteriostatic water vial with separate alcohol prep pads. Let them air dry.",
    },
    {
      name: "Draw the bacteriostatic water",
      text: `For a ${vialMg} mg vial, draw about ${bacMl} mL of bacteriostatic water. Use the calculator on this page to match your exact vial strength.`,
    },
    {
      name: "Add water to the peptide vial",
      text: "Insert the needle at an angle and let the water run slowly down the inside wall of the vial. Do not spray it directly onto the powder.",
    },
    {
      name: "Swirl gently",
      text: "Roll the vial between your palms until the powder fully dissolves. Never shake, since shaking can damage the peptide. The solution should look clear.",
    },
    {
      name: "Label and refrigerate",
      text: "Label the vial with the peptide name, the date mixed, and the expiration date, then refrigerate it immediately.",
    },
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
  const name = shortName(p.name);
  const rows = dosageRows(p);
  const faqs: FaqItem[] = [];

  // Per-strength answerable units (the core "how much bac water for Xmg" intent).
  for (const r of rows) {
    faqs.push({
      q: `How much bac water for ${r.vialMg} mg ${name}?`,
      a: `Add about ${r.bacMl} mL of bacteriostatic water to a ${r.vialMg} mg vial of ${name}. That creates a ${r.concentrationMgPerMl} mg/mL solution, so a ${r.doseLabel} dose is about ${r.units} units on a 1 mL insulin syringe. Adjust the water amount to move the dose to a cleaner mark.`,
    });
  }

  // Storage / shelf life.
  faqs.push({
    q: `How long does reconstituted ${name} last?`,
    a: `Once mixed, ${name} is typically stable for about ${p.refrigeratedShelfDays} days when refrigerated. ${p.storageNote} Discard it sooner if the solution turns cloudy or develops particles.`,
  });

  // Extra curated entries.
  faqs.push(...extra);

  return faqs;
}
