/**
 * Deterministic peptide reconstitution math.
 *
 * All calculations are pure functions. They do not consult the AI,
 * do not make network calls, and always yield the same result for
 * the same input.
 *
 * Units convention:
 *   - Vial strength: milligrams (mg)
 *   - Doses: micrograms (mcg) [1 mg = 1000 mcg]
 *   - BAC water: milliliters (mL)
 *   - Concentration: mg per mL
 *   - Syringe units: U-100 insulin scale (100 units = 1 mL)
 */

import { PEPTIDES, findPeptide } from "./peptides";
import { round } from "@/lib/utils";

export type SyringeType =
  | "insulin-0.3ml"
  | "insulin-0.5ml"
  | "insulin-1ml"
  | "tuberculin-1ml"
  | "syringe-3ml";

export interface SyringeSpec {
  id: SyringeType;
  label: string;
  scale: "u100" | "ml";
  maxVolumeMl: number;
  maxUnits: number;
  incrementMl: number;
  description: string;
}

export const SYRINGES: SyringeSpec[] = [
  {
    id: "insulin-0.3ml",
    label: "0.3 mL insulin syringe (30 units)",
    scale: "u100",
    maxVolumeMl: 0.3,
    maxUnits: 30,
    incrementMl: 0.005,
    description: "Best for very small doses. Each half-unit mark = 0.005 mL.",
  },
  {
    id: "insulin-0.5ml",
    label: "0.5 mL insulin syringe (50 units)",
    scale: "u100",
    maxVolumeMl: 0.5,
    maxUnits: 50,
    incrementMl: 0.01,
    description: "Middle range for most reconstituted peptides.",
  },
  {
    id: "insulin-1ml",
    label: "1 mL insulin syringe (100 units)",
    scale: "u100",
    maxVolumeMl: 1.0,
    maxUnits: 100,
    incrementMl: 0.01,
    description: "Standard insulin syringe. Each mark = 1 unit.",
  },
  {
    id: "tuberculin-1ml",
    label: "1 mL tuberculin (mL scale)",
    scale: "ml",
    maxVolumeMl: 1.0,
    maxUnits: 0,
    incrementMl: 0.01,
    description: "Marked in mL. Useful for larger volumes.",
  },
  {
    id: "syringe-3ml",
    label: "3 mL syringe (mL scale)",
    scale: "ml",
    maxVolumeMl: 3.0,
    maxUnits: 0,
    incrementMl: 0.1,
    description: "Used mostly for drawing BAC water, not for injections.",
  },
];

export function findSyringe(id: SyringeType): SyringeSpec {
  return SYRINGES.find((s) => s.id === id) ?? SYRINGES[2];
}

export interface CalcInput {
  peptideSlug?: string;
  peptideName?: string;
  vialStrengthMg: number;
  doseMcg: number;
  bacWaterMl?: number;
  syringeType: SyringeType;
  dateMixed?: string | Date | null;
  /**
   * Optional second peptide in the SAME vial (a blend). Common example:
   * Ipamorelin + CJC-1295 (no DAC). Because both peptides sit in the
   * same solution, every draw delivers both peptides in proportion.
   */
  secondary?: {
    peptideSlug?: string;
    peptideName?: string;
    vialStrengthMg: number;
  } | null;
}

export interface SupplyRecommendation {
  sku: string;
  name: string;
  quantity: number;
  reason: string;
}

export interface CalcResult {
  input: Required<Omit<CalcInput, "dateMixed" | "peptideSlug" | "peptideName" | "bacWaterMl" | "secondary">> & {
    peptideSlug: string | null;
    peptideName: string | null;
    bacWaterMl: number;
    dateMixed: string | null;
  };
  recommendedBacMl: number;
  usedBacMl: number;
  finalConcentrationMgPerMl: number;
  finalConcentrationMcgPerMl: number;
  doseVolumeMl: number;
  syringeUnits: number;
  syringeReadout: {
    kind: "u100" | "ml";
    valueRounded: number;
    displayLabel: string;
    exceedsSyringe: boolean;
    fillPercent: number;
  };
  dosesPerVial: number;
  expiration: {
    days: number;
    date: string | null;
    note: string;
  };
  supplies: SupplyRecommendation[];
  assumptions: string[];
  warnings: string[];
  errors: string[];
  summary: string;
  instructions: string[];
  /**
   * For blends: the "companion" dose, the amount of the second peptide
   * delivered alongside every draw of the primary dose.
   */
  secondary?: {
    peptideName: string;
    vialStrengthMg: number;
    concentrationMgPerMl: number;
    companionDoseMcg: number;
  };
}

const MG_PER_MCG = 0.001;

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Recommend a BAC water volume that yields comfortable dosing
 * (target ~10 units on a U-100 syringe), rounded to the nearest
 * clean 0.5 mL, clamped to 1-3 mL.
 */
export function recommendBacWaterMl(vialStrengthMg: number, doseMcg: number): number {
  if (!isFiniteNumber(vialStrengthMg) || !isFiniteNumber(doseMcg) || doseMcg <= 0)
    return 2;
  const doseMg = doseMcg * MG_PER_MCG;
  // Target 10 U-100 units per dose
  const target = 10;
  const raw = (target * vialStrengthMg) / (100 * doseMg);
  const snapped = Math.round(raw * 2) / 2;
  return Math.max(1, Math.min(3, snapped || 2));
}

function pickSupplies(input: CalcInput, syringe: SyringeSpec, dosesPerVial: number): SupplyRecommendation[] {
  const supplies: SupplyRecommendation[] = [];
  const bac = input.bacWaterMl ?? recommendBacWaterMl(input.vialStrengthMg, input.doseMcg);
  // 1 vial of BAC water 30mL is standard. Round up to enough vials.
  const totalBacNeededMl = Math.max(bac, 5);
  const bacVials = Math.ceil(totalBacNeededMl / 30);
  supplies.push({
    sku: "BAC-30ML",
    name: "Bacteriostatic Water, 30 mL vial",
    quantity: bacVials,
    reason: "Diluent used to reconstitute the peptide.",
  });

  // Syringes: at least dosesPerVial, plus 1 extra for reconstitution draw
  const injectionSyringes = Math.max(1, Math.ceil(dosesPerVial));
  const syringeName =
    syringe.id === "insulin-0.3ml"
      ? "Insulin syringes, 0.3 mL / 30 units (100 pack)"
      : syringe.id === "insulin-0.5ml"
        ? "Insulin syringes, 0.5 mL / 50 units (100 pack)"
        : syringe.id === "insulin-1ml"
          ? "Insulin syringes, 1 mL / 100 units (100 pack)"
          // Non-insulin syringe types are not stocked; recommend the closest
          // purchasable option we carry (the 1 mL insulin syringe).
          : "Insulin syringes, 1 mL / 100 units (100 pack)";
  supplies.push({
    sku:
      syringe.id === "insulin-0.3ml"
        ? "SYR-INS-03"
        : syringe.id === "insulin-0.5ml"
          ? "SYR-INS-05"
          : syringe.id === "insulin-1ml"
            ? "SYR-INS-10"
            : "SYR-INS-10",
    name: syringeName,
    quantity: Math.max(1, Math.ceil(injectionSyringes / 100)),
    reason: `Enough for approximately ${injectionSyringes} injections.`,
  });

  supplies.push({
    sku: "ALC-200",
    name: "Alcohol prep pads (200 pack)",
    quantity: 1,
    reason: "For sanitizing vial tops and injection site.",
  });

  return supplies;
}

function buildInstructions(input: {
  bacMl: number;
  vialStrengthMg: number;
  concentrationMgPerMl: number;
  doseMcg: number;
  units: number;
  syringe: SyringeSpec;
}): string[] {
  const drawLabel =
    input.syringe.scale === "u100"
      ? `Draw ${round(input.units, 1)} units on the ${input.syringe.label}.`
      : `Draw ${round(input.units / 100, 2)} mL on the ${input.syringe.label}.`;
  // Lowercase only the first letter so it flows after "and", without mangling
  // units like "mL" into "ml".
  const drawLabelInline = drawLabel.charAt(0).toLowerCase() + drawLabel.slice(1);

  return [
    "Wash your hands and lay out your supplies on a clean surface.",
    `Wipe the top of the BAC water vial with an alcohol prep pad. Let it dry.`,
    `Using a syringe, draw ${round(input.bacMl, 2)} mL of BAC water.`,
    "Wipe the top of the peptide vial. Slowly inject the BAC water along the inside wall of the vial. Do not aim directly at the peptide powder.",
    "Gently swirl (do not shake) until the powder is fully dissolved. The solution should look clear.",
    "Label the vial with the peptide name, date mixed, and expiration.",
    "Refrigerate the reconstituted vial immediately.",
    `When ready to dose: wipe the vial top, invert the vial, and ${drawLabelInline}`,
    "Wipe the injection site, inject, then dispose of the syringe safely in a sharps container.",
  ];
}

export function calculate(input: CalcInput): CalcResult {
  const assumptions: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const peptideRef = input.peptideSlug ? findPeptide(input.peptideSlug) : null;
  const peptideName = input.peptideName || peptideRef?.name || null;

  if (!isFiniteNumber(input.vialStrengthMg) || input.vialStrengthMg <= 0)
    errors.push("Vial strength must be greater than 0 mg.");
  if (!isFiniteNumber(input.doseMcg) || input.doseMcg <= 0)
    errors.push("Dose must be greater than 0 mcg.");

  const vialStrengthMg = Math.max(0.0001, input.vialStrengthMg || 0);
  const doseMcg = Math.max(0.0001, input.doseMcg || 0);
  const doseMg = doseMcg * MG_PER_MCG;

  // Sanity flags on unusual inputs
  if (vialStrengthMg > 100)
    warnings.push(
      "That vial strength is unusually high. Double-check the label before mixing."
    );
  if (vialStrengthMg < 0.5)
    warnings.push("That vial strength is unusually low. Confirm the label.");
  if (doseMg > vialStrengthMg)
    warnings.push(
      "Your dose is larger than the vial contains. Verify your dose and vial strength."
    );
  // Unit-error and outlier guards (PRD §9.4 V-05/V-06/V-13). These catch the
  // dominant failure mode in this category: a 10x or 1,000x mistake from
  // confusing mg and mcg. Measured against what the studies on the page used.
  if (peptideRef) {
    const [lo, hi] = peptideRef.typicalDoseMcgRange;
    if (doseMcg >= hi * 100) {
      // ~1,000x too big — almost always mg picked where mcg was meant.
      warnings.push(
        `That amount is about 1,000 times the amounts in the studies here. Vial amounts like this are usually measured in mcg. Did you pick "mg" by mistake? Check your label.`
      );
    } else if (doseMcg >= hi * 10) {
      warnings.push(
        `This is about 10 times bigger than the amounts in the studies on this page. Check what you typed.`
      );
    } else if (doseMcg > 0 && doseMcg <= lo / 100) {
      warnings.push(
        `That amount is far smaller than the amounts in the studies here. Did you mean mg instead of mcg? Check your label.`
      );
    } else if (doseMcg <= lo / 10) {
      warnings.push(
        `This is about 10 times smaller than the amounts in the studies on this page. Check what you typed.`
      );
    }
  }

  const recommendedBacMl = recommendBacWaterMl(vialStrengthMg, doseMcg);
  const usedBacMl = isFiniteNumber(input.bacWaterMl)
    ? Math.max(0.1, input.bacWaterMl!)
    : recommendedBacMl;

  if (usedBacMl > 5)
    warnings.push(
      "Using more than 5 mL of BAC water is unusual for a single vial. Confirm this is what you intend."
    );
  if (usedBacMl < 0.5)
    warnings.push(
      "Using less than 0.5 mL of BAC water may make dosing very small and hard to draw."
    );

  const finalConcentrationMgPerMl = vialStrengthMg / usedBacMl;
  const finalConcentrationMcgPerMl = finalConcentrationMgPerMl * 1000;
  const doseVolumeMl = doseMg / finalConcentrationMgPerMl;
  const syringeUnits = doseVolumeMl * 100;
  const dosesPerVial = Math.floor(vialStrengthMg / doseMg);

  const syringe = findSyringe(input.syringeType);
  const exceedsSyringe = doseVolumeMl > syringe.maxVolumeMl + 1e-9;
  if (exceedsSyringe)
    warnings.push(
      `The calculated dose (${round(doseVolumeMl, 2)} mL) exceeds the capacity of the selected ${syringe.label}. Consider a larger syringe or less BAC water.`
    );

  // V-02 (PRD §9.4): the amount must land on a mark you can actually read.
  // U-100 barrels are marked every 1 unit (0.3 / 0.5 mL) or every 2 units
  // (1 mL). A value between marks — like the live 7.5-unit defect — cannot be
  // measured, so we flag it instead of silently returning an unusable number.
  const smallestMarkUnits = syringe.id === "insulin-1ml" ? 2 : 1;
  if (syringe.scale === "u100" && syringeUnits > 0) {
    const marks = syringeUnits / smallestMarkUnits;
    const onMark = Math.abs(marks - Math.round(marks)) < 0.02;
    if (!onMark) {
      warnings.push(
        `Your syringe has a mark every ${smallestMarkUnits} unit${smallestMarkUnits === 1 ? "" : "s"}. Your amount is ${round(syringeUnits, 1)} units. That is between two marks, so you cannot measure it exactly. Change your water amount so the amount lands on a line.`
      );
    }
  }

  // Guardrail: a draw this small is very hard to measure accurately on a
  // standard insulin syringe. Flag it instead of silently returning a number.
  if (syringe.scale === "u100" && syringeUnits > 0 && syringeUnits < 2)
    warnings.push(
      `This amount works out to only ${round(syringeUnits, 1)} units, which is very hard to measure accurately. Use less BAC water so it lands at a larger, easier-to-read mark, or switch to a 0.3 mL syringe.`
    );

  const syringeReadout = {
    kind: syringe.scale,
    valueRounded:
      syringe.scale === "u100" ? round(syringeUnits, 1) : round(doseVolumeMl, 2),
    displayLabel:
      syringe.scale === "u100"
        ? `${round(syringeUnits, 1)} units on the ${syringe.label}`
        : `${round(doseVolumeMl, 2)} mL on the ${syringe.label}`,
    exceedsSyringe,
    fillPercent: Math.min(
      100,
      Math.max(0, (doseVolumeMl / syringe.maxVolumeMl) * 100)
    ),
  };

  const days = peptideRef?.refrigeratedShelfDays ?? 28;
  let expDate: string | null = null;
  if (input.dateMixed) {
    const d = new Date(input.dateMixed);
    if (!Number.isNaN(d.getTime())) {
      d.setDate(d.getDate() + days);
      expDate = d.toISOString();
    }
  }

  assumptions.push(
    "Concentration is calculated as (vial strength in mg) ÷ (BAC water in mL)."
  );
  assumptions.push(
    "Syringe units use the U-100 insulin scale: 100 units = 1 mL."
  );
  if (!peptideRef) {
    assumptions.push(
      "No specific peptide reference selected. Storage defaults to 28 days refrigerated. Check your peptide's actual stability."
    );
  }
  if (!isFiniteNumber(input.bacWaterMl)) {
    assumptions.push(
      `BAC water amount was recommended automatically (${recommendedBacMl} mL) to give clean dosing math.`
    );
  }

  const supplies = pickSupplies(
    { ...input, bacWaterMl: usedBacMl },
    syringe,
    dosesPerVial
  );

  const instructions = buildInstructions({
    bacMl: usedBacMl,
    vialStrengthMg,
    concentrationMgPerMl: finalConcentrationMgPerMl,
    doseMcg,
    units: syringeUnits,
    syringe,
  });

  // --- Secondary peptide (blend) support ---
  let secondaryOutput: CalcResult["secondary"];
  let secondaryName: string | null = null;
  if (input.secondary && isFiniteNumber(input.secondary.vialStrengthMg) && input.secondary.vialStrengthMg > 0) {
    const secondaryRef = input.secondary.peptideSlug
      ? findPeptide(input.secondary.peptideSlug)
      : null;
    const secondaryVialMg = Math.max(0.0001, input.secondary.vialStrengthMg);
    const secondaryConcentration = secondaryVialMg / usedBacMl;
    const companionDoseMcg = doseVolumeMl * secondaryConcentration * 1000;
    secondaryName =
      input.secondary.peptideName || secondaryRef?.name || "Secondary peptide";
    secondaryOutput = {
      peptideName: secondaryName,
      vialStrengthMg: secondaryVialMg,
      concentrationMgPerMl: round(secondaryConcentration, 4),
      companionDoseMcg: round(companionDoseMcg, 1),
    };

    // Blend: expiration is limited by the shorter-lived peptide.
    const secondaryDays = secondaryRef?.refrigeratedShelfDays ?? days;
    if (secondaryDays < days) {
      // Recompute expiration date using the shorter shelf life.
      if (input.dateMixed) {
        const d2 = new Date(input.dateMixed);
        if (!Number.isNaN(d2.getTime())) {
          d2.setDate(d2.getDate() + secondaryDays);
          expDate = d2.toISOString();
        }
      }
    }
    assumptions.push(
      `Blend detected: every draw delivers both peptides in proportion. Companion ${secondaryName} dose = ${round(companionDoseMcg, 0)} mcg per injection.`
    );
  }

  const displayName = secondaryName
    ? `${peptideName || "peptide"} + ${secondaryName}`
    : peptideName || "peptide";

  const summary =
    `Mix ${vialStrengthMg} mg of ${displayName} with ${round(usedBacMl, 2)} mL of BAC water. ` +
    `Each ${doseMcg} mcg dose is ${round(doseVolumeMl, 3)} mL, ` +
    (syringe.scale === "u100"
      ? `${round(syringeUnits, 1)} units on your ${syringe.label}.`
      : `${round(doseVolumeMl, 2)} mL on your ${syringe.label}.`) +
    ` You'll get about ${dosesPerVial} dose${dosesPerVial === 1 ? "" : "s"} per vial.` +
    (secondaryOutput
      ? ` Each draw also delivers ${round(secondaryOutput.companionDoseMcg, 0)} mcg of ${secondaryOutput.peptideName}.`
      : "");

  return {
    input: {
      peptideSlug: peptideRef?.slug ?? input.peptideSlug ?? null,
      peptideName,
      vialStrengthMg,
      doseMcg,
      bacWaterMl: usedBacMl,
      syringeType: input.syringeType,
      dateMixed: input.dateMixed
        ? new Date(input.dateMixed).toISOString()
        : null,
    },
    recommendedBacMl,
    usedBacMl,
    finalConcentrationMgPerMl: round(finalConcentrationMgPerMl, 4),
    finalConcentrationMcgPerMl: round(finalConcentrationMcgPerMl, 2),
    doseVolumeMl: round(doseVolumeMl, 4),
    syringeUnits: round(syringeUnits, 2),
    syringeReadout,
    dosesPerVial,
    expiration: {
      days,
      date: expDate,
      note: peptideRef?.storageNote ?? "Keep in the fridge.",
    },
    supplies,
    assumptions,
    warnings,
    errors,
    summary,
    instructions,
    secondary: secondaryOutput,
  };
}

export { PEPTIDES, findPeptide };
