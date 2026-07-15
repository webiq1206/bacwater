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

// ---- Validation guards (PRD §9.4) ----
function warns(res: { warnings: string[] }, needle: RegExp, label: string) {
  if (res.warnings.some((w) => needle.test(w))) {
    console.log(`OK   ${label}`);
  } else {
    console.error(`FAIL ${label}\n  no warning matched ${needle}\n  got ${JSON.stringify(res.warnings)}`);
    process.exitCode = 1;
  }
}
function noWarn(res: { warnings: string[] }, needle: RegExp, label: string) {
  if (res.warnings.some((w) => needle.test(w))) {
    console.error(`FAIL ${label}\n  unexpected warning matched ${needle}\n  got ${JSON.stringify(res.warnings)}`);
    process.exitCode = 1;
  } else {
    console.log(`OK   ${label}`);
  }
}

// V-02: the live 7.5-unit defect. 10 mg vial, 250 mcg, 3 mL, 1 mL syringe
// (marks every 2 units) => 7.5 units, between two marks.
const v02 = calculate({ peptideSlug: "bpc-157", vialStrengthMg: 10, doseMcg: 250, bacWaterMl: 3, syringeType: "insulin-1ml" });
near(v02.syringeUnits, 7.5, 0.001, "V-02 fixture computes 7.5 units");
warns(v02, /between two marks/, "V-02 flags 7.5 units as unmeasurable");

// A clean 10 units must NOT trip V-02.
noWarn(a, /between two marks/, "V-02 quiet when the amount lands on a mark");

// V-05: 250 mg dose (mg picked where mcg meant) => ~1,000x.
const v05 = calculate({ peptideSlug: "bpc-157", vialStrengthMg: 500, doseMcg: 250000, bacWaterMl: 2, syringeType: "insulin-1ml" });
warns(v05, /1,000 times/, "V-05 flags the mg/mcg unit swap");

// V-13: 5 mg dose (10x the studied high of 500 mcg).
const v13 = calculate({ peptideSlug: "bpc-157", vialStrengthMg: 50, doseMcg: 5000, bacWaterMl: 2, syringeType: "insulin-1ml" });
warns(v13, /10 times bigger/, "V-13 flags the order-of-magnitude outlier");

// Normal dose stays quiet on the magnitude guards.
noWarn(a, /times (bigger|smaller)|1,000 times/, "magnitude guards quiet on a normal dose");

function hasAssumption(res: { assumptions: string[] }, needle: RegExp, label: string) {
  if (res.assumptions.some((x) => needle.test(x))) console.log(`OK   ${label}`);
  else {
    console.error(`FAIL ${label}\n  no assumption matched ${needle}\n  got ${JSON.stringify(res.assumptions)}`);
    process.exitCode = 1;
  }
}

// V-04: 1 unit on a 1 mL barrel (marks every 2 units) is below the smallest mark.
const v04 = calculate({ vialStrengthMg: 5, doseMcg: 25, bacWaterMl: 2, syringeType: "insulin-1ml" });
warns(v04, /too small to measure/, "V-04 flags an amount below the smallest mark");

// V-07: 500 mg in 2 mL = 250 mg/mL, implausibly strong.
const v07 = calculate({ vialStrengthMg: 500, doseMcg: 1000, bacWaterMl: 2, syringeType: "insulin-1ml" });
warns(v07, /much stronger than usual/, "V-07 flags an implausible concentration");

// V-12: 308 mcg at 2.5 mg/mL = 12.32 units, rounded to 12.3.
const v12 = calculate({ vialStrengthMg: 5, doseMcg: 308, bacWaterMl: 2, syringeType: "insulin-1ml" });
hasAssumption(v12, /Rounded from/, "V-12 notes when a value was rounded");
// 10 units is exact, so no rounding note should appear.
if (!a.assumptions.some((x) => /Rounded from/.test(x))) console.log("OK   V-12 quiet when the value lands cleanly");
else { console.error("FAIL V-12 rounding note on an exact value", a.assumptions); process.exitCode = 1; }

// V-11: the compatibility caveat is always present.
hasAssumption(a, /have not checked that this BAC water works/, "V-11 compatibility caveat always shown");

if (process.exitCode !== 1) {
  console.log("\nAll calculation tests passed.");
}
