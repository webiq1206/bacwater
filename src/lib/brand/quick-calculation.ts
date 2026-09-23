import { positiveDecimal } from "@/lib/calc/number-text";
import { convertMassText } from "@/lib/calc/mass-text";

export type QuickMode = "concentration" | "mass" | "units";
export type QuickValues = { amount: string; volume: string; mass: string; units: string };
export const QUICK_EXAMPLE: QuickValues = { amount: "12", volume: "4", mass: "0.125", units: "25" };
export type QuickResult = { value: string; unit: string; formula: string; label: string };
/** Numeric display has bounded length and never rounds a positive result to zero. */
function readable(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 9, useGrouping: false,
    notation: n < 0.000001 || n >= 1e9 ? "scientific" : "standard" }).format(n);
}
export function quickCalculation(mode: QuickMode, v: QuickValues): QuickResult | null {
  if (mode === "mass") {
    const r = convertMassText(v.mass, "mg");
    if (r.kind !== "value") return null;
    return { value: r.mcg, unit: "mcg", formula: `${r.mg} mg × 1,000 = ${r.mcg} mcg`, label: "Converted mass" };
  }
  if (mode === "units") {
    const units = positiveDecimal(v.units);
    if (units === null) return null;
    const value = readable(units / 100);
    return { value, unit: "mL", formula: `${readable(units)} U-100 units ÷ 100 = ${value} mL`, label: "Liquid volume" };
  }
  const amount = positiveDecimal(v.amount), volume = positiveDecimal(v.volume);
  if (amount === null || volume === null) return null;
  const value = readable(amount / volume);
  return { value, unit: "mg/mL", formula: `${readable(amount)} mg ÷ ${readable(volume)} mL = ${value} mg/mL`, label: "Concentration" };
}
