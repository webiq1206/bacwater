/**
 * Shared seed content: the guides and FAQs rendered on /learn and /faq and
 * surfaced across the site. Imported by BOTH prisma/seed.ts (the automatic
 * postbuild seed) and the admin seed route, so a normal deploy loads the full
 * set instead of a subset. All writes are upserts, so it is safe to re-run.
 */
export const CONTENT: Array<{ slug: string; kind: string; title: string; body: string }> = [
  {
    slug: "what-is-bac-water",
    kind: "guide",
    title: "What is BAC Water?",
    body: "Bacteriostatic water is sterile water mixed with 0.9% benzyl alcohol. The alcohol prevents bacterial growth, which is why the same vial can be used across multiple doses over several weeks. Regular sterile water for injection does **not** contain the preservative. It's single-use only. For any peptide you plan to draw from more than once, BAC water is the right choice.",
  },
  {
    slug: "how-peptide-reconstitution-works",
    kind: "guide",
    title: "How peptide reconstitution works",
    body: "Peptides are shipped as a freeze-dried powder. To use them, you add BAC water to the vial, which dissolves the powder into a stable solution you can draw from. The key idea: the *concentration* depends on how much BAC water you add. Less water = more concentrated (smaller draw for the same dose). More water = less concentrated (larger draw). Choose an amount that gives you clean, round numbers on your syringe.",
  },
  {
    slug: "how-to-read-a-peptide-vial",
    kind: "guide",
    title: "How to read a peptide vial label",
    body: "A peptide vial label shows: the peptide name, the strength (usually in mg), a lot number, and sometimes an expiration for the powder. The strength is the total amount of peptide inside, not the dose. Your dose is a fraction of the total, measured in mcg (micrograms). Confirm the strength before you calculate anything.",
  },
  {
    slug: "how-to-use-an-insulin-syringe",
    kind: "guide",
    title: "How to use an insulin syringe",
    body: "Insulin syringes are marked in **units** on the U-100 scale: 100 units = 1 mL. A 1 mL insulin syringe has 100 markings; a 0.5 mL has 50; a 0.3 mL has 30 (often with half-unit ticks). Read the level from the top of the plunger, not from the tip. Tap out bubbles before dispensing.",
  },
  {
    slug: "what-syringe-units-mean",
    kind: "guide",
    title: "What syringe units mean",
    body: 'On a U-100 insulin syringe, one "unit" = 0.01 mL. So 10 units = 0.1 mL, 25 units = 0.25 mL, and so on. When our planner tells you to draw "10 units", it means to pull the plunger back until the top of the plunger sits at the 10-unit mark.',
  },
  {
    slug: "how-to-store-reconstituted-peptides",
    kind: "guide",
    title: "How to store reconstituted peptides",
    body: "## Storage Basics\n\nRefrigerate all reconstituted peptides at 36 to 46 °F (2 to 8 °C). Store vials upright in the door shelf or a dedicated container, away from the freezer coils, which can freeze and destroy the peptide.\n\n## Light and Temperature\n\nMost peptides are light-sensitive after reconstitution. Keep them in the original box or wrap the vial in aluminum foil. Never leave a reconstituted vial at room temperature for more than a few minutes while drawing a dose.\n\n## Shelf Life by Peptide\n\nMost reconstituted peptides remain stable for approximately 28 to 30 days refrigerated. Some exceptions:\n\n- **BPC-157**: ~30 days\n- **TB-500**: ~14 to 21 days\n- **Semaglutide**: ~56 days (manufacturer data)\n- **Tirzepatide**: ~21 days\n- **CJC-1295 / Ipamorelin**: ~28 days\n\nAlways check the peptide manufacturer's documentation for specific shelf-life guidance.\n\n## Never Re-Freeze\n\nOnce a peptide has been reconstituted, never re-freeze it. Freezing and thawing can denature the peptide and render it ineffective.\n\n## Signs of Degradation\n\nDiscard a reconstituted vial if you notice cloudiness, floating particles, discoloration, or an unusual odor. When in doubt, start fresh.",
  },
  {
    slug: "how-long-bac-water-lasts",
    kind: "guide",
    title: "How long BAC water lasts",
    body: "## Sealed Shelf Life\n\nUnopened BAC water is stable until the printed expiration date, typically 12 to 24 months from manufacture. Store sealed vials at room temperature, away from direct sunlight.\n\n## After Puncture\n\nOnce the rubber stopper has been punctured with a needle, a 30 mL vial of BAC water is generally considered safe to use for approximately 28 days when refrigerated. The benzyl alcohol preservative slows bacterial growth, but it does not eliminate the risk entirely over long periods.\n\n## Signs It Has Gone Bad\n\nDiscard BAC water if you notice any of the following:\n\n- Cloudiness or haziness\n- Floating particles or sediment\n- Discoloration (should be crystal clear)\n- Broken or compromised seal\n\nWhen in doubt, use a fresh vial.\n\n## Storage Tips\n\n- Refrigerate after first puncture\n- Always swab the stopper with an alcohol prep pad before inserting a needle\n- Use a fresh needle each time you draw from the vial\n- Write the date of first puncture on the vial with a marker\n\n## Cost-Saving Note\n\nA 30 mL vial is large relative to most reconstitution needs (typically 1 to 2 mL per peptide vial). If you are reconstituting only one vial, you will have BAC water left over. Plan your reconstitution schedule to use the remainder within the 28-day window.",
  },
  {
    slug: "bac-water-vs-sterile-water",
    kind: "guide",
    title: "BAC water vs. sterile water",
    body: "## The Key Difference\n\nBacteriostatic water (BAC water) contains 0.9 % benzyl alcohol as a preservative. Sterile water for injection contains no preservative at all.\n\n## Why It Matters\n\nEvery time you insert a needle into a vial, you introduce a small contamination risk. The benzyl alcohol in BAC water suppresses bacterial growth, making multi-dose vials safe to use over days or weeks. Sterile water offers no such protection. It is single-use only.\n\n## When to Use BAC Water\n\nUse BAC water whenever you plan to draw more than one dose from the same vial. This applies to virtually every peptide reconstitution protocol.\n\n## When to Use Sterile Water\n\nSterile water is appropriate only when the peptide will be used in a single session and the entire vial contents will be drawn at once.\n\n## Can You Substitute One for the Other?\n\nYou can always use BAC water where sterile water is called for (the preservative does not affect the peptide). You should **not** use sterile water where BAC water is called for if you plan to re-enter the vial.\n\n## Quick Comparison\n\n| | BAC Water | Sterile Water |\n|---|---|---|\n| Preservative | 0.9 % benzyl alcohol | None |\n| Multi-dose safe | Yes | No |\n| Shelf life after opening | ~28 days refrigerated | Single use |\n| Reconstitution use | Standard choice | Rare / single-draw only |",
  },
  {
    slug: "common-mistakes-to-avoid",
    kind: "guide",
    title: "Common reconstitution mistakes to avoid",
    body: "**Shaking the vial**: swirl gently. Shaking can denature peptides. **Aiming the water at the powder**: angle it against the wall of the vial. **Skipping the label**: always write the peptide name, date mixed, and expiration on the vial. **Guessing the concentration**: use a calculator (like this one) every time. **Reusing syringes**: always use fresh, sterile syringes.",
  },
  {
    slug: "faq-general",
    kind: "faq",
    title: "Frequently asked questions",
    body: "**Do I need a prescription for BAC water?** In the US, BAC water is prescription-only when marketed for human use. We provide research-use products intended for laboratory research and educational purposes, not for personal administration.\n\n**Is BACwater.ai a medical service?** No. We provide a calculator, reconstitution guide, and supplies. We do not diagnose, prescribe, or provide medical advice.\n\n**Can I save my plans?** Yes. Create a free account and every plan you build is stored with a permanent link.\n\n**Do you ship internationally?** Currently US only. International shipping is on the roadmap.",
  },
  {
    slug: "how-to-reconstitute-bpc-157",
    kind: "guide",
    title: "How to Reconstitute BPC-157",
    body: "## What You Need\n\n- BPC-157 vial (typically 5 mg)\n- Bacteriostatic water (BAC water), 30 mL vial\n- Insulin syringe (1 mL / 100 units recommended)\n- Alcohol prep pads\n\n## Step-by-Step Instructions\n\n**Step 1: Prepare your workspace.** Clean your surface and wash your hands. Gather your vial, BAC water, syringe, and alcohol pads.\n\n**Step 2: Swab both vial tops.** Use a fresh alcohol prep pad on the rubber stopper of both the BPC-157 vial and the BAC water vial. Let them air dry for a few seconds.\n\n**Step 3: Draw BAC water.** For a 5 mg vial, draw 2 mL (200 units on a 1 mL syringe, so you will need to fill and transfer twice). This creates a concentration of 2.5 mg/mL, which makes a 250 mcg amount exactly 10 units.\n\n**Step 4: Add water to the peptide vial.** Insert the needle into the BPC-157 vial at an angle. Let the water run slowly down the inside wall of the vial. Do **not** spray it directly onto the powder.\n\n**Step 5: Swirl gently.** Roll the vial between your palms. Never shake. Shaking can denature the peptide.\n\n**Step 6: Confirm clarity.** The solution should be completely clear with no visible particles. If powder remains, wait a few minutes and swirl again.\n\n## Dosing\n\nA common research dose of BPC-157 is 250 mcg (10 units with the concentration above). Use our BAC water calculator for exact numbers based on your specific vial strength.\n\n## Storage\n\nRefrigerate at 36 to 46 °F (2 to 8 °C). Use within 28 to 30 days.",
  },
  {
    slug: "how-to-reconstitute-tirzepatide",
    kind: "guide",
    title: "How to Reconstitute Tirzepatide",
    body: "## What You Need\n\n- Tirzepatide vial (common strengths: 5 mg, 10 mg, 15 mg)\n- Bacteriostatic water (BAC water)\n- Insulin syringe (0.5 mL or 1 mL)\n- Alcohol prep pads\n\n## Step-by-Step Instructions\n\n**Step 1: Swab vial tops.** Clean both the tirzepatide vial and BAC water vial rubber stoppers with separate alcohol pads.\n\n**Step 2: Draw BAC water.** The amount depends on your vial strength and desired dose. For a 10 mg vial, adding 1 mL of BAC water creates a 10 mg/mL concentration. Use our BAC water calculator for the exact amount based on your dose.\n\n**Step 3: Add to the vial.** Inject the BAC water slowly down the side of the vial. Avoid direct contact with the powder.\n\n**Step 4: Dissolve gently.** Roll the vial between your palms. Tirzepatide typically dissolves quickly. The solution should be clear and colorless.\n\n## Amounts Seen in Research\n\nTirzepatide research references often describe amounts near 2.5 mg per week, with some moving toward 5 mg in later weeks. These figures are reported for reference only and are not a recommendation. Always calculate your syringe units based on the concentration you created.\n\n## Storage\n\nRefrigerate after reconstitution. Reconstituted tirzepatide is generally stable for approximately 21 days at 2 to 8 °C. Protect from light.",
  },
  {
    slug: "how-to-reconstitute-semaglutide",
    kind: "guide",
    title: "How to Reconstitute Semaglutide",
    body: "## What You Need\n\n- Semaglutide vial (common strengths: 3 mg, 5 mg)\n- Bacteriostatic water (BAC water)\n- Insulin syringe (0.5 mL or 1 mL)\n- Alcohol prep pads\n\n## Step-by-Step Instructions\n\n**Step 1: Clean vial tops.** Swab both vial stoppers with alcohol prep pads.\n\n**Step 2: Draw BAC water.** For a 5 mg vial, adding 2.5 mL of BAC water creates a concentration of 2 mg/mL. Adjust based on your target dose using our BAC water calculator.\n\n**Step 3: Inject slowly.** Angle the needle so the water runs down the glass wall of the vial. Do not aim directly at the powder.\n\n**Step 4: Mix gently.** Roll the vial between your palms until the powder is fully dissolved. The solution should be clear.\n\n## Amounts Seen in Research\n\nSemaglutide research references often describe amounts near 0.25 mg per week in early weeks, with gradual increases reported later. These figures are for reference only and are not a recommendation. The exact syringe units depend on the concentration you created.\n\n## Storage\n\nSemaglutide is more stable than most reconstituted peptides. Refrigerate at 2 to 8 °C. Reconstituted semaglutide is typically stable for up to 56 days (per manufacturer data). Protect from light.",
  },
  {
    slug: "how-to-read-an-insulin-syringe",
    kind: "guide",
    title: "How to Read an Insulin Syringe",
    body: "## The Basics\n\nInsulin syringes are marked in **units**, not milliliters. On the standard U-100 scale, 100 units equals 1 mL. The markings make it easy to measure small volumes precisely.\n\n## Syringe Sizes\n\nInsulin syringes come in three common sizes:\n\n- **1 mL (100 units)**: Major marks every 10 units, minor marks every 2 units. Best for doses between 10 and 100 units.\n- **0.5 mL (50 units)**: Major marks every 5 units, minor marks every 1 unit. Better resolution for smaller doses.\n- **0.3 mL (30 units)**: Major marks every 5 units, minor marks every half-unit. Best for micro-dosing.\n\n## How to Read the Level\n\nHold the syringe at eye level with the needle pointing up. Read the measurement from the **top edge of the plunger** (the flat rubber surface), not from the tip of the needle or the bottom of the plunger.\n\n## Drawing a Dose\n\n1. Pull the plunger back to the line matching your dose\n2. Insert the needle into the vial (inverted)\n3. Push the air in, then pull back past your target mark\n4. Tap out air bubbles, then push the plunger back to the exact line\n\n## Quick Reference\n\n| Units | mL |\n|---|---|\n| 5 | 0.05 |\n| 10 | 0.10 |\n| 25 | 0.25 |\n| 50 | 0.50 |\n| 100 | 1.00 |",
  },
  {
    slug: "insulin-syringe-sizes",
    kind: "guide",
    title: "Insulin Syringe Sizes Explained",
    body: "## Three Standard Sizes\n\nInsulin syringes for peptide reconstitution come in three sizes. Each has different markings and is suited for different dose ranges.\n\n## 1 mL / 100 Unit Syringe\n\n- **Capacity**: 1 mL (100 units)\n- **Markings**: Every 2 units (major lines every 10)\n- **Best for**: Doses between 10 and 100 units\n- **Trade-off**: Covers the widest range but has the least precision for very small doses\n\nThis is the most common syringe and a good default choice for most peptide protocols.\n\n## 0.5 mL / 50 Unit Syringe\n\n- **Capacity**: 0.5 mL (50 units)\n- **Markings**: Every 1 unit (major lines every 5)\n- **Best for**: Doses under 50 units\n- **Trade-off**: Better resolution than the 1 mL but cannot hold larger doses\n\nIdeal when your dose falls between 5 and 40 units.\n\n## 0.3 mL / 30 Unit Syringe\n\n- **Capacity**: 0.3 mL (30 units)\n- **Markings**: Half-unit increments\n- **Best for**: Micro-dosing under 30 units\n- **Trade-off**: Most precise, but very limited capacity\n\nUse this for protocols requiring sub-5-unit precision.\n\n## Which Should I Buy?\n\nIf you are unsure, start with the **1 mL syringe**. It handles virtually every dose you will encounter. Move to a smaller syringe only if your calculated dose is consistently under 30 units and you want finer markings.\n\nOur supply calculator recommends the best syringe size based on your calculated dose automatically.",
  },
  {
    slug: "too-much-bac-water",
    kind: "guide",
    title: "What Happens if You Add Too Much BAC Water",
    body: "## Short Answer\n\nAdding too much BAC water does **not** ruin the peptide. It simply dilutes the concentration, meaning you will need to draw a larger volume per dose.\n\n## Why It Happens\n\nThe most common reason is using a round number (like 3 mL) without calculating the resulting concentration first. The peptide is fine. The math just changes.\n\n## The Practical Problem\n\nIf the concentration becomes too dilute, your dose may require more units than your syringe can hold. For example:\n\n- 5 mg vial + 1 mL BAC water = 5 mg/mL → 250 mcg dose is 5 units\n- 5 mg vial + 5 mL BAC water = 1 mg/mL → 250 mcg dose is 25 units\n- 5 mg vial + 10 mL BAC water = 0.5 mg/mL → 250 mcg dose is 50 units\n\nAt 50 units per dose, a 1 mL syringe works, but you will use the vial twice as fast.\n\n## Can You Fix It?\n\nYou cannot remove BAC water once it has been added. Your options are:\n\n1. **Adjust your draw volume.** Use our dose calculator to find the new syringe units for your actual concentration.\n2. **Use a smaller syringe.** If the dose in units is very small, switch to a 0.3 mL syringe for better accuracy.\n3. **Accept the higher volume.** A larger draw is inconvenient but not harmful.\n\n## How to Avoid It\n\nAlways use a calculator before adding BAC water. Our BAC water calculator recommends an amount that makes your dose land at a clean, easy-to-read number on your syringe.",
  },
  {
    slug: "peptide-reconstitution-chart",
    kind: "guide",
    title: "Peptide Reconstitution Quick-Reference Chart",
    body: "## How to Use This Chart\n\nFind your peptide below. The chart shows common vial strengths, a suggested BAC water amount, the resulting concentration, and the syringe units for a typical dose. These are starting points. Use our BAC water calculator for exact numbers based on your specific vial.\n\n## Common Peptides\n\n| Peptide | Vial | BAC Water | Concentration | Typical Dose | Units |\n|---|---|---|---|---|---|\n| BPC-157 | 5 mg | 2 mL | 2.5 mg/mL | 250 mcg | 10 |\n| TB-500 | 5 mg | 2 mL | 2.5 mg/mL | 2.5 mg | 100 |\n| Semaglutide | 5 mg | 2.5 mL | 2 mg/mL | 0.25 mg | 12.5 |\n| Tirzepatide | 10 mg | 2 mL | 5 mg/mL | 2.5 mg | 50 |\n| CJC-1295 | 2 mg | 2 mL | 1 mg/mL | 100 mcg | 10 |\n| Ipamorelin | 5 mg | 2.5 mL | 2 mg/mL | 200 mcg | 10 |\n| GHK-Cu | 5 mg | 2 mL | 2.5 mg/mL | 200 mcg | 8 |\n| PT-141 | 10 mg | 2 mL | 5 mg/mL | 1 mg | 20 |\n\n## Important Notes\n\n- **All values are for reference only.** Actual doses depend on your specific protocol and should be verified with a qualified professional.\n- **Units assume a U-100 insulin syringe.** 100 units = 1 mL.\n- **BAC water amounts are suggestions.** You can adjust them to get cleaner syringe numbers for your dose.\n- **Store reconstituted peptides refrigerated** at 36 to 46 °F (2 to 8 °C).\n\nFor personalized calculations, use our plan builder. It does all the math and generates a printable plan.",
  },
  {
    slug: "faq-bac-water-amount",
    kind: "faq",
    title: "How much BAC water to add",
    body: "**How much BAC water should I add to reconstitute my peptide?** The amount depends on your vial strength and desired dose. A common approach is to add enough BAC water so that your dose equals a clean, round number on your insulin syringe (e.g., 10 units). For a 5 mg peptide vial with a 250 mcg dose, adding 2 mL of BAC water makes each dose exactly 10 units. Use our BAC water calculator for an exact recommendation.",
  },
  {
    slug: "faq-can-you-reuse-bac-water",
    kind: "faq",
    title: "Can you reuse BAC water?",
    body: "**Can you reuse a BAC water vial?** Yes. BAC water contains 0.9% benzyl alcohol preservative, which suppresses bacterial growth. A single 30 mL vial can be used for multiple reconstitutions over approximately 28 days when stored refrigerated. Always swab the stopper with an alcohol pad before each use and discard the vial if you notice cloudiness or particles.",
  },
  {
    slug: "faq-peptide-storage-temperature",
    kind: "faq",
    title: "What temperature to store reconstituted peptides",
    body: "**What temperature should reconstituted peptides be stored at?** Refrigerate reconstituted peptides at 36 to 46 °F (2 to 8 °C). Do not freeze. Do not leave at room temperature. Most reconstituted peptides are stable for approximately 28 to 30 days refrigerated. Store vials upright and protect them from light.",
  },
  {
    slug: "faq-syringe-size-choice",
    kind: "faq",
    title: "Which syringe size should I use?",
    body: "**Which insulin syringe size is best for peptides?** For most peptide doses, a 1 mL (100 unit) insulin syringe is the best default. If your dose is consistently under 30 units, switch to a 0.3 mL syringe for more precise markings. A 0.5 mL syringe is a good middle ground for doses between 10 and 50 units.",
  },
  {
    slug: "faq-peptide-cloudy-solution",
    kind: "faq",
    title: "Why is my reconstituted peptide cloudy?",
    body: "**Why did my reconstituted peptide turn cloudy?** A properly reconstituted peptide should be completely clear. Cloudiness can indicate contamination, degradation, or incomplete dissolution. If the powder hasn't fully dissolved, swirl the vial gently (never shake) and wait a few minutes. If cloudiness persists after dissolution, discard the vial and start fresh. Do not use a cloudy solution.",
  },
  {
    slug: "faq-bac-water-allergy",
    kind: "faq",
    title: "Can you be allergic to BAC water?",
    body: "**Can you be allergic to BAC water?** Some individuals are sensitive to benzyl alcohol, the preservative in BAC water. Benzyl alcohol sensitivity is documented in the research literature. For any known benzyl alcohol allergy, consult a healthcare professional. In cases of benzyl alcohol sensitivity, sterile water for injection (single-use only) is often noted as a preservative-free alternative.",
  },
  {
    slug: "faq-mixing-multiple-peptides",
    kind: "faq",
    title: "Can you mix two peptides in one vial?",
    body: "**Can I combine two peptides in the same vial?** Some research protocols combine compatible peptides (e.g., CJC-1295 and Ipamorelin) in a single vial for convenience. However, not all peptides are compatible when mixed. If your protocol calls for mixing, verify compatibility with the peptide manufacturer's documentation. When in doubt, reconstitute each peptide in its own vial.",
  },
  {
    slug: "faq-drawing-air-bubbles",
    kind: "faq",
    title: "How to remove air bubbles from a syringe",
    body: "**How do I get rid of air bubbles in my syringe?** After drawing your dose, hold the syringe needle-up and flick the barrel gently to move bubbles to the top. Then push the plunger slowly until the bubbles are expelled and a tiny drop appears at the needle tip. Pull back to your exact dose mark if needed. Small air bubbles are not dangerous but can affect dose accuracy.",
  },
  {
    slug: "faq-reconstituted-peptide-travel",
    kind: "faq",
    title: "Can you travel with reconstituted peptides?",
    body: "**Can I travel with reconstituted peptides?** Reconstituted peptides must remain refrigerated. For short trips (a few hours), an insulated bag with ice packs can maintain temperature. For longer travel, consider transporting unreconstituted (lyophilized) peptides, which are stable at room temperature, and reconstituting at your destination. Always check local regulations regarding transport of research materials.",
  },
  {
    slug: "faq-expiration-after-reconstitution",
    kind: "faq",
    title: "How long do peptides last after reconstitution?",
    body: "**How long are reconstituted peptides good for?** Most reconstituted peptides remain stable for approximately 28 to 30 days when stored refrigerated at 36 to 46 °F (2 to 8 °C). Some peptides like semaglutide may last longer (up to 56 days), while others like TB-500 may degrade faster (14 to 21 days). Our plan builder tracks expiration dates automatically based on each peptide's typical shelf life.",
  },
];
