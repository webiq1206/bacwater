/**
 * Simple assertion-based tests. Run with: `npx tsx src/lib/calc/__tests__/calc.test.ts`
 * Kept dependency-free so it also runs cleanly on Replit.
 */

import { calculate, recommendBacWaterMl } from "@/lib/calc";

function eq(actual: unknown, expected: unknown, label: string) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) {
    console.error(`FAIL ${label}\n  expected ${JSON.stringify(expected)}\n  got      ${JSON.stringify(actual)}`);
    process.exitCode = 1;
  } else {
    console.log(`OK   ${label}`);
  }
}

function near(actual: number, expected: number, delta: number, label: string) {
  const pass = Math.abs(actual - expected) <= delta;
  if (!pass) {
    console.error(`FAIL ${label}\n  expected ~${expected} ±${delta}\n  got      ${actual}`);
    process.exitCode = 1;
  } else {
    console.log(`OK   ${label}`);
  }
}

// 5 mg vial + 2 mL BAC + 250 mcg dose on 1mL insulin => 10 units, 25 doses
const a = calculate({
  peptideSlug: "bpc-157",
  vialStrengthMg: 5,
  doseMcg: 250,
  bacWaterMl: 2,
  syringeType: "insulin-1ml",
  dateMixed: "2026-07-01",
});
near(a.finalConcentrationMgPerMl, 2.5, 0.001, "5mg/2mL = 2.5 mg/mL");
near(a.doseVolumeMl, 0.1, 0.001, "250mcg dose = 0.1 mL");
near(a.syringeUnits, 10, 0.001, "250mcg dose = 10 units on U-100");
eq(a.dosesPerVial, 20, "5mg vial / 250mcg = 20 doses");

// 10 mg vial + 1 mL BAC + 500 mcg on insulin-0.5 => 5 units, 20 doses
const b = calculate({
  vialStrengthMg: 10,
  doseMcg: 500,
  bacWaterMl: 1,
  syringeType: "insulin-0.5ml",
});
near(b.finalConcentrationMgPerMl, 10, 0.001, "10mg/1mL = 10 mg/mL");
near(b.doseVolumeMl, 0.05, 0.001, "500mcg / 10mg/mL = 0.05 mL");
near(b.syringeUnits, 5, 0.001, "500mcg = 5 units");
eq(b.dosesPerVial, 20, "10mg / 500mcg = 20 doses");

// Recommendation: 5mg vial + 250mcg dose targets 2 mL
near(recommendBacWaterMl(5, 250), 2, 0.001, "Recommendation 5mg/250mcg = 2mL");

// Warning fires when dose > vial
const c = calculate({
  vialStrengthMg: 2,
  doseMcg: 5000,
  bacWaterMl: 1,
  syringeType: "insulin-1ml",
});
if (!c.warnings.some((w) => w.includes("larger than the vial"))) {
  console.error("FAIL warning missing for dose > vial");
  process.exitCode = 1;
} else {
  console.log("OK   warns when dose > vial");
}

// Expiration date arithmetic
const d = calculate({
  peptideSlug: "bpc-157",
  vialStrengthMg: 5,
  doseMcg: 250,
  bacWaterMl: 2,
  syringeType: "insulin-1ml",
  dateMixed: "2026-07-01",
});
if (!d.expiration.date || !d.expiration.date.startsWith("2026-07-31")) {
  console.error(`FAIL expiration date wrong, got ${d.expiration.date}`);
  process.exitCode = 1;
} else {
  console.log("OK   expiration date = mix + 30 days for BPC-157");
}

if (process.exitCode !== 1) {
  console.log("\nAll calculation tests passed.");
}
