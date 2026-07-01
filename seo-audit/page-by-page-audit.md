# BACwater.ai -- Page-by-Page SEO Audit

**Date:** 2026-07-01

Each page below lists its current SEO state and issues found.

---

## 1. Homepage (`/`)

**File:** `src/app/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | `BACwater.ai - The Complete BAC Water Calculator & Reconstitution Guide` (from root layout default) |
| Description | `Build a personalized peptide reconstitution plan in minutes. Get exact BAC water amounts, syringe units, storage guidance, printable labels, and the supplies you need.` (from root layout) |
| H1 | `The Complete BAC Water Calculator & Reconstitution Guide` |
| Schema | Organization (global only) |
| Internal links out | `/plan`, `/shop`, `/learn`, `/shop/[slug]` (x4 featured) |
| Internal links in | Logo (header), Logo (footer), every page breadcrumb (future) |

**Issues:**
- No page-specific metadata export (inherits root, which is acceptable for homepage)
- No WebSite or SearchAction schema
- No WebPage schema
- No direct-answer definition block ("What is BAC water?" in 1-2 sentences)

---

## 2. Plan Builder (`/plan`)

**File:** `src/app/plan/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | `Build My Plan` (rendered: "Build My Plan . BACwater.ai") |
| Description | `Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.` |
| H1 | `Build your reconstitution plan` |
| Schema | Organization (global only) |
| Internal links out | `/plan/new` |
| Internal links in | Header nav, footer, homepage (x3), learn articles CTA, tool pages |

**Issues:**
- No WebPage or HowTo schema
- No breadcrumb

---

## 3. Step-by-Step Planner (`/plan/new`)

**File:** `src/app/plan/new/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | `Step-by-Step Reconstitution Planner` |
| Description | `Guided peptide reconstitution planner. One question at a time, perfect for beginners. We'll do all the math.` |
| H1 | `We'll walk you through it.` |
| Schema | Organization (global only) |
| Internal links out | `/plan` |
| Internal links in | `/plan` page, `/tools/reconstitution` |

**Issues:**
- H1 is vague ("We'll walk you through it") -- doesn't contain target keywords
- No WebPage or HowTo schema
- No breadcrumb

---

## 4. Plan Advanced (`/plan/advanced`)

**File:** `src/app/plan/advanced/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | None (redirect) |
| Description | None (redirect) |
| H1 | None (redirect) |
| Schema | None |

**Issues:**
- Pure `redirect("/plan")` compatibility shim -- correct behavior
- MUST be removed from sitemap (`src/app/sitemap.ts:11`)

---

## 5. Shop Listing (`/shop`)

**File:** `src/app/shop/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Shop Peptide Reconstitution Supplies` |
| Description | `Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available.` |
| H1 | `Everything you need to get started` |
| Schema | Organization (global only) |
| Internal links out | `/shop/[slug]` (per product), `/tools/supplies`, `/plan` |
| Internal links in | Header nav, footer, homepage (x2) |

**Issues:**
- H1 is generic ("Everything you need to get started") -- doesn't mention products/supplies
- No ItemList or CollectionPage schema
- No breadcrumb

---

## 6. Product Detail (`/shop/[slug]`)

**File:** `src/app/shop/[slug]/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | Dynamic: `{product.name}` |
| Description | Dynamic: `{product.description}` |
| H1 | Dynamic: `{product.name}` |
| Schema | Product + Offer (via `ProductJsonLd` -- CLIENT component) |
| Internal links out | `/shop` (back), `/shop/[slug]` (x3 related) |
| Internal links in | Shop listing, homepage featured, cart items |

**Issues:**
- `ProductJsonLd` is `"use client"` -- JSON-LD rendered client-side only
- Product schema missing: `sku`, `brand`, `url`, `seller`
- PDP FAQs (3 items) not in any FAQPage schema
- No cross-links to relevant learn articles
- No breadcrumb (Home > Shop > Product Name)
- Product images may be placeholders (SVG bullet character fallback)

---

## 7. Learning Center (`/learn`)

**File:** `src/app/learn/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Learning Center` |
| Description | `Beginner-friendly guides on BAC water, peptide reconstitution, syringes, storage, and dosing.` |
| H1 | `Everything you need to reconstitute with confidence.` |
| Schema | Organization (global only) |
| Internal links out | `/learn/[slug]` (per guide) |
| Internal links in | Header nav, footer, homepage (x2) |

**Issues:**
- No CollectionPage or ItemList schema
- H1 is generic -- doesn't mention learning/guides/BAC water
- No breadcrumb
- Guide cards show truncated body text but no dates or reading time

---

## 8. Guide Detail (`/learn/[slug]`)

**File:** `src/app/learn/[slug]/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | Dynamic: `{guide.title}` |
| Description | Dynamic: first 155 chars of body, markdown stripped |
| H1 | Dynamic: `{guide.title}` |
| Schema | Article (via `ArticleJsonLd`) |
| Internal links out | `/learn` (back), `/plan` (CTA), `/learn/[slug]` (x3 related) |
| Internal links in | Learn listing, footer (2 hardcoded slugs) |

**Issues:**
- Article schema missing `author`, `datePublished`, `image`
- OG description includes raw markdown (line 18 doesn't strip)
- Body rendered with no heading hierarchy -- `renderBody()` only handles bold/italic/paragraphs
- No breadcrumb (Home > Learn > Guide Title)
- No explicit canonical tag
- No cross-links to relevant tools within article body

---

## 9. FAQ (`/faq`)

**File:** `src/app/faq/page.tsx`
**Server component:** Yes (async)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Frequently Asked Questions` |
| Description | `Answers to the most common questions about BAC water, peptide reconstitution, dosing, storage, and shopping with BACwater.ai.` |
| H1 | `Frequently asked questions` |
| Schema | FAQPage (inline JSON-LD, 7 Q&A pairs) |
| Internal links out | `/contact` |
| Internal links in | Footer |

**Issues:**
- FAQPage schema only includes 7 hardcoded items, not DB-sourced FAQs
- FAQ answers are plain text -- no cross-links to tools or learn articles
- Only one outbound link (`/contact`)
- No breadcrumb

---

## 10. About (`/about`)

**File:** `src/app/about/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | `About BACwater.ai` |
| Description | `BACwater.ai is the most beginner-friendly BAC water calculator and reconstitution guide. Exact math, plain-English explanations, and premium supplies in one place.` |
| H1 | `A calmer way to reconstitute` |
| Schema | Organization (global only) |
| Internal links out | `/plan`, `/shop` |
| Internal links in | Footer |

**Issues:**
- Very thin content (~120 words, 4 paragraphs)
- No H2 subheadings
- No links to learn, tools, FAQ, or contact
- H1 is brand-voice, not keyword-optimized
- No AboutPage or Organization-specific schema beyond global

---

## 11. Contact (`/contact`)

**File:** `src/app/contact/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | `Contact BACwater.ai` |
| Description | `Have a question about an order, a plan, or our products? Reach the BACwater.ai team.` |
| H1 | `Get in touch` |
| Schema | Organization (global only) |
| Internal links out | None |
| Internal links in | Footer, FAQ page |

**Issues:**
- Zero outbound internal links
- No "Check our FAQ first" or "Browse guides" before form
- No ContactPage schema
- No breadcrumb

---

## 12. Tools Index (`/tools`)

**File:** `src/app/tools/page.tsx`
**Server component:** Yes

| Attribute | Current Value |
|-----------|--------------|
| Title | `Free Peptide Calculators & Tools` |
| Description | `Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Beginner-friendly, no jargon.` |
| H1 | `Calculators & converters` |
| Schema | Organization (global only) |
| Internal links out | `/tools/*` (x6), `/plan` |
| Internal links in | Header nav, footer |

**Issues:**
- No ItemList or CollectionPage schema for the tool collection
- No breadcrumb
- H1 could include "peptide" or "BAC water" for keyword relevance

---

## 13. BAC Water Calculator (`/tools/bac-water`)

**File:** `src/app/tools/bac-water/page.tsx` (client), `src/app/tools/bac-water/layout.tsx` (metadata)
**Server component:** No (client component, metadata via layout)

| Attribute | Current Value |
|-----------|--------------|
| Title | `BAC Water Calculator - How Much to Add` |
| Description | `Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe.` |
| H1 | `How much BAC water do I add?` |
| Schema | Organization (global only) |
| Internal links out | `/plan`, `/shop`, related tools (x3) |
| Internal links in | Tools index, homepage |

**Issues:**
- No HowTo or WebApplication schema
- No breadcrumb
- No direct-answer block before the calculator

---

## 14. Dose Calculator (`/tools/dose`)

**File:** `src/app/tools/dose/page.tsx` (client), `src/app/tools/dose/layout.tsx` (metadata)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Dose Calculator - mcg to Syringe Units` |
| Description | `Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step.` |
| H1 | `What dose am I drawing?` |
| Schema | Organization (global only) |

**Issues:** Same as BAC Water Calculator above.

---

## 15. mg-to-mcg Converter (`/tools/mg-to-mcg`)

**File:** `src/app/tools/mg-to-mcg/page.tsx` (client), `src/app/tools/mg-to-mcg/layout.tsx` (metadata)

| Attribute | Current Value |
|-----------|--------------|
| Title | `mg to mcg Converter - Milligrams to Micrograms` |
| Description | `Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg -- this makes switching instant.` |
| H1 | `mg <-> mcg` |
| Schema | Organization (global only) |

**Issues:**
- H1 is too terse -- just "mg <-> mcg" with no descriptive text
- Same schema/breadcrumb gaps as other tool pages

---

## 16. Syringe Unit Converter (`/tools/syringe-units`)

**File:** `src/app/tools/syringe-units/page.tsx` (client), `src/app/tools/syringe-units/layout.tsx` (metadata)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Syringe Unit Converter - mL to Units` |
| Description | `Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.` |
| H1 | `Syringe units <-> mL` |
| Schema | Organization (global only) |

**Issues:**
- Duplicate content with `/tools/ml-to-units` (same component re-exported)
- Same schema/breadcrumb gaps

---

## 17. mL to Units (Alias) (`/tools/ml-to-units`)

**File:** `src/app/tools/ml-to-units/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `mL <-> units converter` |
| Description | None (no layout.tsx) |
| H1 | Same as syringe-units (re-exported) |
| Schema | Organization (global only) |

**Issues:**
- DUPLICATE CONTENT -- re-exports `/tools/syringe-units/page.tsx` wholesale
- Not in sitemap (correct) but crawlable via any internal/external link
- No canonical tag pointing to `/tools/syringe-units`
- Should be a redirect, not a re-export

---

## 18. Supply Calculator (`/tools/supplies`)

**File:** `src/app/tools/supplies/page.tsx` (client), `src/app/tools/supplies/layout.tsx` (metadata)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Supply Calculator - What You Need for a Cycle` |
| Description | `Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads.` |
| H1 | `How much do I need?` |
| Schema | Organization (global only) |

**Issues:** Same as other tool pages.

---

## 19. Reconstitution Calculator (`/tools/reconstitution`)

**File:** `src/app/tools/reconstitution/page.tsx`
**Server component:** Yes (metadata in page.tsx directly)

| Attribute | Current Value |
|-----------|--------------|
| Title | `Free Peptide Reconstitution Calculator` |
| Description | `Free peptide reconstitution calculator. Enter your vial size, dose, and syringe to get exact BAC water amount, syringe units, and doses per vial. For research use.` |
| H1 | `Reconstitution Calculator` |
| Schema | Organization (global only) |
| Internal links out | `/plan/new` |

**Issues:**
- No HowTo schema despite being a step-by-step calculator
- No breadcrumb

---

## 20. Terms of Service (`/terms`)

**File:** `src/app/terms/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `Terms of service` |
| Description | **MISSING** -- inherits root layout description about peptide reconstitution |
| H1 | `Terms of service` |
| Schema | Organization (global only) |

**Issues:**
- No description -- inherits misleading root description
- No links back to main site content

---

## 21. Privacy (`/privacy`)

**File:** `src/app/privacy/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `Privacy` |
| Description | **MISSING** -- inherits root layout description |
| H1 | `Privacy` |

**Issues:**
- No description
- Content is extremely thin (~60 words)
- No mention of analytics, CCPA, GDPR, data retention, third-party processors

---

## 22. Disclaimer (`/disclaimer`)

**File:** `src/app/disclaimer/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `Disclaimer` |
| Description | **MISSING** -- inherits root layout description |
| H1 | `Disclaimer` |

**Issues:**
- No description
- No links back to main site content

---

## 23. Cart (`/cart`)

**File:** `src/app/cart/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `Your Cart` |
| Description | **MISSING** |
| H1 | `Your supplies` |

**Issues:**
- No page-level `robots: { index: false }` (robots.ts handles it, but belt-and-suspenders is better)
- Description missing but irrelevant since page is noindex via robots.ts

---

## 24. Checkout (`/checkout`)

**File:** `src/app/checkout/page.tsx`

| Attribute | Current Value |
|-----------|--------------|
| Title | `Checkout` |
| Description | **MISSING** |
| H1 | `Almost there` |

**Issues:**
- Same as cart -- no page-level noindex
