export type LabelPaper = "letter" | "a4" | "label";
export interface LabelSize { width: number; height: number; }
export const LABEL_SIZES = [
  { id: "tiny", name: "Tiny vial", width: 25, height: 13 },
  { id: "small", name: "Small vial", width: 30, height: 15 },
  { id: "roomier", name: "More space", width: 40, height: 20 },
] as const;
export const DEFAULT_LABEL_SIZE: LabelSize = { width: 30, height: 15 };
export const mmToPt = (mm: number) => mm * 72 / 25.4;
export function validLabelSize(size: LabelSize) {
  return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width >= 22 && size.width <= 80 && size.height >= 12 && size.height <= 40;
}
export function labelLayout(size: LabelSize, paper: LabelPaper) {
  if (!validLabelSize(size) || !["letter", "a4", "label"].includes(paper)) throw new Error("Choose a valid label size and paper type.");
  const pageWidth = paper === "label" ? size.width : paper === "a4" ? 210 : 215.9;
  const pageHeight = paper === "label" ? size.height : paper === "a4" ? 297 : 279.4;
  const margin = paper === "label" ? 0 : 10, gap = paper === "label" ? 0 : 2;
  const columns = Math.max(1, Math.floor((pageWidth - 2 * margin + gap) / (size.width + gap)));
  const rows = Math.max(1, Math.floor((pageHeight - 2 * margin + gap) / (size.height + gap)));
  return { pageWidth, pageHeight, margin, gap, columns, rows, perPage: columns * rows };
}
function dateParts(iso: string): number[] | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (year < 1900 || year > 2199) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day ? [year, month, day] : null;
}
export const validMixDate = (iso: string) => Boolean(dateParts(iso));
export function addLabelDays(iso: string, days: number): string | null {
  const parts = dateParts(iso);
  if (!parts || !Number.isInteger(days) || days < 0 || days > 3650) return null;
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + days));
  const result = d.toISOString().slice(0, 10);
  return validMixDate(result) ? result : null;
}
export function formatLabelDate(iso: string): string {
  if (!validMixDate(iso)) return "Not set";
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}
/** Calendar arithmetic only. The application does not assign a product's stability period. */
export function labelUseBy(mixDate: string, periodDays: string, printedExpiry = "") {
  if (!mixDate && !periodDays.trim()) return { kind: "empty" as const, date: "", note: "Add a mix date and the number of days in this product's instructions." };
  if (!mixDate) return { kind: "empty" as const, date: "", note: "Add the mix date to calculate the use-by date." };
  if (!validMixDate(mixDate)) return { kind: "error" as const, date: "", note: "Check the mix date." };
  if (!periodDays.trim()) return { kind: "empty" as const, date: "", note: "Enter the number of days from this product's instructions. No default period is assumed." };
  if (!/^\d{1,4}$/.test(periodDays.trim())) return { kind: "error" as const, date: "", note: "Use a whole number of days from 1 to 3650." };
  if (Number(periodDays) < 1) return { kind: "error" as const, date: "", note: "Use a positive whole-day period. For shorter periods, follow the exact product deadline." };
  const date = addLabelDays(mixDate, Number(periodDays));
  if (!date) return { kind: "error" as const, date: "", note: "Check the date and number of days." };
  if (printedExpiry && (!validMixDate(printedExpiry) || printedExpiry < mixDate)) return { kind: "error" as const, date: "", note: "The original printed expiry must be a valid date on or after the mix date." };
  return { kind: "value" as const, date: printedExpiry && printedExpiry < date ? printedExpiry : date,
    note: printedExpiry && printedExpiry < date ? "Limited to the earlier original printed expiry." : "Calculated from your mix date and the days you entered." };
}
export interface LabelPrintData { name: string; concentration: string; mixDate: string; useBy: string; }
export function labelTypography(size: LabelSize) {
  return size.height < 15 ? { title: 6.3, body: 5.2, date: 5.1, padding: .8 } : size.height < 20 ? { title: 7.3, body: 5.8, date: 5.5, padding: 1 } : { title: 8.5, body: 6.8, date: 6.4, padding: 1.3 };
}
