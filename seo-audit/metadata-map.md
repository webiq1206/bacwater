# BACwater.ai - Metadata Map

**Date:** 2026-07-02
**Title template:** `%s · BACwater.ai` (root layout). Homepage uses the standalone default (no template applied). Char counts below are the raw string as authored; the template adds ` · BACwater.ai` (14 chars) to non-homepage titles when rendered.

Legend: Title target under 60 chars (rendered, including the ` · BACwater.ai` suffix). Description target under 155 chars. OG image: pages with a per-page infographic pass an `openGraph.images` SVG; all others fall through to the sitewide `/opengraph-image` route.

---

## Pillar and Planners

| Page | Current Title (chars) | Current Description (chars) | Canonical | Recommendation |
|------|----------------------|-----------------------------|-----------|----------------|
| `/` | `BAC Water Calculator & Reconstitution \| BACwater.ai` (55) | `Build a personalized peptide reconstitution plan in minutes. Get exact BAC water amounts, syringe units, storage guidance, printable labels, and the supplies you need.` (165) | Yes (`/`) | Title: keep (fixed this audit). Description: trim to under 155, e.g. `Build a peptide reconstitution plan in minutes: exact BAC water amounts, syringe units, storage, printable labels, and supplies.` (128). |
| `/plan` | `Peptide Reconstitution Plan Builder` (35 -> 49 rendered) | `Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.` (137) | Yes (`/plan`) | Keep both. Good keyword + benefit. |
| `/plan/new` | `Step-by-Step Reconstitution Planner` (35 -> 49) | `Guided peptide reconstitution planner. One question at a time, perfect for beginners. We'll do all the math.` (107) | Yes (`/plan/new`) | Keep. |

---

## Peptides Cluster

| Page | Current Title (chars) | Current Description | Canonical | Recommendation |
|------|----------------------|---------------------|-----------|----------------|
| `/peptides` | `Peptide BAC Water Calculators & Reconstitution Guides` (53 -> 67 rendered) | `Per-peptide bac water calculators and reconstitution guides. Exact water amounts, syringe units, storage, and shelf life for every peptide we carry.` (147) | Yes (`/peptides`) | Title runs to ~67 rendered, over 60. Shorten, e.g. `Peptide BAC Water Calculators & Guides` (38 -> 52). |
| `/peptides/[slug]` (non-custom) | `{Short} BAC Water Calculator & Dosing` (e.g. `BPC-157 BAC Water Calculator & Dosing`, 37 -> 51) | `How much bac water for {short}? Exact amounts for {strengths} mg vials, syringe units for a typical dose, storage, and about {n}-day shelf life.` (~140) | Yes (`/peptides/{slug}`) | Keep. Dynamic title stays under 60 for all 23 non-custom slugs; longest short-name (`Melanotan-2`) renders ~55. OG image: per-peptide `chart.svg` where a chart exists, else sitewide. |
| `/peptides/custom` | `BAC Water Calculator for Any Peptide` (36 -> 50) | `Reconstitute any peptide with exact bac water math. Enter your vial strength and dose to get the water amount, concentration, syringe units, and doses per vial.` (159) | Yes (`/peptides/custom`) | Trim description to under 155, e.g. drop `and doses per vial` -> 141. |

---

## Learn Cluster

| Page | Current Title (chars) | Current Description | Canonical | Recommendation |
|------|----------------------|---------------------|-----------|----------------|
| `/learn` (no filter) | `Peptide Reconstitution Guides & BAC Water Learning Center` (57 -> 71 rendered) | `Filter beginner guides, comparisons, and FAQs on bac water, reconstitution, syringes, storage, and dosing. Written for first-timers.` (131) | Yes (`/learn`); filtered views canonicalize to `/learn` or self; thin/multi-filter views carry `robots: index:false` | Title over 60 rendered. Shorten, e.g. `BAC Water & Reconstitution Learning Center` (42 -> 56). Filter/robots logic is correct. |
| `/learn/[slug]` (DB guide) | `{guide.title}` (dynamic, e.g. `What Is BAC Water?`) | first 155 chars of body, markdown stripped | Yes (`/learn/{slug}`) | Keep. Confirm no guide title exceeds ~46 chars (46 + 14 suffix = 60). Audit DB titles; truncate any long ones. |
| `/learn/vs/[topic]` | `{c.metaTitle}` (e.g. `BAC Water vs Sterile Water for Peptides`, 39 -> 53) | `{c.metaDescription}` (per topic) | Yes (`/learn/vs/{slug}`) | Keep. All 7 metaTitles land under 60 rendered. OG image: per-topic `infographic.svg`. |

The 7 comparison metaTitles: `BAC Water vs Sterile Water for Peptides`, `BAC Water vs Saline for Peptides`, `BAC Water vs Sodium Chloride Solution`, `BAC Water vs Distilled Water for Peptides`, `BAC Water vs Benzyl Alcohol Explained`, `BAC Water vs Acetic Acid for Peptides`, `Is Reconstitution Solution the Same as BAC Water?`. The last one is 48 -> 62 rendered; shorten to `Reconstitution Solution vs BAC Water` (36 -> 50).

---

## FAQ and Commerce

| Page | Current Title (chars) | Current Description | Canonical | Recommendation |
|------|----------------------|---------------------|-----------|----------------|
| `/faq` | `BAC Water FAQ: Storage, Dosing, Prescription & Uses` (51 -> 65 rendered) | `Direct answers on BAC water: what it is, how much to add, whether it needs refrigerating, how long it lasts, ingredients and pH, prescription status, and safety.` (159) | Yes (`/faq`) | Title over 60 rendered. Shorten, e.g. `BAC Water FAQ: Storage, Dosing & Uses` (37 -> 51). Description over 155; trim to `Direct answers on BAC water: what it is, how much to add, refrigeration, shelf life, pH, prescription status, and safety.` (118). |
| `/buy` | `Buy Bacteriostatic Water Online` (31 -> 45) | `Buy sealed, research-grade bacteriostatic water and reconstitution supplies with fast US shipping. Order bac water vials, kits, and syringes and skip the pharmacy run.` (166) | Yes (`/buy`) | Title: keep. Description over 155; trim, e.g. `Buy sealed, research-grade bacteriostatic water and reconstitution supplies with fast US shipping. Skip the pharmacy run.` (119). |
| `/shop` | `Buy BAC Water, Syringes & Supplies` (34 -> 48) | `Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available.` (147) | Yes (`/shop`) | Keep both. |
| `/shop/[slug]` | `{product.name} - Buy Online` (dynamic) | `{product.description}` (dynamic) | Yes (`/shop/{slug}`) | Keep. Watch product names + ` - Buy Online` + ` · BACwater.ai` staying under 60 rendered; trim long SKU names. Ensure every product.description is under 155. |

---

## Tools

| Page | Current Title (chars) | Current Description (chars) | Canonical | Recommendation |
|------|----------------------|-----------------------------|-----------|----------------|
| `/tools` | `Free Peptide Calculators & Tools` (32 -> 46) | `Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Beginner-friendly, no jargon.` (137) | Yes (`/tools`) | Keep. |
| `/tools/bac-water` | `BAC Water Calculator - How Much to Add` (38 -> 52) | `Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe.` (152) | Yes (metadata in `layout.tsx`) | Keep. |
| `/tools/reconstitution` | `Free Peptide Reconstitution Calculator` (38 -> 52) | `Free peptide reconstitution calculator. Enter your vial size, dose, and syringe to get exact BAC water amount, syringe units, and doses per vial. For research use.` (162) | Yes (`/tools/reconstitution`) | Title keep. Description over 155; drop `For research use.` -> 145. |
| `/tools/dose` | `Dose Calculator - mcg to Syringe Units` (39 -> 53) | `Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step.` (140) | Yes (`layout.tsx`) | Optional: `Peptide Dose Calculator - mcg to Units` (38 -> 52) to add "peptide". Current is fine. |
| `/tools/syringe-units` | `Syringe Unit Converter - mL to Units` (36 -> 50) | `Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.` (137) | Yes (`layout.tsx`) | Optional: prefix "Insulin". Current fine. |
| `/tools/mg-to-mcg` | `mg to mcg Converter - Milligrams to Micrograms` (46 -> 60) | `Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg. This makes switching instant.` (133) | Yes (`layout.tsx`) | Rendered title exactly 60; shorten to `mg to mcg Converter - Milligrams to Mcg` (39 -> 53) for headroom. |
| `/tools/supplies` | `Supply Calculator - What You Need for a Cycle` (45 -> 59) | `Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads.` (141) | Yes (`layout.tsx`) | Rendered title 59; consider `Peptide Supply Calculator for a Cycle` (37 -> 51) to fit "peptide" and gain headroom. |

---

## Trust and Legal

| Page | Current Title (chars) | Current Description (chars) | Canonical | Recommendation |
|------|----------------------|-----------------------------|-----------|----------------|
| `/about` | `About Us` (8 -> 22) | `BACwater.ai is the most beginner-friendly BAC water calculator and reconstitution guide. Exact math, plain-English explanations, and premium supplies in one place.` (162) | Yes (`/about`) | Description over 155; trim to `The most beginner-friendly BAC water calculator and reconstitution guide. Exact math, plain-English explanations, premium supplies.` (131). Title fine (redundant `. BACwater.ai` fixed). |
| `/contact` | `Contact Us` (10 -> 24) | `Have a question about an order, a plan, or our products? Reach the BACwater.ai team.` (83) | Yes (`/contact`) | Keep. |
| `/editorial-policy` | `Editorial & Sourcing Policy` (27 -> 41) | `How BACwater.ai researches, fact-checks, and maintains its reconstitution guides and calculators. Company-level accountability, verified formulas, quarterly review.` (162) | Yes (`/editorial-policy`) | Description over 155; trim to `How BACwater.ai researches, fact-checks, and maintains its guides and calculators: verified formulas, quarterly review.` (117). |
| `/shipping-returns` | `Shipping & Returns` (18 -> 32) | `How BACwater.ai ships orders, expected delivery times, order tracking, and our returns policy for research supplies.` (114) | Yes (`/shipping-returns`) | Keep. |
| `/disclaimer` | `Disclaimer` (10 -> 24) | `BACwater.ai is an educational and research tool. Products are for laboratory research only. Not medical advice.` (110) | Yes (`/disclaimer`) | Keep (description added this audit). |
| `/privacy` | `Privacy Policy` (14 -> 28) | `How BACwater.ai collects, uses, and protects your data. Payments processed by Stripe. No ad trackers.` (100) | Yes (`/privacy`) | Keep. Note: H1 is still `Privacy` while title is `Privacy Policy`; align H1 to `Privacy Policy`. |
| `/terms` | `Terms of Service` (16 -> 30) | `Terms of service for BACwater.ai. Research use, accuracy, orders, returns, and site usage terms.` (95) | Yes (`/terms`) | Keep. |

---

## Uniqueness and Compliance Summary

- **Canonicals:** every indexable route now emits a self-canonical (homepage included). Filtered `/learn` views canonicalize to `/learn` or self and add `robots: index:false` on thin/multi-filter combinations. Confirmed on all pages read.
- **Title uniqueness:** all static titles are unique. Dynamic titles (`/peptides/[slug]`, `/learn/[slug]`, `/learn/vs/[topic]`, `/shop/[slug]`) are unique by their data key.
- **Titles over 60 (rendered) to fix:** `/peptides` (~67), `/learn` no-filter (~71), `/faq` (~65), `/learn/vs/reconstitution-solution` (~62), `/tools/mg-to-mcg` (exactly 60, no headroom).
- **Descriptions over 155 to trim:** `/` (165), `/peptides/custom` (159), `/faq` (159), `/buy` (166), `/tools/reconstitution` (162), `/about` (162), `/editorial-policy` (162).
- **OG images:** per-page SVG on `/peptides/[slug]` (chart), `/learn/vs/[topic]` (infographic), plus non-OG ImageObject infographics on `/buy` and `/faq`. All other pages inherit the sitewide `/opengraph-image` route via `metadataBase`.
