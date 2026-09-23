// Public editorial defaults and exact legacy-body fingerprints. No customer content.
export const EDITORIAL_REVISION = "editorial-2026-09-21-v1";
export const EDITORIAL_REVISIONS = [
  {
    "slug": "what-is-bac-water",
    "kind": "guide",
    "title": "What is BAC water? Ingredients, purpose and limits",
    "body": "BAC water is short for bacteriostatic water. It is a labeled pharmaceutical diluent containing a preservative. That description does not make it suitable for every substance, person or route of use.\n\n## Read the formulation, not just the name\n\n[Pfizer's labeling](https://www.pfizermedical.com/bacteriostatic-water) describes products with 0.9% or 1.1% benzyl alcohol. Check the specific container rather than assuming every product has identical ingredients. The label also directs dilution according to the instructions for the drug being prepared.\n\n## Water amount and concentration are different questions\n\nA calculator can divide an amount by a final volume. In an illustrative example, 12 mg in a final volume of 3 mL is 4 mg/mL. A different final volume changes that arithmetic. It does not answer whether that volume or diluent is appropriate.\n\nStart with the instructions for the exact product. Use the [concentration calculator](/tools/bac-water) to check numbers you already know. Do not use a convenient syringe mark as the reason to choose a formulation.\n\n## Related questions\n\n[The sterile-water comparison](/learn/vs/sterile-water) explains why the names are not interchangeable. [Storage and expiry](/learn/bac-water-shelf-life) separates the water container's date from any mixed product. A calculation cannot verify the contents or condition of a vial; see [what you cannot know from the label alone](/learn/what-you-cannot-know).",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Blanket 0.9% definition and universal diluent recommendation; missing compatibility limits.",
    "previousTitle": "What is BAC Water?",
    "previousBodySha256": "86133f9cef366a00005813f3a73365786fc7e170a69bd09d2d3d9e0e3f649fa4"
  },
  {
    "slug": "how-peptide-reconstitution-works",
    "kind": "guide",
    "title": "Peptide reconstitution: understand concentration before calculating",
    "body": "Reconstitution means adding the specified liquid to a product that needs dissolving. A calculator checks the concentration relationship; it does not select the liquid or validate the preparation.\n\n## The relationship to check\n\nConcentration in mg/mL = total amount in mg ÷ final solution volume in mL.\n\nFor example, 8 mg in a final volume of 4 mL gives 2 mg/mL. If the final volume were 2 mL instead, the concentration would be 4 mg/mL. In both examples the total amount remains 8 mg. These are arithmetic examples, not mixing instructions.\n\n## Final volume is an assumption worth noticing\n\nThe tool treats the volume entered as the final liquid volume. An instruction to add a certain amount of diluent is not automatically the same as a measured final solution volume. Do not override product instructions to force those numbers to match.\n\n[Product labeling](https://www.pfizermedical.com/bacteriostatic-water) governs the appropriate vehicle and dilution. A substance name or vial strength cannot establish compatibility, sterility or storage stability.\n\n## From concentration to a measurement\n\nConvert the stated amount to mg, then divide it by mg/mL. An illustrative 0.2 mg amount at 2 mg/mL corresponds to 0.1 mL. On the U-100 scale that volume corresponds to 10 units. It does not establish that 0.2 mg should be used.\n\nUse [mg to mcg](/tools/mg-to-mcg) when the mass units differ, the [dose-volume calculator](/tools/dose) when concentration is already known, and [the methodology](/methodology) to inspect the assumptions.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "issue": "Previously selected a convenient mixing amount and asserted stability; expand missing final-volume assumption.",
    "previousTitle": "How peptide reconstitution works",
    "previousBodySha256": "3d9f5dc87f81d064f61de018f7f033f2a2184fec5128b23f1127fb95b9ec1f37"
  },
  {
    "slug": "how-to-read-a-peptide-vial",
    "kind": "guide",
    "title": "How to read a vial label without confusing amount and concentration",
    "body": "A total amount, a concentration and a container volume describe different things. Copy the number together with its unit before opening a calculator. A label that says 10 mg does not, by itself, say 10 mg/mL.\n\n## Three examples that should not be entered the same way\n\n| Label wording | What the number describes | What is still needed |\n|---|---|---|\n| 10 mg total | Mass stated for the contents | Final liquid volume for mg/mL |\n| 10 mg/mL | Mass per milliliter | Stated amount to measure |\n| 10 mg in 2 mL | Total mass and volume | 10 ÷ 2 gives 5 mg/mL |\n\nThese examples explain notation only. They do not verify a product or prescribe a dose.\n\n## Keep an audit trail of your inputs\n\nRecord the exact product name, amount, unit and source of the volume. Keep lot and date information with the original label, not in a public shared calculation. If two fields contradict each other, obtain clarification rather than selecting whichever produces an easier result.\n\n## mg, mcg and IU are not interchangeable\n\n[NIST's SI prefixes](https://www.nist.gov/pml/owm/metric-si-prefixes) distinguish milligrams from micrograms: 1 mg equals 1,000 mcg. International units describe substance-specific biological activity and do not have one universal mass conversion. Do not treat a vial's IU as U-100 syringe markings.\n\nUse the [mass converter](/tools/mg-to-mcg), then check the [concentration methodology](/methodology). For missing or doubtful product information, the [limitations guide](/learn/what-you-cannot-know) explains what the software cannot resolve.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "issue": "Thin label paragraph omitted mg versus mg/mL, final volume and IU boundaries.",
    "previousTitle": "How to read a peptide vial label",
    "previousBodySha256": "eb0529677cceeb47f9b4014710b50ffa37e8761ef4053a56d9c7425d229f7694"
  },
  {
    "slug": "how-to-use-an-insulin-syringe",
    "kind": "guide",
    "title": "Insulin syringe instructions: separate device use from unit math",
    "body": "Follow the instructions supplied with your actual syringe and medication. This page explains which information a calculator needs; it is not an injection or preparation tutorial.\n\n## Identify the scale before converting\n\nThe U-100 relationship is 100 scale units per milliliter. That relationship applies only when the device is marked U-100. A 0.3 mL U-100 barrel has a capacity corresponding to 30 units; that does not mean there are exactly 30 printed lines.\n\n## Capacity does not specify the graduation\n\nCheck the smallest interval on the actual device. Do not assume half-unit, one-unit or two-unit spacing from barrel capacity alone. A software illustration cannot identify the exact syringe in your hand.\n\nA result of 7.5 units may fall between marks on one device and on a mark on another. Do not round it or change the product's dilution based only on this website. Ask the dispensing professional to reconcile the prescribed amount with the intended measuring device.\n\n## Why handling is a separate subject\n\n[CDC guidance](https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html) emphasizes single-use needles and syringes and aseptic handling. Correct arithmetic does not verify that those conditions have been met.\n\nFor reading intervals, use [the scale-reading guide](/learn/how-to-read-an-insulin-syringe). For arithmetic only, use the [U-100 converter](/tools/syringe-units). The [sizes comparison](/learn/insulin-syringe-sizes) distinguishes capacity from scale spacing.",
    "sources": [
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Incorrect universal graduation count and procedural instructions; distinguish education from device-specific use.",
    "previousTitle": "How to use an insulin syringe",
    "previousBodySha256": "0b7342d10916cdc7014186b3ca7a2790f9c6ca852c559f3a8a218d0dfba6b523"
  },
  {
    "slug": "what-syringe-units-mean",
    "kind": "guide",
    "title": "What do syringe units mean? U-100 units versus mg and mL",
    "body": "U-100 markings express volume on a scale of 100 units per milliliter. They are not a universal mass measurement for the substance inside the syringe.\n\n## Two conversions, with different required inputs\n\nUnits to mL: divide U-100 units by 100. For example, 25 units corresponds to 0.25 mL.\n\nmL to mg: multiply volume by the solution's known concentration in mg/mL. Without that concentration, the mass cannot be calculated.\n\n## The same mark can represent a different mass\n\nAt 2 mg/mL, an illustrative 0.25 mL volume contains 0.5 mg. At 4 mg/mL, the same volume contains 1 mg. The syringe mark has not changed; the concentration has.\n\nThese examples are not dose recommendations. Use the exact concentration and amount from your existing instructions, not an example found online.\n\n## Avoid a second meaning of units\n\nA vial labeled in international units is not expressing U-100 barrel volume. A substance-specific activity unit cannot be turned into mg with one universal conversion factor.\n\nThe [U-100 converter](/tools/syringe-units) changes volume notation. The [dose-volume tool](/tools/dose) uses concentration to check an entered amount. See [calculation assumptions](/methodology) before using a rounded display value.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Thin answer conflated volume mark and instruction; add independent concentration examples and IU distinction.",
    "previousTitle": "What syringe units mean",
    "previousBodySha256": "1433239be421312d9c1eb4fb8e2e19462480b442b4a6e6c97a68576ef963654c"
  },
  {
    "slug": "how-to-store-reconstituted-peptides",
    "kind": "guide",
    "title": "Reconstituted peptide storage: what the exact product must tell you",
    "body": "There is no dependable storage time or temperature that can be assigned to every mixed peptide from its name alone. Use the instructions for the exact formulation; a concentration calculation cannot establish its stability or sterility.\n\n## Information to obtain before recording a date\n\nLook for the required temperature range, light protection, handling after opening, any permitted time outside storage, and the relevant discard date. Distinguish a manufacturer's unopened expiry from an opened-container limit and the instructions for a prepared solution.\n\n## Do not borrow another product's storage window\n\nA storage statement for one branded product, container or formulation does not establish the shelf life of a different vial carrying the same compound name. The site's previous table of generic peptide-specific day counts has been removed for that reason.\n\nFor compounded GLP-1 medicines specifically, consult [FDA's current guidance](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss) as well as the dispensing professional. Do not extend use by choosing a longer date from a generic online chart.\n\n## What the planner records\n\nThe mixing date is a user-entered record. It is not the start of a calculated safe-use countdown. Printed labels say to follow product instructions rather than generating an expiry from a compound lookup table.\n\nUse [vial labels](/tools/vial-labels) for calculation records, keep the original product instructions with them, and read [BAC water container storage](/learn/bac-water-shelf-life) separately. If condition or sterility is questionable, a clear appearance or a correct calculation does not resolve the concern.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Unsupported universal temperature and peptide day-count table; prohibit cross-formulation extrapolation.",
    "previousTitle": "How to store reconstituted peptides",
    "previousBodySha256": "42c21b34b28cb8c098f2e37847ddc16e71e85f62988f41c5f93797c55a0da8a5"
  },
  {
    "slug": "how-long-bac-water-lasts",
    "kind": "guide",
    "title": "BAC water expiry: unopened and opened containers",
    "body": "This older address is retained for historical links and redirects to the current [BAC water storage reference](/learn/bac-water-shelf-life).\n\nUse the labeled expiry and opened-container instructions for the exact product. A calendar date cannot certify sterility, and the water container's opened-vial period is not a universal shelf life for substances mixed into it.",
    "sources": [
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Obsolete redirected seed must not restore refrigerated 28-day safety guarantee.",
    "previousTitle": "How long BAC water lasts",
    "previousBodySha256": "277c93b63f88ba9477e13b13e9838be950129a8827d630bd7e2139bed11c015e"
  },
  {
    "slug": "bac-water-vs-sterile-water",
    "kind": "guide",
    "title": "BAC water versus sterile water: compare the exact labels",
    "body": "These names are not permission to substitute one product for another. Check the formulation, preservative and package instructions against the intended product's specified diluent.\n\n[Pfizer's label](https://www.pfizermedical.com/bacteriostatic-water) identifies possible incompatibilities with a vehicle or benzyl alcohol. A need for repeated measurements does not resolve compatibility.\n\nThis historical address redirects to the current [sterile-water comparison](/learn/vs/sterile-water). Keep that destination as the primary comparison rather than maintaining two competing articles.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Universal substitution and multi-dose-safe claims on legacy redirected default.",
    "previousTitle": "BAC water vs. sterile water",
    "previousBodySha256": "3544368406d66a6cbd9d751301f49ac8d3001932b28e46fe402b7d52e8be5432"
  },
  {
    "slug": "common-mistakes-to-avoid",
    "kind": "guide",
    "title": "Calculation mistakes to avoid: units, labels and saved results",
    "body": "The most useful checks happen before relying on the output. A calculator can execute the wrong inputs correctly.\n\n## Confusing total amount with concentration\n\nEntering 10 when the label says 10 mg/mL is different from entering a total of 10 mg. Check whether the input asks for total vial mass or an existing concentration. Read the label as a complete expression.\n\n## Losing a factor of 1,000\n\n0.5 mg equals 500 mcg, not 50 mcg or 5,000 mcg. Convert the units before comparing amounts. Use [mg to mcg](/tools/mg-to-mcg) and keep a leading zero in decimal values.\n\n## Treating scale units as a dose\n\nThe same U-100 mark can represent different masses at different concentrations. Use [the units explanation](/learn/what-syringe-units-mean) when a direction mentions units without its concentration.\n\n## Assuming the entered liquid is compatible\n\nAn arithmetic result cannot select a diluent or validate changing a product's instructions. Keep that decision separate from the [concentration calculation](/tools/bac-water).\n\n## Reusing an old saved result after changing the inputs\n\nConfirm vial amount, final volume, mass unit, syringe scale and any explicitly entered frequency each time. A copied calculation is not proof that another vial has the same contents. Save changes only after checking the resulting inputs, and do not share private notes or product-identifying information unnecessarily.\n\n## Mistaking the display for a measuring guarantee\n\nRounded values and assumed syringe intervals are not a device calibration. See [the methodology](/methodology) for rounding and precision limits.",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes",
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Replace unsourced generic mixing procedure with concrete input/error-prevention checklist.",
    "previousTitle": "Common reconstitution mistakes to avoid",
    "previousBodySha256": "195dd3dd31117cc363b75b014103db861567478f5dbbf2ed2ba3bd492d21422a"
  },
  {
    "slug": "faq-general",
    "kind": "faq",
    "title": "Questions about BACwater.ai",
    "body": "**Does BACwater.ai sell products or provide medical care?** The current website is a free calculation and reference tool. It does not provide prescriptions, diagnose conditions or sell products through checkout.\n\n**Do I need an account to calculate?** No. The public tools work without signup. An account lets you associate saved calculations with your login.\n\n**Who can read a shared calculation?** Anyone with its link can read the calculation. Private notes and custom names are restricted to the owner or creating device. Do not put personal information in a compound-name field.\n\n**Can the planner tell me a safe dose or expiry?** No. It checks entered quantities. Follow the exact product instructions for clinical use and storage.\n\n**Where do I report an issue?** Use [Contact](/contact). Include the tool and steps to reproduce, but not passwords, tokens or private medical information.",
    "sources": ["https://bacwater.ai/methodology"],
    "issue": "Removed nonexistent sales, shipping and permanent-storage promises; explain actual account/privacy behavior.",
    "previousTitle": "Frequently asked questions",
    "previousBodySha256": "d9fd3686bbd91f38afa1742c3334b354326dc2d0a8da5af9fc650966526d598d"
  },
  {
    "slug": "how-to-reconstitute-bpc-157",
    "kind": "guide",
    "title": "BPC-157 reconstitution questions: evidence limits and calculation inputs",
    "body": "A BPC-157 vial amount is not enough to determine an appropriate diluent, preparation method or dose. This resource explains the calculation inputs and why the site does not supply a personal protocol.\n\n## Why an online recipe is not the missing instruction\n\n[FDA identifies limited safety information and potential risks for BPC-157 in compounding](https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks). Research terminology or a seller's vial size does not establish a safe human-use protocol. The earlier step-by-step preparation recipe and unsourced research-dose recommendation are no longer provided here.\n\n## What can be checked mathematically\n\nThe calculation needs a stated mass, a known final volume and a separately specified amount to measure. Mass divided by final volume gives concentration. The calculation does not prove that a product is correctly identified or that the proposed preparation is appropriate.\n\n## An example without a compound-specific regimen\n\nFor any hypothetical 6 mg amount in a final volume of 3 mL, the concentration is 2 mg/mL. Converting an independently supplied mass to a volume requires division by that concentration. These numbers are deliberately illustrative, not BPC-157 instructions.\n\n## Useful next steps on this site\n\nRead [what a vial label can and cannot establish](/learn/how-to-read-a-peptide-vial), inspect [the formulas](/methodology), or open the [BPC-157 calculation reference](/peptides/bpc-157) for input-based arithmetic. Questions about use belong with a qualified healthcare professional, not a calculator preset.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
      "https://www.nist.gov/pml/owm/metric-si-prefixes"
    ],
    "issue": "Remove self-preparation recipe, unsupported dose and expiry while retaining historical query URL.",
    "previousTitle": "How to Reconstitute BPC-157",
    "previousBodySha256": "b825759979bbfc3373de5775810f91555382d630e7a46bffb1a8d4373d0cdb16"
  },
  {
    "slug": "how-to-reconstitute-tirzepatide",
    "kind": "guide",
    "title": "Tirzepatide reconstitution questions: product instructions versus calculator math",
    "body": "Do not choose a tirzepatide mixing volume from a generic vial-strength chart. Establish exactly which product and formulation you have and follow its instructions. A calculator cannot identify a product from the word tirzepatide.\n\n## Do not conflate approved, compounded and research products\n\n[FDA's current GLP-1 guidance](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss) distinguishes approved medicines from unapproved products and warns about dosing errors. A compounded preparation's concentration and instructions must not be assumed from another product or a previous prescription.\n\n## When a label already gives mg/mL\n\nYou do not need a calculator to invent a new dilution. Use the stated concentration with the amount already specified by your dispensing professional. The [dose-volume calculator](/tools/dose) explains that arithmetic without selecting the amount.\n\n## When the volume or instructions are missing\n\nA number such as 10 mg is a mass, not a complete recipe. Ask the dispensing pharmacy or prescriber to clarify the preparation and measuring instructions. Do not use a typical online water amount to fill the gap.\n\n## Check the units together\n\nRead mg, mL and syringe units as separate quantities. A U-100 unit is a volume marking; its corresponding mass changes when concentration changes. See [the units guide](/learn/what-syringe-units-mean) and the [tirzepatide reference](/peptides/tirzepatide). Storage dates must also come from the exact formulation's instructions and current official guidance, not another brand's time limit.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Replace generic tirzepatide preparation and starting regimen with product-identification and concentration boundaries.",
    "previousTitle": "How to Reconstitute Tirzepatide",
    "previousBodySha256": "1168c7f4ab237119af338baa707ea86a310630f71630bcecf9937d3065fde479"
  },
  {
    "slug": "how-to-reconstitute-semaglutide",
    "kind": "guide",
    "title": "Semaglutide reconstitution questions: concentration, formulation and units",
    "body": "A semaglutide calculation is not a preparation instruction. Confirm the actual formulation and its directions before entering values. Do not dilute a supplied medicine because a generic calculator displays an example volume.\n\n## Formulation is part of the question\n\n[FDA discusses differences and concerns involving unapproved semaglutide products](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss), including salt forms. A similar name on a label does not establish equivalence. This website cannot verify a seller, substance or prescription.\n\n## Why a units-only answer is incomplete\n\nU-100 markings describe volume, not a fixed quantity of semaglutide. The same 10-unit volume corresponds to a different mass at a different mg/mL concentration. An answer copied from a previous vial can therefore be the wrong answer for the current one.\n\n## Information needed for a check\n\nUse the exact concentration or the independently specified total mass and final volume. Keep the amount to measure separate from the vial's total amount. Read [the label guide](/learn/how-to-read-a-peptide-vial) when those fields are unclear.\n\nThe [semaglutide reference](/peptides/semaglutide) and [dose-volume tool](/tools/dose) can perform the stated arithmetic. They do not choose a dose, titration schedule or compatible liquid.\n\n## Storage is not transferable between products\n\nDo not borrow a day count from a different semaglutide formulation or container. The [storage guide](/learn/how-to-store-reconstituted-peptides) explains why this site no longer calculates a generic expiry.",
    "sources": [
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss",
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Remove unsourced instructions and brand-to-compounded expiry extrapolation; distinguish formulation and units.",
    "previousTitle": "How to Reconstitute Semaglutide",
    "previousBodySha256": "c24e5676941a68760bb2e8147ca2478ccd54f82f032e98e8955e955752f39fec"
  },
  {
    "slug": "how-to-read-an-insulin-syringe",
    "kind": "guide",
    "title": "How to read syringe scale intervals without assuming the tick size",
    "body": "Identify the scale and the printed interval on the actual syringe. Capacity tells you the most the barrel holds; it does not tell you the value of every small line.\n\n## Count intervals, not the printed lines\n\nSuppose an illustrative scale is labeled 10 and 20 and has five equal intervals between those labels. Each interval represents (20 − 10) ÷ 5 = 2 scale units. Counting both labeled endpoints as extra intervals would give the wrong result.\n\nThis is a number-line example, not a drawing of your device. Use the manufacturer's instructions to identify the correct plunger reference and reading method.\n\n## Convert only after confirming U-100\n\nOn a U-100 scale, divide units by 100 for mL. Thus 12 units corresponds to 0.12 mL. Do not apply that conversion to a different scale merely because the barrel looks similar.\n\n## What happens between marks?\n\nA calculated 11.5-unit result may not match a printed mark on the actual device. More decimal places in software do not add physical graduations. Resolve the device and measurement instructions with the dispensing professional; do not silently round or change the dilution.\n\nUse the [U-100 converter](/tools/syringe-units) to check volume notation, the [capacity comparison](/learn/insulin-syringe-sizes) for the difference between size and scale, and [the methodology](/methodology) for display assumptions.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Remove fixed tick assumptions and procedural injection instructions; add interval-counting example.",
    "previousTitle": "How to Read an Insulin Syringe",
    "previousBodySha256": "87ed30d62cf85591c9da6e06a5b031959ba7b8da89c557a214c3a4f58d9fb5c6"
  },
  {
    "slug": "insulin-syringe-sizes",
    "kind": "guide",
    "title": "Insulin syringe sizes: capacity, U-100 scale and graduation spacing",
    "body": "Syringe capacity and graduation spacing answer different questions. Capacity limits the volume that fits in the barrel. The printed graduations determine which scale intervals are shown.\n\n## Capacity on a U-100 scale\n\n| Stated capacity | Equivalent U-100 scale capacity | Does this establish tick spacing? |\n|---|---|---|\n| 0.3 mL | 30 units | No, check the actual device |\n| 0.5 mL | 50 units | No, check the actual device |\n| 1 mL | 100 units | No, check the actual device |\n\nThese are volume equivalences, not recommendations about which syringe to buy or use.\n\n## Do not assume half-unit or one-unit marks\n\nA capacity alone cannot establish the interval between marks. The site previously described each barrel size as having a fixed graduation and recommended a default size. Those claims have been removed.\n\n## Compare the intended measurement with the actual device\n\nCheck the scale designation, capacity and smallest printed interval in the packaging instructions. A result larger than capacity is a mismatch to resolve, not permission to split a prescribed administration or alter its dilution. A result between marks is not corrected simply by displaying more decimals.\n\nThe [scale-reading guide](/learn/how-to-read-an-insulin-syringe) gives an interval-counting example. Use the [U-100 converter](/tools/syringe-units) for volume math, and keep [device assumptions](/methodology) separate from medication instructions.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Incorrect generalization of each capacity to one graduation and default buying recommendation.",
    "previousTitle": "Insulin Syringe Sizes Explained",
    "previousBodySha256": "8dec248733d7207039a4d159c9dd980b797f2feeeef8dd16a46010855612d36d"
  },
  {
    "slug": "too-much-bac-water",
    "kind": "guide",
    "title": "Too much BAC water: what dilution math can and cannot tell you",
    "body": "More final liquid volume lowers concentration for the same total dissolved amount. That mathematical fact does not prove that a preparation remains suitable to use, that the container has enough capacity, or that changing the instructions is safe.\n\n## Compare the same total mass\n\n| Illustrative total mass | Final liquid volume | Concentration |\n|---|---|---|\n| 6 mg | 2 mL | 3 mg/mL |\n| 6 mg | 3 mL | 2 mg/mL |\n| 6 mg | 6 mL | 1 mg/mL |\n\nThese examples do not recommend a dilution or assert that any vial can hold these volumes.\n\n## Does dilution use up the mass faster?\n\nNo, not in this idealized calculation. If the same mass is measured each time, increasing final volume does not itself reduce the number of equal mass portions. For example, a total of 6 mg contains twelve 0.5 mg portions whether its concentration is 3 mg/mL or 1 mg/mL, before any losses. The corresponding liquid volume per portion changes.\n\nThis corrects the earlier statement that a more dilute vial would automatically be used up twice as fast.\n\n## What to do with an actual discrepancy\n\nDo not rely on this page to decide whether to use or salvage a preparation. Obtain product-specific instructions from the dispensing professional. The calculator cannot test contamination, compatibility, stability or the amount actually present.\n\nOnce the actual, appropriate inputs are established, the [concentration tool](/tools/bac-water) can check the arithmetic. Review [the label guide](/learn/how-to-read-a-peptide-vial) and [the limits of a calculated result](/learn/what-you-cannot-know) before relying on a saved plan.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "False no-harm guarantee and mathematically wrong faster-vial-use statement; replace with worked mass balance.",
    "previousTitle": "What Happens if You Add Too Much BAC Water",
    "previousBodySha256": "fae68dbc80e31caa5246a197f4096da7a931be028d9b1d1d0b1a379c068689e9"
  },
  {
    "slug": "peptide-reconstitution-chart",
    "kind": "guide",
    "title": "Peptide concentration chart: worked arithmetic, not mixing instructions",
    "body": "This chart shows how stated mass and final volume produce concentration. It deliberately does not assign water amounts or doses to named peptides. Use product-specific instructions, not this example table, to establish appropriate inputs.\n\n## Concentration examples\n\n| Illustrative mass | Final volume | Calculation | Concentration |\n|---|---|---|---|\n| 3 mg | 2 mL | 3 ÷ 2 | 1.5 mg/mL |\n| 6 mg | 3 mL | 6 ÷ 3 | 2 mg/mL |\n| 12 mg | 4 mL | 12 ÷ 4 | 3 mg/mL |\n| 10 mg | 2 mL | 10 ÷ 2 | 5 mg/mL |\n\nEach row assumes the stated amount is dissolved in the stated final volume. The chart does not account for loss, displacement or measurement uncertainty.\n\n## Convert a separately specified mass to volume\n\nAt an illustrative 3 mg/mL concentration, an independently supplied 0.3 mg amount corresponds to 0.3 ÷ 3 = 0.1 mL. On a U-100 scale, that volume is 10 units. Neither the amount nor the scale is a recommendation for a particular product.\n\n## Check a copied chart before relying on it\n\nA table that lists a compound, water volume and typical dose may look complete while omitting formulation, compatibility, actual device graduation and product-specific instructions. This site's earlier compound-specific recipe chart has been replaced with transparent arithmetic.\n\nOpen the [calculator](/peptide-calculator) for your known inputs, use [mg to mcg](/tools/mg-to-mcg) when units differ, or print the [methodology and checklist](/methodology).",
    "sources": [
      "https://www.nist.gov/pml/owm/metric-si-prefixes",
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Replace recipe and typical-dose table with independently verified, compound-neutral equations.",
    "previousTitle": "Peptide Reconstitution Quick-Reference Chart",
    "previousBodySha256": "e0607c23e46ce4352a7c1298be310b52854ff7e2b04dc57d83f8939cf235684c"
  },
  {
    "slug": "faq-bac-water-amount",
    "kind": "faq",
    "title": "How much BAC water can the calculator determine?",
    "body": "**How much BAC water can the calculator determine?** Vial strength alone cannot determine an appropriate diluent or mixing volume. Use product-specific instructions to establish the volume, then use the [concentration tool](/tools/bac-water) to check the numbers. An easy syringe mark is not permission to change those instructions.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "How much BAC water to add",
    "previousBodySha256": "72dc1705e347ea5dc9f84e89655907f0e535916dc61d54b7638e70fadbbafb31"
  },
  {
    "slug": "faq-can-you-reuse-bac-water",
    "kind": "faq",
    "title": "Can a BAC water container be entered more than once?",
    "body": "**Can a BAC water container be entered more than once?** Check whether the exact container is labeled multi-dose and follow its handling and opened-vial instructions. A preservative does not certify sterility. [CDC guidance](https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html) distinguishes multi-dose containers from single-dose containers; adding a preservative does not authorize reusing a single-dose product.",
    "sources": [
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Can you reuse BAC water?",
    "previousBodySha256": "3cee0e575515157127bcc1aab11b90198f34d79bd0cbfb8063999e6f65dfa95c"
  },
  {
    "slug": "faq-peptide-storage-temperature",
    "kind": "faq",
    "title": "What temperature applies to a mixed peptide?",
    "body": "**What temperature applies to a mixed peptide?** Use the temperature specified for the exact formulation. A compound name, concentration or another product's label is not enough to choose it. The [storage guide](/learn/how-to-store-reconstituted-peptides) separates temperature instructions from calendar recordkeeping.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "What temperature to store reconstituted peptides",
    "previousBodySha256": "76068e7f2999d86d3d83ce2bf3eb037888f1d0bb869c1c9ae28b6e0f051e6cd9"
  },
  {
    "slug": "faq-syringe-size-choice",
    "kind": "faq",
    "title": "How do I check syringe size and markings?",
    "body": "**How do I check syringe size and markings?** Check the actual scale, capacity and graduation interval against the product's measuring instructions. The website cannot select a device from capacity alone. The [sizes comparison](/learn/insulin-syringe-sizes) explains the distinction without prescribing a default.",
    "sources": [
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Which syringe size should I use?",
    "previousBodySha256": "b802ce23890a3b82655d818ed9b870ca86527a58e8c343e3017f9144a85d89b7"
  },
  {
    "slug": "faq-peptide-cloudy-solution",
    "kind": "faq",
    "title": "Can the calculator explain a cloudy solution?",
    "body": "**Can the calculator explain a cloudy solution?** No. A calculation cannot diagnose appearance or verify the condition of a solution. Do not treat a numerical result as clearance to use a questionable preparation. Obtain product-specific guidance; see [what no calculation can establish](/learn/what-you-cannot-know).",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Why is my reconstituted peptide cloudy?",
    "previousBodySha256": "7b610fb074226b6921c656c7457e8b73d1cd938acf444187df850b70d84211e9"
  },
  {
    "slug": "faq-bac-water-allergy",
    "kind": "faq",
    "title": "What about a known sensitivity to an ingredient?",
    "body": "**What about a known sensitivity to an ingredient?** Ask the prescriber or dispensing pharmacist to review the exact product ingredients and an appropriate alternative. Do not substitute sterile water or another diluent based on this website. The [ingredient comparison](/learn/vs/benzyl-alcohol) explains why a preservative and a complete diluent are different.",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Can you be allergic to BAC water?",
    "previousBodySha256": "a88fb20f8e2ff2f24ff0bd6533339fe87a7f3f7f10c894cab3fcecc79b6e9488"
  },
  {
    "slug": "faq-mixing-multiple-peptides",
    "kind": "faq",
    "title": "Does blend arithmetic establish compatibility?",
    "body": "**Does blend arithmetic establish compatibility?** No. The blend calculator can divide each stated mass by one stated final volume. It cannot establish that the substances can be combined, remain stable or are appropriate to use. An existing combined product still requires its own complete instructions. See [calculation limits](/methodology).",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Can you mix two peptides in one vial?",
    "previousBodySha256": "0a8fcfa6c2ef2432a22b40b952d8ca3fe3511fa5e77bab87f9083af0ac9d84f5"
  },
  {
    "slug": "faq-drawing-air-bubbles",
    "kind": "faq",
    "title": "Does a displayed volume account for air or device error?",
    "body": "**Does a displayed volume account for air or device error?** No. The calculation assumes the entered volume is liquid volume. It cannot inspect a syringe or account for bubbles, dead space, losses or reading error. Follow the actual device instructions and ask the dispensing professional about handling. Do not infer that air is harmless from an online calculator.",
    "sources": ["https://bacwater.ai/methodology"],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "How to remove air bubbles from a syringe",
    "previousBodySha256": "b710acba4ddaf93ce3d60a8e25728a4bd2b9046fd8024eb8287545442b955925"
  },
  {
    "slug": "faq-reconstituted-peptide-travel",
    "kind": "faq",
    "title": "Can a calculator determine travel storage conditions?",
    "body": "**Can a calculator determine travel storage conditions?** No. Obtain the exact product's transport, temperature and time-out-of-storage instructions. A generic ice-pack recommendation or a powder-versus-liquid assumption is not a substitute. Keep those directions separate from [saved calculation labels](/tools/vial-labels).",
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "Can you travel with reconstituted peptides?",
    "previousBodySha256": "225e52165722494b50a26ba3c00735be675e596b5034ef6a8813f02d84fe70e3"
  },
  {
    "slug": "faq-expiration-after-reconstitution",
    "kind": "faq",
    "title": "Can BACwater.ai calculate an expiry date?",
    "body": "**Can BACwater.ai calculate an expiry date?** No. A mixing date can be recorded, but the site does not infer a safe expiry from a compound name. Use the exact product's instructions and current applicable guidance. Read [storage and expiry distinctions](/learn/bac-water-shelf-life).",
    "sources": [
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
      "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss"
    ],
    "issue": "Legacy FAQ asserted unsupported storage, compatibility, device or treatment rules.",
    "previousTitle": "How long do peptides last after reconstitution?",
    "previousBodySha256": "4575925bf3066cb3bade4fd953d0a463b71c2edb65db767cbf9b8dd8cd9d844b"
  }
] as const;
