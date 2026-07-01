# BACwater.ai -- Implementation Roadmap

**Date:** 2026-07-01

Prioritized list of all SEO/GEO/AEO fixes, Critical first. Each item references the source audit file and specific code locations.

---

## Phase 1: Critical Fixes (Week 1)

These items block rich results, cause incorrect SERP data, or risk indexing problems.

### 1.1 Fix Organization Schema Logo
**File:** `src/components/common/org-json-ld.tsx:7`
**Action:** Replace `favicon.ico` with a proper logo image (PNG/WebP, min 112x112px). Upload a real logo to `public/images/logo.png` and reference it.
**Effort:** 15 min

### 1.2 Fix Organization Schema sameAs
**File:** `src/components/common/org-json-ld.tsx:9`
**Action:** Either populate `sameAs` with social profile URLs or remove the property. An empty array is pointless.
**Effort:** 5 min

### 1.3 Add Organization Schema contactPoint
**File:** `src/components/common/org-json-ld.tsx`
**Action:** Add `contactPoint: { "@type": "ContactPoint", "contactType": "customer support", "url": "https://bacwater.ai/contact" }`
**Effort:** 5 min

### 1.4 Make ProductJsonLd a Server Component
**File:** `src/components/common/product-json-ld.tsx`
**Action:** Remove `"use client"` (line 1) and the unused `formatCurrency` import (line 2). The component does not use any client hooks.
**Effort:** 5 min

### 1.5 Fix Article Schema -- Add author and datePublished
**File:** `src/components/common/article-json-ld.tsx`
**Action:** Add `author: { "@type": "Organization", "name": "BACwater.ai" }` and add `createdAt` prop for `datePublished`. Update caller at `src/app/learn/[slug]/page.tsx:60` to pass `createdAt`.
**Effort:** 15 min

### 1.6 Fix FAQPage Schema -- Include Database FAQs
**File:** `src/app/faq/page.tsx:47-55`
**Action:** Merge `dbFaqs` into the `mainEntity` array alongside `CORE` items.
**Effort:** 10 min

### 1.7 Remove /plan/advanced from Sitemap
**File:** `src/app/sitemap.ts:11`
**Action:** Remove `"/plan/advanced"` from the STATIC array.
**Effort:** 2 min

### 1.8 Add Descriptions to Legal Pages
**Files:** `src/app/terms/page.tsx:1`, `src/app/privacy/page.tsx:1`, `src/app/disclaimer/page.tsx:1`
**Action:** Add `description` to each metadata export. Currently inheriting root layout description about peptide reconstitution.
**Effort:** 10 min

### 1.9 Handle /tools/ml-to-units Duplicate Content
**File:** `src/app/tools/ml-to-units/page.tsx`
**Action:** Replace the re-export with a `redirect("/tools/syringe-units")` call. Or add `alternates: { canonical: "/tools/syringe-units" }` to the metadata.
**Effort:** 5 min

---

## Phase 2: High-Priority Improvements (Week 2)

### 2.1 Wire WebPageJsonLd on All Public Pages
**File:** `src/components/common/webpage-json-ld.tsx` (already exists, unused)
**Action:** Import and render `<WebPageJsonLd>` on every public page with appropriate name, description, URL, and breadcrumb array.
**Pages affected:** ~20 pages
**Effort:** 2-3 hours

### 2.2 Add WebSite Schema to Root Layout
**File:** `src/app/layout.tsx` or create `src/components/common/website-json-ld.tsx`
**Action:** Add WebSite schema alongside OrgJsonLd. Include `name`, `url`, `publisher` ref.
**Effort:** 15 min

### 2.3 Create Breadcrumb UI Component
**Action:** Build a `<Breadcrumb>` React component and add to all pages below homepage. The `WebPageJsonLd` already generates BreadcrumbList schema -- the UI component provides the visual equivalent.
**Effort:** 1-2 hours (component + integration across pages)

### 2.4 Fix Learn Article Heading Hierarchy
**File:** `src/app/learn/[slug]/page.tsx:32-46`
**Action:** Update `renderBody()` to parse `##` and `###` markdown headings into `<h2>` and `<h3>` elements.
**Effort:** 20 min

### 2.5 Fix OG Description Markdown Stripping
**File:** `src/app/learn/[slug]/page.tsx:18`
**Action:** Change `g.body.slice(0, 155)` to `g.body.replace(/[*_#\`]/g, "").slice(0, 155)` (same stripping as line 17).
**Effort:** 5 min

### 2.6 Add Direct-Answer Blocks to Tool Pages
**Files:** All `src/app/tools/*/layout.tsx` files (5 files)
**Action:** Add a server-rendered direct-answer block before the client calculator in each layout. See AEO plan for specific text per page.
**Effort:** 1-2 hours

### 2.7 Add HowTo Schema to Tool Pages
**Action:** Create a `HowToJsonLd` component. Add to BAC water calculator, dose calculator, and reconstitution calculator pages (the ones with clear step sequences).
**Effort:** 1-2 hours

### 2.8 Enhance Product Schema
**File:** `src/components/common/product-json-ld.tsx`
**Action:** Add `sku` (from DB), `brand` (BACwater.ai), `url` (product page URL), `offers.url`, `offers.seller`.
**Effort:** 20 min

---

## Phase 3: Content and Linking (Weeks 3-4)

### 3.1 Expand About Page
**File:** `src/app/about/page.tsx`
**Action:** Expand from ~120 words to 400-600 words. Add H2 sections: Our Approach, Our Math, Our Suppliers. Add links to learn, tools, FAQ, contact.
**Effort:** 1-2 hours

### 3.2 Expand Privacy Policy
**File:** `src/app/privacy/page.tsx`
**Action:** Expand to include data retention, CCPA/GDPR rights, third-party processors (Stripe, Resend), analytics disclosure, cookie details.
**Effort:** 1-2 hours

### 3.3 Add Cross-Links to FAQ Answers
**File:** `src/app/faq/page.tsx`
**Action:** Convert relevant FAQ answers from plain text to include links (e.g., "Use our [BAC water calculator](/tools/bac-water)" in the BAC water amount answer).
**Effort:** 30 min

### 3.4 Add Learn Links to Product Pages
**File:** `src/app/shop/[slug]/page.tsx`
**Action:** Add a "Learn more" section linking to relevant guides based on product category.
**Effort:** 1 hour

### 3.5 Add "Check FAQ First" to Contact Page
**File:** `src/app/contact/page.tsx`
**Action:** Add text above form: "For quick answers, check our [FAQ](/faq) or browse our [learning center](/learn)."
**Effort:** 10 min

### 3.6 Add Internal Links to Legal Pages
**Files:** `src/app/terms/page.tsx`, `src/app/disclaimer/page.tsx`
**Action:** Add a "Back to BACwater.ai" link at the bottom of each legal page.
**Effort:** 10 min

### 3.7 Add FAQPage Schema to Product Detail Pages
**File:** `src/app/shop/[slug]/page.tsx:31-44`
**Action:** Add FAQPage JSON-LD for the 3 hardcoded FAQ items on each PDP.
**Effort:** 20 min

---

## Phase 4: New Content Creation (Weeks 4-6)

### 4.1 Create "BAC Water vs Sterile Water" Guide
**Target:** `/learn/bac-water-vs-sterile-water`
**Format:** 600-800 words, comparison table, direct-answer block
**Effort:** 2 hours (writing + admin entry)

### 4.2 Create "How to Reconstitute BPC-157" Guide
**Target:** `/learn/how-to-reconstitute-bpc-157`
**Format:** 800-1000 words, step-by-step with calculator link
**Effort:** 2 hours

### 4.3 Create "How to Store Reconstituted Peptides" Guide
**Target:** `/learn/how-to-store-reconstituted-peptides`
**Format:** 600-800 words, temperature table, shelf life per peptide
**Effort:** 2 hours

### 4.4 Create "BAC Water Shelf Life" Guide
**Target:** `/learn/bac-water-shelf-life`
**Format:** 400-600 words
**Effort:** 1 hour

### 4.5 Create Peptide-Specific Reconstitution Guides
**Targets:** tirzepatide, semaglutide, TB-500
**Format:** 800 words each
**Effort:** 2 hours each

---

## Phase 5: Polish and Monitoring (Ongoing)

### 5.1 Update Metadata Titles (Per Metadata Map)
**Action:** Update titles on `/plan`, `/learn`, `/faq`, `/about`, `/contact` per metadata-map.md recommendations.
**Effort:** 30 min

### 5.2 Add Content-Security-Policy Header
**File:** `next.config.ts`
**Action:** Add CSP header to the existing headers array.
**Effort:** 30 min

### 5.3 Add Page-Level noindex to Cart/Checkout
**Files:** `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`
**Action:** Add `robots: { index: false, follow: false }` to metadata exports.
**Effort:** 5 min

### 5.4 Expand llms.txt
**File:** `public/llms.txt`
**Action:** Add per-page descriptions, key facts, entity definitions.
**Effort:** 30 min

### 5.5 Replace Product Image Placeholders
**Action:** Upload real product photography for all products. Replace SVG placeholder fallbacks.
**Effort:** Variable (depends on photography availability)

### 5.6 Set Up GA4 and Search Console
**Action:** Manual -- see `audit/manual-action-required.md`

---

## Total Effort Estimate

| Phase | Estimated Time | Impact |
|-------|---------------|--------|
| Phase 1 (Critical) | 1-2 hours | Fixes broken/incorrect structured data |
| Phase 2 (High) | 6-8 hours | Adds schema, breadcrumbs, direct answers |
| Phase 3 (Content/Linking) | 4-6 hours | Improves internal linking and content depth |
| Phase 4 (New Content) | 10-15 hours | Creates topical authority content |
| Phase 5 (Polish) | 2-3 hours | Final optimizations |
| **Total** | **23-34 hours** | |
