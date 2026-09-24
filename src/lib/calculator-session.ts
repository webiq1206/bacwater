"use client";

import { useCallback, useSyncExternalStore, type SetStateAction } from "react";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";

export const CALCULATOR_SESSION_KEY = "bacwater.calculatorSession.v1";
export interface MassDraft {
  total: string;
  totalUnit: MassUnit;
  volume: string;
  amount: string;
  amountUnit: MassUnit;
  basis: "each" | "week";
  frequency: string;
  peptideSlug: string;
  customName: string;
  productId: string;
  step: number;
  mode: "beginner" | "advanced";
  syringe: string;
  dateMixed: string;
}
export const EMPTY_MASS: MassDraft = {
  total: "", totalUnit: "mg", volume: "", amount: "", amountUnit: "mg",
  basis: "each", frequency: "", peptideSlug: "", customName: "", productId: "",
  step: 0, mode: "beginner", syringe: "insulin-1ml", dateMixed: "",
};
interface Session { version: 1; mass: MassDraft; tools: Record<string, unknown> }
const EMPTY: Session = { version: 1, mass: EMPTY_MASS, tools: {} };
let current: Session | null = null;
const listeners = new Set<() => void>();
const shortText = (x: unknown, limit = 64) => typeof x === "string" && x.length <= limit ? x : "";

/** Storage is untrusted. Do not recover old device-wide drafts into a new tab. */
export function parseCalculatorSession(raw: string | null): Session {
  if (!raw || raw.length > 65536) return EMPTY;
  try {
    const s = JSON.parse(raw);
    if (s?.version !== 1 || !s.mass || typeof s.mass !== "object" || Array.isArray(s.mass)) return EMPTY;
    const m = s.mass;
    const mass: MassDraft = {
      total: shortText(m.total), totalUnit: m.totalUnit === "mcg" ? "mcg" : "mg",
      volume: shortText(m.volume), amount: shortText(m.amount), amountUnit: m.amountUnit === "mcg" ? "mcg" : "mg",
      basis: m.basis === "week" ? "week" : "each", frequency: shortText(m.frequency, 3),
      peptideSlug: shortText(m.peptideSlug, 100), customName: shortText(m.customName, 120), productId: shortText(m.productId, 100),
      step: Number.isInteger(m.step) && m.step >= 0 && m.step <= 5 ? m.step : 0,
      mode: m.mode === "advanced" ? "advanced" : "beginner",
      syringe: ["insulin-0.3ml", "insulin-0.5ml", "insulin-1ml", "tuberculin-1ml", "syringe-3ml"].includes(m.syringe) ? m.syringe : EMPTY_MASS.syringe,
      dateMixed: /^\d{4}-\d{2}-\d{2}$/.test(m.dateMixed) ? m.dateMixed : "",
    };
    const tools: Record<string, unknown> = {};
    if (s.tools && typeof s.tools === "object" && !Array.isArray(s.tools)) {
      for (const [key, value] of Object.entries(s.tools).slice(0, 100)) {
        if (!/^[a-zA-Z0-9._:-]{1,120}$/.test(key) || ["__proto__", "constructor", "prototype"].includes(key)) continue;
        const encoded = JSON.stringify(value);
        if (encoded && encoded.length < 8192) tools[key] = value;
      }
    }
    return { version: 1, mass, tools };
  } catch { return EMPTY; }
}
function getSnapshot(): Session {
  if (typeof window === "undefined") return EMPTY;
  if (!current) {
    try { current = parseCalculatorSession(window.sessionStorage.getItem(CALCULATOR_SESSION_KEY)); }
    catch { current = EMPTY; }
  }
  return current;
}
function publish(value: Session) {
  current = value;
  try { window.sessionStorage.setItem(CALCULATOR_SESSION_KEY, JSON.stringify(value)); } catch { /* In-memory navigation still works. */ }
  listeners.forEach(fn => fn());
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  const restore = (event: PageTransitionEvent) => {
    if (!event.persisted) return;
    try { current = parseCalculatorSession(window.sessionStorage.getItem(CALCULATOR_SESSION_KEY)); } catch { return; }
    listeners.forEach(listener => listener());
  };
  window.addEventListener("pageshow", restore);
  return () => { listeners.delete(fn); window.removeEventListener("pageshow", restore); };
}
export function readMassSession() { return getSnapshot().mass; }
/** Synchronous writes ensure a click immediately after typing cannot outrun an effect. */
export function updateMassSession(patch: Partial<MassDraft>) {
  const s = getSnapshot();
  publish({ ...s, mass: { ...s.mass, ...patch } });
}
export function clearMassSession() {
  const s = getSnapshot();
  const tools = Object.fromEntries(Object.entries(s.tools).filter(([key]) => !key.startsWith("mass-tool:")));
  publish({ ...s, mass: { ...EMPTY_MASS }, tools });
}
export function useMassSession() {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return [s.mass, updateMassSession] as const;
}
/** Independent quantities (IU, blends, ready-made solutions and converters) never become vial mass. */
export function useSessionState<T>(key: string, initial: T) {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const candidate = s.tools[key];
  const value = candidate !== undefined && typeof candidate === typeof initial && candidate !== null ? candidate as T : initial;
  const set = useCallback((action: SetStateAction<T>) => {
    const latest = getSnapshot();
    const old = latest.tools[key];
    const previous = old !== undefined && old !== null && typeof old === typeof initial ? old as T : initial;
    const next = typeof action === "function" ? (action as (old: T) => T)(previous) : action;
    publish({ ...latest, tools: { ...latest.tools, [key]: next } });
  }, [key, initial]);
  return [value, set] as const;
}
export function massText(text: string, from: MassUnit, to: MassUnit): string {
  if (from === to) return text;
  const converted = convertMassText(text, from);
  return converted.kind === "value" ? converted[to] : text;
}
