# Completed Updates - SEO Audit Implementation

_July 2026. Changes implemented directly in the codebase during this audit pass, with before/after. All shipped on the next deploy; verified locally in the dev preview._

## Technical SEO

### 1. Self-referencing canonicals across ~18 routes
- **Before:** Only 8 pages set `alternates.canonical`. The homepage and ~15 indexable routes (all `/tools/*`, `/shop`, `/plan`, `/plan/new`, `/about`, `/contact`, `/editorial-policy`, `/shipping-returns`, `/disclaimer`, `/privacy`, `/terms`, `/tools/reconstitution`) had no explicit canonical, creating duplicate-URL risk on parameterized/alternate-cased hits.
- **After:** Every indexable page now sets a self-referencing canonical (homepage `= { alternates: { canonical: "/" } }`; tool subpages via their `layout.tsx`).
- **Files:** `src/app/page.tsx` + 17 pages/layouts.

### 2. Homepage title length
- **Before:** `BACwater.ai - The Complete BAC Water Calculator & Reconstitution Guide` (70 chars, truncated in SERPs).
- **After:** `BAC Water Calculator & Reconstitution | BACwater.ai` (55 chars). Applied to the root default title and OG title.
- **File:** `src/app/layout.tsx`.

### 3. Duplicate `BreadcrumbList` schema removed
- **Before:** Two `BreadcrumbList` graphs per content page - one inside `WebPage.breadcrumb` (from `WebPageJsonLd`) and one standalone (from the visible `Breadcrumbs` component).
- **After:** `WebPageJsonLd` no longer emits a `BreadcrumbList`; the visible `Breadcrumbs` component is the single source. Verified: 1 `BreadcrumbList` per page.
- **File:** `src/components/common/webpage-json-ld.tsx`.

### 4. robots.txt + noindex conflict resolved
- **Before:** `/plans`, `/cart`, `/checkout`, `/signin`, `/signup`, `/plan/*/edit`, `/plan/*/label` were BOTH `Disallow`ed in robots AND carried a `noindex` meta. Disallowed pages can't be crawled, so Google can't see the `noindex` and may index the URL as a blocked entry.
- **After:** robots now disallows only truly private/functional paths: `/admin`, `/api`, `/plan/*/pdf`. The noindex pages remain crawlable so their `noindex` meta is honored.
- **File:** `src/app/robots.ts`.

### 5. Legacy paths made permanent redirects + removed from sitemap
- **Before:** `/plan/advanced` and `/tools/ml-to-units` used render-time `redirect()` (temporary 307) and both were listed in the sitemap (a "sitemap contains redirect" warning).
- **After:** Both are `permanent: true` (308) redirects in `next.config.ts`; both removed from `STATIC_PAGES`. Verified: `/plan/advanced` → `/plan`, `/tools/ml-to-units` → `/tools/syringe-units`.
- **Files:** `next.config.ts`, `src/lib/seo/sitemap.ts`.

## Structured data

### 6. Product `Offer` enriched
- **Before:** `Offer` had price, currency, availability, url only (Google Merchant "missing field" warnings for shipping/returns/price validity).
- **After:** Added `priceValidUntil` (1 year out), `shippingDetails` (US, 1-2 day handling + 2-5 day transit), and `hasMerchantReturnPolicy` (30-day free return by mail, matching the shipping-returns policy). Product `image` now absolutized with an OG fallback.
- **File:** `src/components/common/product-json-ld.tsx`.

### 7. Article schema completed
- **Before:** `Article` had headline, articleBody (raw markdown with `##`/`**`), author/publisher, dates.
- **After:** Added `image` and `mainEntityOfPage`, and stripped markdown from `articleBody` to plain text.
- **File:** `src/components/common/article-json-ld.tsx`.

## Accessibility

### 8. Unlabeled inputs + focus fallback
- **Before:** The two custom-peptide text inputs had only a placeholder (not an accessible name). No global `:focus-visible` fallback for inline interactive elements.
- **After:** Added `aria-label` to both custom-peptide inputs; added a global `:focus-visible { outline }` fallback in `globals.css` (component-level rings on Button/Input/Select were already present).
- **Files:** `src/components/plan/plan-form.tsx`, `src/app/globals.css`.

## Verification (dev preview)
- Home: title 55 chars, self-canonical present.
- Peptide page: exactly 1 `BreadcrumbList`.
- robots.txt: disallows only `/admin`, `/api`, `/plan/*/pdf`.
- Product schema: `priceValidUntil` + `hasMerchantReturnPolicy` present.
- Redirects: `/plan/advanced` → `/plan`, `/tools/ml-to-units` → `/tools/syringe-units`.
- `tsc --noEmit` passes; zero em dashes.

## Phase 2: full roadmap implementation

The Tier 1 to Tier 3 roadmap items were then built out. All of the following ship on the next deploy; verified locally (production build succeeds, `tsc` clean, all new routes return 200 in the dev preview, zero em or en dashes).

### Trust and citations (E-E-A-T)
- **Scientific citations layer.** New `src/lib/content/references.ts` holds a curated set of verified primary sources (FDA labeling via DailyMed, NIH PubChem for benzyl alcohol, CDC injection-safety multi-dose vial guidance). Every URL was checked against the authority before inclusion. A new `References` component renders a visible "References" block, and `citation` JSON-LD is emitted on peptide pages, comparison pages, guide articles, the homepage, and the per-vial-size pages.
- **Reviewed-by + last-reviewed signal.** New `ReviewedBy` component states a described, team-level review process ("Reviewed and maintained by the BACwater.ai editorial team against cited sources, last reviewed [date]") with a link to the editorial policy. Schema now emits `reviewedBy` + `lastReviewed` + `dateModified` on content pages. No individual bylines and no fabricated credentials, per the E-E-A-T decision in `ai-search-readiness-analysis.md`.
- **Connected `@id` graph.** New `src/lib/seo/schema.ts` defines one Organization node (`#organization`) referenced by `WebSite.publisher`, Article `author`/`publisher`, and WebPage `reviewedBy`, so engines resolve one confident publisher entity.

### AEO answer blocks
- **Homepage** now has a definition answer block ("What is bacteriostatic water?") plus a head-facts quick-reference table (bac water, 5 mg vial, shelf life, units to mL, mg to mcg), and a WebPage schema node.
- **Tool pages** gained a shared `ToolExtras` block (`src/components/tools/tool-extras.tsx`): a quick-reference numeric table, a Related-questions FAQ with FAQPage schema (answers in server HTML via native `details`), and contextual links into the peptide / FAQ / buy clusters. Applied to bac-water, dose, syringe-units, mg-to-mcg, supplies, and reverse-bac.
- **Peptide pages** gained a labeled "Short answer" TL;DR one-liner under the H1.

### New tools and pages
- **Reverse-BAC calculator** at `/tools/reverse-bac`: pick the dose and the exact syringe units you want to draw, get the precise bac water to add. Uses the animated `SyringeVisual` with capacity warnings.
- **Per-peptide + per-vial-size landing pages** at `/peptides/[slug]/[size]` for a curated, demand-driven set (bpc-157, tb-500, tirzepatide, semaglutide, ipamorelin, retatrutide across their real strengths; 18 pages). `dynamicParams = false` keeps the set controlled; each has unique computed numbers, intro prose, HowTo + FAQ + citation schema, and self-canonical. Enumerated in the peptides sitemap.
- **Shelf-life / refrigeration deep-dive** at `/learn/bac-water-shelf-life`, including the refrigeration-vs-preservative nuance framed conservatively, a per-peptide shelf-life table, and citations.
- **Where to buy (2026 buyer's guide)** at `/learn/where-to-buy-bacteriostatic-water`, a commercial-investigation page funneling to `/buy` and `/shop`.
- **Peptide glossary** at `/learn/glossary` with a `DefinedTermSet` graph and 10 anchored terms.
- **Free printable vial labels** landing page at `/tools/vial-labels` marketing the Plan Builder's QR-coded label output.

### Schema
- **SoftwareApplication** schema on all calculators (the 6 tools + the reverse-BAC tool + the reconstitution page).
- **ItemList** on `/tools`; **WebPage** added to the homepage and the shop PDP.
- `Organization.sameAs` and WebSite `SearchAction` intentionally omitted (no social profiles to cite and no on-site search yet); documented in `schema-map.md`.

### Internal linking (hub-and-spoke)
- Homepage now links to popular peptides, common comparisons, `/buy`, and `/faq`.
- Comparison pages gained a "Reconstitute a specific peptide" grid into the peptide hub.
- Peptide pages gained explicit `/buy`, `/faq`, comparison, and shelf-life links.
- Tool pages link to `/peptides`, `/faq`, and `/buy` via `ToolExtras`.

### Core Web Vitals
- Product images (local SVGs in `aspect-square` containers) now carry explicit `width`/`height` and `fetchPriority="high"` on the PDP hero (LCP) with lazy-loading elsewhere. `next/image` was intentionally not used: it does not optimize SVGs and would require `dangerouslyAllowSVG`, and the container already reserves layout space so CLS is a non-issue.

### Registration
New routes were wired into `STATIC_PAGES`, the segmented sitemaps, the learn catalog (so related-reading surfaces them), the footer, and the dynamic `llms.txt`.

## Deferred / follow-up
- Prefilling the Plan Builder from a peptide/size query param (the per-vial-size pages already show all numbers; deep-link prefill is a client-form enhancement left for later to avoid a risky `useSearchParams` refactor).
- A real named, credentialed reviewer remains a business decision (would raise the YMYL trust ceiling further); the organization-level signal is in place.
- `next/image` migration if product art moves to raster formats.
