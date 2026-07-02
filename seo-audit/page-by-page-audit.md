# BACwater.ai - Page-by-Page SEO Audit

**Date:** 2026-07-02
**Method:** current metadata, H1, canonical, and JSON-LD read directly from `src/app/**` and `src/components/common/*json-ld*`.

Columns: Title OK = under ~60 rendered. Desc OK = under 155. H1 = single H1 that matches the primary keyword. Canon = self-canonical present. Schema = JSON-LD @types on the page (beyond the sitewide Organization + WebSite). Intent per keyword-map.md.

---

## Master Table

| # | URL | Primary Keyword | Title OK | Desc OK | H1 (one, matches?) | Canon | Page Schema | Intent | Issues |
|---|-----|-----------------|:---:|:---:|--------------------|:---:|-------------|--------|--------|
| 1 | `/` | bac water calculator | Yes (55) | No (165) | "The Complete BAC Water Calculator & Reconstitution Guide" (matches) | Yes | none page-level | I/N | Desc >155. No WebPage schema. No SoftwareApplication for hero calc. |
| 2 | `/plan` | peptide reconstitution plan builder | Yes | Yes | "Build your reconstitution plan" (matches) | Yes | WebPage | T | Consider WebApplication schema. |
| 3 | `/plan/new` | step-by-step reconstitution planner | Yes | Yes | "We'll walk you through it." (weak; no keyword) | Yes | WebPage, HowTo | T | H1 lacks keyword. Consider "Step-by-step reconstitution planner" as H1. |
| 4 | `/plan/advanced` | (308 -> `/plan`) | n/a | n/a | none (redirect) | n/a | none | n/a | Correct 308 shim. Excluded from sitemap. OK. |
| 5 | `/peptides` | peptide bac water calculator | No (~67) | Yes (147) | "Bac water calculators for every peptide" (matches) | Yes | WebPage, CollectionPage+ItemList, Breadcrumb | I | Title >60 rendered; shorten. |
| 6 | `/peptides/[slug]` | how much bac water for [peptide] | Yes | Mostly (custom 159) | "{short} bac water calculator and reconstitution guide" (matches) | Yes | WebPage, HowTo (non-custom), FAQPage, ImageObject (charted), Breadcrumb | I | Best-covered template. Custom desc >155. |
| 7 | `/learn` | peptide reconstitution learning center | No (~71) | Yes | "Everything you need to reconstitute with confidence." (soft) | Yes | WebPage, CollectionPage+ItemList, Breadcrumb | I | Title >60. H1 is brand-voice; robots noindex on thin/multi-filter views (correct). |
| 8 | `/learn/[slug]` | per-guide | Depends on title | Yes | "{guide.title}" (matches) | Yes | Article, Breadcrumb | I | No WebPage schema. Audit DB titles under ~46 chars. No FAQPage even when guide has Q&A. |
| 9 | `/learn/vs/[topic]` | bac water vs [x] | Yes (except recon-solution ~62) | Yes | "{c.title}" (matches) | Yes | WebPage, FAQPage, ImageObject, Breadcrumb | I | `reconstitution-solution` metaTitle ~62 rendered; shorten. |
| 10 | `/faq` | bac water faq | No (~65) | No (159) | "Frequently asked questions" (soft; no "bac water") | Yes | WebPage, FAQPage (CORE+DB), ImageObject, Breadcrumb | I | Title & desc over limits. Strong schema. H1 could add "BAC water". |
| 11 | `/buy` | buy bacteriostatic water online | Yes (45) | No (166) | "Buy bacteriostatic water online" (matches) | Yes | WebPage, Product+Offer (featured), FAQPage, ImageObject, Breadcrumb | C/T | Desc >155. Excellent answer-first structure. |
| 12 | `/shop` | buy bac water syringes and supplies | Yes (48) | Yes (147) | "Everything you need to get started" (generic; no keyword) | Yes | WebPage, ItemList, Breadcrumb | C | H1 does not match keyword. Consider "Buy BAC water, syringes & supplies". No CollectionPage wrapper. |
| 13 | `/shop/[slug]` | per-product | Depends | Depends | "{product.name}" (matches) | Yes | Product+Offer, FAQPage (inline), Breadcrumb | T | No WebPage schema. Verify product name+suffix under 60 and description under 155. |
| 14 | `/tools` | free peptide calculators | Yes (46) | Yes | "Calculators & converters" (soft) | Yes | WebPage | I | H1 lacks "peptide"/"bac water". No ItemList schema. |
| 15 | `/tools/bac-water` | how much bac water to add | Yes (52) | Yes (152) | "How much BAC water do I add?" (matches) | Yes | WebPage (layout) | I | No SoftwareApplication/HowTo. |
| 16 | `/tools/reconstitution` | peptide reconstitution calculator | Yes (52) | No (162) | "Reconstitution Calculator" (matches) | Yes | WebPage | T | Desc >155. No SoftwareApplication/HowTo. |
| 17 | `/tools/dose` | peptide dose calculator | Yes (53) | Yes | "What dose am I drawing?" (soft) | Yes | WebPage (layout) | I/T | H1 conversational; consider "Peptide dose calculator". No SoftwareApplication. |
| 18 | `/tools/syringe-units` | insulin syringe units converter | Yes (50) | Yes | "Syringe units to mL" (matches) | Yes | WebPage (layout) | I | No SoftwareApplication. `/tools/ml-to-units` 308s here (dup resolved). |
| 19 | `/tools/mg-to-mcg` | mg to mcg converter | Borderline (60) | Yes | "mg to mcg" (terse but matches) | Yes | WebPage (layout) | I | Title exactly 60 rendered; shorten. Terse H1. |
| 20 | `/tools/supplies` | peptide supply calculator | Yes (59) | Yes | "How much do I need?" (soft) | Yes | WebPage (layout) | T | H1 lacks keyword. Title 59, tight. |
| 21 | `/about` | about bacwater.ai | Yes (22) | No (162) | "A calmer way to reconstitute" (brand-voice) | Yes | WebPage | N | Desc >155. Thin content historically; verify depth. Redirect-style redundant title fixed. |
| 22 | `/contact` | contact bacwater.ai | Yes (24) | Yes (83) | "Get in touch" (soft) | Yes | WebPage | N/T | Fine. Add a "check FAQ / browse guides" cross-link before the form. |
| 23 | `/editorial-policy` | bacwater editorial policy | Yes (41) | No (162) | "Editorial and sourcing policy" (matches) | Yes | WebPage | N | Desc >155. Strong E-E-A-T signal page. |
| 24 | `/shipping-returns` | bacwater shipping and returns | Yes (32) | Yes (114) | "Shipping and returns" (matches) | Yes | WebPage | N/T | Fine. |
| 25 | `/disclaimer` | bacwater disclaimer | Yes (24) | Yes (110) | "Disclaimer" (matches) | Yes | WebPage | N | Fine (desc added this audit). |
| 26 | `/privacy` | bacwater privacy policy | Yes (28) | Yes (100) | "Privacy" (title says "Privacy Policy") | Yes | WebPage | N | H1/title mismatch: set H1 to "Privacy Policy". |
| 27 | `/terms` | bacwater terms of service | Yes (30) | Yes (95) | "Terms of service" (matches) | Yes | WebPage | N | Fine (desc added this audit). |

---

## Non-Indexable (noindex, correct)

| URL | Title | Robots | Note |
|-----|-------|--------|------|
| `/plans` | My Plans | index:false, follow:false | Account page. Correct. |
| `/plan/[id]`, `/plan/[id]/edit`, `/plan/[id]/label` | (plan detail) | noindex | Private plan pages, crawlable so Google honors noindex. |
| `/cart`, `/checkout`, `/checkout/success` | Your Cart / Checkout | noindex | Funnel pages. Correct. |
| `/signin`, `/signup` | Sign in / Create your account | index:false, follow:false | Auth. Correct. |
| `/admin/*` | (admin) | Disallowed in robots.txt | Blocked at `/admin`. Correct. |

---

## Cross-Cutting Notes

- **Canonicals:** self-canonical present on all 27 indexable routes above. `/learn` filter combinations canonicalize back to `/learn` or self and add noindex on thin/multi-filter views. This is the correct pattern.
- **One H1 per page:** confirmed by design (every content page renders exactly one `<h1>`). H1s that only "softly" match the keyword (`/plan/new`, `/learn`, `/shop`, `/tools`, `/tools/dose`, `/tools/supplies`, `/about`, `/contact`) are the main on-page opportunity; keyword-bearing H1s are already in place across the peptides, comparisons, `/buy`, `/faq`, and legal templates.
- **Breadcrumbs:** the `Breadcrumbs` component renders on peptides, comparisons, `/faq`, `/buy`, `/shop`, `/shop/[slug]`, `/learn`, `/learn/[slug]`, `/peptides`. It is the single BreadcrumbList emitter (dedup fix confirmed).
- **Accordion answers in HTML:** FAQ/comparison/peptide accordions render answer text in the server HTML (not JS-gated), so answer engines and crawlers see the full Q&A. Good for AEO.
- **Redirects:** `/plan/advanced` -> `/plan` and `/tools/ml-to-units` -> `/tools/syringe-units` are 308s and out of the sitemap. Duplicate-content risk resolved.
- **Priority fixes (highest ROI):** (1) trim the 7 over-length descriptions; (2) shorten 4 over-length titles (`/peptides`, `/learn`, `/faq`, `reconstitution-solution`) and the 60-char `/tools/mg-to-mcg`; (3) add WebPage schema to `/`, `/learn/[slug]`, `/shop/[slug]`; (4) add SoftwareApplication to the 6 calculators; (5) tighten soft H1s on `/shop`, `/tools`, `/plan/new`.
