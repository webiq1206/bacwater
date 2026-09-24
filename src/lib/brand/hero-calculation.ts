import { positiveDecimal } from "@/lib/calc/number-text";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";
import { quickCalculation, type QuickMode, type QuickValues } from "./quick-calculation";

export type HeroValues = QuickValues & { target: string; targetUnit: MassUnit };
export const EMPTY_HERO: HeroValues = { amount: "", volume: "", mass: "", units: "", target: "", targetUnit: "mcg" };
export const HERO_DRAFT_KEY = "bacwater.heroDraft.v1";
export function displayHeroNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 9, useGrouping: false,
    notation: value > 0 && (value < 0.000001 || value >= 1e9) ? "scientific" : "standard" }).format(value);
}
/** Only the visitor's entered values are used. No dilution or dose is selected. */
export function heroMeasurement(v: HeroValues) {
  if (!v.target.trim()) return { kind: "empty" as const };
  const amount = positiveDecimal(v.amount), volume = positiveDecimal(v.volume), target = positiveDecimal(v.target);
  if (amount === null || volume === null) return { kind: "empty" as const };
  if (target === null || !["mg", "mcg"].includes(v.targetUnit)) return { kind: "error" as const, message: "Use a positive number for the amount to measure." };
  const targetMg = v.targetUnit === "mcg" ? target / 1000 : target;
  const ml = targetMg / (amount / volume);
  return { kind: "value" as const, ml: displayHeroNumber(ml), units: displayHeroNumber(ml * 100),
    formula: `${displayHeroNumber(targetMg)} mg ÷ (${displayHeroNumber(amount)} mg ÷ ${displayHeroNumber(volume)} mL) = ${displayHeroNumber(ml)} mL`,
    warning: targetMg > amount ? "This amount is greater than the total amount in the vial. Check your entries." : ml > 1 ? "This volume is greater than 1 mL. Check the actual device capacity." : "" };
}
export function heroResult(mode: QuickMode, values: HeroValues) { return quickCalculation(mode, values); }
/** Changing a unit preserves the entered mass instead of silently changing it 1,000-fold. */
export function changeTargetUnit(v: HeroValues, unit: MassUnit): HeroValues {
  const converted = convertMassText(v.target, v.targetUnit);
  return { ...v, targetUnit: unit, target: converted.kind === "value" ? converted[unit] : v.target };
}
/** Session drafts are untrusted input. Accept only bounded text and known discriminators. */
export function parseHeroDraft(raw: string | null): { mode: QuickMode; values: HeroValues } | null {
  if (!raw || raw.length > 2048) return null;
  try {
    const d = JSON.parse(raw);
    if (!d || !["concentration", "mass", "units"].includes(d.mode) || !d.values) return null;
    const v = d.values;
    if (!["mg", "mcg"].includes(v.targetUnit)) return null;
    const values = { ...EMPTY_HERO, targetUnit: v.targetUnit as MassUnit };
    for (const key of ["amount", "volume", "mass", "units", "target"] as const) {
      if (typeof v[key] !== "string" || v[key].length > 64) return null;
      values[key] = v[key];
    }
    return { mode: d.mode, values };
  } catch { return null; }
}
