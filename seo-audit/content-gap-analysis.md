# BACwater.ai -- Content Gap Analysis

**Date:** 2026-07-01

Missing content opportunities for topical authority in BAC water / peptide reconstitution.

---

## Current Content Inventory

### Existing Learn Articles (DB-driven, exact slugs from footer)
- `what-is-bac-water` -- What is BAC Water?
- `how-peptide-reconstitution-works` -- How Peptide Reconstitution Works
- (Additional guides exist in DB but specific slugs unknown without querying)

### Existing Tool Pages (7 total)
- Reconstitution Calculator
- BAC Water Calculator
- Dose Calculator
- Syringe Unit Converter
- mg/mcg Converter
- Supply Calculator
- mL to Units (alias)

### Existing Static Pages
- FAQ (7 core Q&A pairs + DB-sourced)
- About (~120 words, very thin)
- Contact (form only)

---

## Content Gaps by Topic Cluster

### Cluster 1: BAC Water Fundamentals (HIGHEST PRIORITY)

| Topic | Search Intent | Current Coverage | Gap |
|-------|--------------|------------------|-----|
| What is bacteriostatic water | Informational | Partial (FAQ answer + learn article) | Article exists but may be thin; needs expansion with citations |
| BAC water vs sterile water | Informational | **NONE** | HIGH GAP -- extremely common search query |
| BAC water shelf life / expiration | Informational | **NONE** | HIGH GAP -- users frequently search this |
| How to store BAC water | Informational | **NONE** | Partial mention in FAQ but no dedicated guide |
| BAC water ingredients (benzyl alcohol) | Informational | Brief mention in FAQ | Needs dedicated content |
| Can BAC water go bad? | Informational | **NONE** | FAQ candidate or short guide |
| BAC water vs sodium chloride | Informational | **NONE** | Comparative content gap |

### Cluster 2: Peptide Reconstitution Process

| Topic | Search Intent | Current Coverage | Gap |
|-------|--------------|------------------|-----|
| How to reconstitute peptides (general) | Informational | Learn article exists | May need expansion; should be pillar content |
| How to reconstitute BPC-157 | Informational | **NONE** | HIGH GAP -- very high search volume |
| How to reconstitute tirzepatide | Informational | **NONE** | HIGH GAP -- trending search term |
| How to reconstitute semaglutide | Informational | **NONE** | HIGH GAP -- trending search term |
| How to reconstitute TB-500 | Informational | **NONE** | Moderate volume |
| How to reconstitute GHK-Cu | Informational | **NONE** | Moderate volume |
| Peptide reconstitution chart / table | Informational | **NONE** | Users want quick-reference visual |
| What happens if you add too much BAC water | Informational | **NONE** | Common beginner concern |
| How long does reconstituted peptide last | Informational | FAQ answer only | Needs dedicated guide with per-peptide data |

### Cluster 3: Syringes and Dosing

| Topic | Search Intent | Current Coverage | Gap |
|-------|--------------|------------------|-----|
| How to read an insulin syringe | Informational | Tool page (syringe units) | Needs dedicated guide with images |
| Insulin syringe sizes explained | Informational | Partial (tool page) | Needs guide: 0.3mL, 0.5mL, 1mL differences |
| How many units in 0.1 mL | Informational | Covered by converter tool | Good -- tool page serves this |
| What gauge needle for peptides | Informational | **NONE** | Common practical question |
| Subcutaneous vs intramuscular injection | Informational | **NONE** | Out of scope (medical) -- note in disclaimer |
| Insulin syringe vs tuberculin syringe | Informational | **NONE** | Informational gap |

### Cluster 4: Storage and Safety

| Topic | Search Intent | Current Coverage | Gap |
|-------|--------------|------------------|-----|
| How to store reconstituted peptides | Informational | **NONE** | HIGH GAP -- critical safety topic |
| Peptide storage temperature | Informational | **NONE** | HIGH GAP |
| Signs of contaminated peptide | Informational | **NONE** | Safety content gap |
| Proper injection site cleaning | Informational | **NONE** | Partially medical but safety-relevant |
| Multi-dose vial hygiene | Informational | **NONE** | Critical for BAC water users |

### Cluster 5: Buying Decisions (Commercial Intent)

| Topic | Search Intent | Current Coverage | Gap |
|-------|--------------|------------------|-----|
| Best bacteriostatic water brands | Commercial | **NONE** | Could be blog/guide content |
| Where to buy BAC water | Commercial | Shop page exists | Content is transactional but no buying guide |
| BAC water price comparison | Commercial | **NONE** | Competitive content opportunity |
| Peptide reconstitution kit | Commercial | Shop may have bundles | Needs dedicated landing or guide |
| How many BAC water vials do I need | Informational/Commercial | Supply calculator covers this | Good -- but could be reinforced with guide |

---

## Content Depth Issues on Existing Pages

### About Page (`/about`)
- **Current:** ~120 words, 4 paragraphs, no subheadings
- **Gap:** No team information, no methodology explanation, no trust signals (certifications, lab standards, vendor relationships)
- **Recommendation:** Expand to 400-600 words with sections: Our Approach, Our Math, Our Suppliers, Research Use Disclaimer

### Privacy Page (`/privacy`)
- **Current:** ~60 words
- **Gap:** No CCPA/GDPR rights section, no data retention policy, no third-party processors (Stripe, Resend, Prisma/DB hosting), no analytics disclosure, no international data transfer notice
- **Recommendation:** Expand to industry-standard privacy policy (800-1500 words)

### FAQ Page (`/faq`)
- **Current:** 7 hardcoded Q&A pairs
- **Gap:** Many common questions not addressed:
  - "How long does shipping take?"
  - "Can I use sterile water instead of BAC water?"
  - "What's the difference between a 0.3mL and 1mL syringe?"
  - "How do I calculate my dose?"
  - "Can I reuse a syringe?"
  - "What does 10 units on a syringe look like?"
- **Recommendation:** Add 10-15 more FAQ pairs, cross-link to tools and guides

---

## Recommended New Content (Prioritized)

### Tier 1 -- High Impact (create first)

1. **"BAC Water vs Sterile Water: What's the Difference?"** (`/learn/bac-water-vs-sterile-water`)
   - Why: Extremely common search query. No coverage. Establishes topical authority.
   - Format: 600-800 word guide with comparison table

2. **"How to Reconstitute BPC-157: Complete Guide"** (`/learn/how-to-reconstitute-bpc-157`)
   - Why: BPC-157 is the most popular peptide. Peptide-specific reconstitution guides capture high-intent traffic.
   - Format: 800-1000 word guide linking to plan builder with BPC-157 defaults

3. **"How to Store Reconstituted Peptides Safely"** (`/learn/how-to-store-reconstituted-peptides`)
   - Why: Critical safety topic. High search volume. No coverage.
   - Format: 600-800 words, temperature guide, shelf life table per peptide

4. **"BAC Water Shelf Life: How Long Does It Last?"** (`/learn/bac-water-shelf-life`)
   - Why: Very common question. Currently only mentioned in passing.
   - Format: 400-600 words, opened vs unopened, storage conditions

5. **Peptide Reconstitution Quick-Reference Chart** (`/tools/chart` or `/learn/peptide-reconstitution-chart`)
   - Why: Visual searchers and "chart" queries. Currently only calculator-based tools.
   - Format: Interactive/static table showing common peptides with BAC water amounts and syringe units

### Tier 2 -- Medium Impact

6. **"How to Read an Insulin Syringe (With Pictures)"** (`/learn/how-to-read-an-insulin-syringe`)
7. **"How to Reconstitute Tirzepatide"** (`/learn/how-to-reconstitute-tirzepatide`)
8. **"How to Reconstitute Semaglutide"** (`/learn/how-to-reconstitute-semaglutide`)
9. **"What Happens if You Add Too Much BAC Water?"** (`/learn/too-much-bac-water`)
10. **"Insulin Syringe Sizes: 0.3mL vs 0.5mL vs 1mL"** (`/learn/insulin-syringe-sizes`)

### Tier 3 -- Supporting Content

11. **"Multi-Dose Vial Hygiene: Best Practices"** (`/learn/multi-dose-vial-hygiene`)
12. **"How to Reconstitute TB-500"** (`/learn/how-to-reconstitute-tb-500`)
13. **"What Gauge Needle Should I Use?"** (`/learn/needle-gauge-guide`)
14. **"Peptide Reconstitution Glossary"** (`/learn/glossary`)
15. **Expanded About page** (not a new page -- expand existing)

---

## Content Format Recommendations

All new learn articles should include:
1. **Direct-answer block** at the top (1-2 sentence answer in bold, extractable by AI)
2. **H2/H3 heading hierarchy** (currently missing from article renderer)
3. **Cross-links** to relevant tools and other articles
4. **CTA banner** linking to plan builder (already exists in template)
5. **Schema**: Article JSON-LD with proper author, datePublished, image
6. **FAQ section** at bottom with 2-3 related questions (for FAQ rich results)
