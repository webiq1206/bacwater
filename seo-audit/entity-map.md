# BACwater.ai -- Entity Map

**Date:** 2026-07-01

Entities the site represents, their schema types, and current vs desired coverage.

---

## Primary Entity: Organization

| Property | Current Value | Source |
|----------|--------------|--------|
| Name | BACwater.ai | `src/components/common/org-json-ld.tsx:5` |
| Type | Organization | `org-json-ld.tsx:4` |
| URL | https://bacwater.ai | `org-json-ld.tsx:3` |
| Logo | https://bacwater.ai/favicon.ico | `org-json-ld.tsx:7` (WRONG format -- needs real logo) |
| Description | "BACwater.ai is the complete BAC water calculator and reconstitution guide..." | `org-json-ld.tsx:10-11` |
| sameAs | `[]` (empty) | `org-json-ld.tsx:9` |
| contactPoint | MISSING | -- |
| email | MISSING (privacy@bacwater.ai exists on privacy page) | -- |
| foundingDate | MISSING | -- |
| areaServed | MISSING (US national) | -- |

**Required additions:**
- `logo`: Replace favicon.ico with a real logo image (PNG/WebP, min 112x112px)
- `sameAs`: Add social profile URLs when available, or remove the empty array
- `contactPoint`: `{ "@type": "ContactPoint", "contactType": "customer support", "url": "https://bacwater.ai/contact" }`
- `email`: `info@bacwater.ai` or `support@bacwater.ai`
- `areaServed`: `{ "@type": "Country", "name": "US" }`

---

## Secondary Entity: WebSite

**Current state:** NOT IMPLEMENTED anywhere.

| Property | Recommended Value |
|----------|-------------------|
| Type | WebSite |
| Name | BACwater.ai |
| URL | https://bacwater.ai |
| publisher | `{ "@type": "Organization", "@id": "#organization" }` |

**Where to add:** Root layout alongside OrgJsonLd, or extend OrgJsonLd to emit both.

---

## Product Entities

**Current state:** Product schema exists on `/shop/[slug]` pages via `ProductJsonLd`.

| Property | Current | Recommended |
|----------|---------|-------------|
| Type | Product | Keep |
| name | product.name | Keep |
| description | product.description | Keep |
| image | product.imageUrl (nullable) | REQUIRED -- replace placeholders with real photos |
| sku | MISSING | Add (available in DB: `product.sku`) |
| brand | MISSING | `{ "@type": "Brand", "name": "BACwater.ai" }` |
| url | MISSING | `https://bacwater.ai/shop/{slug}` |
| offers.url | MISSING | Same as product URL |
| offers.seller | MISSING | `{ "@type": "Organization", "name": "BACwater.ai" }` |
| offers.shippingDetails | MISSING | "Ships in 1-2 business days" |
| offers.hasMerchantReturnPolicy | MISSING | 30-day sealed returns |
| category | MISSING in schema | Available in DB: `product.category` |

**Product categories as entities:**
- Bacteriostatic Water (BAC water) -- primary product
- Insulin Syringes -- reconstitution supply
- Alcohol Prep Pads -- hygiene supply
- Kits & Bundles -- combination packages

---

## Article/Guide Entities

**Current state:** Article schema exists on `/learn/[slug]` pages via `ArticleJsonLd`.

| Property | Current | Recommended |
|----------|---------|-------------|
| Type | Article | Keep |
| headline | guide.title | Keep |
| articleBody | guide.body (raw text with markdown) | Strip markdown characters |
| url | correct | Keep |
| dateModified | guide.updatedAt | Keep |
| datePublished | MISSING | Add `guide.createdAt` |
| author | MISSING | `{ "@type": "Organization", "name": "BACwater.ai" }` |
| publisher.logo | MISSING | Add logo URL |
| image | MISSING | Add featured images to guides |
| description | MISSING in schema | Add (first 155 chars stripped) |

---

## Tool/Calculator Entities

**Current state:** No schema on any tool page.

| Tool | Recommended Schema Type |
|------|------------------------|
| `/tools/reconstitution` | `WebApplication` or `HowTo` |
| `/tools/bac-water` | `HowTo` (steps: select peptide, enter vial size, get result) |
| `/tools/dose` | `HowTo` |
| `/tools/syringe-units` | `WebApplication` (converter) |
| `/tools/mg-to-mcg` | `WebApplication` (converter) |
| `/tools/supplies` | `WebApplication` (calculator) |

Each tool page also has educational content sections that could support `HowTo` with steps.

---

## FAQ Entity

**Current state:** FAQPage schema on `/faq` with 7 hardcoded Q&A pairs.

| Property | Current | Recommended |
|----------|---------|-------------|
| Type | FAQPage | Keep |
| mainEntity | 7 Question items (hardcoded) | Include database FAQs dynamically |
| url | MISSING | Add `https://bacwater.ai/faq` |

---

## Entity Consistency Audit

| Entity Name | Mentions | Consistent? |
|-------------|----------|-------------|
| "BACwater.ai" | Org schema, layout metadata, footer, about page, llms.txt | YES |
| "BACwater & Co." | Header logo, footer logo, OG image | DIFFERENT from "BACwater.ai" -- inconsistent brand name |
| "The complete BAC water calculator and reconstitution guide" | Homepage H1, root description, llms.txt, org schema | YES (core tagline) |
| Products: "bacteriostatic water" | Shop description, FAQ, about, multiple pages | YES |
| "For research use only" | Terms, disclaimer, tools pages, shop | YES |

**Inconsistency:** The header/footer display "BACwater & Co." while the Organization schema and metadata use "BACwater.ai". Google may see these as different entities. Recommendation: decide on one canonical brand name for schema and all text. Use the alternate as a DBA/trade name in the description.

---

## Entity Relationship Map

```
BACwater.ai (Organization)
  |
  +-- WebSite: bacwater.ai
  |     |
  |     +-- WebPage: Homepage
  |     +-- WebPage: About
  |     +-- WebPage: Contact
  |     +-- WebPage: FAQ (FAQPage)
  |     +-- WebPage: Tools Index
  |     |     +-- WebPage: BAC Water Calculator (HowTo)
  |     |     +-- WebPage: Dose Calculator (HowTo)
  |     |     +-- WebPage: Reconstitution Calculator (HowTo)
  |     |     +-- WebPage: Syringe Unit Converter
  |     |     +-- WebPage: mg/mcg Converter
  |     |     +-- WebPage: Supply Calculator
  |     |
  |     +-- CollectionPage: Shop
  |     |     +-- Product: BAC Water 30mL
  |     |     +-- Product: Insulin Syringes
  |     |     +-- Product: Alcohol Prep Pads
  |     |     +-- Product: (etc.)
  |     |
  |     +-- CollectionPage: Learning Center
  |     |     +-- Article: What is BAC Water?
  |     |     +-- Article: How Peptide Reconstitution Works
  |     |     +-- Article: (etc.)
  |     |
  |     +-- WebPage: Plan Builder (HowTo)
  |           +-- WebPage: Step-by-Step Planner
  |
  +-- Products (sold by Organization)
  +-- Tools/Calculators (offered by Organization)
```
