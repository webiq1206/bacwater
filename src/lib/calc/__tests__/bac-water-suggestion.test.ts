import assert from "node:assert/strict";
import { suggestBacWaterMl, mlText, unitsText } from "@/lib/calc/bac-water-suggestion";

let count = 0;
const test = (name: string, run: () => void) => { run(); count++; console.log(`PASS water suggestion: ${name}`); };

test("5 mg vial and 250 mcg dose suggests 2 mL for an even 10 units", () => {
  const s = suggestBacWaterMl(5, 250);
  assert.ok(s); assert.equal(s.ml, 2); assert.equal(s.units, 10); assert.equal(s.concentrationMgPerMl, 2.5); assert.equal(s.dosesPerVial, 20);
});
test("40 mg vial and 2 mg dose suggests 2 mL for 10 units", () => {
  const s = suggestBacWaterMl(40, 2000);
  assert.ok(s); assert.equal(s.ml, 2); assert.equal(s.units, 10); assert.equal(s.dosesPerVial, 20);
});
test("10 mg vial and 250 mcg dose suggests 2 mL for 5 whole units", () => {
  const s = suggestBacWaterMl(10, 250);
  assert.ok(s); assert.equal(s.ml, 2); assert.equal(s.units, 5);
});
test("2 mg vial and 250 mcg dose prefers a whole line over a half line", () => {
  const s = suggestBacWaterMl(2, 250);
  assert.ok(s); assert.equal(s.ml, 2); assert.equal(s.units, 25);
});
test("15 mg vial and 2.5 mg dose keeps the dose in the easy-to-read range", () => {
  const s = suggestBacWaterMl(15, 2500);
  assert.ok(s); assert.equal(s.ml, 1.5); assert.equal(s.units, 25);
});
test("the suggestion never exceeds 3 mL or falls below 1 mL", () => {
  for (const [vial, dose] of [[1, 10], [100, 50], [50, 25000], [0.5, 100], [20, 20]] as const) {
    const s = suggestBacWaterMl(vial, dose);
    assert.ok(s, `${vial} mg / ${dose} mcg`); assert.ok(s.ml >= 1 && s.ml <= 3, `${vial} mg / ${dose} mcg gave ${s.ml} mL`);
    assert.ok(Math.abs(s.units - (dose / 1000 / (vial / s.ml)) * 100) < 1e-9);
  }
});
test("a dose larger than the vial, zero, negative or non-finite input gives no suggestion", () => {
  assert.equal(suggestBacWaterMl(1, 2000), null);
  assert.equal(suggestBacWaterMl(0, 250), null);
  assert.equal(suggestBacWaterMl(5, 0), null);
  assert.equal(suggestBacWaterMl(-5, 250), null);
  assert.equal(suggestBacWaterMl(Number.NaN, 250), null);
  assert.equal(suggestBacWaterMl(5, Number.POSITIVE_INFINITY), null);
});
test("the suggestion is a function of the inputs only", () => {
  assert.deepEqual(suggestBacWaterMl(12, 300), suggestBacWaterMl(12, 300));
});
test("display helpers keep short, readable numbers", () => {
  assert.equal(mlText(2), "2"); assert.equal(mlText(1.5), "1.5"); assert.equal(mlText(0.08), "0.08");
  assert.equal(unitsText(10), "10"); assert.equal(unitsText(7.5), "7.5"); assert.equal(unitsText(8.333333), "8.3"); assert.equal(unitsText(0.08), "0.08"); assert.equal(unitsText(0.4), "0.4");
});
console.log(`${count} BAC water suggestion checks passed.`);
