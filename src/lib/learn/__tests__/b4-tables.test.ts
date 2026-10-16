/**
 * Recompute the B4 tables with exact fractions and fail if a displayed value
 * differs from Priya's draft. Run with: node --import tsx src/lib/learn/__tests__/b4-tables.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  CONCENTRATION_EXAMPLES,
  CONCENTRATION_ROWS,
  FDA_SCALE_NOTE,
  ML_CAPACITY,
  ML_FAQS,
  ML_TO_UNITS_ROWS,
  REVERSE_LINES,
} from "../b4-math";

const DRAFT_ML_ROWS = [
  ["0.3 mL", "0.3 × 100", "30 units", "0.3 × its capacity"],
  ["0.5 mL", "0.5 × 100", "50 units", "0.5 × its capacity"],
  ["1 mL", "1 × 100", "100 units", "exactly its capacity"],
  ["1.5 mL", "1.5 × 100", "150 units", "1.5 × its capacity"],
  ["2 mL", "2 × 100", "200 units", "2 × its capacity"],
  ["2.5 mL", "2.5 × 100", "250 units", "2.5 × its capacity"],
  ["3 mL", "3 × 100", "300 units", "3 × its capacity"],
  ["4 mL", "4 × 100", "400 units", "4 × its capacity"],
  ["5 mL", "5 × 100", "500 units", "5 × its capacity"],
  ["10 mL", "10 × 100", "1,000 units", "10 × its capacity"],
];

assert.deepEqual(
  ML_TO_UNITS_ROWS.map((row) => [row.volume, row.calculation, row.units, row.capacity]),
  DRAFT_ML_ROWS,
);

assert.deepEqual(REVERSE_LINES, [
  "300 units ÷ 100 = 3 mL",
  "250 units ÷ 100 = 2.5 mL",
  "500 units ÷ 100 = 5 mL",
]);

assert.deepEqual(ML_CAPACITY, {
  twoMl: "200 units",
  oneMl: "100 units",
  holdsPointThree: "30 units",
  holdsPointFive: "50 units",
});

assert.equal(FDA_SCALE_NOTE, "Describes a U-100 (1 mL) syringe, where 5 units is 0.05 mL, and reported confusion between mL, mg and units.");

assert.deepEqual(ML_FAQS.map((item) => item.a), [
  "100 units on a U-100 scale (1 × 100). The liquid doesn't change the conversion.",
  "200 U-100 units (2 × 100). That is twice the capacity of a 1 mL U-100 syringe.",
  "300 U-100 units (3 × 100).",
  "500 U-100 units (5 × 100).",
  "Yes. NIST defines the milliliter as one cubic centimeter, so 1 cc = 1 mL = 100 U-100 units.",
  "Not from units alone. Units measure volume. To get a mass you also need the concentration in mg/mL: mass (mg) = volume (mL) × concentration (mg/mL). For example, 0.25 mL at 2 mg/mL is 0.5 mg. That is illustrative arithmetic, not an amount to use. Read mg vs mg/mL or use the amount-to-volume tool.",
  "No. The ×100 rule only works on a U-100 scale. Read the markings on the actual device. Product IU numbers are not syringe units, so don't enter them as U-100 values. See what syringe units mean.",
]);

const DRAFT_CONCENTRATION = [
  ["5 mg", ["5 mg/mL", "2.5 mg/mL", "5/3 = 1.666… mg/mL", "1.25 mg/mL", "1 mg/mL"]],
  ["10 mg", ["10 mg/mL", "5 mg/mL", "10/3 = 3.333… mg/mL", "2.5 mg/mL", "2 mg/mL"]],
  ["20 mg", ["20 mg/mL", "10 mg/mL", "20/3 = 6.666… mg/mL", "5 mg/mL", "4 mg/mL"]],
  ["30 mg", ["30 mg/mL", "15 mg/mL", "10 mg/mL", "7.5 mg/mL", "6 mg/mL"]],
  ["50 mg", ["50 mg/mL", "25 mg/mL", "50/3 = 16.666… mg/mL", "12.5 mg/mL", "10 mg/mL"]],
];

assert.deepEqual(
  CONCENTRATION_ROWS.map((row) => [row.amount, row.cells]),
  DRAFT_CONCENTRATION,
);
for (const row of CONCENTRATION_ROWS) {
  for (const cell of row.cells) assert.equal(cell.includes("1.67"), false, cell);
}

assert.deepEqual(CONCENTRATION_EXAMPLES.same, [
  "10 mg in 2 mL = 5 mg/mL",
  "20 mg in 4 mL = 5 mg/mL",
  "5 mg in 1 mL = 5 mg/mL",
]);
assert.deepEqual(CONCENTRATION_EXAMPLES.dilution, { twoMl: "5 mg/mL", fourMl: "2.5 mg/mL", total: "10 mg" });
assert.deepEqual(CONCENTRATION_EXAMPLES.mcg, ["5 mg/mL = 5,000 mcg/mL", "2.5 mg/mL = 2,500 mcg/mL"]);
assert.equal(CONCENTRATION_EXAMPLES.repeating, "5/3 = 1.666… mg/mL");
assert.deepEqual(CONCENTRATION_EXAMPLES.chain, [
  "10 mg ÷ 2 mL = 5 mg/mL",
  "400 mcg = 0.4 mg (÷ 1,000)",
  "0.4 mg ÷ 5 mg/mL = 0.08 mL",
  "0.08 mL × 100 = 8 units on a U-100 scale",
]);

const pages = [
  "src/app/learn/ml-to-units-table/page.tsx",
  "src/app/learn/bac-water-concentration-table/page.tsx",
];
const compounds = /\b(bpc-157|tb-500|ipamorelin|cjc-1295|sermorelin|hexarelin|semaglutide|tirzepatide|retatrutide|cagrilintide|mots-c|epithalon|ghk-cu|melanotan|ss-31|selank|semax|aod-9604|kisspeptin|pt-141|hcg|glow)\b/i;
for (const page of pages) {
  const source = fs.readFileSync(page, "utf8");
  assert.equal(source.includes("Notes for Kai"), false, page);
  assert.equal(/DRAFT/i.test(source), false, page);
  assert.equal(/\buse client\b|\btrackUsage\b|\bgtag\b|dataLayer|sendBeacon|<input|<form|\bfetch\(/.test(source), false, page);
  assert.equal(compounds.test(source), false, page);
}
const unitsPage = fs.readFileSync(pages[0], "utf8");
const concentrationPage = fs.readFileSync(pages[1], "utf8");
assert.match(unitsPage, /nist\.gov\/pml\/owm\/metric-si-prefixes/);
assert.match(unitsPage, /nist\.gov\/pml\/owm\/si-units-volume/);
assert.match(unitsPage, /fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded/);
assert.match(concentrationPage, /nist\.gov\/pml\/owm\/metric-si-prefixes/);
assert.match(concentrationPage, /pfizermedical\.com\/bacteriostatic-water/);
assert.match(unitsPage, /\/learn\/u-100-units-explained/);
assert.match(concentrationPage, /\/learn\/peptide-reconstitution-chart/);
assert.match(concentrationPage, /\/learn\/ml-to-units-table/);

console.log("OK   B4 tables match the draft exactly");
