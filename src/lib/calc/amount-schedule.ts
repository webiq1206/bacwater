import type { AmountBasis } from "@/lib/session/calculation-session";
import { positiveDecimal } from "./number-text";
import { convertMassText, type MassUnit } from "./mass-text";
export interface AmountSchedule { amount: string; amountUnit: MassUnit; basis: AmountBasis; timesPerWeek: string }
export function amountSchedule(s: AmountSchedule) {
  const empty = { ready:false as const, eachMcg:0, weeklyMcg:0, count:1, scheduled:false, message:"Enter the amount from your instructions." };
  const parsed = positiveDecimal(s.amount);
  if (parsed === null) return { ...empty, message:s.amount.trim() ? "Use a number greater than zero. Copy the unit from your instructions too." : empty.message };
  const converted = convertMassText(s.amount, s.amountUnit);
  if (converted.kind !== "value") return empty;
  const mcg = Number(converted.mcg);
  const hasCount = s.timesPerWeek.trim() !== "";
  const count = /^[1-9]\d?$/.test(s.timesPerWeek) ? Number(s.timesPerWeek) : 0;
  if (hasCount && (!count || count > 28)) return { ...empty, message:"Enter a whole number from 1 to 28 times in a week." };
  if (s.basis !== "each" && !hasCount) return { ...empty, message:"Choose how often first. We need that to split a daily or weekly total." };
  if (s.basis === "day" && count % 7 !== 0) return { ...empty, message:"A whole-day total needs a daily schedule. Choose every day, twice a day, or another whole number of times each day." };
  const n = hasCount ? count : 1;
  const each = s.basis === "week" ? mcg / n : s.basis === "day" ? mcg / (n / 7) : mcg;
  const weekly = each * n;
  if (![mcg,each,weekly].every(v => Number.isFinite(v) && v > 0 && v <= 1e15)) return { ...empty, message:"These numbers are too large or too small. Check the amount and unit." };
  return { ready:true as const, eachMcg:each, weeklyMcg:weekly, count:n, scheduled:hasCount, message:"" };
}
export function scheduleNumber(n: number) { return new Intl.NumberFormat("en-US", { maximumSignificantDigits:10, useGrouping:false }).format(n); }
export function eachAmountText(s: AmountSchedule, unit: MassUnit = "mcg") {
  const result = amountSchedule(s);
  return result.ready ? scheduleNumber(result.eachMcg / (unit === "mg" ? 1000 : 1)) : "";
}
