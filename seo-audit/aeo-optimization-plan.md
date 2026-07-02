# BACwater.ai AEO Optimization Plan

**Date:** 2026-07-02 (refresh)

Answer Engine Optimization (AEO) readiness: featured snippets (position 0), People Also Ask, Google AI Overviews, voice-assistant answers, and direct-answer extraction. AEO's core principle: structure content so a single paragraph, list, or table answers the question without the rest of the page.

Full refresh. The site now leads with the patterns the earlier draft asked for, so this plan focuses on the remaining wins, not the fundamentals.

---

## Current AEO posture

### Score: 8/10 (was 3/10)

**Already solved (do not redo):**
- **Peptide pages** open with a 40 to 60 word direct answer (`directAnswer()`), carry per-strength FAQ units ("How much bac water for 5 mg BPC-157?") plus a storage FAQ, all rendered in server HTML through the accordion, with FAQPage + HowTo JSON-LD.
- **Comparison pages** open with a verdict paragraph, a side-by-side table, and a FAQ with FAQPage schema. This is the ideal featured-snippet stack (paragraph snippet + table snippet + PAA) on one URL.
- **FAQ hub** (`/faq`) has 9 keyword-optimized core Q&A pairs plus DB FAQs, all in FAQPage JSON-LD, all rendered server-side. Several answers already carry contextual CTA links to tools.
- **Buy page** opens with a direct answer and has a commercial FAQ ("where can I buy", "over the counter", "near me", "how fast") in FAQPage schema.
- **Question-format headings** are used throughout ("How much bac water for X?", "How to reconstitute X", "How long does reconstituted X last?").
- **Tool pages** have a server-rendered direct-answer paragraph in each `layout.tsx`.

**Remaining weaknesses (the target of this plan):**
- The **pillar/homepage** has no paragraph-level answer block, no definition, no TL;DR, no quick-reference table.
- **Tool pages** answer well at the top but lack a mid-page "Quick reference" numeric table and a "Related questions" FAQ with schema (the calculator sits alone between the intro and the related-guides list).
- No explicit **TL;DR / Key takeaways** blocks anywhere (peptide and comparison pages lead with an answer, which is close, but a labeled TL;DR is more extractable for long pages).
- **Voice-search phrasing** ("how much water do I put in...", "can I...") is under-represented in headings; current headings are keyword-y but not always conversational.
- Some high-value **numeric answers are prose, not tables** on the tool pages (unit-to-mL, mg-to-mcg), where a table snippet would win position 0.

---

## Remaining AEO wins (prioritized)

### Win 1: Answer block + quick-reference table on the pillar/homepage (highest impact)

The homepage is the strongest URL and the natural target for "bac water calculator" / "bacteriostatic water" head queries, but it currently opens with marketing copy. Add, in server HTML above the fold:

- A **definition answer block** (40 to 60 words): "Bacteriostatic water (bac water) is sterile water with 0.9% benzyl alcohol added as a preservative. It is the standard diluent for reconstituting lyophilized peptides because the preservative lets one vial be drawn from safely for weeks. This page calculates the exact amount to add for your vial."
- A **quick-reference table** of the head-term facts (this is a table-snippet magnet):

| Question | Answer |
|----------|--------|
| What is bac water? | Sterile water + 0.9% benzyl alcohol preservative |
| How much for a 5 mg vial? | 2 mL is a common start (250 mcg = 10 units) |
| How long does it last? | ~28 days opened, refrigerated |
| Units to mL | 100 units = 1 mL (U-100) |
| mg to mcg | 1 mg = 1,000 mcg |

### Win 2: Complete the tool-page AEO stack

Each tool page has a strong top answer. Add two server-rendered sections in each tool `layout.tsx` so the page competes for both the paragraph snippet and the table snippet, and populates PAA:

**Quick-reference table** (numeric answers as tables, not prose):
- `/tools/syringe-units`: a units-to-mL table (1, 5, 10, 25, 50, 100 units to mL). This is a direct position-0 target for "how many units in 0.1 mL".
- `/tools/mg-to-mcg`: an mg-to-mcg table (0.25, 0.5, 1, 2.5, 5, 10 mg to mcg).
- `/tools/bac-water`: a "vial strength to bac water to add" starter table.
- `/tools/dose`: a concentration + draw-volume to dose table.

**Related questions FAQ** (2 to 3 Q&A per tool, with FAQPage JSON-LD) so each tool page can appear in multiple PAA boxes. Example for `/tools/syringe-units`: "How many units is 0.1 mL?", "Is a unit the same as a mL?", "What is a U-100 syringe?".

### Win 3: Labeled TL;DR blocks on long pages

Peptide and comparison pages already lead with an answer, which is most of the value. For the longer peptide pages, add a labeled **"TL;DR"** or **"Short answer"** one-liner immediately under the H1 (distinct from the fuller direct-answer paragraph) so AI Overviews have an even tighter unit to lift. Example on `/peptides/bpc-157`: "**Short answer:** add ~2 mL of bac water to a 5 mg BPC-157 vial; a 250 mcg dose is ~10 units."

### Win 4: Voice-search phrasing in headings and FAQ

Voice queries are conversational and question-shaped. Add natural-language variants as FAQ questions (they cost nothing and expand PAA coverage):
- "How much water do I put in a peptide vial?"
- "Can I use tap water or distilled water instead?" (already have a distilled-water comparison, cross-link it)
- "How do I know how many units to draw?"
- "Is it OK if my peptide turns cloudy?" (safety)
- "Do I really need to refrigerate it?"

Keep the keyword-optimized H2s for SEO, and add the conversational forms in the FAQ, so the page covers both intents.

### Win 5: Cross-link tool answers into FAQ, and FAQ answers into tools (bidirectional)

The FAQ already links out to tools in several answers. Extend the reverse: each tool's "Related questions" FAQ should link to the FAQ hub anchor for the same question, and peptide-page FAQs should link to the relevant tool. This concentrates answer authority and helps AI engines see the site as the canonical answer cluster for the topic.

---

## Direct-answer / snippet target matrix

| Query | Best page | Snippet type | Status |
|-------|-----------|--------------|--------|
| What is bacteriostatic water | `/faq`, homepage | Paragraph | FAQ done; homepage missing |
| How much bac water for 5 mg / 10 mg [peptide] | `/peptides/[slug]` | Paragraph + table | Done |
| How much bac water for a peptide (generic) | `/tools/bac-water` | Paragraph | Top answer done; add table |
| Bac water vs sterile / saline / etc. | `/learn/vs/[topic]` | Table + paragraph | Done |
| How long does bac water last | `/faq`, storage content | Paragraph | FAQ done; dedicated deep-dive pending (see content-gap plan) |
| How many units in 0.1 mL / 1 mL | `/tools/syringe-units` | Table | Prose only; add table |
| How many mcg in a mg | `/tools/mg-to-mcg` | Table | Prose only; add table |
| Where can I buy bac water / over the counter / near me | `/buy` | Paragraph | Done |
| Do I need a prescription | `/faq`, `/buy`, PDP | Paragraph | Done (schema on all three) |
| How to reconstitute [peptide] | `/peptides/[slug]` | Steps (HowTo) | Done |

---

## Shared implementation pattern for tool pages

Each tool page already has a server `layout.tsx` that wraps the client calculator. Extend that layout, not the client component, so all AEO content is in the initial HTML:

```
layout.tsx (server):
  [direct-answer block]            <- already present
  {children}  (client calculator)
  [## Quick reference table]       <- ADD: numeric answers as a table
  [## Related questions + FAQPage JSON-LD]  <- ADD: 2-3 conversational Q&A
  [Related guides list]            <- already present (fix stale links, see linking plan)
```

This keeps the interactive calculator client-side while making every quotable/tabular answer server-rendered and schema-backed.

---

## AEO checklist (prioritized)

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Add definition answer block + quick-reference table to the homepage (server HTML) | HIGH |
| 2 | Add Quick-reference tables to syringe-units and mg-to-mcg tool layouts (table snippets) | HIGH |
| 3 | Add "Related questions" FAQ + FAQPage schema to each tool `layout.tsx` | HIGH |
| 4 | Add labeled TL;DR / short-answer one-liner under H1 on peptide pages | MEDIUM |
| 5 | Add conversational/voice-phrased FAQ variants across FAQ hub and peptide pages | MEDIUM |
| 6 | Bidirectional cross-linking between tool FAQs, the FAQ hub, and peptide FAQs | MEDIUM |
| 7 | Add quick-reference table to bac-water and dose tool layouts | MEDIUM |

Note: fix the stale "Related guides" links in `src/app/tools/bac-water/layout.tsx` while touching those files. Two of them (`/learn/bac-water-vs-sterile-water`) point at a URL that 308-redirects, and the layout copy uses en dashes; see the internal-linking plan and the brand no-dash rule.
