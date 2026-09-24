import { positiveDecimal } from "./number-text";
import { type AmountBasis } from "../calculator-session";
export type AmountEntry = { amount: string; unit: "mg" | "mcg"; basis: AmountBasis; frequency: number | null };
export function amountSchedule(entry: AmountEntry) {
  if (!entry.amount.trim()) return { kind: "empty" as const };
  const n = positiveDecimal(entry.amount);
  if (n === null) return { kind: "error" as const, message: "Enter a positive number from your instructions." };
  if (entry.frequency !== null && (!Number.isInteger(entry.frequency) || entry.frequency < 1 || entry.frequency > 28)) return { kind: "error" as const, message: "Enter a whole number from 1 to 28 times per week." };
  if (entry.basis === "week" && entry.frequency === null) return { kind: "error" as const, message: "Choose how many times per week to split the weekly total." };
  const enteredMcg = entry.unit === "mg" ? n * 1000 : n;
  const eachMcg = entry.basis === "week" ? enteredMcg / entry.frequency! : enteredMcg;
  const weeklyMcg = entry.frequency === null ? null : eachMcg * entry.frequency;
  if (![enteredMcg, eachMcg, weeklyMcg ?? 1].every(v => Number.isFinite(v) && v > 0)) return { kind: "error" as const, message: "These numbers are outside the supported range. Check the amount and unit." };
  return { kind: "value" as const, enteredMcg, eachMcg, weeklyMcg, frequency: entry.frequency };
}
export function scheduleLabel(frequency: number | null) {
  return frequency === null ? "No schedule chosen" : frequency === 7 ? "Once a day" : frequency === 14 ? "Twice a day" : frequency === 1 ? "Once a week" : frequency === 2 ? "Twice a week" : `${frequency} times a week`;
}
export function scheduleNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 9, useGrouping: false,
    notation: value > 0 && (value < 0.000001 || value >= 1e9) ? "scientific" : "standard" }).format(value);
}

/** Carry the amount's meaning when a result is copied out of the interface. */
export function amountScheduleText(entry: AmountEntry): string {
  const result = amountSchedule(entry);
  if (result.kind !== "value") return "";
  const divisor = entry.unit === "mg" ? 1000 : 1;
  const each = `${scheduleNumber(result.eachMcg / divisor)} ${entry.unit} each time`;
  return result.frequency === null ? `${each}. No schedule chosen.`
    : `${each}; ${scheduleLabel(result.frequency).toLowerCase()}; ${scheduleNumber(result.weeklyMcg! / divisor)} ${entry.unit} for the whole week.`;
}
