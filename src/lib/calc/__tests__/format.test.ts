import assert from "node:assert/strict";
import { formatNumeric, trimZeros, formatDose, formatSyringeReading } from "../format";

for (const [input, expected] of [
  ["12.400", "12.4"], ["2.00", "2"], ["1000", "1000"],
  ["0.000", "0"], ["1.2500e+30", "1.25e+30"],
  ["1.25e+30", "1.25e+30"], ["1.2500e-30", "1.25e-30"],
  ["1.00E+100", "1E+100"], ["-1.250e+30", "-1.25e+30"],
]) assert.equal(trimZeros(input), expected);

// Exercise exponent boundaries and all public precision choices. Numbers here
// test software formatting only; they do not describe appropriate lab inputs.
for (const exponent of [-100, -40, -30, -20, -10, 0, 10, 20, 21, 30, 40, 100, 300]) {
  for (const sign of [-1, 1]) {
    const value = sign * 1.25 * 10 ** exponent;
    for (const precision of [0, 1, 2, 3, 4, 6, 8]) {
      const shown = Number(formatNumeric(value, precision));
      assert.ok(Number.isFinite(shown) && shown !== 0);
      // Fixed-decimal rounding has absolute error; scientific fallback has
      // relative error. Neither may alter an exponent by removing its zeros.
      const tolerance = Math.max(0.5 * 10 ** -precision, Math.abs(value) * 0.0005) + Number.EPSILON * Math.abs(value) * 4;
      assert.ok(Math.abs(shown - value) <= tolerance, `${value}, ${precision}: ${shown}`);
    }
  }
}
assert.equal(formatNumeric(1.25e30, 8), "1.25e+30");
assert.equal(formatNumeric(0, 8), "0");
assert.equal(formatNumeric(Infinity), "Unavailable");
assert.equal(formatNumeric(NaN), "Unavailable");
assert.equal(formatSyringeReading({ kind: "u100", valueRounded: 1.25e30 }), "1.25e+30 units");
assert.match(formatDose(1.25e33), /^1\.25e\+30 mg /);
console.log("PASS numeric display precision, exponent preservation, small nonzero results and shared formatter consumers.");
