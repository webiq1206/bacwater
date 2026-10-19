import { recommendBacWaterMl } from "./index";

/**
 * A starting amount of BAC water for a dry vial.
 *
 * The vial amount and the amount used each time are the only inputs. The
 * suggestion picks a common volume (1 to 3 mL) that makes each dose land on
 * an easy-to-read whole line of a U-100 insulin syringe. It is arithmetic,
 * not a product instruction: the user can type any other volume.
 */
export interface BacWaterSuggestion {
  /** Suggested BAC water in mL. */
  ml: number;
  /** U-100 units drawn for one dose at that volume. */
  units: number;
  /** Resulting concentration in mg/mL. */
  concentrationMgPerMl: number;
  /** Whole doses in the vial at the entered amount. */
  dosesPerVial: number;
}

const CANDIDATE_ML = [1, 1.5, 2, 2.5, 3] as const;
const finite = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;
const whole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9;

function score(units: number): number | null {
  if (units < 2 || units > 100) return null;
  let s = 0;
  if (whole(units)) s += 100;
  else if (whole(units * 2)) s += 40;
  if (whole(units) && Math.round(units) % 5 === 0) s += 30;
  if (whole(units) && Math.round(units) % 10 === 0) s += 20;
  if (units >= 5 && units <= 30) s += 50;
  else if (units > 30 && units <= 60) s += 25;
  else if (units >= 4) s += 10;
  return s - Math.abs(units - 15) / 2;
}

export function suggestBacWaterMl(vialMg: number, doseMcg: number): BacWaterSuggestion | null {
  if (!finite(vialMg) || !finite(doseMcg)) return null;
  const doseMg = doseMcg / 1000;
  if (doseMg > vialMg) return null;
  let best: { ml: number; score: number } | null = null;
  for (const ml of CANDIDATE_ML) {
    const units = (100 * doseMg * ml) / vialMg;
    const s = score(units);
    if (s === null) continue;
    if (!best || s > best.score + 1e-9 || (Math.abs(s - best.score) <= 1e-9 && Math.abs(ml - 2) < Math.abs(best.ml - 2))) best = { ml, score: s };
  }
  const ml = best ? best.ml : recommendBacWaterMl(vialMg, doseMcg);
  const concentrationMgPerMl = vialMg / ml;
  const units = (doseMg / concentrationMgPerMl) * 100;
  if (![ml, concentrationMgPerMl, units].every(n => Number.isFinite(n) && n > 0)) return null;
  return { ml, units, concentrationMgPerMl, dosesPerVial: Math.floor(vialMg / doseMg + 1e-9) };
}

/** Plain-language display of a unit count: "10" or "7.5". */
export function unitsText(units: number): string {
  if (units > 0 && units < 1) return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 2, useGrouping: false }).format(units);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, useGrouping: false }).format(units);
}

/** Plain-language display of a volume in mL: "2" or "1.5" or "0.08". */
export function mlText(ml: number): string {
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 6, useGrouping: false }).format(ml);
}
