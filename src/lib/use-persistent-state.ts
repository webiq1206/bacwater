"use client";
import { useCallback, useRef, type SetStateAction } from "react";
import { useCalculatorSession } from "./use-calculator-session";
import { massText, patchMassDraft, readCalculatorSession, writeSessionTool, sessionToolValue } from "./calculator-session";
import { amountSchedule } from "./calc/amount-schedule";
// Share only fields whose units and meaning are known. Bottle sizes, sample
// volumes, blend ingredients and product activity IU keep separate records.
const totals = new Set(["bacwater.tool.reverse.mass.v2", "bacwater.tool.inventory.mass.v2"]);
const amounts = new Set(["bacwater.tool.reverse.amount.v2", "bacwater.tool.inventory.amount.v2"]);
const volumes = new Set(["bacwater.tool.bacwater.volume.v2", "bacwater.tool.inventory.volume.v2"]);
function read<T>(key: string, initial: T, state = readCalculatorSession()): T {
  const { mass: d, tools } = state;
  if (totals.has(key)) return massText(d.vial, d.vialUnit, "mg") as T;
  if (volumes.has(key)) return d.volume as T;
  if (amounts.has(key)) {
    const amount = amountSchedule({ amount: d.amount, unit: d.amountUnit, basis: d.basis, frequency: d.frequency });
    return (amount.kind === "value" ? String(amount.eachMcg) : "") as T;
  }
  return sessionToolValue(tools[key], initial);
}
/** Tab-scoped, synchronous persistence with an in-memory fallback. */
export function usePersistentState<T>(key: string, initial: T) {
  const state = useCalculatorSession(), first = useRef(initial);
  // Subscription supplies hydration and same-tab updates, not an effect that
  // could overwrite a new product's draft with the previous product's value.
  const value = read(key, first.current, state);
  const set = useCallback((update: SetStateAction<T>) => {
    const next = typeof update === "function" ? (update as (v: T) => T)(read(key, first.current)) : update;
    if (totals.has(key)) patchMassDraft({ vial: String(next), vialUnit: "mg" });
    else if (volumes.has(key)) patchMassDraft({ volume: String(next) });
    else if (amounts.has(key)) patchMassDraft({ amount: String(next), amountUnit: "mcg", basis: "each" });
    else writeSessionTool(key, next, first.current);
  }, [key]);
  return [value, set] as const;
}
