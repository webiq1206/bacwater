import { readTiming, EMPTY_TIMING, type AmountTiming } from "@/lib/calc/amount-timing";
import { convertMassText, type MassUnit } from "@/lib/calc/mass-text";
export interface MassDraft extends AmountTiming { vial: string; vialUnit: MassUnit; volume: string; productId: string; peptideSlug: string; source: string; isExample: boolean }
export const EMPTY_MASS_DRAFT: MassDraft = { ...EMPTY_TIMING, vial: "", vialUnit: "mg", volume: "", productId: "", peptideSlug: "", source: "", isExample: false };
export function readMassDraft(raw: unknown): MassDraft {
  const r = raw && typeof raw === "object" ? raw as Record<string,unknown> : {};
  const text = (key: string) => typeof r[key] === "string" ? (r[key] as string).slice(0,80) : "";
  return { ...readTiming(r), vial: r.vialUnit === undefined || r.vialUnit === "mg" || r.vialUnit === "mcg" ? text("vial") : "", vialUnit: r.vialUnit === "mcg" ? "mcg" : "mg", volume: text("volume"), productId: text("productId"), peptideSlug: text("peptideSlug"), source: text("source"), isExample: r.isExample === true };
}
export function massInMg(d: MassDraft): string { const v = convertMassText(d.vial, d.vialUnit); return v.kind === "value" ? v.mg : d.vial; }
export function switchVialUnit(d: MassDraft, unit: MassUnit): MassDraft { const v = convertMassText(d.vial,d.vialUnit);return { ...d, vialUnit: unit, vial: v.kind === "value" ? v[unit] : d.vial }; }

/** Import only the old same-tab hero record. Never choose an old device-wide product draft. */
export function seedHeroSession(): unknown {
 if(typeof window === "undefined") return null;
 try { const raw=window.sessionStorage.getItem("bacwater.heroDraft.v1"); if(!raw||raw.length>2048)return null; const old=JSON.parse(raw),v=old?.values;
 if(!v||!["concentration","mass","units"].includes(old.mode))return null;
 return readMassDraft({...EMPTY_MASS_DRAFT,vial:v.amount,volume:v.volume,amount:v.target,amountUnit:v.targetUnit,basis:v.target?"each":"",source:"Homepage"});
 } catch {return null;}
}
