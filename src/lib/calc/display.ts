import type { CalcResult } from "@/lib/calc";
/** Preserve saved arithmetic, but never revive legacy unverified stability dates. */
export function safeResultDisplay(result: CalcResult): CalcResult {
  return { ...result, expiration: { days: null, date: null, note: "Not determined. Follow product-specific storage and discard instructions." } };
}
