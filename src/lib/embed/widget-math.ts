/**
 * Arithmetic for the framed third-party widgets under /embed.
 *
 * These are thin, named wrappers over the same primitives the on-site
 * calculators use, kept in one place so an embedded copy on someone else's
 * page can never drift from the canonical result. scripts/test-embed.ts
 * asserts each one against src/lib/calc for a table of inputs.
 *
 * Nothing here selects a dose, a liquid or a device. It divides and converts
 * the numbers the visitor typed.
 */
import { mgToMcg, mcgToMg, mlToU100, u100ToMl } from "@/lib/calc/converters";

/** Amount in each mL of the final solution. mg divided by mL. */
export function concentrationMgPerMl(vialMg: number, finalVolumeMl: number): number {
  return vialMg / finalVolumeMl;
}

/** Volume of the final solution that contains the requested amount. */
export function volumeMlForAmount(amountMg: number, concentration: number): number {
  return amountMg / concentration;
}

export { mgToMcg, mcgToMg, mlToU100, u100ToMl };

/**
 * A positive, finite decimal, or null. Widget input arrives as an untrusted
 * query string, so a rejected value renders the empty form rather than NaN.
 * The upper bound matches the planner's own software limit.
 */
export function positiveInput(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const text = raw.trim();
  if (!text || !/^\d*\.?\d+$/.test(text)) return null;
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0 || value > 1e12) return null;
  return value;
}

/** Enough significant digits to be checkable, without exponent noise. */
export function displayNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) >= 1e9)) return value.toExponential(6);
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10, useGrouping: false }).format(value);
}
