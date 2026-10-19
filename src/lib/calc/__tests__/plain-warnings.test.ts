import assert from "node:assert/strict";
import { calculate } from "@/lib/calc";
import { plainWarning, plainWarnings } from "@/lib/calc/plain-warnings";

let count = 0;
const test = (name: string, run: () => void) => { run(); count++; console.log(`PASS plain warnings: ${name}`); };

test("every engine warning on a typical mistake maps to one plain sentence without jargon", () => {
  const cases = [
    calculate({ vialStrengthMg: 2, doseMcg: 5000, bacWaterMl: 1, syringeType: "insulin-1ml" }),
    calculate({ vialStrengthMg: 10, doseMcg: 250, bacWaterMl: 3, syringeType: "insulin-1ml" }),
    calculate({ vialStrengthMg: 5, doseMcg: 12.5, bacWaterMl: 2, syringeType: "insulin-1ml" }),
    calculate({ vialStrengthMg: 5, doseMcg: 4000, bacWaterMl: 2, syringeType: "insulin-0.3ml" }),
    calculate({ vialStrengthMg: 500, doseMcg: 1000, bacWaterMl: 2, syringeType: "insulin-1ml" }),
    calculate({ vialStrengthMg: 5, doseMcg: 250, bacWaterMl: 8, syringeType: "insulin-1ml" }),
  ];
  for (const result of cases) for (const warning of result.warnings) {
    const plain = plainWarning(warning);
    assert.notEqual(plain, warning, warning);
    assert.doesNotMatch(plain, /threshold|graduation|illustration|preparation|software|clinical/i, plain);
    assert.ok(plain.length < 170, plain);
  }
});
test("the between-lines warning keeps the unit count", () => {
  const r = calculate({ vialStrengthMg: 10, doseMcg: 250, bacWaterMl: 3, syringeType: "insulin-1ml" });
  assert.ok(plainWarnings(r.warnings).some(w => w.startsWith("7.5 units lands between two lines")));
});
test("unknown warnings pass through and duplicates collapse", () => {
  assert.equal(plainWarning("Something new."), "Something new.");
  assert.deepEqual(plainWarnings(["Something new.", "Something new."]), ["Something new."]);
});
console.log(`${count} plain warning checks passed.`);
