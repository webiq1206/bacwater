# BACwater.ai -- Full Site SEO Audit

**Date:** 2026-07-01
**Auditor:** Automated agent analysis of source code
**Framework:** Next.js 16 (App Router), Tailwind v4, Prisma, NextAuth
**Domain:** bacwater.ai
**Scope:** ~20 public-facing pages + 7 tool subpages + dynamic product/guide pages

---

## Executive Summary

BACwater.ai has a solid technical foundation: server-rendered pages, a programmatic sitemap, a robots.ts that explicitly allows AI crawlers, and metadata on most pages. Three JSON-LD schema types are deployed (Organization, Article, FAQPage, Product). A `WebPageJsonLd` component with BreadcrumbList support was built but never wired into any page.

The site's primary weaknesses are in schema coverage, content depth, and internal linking density. Only 4 of ~20 page types carry page-level structured data. No page uses the `WebPageJsonLd` or BreadcrumbList schema. Several pages lack descriptions, and the about/privacy pages are thin. GEO and AEO readiness is limited -- content is not structured for direct-answer extraction, and there are no summary/definition blocks at the top of content pages.

---

## Findings by Priority

### Critical (blocks indexing, rich results, or causes incorrect SERP data)

| # | Finding | File(s) | Impact |
|---|---------|---------|--------|
| C1 | **WebPageJsonLd component exists but is unused on every page** | `src/components/common/webpage-json-ld.tsx` | No WebPage or BreadcrumbList schema on any page. Missed rich breadcrumb display in SERPs. |
| C2 | **ProductJsonLd is a client component (`"use client"`)** | `src/components/common/product-json-ld.tsx:1` | JSON-LD rendered client-side only. Search engines that don't execute JS won't see Product schema. Remove unused `formatCurrency` import and `"use client"` directive. |
| C3 | **Legal pages (terms, privacy, disclaimer) have no description** | `src/app/terms/page.tsx:1`, `src/app/privacy/page.tsx:1`, `src/app/disclaimer/page.tsx:1` | They inherit the root layout description about "peptide reconstitution plans," which is misleading in SERPs. |
| C4 | **Organization schema `logo` points to favicon.ico** | `src/components/common/org-json-ld.tsx:7` | Google requires PNG/JPG/WebP/SVG logo at least 112x112px. ICO format is not accepted. |
| C5 | **Organization schema `sameAs` is an empty array** | `src/components/common/org-json-ld.tsx:9` | Google may flag the empty array. Either populate with social URLs or remove the property. |
| C6 | **Article schema missing `author` and `datePublished`** | `src/components/common/article-json-ld.tsx` | Google requires both for Article rich results. Only `dateModified` is present. |
| C7 | **`/plan/advanced` is in the sitemap but is a pure redirect** | `src/app/sitemap.ts:11`, `src/app/plan/advanced/page.tsx` | Wastes crawl budget. Remove from sitemap STATIC array. |
| C8 | **FAQPage JSON-LD excludes database-sourced FAQs** | `src/app/faq/page.tsx:47-55` | Only 7 hardcoded Q&A pairs in schema; DB FAQs visible to users but invisible to structured data. |
| C9 | **`/tools/ml-to-units` is duplicate content** | `src/app/tools/ml-to-units/page.tsx` | Re-exports syringe-units page wholesale. No canonical tag, no redirect. Not in sitemap but crawlable. |

### High (hurts ranking, GEO/AEO readiness, or user trust)

| # | Finding | File(s) | Impact |
|---|---------|---------|--------|
| H1 | **No WebSite schema anywhere** | N/A | Google uses WebSite schema for sitelinks search box. Should be in root layout alongside Organization. |
| H2 | **Organization schema lacks `contactPoint`** | `src/components/common/org-json-ld.tsx` | Missing customer support contact info that enhances knowledge panel. |
| H3 | **No direct-answer blocks on content pages** | All learn, FAQ, tool pages | Content is not structured for featured snippets or AI citation. No definition boxes, no "short answer" paragraphs at top. |
| H4 | **Learn article body has no heading hierarchy** | `src/app/learn/[slug]/page.tsx:32-46` | The `renderBody()` function only parses bold/italic. Markdown headings render as plain paragraphs. No H2/H3 subheadings within articles. |
| H5 | **About page is very thin (~120 words)** | `src/app/about/page.tsx` | No H2 subheadings, no outbound links to learn/tools/FAQ. Thin content for a product-selling site. |
| H6 | **Privacy policy is extremely thin (~60 words)** | `src/app/privacy/page.tsx` | No mention of analytics, data retention, CCPA/GDPR, third-party services, or international users. Potential compliance and trust gap. |
| H7 | **No breadcrumb UI component exists** | N/A | No visual breadcrumbs for navigation. The WebPageJsonLd component supports BreadcrumbList but is unused. |
| H8 | **Product detail FAQ is not in any FAQPage schema** | `src/app/shop/[slug]/page.tsx:31-44` | 3 hardcoded FAQs on each PDP (prescription, shipping, returns) are only visual. |
| H9 | **Product images are SVG placeholders** | `src/app/shop/[slug]/page.tsx:62-66` | Products without `imageUrl` show a bullet character. No real product photography. |
| H10 | **OG description for learn articles includes raw markdown** | `src/app/learn/[slug]/page.tsx:18` | `g.body.slice(0, 155)` without stripping -- meta description strips markdown but OG does not. |
| H11 | **No HowTo schema on tool pages** | All `/tools/*` pages | Interactive calculators with teaching sections are strong candidates for HowTo rich results. |
| H12 | **Footer hardcodes specific learn article slugs** | `src/components/layout/site-footer.tsx:12-13` | If `what-is-bac-water` or `how-peptide-reconstitution-works` slugs change in admin, footer links 404. |

### Medium (missed opportunities, suboptimal signals)

| # | Finding | File(s) | Impact |
|---|---------|---------|--------|
| M1 | **No Content-Security-Policy header** | `next.config.ts` | Other security headers present (X-Frame-Options, HSTS, etc.) but CSP is absent. |
| M2 | **Shop listing has no ItemList/CollectionPage schema** | `src/app/shop/page.tsx` | No structured data on the product listing page. |
| M3 | **Learn listing has no CollectionPage schema** | `src/app/learn/page.tsx` | No structured data on the guide listing page. |
| M4 | **Product schema missing `sku`, `brand`, `url`** | `src/components/common/product-json-ld.tsx` | Product.sku exists in the database but is not emitted in schema. |
| M5 | **FAQ answers don't cross-link to tools/learn** | `src/app/faq/page.tsx` | "How much BAC water should I add?" is a natural place to link to `/tools/bac-water` but is plain text only. |
| M6 | **Contact page has zero outbound links** | `src/app/contact/page.tsx` | No "check our FAQ first" or "browse our guides" before the form. |
| M7 | **Legal pages have no links back to the site** | `src/app/terms/page.tsx`, `src/app/disclaimer/page.tsx` | Users landing from search are dead-ended. |
| M8 | **No cross-linking from shop PDPs to learn articles** | `src/app/shop/[slug]/page.tsx` | BAC water product pages don't link to "What is BAC Water?" guide. |
| M9 | **Cart/checkout pages lack page-level `noindex`** | `src/app/cart/page.tsx`, `src/app/checkout/page.tsx` | robots.ts disallows them, but belt-and-suspenders noindex would be safer. |
| M10 | **Homepage has no page-specific JSON-LD** | `src/app/page.tsx` | Only the global Organization schema. No WebSite, no SearchAction. |
| M11 | **No explicit canonical tags on dynamic pages** | `src/app/learn/[slug]/page.tsx`, `src/app/shop/[slug]/page.tsx` | Next.js handles this via metadataBase, but explicit `alternates.canonical` is best practice. |

### Low (polish, nice-to-have)

| # | Finding | File(s) | Impact |
|---|---------|---------|--------|
| L1 | **`not-found.tsx` has no metadata export** | `src/app/not-found.tsx` | Adding `title: "Page not found"` improves browser tab UX. |
| L2 | **No Twitter-specific OG image** | N/A | Only one global OG image. No per-page social images. |
| L3 | **Sitemap priorities could be tuned** | `src/app/sitemap.ts` | All static pages share 0.7 priority. Tools and plan pages are higher-value than legal pages. |
| L4 | **`/plans` route in header nav but noindexed** | `src/app/plans/page.tsx` | Correct for user-specific content, but header link sends PageRank to a noindex page. |
| L5 | **No `lang` attribute on pages other than root** | `src/app/layout.tsx:72` | Root layout sets `lang="en"` which propagates. Fine for English-only, but `hreflang` tag could confirm no other language versions. |
