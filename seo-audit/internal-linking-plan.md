# BACwater.ai -- Internal Linking Plan

**Date:** 2026-07-01

Current linking structure, gaps, and recommended improvements.

---

## Current Link Architecture

### Navigation Structure

**Header (5 items):**
- Build My Plan (`/plan`)
- Shop (`/shop`)
- Learn (`/learn`)
- Tools (`/tools`)
- My Plans (`/plans`) -- noindexed, user-specific
- Cart icon (`/cart`)

**Footer (3 columns, 13 links):**
- Product: Build My Plan, Shop Supplies, Calculators, My Plans
- Learn: Learning Center, What is BAC Water? (hardcoded slug), How reconstitution works (hardcoded slug), FAQ
- Company: About, Contact, Terms, Privacy, Disclaimer

---

## Current Internal Link Map

### Pages and Their Outbound Links

| Page | Links To |
|------|----------|
| `/` (Homepage) | `/plan` (x3), `/shop` (x2), `/learn` (x2), `/shop/[slug]` (x4 featured products) |
| `/plan` | `/plan/new` |
| `/plan/new` | `/plan` |
| `/shop` | `/shop/[slug]` (per product), `/tools/supplies`, `/plan` |
| `/shop/[slug]` | `/shop` (back), `/shop/[slug]` (x3 related products) |
| `/learn` | `/learn/[slug]` (per guide) |
| `/learn/[slug]` | `/learn` (back), `/plan` (CTA), `/learn/[slug]` (x3 related) |
| `/faq` | `/contact` |
| `/about` | `/plan`, `/shop` |
| `/contact` | (none) |
| `/tools` | `/tools/*` (x6 tools), `/plan` |
| `/tools/bac-water` | `/plan`, `/shop`, related tools (x3) |
| `/tools/dose` | `/tools/bac-water`, `/plan`, `/shop`, `/tools/syringe-units`, related tools (x3) |
| `/tools/syringe-units` | `/plan`, `/tools/dose`, related tools (x2) |
| `/tools/mg-to-mcg` | `/plan`, `/tools/dose`, `/tools/syringe-units`, `/tools/bac-water` |
| `/tools/supplies` | `/shop`, `/plan` |
| `/tools/reconstitution` | `/plan/new` |
| `/terms` | (none) |
| `/privacy` | (none, except mailto) |
| `/disclaimer` | (none) |

---

## Linking Strengths

1. **Homepage has excellent link density** -- 10+ internal links funneling into three clear paths (plan, shop, learn)
2. **Tools section has the best cross-linking network** -- each tool links to 2-4 related tools, creating a strong internal mesh
3. **Learn articles have CTA banners** linking to `/plan` and "Also worth reading" sections
4. **Product pages have "Also useful"** related products section
5. **Footer covers all major sections** with 13 links across 3 columns

---

## Linking Gaps (Ordered by Impact)

### Gap 1: CONTACT PAGE IS A DEAD END
**Current:** Zero outbound internal links.
**Fix:** Add above the form:
- "Check our [FAQ](/faq) for quick answers"
- "Browse our [learning center](/learn) for guides"
- "Use our [plan builder](/plan) for reconstitution help"

### Gap 2: LEGAL PAGES ARE DEAD ENDS
**Current:** Terms, privacy, and disclaimer have no internal links.
**Fix:** Add a "Back to [BACwater.ai](/) " link or a small nav section at the bottom of each.

### Gap 3: FAQ ANSWERS DON'T CROSS-LINK
**Current:** FAQ answers are plain text with no links.
**Fix:** Add contextual links within answers:
- "How much BAC water should I add?" -> link to `/tools/bac-water`
- "What syringe should I use?" -> link to `/tools/syringe-units`
- "How long is reconstituted peptide good for?" -> link to future storage guide
- "Do I need a prescription?" -> link to `/disclaimer`

### Gap 4: SHOP PDPs DON'T LINK TO LEARN ARTICLES
**Current:** Product detail pages link only to other products and back to shop.
**Fix:** Add contextual learn links:
- BAC water products -> link to "What is BAC Water?" guide
- Syringe products -> link to "How to Read an Insulin Syringe" guide
- All products -> link to reconstitution guide

### Gap 5: LEARN ARTICLES DON'T LINK TO TOOLS
**Current:** Learn article body content has no inline links to calculators.
**Fix:** Within article body text, add contextual links:
- Articles mentioning BAC water amounts -> link to `/tools/bac-water`
- Articles mentioning dosing -> link to `/tools/dose`
- Articles mentioning syringes -> link to `/tools/syringe-units`

### Gap 6: ABOUT PAGE DOESN'T LINK TO LEARN, TOOLS, FAQ, OR CONTACT
**Current:** Only links to `/plan` and `/shop`.
**Fix:** Add links to:
- "Read our [guides](/learn)" in the paragraph about educational tools
- "Try our [free calculators](/tools)" in the paragraph about calculations
- "[Contact us](/contact) with questions"

### Gap 7: TOOLS INDEX DOESN'T LINK TO LEARN
**Current:** Only links to individual tools and `/plan`.
**Fix:** Add:
- "New to peptides? Read our [beginner guides](/learn)"
- "Need supplies? [Shop here](/shop)"

### Gap 8: `/tools/ml-to-units` IS FULLY ORPHANED
**Current:** Zero inbound links from anywhere. Not in sitemap, not in nav, not linked from any page.
**Fix:** Either:
- (A) Add a redirect from `/tools/ml-to-units` to `/tools/syringe-units` (preferred)
- (B) Add canonical tag and link from syringe-units page

### Gap 9: `/plan/advanced` IN SITEMAP BUT IS A REDIRECT
**Current:** In sitemap but just `redirect("/plan")`. No inbound links.
**Fix:** Remove from sitemap array at `src/app/sitemap.ts:11`.

### Gap 10: FOOTER HARDCODES LEARN ARTICLE SLUGS
**Current:** `src/components/layout/site-footer.tsx:12-13` hardcodes `what-is-bac-water` and `how-peptide-reconstitution-works`.
**Risk:** If these slugs change in the admin panel, footer links will 404.
**Fix:** Either:
- (A) Query DB for the first N published guides and render dynamically
- (B) Accept the risk and document the slug dependency

---

## Recommended Link Architecture Additions

### Add Breadcrumb Navigation
Every page below the homepage should display a visual breadcrumb. Wire the existing `WebPageJsonLd` component (`src/components/common/webpage-json-ld.tsx`) which already supports BreadcrumbList schema.

Example breadcrumb paths:
```
Home > Shop > [Product Name]
Home > Learn > [Guide Title]
Home > Tools > BAC Water Calculator
Home > FAQ
Home > About
```

### Add "Related Content" Sidebar/Sections
For pages that currently have no cross-section links:

| Page Type | Add Links To |
|-----------|-------------|
| Learn articles | Related tools, related products |
| Product pages | Related guides, relevant calculator |
| Tool pages | Related guides (already have related tools) |
| FAQ | Tools, guides (inline in answers) |

### Add "You Might Also Need" CTA on Tool Pages
After calculator results, suggest:
- "Get the supplies for this plan" -> `/shop` or `/tools/supplies`
- "Save this as a full plan" -> `/plan`
- "Learn more about [topic]" -> relevant `/learn/[slug]`

---

## Link Equity Flow Analysis

**Pages receiving most internal link equity:**
1. `/plan` -- linked from homepage (x3), about, learn articles CTA, tools, shop
2. `/shop` -- linked from homepage (x2), about, tools, footer
3. `/learn` -- linked from homepage (x2), footer, header
4. `/tools` -- linked from header, footer, shop intro

**Pages receiving least internal link equity:**
1. `/contact` -- only linked from footer and FAQ
2. `/about` -- only linked from footer
3. `/disclaimer` -- only linked from footer
4. Legal pages in general -- all footer-only
5. Individual tool pages -- only linked from tools index and cross-links

**Recommendation:** Add contextual links to `/contact` from more pages (about, FAQ answers). Add contextual links to `/about` from learn articles ("About our approach to accuracy").
