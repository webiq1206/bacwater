import { SYRINGES, type CalcInput, type CalcResult } from "./index";
import { amountSchedule, type AmountSchedule } from "./amount-schedule";
import { positiveDecimal } from "./number-text";
import { formatNumeric } from "./format";

export type PreviewField = "product" | "vial" | "amount" | "volume" | "blend";
export interface PreviewEntry {
  field: PreviewField; label: string; value: string;
  complete: boolean; issue?: string;
}
export interface PlanPreviewInput {
  input: CalcInput; result: CalcResult; hasProduct: boolean;
  vialText: string; vialUnit: "mg" | "mcg";
  volumeText: string; amount: AmountSchedule;
  secondaryReady: boolean; hydrated: boolean;
}
const supported = (value: number | undefined): value is number => typeof value === "number" && Number.isFinite(value) && value >= 1e-12 && value <= 1e12;

/** A synchronous projection of the form, never a second persisted calculation. */
export function planPreviewState(p: PlanPreviewInput) {
  const { input, result } = p;
  const schedule = amountSchedule(p.amount);
  const hasVial = positiveDecimal(p.vialText) !== null && supported(input.vialStrengthMg);
  const hasVolume = positiveDecimal(p.volumeText) !== null && supported(input.bacWaterMl);
  const hasAmount = schedule.ready && supported(schedule.weeklyMcg);
  const hasProduct = p.hasProduct && input.peptideSlug !== "hcg";
  const amountSuffix = p.amount.basis === "week" ? "per week" : p.amount.basis === "day" ? "per day" : "each time";
  const entries: PreviewEntry[] = [
    { field: "product", label: "Product", value: p.hasProduct ? input.peptideName || "Custom product" : "Choose a product", complete: hasProduct, issue: input.peptideSlug === "hcg" ? "hCG uses IU. Open the IU calculator instead." : undefined },
    { field: "vial", label: "Amount in vial", value: p.vialText.trim() ? `${p.vialText.trim()} ${p.vialUnit}` : "Add the label amount", complete: hasVial, issue: p.vialText.trim() && !hasVial ? "Check the vial amount and unit. Enter a positive number within the supported range." : undefined },
    { field: "amount", label: "Entered amount", value: p.amount.amount.trim() ? `${p.amount.amount.trim()} ${p.amount.amountUnit} ${amountSuffix}` : "Add the amount to measure", complete: hasAmount, issue: p.amount.amount.trim() && !hasAmount ? schedule.ready ? "Check the amount and unit. The weekly total exceeds this calculator's numeric range." : schedule.message : undefined },
    { field: "volume", label: "Final liquid volume", value: p.volumeText.trim() ? `${p.volumeText.trim()} mL` : "Add the final volume", complete: hasVolume, issue: p.volumeText.trim() && !hasVolume ? "Enter a positive final liquid volume from your instructions." : undefined },
  ];
  const completed = entries.filter(entry => entry.complete).length;
  const issues = entries.flatMap(entry => entry.issue ? [entry.issue] : []);
  if (!p.secondaryReady) issues.push("Complete the second product name and its vial amount, or remove the blend.");
  const validScale = SYRINGES.some(scale => scale.id === input.syringeType);
  if (!validScale) issues.push("Select a supported syringe scale.");
  if (completed === entries.length && p.secondaryReady) issues.push(...result.errors);
  const ready = p.hydrated && completed === entries.length && p.secondaryReady && validScale && result.errors.length === 0;
  // Concentration has only two prerequisites. Do not read engine placeholder
  // values when an amount, product or volume has not been supplied yet.
  const ratio = hasVial && hasVolume ? input.vialStrengthMg / input.bacWaterMl! : null;
  const concentration = ratio !== null && Number.isFinite(ratio) && ratio > 0 ? ratio : null;
  return {
    entries, completed, ready, schedule, concentration,
    issues: [...new Set(issues)],
    remaining: entries.filter(entry => !entry.complete),
    concentrationText: concentration === null ? null : `${formatNumeric(concentration, 4)} mg/mL`,
  };
}
export type PlanPreviewState = ReturnType<typeof planPreviewState>;
