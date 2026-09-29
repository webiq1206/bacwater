import { createHash } from "node:crypto";
import { EDITORIAL_REVISIONS } from "./editorial-revisions";

/** Reading layer for known, reviewed defaults. Never overwrite a separately edited article. */
export const PLAIN_ARTICLES:Readonly<Record<string,string>>={
 "what-is-bac-water":`BAC water is short for bacteriostatic water. It contains a preservative, an added chemical that slows the growth of bacteria. Its name does not tell you whether it can be mixed with another product.

## Read the exact label

[Pfizer’s label](https://www.pfizermedical.com/bacteriostatic-water) lists water products with either 0.9% or 1.1% benzyl alcohol. Benzyl alcohol is the preservative. Check the container instead of assuming that all BAC water has the same amount.

## What the math can tell you

Concentration means how much material is in each amount of liquid. For example, 12 mg spread evenly through a final 3 mL gives 4 mg in each mL. This is a math example, not a mixing instruction.

The [calculator](/tools/bac-water) checks numbers you already have. It cannot choose a liquid, show that a mixture is free of germs or prove that a product stays unchanged.

Read the [water comparison](/learn/vs/sterile-water), [storage guide](/learn/bac-water-shelf-life) and [limits of a calculation](/learn/what-you-cannot-know) for those separate questions.`,
 "how-peptide-reconstitution-works":`Reconstitution means adding the liquid named in the instructions to a dry product that needs it. The calculator does not choose the liquid or how much to add. It checks how much material is in each mL.

## Divide the amount by the final liquid volume

Concentration in mg/mL = total mg ÷ final mL.

For example, 8 mg spread evenly through 4 mL gives 2 mg in each mL. The same 8 mg in 2 mL gives 4 mg in each mL. The total material stays the same. These are math examples, not instructions to mix a product.

## Final volume means all the liquid at the end

An amount of liquid added is not always the same as the final amount of liquid. Follow the exact product instructions. The math cannot choose a liquid or check whether materials can be mixed.

## Use concentration to check another number

If an amount is already given as 0.2 mg and the concentration is 2 mg/mL, divide 0.2 by 2. That gives 0.1 mL. On a U-100 scale, 0.1 mL is 10 units. This does not choose 0.2 mg as an amount to use.

See [mg and mcg](/tools/mg-to-mcg), the [amount-to-volume tool](/tools/dose) and [how the math works](/methodology).`,
 "how-to-read-a-peptide-vial":`Keep each number with its unit. Total mg tells you how much material is listed. mg/mL tells you how much is in each mL of liquid. They are not the same thing.

## Three label examples

| Example label | What it tells you | What to check next |
|---|---|---|
| 10 mg total | Total amount of material | Final liquid amount to find mg/mL |
| 10 mg/mL | Amount in each mL | The separate amount already given to measure |
| 10 mg in 2 mL | Total material and liquid | 10 ÷ 2 gives 5 mg/mL |

These examples explain labels. They do not choose an amount to use or check the contents of a vial.

## Keep a record

Copy the full product name, amount and unit. Keep the original label and batch number. If numbers disagree, ask for clarification. Do not choose the number that gives an easier answer.

## mg, mcg and IU differ

One mg equals 1,000 mcg. Both measure mass, or how much material there is. IU measures an effect in a standard test. There is no one mg-to-IU rule for every substance. Product IU also differs from U-100 scale markings, which describe liquid volume.

Use the [unit converter](/tools/mg-to-mcg) and read [what the calculator cannot check](/learn/what-you-cannot-know).`,
 "how-to-use-an-insulin-syringe":`The actual device instructions explain how to use a syringe. This page explains its scale and the numbers a calculator needs. It is not an injection guide.

## Check the scale name

U-100 means 100 scale units equals 1 mL. A 0.3 mL U-100 syringe holds up to 30 units on that scale. This does not mean it has exactly 30 printed lines.

## Check the gaps between marks

Capacity means how much a device holds. It does not tell you how far apart its marks are. Check the smallest gap on the actual scale.

For example, 7.5 units may land on a mark on one device and between marks on another. A drawing on a website cannot check the device in front of you. Do not change a product’s instructions to make a mark fit.

## Math cannot check handling

[CDC guidance](https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html) explains why needles and syringes are single-use and why handling must prevent germs from entering. Correct math cannot check those conditions.

See the [scale-reading example](/learn/how-to-read-an-insulin-syringe), [U-100 converter](/tools/syringe-units) and [size comparison](/learn/insulin-syringe-sizes).`,
 "what-syringe-units-mean":`U-100 markings tell you an amount of liquid. On that scale, 100 units equals 1 mL. They do not tell you how many mg of material are in the liquid.

## First find mL

Divide U-100 units by 100. For example, 25 units is 0.25 mL. This rule only applies to the U-100 scale.

## Then use the amount in each mL

Concentration means the amount in each mL. Multiply mL by the known mg/mL to find mg.

At 2 mg/mL, 0.25 mL contains 0.5 mg. At 4 mg/mL, that same liquid amount contains 1 mg. The scale mark stays the same, but the amount of material changes.

These are math examples. They do not choose a dose.

## Product IU is different

International units, or IU, measure an effect in a standard test. They do not describe liquid volume. Do not put an IU number into a U-100 field.

Use the [U-100 converter](/tools/syringe-units), [amount-to-volume tool](/tools/dose) and [formula guide](/methodology).`,
 "how-to-store-reconstituted-peptides":`A name alone cannot tell you how to store a mixed peptide or how long it lasts. The exact product needs its own instructions. A calculation cannot check for germs or chemical changes.

## What to check on the label

Look for the storage temperature, light protection, limits after opening and date to throw it away. A date for an unopened container is not automatically the date for an opened one or a new mixture.

## Do not copy another product’s time limit

Two products can share a chemical name but have different liquids, containers or other ingredients. That can change their storage needs. A generic chart cannot check those details.

For compounded GLP-1 medicines, also check [current FDA information](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss) and ask the dispensing pharmacist. Do not extend a date based on an online example.

## A saved date is just a record

The planner can record a mixing date. It does not start a safe-use countdown. [Printed labels](/tools/vial-labels) keep your numbers together; they do not approve storage.

Read the [BAC water storage guide](/learn/bac-water-shelf-life) separately. Clear liquid is not proof that a product is free of germs or unchanged.`,
 "how-long-bac-water-lasts":`The unopened date, opened-container limit and storage time for a mixture are separate questions. Check the exact label and current guidance. A calculator cannot set a safe date to throw a product away. Read the full [BAC water storage guide](/learn/bac-water-shelf-life).`,
 "bac-water-vs-sterile-water":`BAC water has a preservative, an added chemical that slows bacterial growth. Sterile Water for Injection does not have that added preservative. Neither name tells you that the water works with every other product. Read the exact label and the [water comparison](/learn/vs/sterile-water).`,
 "common-mistakes-to-avoid":`Most calculator mistakes start with a number in the wrong field or the wrong unit beside it. Check the label first, then check the math.

## Keep mg, mcg and mL apart

mg and mcg measure material. mL measures liquid. One mg equals 1,000 mcg. A number in mg cannot be copied into a mcg field unchanged.

## Total amount is not concentration

10 mg total and 10 mg/mL mean different things. Concentration is how much is in each mL. For example, 10 mg spread evenly through 2 mL gives 5 mg/mL. This is a math example, not a mixing choice.

## Use the final liquid amount

The amount added may differ from the final liquid amount. Use the value required by the exact instructions. The calculator cannot decide which liquid is right.

## Start fresh when the product changes

Check the product name, each ingredient and every number. A saved result from another vial may not apply. A blend needs its own label amounts; do not guess each ingredient’s share.

## Check the actual scale

U-100 means 100 units equals 1 mL. It does not tell you the smallest printed gap on a device. More decimal places on screen do not add marks to the real scale.

Use the [unit converter](/tools/mg-to-mcg), [label guide](/learn/how-to-read-a-peptide-vial) and [calculation limits](/methodology).`,
 "how-to-reconstitute-bpc-157":`A BPC-157 vial amount does not tell you which liquid to add, how to mix it or what amount to use. This page explains the numbers a calculator needs.

## A study is not a recipe

[FDA notes gaps in safety information for BPC-157](https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks). A research label does not make a product safe for people. This site does not provide a personal-use mixing recipe.

## What the math can check

You need the stated amount of material and the final amount of liquid. Divide mg by mL to find how much is in each mL. To find the liquid volume for another amount, that amount must already be known.

## A math example

6 mg spread evenly through a final 3 mL gives 2 mg in each mL. These made-up numbers show division. They are not BPC-157 instructions.

Read the [label guide](/learn/how-to-read-a-peptide-vial), [formulas](/methodology) and [BPC-157 reference](/peptides/bpc-157). Personal medical questions belong with a licensed health professional.`,
 "how-to-reconstitute-tirzepatide":`A tirzepatide name and total mg are not a mixing recipe. Check the exact product and its instructions. The calculator cannot identify what is in a vial.

## Similar names can hide different products

[FDA’s GLP-1 information](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss) separates approved medicines from unapproved products. A research vial is not an approved medicine. A compounded medicine, made to order by a pharmacy, may also differ from another product.

## If the label already states mg/mL

That number tells you how much is in each mL. Do not add liquid because an online chart shows an example. The [amount-to-volume tool](/tools/dose) can check known numbers. It does not choose an amount.

## If instructions are missing

Ask the supplier about its research label. For a medicine, ask the dispensing pharmacist or prescriber. Do not fill a missing number with a typical value from the internet.

Read the [unit guide](/learn/what-syringe-units-mean) and [tirzepatide reference](/peptides/tirzepatide). Storage dates also need the exact product’s instructions.`,
 "how-to-reconstitute-semaglutide":`The calculator checks semaglutide label numbers. It does not tell you how to prepare a product. Do not add liquid to a medicine because a calculator shows an example volume.

## Check the full product name

[FDA describes concerns about unapproved semaglutide products](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss), including different salt forms. Similar names do not prove the same contents. This site cannot check a seller or vial.

## A unit count is only part of the answer

U-100 marks describe liquid volume. The same 10-unit volume can hold different amounts of material when the mg/mL changes. A result from an earlier vial may be wrong for another one.

## Keep the needed numbers separate

Use the exact amount in each mL, or the known total mg and final mL. Keep the amount to measure separate from the total in the vial. The [label guide](/learn/how-to-read-a-peptide-vial) explains these fields.

The [amount-to-volume tool](/tools/dose) does not choose a dose, schedule or liquid. The [storage guide](/learn/how-to-store-reconstituted-peptides) explains why a date from another product may not apply.`,
 "how-to-read-an-insulin-syringe":`Check the scale printed on the actual syringe. How much it holds and the gap between its marks are different facts.

## Count the gaps

Imagine a scale labeled 10 and 20 with five equal gaps between those labels. Subtract 10 from 20, then divide by five. Each gap is 2 scale units. Counting the endpoint lines as extra gaps gives the wrong answer.

This is a number-line example, not a picture of your device. The device instructions explain where and how to read it.

## Confirm U-100 before converting

On a U-100 scale, divide units by 100 to find mL. So 12 units is 0.12 mL. A different scale needs a different rule, even if it looks similar.

## What if the result falls between marks?

A result such as 11.5 units may not have a mark on the actual scale. More decimal places on screen do not add marks to the device. Ask the dispensing professional about a medicine’s measuring instructions instead of rounding on your own.

See the [U-100 converter](/tools/syringe-units), [size comparison](/learn/insulin-syringe-sizes) and [math limits](/methodology).`,
 "insulin-syringe-sizes":`Capacity means how much liquid a syringe holds. Mark spacing means the gap between its printed lines. One does not tell you the other.

## U-100 capacity examples

| Liquid capacity | U-100 scale capacity | Does this tell you the smallest gap? |
|---|---|---|
| 0.3 mL | 30 units | No. Check the actual device. |
| 0.5 mL | 50 units | No. Check the actual device. |
| 1 mL | 100 units | No. Check the actual device. |

These examples compare volumes. They do not choose a syringe to buy or use.

## Read the device instructions

Check the scale name, the capacity and the smallest gap. Do not assume that a smaller barrel always has a particular set of marks.

If a result is too large for the device, the math has found a mismatch. It is not permission to split an amount or change a product’s instructions. A result between marks also needs a check beyond this website.

Use the [scale-reading guide](/learn/how-to-read-an-insulin-syringe), [U-100 converter](/tools/syringe-units) and [formula guide](/methodology).`,
 "too-much-bac-water":`With the same amount of material, more final liquid means less material in each mL. That math does not show that a mixture is safe, unchanged or suitable to use.

## Compare the same total amount

| Total material | Final liquid | Amount in each mL |
|---|---|---|
| 6 mg | 2 mL | 3 mg/mL |
| 6 mg | 3 mL | 2 mg/mL |
| 6 mg | 6 mL | 1 mg/mL |

These are math examples. They do not say how much to add or how much a vial holds.

## Does more liquid use up the material faster?

No, if you measure the same mg each time and set aside any losses. A total of 6 mg has twelve 0.5 mg portions. Adding liquid changes the liquid volume for each portion, not the total mg.

This corrects the earlier statement that a more dilute vial would automatically be used up twice as fast.

## The math cannot fix a mixing mistake

A calculator cannot check for germs, chemical changes or materials that should not be mixed. It cannot decide whether to use or save a questionable mixture. Ask the relevant supplier or dispensing professional about the exact product.

See the [concentration tool](/tools/bac-water), [label guide](/learn/how-to-read-a-peptide-vial) and [limits of a result](/learn/what-you-cannot-know).`,
 "peptide-reconstitution-chart":`This chart shows division using made-up numbers. It does not pick water amounts or doses for named products. Use exact product instructions to find the numbers you need.

## Amount divided by final liquid volume

| Total material | Final liquid | Calculation | Amount in each mL |
|---|---|---|---|
| 3 mg | 2 mL | 3 ÷ 2 | 1.5 mg/mL |
| 6 mg | 3 mL | 6 ÷ 3 | 2 mg/mL |
| 12 mg | 4 mL | 12 ÷ 4 | 3 mg/mL |
| 10 mg | 2 mL | 10 ÷ 2 | 5 mg/mL |

Each row assumes the material is spread evenly through the final liquid amount. It does not account for spills, material left behind or errors in measurement.

## A second math step

If a separate amount is already given as 0.3 mg at 3 mg/mL, divide 0.3 by 3. The answer is 0.1 mL. On a U-100 scale that is 10 units. Neither number is a recommendation.

## Check what a chart leaves out

A chart with a product name and typical amount can still leave out the exact contents, liquid, instructions and device marks. This chart stays with the math so it does not pretend to answer those questions.

Open the [calculator](/peptide-calculator), [mg/mcg converter](/tools/mg-to-mcg) or [formula guide](/methodology).`,
 "faq-general":`**Does BACwater.ai sell products or give medical care?** No. We explain research and check math. We link to a supplier and may earn a commission, but we have no product checkout.

**Do I need an account?** No. Public tools work without one. An account can keep saved calculations with your login.

**Who can read a shared calculation?** Anyone with its link can read the calculation. Private notes stay with the owner or creating device. Keep personal details out of public fields.

**Can the planner choose a dose or expiry date?** No. It checks numbers you enter. It cannot choose use or storage instructions.

**Where can I report a problem?** Use [Contact](/contact). Tell us the page and what went wrong. Do not send passwords or health records.`,
 "faq-bac-water-amount":`**How much BAC water can the calculator determine?** A vial amount alone cannot choose a liquid or how much to add. Get those values from the exact instructions. Then use the [calculator](/tools/bac-water) to check the math. An easy scale mark is not a reason to change instructions.`,
 "faq-can-you-reuse-bac-water":`**Can a BAC water container be entered more than once?** Check the label. A multi-dose label means the container has instructions for more than one entry. Follow its handling and opened-container limits. A preservative does not remove all germs or turn a single-dose product into a multi-dose one. See [CDC guidance](https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html).`,
 "faq-peptide-storage-temperature":`**What temperature applies to a mixed peptide?** Use the exact product instructions. A chemical name or another product’s label cannot set the temperature. The [storage guide](/learn/how-to-store-reconstituted-peptides) explains why a saved date is only a record.`,
 "faq-syringe-size-choice":`**How do I check syringe size and markings?** Check the scale name, how much it holds and the smallest gap between marks. The website cannot choose a device from its size alone. See the [size comparison](/learn/insulin-syringe-sizes).`,
 "faq-peptide-cloudy-solution":`**Can the calculator explain a cloudy solution?** No. Math cannot tell why a liquid looks cloudy or whether it can be used. Ask about the exact product. A correct number is not a safety check. Read [what a calculator cannot tell you](/learn/what-you-cannot-know).`,
 "faq-bac-water-allergy":`**What about a known sensitivity to an ingredient?** For a medicine, ask the prescriber or pharmacist to check the ingredients and a suitable alternative. Do not swap liquids based on this site. The [ingredient comparison](/learn/vs/benzyl-alcohol) explains the difference between a preservative and a complete water product.`,
 "faq-mixing-multiple-peptides":`**Does blend math show that ingredients can be mixed?** No. The tool divides each known ingredient amount by the final liquid amount. It cannot check how ingredients act together or whether they stay unchanged. A ready-made blend also needs its own label and instructions. See the [math limits](/methodology).`,
 "faq-drawing-air-bubbles":`**Does the displayed volume allow for air or device errors?** No. It assumes the entered volume is all liquid. It cannot check bubbles, liquid left in the device, spills or reading mistakes. Follow the actual device instructions. Do not assume that air is harmless because the math looks right.`,
 "faq-reconstituted-peptide-travel":`**Can a calculator set travel storage conditions?** No. Ask for the exact product’s transport rules, including temperature and time outside storage. A generic ice-pack tip cannot replace those rules. Keep them with the product instructions, separate from [calculation labels](/tools/vial-labels).`,
 "faq-expiration-after-reconstitution":`**Can BACwater.ai calculate an expiry date?** No. You can record a mixing date, but it does not prove how long a product lasts. Check the exact instructions and current guidance. Read the [storage guide](/learn/bac-water-shelf-life).`
};
export function readableContent<T extends {slug:string;title:string;body:string}>(row:T):T {
 const reviewed=EDITORIAL_REVISIONS.find(r=>r.slug===row.slug);
 if(!reviewed||!Object.hasOwn(PLAIN_ARTICLES,row.slug))return row;
 const knownCurrent=row.title===reviewed.title&&row.body===reviewed.body;
 const knownLegacy=row.title===reviewed.previousTitle&&createHash("sha256").update(row.body).digest("hex")===reviewed.previousBodySha256;
 return knownCurrent||knownLegacy?{...row,title:reviewed.title,body:PLAIN_ARTICLES[row.slug]}:row;
}
