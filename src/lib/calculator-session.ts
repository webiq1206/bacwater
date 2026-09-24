import { convertMassText, type MassUnit } from "./calc/mass-text";

export type AmountBasis = "each" | "week";
export interface MassDraft {
  vial: string;
  vialUnit: MassUnit;
  amount: string;
  amountUnit: MassUnit;
  volume: string;
  basis: AmountBasis;
  frequency: number | null;
  peptideSlug: string;
  customName: string;
  productId: string | null;
  reviewProduct: boolean;
  step: number;
  syringe: string;
  dateMixed: string;
}
export const EMPTY_MASS: MassDraft = {
  vial: "", vialUnit: "mg", amount: "", amountUnit: "mcg", volume: "",
  basis: "each", frequency: null, peptideSlug: "", customName: "", productId: null,
  reviewProduct: false, step: 0, syringe: "insulin-1ml", dateMixed: "",
};
export const CALCULATOR_SESSION_KEY = "bacwater.calculatorSession.v1";
type State = { version: 1; mass: MassDraft; tools: Record<string, unknown> };
const EMPTY: State = { version: 1, mass: EMPTY_MASS, tools: {} };
let current: State | undefined;
const listeners = new Set<() => void>();
const text = (v: unknown, max = 64) => typeof v === "string" ? v.slice(0, max) : "";
/** Validate storage without treating incomplete numeric text as a usable result. */
export function parseMassDraft(raw: unknown): MassDraft {
  const r = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const frequency = typeof r.frequency === "number" && Number.isFinite(r.frequency) ? r.frequency : null;
  const knownVialUnit = r.vialUnit === undefined || r.vialUnit === "mg" || r.vialUnit === "mcg";
  const knownAmountUnit = r.amountUnit === undefined || r.amountUnit === "mg" || r.amountUnit === "mcg";
  const knownBasis = r.basis === undefined || r.basis === "each" || r.basis === "week";
  return { vial: knownVialUnit ? text(r.vial) : "", vialUnit: r.vialUnit === "mcg" ? "mcg" : "mg",
    amount: knownAmountUnit && knownBasis ? text(r.amount) : "", amountUnit: r.amountUnit === "mg" ? "mg" : "mcg", volume: text(r.volume),
    basis: r.basis === "week" ? "week" : "each", frequency,
    peptideSlug: text(r.peptideSlug, 100), customName: text(r.customName, 160), productId: typeof r.productId === "string" ? text(r.productId, 100) : null,
    reviewProduct: r.reviewProduct === true, step: Number.isInteger(r.step) && Number(r.step) >= 0 && Number(r.step) <= 5 ? Number(r.step) : 0,
    syringe: ["insulin-0.3ml", "insulin-0.5ml", "insulin-1ml", "tuberculin-1ml", "syringe-3ml"].includes(String(r.syringe)) ? String(r.syringe) : EMPTY_MASS.syringe,
    dateMixed: /^\d{4}-\d{2}-\d{2}$/.test(String(r.dateMixed)) ? String(r.dateMixed) : "",
  };
}
export function readCalculatorSession(): State {
  if (typeof window === "undefined") return EMPTY;
  if (current) return current;
  current = { ...EMPTY, tools: {} };
  try {
    const raw = sessionStorage.getItem(CALCULATOR_SESSION_KEY);
    if (raw && raw.length <= 65536) {
      const d = JSON.parse(raw);
      if (d?.version === 1) {
        const tools: Record<string, unknown> = {};
        if (d.tools && typeof d.tools === "object" && !Array.isArray(d.tools)) {
          for (const [key, value] of Object.entries(d.tools).slice(0, 200)) {
            if (/^bacwater\.[\w.-]{1,150}$/.test(key)) tools[key] = value;
          }
        }
        current = { version: 1, mass: parseMassDraft(d.mass), tools };
        return current;
      }
    }
    // Import only an already-open tab's old hero draft. Never revive a stale
    // device-wide plan or another product's dose from localStorage.
    const old = sessionStorage.getItem("bacwater.heroDraft.v1");
    if (old && old.length < 2048) {
      const hero = JSON.parse(old);
      if (hero?.values) {
        current.mass = parseMassDraft({ ...EMPTY_MASS, vial: hero.values.amount,
          volume: hero.values.volume, amount: hero.values.target, amountUnit: hero.values.targetUnit });
        current.tools["bacwater.hero.mode"] = ["mass", "units"].includes(hero.mode) ? hero.mode : "concentration";
        current.tools["bacwater.tool.mass.v2"] = { unit: "mg", text: text(hero.values.mass) };
        current.tools["bacwater.tool.syringe.conversion.v2"] = { direction: "units", text: text(hero.values.units) };
      }
    }
  } catch { /* Memory-only calculation remains usable when browser storage is blocked. */ }
  return current;
}
function publish(next: State) {
  if (typeof window === "undefined") return;
  current = next;
  try { sessionStorage.setItem(CALCULATOR_SESSION_KEY, JSON.stringify(next)); } catch { /* Keep the in-memory session. */ }
  listeners.forEach(fn => fn());
}
export const subscribeCalculatorSession = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const serverCalculatorSession = () => EMPTY;
export function patchMassDraft(patch: Partial<MassDraft> | ((value: MassDraft) => Partial<MassDraft>)) {
  const s = readCalculatorSession();
  const next = parseMassDraft({ ...s.mass, ...(typeof patch === "function" ? patch(s.mass) : patch) });
  if (JSON.stringify(next) !== JSON.stringify(s.mass)) publish({ ...s, mass: next });
}
export function writeSessionTool<T>(key: string, value: T | ((old: T) => T), initial: T) {
  const s = readCalculatorSession();
  const previous = sessionToolValue(s.tools[key], initial);
  const next = typeof value === "function" ? (value as (v: T) => T)(previous) : value;
  publish({ ...s, tools: { ...s.tools, [key]: next } });
}
export function clearMassNumbers() {
  const s = readCalculatorSession();
  const tools = { ...s.tools };
  for (const key of Object.keys(tools)) if (key.startsWith("bacwater.plan.")) delete tools[key];
  publish({ ...s, tools, mass: { ...EMPTY_MASS, peptideSlug: s.mass.peptideSlug, productId: s.mass.productId, customName: s.mass.customName } });
}
/** Product changes carry user entries, never product-specific suggested numbers. */
export function selectMassProduct(productId: string | null, peptideSlug: string, customName = "") {
  patchMassDraft(d => ({ productId, peptideSlug, customName,
    reviewProduct: d.productId === productId && d.peptideSlug === peptideSlug ? d.reviewProduct : Boolean(d.vial || d.amount || d.volume),
  }));
}
export function massText(textValue: string, from: MassUnit, to: MassUnit): string {
  if (from === to) return textValue;
  const result = convertMassText(textValue, from);
  return result.kind === "value" ? result[to] : textValue;
}

/** Match the expected value shape before a component reads browser storage. */
export function sessionToolValue<T>(candidate: unknown, initial: T): T {
  function valid(value: unknown, model: unknown, depth = 0): boolean {
    if (depth > 8 || value === null || value === undefined) return value === model;
    if (typeof value !== typeof model) return false;
    if (typeof value === "string") return value.length <= 4096;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "boolean") return true;
    if (Array.isArray(model)) return Array.isArray(value) && value.length <= 64 && (!model.length || value.every(v => valid(v, model[0], depth + 1)));
    if (model && typeof model === "object") return !Array.isArray(value) && Object.entries(model).every(([key, v]) => Object.hasOwn(value, key) && valid((value as Record<string, unknown>)[key], v, depth + 1));
    return false;
  }
  return valid(candidate, initial) ? candidate as T : initial;
}
