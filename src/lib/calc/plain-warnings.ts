/**
 * The calculation engine's warnings are written for the audit trail and the
 * saved-plan PDF. On screen a beginner needs one plain sentence. This maps
 * each engine warning to that sentence without changing the engine.
 */
const RULES: readonly { test: RegExp; text: (w: string) => string }[] = [
  { test: /larger than the vial contains/i, text: () => "Your dose is bigger than the whole vial. Check the number and whether it should be mg or mcg." },
  { test: /exceeds the capacity of the selected/i, text: () => "The calculated volume exceeds the selected scale capacity. It is an arithmetic equivalent, not a mark on that scale." },
  { test: /between two marks/i, text: w => { const m = w.match(/is ([\d.]+) units/); return `${m ? m[1] : "This"} units lands between two lines on the syringe. This is an arithmetic equivalent, not an exact printed mark.`; } },
  { test: /too small to measure/i, text: () => "The calculated volume is below the selected scale's readable range. It is an arithmetic equivalent only." },
  { test: /hard to measure accurately/i, text: () => "The calculated volume is difficult to distinguish on the selected scale. It is an arithmetic equivalent only." },
  { test: /above this tool's 100 mg review threshold/i, text: () => "That is a very large vial amount. Double-check the number and the unit on your label." },
  { test: /below this tool's 0\.5 mg review threshold/i, text: () => "That is a very small vial amount. Double-check the number and the unit on your label." },
  { test: /exceeds this tool's 5 mL review threshold/i, text: () => "That is a lot of water. Most small vials hold about 3 mL. Check the number." },
  { test: /below 0\.5 mL/i, text: () => "That is very little water. Check the number." },
  { test: /100 mg\/mL software review threshold/i, text: () => "That mix is unusually strong. Check that the vial amount and the water are in the right units." },
];

/** One plain sentence for a known engine warning; unknown warnings pass through unchanged. */
export function plainWarning(warning: string): string {
  for (const rule of RULES) if (rule.test.test(warning)) return rule.text(warning);
  return warning;
}

export function plainWarnings(warnings: readonly string[]): string[] {
  return [...new Set(warnings.map(plainWarning))];
}
