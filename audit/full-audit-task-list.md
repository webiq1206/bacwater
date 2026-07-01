# BACwater.ai -- Master Audit Task List

**Date:** 2026-07-01

All tasks from the SEO/GEO/AEO audit, organized by priority tier with effort estimates.

---

## Tier 1: Critical (Do First)

Tasks that fix broken structured data, incorrect SERP display, or indexing problems.

| # | Task | File(s) | Effort | Status |
|---|------|---------|--------|--------|
| T1 | Replace Organization logo from favicon.ico to real image | `src/components/common/org-json-ld.tsx:7` | 15 min | TODO |
| T2 | Fix Organization sameAs (populate or remove empty array) | `src/components/common/org-json-ld.tsx:9` | 5 min | TODO |
| T3 | Add contactPoint to Organization schema | `src/components/common/org-json-ld.tsx` | 5 min | TODO |
| T4 | Remove "use client" from ProductJsonLd (make server component) | `src/components/common/product-json-ld.tsx:1-2` | 5 min | TODO |
| T5 | Add author + datePublished to Article schema | `src/components/common/article-json-ld.tsx`, `src/app/learn/[slug]/page.tsx:60` | 15 min | TODO |
| T6 | Include DB FAQs in FAQPage JSON-LD | `src/app/faq/page.tsx:47-55` | 10 min | TODO |
| T7 | Remove /plan/advanced from sitemap | `src/app/sitemap.ts:11` | 2 min | TODO |
| T8 | Add meta descriptions to terms page | `src/app/terms/page.tsx:1` | 5 min | TODO |
| T9 | Add meta descriptions to privacy page | `src/app/privacy/page.tsx:1` | 5 min | TODO |
| T10 | Add meta descriptions to disclaimer page | `src/app/disclaimer/page.tsx:1` | 5 min | TODO |
| T11 | Fix /tools/ml-to-units duplicate content (redirect or canonical) | `src/app/tools/ml-to-units/page.tsx` | 5 min | TODO |

**Tier 1 total: ~1.5 hours**

---

## Tier 2: High Priority (Week 2)

Tasks that add missing schema, improve rich result eligibility, and fix content structure.

| # | Task | File(s) | Effort | Status |
|---|------|---------|--------|--------|
| T12 | Wire WebPageJsonLd + BreadcrumbList on all public pages | `src/components/common/webpage-json-ld.tsx` + ~20 pages | 2-3 hr | TODO |
| T13 | Add WebSite schema to root layout | `src/app/layout.tsx` | 15 min | TODO |
| T14 | Create Breadcrumb UI component | New: `src/components/common/breadcrumb.tsx` | 1-2 hr | TODO |
| T15 | Fix renderBody() to parse ## and ### headings | `src/app/learn/[slug]/page.tsx:32-46` | 20 min | TODO |
| T16 | Fix OG description markdown stripping for learn articles | `src/app/learn/[slug]/page.tsx:18` | 5 min | TODO |
| T17 | Add direct-answer blocks to tool page layouts | `src/app/tools/*/layout.tsx` (5 files) | 1-2 hr | TODO |
| T18 | Create HowTo schema component for tool pages | New component + 3-6 tool pages | 1-2 hr | TODO |
| T19 | Add sku, brand, url to Product schema | `src/components/common/product-json-ld.tsx` | 20 min | TODO |
| T20 | Add FAQPage schema to product detail FAQs | `src/app/shop/[slug]/page.tsx` | 20 min | TODO |
| T21 | Add noindex to cart and checkout page metadata | `src/app/cart/page.tsx`, `src/app/checkout/page.tsx` | 5 min | TODO |
| T22 | Update page titles per metadata map | Multiple pages | 30 min | TODO |

**Tier 2 total: ~6-8 hours**

---

## Tier 3: Content and Internal Linking (Weeks 3-4)

Tasks that improve content depth, internal linking, and topical authority.

| # | Task | File(s) | Effort | Status |
|---|------|---------|--------|--------|
| T23 | Expand about page (~120 words to 400-600 words) | `src/app/about/page.tsx` | 1-2 hr | TODO |
| T24 | Expand privacy policy (add CCPA, third-party, retention) | `src/app/privacy/page.tsx` | 1-2 hr | TODO |
| T25 | Add cross-links in FAQ answers | `src/app/faq/page.tsx` | 30 min | TODO |
| T26 | Add learn article links on product detail pages | `src/app/shop/[slug]/page.tsx` | 1 hr | TODO |
| T27 | Add "Check FAQ first" on contact page | `src/app/contact/page.tsx` | 10 min | TODO |
| T28 | Add back links on legal pages | `src/app/terms/page.tsx`, `src/app/disclaimer/page.tsx` | 10 min | TODO |
| T29 | Add internal links from about to learn/tools/faq/contact | `src/app/about/page.tsx` | 15 min | TODO |
| T30 | Fix footer hardcoded learn slugs (make dynamic or document) | `src/components/layout/site-footer.tsx:12-13` | 30 min | TODO |
| T31 | Add "Related content" section to tool pages (learn links) | Tool page layouts | 1 hr | TODO |
| T32 | Add not-found.tsx metadata | `src/app/not-found.tsx` | 5 min | TODO |

**Tier 3 total: ~5-7 hours**

---

## Tier 4: New Content Creation (Weeks 4-6)

Content that fills topical gaps and builds authority.

| # | Task | Target Slug | Effort | Status |
|---|------|-------------|--------|--------|
| T33 | Write "BAC Water vs Sterile Water" guide | `bac-water-vs-sterile-water` | 2 hr | TODO |
| T34 | Write "How to Reconstitute BPC-157" guide | `how-to-reconstitute-bpc-157` | 2 hr | TODO |
| T35 | Write "How to Store Reconstituted Peptides" guide | `how-to-store-reconstituted-peptides` | 2 hr | TODO |
| T36 | Write "BAC Water Shelf Life" guide | `bac-water-shelf-life` | 1 hr | TODO |
| T37 | Write "How to Reconstitute Tirzepatide" guide | `how-to-reconstitute-tirzepatide` | 2 hr | TODO |
| T38 | Write "How to Reconstitute Semaglutide" guide | `how-to-reconstitute-semaglutide` | 2 hr | TODO |
| T39 | Write "How to Read an Insulin Syringe" guide | `how-to-read-an-insulin-syringe` | 2 hr | TODO |
| T40 | Write "Insulin Syringe Sizes Explained" guide | `insulin-syringe-sizes` | 1.5 hr | TODO |
| T41 | Write "What Happens if Too Much BAC Water" guide | `too-much-bac-water` | 1 hr | TODO |
| T42 | Create peptide reconstitution quick-reference chart | `peptide-reconstitution-chart` | 2 hr | TODO |
| T43 | Add 10-15 additional FAQ pairs | Via admin panel | 1.5 hr | TODO |

**Tier 4 total: ~19 hours**

---

## Tier 5: Technical Polish (Ongoing)

| # | Task | File(s) | Effort | Status |
|---|------|---------|--------|--------|
| T44 | Add Content-Security-Policy header | `next.config.ts` | 30 min | TODO |
| T45 | Expand llms.txt with per-page descriptions | `public/llms.txt` | 30 min | TODO |
| T46 | Replace product image SVG placeholders with real photos | DB + image uploads | Variable | TODO |
| T47 | Add ItemList schema to shop listing page | `src/app/shop/page.tsx` | 30 min | TODO |
| T48 | Add CollectionPage schema to learn listing page | `src/app/learn/page.tsx` | 30 min | TODO |
| T49 | Resolve brand name inconsistency (BACwater & Co. vs BACwater.ai) | Header, footer, OG image | 1 hr | TODO |
| T50 | Move tool page teaching content to server-rendered layouts | `src/app/tools/*/layout.tsx` | 2-3 hr | TODO |
| T51 | Add explicit canonical tags to dynamic pages | `src/app/learn/[slug]/page.tsx`, `src/app/shop/[slug]/page.tsx` | 20 min | TODO |
| T52 | Tune sitemap priorities (higher for tools/plan, lower for legal) | `src/app/sitemap.ts` | 10 min | TODO |
| T53 | Set up GA4 tracking | MANUAL | See manual-action-required.md | TODO |
| T54 | Set up Google Search Console | MANUAL | See manual-action-required.md | TODO |
| T55 | Submit sitemap to Google Search Console | MANUAL | See manual-action-required.md | TODO |

**Tier 5 total: ~5-6 hours**

---

## Grand Total

| Tier | Tasks | Estimated Hours |
|------|-------|----------------|
| Tier 1 (Critical) | 11 | 1.5 |
| Tier 2 (High) | 11 | 6-8 |
| Tier 3 (Content/Linking) | 10 | 5-7 |
| Tier 4 (New Content) | 11 | 19 |
| Tier 5 (Polish) | 12 | 5-6 |
| **Total** | **55** | **36-41 hours** |

---

## Quick Wins (Under 10 Minutes Each)

For fast progress, these can all be done in a single sitting:

- T2: Fix sameAs (5 min)
- T3: Add contactPoint (5 min)
- T4: Remove "use client" from ProductJsonLd (5 min)
- T7: Remove /plan/advanced from sitemap (2 min)
- T8-T10: Add descriptions to legal pages (5 min each)
- T11: Fix ml-to-units duplicate (5 min)
- T16: Fix OG markdown stripping (5 min)
- T21: Add noindex to cart/checkout (5 min)
- T27: Add FAQ link on contact page (10 min)
- T32: Add not-found metadata (5 min)

**Quick wins total: ~1 hour for 12 tasks**
