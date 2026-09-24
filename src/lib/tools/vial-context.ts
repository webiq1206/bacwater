"use client";
import { useMassSession, clearMassSession, massText } from "@/lib/calculator-session";
import { resolveAmountSchedule, amountText } from "@/lib/calc/amount-schedule";
export type MassUnit = "mg" | "mcg";
export interface StoredVial { peptideSlug: string; vialInput: number; vialUnit: MassUnit; doseInput: number; doseUnit: MassUnit }
export function vialMgOf(v: Pick<StoredVial, "vialInput" | "vialUnit">) { return v.vialUnit === "mg" ? v.vialInput : v.vialInput / 1000; }
export function doseMcgOf(v: Pick<StoredVial, "doseInput" | "doseUnit">) { return v.doseUnit === "mcg" ? v.doseInput : Math.round(v.doseInput * 100000) / 100; }
/** Legacy tool interface, now backed by the same tab-session draft as the hero and planner. */
export function useVialContext() {
  const [draft, patch] = useMassSession();
  const schedule = resolveAmountSchedule(draft);
  return {
    peptideSlug: draft.peptideSlug, vialInput: Number(draft.total), vialUnit: draft.totalUnit,
    doseInput: schedule.ready ? Number(amountText(schedule.eachMcg, draft.amountUnit)) : 0, doseUnit: draft.amountUnit,
    vialMg: Number(massText(draft.total, draft.totalUnit, "mg")), doseMcg: schedule.ready ? schedule.eachMcg : 0,
    setPeptideSlug: (peptideSlug: string) => patch({ peptideSlug }),
    setVialInput: (n: number) => patch({ total: n ? String(n) : "" }),
    setVialUnit: (u: MassUnit) => patch({ total: massText(draft.total, draft.totalUnit, u), totalUnit: u }),
    setVialMg: (n: number) => patch({ total: n ? String(n) : "", totalUnit: "mg" }),
    setDoseInput: (n: number) => patch({ amount: n ? String(n) : "", basis: "each" }),
    setDoseUnit: (u: MassUnit) => patch({ amount: massText(draft.amount, draft.amountUnit, u), amountUnit: u }),
    carriedOver: !!(draft.total || draft.volume || draft.amount), clear: clearMassSession, hydrated: true,
  };
}
