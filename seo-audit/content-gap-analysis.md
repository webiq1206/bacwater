# BACwater.ai Content Gap Analysis

**Date:** 2026-07-02 (refresh)

Missing content for topical authority in the BAC water / peptide reconstitution space, benchmarked against the two competitors that rank in AI answers and organic search via granular landing pages (free medical-journal aggregators and peptide-association sites).

Full refresh. Since the first draft, the site has shipped the 24-page peptide cluster, the 7-page comparison cluster, the keyword-optimized FAQ hub, `/buy`, the editorial policy, and infographics. Most of the old "Tier 1" gaps are now filled. This refresh identifies what genuinely remains.

---

## Current content inventory (built)

- **Peptide cluster:** 24 `/peptides/[slug]` pages, each with unique data (real vial strengths, computed dosage tables, per-peptide editorial "what/uses/caveat", peptide-specific FAQ, unique SVG chart), plus a "custom" catch-all.
- **Comparison cluster:** 7 `/learn/vs/[topic]` pages (sterile-water, saline, sodium-chloride, distilled-water, benzyl-alcohol, acetic-acid, reconstitution-solution), each verdict + table + FAQ.
- **FAQ hub:** 9 core Q&A + DB FAQs, FAQPage schema, storage infographic.
- **Learn DB content:** guides seeded (what-is-bac-water, how-reconstitution-works, how-to-read-a-vial, insulin-syringe usage, syringe units, storage, how-long-bac-water-lasts, common mistakes, per-peptide guides for bpc-157/tirzepatide/semaglutide, too-much-bac-water, reconstitution chart) plus a set of FAQ blocks (see `DB_TAGS` in `src/lib/learn/catalog.ts`).
- **Commercial:** `/buy` (buy bac water online, near-me, over-the-counter), `/shop` + PDPs.
- **Tools:** 6 calculators + plan builder.

The old high-priority gaps (bac water vs sterile water, how to store reconstituted peptides, shelf life, BPC-157 guide, reconstitution chart) are now covered. Good progress.

---

## Genuine remaining gaps (prioritized)

### Tier 1 high impact

1. **Per-peptide + per-vial-size landing pages** (the competitor moat)
   Free-medical-journal and peptide-association sites rank by having a distinct URL per (peptide × vial size), e.g. "5 mg BPC-157 reconstitution" and "10 mg BPC-157 reconstitution" as separate pages. BACwater currently has one page per peptide covering all its strengths in a table.
   - **Phase 2 opportunity:** expand the highest-volume peptides into per-vial-size pages or anchored sections that can rank independently (`/peptides/bpc-157/5mg`, `/peptides/tirzepatide/30mg`, etc.). The dosage engine already computes per-strength rows, so the data exists; this is a routing + unique-intro-copy exercise, not a data problem. See the programmatic-seo analysis for the uniqueness bar these must clear (each needs unique intro prose, not just a filtered table).
   - Start with the 6 to 8 pages that already show query demand: bpc-157 (5/10 mg), tirzepatide (10/30/60 mg), semaglutide (2/5 mg), tb-500 (5/10 mg).

2. **Reverse-BAC calculator** ("I want dose X at Y units, how much water?")
   The current bac-water calculator solves forward (vial + dose to water). A reverse tool ("I want a 250 mcg dose to read as exactly 20 units, how much bac water?") is a distinct high-intent query and a strong featured-snippet/tool target. Distinct from the existing tools; give it its own `/tools/[slug]` and add it to the tools mesh, sitemap, and llms.txt.

3. **"Where to buy bacteriostatic water (2026)" commercial-investigation content**
   `/buy` handles transactional intent well, but there is no commercial-investigation piece for "best place to buy bac water", "legit bac water vendors", "is [vendor] legit". This is where competitors capture high-intent comparison traffic. Create a buyers'-guide style page (framed honestly, research-use) covering what to look for (sealed, sterile, US shipping, benzyl-alcohol %, batch/lot info) and route it into the buy funnel. Pairs with the "best/legit vendor" gap below.

4. **Shelf-life / refrigeration deep-dive with the real controversy**
   The FAQ and storage content assert "refrigerate; ~28 days", but there is a genuine, citable nuance: refrigeration may reduce benzyl alcohol's bacteriostatic efficacy (cold can lower preservative activity), which is the opposite of the naive "colder is always better" assumption. A dedicated deep-dive that explains the tradeoff (and cites it) would be the definitive page on the topic and a strong AI-citation magnet, because it resolves a question most sources get wrong. Cross-link from `/learn/vs/benzyl-alcohol`, the FAQ, and every peptide storage block.

### Tier 2 medium impact

5. **Peptide glossary / entity pages**
   Standalone definitional pages for the entities the site already references: **benzyl alcohol**, **lyophilization**, **U-100**, **subcutaneous**, **reconstitution**, **bacteriostatic**. These serve "what is [term]" queries, build entity coverage that AI engines map to the site, and become internal-link anchors. A `/learn/glossary` index plus per-term anchors (or per-term pages for the highest-volume terms like benzyl alcohol and lyophilization).

6. **Remaining "bac water vs X" topics**
   The 7 comparisons cover the major diluents. Remaining candidates worth checking for demand: "bac water vs preservative-free water", "bac water vs SWFI (sterile water for injection)" (may overlap sterile-water; consolidate if so), and "bac water vs bacteriostatic saline". Only add if they are distinct queries, not near-duplicates of existing pages (avoid the doorway risk called out in the doorway analysis).

7. **Dedicated calculator hub page for head terms**
   `/tools` is a functional index. A head-term-optimized hub ("Peptide reconstitution calculators") with a definition block, a table of what each tool does, and quick-reference facts would target the "[topic] calculator" head terms better than the current utilitarian index. This is also the natural home for the reverse-BAC calculator and improves the tool cluster's internal-link authority.

### Tier 3 supporting

8. **"Best / legit bac water vendor" commercial-investigation** (pairs with Tier 1 #3) split out if the buyers' guide gets long.
9. **Per-peptide storage nuance sections** where a peptide has a real handling quirk already captured in `caveat` (BPC-157 light sensitivity, CJC no-DAC instability, GHK-Cu blue tint, HCG IU-vs-mg). These are unique facts; surface them as their own anchored mini-sections so they can rank for "does [peptide] need to be refrigerated / why is my [peptide] blue".
10. **Expanded About page** (still thin) add Our Approach, Our Math, Our Sourcing, Research-Use sections to strengthen the entity/E-E-A-T signal referenced in the GEO plan.

---

## Content-depth issues on existing pages

- **Homepage:** no definition block, no key-facts block (covered in GEO + AEO plans). Highest-authority page under-serving informational intent.
- **About:** still short; expand for E-E-A-T and the "for whom" entity signal.
- **Privacy:** verify it now covers processors (Stripe, Resend, DB host), CCPA/GDPR rights, retention, analytics disclosure (GA4 + Clarity are live). If not, expand to standard length; this is a trust signal AI and users both read.
- **Comparison pages:** solid, but each would benefit from a References block (see GEO Gap 1), especially `/learn/vs/benzyl-alcohol` given the refrigeration controversy.

---

## New-content format standard (apply to all additions)

1. Server-rendered **direct-answer block** (40 to 60 words) at the top.
2. Proper **H2/H3 hierarchy** (the DB article renderer must parse headings; verify per the AEO renderer note).
3. **Quick-reference table** where the answer is numeric.
4. **FAQ section** (2 to 3 Q&A) with FAQPage JSON-LD.
5. **References/Sources** block with real outbound links (USP, FDA/DailyMed, benzyl-alcohol safety) per the GEO plan.
6. Tag the entry in the catalog (`DB_TAGS`) so the related-content engine surfaces it automatically.
7. Cross-link into the peptide, comparison, and buy clusters per the linking matrix.
8. No em dashes; use "to" for numeric ranges.

---

## Priority summary

| Priority | Gap | Type | Why |
|----------|-----|------|-----|
| 1 | Per-peptide × per-vial-size pages (phase 2) | Programmatic | Competitor moat; data already computed |
| 2 | Reverse-BAC calculator | Tool | Distinct high-intent query; snippet + tool target |
| 3 | "Where to buy bac water (2026)" buyers' guide | Commercial | Captures commercial-investigation traffic |
| 4 | Shelf-life / refrigeration deep-dive (with controversy + citations) | Guide | Definitive, AI-citation magnet |
| 5 | Glossary / entity pages (benzyl alcohol, lyophilization, U-100, subcutaneous) | Informational | Entity coverage + link anchors |
| 6 | Remaining "vs X" topics (only if distinct) | Comparison | Fill residual comparison demand |
| 7 | Calculator hub page for head terms | Hub | Head-term capture + tool authority |
