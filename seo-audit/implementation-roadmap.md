# Implementation Roadmap - bacwater.ai

_Updated July 2026. Prioritized SEO/GEO/AEO/UX/CWV work. Items marked ✅ DONE were implemented in this audit pass (see completed-updates.md). Remaining items are ordered by impact vs. effort. Sources: full-site-audit.md, competitor-gap-analysis.md, and the technical + accessibility audit._

Effort: **S** <1d · **M** 1-3d · **L** 1-2wk · **XL** ongoing.

## ✅ Done this pass (P1 technical quick wins)
- ✅ Self-referencing canonicals on the homepage + ~17 routes.
- ✅ Homepage title shortened to 55 chars.
- ✅ De-duplicated `BreadcrumbList` schema (1 per page).
- ✅ robots.txt / noindex conflict resolved.
- ✅ `/plan/advanced` and `/tools/ml-to-units` → 308 redirects; removed from sitemap.
- ✅ Product `Offer` schema: `priceValidUntil` + `shippingDetails` + `hasMerchantReturnPolicy`.
- ✅ Article schema: `image` + `mainEntityOfPage`; markdown stripped from `articleBody`.
- ✅ A11y: aria-labels on custom inputs + global `:focus-visible` fallback.

## ✅ Done in Phase 2 (full roadmap build-out)

The Tier 1 to Tier 3 items below were then implemented. See completed-updates.md for details.

- ✅ Tier 1.1 Scientific-citations layer (verified FDA/DailyMed, PubChem, CDC sources) + `citation` schema on peptide, comparison, guide, homepage, and vial-size pages.
- ✅ Tier 1.2 Reviewed-by + last-reviewed signal at the editorial-team level (no fabricated byline) + `reviewedBy`/`lastReviewed`/`dateModified` schema.
- ✅ Tier 1.3 Answer/definition/TL;DR blocks on the homepage (definition + quick-reference table), tool pages (quick-reference tables + related-questions FAQ), and peptide pages (labeled Short answer).
- ✅ Tier 1.4 Product-image CWV fix (explicit dimensions + priority on the PDP hero; SVG-aware, so `next/image` deliberately skipped).
- ✅ Tier 1.5 Hub-and-spoke internal linking (homepage strips, comparison to peptide grid, peptide to buy/faq/comparison/shelf, tools to peptides/faq/buy).
- ✅ Tier 2.6 Per-peptide + per-vial-size landing pages (`/peptides/[slug]/[size]`, 18 curated pages).
- ✅ Tier 2.7 Reverse-BAC calculator (`/tools/reverse-bac`) with a syringe visualization and capacity warnings.
- ✅ Tier 2.8 Printable vial-labels landing page (`/tools/vial-labels`).
- ✅ Tier 2.9 "Where to buy bacteriostatic water (2026)" buyer's guide.
- ✅ Tier 2.10 Enriched calculator hub (`/tools`) with a definition, quick facts, and `ItemList` schema.
- ✅ Tier 3.11 Animated syringe visualization (existing `SyringeVisual`) surfaced in the reverse-BAC tool with capacity warnings.
- ✅ Tier 3.12 Peptide glossary + entity definitions (`/learn/glossary`) with `DefinedTermSet` schema.
- ✅ Tier 3.13 `SoftwareApplication` schema on the calculators; `Organization` `@id` graph; `WebSite` `SearchAction` and `Organization.sameAs` intentionally omitted (no search, no social profiles yet).
- ✅ Tier 3.14 Shelf-life / refrigeration deep-dive (`/learn/bac-water-shelf-life`) with the refrigeration nuance framed conservatively and cited.

Remaining (external or business-gated): backlink / brand outreach and a PWA/app (Tier 3.15), Search Console cannibalization monitoring (Tier 3.16), a real named credentialed reviewer, and Plan Builder query-param prefill.

## Tier 1 - High impact, do next

1. **Scientific-citations layer** on core Learn pages (0.9% benzyl alcohol, ~28-day multi-dose window, swirl-not-shake aggregation, reconstitution kinetics). Add a "References" block with PubMed/DOI links + `citation` schema. **Rationale:** peptidefox's 12 citations set the YMYL E-E-A-T bar; this neutralizes it. **Effort: M.** _Source: competitor-gap, ai-search-readiness._
2. **Credentialed-review + last-updated signal.** Resolve the tension between the content spec's company-level, no-bylines stance and the fact that freemedicaljournals ("Dr. Watson") and riteaid ("Health Team," LegitScript, dates) win YMYL trust with named reviewers. Options: keep company-level but add a named, credentialed reviewer + "Reviewed by" + visible "Last reviewed" on money pages; or add a medical-advisory-board entity. **Effort: S-M (decision-gated).** _Source: ai-search-readiness, geo plan._
3. **Answer/definition/TL;DR blocks** on the pillar (`/`), the tool pages, and each comparison - a 40-60 word direct answer + a bolded definition + a stats block. Peptide + comparison pages already have this; extend to `/` and `/tools/*`. **Rationale:** AI Overviews + featured snippets. **Effort: S-M.** _Source: aeo plan, geo plan._
4. **Product images → `next/image`** (or explicit `width`/`height` + `priority` on the PDP hero). Removes CLS risk on commercial pages. **Effort: S-M.** _Source: page-speed plan._
5. **Hub-and-spoke internal linking** across the 24 peptide pages + to the comparison and shelf-life clusters; server-render more of the contextual related-reading (some is client-only); consider surfacing `/buy` beyond the footer. **Effort: S-M.** _Source: internal-linking plan._

## Tier 2 - Strong impact / differentiators

6. **Per-peptide + per-vial-size landing pages** for top long-tail queries (e.g. "5mg BPC-157," "30mg/60mg tirzepatide"), pre-filling the Plan Builder, each with unique framing. **Rationale:** matches freemedicaljournals/worldpeptideassociation long-tail wins. **Effort: L.** _Source: content-gap, programmatic analysis._
7. **Reverse-BAC calculator** ("I want dose X at Y units - how much water?") as a distinct tool page. **Effort: M.** _Source: content-gap, competitor-gap._
8. **Market the printable QR vial-labels asset** as a standalone linkable page ("Free Printable Peptide Vial Labels") for backlinks + brand search. This is the site's unique moat. **Effort: S-M.** _Source: competitor-gap._
9. **"Where to buy bacteriostatic water (2026)" + "how to choose a supplier"** content that funnels to the shop; add freshness "2026" framing to money-page titles/H1s. **Effort: M.** _Source: content-gap._
10. **Dedicated calculator hub page** optimized for head terms ("bac water calculator," "peptide reconstitution calculator") with the tool above the fold. **Effort: M.** _Source: competitor-gap._

## Tier 3 - Compounding / durable

11. **Draggable/animated syringe visualization** with capacity warnings (match praxpeptides/helloregimen). **Effort: M-L.**
12. **Peptide glossary / entity pages** (benzyl alcohol, lyophilization, U-100, subcutaneous) for topical-authority breadth + internal linking. **Effort: L.** _Source: topical-authority, content-gap._
13. **`SoftwareApplication`/`WebApplication` schema** on the calculator/tool pages; add `Organization.sameAs` + optional `WebSite` `SearchAction`. **Effort: S.** _Source: schema-map._
14. **Shelf-life / refrigeration deep-dive** that gets the genuine controversy right (refrigeration may impair benzyl-alcohol efficacy). Accuracy = E-E-A-T. **Effort: S-M.** _Source: content-gap._
15. **Backlink / brand outreach** (peptide communities, "best calculator" roundups) + a PWA/app. **Effort: XL.**
16. **Monitor buy↔shop cannibalization** in Search Console; keep `/buy` the hub and PDPs the SKUs. **Effort: S (ongoing).** _Source: internal-linking, page-by-page._

## Notes / guardrails
- **No em dashes** anywhere (hard brand rule); avoid en dashes in prose.
- Content changes to DB-seeded guides/FAQs require a re-seed on deploy (the postbuild seed now loads the full set).
- Nothing here removes/merges live pages without review; the programmatic clusters passed the doorway/uniqueness test (see doorway-page-analysis.md).
