import { productDisplayName } from "@/lib/partners/supplier-catalog";
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
import { formatNumeric } from "./format";

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
    description: "Illustration assumes half-unit intervals. Verify the actual device.",
  },
  {
    id: "insulin-0.5ml",
    label: "0.5 mL insulin syringe (50 units)",
    scale: "u100",
    maxVolumeMl: 0.5,
    maxUnits: 50,
    incrementMl: 0.01,
    description: "Illustration assumes one-unit intervals. Verify the actual device.",
  },
  {
    id: "insulin-1ml",
    label: "1 mL insulin syringe (100 units)",
    scale: "u100",
    maxVolumeMl: 1.0,
    maxUnits: 100,
    incrementMl: 0.01,
    description: "Illustration assumes one-unit intervals; actual products may differ.",
  },
  {
    id: "tuberculin-1ml",
    label: "1 mL tuberculin (mL scale)",
    scale: "ml",
    maxVolumeMl: 1.0,
    maxUnits: 0,
    incrementMl: 0.01,
    description: "mL-scale illustration assumes 0.01 mL intervals, not a device recommendation.",
  },
  {
    id: "syringe-3ml",
    label: "3 mL syringe (mL scale)",
    scale: "ml",
    maxVolumeMl: 3.0,
    maxUnits: 0,
    incrementMl: 0.1,
    description: "mL-scale illustration assumes 0.1 mL intervals. Follow actual device instructions.",
  },
];

export function findSyringe(id: SyringeType): SyringeSpec {
  return SYRINGES.find((s) => s.id === id) ?? SYRINGES[2];
}

export interface CalcInput {
  peptideSlug?: string;
  peptideName?: string;
  vialStrengthMg: number;
  /** The TOTAL weekly dose in mcg. It is split across `injectionsPerWeek` draws. */
  doseMcg: number;
  /**
   * How many injections the weekly dose is split across. Defaults to the
   * explicit user input; defaults to 1. No regimen is inferred.
   */
  injectionsPerWeek?: number;
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
  calculationVersion?: "2026-09-21-v2";
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
  /**
   * The weekly-dose split. `doseVolumeMl` / `syringeUnits` above are PER
   * INJECTION. Optional so plans saved before this existed still parse.
   */
  schedule?: {
    injectionsPerWeek: number;
    weeklyDoseMcg: number;
    dosePerInjectionMcg: number;
    /** e.g. "Twice weekly: e.g., Monday and Thursday" */
    label: string;
    halfLifeHours: number | null;
  };
  syringeReadout: {
    kind: "u100" | "ml";
    valueRounded: number;
    exactValue?: number;
    displayLabel: string;
    exceedsSyringe: boolean;
    fillPercent: number;
  };
  dosesPerVial: number;
  expiration: {
    days: number | null;
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
    name: "Bacteriostatic water, 30 mL vial",
    quantity: bacVials,
    reason: `You'll use about ${round(bac, 2)} mL for this vial. This quantity assumes 30 mL containers, without waste or storage constraints. It is not a purchase or handling recommendation.`,
  });

  // Syringes: at least dosesPerVial, plus 1 extra for reconstitution draw
  const injectionSyringes = Math.max(1, Math.ceil(dosesPerVial));
  const syringeName = syringe.label;
  // Report the number you actually USE (one per measurement, plus one to draw
  // the water), not a purchase box. Showing "1 (100 pack)" next to "13
  // measurements per vial" reads as a mismatch. Pack size is context, in the
  // reason. Counts only, the site sells nothing (§9.3.6).
  const syringesUsed = injectionSyringes + 1;
  supplies.push({
    sku:
      syringe.id === "insulin-0.3ml"
        ? "SYR-INS-03"
        : syringe.id === "insulin-0.5ml"
          ? "SYR-INS-05"
          : "SYR-INS-10",
    name: syringeName,
    quantity: syringesUsed,
    reason: `Illustrative count: ${injectionSyringes} measurements plus one preparation device. Confirm the actual supplies and device instructions separately.`,
  });

  const padsUsed = injectionSyringes * 2 + 1;
  supplies.push({
    sku: "ALC-200",
    name: "Alcohol prep pads",
    quantity: padsUsed,
    reason: "Illustrative inventory assumption: two pads per measurement plus one. This is not a preparation checklist or an administration protocol.",
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
  return [
    "Check the product identity, labeled amount, units, and product-specific instructions. A calculator does not establish suitability for use.",
    `This example uses ${formatNumeric(input.vialStrengthMg, 4)} mg and ${formatNumeric(input.bacMl, 4)} mL. Confirm the volume means the final solution volume in your protocol.`,
    `Concentration = amount divided by volume: ${formatNumeric(input.concentrationMgPerMl, 4)} mg/mL.`,
    `The entered amount of ${formatNumeric(input.doseMcg, 4)} mcg corresponds to ${formatNumeric(input.units / 100, 4)} mL. On a U-100 scale only, that volume corresponds to ${formatNumeric(input.units, 4)} units.`,
    "Confirm the actual syringe capacity and graduation spacing. A rounded display is not permission to round a prescribed amount.",
    "Obtain product-specific preparation, administration, storage and discard instructions from the responsible professional or manufacturer. This is a calculation record, not an injection protocol.",
  ];
}

export function calculate(input: CalcInput): CalcResult {
  const assumptions: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  const peptideRef = input.peptideSlug ? findPeptide(input.peptideSlug) : null;
  const peptideName = input.peptideName || (peptideRef ? productDisplayName(peptideRef.slug, peptideRef.name) : null);

  if (!isFiniteNumber(input.vialStrengthMg) || input.vialStrengthMg <= 0)
    errors.push("Vial strength must be greater than 0 mg.");
  if (!isFiniteNumber(input.doseMcg) || input.doseMcg <= 0)
    errors.push("Dose must be greater than 0 mcg.");

  if (input.bacWaterMl !== undefined && (!isFiniteNumber(input.bacWaterMl) || input.bacWaterMl <= 0)) errors.push("Water volume must be a finite number greater than 0 mL.");
  if (input.injectionsPerWeek != null && (!Number.isInteger(input.injectionsPerWeek) || input.injectionsPerWeek < 1 || input.injectionsPerWeek > 28)) errors.push("The number of equal measurements must be a whole number from 1 to 28.");
  if (!SYRINGES.some((s) => s.id === input.syringeType)) errors.push("Select a supported syringe scale.");
  if (input.dateMixed && Number.isNaN(new Date(input.dateMixed).getTime())) errors.push("Enter a valid mixing date.");
  if (input.secondary && (!isFiniteNumber(input.secondary.vialStrengthMg) || input.secondary.vialStrengthMg <= 0)) errors.push("The second vial amount must be greater than 0 mg.");
  for (const [label,value] of [["Vial mass",input.vialStrengthMg],["Entered amount",input.doseMcg],["Final volume",input.bacWaterMl],["Second mass",input.secondary?.vialStrengthMg]] as const) {
    if (value != null && Number.isFinite(value) && (value < 1e-12 || value > 1e12)) errors.push(`${label} is outside this planner's supported range (0.000000000001 to 1,000,000,000,000 in the selected base unit). This is a software limit, not a medically suitable range.`);
  }
  // Invalid states stay finite for rendering, and are never allowed to save.
  const vialStrengthMg = isFiniteNumber(input.vialStrengthMg) && input.vialStrengthMg > 0 ? input.vialStrengthMg : 1;
  // The entered dose is the WEEKLY total; it is split across the peptide's
  // typical injections per week (user-overridable). All draw math below is
  // per injection.
  const weeklyDoseMcg = isFiniteNumber(input.doseMcg) && input.doseMcg > 0 ? input.doseMcg : 1;
  const rawPerWeek =
    isFiniteNumber(input.injectionsPerWeek) && input.injectionsPerWeek! > 0
      ? input.injectionsPerWeek!
      : 1;
  const injectionsPerWeek = Math.min(28, Math.max(1, rawPerWeek));
  const doseMcg = weeklyDoseMcg / injectionsPerWeek;
  const doseMg = doseMcg * MG_PER_MCG;

  // Sanity flags on unusual inputs
  if (vialStrengthMg > 100)
    warnings.push(
      "The entered vial amount is above this tool's 100 mg review threshold. Recheck the value and units; this is not a clinical range."
    );
  if (vialStrengthMg < 0.5)
    warnings.push("The entered vial amount is below this tool's 0.5 mg review threshold. Confirm the units; this is not a clinical range.");
  if (doseMg > vialStrengthMg)
    warnings.push(
      "Your dose is larger than the vial contains. Verify your dose and vial strength."
    );
  // A compound lookup is not a validated dosing range. Check unit identity,
  // not a supposed safe/research dose or an inferred regimen.
  assumptions.push("1 mg equals 1,000 mcg. Confirm the selected mass unit against the original instructions; software cannot detect every unit-entry mistake.");

  const recommendedBacMl = recommendBacWaterMl(vialStrengthMg, doseMcg);
  const usedBacMl = isFiniteNumber(input.bacWaterMl)
    ? input.bacWaterMl! > 0 ? input.bacWaterMl! : 1
    : recommendedBacMl;

  if (usedBacMl > 5)
    warnings.push(
      "The entered volume exceeds this tool's 5 mL review threshold. Check the stated final volume and actual container capacity."
    );
  if (usedBacMl < 0.5)
    warnings.push(
      "The entered volume is below 0.5 mL. Check the stated final volume and actual measurement limits."
    );

  const finalConcentrationMgPerMl = vialStrengthMg / usedBacMl;
  const finalConcentrationMcgPerMl = finalConcentrationMgPerMl * 1000;

  // V-07 (PRD §9.4): flag an implausibly strong solution, usually a sign the
  // vial amount or the water amount was mistyped.
  if (finalConcentrationMgPerMl > 100)
    warnings.push(
      `This makes ${round(finalConcentrationMgPerMl, 1)} mg in every mL, above the 100 mg/mL software review threshold. Check mass and volume units; the threshold does not establish a clinically suitable concentration.`
    );

  const doseVolumeMl = doseMg / finalConcentrationMgPerMl;
  const syringeUnits = doseVolumeMl * 100;
  const portionRatio = vialStrengthMg / doseMg;
  const nearestPortion = Math.round(portionRatio);
  const dosesPerVial = Math.abs(portionRatio - nearestPortion) <= Number.EPSILON * Math.max(1, Math.abs(portionRatio)) * 4 ? nearestPortion : Math.floor(portionRatio);

  const syringe = findSyringe(input.syringeType);
  const exceedsSyringe = doseVolumeMl > syringe.maxVolumeMl + 1e-9;
  if (exceedsSyringe)
    warnings.push(
      `The calculated dose (${formatNumeric(doseVolumeMl, 2)} mL) exceeds the capacity of the selected ${syringe.label}. Resolve the mismatch with the actual device and product instructions. Do not change a preparation based on this result.`
    );

  // V-02 (PRD §9.4): the amount must land on a mark you can actually read.
  // The smallest mark comes from the syringe's own graduation (incrementMl):
  // 1 mL and 0.5 mL U-100 barrels are marked every 1 unit; 0.3 mL barrels every
  // 0.5 unit. A value between marks, like the live 7.5-unit defect, cannot be
  // measured, so we flag it instead of returning an unusable number.
  const markUnits = round(syringe.incrementMl * 100, 3);
  const markLabel = markUnits === 1 ? "1 unit" : `${markUnits} units`;
  if (syringe.scale === "u100" && syringeUnits > 0 && markUnits > 0) {
    const marks = syringeUnits / markUnits;
    const onMark = Math.abs(marks - Math.round(marks)) < 0.02;
    if (!onMark) {
      warnings.push(
        `This calculation assumes a mark every ${markLabel}. Your amount is ${formatNumeric(syringeUnits, 1)} units. That is between two marks in this illustration. Verify the actual graduation and measuring instructions; do not change the water amount to fit the illustration.`
      );
    }
  }

  // V-04 (PRD §9.4): an amount smaller than the smallest mark cannot be
  // measured at all. Below that, flag it rather than return an unusable number.
  if (syringe.scale === "u100" && syringeUnits > 0 && syringeUnits < markUnits)
    warnings.push(
      `This is ${formatNumeric(syringeUnits, 1)} units. The assumed smallest mark is ${markLabel}, so it is too small to measure. More water increases the calculated volume for the same amount. Do not change a preparation without checking its instructions, capacity and actual syringe markings.`
    );
  // Still measurable, but small enough to be hard to read accurately.
  else if (syringe.scale === "u100" && syringeUnits >= markUnits && syringeUnits < 4)
    warnings.push(
      `This amount is only ${formatNumeric(syringeUnits, 1)} units, which is hard to measure accurately. More water gives a larger calculated volume for the same amount. Confirm the product instructions and actual syringe markings before any change.`
    );

  const syringeReadout = {
    kind: syringe.scale,
    exactValue: syringe.scale === "u100" ? syringeUnits : doseVolumeMl,
    valueRounded:
      syringe.scale === "u100" ? round(syringeUnits, 1) : round(doseVolumeMl, 2),
    displayLabel:
      syringe.scale === "u100"
        ? `${formatNumeric(syringeUnits, 1)} units on the ${syringe.label}`
        : `${formatNumeric(doseVolumeMl, 2)} mL on the ${syringe.label}`,
    exceedsSyringe,
    fillPercent: Math.min(
      100,
      Math.max(0, (doseVolumeMl / syringe.maxVolumeMl) * 100)
    ),
  };

  // V-12 (PRD §9.4): be explicit when rounding changed the number we show.
  const shownValue = syringe.scale === "u100" ? round(syringeUnits, 1) : round(doseVolumeMl, 2);
  const exactValue = syringe.scale === "u100" ? syringeUnits : doseVolumeMl;
  if (Math.abs(exactValue - shownValue) > 0.0005) {
    assumptions.push(
      `Rounded from ${round(exactValue, 3)} to ${shownValue} ${syringe.scale === "u100" ? "units" : "mL"} for display.`
    );
  }

  const days = null;
  const expDate = null;
  assumptions.push("No usable shelf life, discard date, storage condition or compatibility can be determined from this arithmetic. Follow the specific product label and qualified professional guidance.");
  assumptions.push("Syringe graduation spacing is an assumption. Verify the markings on the actual device; equal capacity does not guarantee equal graduations.");

  assumptions.push(
    "Concentration is calculated as (total mass in mg) ÷ (final solution volume in mL)."
  );
  assumptions.push(
    "U-100 scale conversions use 100 units = 1 mL. This relationship does not apply to every syringe scale."
  );
  if (injectionsPerWeek > 1) {
    assumptions.push(
      `The dose you entered (${round(weeklyDoseMcg, 1)} mcg) is treated as a weekly total and split into ${injectionsPerWeek} injections of ${formatNumeric(doseMcg, 1)} mcg each. You can change the injections per week.`
    );
  }
  // V-11 (PRD §9.4): compatibility is never assumed, and it is stated every time.
  assumptions.push(
    "We have not checked that this BAC water works with your specific compound. Follow the instructions that came with your product."
  );
  if (!peptideRef) {
    assumptions.push(
      "No specific compound reference selected. How long a mixed vial lasts depends on the compound, so follow the instructions that came with your product."
    );
  }
  if (!isFiniteNumber(input.bacWaterMl)) {
    assumptions.push(
      `An illustrative volume (${recommendedBacMl} mL) was used because no final volume was supplied. This is not a mixing recommendation. Enter the product-specified final volume before saving.`
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
    const secondaryVialMg = input.secondary.vialStrengthMg;
    const secondaryConcentration = secondaryVialMg / usedBacMl;
    const companionDoseMcg = doseVolumeMl * secondaryConcentration * 1000;
    secondaryName =
      input.secondary.peptideName || (secondaryRef ? productDisplayName(secondaryRef.slug, secondaryRef.name) : "Secondary peptide");
    secondaryOutput = {
      peptideName: secondaryName,
      vialStrengthMg: secondaryVialMg,
      concentrationMgPerMl: secondaryConcentration,
      companionDoseMcg,
    };

    assumptions.push(
      `Blend detected: every draw delivers both peptides in proportion. Companion ${secondaryName} dose = ${formatNumeric(companionDoseMcg, 1)} mcg per injection.`
    );
  }

  const displayName = secondaryName
    ? `${peptideName || "peptide"} + ${secondaryName}`
    : peptideName || "peptide";

  const summary =
    `Calculation: ${vialStrengthMg} mg of ${displayName} in ${formatNumeric(usedBacMl, 2)} mL. ` +
    (injectionsPerWeek > 1
      ? `Your ${round(weeklyDoseMcg, 1)} mcg weekly total splits into ${injectionsPerWeek} injections. `
      : "") +
    `Each ${formatNumeric(doseMcg, 1)} mcg dose is ${formatNumeric(doseVolumeMl, 3)} mL, ` +
    (syringe.scale === "u100"
      ? `${formatNumeric(syringeUnits, 1)} units on your ${syringe.label}.`
      : `${formatNumeric(doseVolumeMl, 2)} mL on your ${syringe.label}.`) +
    ` You'll get about ${dosesPerVial} dose${dosesPerVial === 1 ? "" : "s"} per vial.` +
    (secondaryOutput
      ? ` Each draw also delivers ${formatNumeric(secondaryOutput.companionDoseMcg, 1)} mcg of ${secondaryOutput.peptideName}.`
      : "");

  if (![finalConcentrationMgPerMl, finalConcentrationMcgPerMl, doseVolumeMl, syringeUnits, dosesPerVial, ...(secondaryOutput ? [secondaryOutput.vialStrengthMg, secondaryOutput.concentrationMgPerMl, secondaryOutput.companionDoseMcg] : [])].every(Number.isFinite) || finalConcentrationMgPerMl <= 0 || doseVolumeMl <= 0 || dosesPerVial > 10000000) {
    const fallback = calculate({ vialStrengthMg: 1, doseMcg: 1, bacWaterMl: 1, syringeType: "insulin-1ml" });
    return { ...fallback, errors: [...errors, "These values exceed the supported numeric range. Check the units and amounts."], summary: "Correct the input values before using or saving a calculation.", instructions: [] };
  }
  return {
    calculationVersion: "2026-09-21-v2",
    input: {
      peptideSlug: peptideRef?.slug ?? input.peptideSlug ?? null,
      peptideName,
      vialStrengthMg,
      doseMcg: weeklyDoseMcg,
      injectionsPerWeek,
      bacWaterMl: usedBacMl,
      syringeType: input.syringeType,
      dateMixed: input.dateMixed && !Number.isNaN(new Date(input.dateMixed).getTime())
        ? new Date(input.dateMixed).toISOString()
        : null,
    },
    recommendedBacMl,
    usedBacMl,
    finalConcentrationMgPerMl,
    finalConcentrationMcgPerMl,
    doseVolumeMl,
    syringeUnits,
    schedule: {
      injectionsPerWeek,
      weeklyDoseMcg,
      dosePerInjectionMcg: doseMcg,
      label: `${injectionsPerWeek} equal measurement${injectionsPerWeek === 1 ? "" : "s"} (your input, not a recommended schedule)`,
      halfLifeHours: null,
    },
    syringeReadout,
    dosesPerVial,
    expiration: {
      days,
      date: expDate,
      note: "Not determined. Follow the specific product instructions; a calculation cannot establish stability or a safe discard date.",
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
