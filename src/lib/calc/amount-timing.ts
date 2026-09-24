import { positiveDecimal } from "./number-text";
import { convertMassText, type MassUnit } from "./mass-text";
export type AmountBasis = "" | "each" | "week";
export interface AmountTiming { amount: string; amountUnit: MassUnit; basis: AmountBasis; frequency: string }
export const EMPTY_TIMING: AmountTiming = { amount: "", amountUnit: "mg", basis: "", frequency: "" };
export const TIMING_CHOICES = [{ value: "1", label: "Once a week" }, { value: "2", label: "Twice a week" }, { value: "7", label: "Once a day" }, { value: "14", label: "Twice a day" }] as const;
export const showNumber = (n: number) => new Intl.NumberFormat("en-US", { maximumSignificantDigits: 9, useGrouping: false, notation: n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e9) ? "scientific" : "standard" }).format(n);
export function readTiming(raw: unknown): AmountTiming {
  const r = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  return { amount: (r.amountUnit === undefined || r.amountUnit === "mg" || r.amountUnit === "mcg") && typeof r.amount === "string" ? r.amount.slice(0,64) : "", amountUnit: r.amountUnit === "mcg" ? "mcg" : "mg", basis: r.basis === "each" || r.basis === "week" ? r.basis : "", frequency: typeof r.frequency === "string" ? r.frequency.slice(0,5) : "" };
}
export function switchAmountUnit(v: AmountTiming, unit: MassUnit): AmountTiming {
  const mass = convertMassText(v.amount, v.amountUnit);
  return { ...v, amountUnit: unit, amount: mass.kind === "value" ? mass[unit] : v.amount };
}
/** Timing is entered by the visitor, never selected from a product or medical lookup. */
export function amountTiming(v: AmountTiming) {
  const need = (message: string) => ({ kind: "incomplete" as const, message });
  if (!v.basis) return need('Choose "Each time" or "Whole week" so we know what your amount means.');
  const amount = positiveDecimal(v.amount);
  if (amount === null) return need(v.amount.trim() ? "Enter a positive number for the amount. Check the unit too." : "Copy the amount from your instructions. We cannot choose it for you.");
  if (!["mg", "mcg"].includes(v.amountUnit)) return need("Choose mg or mcg.");
  const count = v.frequency === "" ? null : /^[1-9]\d?$/.test(v.frequency) && Number(v.frequency) <= 28 ? Number(v.frequency) : NaN;
  if (Number.isNaN(count)) return need("Enter a whole number from 1 to 28 uses per week. This is a calculator limit, not a schedule suggestion.");
  if (v.basis === "week" && count === null) return need("How many times in the week? We need that number to split your weekly total.");
  const mg = v.amountUnit === "mcg" ? amount / 1000 : amount;
  const perUseMg = v.basis === "week" ? mg / count! : mg;
  const weeklyMg = count === null ? null : perUseMg * count;
  if (![perUseMg, perUseMg * 1000, weeklyMg ?? perUseMg].every(n => Number.isFinite(n) && n > 0 && n <= 1e12)) return need("These numbers are outside the calculator's range. Check the amounts and units.");
  const perInEnteredUnit = v.amountUnit === "mcg" ? perUseMg * 1000 : perUseMg;
  const weeklyInEnteredUnit = weeklyMg === null ? null : v.amountUnit === "mcg" ? weeklyMg * 1000 : weeklyMg;
  const explanation = v.basis === "week"
    ? `${showNumber(amount)} ${v.amountUnit} for the week ÷ ${count} use${count === 1 ? "" : "s"} = ${showNumber(perInEnteredUnit)} ${v.amountUnit} each time.`
    : count === null ? `${showNumber(amount)} ${v.amountUnit} for one use. No weekly schedule added.`
    : `${showNumber(amount)} ${v.amountUnit} each time × ${count} use${count === 1 ? "" : "s"} a week = ${showNumber(weeklyInEnteredUnit!)} ${v.amountUnit} for the week.`;
  return { kind: "value" as const, perUseMg, perUseMcg: perUseMg * 1000, weeklyMg, timesPerWeek: count, explanation,
    // Existing saved-plan schema stores a weekly total and an equal-use count.
    legacyTotalMcg: (weeklyMg ?? perUseMg) * 1000, legacyCount: count ?? 1 };
}
