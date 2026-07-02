# Full Site Audit - bacwater.ai

_Updated July 2026 (reflects the current codebase after this audit's implementation pass). Scope: every indexable and non-indexable page type, plus header, footer, nav, internal links, breadcrumbs, forms, CTAs, images, schema, metadata, and technical infrastructure._

## 1. What the site is

BACwater.ai is a single-purpose authority + ecommerce hub for **bacteriostatic water (BAC water) and peptide reconstitution**:

- A **deterministic calculator** (plan builder `/plan` + 6 standalone tools) - the core utility and primary ranking asset.
- A **programmatic content cluster**: 24 per-peptide reconstitution guides (`/peptides/[slug]`) and 7 "BAC water vs X" comparisons (`/learn/vs/[topic]`).
- An **education layer**: a filterable Learn hub (`/learn`), DB-backed guides (`/learn/[slug]`), and an FAQ hub (`/faq`).
- A **commercial layer**: `/buy`, `/shop`, `/shop/[slug]`, cart, checkout.
- **Trust/compliance**: about, editorial policy, shipping/returns, disclaimer, privacy, terms.

Entity focus is tight and consistent - the whole site is about one thing - which is a strong GEO/topical-authority position.

## 2. Page inventory + keep / improve / consolidate / remove decisions

| URL / pattern | Type | Indexable | Decision |
|---|---|---|---|
| `/` | Pillar | Yes | **Keep + strengthen** (self-canonical + shortened title done; add answer blocks - see aeo plan). |
| `/plan`, `/plan/new` | Tool | Yes | **Keep.** `/plan/advanced` now 308→`/plan` (URL sprawl resolved). |
| `/plan/[id]` (+edit/label) | User artifact | No (noindex ✓) | Keep. |
| `/peptides` | Hub | Yes | Keep (ItemList schema). |
| `/peptides/[slug]` ×24 | Programmatic guide | Yes | **Keep** - genuinely unique (data + editorial + FAQ + chart). Low doorway risk (see programmatic-seo-analysis.md). |
| `/learn` | Filterable hub | Yes (base) / noindex (narrow filters) | Keep - filter canonicalization correct. |
| `/learn/[slug]` | Article | Yes | Keep + tag-driven related reading. |
| `/learn/vs/[topic]` ×7 | Comparison | Yes | Keep - high AEO value. |
| `/faq` | FAQ hub | Yes | Keep - answers now in HTML (forceMount) + FAQPage schema. |
| `/buy` | Commercial landing | Yes | Keep. Watch buy↔shop cannibalization (Search Console). |
| `/shop`, `/shop/[slug]` | Catalog / PDP | Yes | Keep - Product schema enriched (return policy, shipping, priceValidUntil). |
| `/tools`, `/tools/*` (6) | Tool | Yes | Keep. `/tools/ml-to-units` now 308→`/tools/syringe-units`. |
| Trust/legal (about, editorial-policy, shipping-returns, contact, disclaimer, privacy, terms) | Trust | Yes | Keep - self-canonicals added. |
| `/plans`, `/cart`, `/checkout`, `/signin`, `/signup`, `/admin/*` | Funnel/private | No (noindex ✓) | Keep. |
| `/learn/bac-water-vs-sterile-water` | Legacy | 301 → `/learn/vs/sterile-water` | Redirected ✓. |

**Verdict: no thin/doorway pages to remove.** The programmatic cluster passes the uniqueness test. Structural cleanups (plan URL sprawl, ml-to-units) were implemented this pass.

## 3. Global elements

- **Header nav**: Build My Plan, Peptides, Shop, Learn, Tools, My Plans, Cart. Descriptive crawlable links. `/buy` and `/faq` are footer-only (see internal-linking-plan.md - P2 opportunity).
- **Footer**: Product / Learn / Company columns + persistent research-use disclaimer, editorial policy + shipping links. Strong E-E-A-T.
- **Breadcrumbs**: on content pages with a single `BreadcrumbList` (WebPageJsonLd no longer emits a duplicate - fixed this pass).
- **Schema**: Organization + WebSite sitewide; WebPage, BreadcrumbList, FAQPage, HowTo, Product, ImageObject, Article, CollectionPage/ItemList. See schema-map.md.
- **Sitemaps**: segmented index → pages/peptides/learn/products; robots references it and allows all major AI crawlers.
- **llms.txt**: dynamic, generated from the live roster.
- **Analytics**: GA4 + Microsoft Clarity (production-gated); IndexNow key + submission endpoint.

## 4. Rolled-up findings

**Strengths**
- Tight entity focus + deep single-subject coverage (strong GEO/topical authority).
- Deterministic, tested calculator = genuine utility and differentiator vs. content-only competitors.
- Comprehensive schema, segmented sitemaps, AI-crawler allowlist, dynamic llms.txt, forceMount FAQ answers in HTML.
- Company-level E-E-A-T (editorial policy + disclaimers); a unique product moat (Plan Builder → PDF + printable QR vial labels).

**Implemented this pass** (see completed-updates.md): canonicals ×18, shortened home title, BreadcrumbList dedup, robots/noindex conflict fixed, 308 redirects, Product/Article schema enrichment, a11y (aria-labels + focus-visible).

**Top remaining opportunities** (see implementation-roadmap.md)
1. Scientific citations + a credentialed-review signal on core guides (E-E-A-T; matches peptidefox/freemedicaljournals/riteaid).
2. Per-peptide + per-vial-size landing pages for top long-tail queries (matches freemedicaljournals/worldpeptideassociation).
3. A reverse-BAC calculator + draggable syringe visualization (matches praxpeptides/helloregimen).
4. Answer/definition blocks on the pillar + comparisons for AI Overviews and featured snippets.
5. Product images → `next/image` (or explicit dimensions) for CWV.
6. "Where to buy bacteriostatic water (2026)" content + market the printable-labels asset for links.
