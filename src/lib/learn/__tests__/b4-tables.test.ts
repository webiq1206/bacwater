/**
 * Recompute the B4 tables with exact fractions and fail if a displayed value
 * differs from Priya's draft. Run with: node --import tsx src/lib/learn/__tests__/b4-tables.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyticsLocation } from "../../analytics";
import { isClarityUrlAllowed } from "../../clarity";
import { CODE_PUBLIC_PATHS } from "../../seo/publication-policy";
import { SEARCH_SNIPPETS } from "../../seo/search-appearance";
import {
  CONCENTRATION_EXAMPLES,
  CONCENTRATION_ROWS,
  CONTAINER_TOTALS,
  FDA_SCALE_NOTE,
  ML_CAPACITY,
  ML_FAQS,
  ML_TO_UNITS_ROWS,
  ONE_PERCENT_LINE,
  OVERFILL_MISTAKE,
  PERCENT_DERIVATION,
  PERCENT_FAQS,
  PERCENT_REVERSE,
  PERCENT_ROWS,
  PERCENT_SLIPS,
  REVERSE_LINES,
  SECOND_TOTAL_CHECK,
  VOLUME_MASS_HEADERS,
  VOLUME_MASS_ROWS,
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

assert.deepEqual(
  PERCENT_ROWS.map((row) => [row.percent, row.gramsPer100Ml, row.mgPerMl, row.mcgPerMl, row.gramsPerLiter, row.labeled]),
  [
    ["0.1%", "0.1 g", "1 mg/mL", "1,000 mcg/mL", "1 g/L", false],
    ["0.45%", "0.45 g", "4.5 mg/mL", "4,500 mcg/mL", "4.5 g/L", false],
    ["0.5%", "0.5 g", "5 mg/mL", "5,000 mcg/mL", "5 g/L", false],
    ["0.9%", "0.9 g", "9 mg/mL", "9,000 mcg/mL", "9 g/L", true],
    ["1%", "1 g", "10 mg/mL", "10,000 mcg/mL", "10 g/L", false],
    ["1.1%", "1.1 g", "11 mg/mL", "11,000 mcg/mL", "11 g/L", true],
    ["2%", "2 g", "20 mg/mL", "20,000 mcg/mL", "20 g/L", false],
  ],
);
assert.equal(ONE_PERCENT_LINE, "Every 1% w/v is 1 g per 100 mL, which is 10 mg/mL.");
assert.deepEqual(PERCENT_DERIVATION.map((step) => `${step.lead} ${step.result}${step.note ? ` ${step.note}` : ""}`), [
  "0.9% w/v = 0.9 g in 100 mL",
  "0.9 g = 900 mg (1 g = 1,000 mg, NIST SI prefixes)",
  "900 mg ÷ 100 mL = 9 mg/mL",
]);
assert.deepEqual(PERCENT_REVERSE, [
  "9 mg/mL ÷ 10 = 0.9%",
  "11 mg/mL ÷ 10 = 1.1%",
  "4.5 mg/mL ÷ 10 = 0.45%",
]);
assert.equal(PERCENT_SLIPS, "reading 0.9% as 0.9 mg/mL (10 times too small) or as 90 mg/mL (10 times too big)");
assert.deepEqual(CONTAINER_TOTALS, [
  { presentation: "30 mL plastic vial, 9 mg/mL", volume: "30 mL", calculation: "30 × 9", total: "270 mg" },
  { presentation: "20 mL fill in a 30 mL glass vial, 11 mg/mL", volume: "20 mL", calculation: "20 × 11", total: "220 mg" },
]);
assert.equal(OVERFILL_MISTAKE, "30 × 11 = 330 mg");
assert.equal(SECOND_TOTAL_CHECK, "0.9% of 30 mL is 0.009 g/mL × 30 mL = 0.27 g = 270 mg");
assert.deepEqual(VOLUME_MASS_HEADERS, ["At 0.9% (9 mg/mL)", "At 1.1% (11 mg/mL)"]);
assert.deepEqual(
  VOLUME_MASS_ROWS.map((row) => [row.volume, row.atPointNine, row.atOnePointOne]),
  [
    ["0.5 mL", "4.5 mg", "5.5 mg"],
    ["1 mL", "9 mg", "11 mg"],
    ["2 mL", "18 mg", "22 mg"],
    ["3 mL", "27 mg", "33 mg"],
    ["5 mL", "45 mg", "55 mg"],
  ],
);
assert.deepEqual(PERCENT_FAQS.map((item) => item.a), [
  "9 mg/mL. 0.9 g per 100 mL is 900 mg ÷ 100 mL.",
  "11 mg/mL (1.1 × 10).",
  "Not by the number alone. The percent describes one ingredient's strength. BAC water is a finished, labeled product. See BAC water vs benzyl alcohol.",
  "270 mg (30 mL × 9 mg/mL), if the vial holds 30 mL of liquid. Always use the fill volume.",
  "No. U-100 units measure volume. On a U-100 scale 1 mL is 100 units whatever is dissolved in it. See the mL to units table.",
  "The math is one multiplication, shown above. To check concentration math with your own label numbers, use the BAC water calculator.",
]);

const PRESERVATIVE_PATH = "/learn/bac-water-preservative-percent";
assert.equal(SEARCH_SNIPPETS[PRESERVATIVE_PATH].title, "BAC Water Preservative Percent: 0.9% to mg/mL Math");
assert.equal(SEARCH_SNIPPETS[PRESERVATIVE_PATH].title.length, 50);
assert.equal(SEARCH_SNIPPETS[PRESERVATIVE_PATH].description, "Benzyl alcohol at 0.9% is 9 mg/mL and 1.1% is 11 mg/mL. Convert a label percent to mg/mL and total mg per vial, with worked tables. Math only.");
assert.equal(SEARCH_SNIPPETS[PRESERVATIVE_PATH].description.length, 142);
assert.equal(CODE_PUBLIC_PATHS.has(PRESERVATIVE_PATH), true);
assert.equal(analyticsLocation(PRESERVATIVE_PATH), "https://bacwater.ai/learn/article");
assert.equal(analyticsLocation(`${PRESERVATIVE_PATH}?mg=9`), null);
assert.equal(isClarityUrlAllowed(`https://bacwater.ai${PRESERVATIVE_PATH}`), true);
assert.equal(fs.readFileSync("src/lib/clarity.ts", "utf8").includes("bac-water-preservative-percent"), false);
assert.equal(fs.readFileSync("src/lib/analytics.ts", "utf8").includes("bac-water-preservative-percent"), false);

const pages = [
  "src/app/learn/ml-to-units-table/page.tsx",
  "src/app/learn/bac-water-concentration-table/page.tsx",
  "src/app/learn/bac-water-preservative-percent/page.tsx",
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
const preservativePage = fs.readFileSync(pages[2], "utf8");
assert.match(preservativePage, /pfizermedical\.com\/bacteriostatic-water/);
assert.match(preservativePage, /uspnf\.com\/sites\/default\/files\/usp_pdf\/EN\/USPNF\/generalNoticesandRequirementsFinal\.pdf/);
assert.match(preservativePage, /nist\.gov\/pml\/owm\/metric-si-prefixes/);
assert.match(preservativePage, /href="\/tools\/bac-water"/);
assert.equal(preservativePage.includes("/tools/bac-water?"), false);
assert.equal(/When the label liquid|6\.6|0\.66|final volume of/.test(preservativePage), false);
assert.equal(/\b(dose|dosing|inject|neonate|infant|patient|treatment)\b/i.test(preservativePage), false);
for (const href of ["/learn/bac-water-concentration-table", "/learn/ml-to-units-table", "/learn/what-is-bac-water", "/learn/vs/benzyl-alcohol", "/learn/vs/sodium-chloride", "/learn/mg-vs-mg-per-ml", "/tools/mg-to-mcg", "/methodology#concentration", "/learn/what-you-cannot-know"]) {
  assert.equal(preservativePage.includes(href), true, href);
}

console.log("OK   B4 tables match the draft exactly");
