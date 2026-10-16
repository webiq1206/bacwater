/**
 * Exact rational arithmetic for the two static B4 reference tables.
 * Every displayed table value is produced here. There is no floating-point
 * division, and nothing in this module reads an input or emits analytics.
 */

function gcd(a: bigint, b: bigint): bigint {
  let x = a < BigInt(0) ? -a : a;
  let y = b < BigInt(0) ? -b : b;
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export class Fraction {
  readonly n: bigint;
  readonly d: bigint;

  constructor(n: bigint, d: bigint) {
    if (d === BigInt(0)) throw new Error("zero denominator");
    if (d < BigInt(0)) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.n = n / g;
    this.d = d / g;
  }

  /** Parse a non-negative decimal such as "0.3" or "10" as an exact fraction. */
  static fromDecimal(text: string): Fraction {
    if (!/^\d+(\.\d+)?$/.test(text)) throw new Error(`not a decimal: ${text}`);
    const [whole, frac = ""] = text.split(".");
    const den = BigInt(10) ** BigInt(frac.length);
    return new Fraction(BigInt(whole + frac), den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.n * other.n, this.d * other.d);
  }

  div(other: Fraction): Fraction {
    return new Fraction(this.n * other.d, this.d * other.n);
  }

  eq(other: Fraction): boolean {
    return this.n === other.n && this.d === other.d;
  }
}

const HUNDRED = new Fraction(BigInt(100), BigInt(1));
const THOUSAND = new Fraction(BigInt(1000), BigInt(1));

function groupInteger(value: bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Terminating decimal, or null when the reduced denominator has a prime other than 2 or 5. */
export function formatTerminating(value: Fraction): string | null {
  let den = value.d;
  let twos = 0;
  let fives = 0;
  while (den % BigInt(2) === BigInt(0)) {
    den /= BigInt(2);
    twos += 1;
  }
  while (den % BigInt(5) === BigInt(0)) {
    den /= BigInt(5);
    fives += 1;
  }
  if (den !== BigInt(1)) return null;
  const digits = Math.max(twos, fives);
  if (digits === 0) return groupInteger(value.n);
  const scale = twos > fives ? BigInt(5) ** BigInt(twos - fives) : BigInt(2) ** BigInt(fives - twos);
  const scaled = (value.n * scale).toString().padStart(digits + 1, "0");
  const intPart = scaled.slice(0, scaled.length - digits).replace(/^0+(?=\d)/, "");
  const fracPart = scaled.slice(scaled.length - digits).replace(/0+$/, "");
  const grouped = groupInteger(BigInt(intPart));
  return fracPart ? `${grouped}.${fracPart}` : grouped;
}

/** One-digit repeating expansion, written as the draft does: "5/3 = 1.666…". */
function formatRepeating(value: Fraction): string {
  const intPart = value.n / value.d;
  let rem = value.n % value.d;
  const seen = new Map<bigint, number>();
  const digits: string[] = [];
  while (rem !== BigInt(0)) {
    if (seen.has(rem)) {
      const start = seen.get(rem)!;
      if (start !== 0 || digits.length - start !== 1) {
        throw new Error(`unexpected expansion ${value.n}/${value.d}`);
      }
      const digit = digits[0];
      return `${value.n}/${value.d} = ${groupInteger(intPart)}.${digit}${digit}${digit}…`;
    }
    seen.set(rem, digits.length);
    rem *= BigInt(10);
    digits.push((rem / value.d).toString());
    rem %= value.d;
  }
  throw new Error(`terminating value passed to repeating formatter: ${value.n}/${value.d}`);
}

export function formatMgPerMl(value: Fraction): string {
  const terminating = formatTerminating(value);
  return terminating ? `${terminating} mg/mL` : `${formatRepeating(value)} mg/mL`;
}

export interface MlRow {
  volume: string;
  calculation: string;
  units: string;
  capacity: string;
  /** Exact U-100 unit count, used to cross-check the reverse rows. */
  unitsExact: bigint;
  ml: Fraction;
}

const ML_DECIMALS = ["0.3", "0.5", "1", "1.5", "2", "2.5", "3", "4", "5", "10"] as const;

export const ML_TO_UNITS_ROWS: MlRow[] = ML_DECIMALS.map((decimal) => {
  const ml = Fraction.fromDecimal(decimal);
  const units = ml.mul(HUNDRED);
  if (units.d !== BigInt(1)) throw new Error(`non-integral units for ${decimal} mL`);
  const shown = formatTerminating(ml);
  if (shown !== decimal) throw new Error(`decimal drift for ${decimal}: ${shown}`);
  return {
    volume: `${decimal} mL`,
    calculation: `${decimal} × 100`,
    units: `${groupInteger(units.n)} units`,
    capacity: ml.eq(new Fraction(BigInt(1), BigInt(1))) ? "exactly its capacity" : `${decimal} × its capacity`,
    unitsExact: units.n,
    ml,
  };
});

function mlRow(decimal: string): MlRow {
  const row = ML_TO_UNITS_ROWS.find((item) => item.volume === `${decimal} mL`);
  if (!row) throw new Error(`missing mL row ${decimal}`);
  return row;
}

export const REVERSE_LINES = (["300", "250", "500"] as const).map((unitsText) => {
  const units = new Fraction(BigInt(unitsText), BigInt(1));
  const ml = units.div(HUNDRED);
  const shown = formatTerminating(ml);
  if (!shown) throw new Error(`reverse did not terminate for ${unitsText}`);
  const match = ML_TO_UNITS_ROWS.find((row) => row.unitsExact === units.n && row.ml.eq(ml));
  if (!match) throw new Error(`reverse ${unitsText} does not match a table row`);
  return `${groupInteger(units.n)} units ÷ 100 = ${shown} mL`;
});

const oneMlUnits = mlRow("1").unitsExact;
const twoMlUnits = mlRow("2").unitsExact;
if (twoMlUnits !== oneMlUnits * BigInt(2)) throw new Error("2 mL is not twice a 1 mL U-100 capacity");

const quarterMl = Fraction.fromDecimal("0.25");
const twoMgPerMl = Fraction.fromDecimal("2");
const quarterMass = quarterMl.mul(twoMgPerMl);
const quarterMassText = formatTerminating(quarterMass);
if (!quarterMassText) throw new Error("0.25 mL × 2 mg/mL did not terminate");

export const ML_FAQS: { q: string; a: string }[] = [
  {
    q: "How many units is 1 mL of BAC water?",
    a: `${mlRow("1").units} on a U-100 scale (${mlRow("1").calculation}). The liquid doesn't change the conversion.`,
  },
  {
    q: "How many units is 2 mL?",
    a: `${groupInteger(twoMlUnits)} U-100 units (${mlRow("2").calculation}). That is twice the capacity of a 1 mL U-100 syringe.`,
  },
  {
    q: "How many units is 3 mL?",
    a: `${groupInteger(mlRow("3").unitsExact)} U-100 units (${mlRow("3").calculation}).`,
  },
  {
    q: "How many units is 5 mL?",
    a: `${groupInteger(mlRow("5").unitsExact)} U-100 units (${mlRow("5").calculation}).`,
  },
  {
    q: "Is 1 cc the same as 1 mL?",
    a: `Yes. NIST defines the milliliter as one cubic centimeter, so 1 cc = 1 mL = ${groupInteger(oneMlUnits)} U-100 units.`,
  },
  {
    q: "Can I turn units into mg?",
    a: `Not from units alone. Units measure volume. To get a mass you also need the concentration in mg/mL: mass (mg) = volume (mL) × concentration (mg/mL). For example, ${formatTerminating(quarterMl)} mL at ${formatTerminating(twoMgPerMl)} mg/mL is ${quarterMassText} mg. That is illustrative arithmetic, not an amount to use. Read mg vs mg/mL or use the amount-to-volume tool.`,
  },
  {
    q: "Does this apply to U-40 or plain mL markings?",
    a: "No. The ×100 rule only works on a U-100 scale. Read the markings on the actual device. Product IU numbers are not syringe units, so don't enter them as U-100 values. See what syringe units mean.",
  },
];

const fiveUnits = new Fraction(BigInt(5), BigInt(1)).div(HUNDRED);
const fiveUnitsMl = formatTerminating(fiveUnits);
if (fiveUnitsMl !== "0.05") throw new Error("5 U-100 units is not 0.05 mL");

export const FDA_SCALE_NOTE = `Describes a U-100 (1 mL) syringe, where 5 units is ${fiveUnitsMl} mL, and reported confusion between mL, mg and units.`;

export const ML_CAPACITY = {
  twoMl: mlRow("2").units,
  oneMl: mlRow("1").units,
  holdsPointThree: mlRow("0.3").units,
  holdsPointFive: mlRow("0.5").units,
};

const VIAL_AMOUNTS = ["5", "10", "20", "30", "50"] as const;
const FINAL_VOLUMES = ["1", "2", "3", "4", "5"] as const;

export function concentrationCell(amountMg: string, volumeMl: string): string {
  return formatMgPerMl(Fraction.fromDecimal(amountMg).div(Fraction.fromDecimal(volumeMl)));
}

export const CONCENTRATION_COLUMNS = FINAL_VOLUMES.map((volume) => `in ${volume} mL`);

export const CONCENTRATION_ROWS = VIAL_AMOUNTS.map((amount) => ({
  amount: `${formatTerminating(Fraction.fromDecimal(amount))} mg`,
  cells: FINAL_VOLUMES.map((volume) => concentrationCell(amount, volume)),
}));

const tenInTwo = Fraction.fromDecimal("10").div(Fraction.fromDecimal("2"));
const tenInFour = Fraction.fromDecimal("10").div(Fraction.fromDecimal("4"));
const enteredMcg = Fraction.fromDecimal("400");
const enteredMg = enteredMcg.div(THOUSAND);
const measuredMl = enteredMg.div(tenInTwo);
const measuredUnits = measuredMl.mul(HUNDRED);
if (measuredUnits.d !== BigInt(1)) throw new Error("methodology chain units are not integral");

function mustFormat(value: Fraction, label: string): string {
  const shown = formatTerminating(value);
  if (shown == null) throw new Error(`non-terminating ${label}: ${value.n}/${value.d}`);
  return shown;
}

const TEN = new Fraction(BigInt(10), BigInt(1));
const PERCENT_DECIMALS = ["0.1", "0.45", "0.5", "0.9", "1", "1.1", "2"] as const;
const LABELED_PERCENTS = new Set(["0.9", "1.1"]);

export interface PercentRow {
  percent: string;
  gramsPer100Ml: string;
  mgPerMl: string;
  mcgPerMl: string;
  gramsPerLiter: string;
  /** True for the two strengths printed beside a percent on the cited labeling. */
  labeled: boolean;
}

export const PERCENT_ROWS: PercentRow[] = PERCENT_DECIMALS.map((decimal) => {
  const percent = Fraction.fromDecimal(decimal);
  const gramsPer100Ml = percent;
  const mgPerMl = percent.mul(TEN);
  const fromDefinition = gramsPer100Ml.mul(THOUSAND).div(HUNDRED);
  if (!fromDefinition.eq(mgPerMl)) throw new Error(`×10 drift for ${decimal}%`);
  const mcgPerMl = mgPerMl.mul(THOUSAND);
  const gramsPerLiter = mgPerMl;
  return {
    percent: `${mustFormat(percent, decimal)}%`,
    gramsPer100Ml: `${mustFormat(gramsPer100Ml, `${decimal} g`)} g`,
    mgPerMl: `${mustFormat(mgPerMl, `${decimal} mg/mL`)} mg/mL`,
    mcgPerMl: `${mustFormat(mcgPerMl, `${decimal} mcg/mL`)} mcg/mL`,
    gramsPerLiter: `${mustFormat(gramsPerLiter, `${decimal} g/L`)} g/L`,
    labeled: LABELED_PERCENTS.has(decimal),
  };
});

function percentRow(decimal: string): PercentRow {
  const row = PERCENT_ROWS.find((item) => item.percent === `${decimal}%`);
  if (!row) throw new Error(`missing percent row ${decimal}`);
  return row;
}

const onePercent = percentRow("1");
if (onePercent.gramsPer100Ml !== "1 g" || onePercent.mgPerMl !== "10 mg/mL") {
  throw new Error("1% w/v is not 1 g per 100 mL and 10 mg/mL");
}

export const ONE_PERCENT_LINE = `Every 1% w/v is ${onePercent.gramsPer100Ml} per 100 mL, which is ${onePercent.mgPerMl}.`;

const pointNine = Fraction.fromDecimal("0.9");
const pointNineGrams = pointNine;
const pointNineMg = pointNineGrams.mul(THOUSAND);
const pointNinePerMl = pointNineMg.div(HUNDRED);
if (!pointNinePerMl.eq(pointNine.mul(TEN))) throw new Error("0.9% derivation does not match ×10");

export const PERCENT_DERIVATION = [
  { lead: `${mustFormat(pointNine, "0.9")}% w/v =`, result: `${mustFormat(pointNineGrams, "0.9 g")} g in 100 mL` },
  { lead: `${mustFormat(pointNineGrams, "0.9 g")} g =`, result: `${mustFormat(pointNineMg, "900 mg")} mg`, note: `(1 g = ${mustFormat(THOUSAND, "1000")} mg, NIST SI prefixes)` },
  { lead: `${mustFormat(pointNineMg, "900 mg")} mg ÷ 100 mL =`, result: `${mustFormat(pointNinePerMl, "9 mg/mL")} mg/mL` },
];

const REVERSE_PERCENTS = ["9", "11", "4.5"] as const;
export const PERCENT_REVERSE = REVERSE_PERCENTS.map((mgText) => {
  const mg = Fraction.fromDecimal(mgText);
  const percent = mg.div(TEN);
  const shown = mustFormat(percent, `${mgText} reverse`);
  const match = PERCENT_ROWS.find((row) => row.percent === `${shown}%` && row.mgPerMl === `${mustFormat(mg, mgText)} mg/mL`);
  if (!match) throw new Error(`reverse ${mgText} mg/mL does not match a table row`);
  return `${match.mgPerMl} ÷ 10 = ${match.percent}`;
});

const ninePerMl = Fraction.fromDecimal("9");
const misreadSmall = pointNine;
const misreadLarge = ninePerMl.mul(TEN);
if (!ninePerMl.div(misreadSmall).eq(TEN) || !misreadLarge.div(ninePerMl).eq(TEN)) {
  throw new Error("decimal-point slips are not exactly tenfold");
}

export const PERCENT_SLIPS = `reading ${mustFormat(pointNine, "0.9")}% as ${mustFormat(misreadSmall, "0.9 mg")} mg/mL (${mustFormat(TEN, "10")} times too small) or as ${mustFormat(misreadLarge, "90 mg")} mg/mL (${mustFormat(TEN, "10")} times too big)`;

export interface ContainerTotal {
  presentation: string;
  volume: string;
  calculation: string;
  total: string;
}

function containerTotal(volumeMl: string, mgPerMl: string, presentation: string): ContainerTotal {
  const volume = Fraction.fromDecimal(volumeMl);
  const concentration = Fraction.fromDecimal(mgPerMl);
  const total = volume.mul(concentration);
  if (total.d !== BigInt(1)) throw new Error(`non-integral total for ${presentation}`);
  return {
    presentation,
    volume: `${mustFormat(volume, volumeMl)} mL`,
    calculation: `${mustFormat(volume, volumeMl)} × ${mustFormat(concentration, mgPerMl)}`,
    total: `${mustFormat(total, presentation)} mg`,
  };
}

const nineText = mustFormat(ninePerMl, "9");
const elevenText = mustFormat(Fraction.fromDecimal("1.1").mul(TEN), "11");
export const CONTAINER_TOTALS: ContainerTotal[] = [
  containerTotal("30", nineText, `30 mL plastic vial, ${nineText} mg/mL`),
  containerTotal("20", elevenText, `20 mL fill in a 30 mL glass vial, ${elevenText} mg/mL`),
];

const wrongFill = Fraction.fromDecimal("30").mul(Fraction.fromDecimal(elevenText));
export const OVERFILL_MISTAKE = `30 × ${elevenText} = ${mustFormat(wrongFill, "overfill")} mg`;

const gramsPerMl = pointNine.div(HUNDRED);
const gramsInThirty = gramsPerMl.mul(Fraction.fromDecimal("30"));
const mgInThirty = gramsInThirty.mul(THOUSAND);
if (mustFormat(mgInThirty, "second check") !== CONTAINER_TOTALS[0].total.replace(" mg", "")) {
  throw new Error("0.9% of 30 mL does not match the 9 mg/mL total");
}
export const SECOND_TOTAL_CHECK = `${mustFormat(pointNine, "0.9")}% of 30 mL is ${mustFormat(gramsPerMl, "g/mL")} g/mL × 30 mL = ${mustFormat(gramsInThirty, "g")} g = ${mustFormat(mgInThirty, "mg")} mg`;

const SAMPLE_VOLUMES = ["0.5", "1", "2", "3", "5"] as const;
const atNine = Fraction.fromDecimal(nineText);
const atEleven = Fraction.fromDecimal(elevenText);

export interface VolumeMassRow {
  volume: string;
  atPointNine: string;
  atOnePointOne: string;
}

export const VOLUME_MASS_ROWS: VolumeMassRow[] = SAMPLE_VOLUMES.map((decimal) => {
  const volume = Fraction.fromDecimal(decimal);
  return {
    volume: `${mustFormat(volume, decimal)} mL`,
    atPointNine: `${mustFormat(volume.mul(atNine), `${decimal} at 0.9`)} mg`,
    atOnePointOne: `${mustFormat(volume.mul(atEleven), `${decimal} at 1.1`)} mg`,
  };
});

export const VOLUME_MASS_HEADERS = [
  `At ${percentRow("0.9").percent} (${percentRow("0.9").mgPerMl})`,
  `At ${percentRow("1.1").percent} (${percentRow("1.1").mgPerMl})`,
] as const;

const oneMlUnitsText = groupInteger(mlRow("1").unitsExact);
const thirtyTotal = CONTAINER_TOTALS[0];

export const PERCENT_FAQS: { q: string; a: string }[] = [
  {
    q: "What does 0.9% benzyl alcohol mean in mg/mL?",
    a: `${percentRow("0.9").mgPerMl}. ${PERCENT_DERIVATION[0].result.replace(" in 100 mL", " per 100 mL")} is ${PERCENT_DERIVATION[1].result} ÷ 100 mL.`,
  },
  {
    q: "What does 1.1% mean in mg/mL?",
    a: `${percentRow("1.1").mgPerMl} (1.1 × 10).`,
  },
  {
    q: "Is \"0.9% benzyl alcohol\" the same thing as BAC water?",
    a: "Not by the number alone. The percent describes one ingredient's strength. BAC water is a finished, labeled product. See BAC water vs benzyl alcohol.",
  },
  {
    q: "How much benzyl alcohol is in a 30 mL vial at 0.9%?",
    a: `${thirtyTotal.total} (${thirtyTotal.volume} × ${percentRow("0.9").mgPerMl}), if the vial holds ${thirtyTotal.volume} of liquid. Always use the fill volume.`,
  },
  {
    q: "Does the percent change the U-100 units reading?",
    a: `No. U-100 units measure volume. On a U-100 scale 1 mL is ${oneMlUnitsText} units whatever is dissolved in it. See the mL to units table.`,
  },
  {
    q: "Is there a calculator for this?",
    a: "The math is one multiplication, shown above. To check concentration math with your own label numbers, use the BAC water calculator.",
  },
];

export const CONCENTRATION_EXAMPLES = {
  same: [
    `10 mg in 2 mL = ${formatMgPerMl(tenInTwo)}`,
    `20 mg in 4 mL = ${concentrationCell("20", "4")}`,
    `5 mg in 1 mL = ${concentrationCell("5", "1")}`,
  ],
  dilution: {
    twoMl: formatMgPerMl(tenInTwo),
    fourMl: formatMgPerMl(tenInFour),
    total: `${formatTerminating(Fraction.fromDecimal("10"))} mg`,
  },
  mcg: [
    `${formatMgPerMl(tenInTwo).replace(" mg/mL", "")} mg/mL = ${groupInteger((tenInTwo.mul(THOUSAND)).n)} mcg/mL`,
    `${formatMgPerMl(tenInFour).replace(" mg/mL", "")} mg/mL = ${groupInteger((tenInFour.mul(THOUSAND)).n)} mcg/mL`,
  ],
  repeating: concentrationCell("5", "3"),
  chain: [
    `10 mg ÷ 2 mL = ${formatMgPerMl(tenInTwo)}`,
    `${groupInteger(enteredMcg.n)} mcg = ${formatTerminating(enteredMg)} mg (÷ ${groupInteger(THOUSAND.n)})`,
    `${formatTerminating(enteredMg)} mg ÷ ${formatMgPerMl(tenInTwo)} = ${formatTerminating(measuredMl)} mL`,
    `${formatTerminating(measuredMl)} mL × 100 = ${groupInteger(measuredUnits.n)} units on a U-100 scale`,
  ],
};
