# Completed Updates — SEO Audit Implementation

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
- **Before:** Two `BreadcrumbList` graphs per content page — one inside `WebPage.breadcrumb` (from `WebPageJsonLd`) and one standalone (from the visible `Breadcrumbs` component).
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

## Deferred to the roadmap (not implemented this pass)
Higher-effort or content/product items are documented in `implementation-roadmap.md`: scientific citations + credentialed-review signal, per-peptide/per-vial-size landing pages, reverse-BAC calculator, draggable syringe visualization, product images → `next/image`, "where to buy 2026" content, and marketing the printable-labels asset. These were intentionally left for review because they are larger builds or involve editorial/product decisions (e.g. the no-individual-bylines E-E-A-T stance).
