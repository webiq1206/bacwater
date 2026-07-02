# BACwater.ai Programmatic SEO Analysis

**Date:** 2026-07-02 (new)

Analysis of the two programmatically-generated page sets against thin-content, duplicate/near-duplicate, template-overuse, and doorway-page risk:

- **Peptide cluster:** 24 pages at `/peptides/[slug]` (`generateStaticParams` over `PEPTIDES`), template `src/app/peptides/[slug]/page.tsx`.
- **Comparison cluster:** 7 pages at `/learn/vs/[topic]` (`generateStaticParams` over `COMPARISONS`), template `src/app/learn/vs/[topic]/page.tsx`.

Verdict up front: **both clusters pass the uniqueness bar.** They are data-and-editorial-backed pages, not spun-text doorways. Details, scores, and hardening below.

---

## How these pages are generated (what's shared vs unique)

### Peptide pages

Shared (template): the page shell, section order, headings pattern, calculator component, breadcrumb, JSON-LD wiring, related-peptides grid, and the "Keep learning" CTA.

Unique per page (the substance):
- **Real per-peptide data** from `src/lib/calc/peptides.ts`: distinct `commonVialStrengthsMg`, `typicalDoseMcgRange`, `suggestedDoseMcg`, `refrigeratedShelfDays`, `storageNote`. These differ meaningfully (e.g. TB-500 doses in mg vs Ipamorelin in mcg; CJC no-DAC 21-day vs BPC-157 30-day shelf life).
- **Computed dosage table** (`dosageRows`) unique numeric rows per vial strength: bac water to add, concentration, dose, syringe units. Deterministically derived, so no two peptides share a table (different strengths + doses).
- **Computed direct answer** (`directAnswer`) a 40 to 60 word paragraph with this peptide's actual representative strength, water amount, concentration, and unit count.
- **Human-written editorial** (`PEPTIDE_CONTENT` in `src/lib/peptides/content.ts`): a genuinely distinct `what`, `uses`, and often a peptide-specific `caveat` and `aka`. These are not one-word swaps: BPC-157 (light sensitivity), GHK-Cu (blue copper tint), HCG (IU-vs-mg warning + dedicated FAQ), semaglutide (GLP-1 vs GLP-3 myth FAQ), tirzepatide (30/60 mg FAQ + brand-name note). ~2,000 words of unique editorial across the file.
- **Peptide-specific FAQ** (`buildFaqs`) per-strength "how much bac water for X mg [peptide]" units (unique numbers) + a storage FAQ + curated extras.
- **Unique SVG chart** (`peptideChartSvg`) rendered from this peptide's strengths.
- **Unique meta** title/description built from the peptide's short name and strengths.
- **Category context** (`CATEGORY_CONTEXT`) shared within a category (8 categories) but varies across the roster.

### Comparison pages

Shared (template): shell, verdict slot, table renderer, infographic, body-section loop, FAQ, siblings grid, CTA, JSON-LD.

Unique per page: `verdict` (distinct 40 to 60 word answer), `table` rows (diluent-specific), `body` H2+paragraph sections (hand-written, ~2,100 words of unique editorial across 7 topics), `faqs`, `metaTitle`/`metaDescription`, and a unique comparison infographic.

---

## Uniqueness scoring

Scoring model (0 to 100 each dimension; higher is better):
- **Content-uniqueness:** how much of the visible text/data differs from sibling pages.
- **Intent-uniqueness:** does each page serve a distinct search intent (not cannibalizing a sibling).
- **User-value:** does a user landing cold get a complete, standalone answer.

### Peptide cluster (23 data-backed pages + 1 "custom")

| Dimension | Score | Rationale |
|-----------|:-----:|-----------|
| Content-uniqueness | 82 / 100 | Numeric tables, direct answers, charts, and FAQ are computed per peptide and differ; editorial `what`/`uses`/`caveat` is hand-written and distinct. Shared elements are the shell + the reconstitution steps (which are near-identical across peptides by design, and category context repeats within a category), which is the main drag. |
| Intent-uniqueness | 90 / 100 | Each page targets a distinct query set ("how much bac water for [peptide]", "reconstitute [peptide]", "[peptide] dosage"). Minimal cannibalization; the "custom" page absorbs the long tail without competing. |
| User-value | 88 / 100 | A cold visitor gets a specific answer (their vial to water to units), steps, storage, and FAQ. High standalone value. |

**Peptide cluster composite: ~87 / 100 PASS.**

The one soft spot: the **reconstitution steps** (`reconstitutionSteps`) are structurally identical across peptides (same 6 steps, only the name/strength/water number vary), and `CATEGORY_CONTEXT` is shared within a category. This is acceptable (the steps genuinely are the same procedure), but it is the part most likely to read as templated. The `custom` page is intentionally thinner (no fixed table by design) it is a legitimate catch-all, not a doorway, because it still provides a working calculator and the general method.

### Comparison cluster (7 pages)

| Dimension | Score | Rationale |
|-----------|:-----:|-----------|
| Content-uniqueness | 85 / 100 | Verdict, table, and body sections are hand-written per diluter and materially different (benzyl-alcohol page discusses preservative mechanism; distilled-water page discusses sterility; acetic-acid discusses solubility). |
| Intent-uniqueness | 92 / 100 | Each "bac water vs X" is a distinct query. Watch only for sterile-water vs SWFI overlap if a new one is added. |
| User-value | 90 / 100 | Verdict + table gives an immediate, complete answer; body adds depth. Strong standalone value. |

**Comparison cluster composite: ~89 / 100 PASS.**

---

## Thin / duplicate / doorway risk assessment

| Risk | Peptides | Comparisons |
|------|----------|-------------|
| Thin content | LOW real data + editorial + FAQ per page. "custom" is lighter by design but still functional. | LOW verdict + table + multi-section body. |
| Duplicate content | LOW computed numbers differ; editorial differs. | LOW hand-written per topic. |
| Near-duplicate | LOW-MEDIUM reconstitution steps and category context repeat; mitigated by unique data around them. | LOW distinct topics. |
| Template overuse | ACCEPTABLE a consistent template over genuinely unique data is best practice, not a violation. | ACCEPTABLE. |
| Doorway risk | LOW (full assessment in doorway-page-analysis.md). | LOW. |
| Low-value / index-bloat | NONE all pages serve real queries and are in a segmented sitemap. | NONE. |

---

## Hardening recommendations

The clusters pass, so these are strengthening moves, not fixes.

1. **More unique prose per peptide (reduce the templated feel of the middle).** The `what`/`uses`/`caveat` block is good; add one or two peptide-specific sentences to the reconstitution or storage section for the highest-traffic peptides so the section between the table and the FAQ is not near-identical across the roster. Target: bpc-157, tb-500, semaglutide, tirzepatide, ipamorelin, ghk-cu first.

2. **Differentiate the reconstitution steps where the procedure genuinely differs.** A few peptides have real handling differences already captured in `caveat` (larger-volume TB-500 to 1 mL syringe; GHK-Cu blue tint; CJC no-DAC small-batch). Fold those differences into the steps for those peptides rather than the generic 6 steps, so the HowTo block varies with the data.

3. **Phase 2: per-vial-size expansion (only with unique intros).** Per-vial-size pages (`/peptides/bpc-157/5mg`) are a real ranking opportunity (see content-gap plan), but each must carry a unique intro paragraph and a distinct answer, not just a pre-filtered table row, or they would become near-duplicates and cross the doorway line. Gate this behind: (a) each page has its own direct-answer prose, (b) a distinct FAQ, and (c) genuine query demand for that strength. Do not auto-generate all 24 × N combinations.

4. **Add a canonical + self-referencing check for the "custom" page** so it never competes with a specific peptide page for a branded peptide query. It already targets "any other peptide"; keep its meta generic (it does) and ensure it is not surfaced for named-peptide queries.

5. **Keep the segmented sitemap discipline.** `sitemap-peptides.xml` lists all peptide URLs at priority 0.8, monthly. That is correct. When per-vial-size pages ship, give them their own segment or lower priority so the parent pages stay the primary ranking targets.

6. **References block** (per GEO plan) on comparison pages especially strengthens uniqueness and citation-worthiness simultaneously.

---

## Conclusion

Both programmatic clusters clear the uniqueness bar comfortably (peptides ~87, comparisons ~89). They are the correct pattern: a consistent template wrapped around genuinely unique, mostly-computed data plus hand-written editorial. The only near-duplicate surface is the shared reconstitution steps and category context on peptide pages, which is low-risk and easily hardened by adding a small amount of peptide-specific prose to the mid-page sections. Per-vial-size expansion is a strong phase-2 move but must be gated on unique per-page prose to avoid manufacturing the near-duplicate problem the current design avoids.
