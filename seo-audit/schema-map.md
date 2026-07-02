# BACwater.ai - Schema Map

**Date:** 2026-07-02
**Scope:** JSON-LD structured data per page type. Confirms current @types against recommended, and lists remaining additions.

---

## Sitewide (root layout)

Emitted on every page from `src/app/layout.tsx` and `src/components/common/org-json-ld.tsx`:

| @type | Source | Notes |
|-------|--------|-------|
| `Organization` | `OrgJsonLd` | name, url, `logo: /icon.svg` (SVG, valid), `description`, `contactPoint` (email info@bacwater.ai, customer service, English). No `sameAs`. No `@id`. |
| `WebSite` | inline in `layout.tsx` | name, url, description, `publisher` (inline Organization). No `SearchAction`. Publisher is a duplicated inline node rather than an `@id` reference. |

Recommended additions:
- Add `sameAs` (social/profile URLs) to Organization, or leave omitted (currently omitted, acceptable).
- Add `@id: "https://bacwater.ai/#organization"` to Organization and reference it from `WebSite.publisher` and `Article.publisher` to form a connected graph (currently each schema re-declares an inline Organization).
- Optional: add `SearchAction` (`potentialAction`) to `WebSite` if an on-site search endpoint exists. No search UI today, so this is optional and should be skipped until search ships.

---

## Component Inventory

| Component | File | Emits |
|-----------|------|-------|
| `OrgJsonLd` | `common/org-json-ld.tsx` | Organization |
| WebSite (inline) | `app/layout.tsx` | WebSite |
| `WebPageJsonLd` | `common/webpage-json-ld.tsx` | WebPage + `isPartOf` WebSite. **Does NOT emit BreadcrumbList** (deduped; the `breadcrumb` prop is accepted for compatibility but voided). |
| `Breadcrumbs` | `common/breadcrumbs.tsx` | Visible breadcrumb UI + the single BreadcrumbList JSON-LD for the page. |
| `ProductJsonLd` | `common/product-json-ld.tsx` | Product + Offer (server component). |
| `ArticleJsonLd` | `common/article-json-ld.tsx` | Article. |
| `FaqJsonLd` | `common/faq-json-ld.tsx` | FAQPage. |
| `HowToJsonLd` | `common/howto-json-ld.tsx` | HowTo. |
| `ImageJsonLd` | `common/image-json-ld.tsx` | ImageObject. |
| CollectionPage/ItemList (inline) | `peptides/page.tsx`, `learn/page.tsx`, `shop/page.tsx` | CollectionPage or ItemList. |
| FAQPage (inline) | `faq/page.tsx`, `shop/[slug]/page.tsx` | FAQPage (with DB FAQs merged on `/faq`). |

BreadcrumbList is emitted once per page by `Breadcrumbs` only. `WebPageJsonLd` intentionally suppresses its own BreadcrumbList to avoid a duplicate graph. Confirmed in `webpage-json-ld.tsx`.

---

## Per-Page Coverage

Legend: HAVE = present, ADD = recommended addition, OK = complete.

| Page | Current @types | Recommended | Status |
|------|----------------|-------------|--------|
| `/` | Organization, WebSite | + WebPage | ADD WebPage (homepage has no WebPageJsonLd). Optional SoftwareApplication for the hero calculator. |
| `/plan` | Organization, WebSite, WebPage | (WebApplication optional) | OK. Consider `WebApplication`/`SoftwareApplication` since it is an interactive tool. |
| `/plan/new` | Organization, WebSite, WebPage, HowTo (inline) | - | OK. |
| `/peptides` | Organization, WebSite, WebPage, CollectionPage + ItemList, BreadcrumbList | - | OK. |
| `/peptides/[slug]` | Organization, WebSite, WebPage, HowTo (non-custom), FAQPage, ImageObject (charted), BreadcrumbList | - | OK. Best-covered template. HowTo omitted only on `custom`. |
| `/learn` | Organization, WebSite, WebPage, CollectionPage + ItemList, BreadcrumbList | - | OK. |
| `/learn/[slug]` | Organization, WebSite, Article, BreadcrumbList | + WebPage; + FAQPage if guide has Q&A | ADD WebPage (guide pages skip `WebPageJsonLd`). Article has image + `mainEntityOfPage` + datePublished + author + publisher. |
| `/learn/vs/[topic]` | Organization, WebSite, WebPage, FAQPage, ImageObject, BreadcrumbList | - | OK. |
| `/faq` | Organization, WebSite, WebPage, FAQPage (CORE + DB FAQs merged), ImageObject, BreadcrumbList | - | OK. |
| `/buy` | Organization, WebSite, WebPage, Product + Offer (featured), FAQPage, ImageObject, BreadcrumbList | - | OK. |
| `/shop` | Organization, WebSite, WebPage, ItemList, BreadcrumbList | (CollectionPage optional) | OK. Could wrap ItemList in CollectionPage for parity with `/peptides` and `/learn`. |
| `/shop/[slug]` | Organization, WebSite, Product + Offer, FAQPage (inline), BreadcrumbList | + WebPage | ADD WebPage (PDP uses ProductJsonLd + inline FAQPage + Breadcrumbs but no WebPageJsonLd). |
| `/tools` | Organization, WebSite, WebPage | + ItemList | ADD ItemList of the 6 calculators (parity with other hubs). |
| `/tools/bac-water` | Organization, WebSite, WebPage | + SoftwareApplication or HowTo | ADD SoftwareApplication/WebApplication (interactive calc). Optionally HowTo for the "how to use" steps. |
| `/tools/reconstitution` | Organization, WebSite, WebPage | + SoftwareApplication or HowTo | ADD as above. |
| `/tools/dose` | Organization, WebSite, WebPage | + SoftwareApplication | ADD. |
| `/tools/syringe-units` | Organization, WebSite, WebPage | + SoftwareApplication | ADD. |
| `/tools/mg-to-mcg` | Organization, WebSite, WebPage | + SoftwareApplication | ADD. |
| `/tools/supplies` | Organization, WebSite, WebPage | + SoftwareApplication | ADD. |
| `/about` | Organization, WebSite, WebPage | (AboutPage optional) | OK. Could type as `AboutPage`. |
| `/contact` | Organization, WebSite, WebPage | (ContactPage optional) | OK. Could type as `ContactPage`. |
| `/editorial-policy` | Organization, WebSite, WebPage | - | OK. Strong E-E-A-T page. |
| `/shipping-returns` | Organization, WebSite, WebPage | - | OK. |
| `/disclaimer` | Organization, WebSite, WebPage | - | OK. |
| `/privacy` | Organization, WebSite, WebPage | - | OK. |
| `/terms` | Organization, WebSite, WebPage | - | OK. |

---

## Confirmations Against Audit Requirements

- **Organization + WebSite sitewide:** CONFIRMED (root layout).
- **Single BreadcrumbList, deduped:** CONFIRMED. `WebPageJsonLd` no longer emits BreadcrumbList; the `Breadcrumbs` component is the sole emitter.
- **WebPage:** present on most templates; MISSING on `/`, `/learn/[slug]`, `/shop/[slug]` (add there).
- **FAQPage:** CONFIRMED on `/faq` (CORE + DB), peptide pages, comparisons, `/buy`, and shop PDP.
- **HowTo:** CONFIRMED on peptide pages (non-custom) and `/plan/new`.
- **Product with priceValidUntil / shippingDetails / hasMerchantReturnPolicy:** CONFIRMED in `ProductJsonLd` (used on `/shop/[slug]` and `/buy`). Also includes sku, brand, url, offer url, availability. Missing only `aggregateRating`/`review` (add if/when reviews exist).
- **ImageObject (infographics):** CONFIRMED on peptide charts, comparisons, `/buy`, `/faq`.
- **Article with image + mainEntityOfPage:** CONFIRMED in `ArticleJsonLd` (also datePublished, dateModified, author, publisher).
- **CollectionPage / ItemList:** CONFIRMED on `/peptides` (CollectionPage + ItemList) and `/learn` (CollectionPage + ItemList); `/shop` emits ItemList (no CollectionPage wrapper); `/tools` emits neither yet.

---

## Recommended Additions, Prioritized

| Priority | Action | Pages |
|----------|--------|-------|
| High | Add `WebPageJsonLd` | `/`, `/learn/[slug]`, `/shop/[slug]` |
| High | Add `SoftwareApplication`/`WebApplication` schema for interactive calculators | `/tools/*` (6), `/plan`, `/plan/new`, homepage hero calc |
| Medium | Add `ItemList` to the tools hub | `/tools` |
| Medium | Wire `@id` graph: single Organization node referenced by WebSite.publisher and Article.publisher | sitewide |
| Low | Type `/about` as AboutPage, `/contact` as ContactPage | `/about`, `/contact` |
| Low | Wrap `/shop` ItemList in CollectionPage for hub parity | `/shop` |
| Low | Add `SearchAction` to WebSite once on-site search exists | sitewide |
| Deferred | Add `aggregateRating` / `review` to Product | `/shop/[slug]`, `/buy` (only with real reviews; do not fabricate) |
