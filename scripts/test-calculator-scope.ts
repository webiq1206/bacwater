import assert from "node:assert/strict";
import fs from "node:fs";
import { calculate } from "../src/lib/calc";
import { planPreviewState } from "../src/lib/calc/plan-preview";
import { BAC_WATER_FAQS } from "../src/app/tools/bac-water/faqs";
import { SEARCH_SNIPPETS } from "../src/lib/seo/search-appearance";

// A valid mass and measurement must never make an unknown final volume ready.
const amount = { amount: "0.4", amountUnit: "mg" as const, basis: "each" as const, timesPerWeek: "" };
for (const volumeText of ["", "0", "-2", "2mL", "NaN", "Infinity"]) {
  const input = { vialStrengthMg: 10, doseMcg: 400, bacWaterMl: Number(volumeText), syringeType: "insulin-1ml" as const };
  const preview = planPreviewState({ input, result: calculate(input), hasProduct: true, vialText: "10", vialUnit: "mg", volumeText, amount, secondaryReady: true, hydrated: true });
  assert.equal(preview.ready, false, volumeText);
  assert.equal(preview.entries[3].complete, false, volumeText);
}
for (const [finalVolume, concentration, ml, units] of [[2, 5, .08, 8], [4, 2.5, .16, 16]]) {
  const r = calculate({ vialStrengthMg: 10, doseMcg: 400, bacWaterMl: finalVolume, syringeType: "insulin-1ml" });
  assert.equal(r.finalConcentrationMgPerMl, concentration);
  assert.equal(r.doseVolumeMl, ml);
  assert.equal(r.syringeUnits, units);
}
// Guard both interactive entry points against reintroducing preparation selection.
for (const path of ["src/app/tools/bac-water/calculator-client.tsx", "src/components/brand/hero-plan-steps.tsx"]) {
  const source = fs.readFileSync(path, "utf8");
  assert.doesNotMatch(source, /suggestBacWaterMl|recommendBacWaterMl|autoFilled|data-water-suggestion/);
  assert.doesNotMatch(source, /Fill your syringe to|Add this much BAC water|Each time, fill/);
  assert.match(source, /final liquid volume/i);
  assert.match(source, /not dosing or preparation advice/i);
}
assert.match(SEARCH_SNIPPETS["/tools/bac-water"].description, /bacteriostatic water/);
assert.match(BAC_WATER_FAQS.find(f => f.q.includes("always"))!.a, /^No\./);
assert.doesNotMatch(BAC_WATER_FAQS.map(f => f.a).join(" "), /Any amount works|comfortable amount|close enough|easy line/);
console.log("PASS calculator scope: unknown-volume gating, reproducible examples, both selection boundaries, and FAQ limits.");
