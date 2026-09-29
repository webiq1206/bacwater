/** Exact base-10 prefix conversion. This is mass notation only, never a dose decision. */
export type MassUnit = "mg" | "mcg";
export type MassConversion = { kind: "empty" } | { kind: "error"; message: string } | { kind: "value"; mg: string; mcg: string };
export function convertMassText(raw: string, unit: MassUnit): MassConversion {
  if (unit !== "mg" && unit !== "mcg") return { kind: "error", message: "Select mg or mcg." };
  const result = convertDecimalText(raw, unit === "mg" ? 3 : -3, "mass");
  return result.kind === "value" ? { kind: "value", mg: unit === "mg" ? result.input : result.output, mcg: unit === "mcg" ? result.input : result.output } : result;
}
/** Shift a decimal exactly; used for mass prefixes and the U-100 scale relationship. */
export function convertDecimalText(raw: string, places: number, quantity = "value"): {kind:"empty"} | {kind:"error";message:string} | {kind:"value";input:string;output:string} {
  if (typeof raw !== "string" || raw.length > 64) return { kind: "error", message: "Use 64 characters or fewer." };
  const text = raw.trim();
  if (!text) return { kind: "empty" };
  if (text.startsWith("-")) return { kind: "error", message: `Enter zero or a positive ${quantity}.` };
  const match = /^\+?(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d{1,3}))?$/.exec(text);
  if (!match) return { kind: "error", message: "Enter a number using a decimal point, without commas or a unit suffix." };
  const exponent = Number(match[2] || "0");
  if (Math.abs(exponent) > 100) return { kind: "error", message: "The supported exponent range is -100 to 100." };
  const [whole = "", fraction = ""] = match[1].split(".");
  const digits = whole + fraction;
  function shift(by: number) {
    const decimal = whole.length + exponent + by;
    const expanded = decimal <= 0 ? `0.${"0".repeat(-decimal)}${digits}` : decimal >= digits.length ? digits + "0".repeat(decimal - digits.length) : `${digits.slice(0, decimal)}.${digits.slice(decimal)}`;
    const [integer, tail = ""] = expanded.split(".");
    const lead = integer.replace(/^0+(?=\d)/, "") || "0";
    const end = tail.replace(/0+$/, "");
    return end ? `${lead}.${end}` : lead;
  }
  return { kind: "value", input: shift(0), output: shift(places) };
}
