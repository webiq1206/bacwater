"use client";
import { useSyncExternalStore, type SetStateAction } from "react";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";

export type AmountBasis = "each" | "day" | "week";
export interface SharedCalculation {
  productId: string;
  peptideSlug: string;
  customName: string;
  kind: "single" | "blend" | "spray" | "water" | "iu";
  vialInput: string;
  vialUnit: MassUnit;
  finalVolume: string;
  amount: string;
  amountUnit: MassUnit;
  basis: AmountBasis;
  timesPerWeek: string;
  carried: boolean;
}
export const SESSION_KEY = "bacwater.calculationSession.v1";
export const EMPTY_CALCULATION: SharedCalculation = {
  productId: "", peptideSlug: "", customName: "", kind: "single",
  vialInput: "", vialUnit: "mg", finalVolume: "", amount: "", amountUnit: "mg",
  basis: "each", timesPerWeek: "", carried: false,
};
interface SessionData { version: 1; shared: SharedCalculation; drafts: Record<string, unknown> }
const EMPTY_SESSION: SessionData = { version: 1, shared: EMPTY_CALCULATION, drafts: {} };
const listeners = new Set<() => void>();
let current = EMPTY_SESSION;
let loaded = false;
let persistent = true;
const bounded = (v: unknown, max = 64) => typeof v === "string" && v.length <= max ? v : "";
export function sanitizeShared(raw: unknown): SharedCalculation {
  const r = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  if (r.kind !== undefined && !["single", "blend", "spray", "water", "iu"].includes(String(r.kind))) return { ...EMPTY_CALCULATION };
  const validVialUnit = r.vialUnit === undefined || r.vialUnit === "mg" || r.vialUnit === "mcg";
  const validAmountUnit = r.amountUnit === undefined || r.amountUnit === "mg" || r.amountUnit === "mcg";
  const validBasis = r.basis === undefined || ["each", "day", "week"].includes(String(r.basis));
  return {
    productId: bounded(r.productId, 100), peptideSlug: bounded(r.peptideSlug, 100), customName: bounded(r.customName, 100),
    kind: ["single", "blend", "spray", "water", "iu"].includes(String(r.kind)) ? r.kind as SharedCalculation["kind"] : "single",
    vialInput: validVialUnit ? bounded(r.vialInput) : "", vialUnit: r.vialUnit === "mcg" ? "mcg" : "mg", finalVolume: bounded(r.finalVolume),
    amount: validAmountUnit && validBasis ? bounded(r.amount) : "", amountUnit: r.amountUnit === "mcg" ? "mcg" : "mg",
    basis: r.basis === "week" || r.basis === "day" ? r.basis : "each", timesPerWeek: bounded(r.timesPerWeek, 3), carried: r.carried === true,
  };
}
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  current = { ...EMPTY_SESSION, shared:{...EMPTY_CALCULATION}, drafts:{} };
  let text: string | null = null;
  try { text=window.sessionStorage.getItem(SESSION_KEY); } catch { persistent=false;return; }
  try {
    if (text) {
      if (text.length > 250000) return;
      const value = JSON.parse(text);
      if (value?.version === 1) current = { version: 1, shared: sanitizeShared(value.shared), drafts: value.drafts && typeof value.drafts === "object" && !Array.isArray(value.drafts) ? value.drafts : {} };
      return;
    }
  } catch { return; } // Corrupt data is not evidence that browser storage is disabled.
  let old: string | null = null;
  try { old=window.sessionStorage.getItem("bacwater.heroDraft.v1"); } catch { persistent=false;return; }
  try {
    // Only a same-tab draft is eligible. Device-wide drafts never seed a new session.
    if (old && old.length <= 2048) {
      const h = JSON.parse(old)?.values;
      if (h && typeof h === "object") current = { ...EMPTY_SESSION,
        drafts:{"hero-measurement-open":!!h.target},
        shared:sanitizeShared({...EMPTY_CALCULATION,vialInput:h.amount,finalVolume:h.volume,amount:h.target,amountUnit:h.targetUnit,carried:true}) };
    }
  } catch { /* Ignore an invalid legacy draft. */ }
}
function emit(next: SessionData) {
  current = next;
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); }
  catch { persistent = false; }
  listeners.forEach(fn => fn());
}
export function readCalculation(): SharedCalculation { load(); return current.shared; }
export function patchCalculation(patch: Partial<SharedCalculation>) {
  load();
  emit({ ...current, shared: sanitizeShared({ ...current.shared, ...patch }) });
}
export function setMassUnit(field: "vial" | "amount", unit: MassUnit) {
  const s = readCalculation(), value = field === "vial" ? s.vialInput : s.amount, previous = field === "vial" ? s.vialUnit : s.amountUnit;
  if (previous === unit) return;
  const converted = convertMassText(value, previous);
  if (value.trim() && (converted.kind !== "value" || converted[unit].length > 64)) return; // Never relabel an invalid value as a different mass.
  patchCalculation(field === "vial" ? { vialInput: converted.kind === "value" ? converted[unit] : "", vialUnit: unit } : { amount: converted.kind === "value" ? converted[unit] : "", amountUnit: unit });
}
export function chooseCalculationProduct(productId: string, kind: SharedCalculation["kind"], peptideSlug = "") {
  const prior = readCalculation();
  if (prior.productId === productId && prior.kind === kind && prior.peptideSlug === peptideSlug) return;
  // Mass-based tools share values. IU, mixtures, water and ready-made solutions
  // have different meanings and must never inherit a single compound's dose.
  const compatible = prior.kind === "single" && kind === "single";
  const drafts: Record<string, unknown> = { ...current.drafts, [`context:${prior.kind}:${prior.productId}`]: prior };
  if (prior.kind === "single") drafts["context:last-single"] = prior;
  const remembered = drafts[`context:${kind}:${productId}`];
  const next = compatible ? prior : remembered ? sanitizeShared(remembered) : EMPTY_CALCULATION;
  emit({ ...current, drafts, shared:sanitizeShared({ ...next, productId, kind, peptideSlug, customName:"", carried:!!(next.vialInput || next.finalVolume || next.amount) }) });
}
/** Generic mass tools resume the last mass calculation, not a water/solution/IU form. */
export function resumeMassCalculation() {
  const prior=readCalculation();
  if (prior.kind === "single") return;
  const remembered=current.drafts["context:last-single"];
  const next=remembered ? sanitizeShared(remembered) : { ...EMPTY_CALCULATION };
  emit({ ...current, shared: { ...next, kind:"single", carried:!!(next.vialInput || next.finalVolume || next.amount) } });
}
export function clearCalculation() {
  load();
  emit({ version: 1, shared: { ...EMPTY_CALCULATION, productId: current.shared.productId, peptideSlug: current.shared.peptideSlug, kind: current.shared.kind }, drafts: Object.fromEntries(Object.entries(current.drafts).filter(([key])=>!key.startsWith("context:")&&!key.startsWith("plan-")&&key!=="hero-measurement-open")) });
  try { window.sessionStorage.removeItem("bacwater.heroDraft.v1"); } catch {}
}
function subscribe(callback: () => void) { listeners.add(callback); return () => { listeners.delete(callback); }; }
function snapshot() { load(); return current; }
export function useCalculationSession() {
  const data = useSyncExternalStore(subscribe, snapshot, () => EMPTY_SESSION);
  return { ...data.shared, ready: loaded, persistent, patch: patchCalculation, clear: clearCalculation };
}
/** Synchronous writes survive immediate navigation; updater functions use the latest value. */
export function useSessionDraft<T>(key: string, initial: T) {
  const data = useSyncExternalStore(subscribe, snapshot, () => EMPTY_SESSION);
  const valid=(candidate:unknown):candidate is T=>candidate!==null && typeof candidate===typeof initial && Array.isArray(candidate)===Array.isArray(initial) && (typeof candidate!=="number"||Number.isFinite(candidate));
  const value = Object.prototype.hasOwnProperty.call(data.drafts, key) && valid(data.drafts[key]) ? data.drafts[key] as T : initial;
  function set(value: SetStateAction<T>) {
    load();
    const previous = Object.prototype.hasOwnProperty.call(current.drafts, key) && valid(current.drafts[key]) ? current.drafts[key] as T : initial;
    const next = typeof value === "function" ? (value as (v:T)=>T)(previous) : value;
    emit({ ...current, drafts: { ...current.drafts, [key]: next } });
  }
  return [value, set] as const;
}
export function useSharedText(key: "vialInput" | "finalVolume" | "amount") {
  const state = useCalculationSession();
  return [state[key], (value: SetStateAction<string>) => patchCalculation({ [key]: typeof value === "function" ? value(readCalculation()[key]) : value })] as const;
}
