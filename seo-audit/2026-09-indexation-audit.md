# BACwater.ai — Indexation Audit

**Date:** 2 September 2026
**Method:** Full crawl of every submitted and reachable route against a local
production-mode build with a seeded database, checking HTTP status, `robots`
meta, canonical, `<title>`, meta description, and `h1` count per URL, then
diffing that set against every URL in `sitemap.xml` and its three segments.
**Scope:** 88 routes checked, 82 sitemap URLs.

---

## Read this first: what this audit is not

> **Superseded in part, 3 September 2026.** The claim below that GSC data was
> unreachable was wrong. Search Console *is* reachable from the agent
> environment, via the Composio connector rather than Ahrefs — see
> [the query and indexation audit](./2026-09-gsc-query-and-index-audit.md),
> which carries the query-side analysis this document said it could not do,
> and which also found that `/tools/bac-water` is unknown to Google entirely.
> The indexation mechanics below still stand.

**There is no fresh Google Search Console data in this document.**

The request was a comprehensive GSC audit. I could not do that part. The
Ahrefs connector is authenticated but the account carries no plan
entitlement — every endpoint, including the free `subscription-info` one,
returns `Insufficient plan`. That is the same wall the
[August recovery plan](./2026-08-visibility-recovery-plan.md) hit, so it is a
standing account limitation rather than a transient failure. There is no
direct Search Console connector in this environment either.

So: **everything below is derived from the site itself**, which is the half of
the question I can answer completely and objectively. The query-side half —
"queries we're already ranking for" — still needs one of:

1. Ahrefs plan entitlement restored, then re-run this audit with the `gsc-*`
   tools; or
2. A GSC export (Performance → Queries and Pages, last 3 months, share the
   CSVs); or
3. Someone with GSC access working through §4 of the August plan directly.

The August plan already contains real GSC data (2026-07-01 → 2026-08-25) and a
prioritised query-side programme. **It is not superseded by this document.**
This one covers indexation mechanics; that one covers demand.

---

## 1. Findings

Two real defects, both fixed in this change. Everything else came back clean.

### F1 — `/peptides/compare` was in no sitemap at all

The comparison page returns 200, is `index, follow`, self-canonicalises, and
is linked from every peptide detail page. It appeared in **none** of
`sitemap-pages.xml`, `sitemap-learn.xml`, or `sitemap-peptides.xml`.

Why it matters more than it looks: the August audit established that this
domain's problem is Google **rationing crawl budget** — most of the site sits
at "Discovered — currently not indexed". A page that is never submitted is
competing for attention from the back of that queue, discoverable only if a
crawler follows an internal link. It also serves a genuine comparison intent
(`bachem peptide calculator` already appears in GSC at position 58), so it is
not a page we are indifferent about.

**Fixed:** added to `STATIC_PAGES`, now submitted. Sitemap count 81 → 82.

### F2 — `safety` is a key in both taxonomies, producing two competing indexable URLs

`safety` exists as both a `CONTENT_TYPES` key and a `TOPICS` key
(`src/lib/learn/taxonomy.ts` lines 14 and 22). Both filter URLs cleared the
≥3-result indexability threshold, so before this change:

| URL | robots | canonical | title |
|---|---|---|---|
| `/learn?topic=safety` | `index, follow` | self | `Safety guides · BAC Water Learning Center` |
| `/learn?type=safety` | `index, follow` | self | `Safety guides · BAC Water Learning Center` |

Two indexable URLs, byte-identical titles and descriptions, overlapping result
sets, each canonicalising to itself. That is textbook self-competition, and on
a domain already short of crawl budget it splits signal across two URLs that
should be one.

The August audit listed faceted `/learn` URLs under "checked and cleared". That
was right about the *canonical logic* — single-dimension filters with enough
results self-canonicalise, everything else noindexes back to `/learn`. It
missed that one label can live in both dimensions and satisfy that rule twice.

**Fixed:** a key present in both taxonomies now treats **topic as the canonical
home**. The `type` variant returns `noindex, follow` and canonicalises to the
topic URL. Verified:

```
/learn?topic=safety :: index, follow    canonical -> /learn?topic=safety
/learn?type=safety  :: noindex, follow  canonical -> /learn?topic=safety
```

This is a general guard, not a special case for `safety` — any future key added
to both lists is handled.

### F3 — Dead route files deleted (deferred item from August)

`src/app/plan/advanced/page.tsx` and `src/app/tools/ml-to-units/page.tsx` could
never render: `next.config.ts` holds permanent redirects for both paths and
config redirects always win. The August audit flagged these and its delete was
blocked by a tooling permission. Removed, and both redirects verified still
serving 308 afterwards.

---

## 2. What came back clean

Recorded so it is not re-audited:

| Check | Result |
|---|---|
| Sitemap URLs returning non-200 | **0** — nothing wasting crawl budget |
| Broken routes (4xx/5xx) | **0** |
| Missing canonical on indexable pages | **0** |
| Missing meta description on indexable pages | **0** |
| Pages with `h1` count ≠ 1 | **0** |
| Duplicate titles among indexable pages | **0** after F2 |
| Homepage sitemap/canonical mismatch | None — both omit the trailing slash consistently |
| `noindex` pages | 4, all correct: `/plans`, `/signin`, `/signup` (private), `/learn?type=safety` (deliberate, F2) |
| Redirects among checked routes | 2, both intentional |

The on-page technical SEO is genuinely in good shape. That reinforces the
August conclusion: **the constraint is authority and crawl budget, not markup.**

---

## 3. Getting every page indexed

Indexation here is not a sitemap problem. GSC reported all three sitemaps being
fetched daily, and this audit confirms every submitted URL resolves 200 with a
correct canonical. The URLs are discovered. Google is **choosing not to crawl
them**, which resubmission does not change.

What actually moves it, in order:

1. **Manual priority-crawl requests** — the only direct lever. GSC → URL
   Inspection → Request Indexing. Quota is ~10–12/day. Priority order, from the
   August plan plus this audit: `/tools/bac-water`, `/tools`, `/learn`, `/faq`,
   `/about`, `/tools/syringe-units`, `/tools/reverse-bac`, and now
   **`/peptides/compare`** (newly submitted, so it has never been requested).
2. **Fire IndexNow** once this ships:
   `curl -X POST https://bacwater.ai/api/admin/indexnow -H "x-seed-secret: $AUTH_SECRET"`.
   The dead-`/shop/*` fix is already live, so a run now is clean.
3. **Verify Bing Webmaster Tools** is connected with the sitemap submitted.
   Still unmeasured, and it feeds Copilot and ChatGPT search.
4. **Authority.** Phase 3 of the August plan is the real constraint and nothing
   here substitutes for it. A two-month-old domain with no referring domains
   gets rationed crawl no matter how clean the markup is.

**The leading indicator is unchanged:** `/tools/bac-water` moving from
"Discovered — not indexed" to "Submitted and indexed". Nothing else pays off
first.

---

## 4. Re-run this audit

The crawl is reproducible against any environment serving the app. It checks,
per URL: status, `robots`, canonical, title, description length, `h1` count,
and sitemap membership; then reports sitemap URLs that are not 200, indexable
URLs missing from the sitemap, broken routes, redirects, `noindex` pages,
missing canonicals/descriptions, bad `h1` counts, and duplicate titles.

Worth re-running after any change to routing, `STATIC_PAGES`, the learn
taxonomy, or `next.config.ts` redirects.

---

## 5. Still open

| Item | Blocked on |
|---|---|
| Fresh GSC query/page analysis | Ahrefs plan entitlement, or a GSC export |
| Whether August's Phase 1 manual index requests were made | Someone with GSC access |
| `/tools/bac-water` current index status | Same |
| Referring domains / Domain Rating | Ahrefs entitlement |
| AI citation rate | Unmeasured; needs the §4 prompt panel |
