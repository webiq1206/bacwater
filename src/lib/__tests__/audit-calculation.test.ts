import assert from "node:assert/strict";
import { calculate, type CalcInput } from "../calc";
import { formatNumeric } from "../calc/format";
const base: CalcInput = { vialStrengthMg: 5, doseMcg: 250, bacWaterMl: 2, syringeType: "insulin-1ml" };
for (const bad of [0, -1, Infinity, NaN]) {
  assert.ok(calculate({ ...base, bacWaterMl: bad }).errors.length);
  assert.ok(calculate({ ...base, vialStrengthMg: bad }).errors.length);
}
assert.ok(calculate({ ...base, injectionsPerWeek: 1.5 }).errors.length);
assert.ok(calculate({ ...base, dateMixed: "invalid" }).errors.length);
assert.equal(calculate({ ...base, peptideSlug: "bpc-157" }).schedule?.injectionsPerWeek, 1);
assert.equal(calculate({ ...base, peptideSlug: "retatrutide" }).schedule?.injectionsPerWeek, 1);
assert.equal(calculate({ ...base, dateMixed: "2026-09-21" }).expiration.date, null);
const small = calculate({ ...base, doseMcg: 12.5 });
assert.ok(small.warnings.some((w) => w.includes("More water increases")));
assert.ok(!small.warnings.some((w) => /[Uu]se less BAC water/.test(w)));
assert.ok(calculate({ ...base, doseMcg: 12.5, bacWaterMl: 4 }).syringeUnits > small.syringeUnits);
assert.equal(calculate({ ...base, secondary: { vialStrengthMg: 10 } }).secondary?.companionDoseMcg, 500);
assert.ok(calculate({ ...base, bacWaterMl: Number.MIN_VALUE }).errors.length);
assert.ok(!calculate(base).instructions.some((s) => s.includes("injection site")));
// Accepted software-boundary inputs can produce a very large result that must
// retain its exponent, including in the capacity warning. This is not a usable
// preparation: the existing amount/capacity warnings must remain visible.
const large = calculate({ ...base, vialStrengthMg: 1e-12, doseMcg: 1.25e11, bacWaterMl: 1e10 });
assert.equal(large.errors.length, 0);
assert.ok(Math.abs(Number(formatNumeric(large.doseVolumeMl, 3)) / 1.25e30 - 1) < 1e-14);
assert.match(large.summary, /e\+30 mL/);
assert.ok(large.warnings.some(w => /e\+30 mL.*exceeds the capacity/.test(w)));
console.log("Calculation boundary and stability regressions passed.");
