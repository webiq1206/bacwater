# BACwater.ai -- Metadata Map

**Date:** 2026-07-01

Current vs recommended `<title>` and `<meta name="description">` for every public page.

Template: `%s . BACwater.ai` (from root layout)

---

## Homepage (`/`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `BACwater.ai - The Complete BAC Water Calculator & Reconstitution Guide` | Keep as-is (good length, primary keyword, brand) |
| **Description** | `Build a personalized peptide reconstitution plan in minutes. Get exact BAC water amounts, syringe units, storage guidance, printable labels, and the supplies you need.` | Keep as-is (compelling, action-oriented, includes key terms) |

---

## Plan Builder (`/plan`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Build My Plan . BACwater.ai` | `Peptide Reconstitution Plan Builder . BACwater.ai` |
| **Description** | `Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.` | Keep as-is (clear, benefit-driven) |

**Rationale:** Current title "Build My Plan" is brand-voice but lacks keyword "reconstitution" or "peptide."

---

## Step-by-Step Planner (`/plan/new`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Step-by-Step Reconstitution Planner . BACwater.ai` | Keep as-is |
| **Description** | `Guided peptide reconstitution planner. One question at a time, perfect for beginners. We'll do all the math.` | Keep as-is |

---

## Shop Listing (`/shop`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Shop Peptide Reconstitution Supplies . BACwater.ai` | `Buy BAC Water, Syringes & Supplies . BACwater.ai` |
| **Description** | `Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available.` | Keep as-is |

**Rationale:** "Shop Peptide Reconstitution Supplies" is generic. Naming the actual products improves CTR and matches commercial-intent queries.

---

## Product Detail (`/shop/[slug]`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `{product.name} . BACwater.ai` | `{product.name} - Buy Online . BACwater.ai` |
| **Description** | `{product.description}` | Add "Ships in 1-2 days. Research use." suffix if under 155 chars |

---

## Learning Center (`/learn`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Learning Center . BACwater.ai` | `Peptide Reconstitution Guides & BAC Water Education . BACwater.ai` |
| **Description** | `Beginner-friendly guides on BAC water, peptide reconstitution, syringes, storage, and dosing.` | `Free beginner guides: what BAC water is, how to reconstitute peptides, reading syringes, and safe storage. Written for first-timers.` |

**Rationale:** "Learning Center" is a generic label with no keyword value.

---

## Guide Detail (`/learn/[slug]`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `{guide.title} . BACwater.ai` | Keep as-is |
| **Description** | First 155 chars of body, markdown stripped | Keep as-is (acceptable for dynamic content) |

**Note:** Fix line 18 to also strip markdown from the OG description.

---

## FAQ (`/faq`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Frequently Asked Questions . BACwater.ai` | `BAC Water & Peptide Reconstitution FAQ . BACwater.ai` |
| **Description** | `Answers to the most common questions about BAC water, peptide reconstitution, dosing, storage, and shopping with BACwater.ai.` | Keep as-is |

---

## About (`/about`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `About BACwater.ai . BACwater.ai` | `About BACwater.ai - Peptide Reconstitution Tools & Supplies` |
| **Description** | `BACwater.ai is the most beginner-friendly BAC water calculator and reconstitution guide. Exact math, plain-English explanations, and premium supplies in one place.` | Keep as-is |

**Note:** Current rendered title shows "About BACwater.ai . BACwater.ai" which is redundant. Change to `About Us` or `About - Peptide Reconstitution Tools & Supplies`.

---

## Contact (`/contact`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Contact BACwater.ai . BACwater.ai` | `Contact Us . BACwater.ai` |
| **Description** | `Have a question about an order, a plan, or our products? Reach the BACwater.ai team.` | Keep as-is |

**Note:** Same redundancy issue: "Contact BACwater.ai . BACwater.ai".

---

## Tools Index (`/tools`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Free Peptide Calculators & Tools . BACwater.ai` | Keep as-is |
| **Description** | `Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Beginner-friendly, no jargon.` | Keep as-is |

---

## BAC Water Calculator (`/tools/bac-water`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `BAC Water Calculator - How Much to Add . BACwater.ai` | Keep as-is |
| **Description** | `Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe.` | Keep as-is |

---

## Dose Calculator (`/tools/dose`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Dose Calculator - mcg to Syringe Units . BACwater.ai` | `Peptide Dose Calculator - mcg to Syringe Units . BACwater.ai` |
| **Description** | `Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step.` | Keep as-is |

---

## mg to mcg Converter (`/tools/mg-to-mcg`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `mg to mcg Converter - Milligrams to Micrograms . BACwater.ai` | Keep as-is |
| **Description** | `Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg -- this makes switching instant.` | Keep as-is |

---

## Syringe Unit Converter (`/tools/syringe-units`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Syringe Unit Converter - mL to Units . BACwater.ai` | `Insulin Syringe Unit Converter - mL to Units . BACwater.ai` |
| **Description** | `Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.` | Keep as-is |

---

## Supply Calculator (`/tools/supplies`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Supply Calculator - What You Need for a Cycle . BACwater.ai` | `Peptide Supply Calculator - BAC Water, Syringes & More . BACwater.ai` |
| **Description** | `Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads.` | Keep as-is |

---

## Reconstitution Calculator (`/tools/reconstitution`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Free Peptide Reconstitution Calculator . BACwater.ai` | Keep as-is |
| **Description** | `Free peptide reconstitution calculator. Enter your vial size, dose, and syringe to get exact BAC water amount, syringe units, and doses per vial. For research use.` | Keep as-is |

---

## Terms of Service (`/terms`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Terms of service . BACwater.ai` | Keep as-is |
| **Description** | **MISSING** (inherits root layout) | `Terms of service for BACwater.ai. Research use, accuracy, orders, returns, and site usage terms.` |

---

## Privacy (`/privacy`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Privacy . BACwater.ai` | `Privacy Policy . BACwater.ai` |
| **Description** | **MISSING** (inherits root layout) | `How BACwater.ai collects, uses, and protects your data. Payments processed by Stripe. No ad trackers.` |

---

## Disclaimer (`/disclaimer`)

| | Current | Recommended |
|---|---------|-------------|
| **Title** | `Disclaimer . BACwater.ai` | Keep as-is |
| **Description** | **MISSING** (inherits root layout) | `BACwater.ai is an educational and research tool. Products are for laboratory research only. Not medical advice.` |

---

## Summary of Changes Needed

| Priority | Page | Change |
|----------|------|--------|
| Critical | `/terms` | Add description |
| Critical | `/privacy` | Add description, rename title to "Privacy Policy" |
| Critical | `/disclaimer` | Add description |
| High | `/plan` | Update title to include "Peptide Reconstitution" |
| High | `/learn` | Update title to include keywords |
| High | `/faq` | Update title to include "BAC Water" |
| High | `/about` | Fix "About BACwater.ai . BACwater.ai" redundancy |
| High | `/contact` | Fix "Contact BACwater.ai . BACwater.ai" redundancy |
| Medium | `/shop` | Update title to name actual products |
| Medium | `/tools/dose` | Add "Peptide" to title |
| Medium | `/tools/syringe-units` | Add "Insulin" to title |
| Medium | `/tools/supplies` | Update title to name products |
