# BACwater.ai Doorway-Page Risk Assessment

**Date:** 2026-07-02 (new)

Explicit assessment of the site's programmatic templates against Google's doorway-page guidelines. A doorway page is one created primarily to rank for search traffic and funnel users to a single destination, without providing standalone value at the page itself.

**Overall verdict: LOW doorway risk. Both programmatic clusters and the buy funnel are made for users first and provide standalone value. No page is a pure funnel.**

---

## Google's doorway-page test (the questions that matter)

Google's guidance flags a page as a doorway when the answer to these leans the wrong way:

1. Is the page's purpose to rank for search terms and then send the user somewhere else (rather than answer at the page)?
2. Do multiple similar pages exist that funnel users to one destination, with the pages themselves adding little?
3. Are the pages "in between" the user and content they actually want (an intermediate step)?
4. Would the pages be less useful if they didn't exist as separate URLs (i.e. is a template being multiplied only to catch keyword variants)?
5. Do near-duplicate pages target slightly different keywords but deliver essentially the same content?

A page passes when it answers the user's query at the page, stands alone, and each variant serves a genuinely distinct intent.

---

## Template-by-template assessment

### 1. Peptide pages `/peptides/[slug]` (24)

| Test | Result | Evidence |
|------|--------|----------|
| Answers at the page? | YES | Opens with a computed 40 to 60 word answer; delivers a full dosage table, reconstitution steps, storage guidance, and FAQ before any CTA. |
| Standalone value? | YES | A cold visitor gets their vial to water to units answer without leaving. The plan-builder CTA is an option, not a gate. |
| Distinct intent per page? | YES | Each targets a specific peptide's query set; the "custom" page absorbs the tail without cannibalizing. |
| Near-duplicate? | NO | Unique data, editorial, FAQ, and chart per page (see programmatic-seo-analysis.md, ~87/100 uniqueness). |
| Funnel-only? | NO | Multiple internal destinations (plan, tools, learn, related peptides, buy), and the core value is the on-page answer, not the funnel. |

**Verdict: NOT doorway pages.** These are per-entity resource pages with unique computed data plus hand-written editorial. The plan-builder CTA is a natural next step, not the page's reason for existing.

**One thing to keep honest:** the reconstitution steps and category context are near-identical across peptides. This alone is not doorway behavior (the procedure genuinely is the same), but do not let the *majority* of a page become shared boilerplate. As long as the unique data (table, direct answer, editorial, FAQ, chart) dominates the page, the pages stay on the right side of the line. The hardening moves in the programmatic analysis (peptide-specific prose in the mid sections) increase this margin.

### 2. Comparison pages `/learn/vs/[topic]` (7)

| Test | Result | Evidence |
|------|--------|----------|
| Answers at the page? | YES | Opens with a verdict paragraph and a side-by-side table; body sections add depth. |
| Standalone value? | YES | The verdict + table fully answer "bac water vs X" on the page. |
| Distinct intent per page? | YES | Each diluter is a separate query with a materially different answer. |
| Near-duplicate? | NO | Hand-written per topic. |
| Funnel-only? | NO | Links to siblings + plan + buy, but the comparison answer is the payload. |

**Verdict: NOT doorway pages.** Textbook informational comparison content.

**Safeguard when expanding:** if a new "vs X" is added that overlaps an existing one (e.g. "vs SWFI" overlapping "vs sterile-water"), that new page *would* risk being a near-duplicate doorway targeting a keyword variant. Consolidate or 301 instead of publishing the near-duplicate. The codebase already models this discipline: `next.config.ts` 308-redirects the legacy `/learn/bac-water-vs-sterile-water` into the canonical `/learn/vs/sterile-water` rather than keeping two near-identical URLs.

### 3. Buy funnel `/buy` (1)

| Test | Result | Evidence |
|------|--------|----------|
| Answers at the page? | YES | Direct answer on where to buy, a shipping infographic, in-stock products, a "near me" explainer, and a 4-item FAQ. |
| Standalone value? | YES | Answers "where can I buy / over the counter / near me / how fast" on the page. |
| Funnel to one destination? | PARTIAL BUT ACCEPTABLE | It does route to `/shop`, but it also answers the informational side of the query and links to guides. It is a commercial landing page with real content, not a bare funnel. |

**Verdict: NOT a doorway.** It is a legitimate commercial landing page: it satisfies the buy-intent query and provides shipping/prescription/near-me information rather than instantly bouncing the user to checkout.

**Watch item:** the planned "where to buy (2026)" buyers' guide and any future "near me" or location variants (see content-gap plan) must each carry unique content. A set of near-identical "buy bac water in [state]" pages that differ only by a place name and funnel to the same `/shop` would be classic doorway behavior. If location pages are ever built, give each genuinely local information or do not build them.

### 4. Tool pages `/tools/*` (6)

Not doorways: each is an interactive utility with a server-rendered answer and teaching content. They provide the tool the user came for. No funnel-only behavior.

---

## Aggregate risk table

| Cluster | Pages | Doorway risk | Primary safeguard |
|---------|:-----:|:------------:|-------------------|
| Peptide pages | 24 | LOW | Keep unique data dominant over shared steps/context; add peptide-specific mid-page prose |
| Comparison pages | 7 | LOW | Consolidate/301 any near-duplicate "vs X" variants instead of publishing them |
| Buy page | 1 | LOW | Any future location/vendor variants must carry unique content |
| Tool pages | 6 | LOW | None needed |

---

## Safeguards to institutionalize

1. **Uniqueness gate before shipping any new programmatic set (especially per-vial-size pages):** each generated page must have (a) its own direct-answer prose, (b) a distinct FAQ or data table, and (c) demonstrated query demand. No auto-generating every combinatorial URL.
2. **Consolidate keyword-variant near-duplicates via 301/308**, as already done for the sterile-water URL. One canonical page per intent.
3. **Never let boilerplate dominate a page.** The share of unique (computed or hand-written) content must exceed the shared template content on every programmatic page.
4. **No location or vendor spam pages** unless each carries genuinely unique, useful, local/vendor-specific information.
5. **Keep CTAs as next steps, not gates.** Every programmatic page must fully answer its query before any "build a plan / buy" prompt, which it currently does.

---

## Conclusion

The site is on the correct side of Google's doorway guidelines. The programmatic clusters are user-first resource pages built on unique data and editorial, each answering its query standalone, with CTAs as optional next steps. The existing redirect discipline (consolidating the legacy sterile-water URL) shows the right instinct. The only real future risk is the tempting phase-2 expansions (per-vial-size, location, vendor pages); gate those behind the uniqueness safeguards above and the site stays clear.
