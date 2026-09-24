import { positiveDecimal } from "./number-text";
import { convertMassText, type MassUnit } from "./mass-text";
import { formatNumeric } from "./format";

export interface AmountSchedule { amount: string; amountUnit: MassUnit; basis: "each" | "week"; frequency: string }
export const FREQUENCIES = [
  { value: "1", label: "Once a week" }, { value: "2", label: "Twice a week" },
  { value: "3", label: "3 times a week" }, { value: "7", label: "Once a day" },
  { value: "14", label: "Twice a day" },
] as const;
export function frequencyCount(text: string): number | null {
  return /^[1-9]\d?$/.test(text) && Number(text) <= 28 ? Number(text) : null;
}
export function frequencyLabel(text: string): string {
  return FREQUENCIES.find(f => f.value === text)?.label || (frequencyCount(text) ? `${text} times a week` : "No schedule entered");
}
export function resolveAmountSchedule(value: AmountSchedule) {
  const amount = positiveDecimal(value.amount);
  const count = frequencyCount(value.frequency);
  const missing = !value.amount.trim();
  const error = missing ? "Enter the amount from your instructions." : amount === null ? "Use a number greater than zero. Use a decimal point, not commas." : value.frequency && !count ? "Enter a whole number from 1 to 28 times per week." : value.basis === "week" && !count ? "Choose how many times the weekly total is split." : "";
  if (error || amount === null) return { ready: false as const, error, eachMcg: 0, weeklyMcg: null, count, normalizedTotalMcg: 0 };
  const mcg = value.amountUnit === "mg" ? amount * 1000 : amount;
  const each = value.basis === "week" ? mcg / count! : mcg;
  const weekly = count ? each * count : null;
  if (![each, weekly ?? each].every(n => Number.isFinite(n) && n > 0 && n <= 1e12)) return { ready: false as const, error: "These numbers are outside the supported range. Check the amount and unit.", eachMcg: 0, weeklyMcg: null, count, normalizedTotalMcg: 0 };
  return { ready: true as const, error: "", eachMcg: each, weeklyMcg: weekly, count, normalizedTotalMcg: weekly ?? each };
}
export function amountText(mcg: number, unit: MassUnit) { return formatNumeric(unit === "mg" ? mcg / 1000 : mcg, 9); }
/** A time-basis switch preserves each-time mass when the entered schedule makes it known. */
export function switchAmountBasis(value: AmountSchedule, basis: AmountSchedule["basis"]): AmountSchedule {
  if (value.basis === basis) return value;
  const resolved = resolveAmountSchedule(value);
  return { ...value, basis, amount: resolved.ready && resolved.count ? amountText(basis === "week" ? resolved.weeklyMcg! : resolved.eachMcg, value.amountUnit) : "" };
}
export function switchAmountUnit(value: AmountSchedule, unit: MassUnit): AmountSchedule {
  const converted = convertMassText(value.amount, value.amountUnit);
  return { ...value, amountUnit: unit, amount: converted.kind === "value" ? converted[unit] : value.amount };
}
