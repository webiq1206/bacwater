/**
 * Canonical display formatters for calculation values.
 *
 * Every surface, the results page, the PDF, the plans list, the vial label,
 * and the standalone tools, must format the same underlying number
 * identically. Import these helpers instead of calling `.toFixed()` inline so
 * a value can never show as "12.4 units" in one place and "12.35 units" in
 * another.
 */

/** Preserve positive values below a display threshold instead of silently printing zero. */
export function formatNumeric(value: number, decimals=2): string {
  if (!Number.isFinite(value)) return "Unavailable";
  const fixed=value.toFixed(decimals);
  return value!==0 && Number(fixed)===0 ? value.toExponential(3).replace(/\.?0+e/,"e") : trimZeros(fixed);
}

/** Drop a trailing decimal point and trailing zeros: "12.40" -> "12.4", "2.00" -> "2". */
export function trimZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/\.?0+$/, "");
}

/** Syringe units on the U-100 insulin scale. One decimal, trailing zeros trimmed. */
export function formatUnits(units: number): string {
  return formatNumeric(units,1);
}

/** A volume in mL. Two decimals by default, trailing zeros trimmed. */
export function formatMl(ml: number, decimals = 2): string {
  return formatNumeric(ml,decimals);
}

/** The exact dose volume drawn per injection. Three decimals for precision. */
export function formatDoseVolumeMl(ml: number): string {
  return `${formatNumeric(ml,3)} mL`;
}

/** Concentration in mg/mL. Two decimals, trailing zeros trimmed. */
export function formatConcentration(mgPerMl: number): string {
  return formatNumeric(mgPerMl,2);
}

/** A dose given in mcg, rendered as "250 mcg" or "2.5 mg (2,500 mcg)". */
export function formatDose(mcg: number): string {
  if (mcg >= 1000) {
    const mg = trimZeros((mcg / 1000).toFixed(2));
    return `${mg} mg (${mcg.toLocaleString()} mcg)`;
  }
  return `${formatNumeric(mcg,1)} mcg`;
}

/**
 * The "draw this much" reading for a syringe, respecting its scale.
 * U-100 syringes read in units; tuberculin / mL-scale syringes read in mL.
 * Pass the `syringeReadout` object straight from a CalcResult.
 */
export function formatSyringeReading(readout: {
  kind: "u100" | "ml";
  valueRounded: number;
  exactValue?: number;
}): string {
  return readout.kind === "u100"
    ? `${formatUnits(readout.exactValue ?? readout.valueRounded)} units`
    : `${formatMl(readout.exactValue ?? readout.valueRounded)} mL`;
}
