# BACwater.ai Internal Linking Plan

**Date:** 2026-07-02 (refresh)

Current linking structure, gaps, and a concrete linking matrix. The site's internal linking has matured significantly since the first draft: there is a tag-driven related-content engine, crawlable Learn filter chips, and cross-cluster panels. This refresh reflects that and focuses on the remaining PageRank distribution and hub-and-spoke gaps.

---

## Current link architecture

### Global navigation

**Header** (`src/components/layout/site-header.tsx`), 6 items:
Build My Plan (`/plan`), Peptides (`/peptides`), Shop (`/shop`), Learn (`/learn`), Tools (`/tools`), My Plans (`/plans`, user-specific), plus a Cart icon. "Peptides" is now a primary nav item, which is the correct decision given the 24-page cluster is the topical core.

**Footer** (`src/components/layout/site-footer.tsx`), 3 columns:
- Product: Build My Plan, Peptide Guides, Buy Bac Water, Shop Supplies, Calculators, My Plans
- Learn: Learning Center, What is BAC Water?, How reconstitution works, FAQ
- Company: About, Contact, Editorial & Sourcing Policy, Shipping & Returns, Terms, Privacy, Disclaimer

### Contextual / programmatic linking already in place

- **Tag-driven RelatedReadingPanel** on peptide, buy, and guide pages, powered by the unified catalog + `relatedContent()` scorer in `src/lib/learn/catalog.ts` (peptide match +5, topic +2, type +3). Server-rendered on peptide and buy pages.
- **Client-fetched contextual panels** on the calculator and FAQ hub (`RelatedReadingDynamic`, interest-signal based) plus `/api/related`.
- **Learn filter chips are crawlable URLs**, so the Learning Center faceting is indexable, not JS-only state.
- **Per-peptide "Related peptides" grid** (same-category, up to 4) on each `/peptides/[slug]`.
- **Comparison pages** link to every other comparison ("More bac water comparisons").
- **Peptide pages** carry a hand-written "Keep learning" block linking to `/plan`, `/learn/how-peptide-reconstitution-works`, `/tools/bac-water`, and `/` (the pillar).

---

## Linking strengths

1. **Peptides is a first-class hub** (header + footer + sitemap segment), and its 24 spokes each link to same-category peptides, related reading, tools, and the plan builder.
2. **Comparison cluster is fully meshed** every `/learn/vs/[topic]` links to all 6 siblings.
3. **The tag catalog decouples relevance from hardcoding**, so new content is auto-surfaced by topic/peptide tags rather than manual link edits.
4. **Redirects consolidate equity cleanly** `next.config.ts` 308-redirects `/plan/advanced`, `/tools/ml-to-units`, and the legacy `/learn/bac-water-vs-sterile-water` to canonical URLs.
5. **Crawlable filter chips** give Google real URLs for topic facets.

---

## Gaps (ordered by impact)

### Gap 1: `/buy` and `/faq` receive weak internal PageRank (footer-only inbound)

Both are high-commercial / high-answer-value pages, but their main inbound path is the footer. `/buy` is not linked contextually from most peptide pages, comparisons, or the homepage; `/faq` is linked from the homepage FAQ CTA and contact copy but not from the peptide or comparison clusters.

**Fix:**
- Add a server-rendered contextual link to `/buy` in the peptide "Keep learning" block and in the comparison CTA (the comparison CTA already links `/buy` good; extend the same to peptide pages, which currently do not link `/buy`).
- Add `/faq` to the footer Learn column is already there; add contextual `/faq` links from every peptide FAQ section ("More common questions in the BAC water FAQ") and from each comparison FAQ.
- Add a homepage link to both `/buy` and `/faq` (the homepage currently links plan/shop/learn/peptides but not buy or faq).

### Gap 2: Some contextual links are client-only (not seen as link equity)

The calculator and FAQ-hub contextual panels are client-fetched (`RelatedReadingDynamic`). Client-rendered links pass weaker (or no reliable) internal signal and are invisible to crawlers that skip JS.

**Fix:** on the FAQ hub and tool pages, add a small **server-rendered** "Related reading" list alongside the dynamic personalized panel. The peptide and buy pages already do this with the server `RelatedReadingPanel`; extend the same server component to the FAQ hub and each tool `layout.tsx`. Keep the dynamic panel for personalization, but never rely on it for crawlable equity.

### Gap 3: No hub-and-spoke links between peptides and the comparison + shelf-life clusters

Peptide pages link to same-category peptides and to generic guides, but not to the topically-relevant comparison (e.g. a metabolic/GLP-1 peptide page should link to `/learn/vs/sterile-water` and to the shelf-life/storage content, since storage is the top question after "how much"). Comparison pages do not link back into the peptide cluster at all.

**Fix:** wire the catalog so:
- Every peptide page's related-reading panel includes at least one comparison and the storage deep-dive (the `relatedContent` call already requests `types: ["faq","comparison","safety","guide"]` and `topics: ["storage","dosage","safety"]`, so this mostly works once the storage/shelf-life content exists; ensure at least one comparison is always surfaced).
- Comparison pages gain a "Reconstitute a specific peptide" mini-grid linking to the 4 to 6 most-searched peptides (bpc-157, tb-500, semaglutide, tirzepatide, ipamorelin), giving the comparison cluster an outbound path into the peptide hub.

### Gap 4: Stale / redirect-hop internal links in the bac-water tool layout

`src/app/tools/bac-water/layout.tsx` links to `/learn/bac-water-vs-sterile-water`, which 308-redirects to `/learn/vs/sterile-water`. Internal links should point at the final URL to avoid a redirect hop and to pass equity directly. (Same file also uses en dashes in copy, a brand-rule violation to fix while editing.)

**Fix:** repoint to `/learn/vs/sterile-water` directly. Audit all `layout.tsx` related-guide lists for other legacy slugs.

### Gap 5: Homepage does not link into the two clusters it should feed

The homepage links `/peptides` (once, in a callout) but not to any specific high-intent peptide, nor to any comparison, nor to `/buy` or `/faq`. For a pillar page this under-distributes equity.

**Fix:** add a "Popular peptides" strip (4 to 6 links: bpc-157, tb-500, semaglutide, tirzepatide, ipamorelin, ghk-cu) and a "Common comparisons" strip (sterile-water, saline) to the homepage, plus the `/buy` and `/faq` links noted above.

### Gap 6: Contact and legal pages remain near dead-ends

Lower priority (both are intentionally low-value), but `/contact` and the legal pages still have minimal outbound links.

**Fix:** add a 3-link helper row to `/contact` (FAQ, Learn, Plan) and a "Back to home / See the FAQ" footerlet on each legal page.

---

## Concrete linking matrix

Rows are source page types; columns are link targets. `S` = should be server-rendered contextual link, `H` = header/footer (global), `A` = already present, `+` = recommended addition.

| From \ To | Home | /peptides | /peptides/[slug] | /learn/vs/[topic] | /buy | /shop | /faq | /tools/* | /plan |
|-----------|:----:|:---------:|:----------------:|:-----------------:|:----:|:----:|:----:|:--------:|:-----:|
| Homepage | | A | +S (popular) | +S (common) | +S | A | +S | | A |
| /peptides (index) | A | | A (all) | +S | +S | | +S | +S | A |
| /peptides/[slug] | A | A | A (related) | +S (1 relevant) | +S | | +S | A | A |
| /learn/vs/[topic] | A | +S (grid) | +S (popular) | A (siblings) | A | | +S | | A |
| /buy | A | +S | S (related) | S (related) | | A | +S | | A |
| /shop + PDP | A | +S | | | +S | A | +S | | A |
| /faq | A | +S | S (dynamic) | +S | +S | | | S (in answers) | A |
| /tools/* | A | +S | +S | +S | +S | A | +S | A (mesh) | A |
| /learn (index) | A | +S | A (peptide-guides) | A (comparisons) | +S | | A | +S | A |

Key hub-and-spoke additions (the "+" cells that matter most):
1. Peptide spokes to `/buy`, `/faq`, and one relevant comparison (currently missing).
2. Comparison spokes into the peptide hub (a "reconstitute a specific peptide" grid).
3. Homepage into popular peptides + common comparisons + `/buy` + `/faq`.
4. Tool pages to `/peptides`, `/faq`, `/buy` server-rendered (they currently link mostly to other tools + plan).

---

## Link-equity flow (current)

**Receiving the most internal equity:** `/plan` (linked from nearly every page + header), `/shop` (header + footer + homepage + buy + tools), `/peptides` (header + footer + sitemap + homepage callout), `/learn` (header + footer).

**Receiving the least (relative to their value):**
- `/buy` high commercial value, footer-plus-a-few inbound. Priority to boost.
- `/faq` high answer value, mostly footer + homepage inbound. Priority to boost.
- Individual `/learn/vs/[topic]` pages meshed with each other but few inbound from peptides.
- `/contact`, legal pages footer-only (acceptable).

**Bottom line:** the structure is healthy; the concentrated fix is pushing more server-rendered contextual links into `/buy` and `/faq`, and closing the peptide to comparison to storage hub-and-spoke loop so the three answer clusters reinforce each other instead of running in parallel.
