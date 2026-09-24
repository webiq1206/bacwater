"use client";
import { useEffect, useState } from "react";
import { useMassDraft } from "@/lib/use-calculator-session";
import { massText, clearMassNumbers } from "@/lib/calculator-session";
import { positiveDecimal } from "@/lib/calc/number-text";
import { amountSchedule } from "@/lib/calc/amount-schedule";
export type MassUnit = "mg" | "mcg";
export interface StoredVial { peptideSlug: string; vialInput: number; vialUnit: MassUnit; doseInput: number; doseUnit: MassUnit }
export function vialMgOf(v: Pick<StoredVial, "vialInput" | "vialUnit">): number { return v.vialUnit === "mg" ? v.vialInput : v.vialInput / 1000; }
export function doseMcgOf(v: Pick<StoredVial, "doseInput" | "doseUnit">): number { return v.doseUnit === "mcg" ? v.doseInput : Number((v.doseInput * 1000).toPrecision(15)); }
export function useVialContext() {
  const [d, patch] = useMassDraft(), [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const amount = amountSchedule({ amount: d.amount, unit: d.amountUnit, basis: d.basis, frequency: d.frequency });
  const doseMcg = amount.kind === "value" ? amount.eachMcg : amount.kind === "error" ? NaN : 0;
  const vialInput = d.vial.trim() === "" ? 0 : positiveDecimal(d.vial) ?? NaN;
  return {
    peptideSlug: d.peptideSlug, vialInput, vialUnit: d.vialUnit,
    doseInput: doseMcg / (d.amountUnit === "mg" ? 1000 : 1), doseUnit: d.amountUnit,
    vialMg: d.vialUnit === "mg" ? vialInput : vialInput / 1000, doseMcg,
    setPeptideSlug: (peptideSlug: string) => patch({ peptideSlug }),
    setVialInput: (n: number) => patch({ vial: n ? String(n) : "" }),
    setVialUnit: (unit: MassUnit) => patch({ vial: massText(d.vial, d.vialUnit, unit), vialUnit: unit }),
    setVialMg: (n: number) => patch({ vial: n ? String(n) : "", vialUnit: "mg" }),
    setDoseInput: (n: number) => patch({ amount: n ? String(n) : "", basis: "each" }),
    setDoseUnit: (unit: MassUnit) => patch({ amount: massText(d.amount, d.amountUnit, unit), amountUnit: unit }),
    carriedOver: Boolean(d.vial || d.amount || d.volume), clear: clearMassNumbers, hydrated,
  };
}
