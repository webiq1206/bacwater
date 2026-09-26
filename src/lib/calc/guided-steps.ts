import type { PlanPreviewState } from "./plan-preview";

export const GUIDED_STEPS = [
  { label: "Product", title: "Choose your product", hint: "Match the exact name on your label. Each product uses its own calculation." },
  { label: "Vial", title: "What amount is on the vial?", hint: "Copy the total amount and unit from the label." },
  { label: "Amount", title: "How much, and how often?", hint: "Use an amount and schedule you already have. We do not choose them for you." },
  { label: "Volume", title: "What is the final liquid volume?", hint: "Use the final volume from your instructions, not an assumed amount of water." },
  { label: "Details", title: "Check your device and date", hint: "Match the scale on your actual device. The mix date is optional." },
  { label: "Review", title: "Here are your numbers", hint: "Check your entries against the label and instructions before saving." },
] as const;

/** A restored draft cannot skip an unanswered prerequisite or show stale results. */
export function guidedStep(requested: number, preview: PlanPreviewState): number {
  const bounded = Number.isInteger(requested) && requested >= 0 && requested < GUIDED_STEPS.length ? requested : 0;
  const missing = preview.entries.findIndex(entry => !entry.complete);
  return missing < 0 ? bounded : Math.min(bounded, missing);
}

export function canContinueGuided(step: number, preview: PlanPreviewState): boolean {
  return step < 4 ? preview.entries.slice(0, step + 1).every(entry => entry.complete) : preview.ready;
}
