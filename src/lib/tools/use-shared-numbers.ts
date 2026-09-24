"use client";
import { useMassSession, massText, clearMassSession } from "@/lib/calculator-session";
import { resolveAmountSchedule, amountText } from "@/lib/calc/amount-schedule";
import { positiveDecimal } from "@/lib/calc/number-text";
/** Only quantities with the same meaning are shared. Derived outputs never replace an actual final volume. */
export function useSharedNumbers() {
  const [draft, patch] = useMassSession();
  const schedule = resolveAmountSchedule(draft), total = massText(draft.total, draft.totalUnit, "mg");
  const mass = positiveDecimal(total), volume = positiveDecimal(draft.volume);
  return {
    mass: total, amount: schedule.ready ? amountText(schedule.eachMcg, "mcg") : "", volume: draft.volume,
    concentration: mass && volume ? String(mass / volume) : "",
    measurementMl: schedule.ready && mass && volume ? String(schedule.eachMcg / 1000 / (mass / volume)) : "",
    setMass: (total: string) => patch({ total, totalUnit: "mg" }),
    setAmount: (amount: string) => patch({ amount, amountUnit: "mcg", basis: "each" }),
    setVolume: (volume: string) => patch({ volume }), clear: clearMassSession,
  };
}
