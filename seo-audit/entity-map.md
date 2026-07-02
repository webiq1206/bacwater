# BACwater.ai: Entity Map

**Date:** 2026-07-02 (refresh, post-implementation)

Every entity the site represents, its schema @type, the pages that carry it, the content that supports it, and current vs desired coverage. Post-implementation the site now ships 24 peptide entities, ~16 database guides, 7 comparison entities, 6 calculator tools, and a full schema stack (Organization, WebSite, WebPage, BreadcrumbList, FAQPage, HowTo, Product, ImageObject, Article, CollectionPage/ItemList).

Legend for coverage: **Full** = entity defined, on-page content plus schema present. **Partial** = present but thin or missing a property. **Missing** = not represented. **Flag** = present but confusing, conflicting, or duplicated.

---

## 1. Organization entity

| Property | Value / status | Source |
|----------|----------------|--------|
| @type | Organization | `src/components/common/org-json-ld.tsx` |
| name | BACwater.ai | org-json-ld |
| url | https://bacwater.ai | org-json-ld |
| logo | `${siteUrl}/icon.svg` (real SVG, upgraded from favicon) | org-json-ld |
| description | "complete BAC water calculator and reconstitution guide..." | org-json-ld |
| contactPoint | ContactPoint with info@bacwater.ai, customer service, English | org-json-ld |
| sameAs | MISSING (no social/authoritative profiles) | Flag |
| foundingDate | MISSING | Flag |
| areaServed | MISSING (site ships US) | Flag |
| @id | MISSING (no stable node id to reference from Product/Article/WebSite) | Flag |

Associated pages: sitewide (root layout), `/about`, `/contact`, `/editorial-policy`, `/disclaimer`.
Supporting content: about page, editorial and sourcing policy, disclaimers, dynamic `/llms.txt` roster.
**Coverage: Partial.** Core identity is Full; trust-graph properties (`sameAs`, `@id`, `areaServed`) are the gap. Desired: add a stable `@id` (`https://bacwater.ai/#organization`), `areaServed` Country US, and any authoritative `sameAs` profiles as they come online.

---

## 2. Brand entity

| Property | Value / status | Source |
|----------|----------------|--------|
| @type | Brand | referenced inside Product schema |
| name (canonical) | BACwater.ai | metadata, footer, llms.txt |
| Displayed alt name | "BACwater & Co." historically appeared in logo/OG | Flag |

Associated pages: every Product page (`brand`), header/footer lockup, OG image.
**Coverage: Flag (naming coherence).** The brand and the organization must resolve to one name. Confirm every visible lockup and OG asset reads **BACwater.ai**; if a stylized "& Co." variant remains anywhere, either retire it or declare it as `alternateName` on the Organization so engines do not split the entity. Desired: Product `brand` should point to the Organization `@id` rather than a bare string, unifying Brand and Organization into one node.

---

## 3. Product entities

Schema: `Product` on `/shop/[slug]` via `ProductJsonLd`, with `priceValidUntil`, `shippingDetails`, `hasMerchantReturnPolicy`. `/shop` is a CollectionPage/ItemList.

| Product entity | @type | Page(s) | Supporting content | Coverage |
|----------------|-------|---------|--------------------|----------|
| BAC water 30mL (single) | Product | `/shop/[slug]`, `/buy` | `/learn/[bac-water guides]`, `/tools/bac-water`, 7 comparisons | Full |
| BAC water multipacks | Product | `/shop/[slug]` | supply calculator, buying guides | Partial (ensure each pack is a distinct Product with its own offer) |
| Insulin syringes 0.3mL / 0.5mL / 1mL (U-100) | Product | `/shop/[slug]` | `/tools/syringe-units`, injection-supplies guides | Partial (three sizes should be distinct offers or variants) |
| Alcohol prep pads | Product | `/shop/[slug]` | injection-supplies guides | Full |
| Starter kit / bundles | Product | `/shop/[slug]`, `/buy` | supply calculator, buying guides | Partial |

Product-category entities (as `/shop` ItemList facets and topic anchors): Bacteriostatic Water, Injection Supplies (syringes), Hygiene Supplies (prep pads), Kits & Bundles.
**Flag:** the 0.3 / 0.5 / 1mL syringes and the multipacks must each be individually addressable entities (own URL, own `sku`, own `offers`) so engines can cite "1mL insulin syringe" distinctly from "0.5mL." Desired: `Product.brand` -> Organization `@id`; `isRelatedTo` / `isAccessoryOrSparePartFor` links from syringes and pads back to the BAC water Product to express the reconstitution kit relationship.

---

## 4. Service / Tool entities

The Plan Builder is the unique moat. The six calculators are the discovery surface.

| Entity | Best @type | Page | Supporting content | Coverage |
|--------|-----------|------|--------------------|----------|
| Plan Builder (saved plans, PDF export, QR-coded vial labels) | WebApplication (+ HowTo for the flow) | `/plan`, `/plan/new` | pillar `/`, peptide pages, learn guides | Partial (HowTo present in flow; add WebApplication node naming the unique features) |
| BAC Water Calculator | WebApplication / HowTo | `/tools/bac-water` | bac-water guides, comparisons | Partial |
| Reconstitution Calculator | WebApplication / HowTo | `/tools/reconstitution` | reconstitution-method guides, peptide pages | Partial |
| Dose Calculator | WebApplication / HowTo | `/tools/dose` | dosage guides, peptide dosage tables | Partial |
| Syringe Units Converter | WebApplication | `/tools/syringe-units` | U-100 syringe guides | Partial |
| Supplies Calculator | WebApplication | `/tools/supplies` | `/shop`, buying guides | Partial |
| mg to mcg Converter | WebApplication | `/tools/mg-to-mcg` | dosage guides | Partial |

Associated hub: `/tools` (CollectionPage/ItemList of all six).
**Coverage: Partial across all tools.** Each calculator has direct-answer content but should carry an explicit `WebApplication` node (`applicationCategory: "HealthApplication"` or "UtilitiesApplication", `offers: free`) plus a `HowTo` for the multi-step ones. The Plan Builder is the single most under-schematized high-value entity: nothing in the graph currently states, in machine-readable form, that it produces saved plans, PDF export, and printable QR-coded vial labels. That is the differentiator engines should be able to cite. **Add it.**

---

## 5. Topic entities

These are the concept nodes that make the site a subject-matter authority. Each should have a canonical explainer page, appear as `about` / `mentions` on related pages, and (where a definition exists) a `DefinedTerm`.

| Topic entity | Canonical page | Appears on | Coverage |
|--------------|----------------|-----------|----------|
| Bacteriostatic water (BAC water) | `/learn/[what-is-bac-water]`, `/` | shop, tools, all peptide pages | Full |
| Benzyl alcohol (0.9% preservative) | `/learn/vs/benzyl-alcohol`, ingredients guide | bac-water guides, comparisons | Full |
| Peptide reconstitution | `/plan`, reconstitution guides | peptide pages, tools | Full |
| U-100 syringe units | `/tools/syringe-units`, syringe guides | dose calc, peptide pages | Full |
| Lyophilization (freeze-dried peptide) | reconstitution/storage guides | peptide pages | Partial (mentioned; no dedicated DefinedTerm node) |
| Shelf life / storage stability | storage guides, per-peptide storage sections | peptide pages, comparisons | Full |
| Sterile water vs BAC water | `/learn/vs/sterile-water` | comparisons hub | Full |
| Saline / sodium chloride / distilled water | `/learn/vs/*` | comparisons hub | Full |
| Acetic acid / reconstitution solution | `/learn/vs/*` | comparisons hub | Full |
| GLP-1 (drug class) | metabolic peptide pages | semaglutide, tirzepatide, retatrutide, cagrilintide | Partial (implicit; no class-level topic hub) |
| GH secretagogue (drug class) | growth peptide pages | ipamorelin, cjc, sermorelin, hexarelin | Partial (implicit; no class-level topic hub) |

**Flag:** topic entities exist as prose but few are declared as `DefinedTerm` nodes inside a `DefinedTermSet` (a peptide-science glossary). Desired: a glossary that mints DefinedTerm for BAC water, benzyl alcohol, lyophilization, reconstitution, U-100, half-life, so answer engines have a citable definition source. Drug-class topics (GLP-1, GH secretagogue) deserve lightweight category hubs to anchor the metabolic and growth clusters.

---

## 6. Peptide entities (24)

Schema per page: direct-answer intro + embedded calculator + per-strength dosage table + HowTo (+schema) + storage/shelf life + FAQPage (per-strength answerable units + general) + ImageObject dosage-chart infographic + Breadcrumb/WebPage. Each is a well-formed entity.

| Category | Peptide entities (slug) | Coverage |
|----------|-------------------------|----------|
| Healing | bpc-157, tb-500 | Full |
| Growth (GH secretagogues) | ipamorelin, cjc-1295-no-dac, cjc-1295-with-dac, sermorelin, hexarelin | Full |
| Metabolic (GLP-1s) | semaglutide, tirzepatide, retatrutide, cagrilintide | Full |
| Cognitive | mots-c, selank, semax | Full (note: mots-c also longevity-adjacent) |
| Cosmetic | ghk-cu, melanotan-2, aod-9604 | Full |
| Reproductive | kisspeptin-10, pt-141, hcg | Full |
| Longevity | epithalon, ss-31 | Full |
| Other | glow-blend, custom | Partial (blend/custom entities are legitimate but harder to schematize as a single Product/drug; keep as guide-style entities) |

Hub: `/peptides` (CollectionPage/ItemList) links all 24.
**Coverage: Full for the 22 named single-agent peptides.** Each peptide is an entity with a MedicalIndication-free, research-use framing. Desired refinement: add `sameAs` links to a stable external identifier (PubChem CID or DrugBank where one exists) on each peptide page to disambiguate the entity for engines. `glow-blend` and `custom` should be typed as reconstitution guides, not as single chemical entities, to avoid asserting a compound that does not have one identity.

---

## 7. Author / Reviewer entity

**By design, there are no individual bylines.** E-E-A-T is expressed at the company level: editorial and sourcing policy, sitewide and inline disclaimers, and last-reviewed dates on peptide and comparison pages.

| Property | Status |
|----------|--------|
| Individual `author` (Person) | Intentionally absent (per content spec) |
| Organizational `author` / `publisher` | Should be BACwater.ai Organization `@id` on every Article | Partial |
| `reviewedBy` / last-reviewed date | Dates shown on peptide + comparison pages | Partial (visible date; not always in schema) |
| Editorial policy page | `/editorial-policy` exists | Full |

**Flag (strategic, expanded in `ai-search-readiness-analysis.md`):** the no-bylines stance is a deliberate constraint, but in a YMYL space competitors win trust with named, credentialed "medically reviewed by" authors. Desired within the constraint: make the Organization a strong, citable authority node (org `@id` as `author` and `publisher` on every Article; a named editorial/review process; `reviewedBy` pointing to the Organization; last-reviewed dates emitted in schema, not just displayed). See the readiness file for the full recommendation on strengthening trust without individual bylines.

---

## 8. Industry entities

| Industry entity | Represented as | Coverage |
|-----------------|----------------|----------|
| Research peptides | Site-wide framing ("research use only"), `/peptides` hub | Full (positioning is clear and consistent) |
| GLP-1s | Metabolic peptide cluster | Partial (no class hub; see topic entities) |
| Peptide reconstitution supplies | `/shop`, supply calculator | Full |

**Coverage: Partial.** The site is unmistakably in the research-peptide reconstitution industry, but the two drug-class industry sub-entities (GLP-1, GH secretagogue) lack anchor hubs.

---

## 9. Competitor entities

Not represented on-site (correct), but tracked here for entity positioning. The site should own entities competitors do not.

| Competitor | Their entity strength | BACwater.ai counter-entity |
|-----------|-----------------------|-----------------------------|
| peptidefox.com | 12 PubMed citations, blends | Sourcing policy + citable calculators |
| peptidedeck.com | Breadth, vendor reviews | 24 structured peptide entities |
| freemedicaljournals.com | Per-vial-size pages, "Dr. Paul Watson" reviewer | Per-strength answerable FAQ units (compete on granularity, not a fake byline) |
| riteaid.com | National authority, "Health Team" review, LegitScript | Depth + the Plan Builder moat |
| praxpeptides.com | Best calc UX, draggable syringe, sells bac water | Plan Builder (saved plans, PDF, QR labels) beats a single calculator |
| bacteriostaticwater.com | Buy incumbent, thin content | Content depth + tools |
| jaycampbell.com | Personal brand | Company-level authority (different play) |
| thepeptidecatalog.com | Review roundups | First-party structured data |
| worldpeptideassociation.com | URL-per-peptide calculators | Embedded calculator on every peptide page + Plan Builder |

**Coverage: N/A (external).** The one entity BACwater.ai uniquely owns is the **Plan Builder** (saved plans, PDF export, QR-coded vial labels). No competitor has it. It is currently the most under-schematized owned entity, which is a missed authority signal.

---

## Missing entities and weak relationships (summary)

**Missing / to add:**
- WebSite node with `potentialAction` SearchAction (see below).
- Stable Organization `@id`, plus `sameAs`, `areaServed`, `foundingDate`.
- WebApplication nodes for all six calculators and the Plan Builder (name the unique features on Plan Builder).
- DefinedTermSet glossary for topic entities (BAC water, benzyl alcohol, lyophilization, U-100, half-life).
- Class-level hubs for GLP-1 and GH secretagogue topics.
- External `sameAs` (PubChem/DrugBank) on peptide entities.

**WebSite entity (was missing, still verify):**

| Property | Recommended |
|----------|-------------|
| @type | WebSite |
| name | BACwater.ai |
| url | https://bacwater.ai |
| publisher | Organization `@id` |
| potentialAction | SearchAction targeting `/learn` filter or site search |

**Weak / confusing relationships to fix:**
- Brand string vs Organization: unify via `@id` so they are one node, not two.
- Product `brand` is a bare string in some places: point to Organization `@id`.
- Article `author`/`publisher`: set to Organization `@id` everywhere, consistently.
- Peptide entities lack external identifiers: add `sameAs`.
- Plan Builder features are invisible to machines: schematize them.

---

## Entity coverage scorecard

```
Organization        [#########-]  Partial  (add @id, sameAs, areaServed)
Brand               [#######---]  Flag     (unify naming + @id)
Products            [########--]  Partial  (distinct offers for variants)
Services/Tools      [######----]  Partial  (add WebApplication nodes; Plan Builder!)
Topics              [########--]  Partial  (add DefinedTermSet glossary)
Peptides (24)       [#########-]  Full     (add external sameAs)
Author/Reviewer     [#####-----]  By-design (strengthen org-level trust)
Industry            [#######---]  Partial  (add class hubs)
```
