import { convertDecimalText, convertMassText, type MassUnit } from "./mass-text";

export type ConversionEntry = { unit: MassUnit; text: string };
export type ScaleEntry = { direction: "units" | "ml"; text: string };
export function scaleConversion(entry: ScaleEntry) {
  if (entry.direction !== "units" && entry.direction !== "ml") return {kind:"error" as const,message:"Select U-100 units or mL."};
  const r = convertDecimalText(entry.text, entry.direction === "units" ? -2 : 2);
  return r.kind === "value" ? {kind:"value" as const, units:entry.direction === "units" ? r.input : r.output, ml:entry.direction === "ml" ? r.input : r.output} : r;
}
/** Compact only when needed to keep a converted value editable within the input limit. */
export function editableDecimal(text: string): string | null {
  if (text.length <= 64) return text;
  const [whole, fraction = ""] = text.split(".");
  const digits = whole + fraction, first = digits.search(/[1-9]/);
  if (first < 0) return "0";
  const significant = digits.slice(first).replace(/0+$/, "");
  const exponent = whole.length - first - 1;
  const compact = significant[0] + (significant.length > 1 ? "." + significant.slice(1) : "") + "e" + exponent;
  return compact.length <= 64 && Math.abs(exponent) <= 100 ? compact : null;
}
export function switchMassDirection(entry: ConversionEntry, unit: MassUnit): ConversionEntry | null {
  if (entry.unit === unit) return entry;
  const r = convertMassText(entry.text, entry.unit);
  if (r.kind === "empty") return {unit,text:""};
  if (r.kind !== "value") return null;
  const text = editableDecimal(r[unit]);
  return text === null ? null : {unit,text};
}
export function switchScaleDirection(entry: ScaleEntry, direction: ScaleEntry["direction"]): ScaleEntry | null {
  if (entry.direction === direction) return entry;
  const r = scaleConversion(entry);
  if (r.kind === "empty") return {direction,text:""};
  if (r.kind !== "value") return null;
  const text = editableDecimal(r[direction]);
  return text === null ? null : {direction,text};
}
