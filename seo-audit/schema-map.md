# BACwater.ai -- Schema Map

**Date:** 2026-07-01

Current JSON-LD structured data per page type vs what is required.

---

## Schema Components Inventory

| Component | File | Type | Used On | Rendering |
|-----------|------|------|---------|-----------|
| `OrgJsonLd` | `src/components/common/org-json-ld.tsx` | Organization | Every page (root layout) | Server |
| `ProductJsonLd` | `src/components/common/product-json-ld.tsx` | Product + Offer | `/shop/[slug]` | **Client** (problem) |
| `ArticleJsonLd` | `src/components/common/article-json-ld.tsx` | Article | `/learn/[slug]` | Server |
| `WebPageJsonLd` | `src/components/common/webpage-json-ld.tsx` | WebPage + BreadcrumbList | **UNUSED** | Server |
| FAQPage (inline) | `src/app/faq/page.tsx:47-55` | FAQPage | `/faq` | Server |

---

## Per-Page Schema Coverage

### Legend
- HAVE = currently implemented
- NEED = required but missing
- WANT = recommended but optional

| Page | Current Schema | Required Schema | Gap |
|------|---------------|-----------------|-----|
| `/` (Homepage) | Organization (global) | Organization, **WebSite**, WebPage | NEED: WebSite, WANT: WebPage |
| `/plan` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/plan/new` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/shop` | Organization (global) | WebPage, BreadcrumbList, **ItemList** | NEED: WebPage + Breadcrumb, WANT: ItemList |
| `/shop/[slug]` | Organization + Product + Offer | WebPage, BreadcrumbList, Product, Offer, **FAQPage** | NEED: Breadcrumb, FAQPage for PDP FAQs. Fix: make server component. |
| `/learn` | Organization (global) | WebPage, BreadcrumbList, **CollectionPage** | NEED: WebPage + Breadcrumb, WANT: CollectionPage |
| `/learn/[slug]` | Organization + Article | WebPage, BreadcrumbList, Article | NEED: Breadcrumb. Fix: add author, datePublished, image to Article |
| `/faq` | Organization + FAQPage | WebPage, BreadcrumbList, FAQPage | NEED: Breadcrumb. Fix: include DB FAQs in schema |
| `/about` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/contact` | Organization (global) | WebPage, BreadcrumbList, **ContactPage** | NEED: WebPage + Breadcrumb, WANT: ContactPage |
| `/tools` | Organization (global) | WebPage, BreadcrumbList, **ItemList** | NEED: WebPage + Breadcrumb, WANT: ItemList |
| `/tools/reconstitution` | Organization (global) | WebPage, BreadcrumbList, **HowTo** | NEED: WebPage + Breadcrumb + HowTo |
| `/tools/bac-water` | Organization (global) | WebPage, BreadcrumbList, **HowTo** | NEED: WebPage + Breadcrumb + HowTo |
| `/tools/dose` | Organization (global) | WebPage, BreadcrumbList, **HowTo** | NEED: WebPage + Breadcrumb + HowTo |
| `/tools/syringe-units` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/tools/mg-to-mcg` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/tools/supplies` | Organization (global) | WebPage, BreadcrumbList | NEED: WebPage + Breadcrumb |
| `/terms` | Organization (global) | WebPage | WANT: WebPage |
| `/privacy` | Organization (global) | WebPage | WANT: WebPage |
| `/disclaimer` | Organization (global) | WebPage | WANT: WebPage |

---

## Existing Schema Issues

### 1. Organization Schema (`org-json-ld.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BACwater.ai",
  "url": "https://bacwater.ai",
  "logo": "https://bacwater.ai/favicon.ico",    // PROBLEM: ICO not accepted by Google
  "sameAs": [],                                   // PROBLEM: empty array
  "description": "..."
}
```

**Fix:**
- Replace `favicon.ico` with a proper logo image URL (PNG/WebP, min 112x112px)
- Add social URLs to `sameAs` or remove the property entirely
- Add `contactPoint`, `email`, `areaServed`
- Add `@id: "https://bacwater.ai/#organization"` for cross-referencing

### 2. Product Schema (`product-json-ld.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "...",
    "price": "...",
    "availability": "..."
  }
}
```

**Fix:**
- Remove `"use client"` directive (line 1) and unused `formatCurrency` import (line 2) -- make server component
- Add `sku`, `brand`, `url`, `offers.url`, `offers.seller`
- Add `category` from DB field

### 3. Article Schema (`article-json-ld.tsx`)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "articleBody": "...",
  "url": "...",
  "dateModified": "...",
  "publisher": { "@type": "Organization", "name": "BACwater.ai", "url": "..." }
}
```

**Fix:**
- Add `datePublished` (pass `createdAt` as prop)
- Add `author`: `{ "@type": "Organization", "name": "BACwater.ai" }`
- Add `image` (when guide featured images exist)
- Add `publisher.logo`
- Strip markdown from `articleBody`

### 4. FAQPage Schema (`faq/page.tsx` inline)

**Fix:**
- Include `dbFaqs` in the JSON-LD `mainEntity` array alongside `CORE`
- Add `url: "https://bacwater.ai/faq"`

---

## New Schemas Required

### 5. WebSite Schema (add to root layout)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BACwater.ai",
  "url": "https://bacwater.ai",
  "publisher": { "@id": "https://bacwater.ai/#organization" }
}
```

### 6. WebPage + BreadcrumbList Schema (wire existing component)

The `WebPageJsonLd` component at `src/components/common/webpage-json-ld.tsx` already supports this. Wire it into every public page:

```tsx
<WebPageJsonLd
  name="Shop Peptide Reconstitution Supplies"
  description="..."
  url="/shop"
  breadcrumb={[
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
  ]}
/>
```

### 7. HowTo Schema (new component needed for tool pages)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate BAC Water Amount",
  "description": "...",
  "step": [
    { "@type": "HowToStep", "name": "Select your peptide", "text": "..." },
    { "@type": "HowToStep", "name": "Enter vial strength", "text": "..." },
    { "@type": "HowToStep", "name": "Enter your dose", "text": "..." }
  ],
  "tool": [
    { "@type": "HowToTool", "name": "Insulin syringe" },
    { "@type": "HowToTool", "name": "Bacteriostatic water" }
  ]
}
```

---

## Implementation Priority

| Priority | Action | Pages Affected |
|----------|--------|----------------|
| 1 (Critical) | Fix Organization logo (favicon.ico -> real image) | All pages |
| 2 (Critical) | Make ProductJsonLd a server component | `/shop/[slug]` |
| 3 (Critical) | Add `author` + `datePublished` to ArticleJsonLd | `/learn/[slug]` |
| 4 (High) | Wire WebPageJsonLd into all public pages | ~20 pages |
| 5 (High) | Add WebSite schema to root layout | Global |
| 6 (High) | Include DB FAQs in FAQPage JSON-LD | `/faq` |
| 7 (High) | Add HowTo schema to tool pages | 3-6 tool pages |
| 8 (Medium) | Add Product schema fields (sku, brand, url) | `/shop/[slug]` |
| 9 (Medium) | Add ItemList schema to shop/learn listings | `/shop`, `/learn` |
| 10 (Low) | Add ContactPage schema | `/contact` |
