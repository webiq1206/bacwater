# BACwater.ai — Search Console audit: queries, pages, indexation

**Date:** 3 September 2026
**Data:** Google Search Console, property `sc-domain:bacwater.ai`, web search,
2026-07-04 → 2026-08-31 (the property returned its first impression on 07-04).
**Method:** Search Analytics pulls by query, page, query×page and date, plus
per-URL Inspection API checks and the Sitemaps API.

This supersedes the "no GSC data available" caveat in
[the indexation audit](./2026-09-indexation-audit.md) and updates the
[August recovery plan](./2026-08-visibility-recovery-plan.md) with fresh
numbers. GSC is reachable from the agent environment through the Composio
connector — it does not require Ahrefs, whose account still returns
`Insufficient plan` on every endpoint.

---

## 0. Headline

| Metric | Value |
|---|---|
| Impressions | 3,615 |
| Clicks | **4** |
| CTR | **0.11%** |
| Average position | **41.5** |
| Avg position, July | ~29 |
| Avg position, August | ~50 |

Impressions are healthy for a young domain and roughly flat at 50–90/day.
Position **got worse by about 20 places over the window**. Clicks are a
rounding error because almost nothing ranks on page 1 or 2.

The four clicks, for the record: `/` (1), `/learn/too-much-bac-water` (1),
`/learn/where-to-buy-bacteriostatic-water` (1), `/tools/vial-labels` (1).

---

## 1. The finding that matters most

### F1 — The flagship calculator has never been crawled, on either host

```
https://bacwater.ai/tools/bac-water      → "URL is unknown to Google"
https://www.bacwater.ai/tools/bac-water  → "URL is unknown to Google"
```

Not "Discovered — currently not indexed". **Unknown.** Google has no record of
this URL at all, despite it being:

- in `STATIC_PAGES` at priority 0.9 (`src/lib/seo/sitemap.ts:88`),
- inside `sitemap-pages.xml`, which GSC last downloaded 2026-08-28,
- linked from the site's own navigation.

Every sibling behaves differently — `/tools`, `/tools/reverse-bac` and
`/tools/syringe-units` all report "Discovered — currently not indexed" **and**
carry a `sitemap` association in their inspection record. `/tools/bac-water`
carries none.

This is the page the August plan named as the single leading indicator for
recovery. It is not "waiting in the crawl queue"; as far as Google is
concerned it does not exist.

### F2 — Google canonicalises one page to `www`, against our own declaration

```
https://www.bacwater.ai/tools/syringe-units
  coverageState   Submitted and indexed
  userCanonical   https://bacwater.ai/tools/syringe-units   ← what we declare
  googleCanonical https://www.bacwater.ai/tools/syringe-units ← what Google picked
  referringUrls   https://www.bacwater.ai/tools/bac-water
  lastCrawlTime   2026-08-15

https://bacwater.ai/tools/syringe-units        ← the URL we submit
  coverageState   Discovered - currently not indexed
```

The version we submit and canonicalise is **not indexed**. The `www` version
**is**, and Google overrode our canonical to keep it. That page accounts for
80 impressions at position 31.8 — it appears in the page report as
`https://www.bacwater.ai/...`, the only row on the property that does.

The homepage does consolidate correctly (`https://www.bacwater.ai/` reports
"Alternate page with proper canonical tag" → `https://bacwater.ai/`), so this
is **not** a site-wide split. But Google holds a `www` crawl graph —
`www.bacwater.ai/tools/bac-water`, `www.bacwater.ai/privacy`,
`www.bacwater.ai/learn/how-peptide-reconstitution-works` all appear as
referring URLs — which means the `www` host has been serving crawlable pages
with `www`-relative internal links, not redirecting.

**Fixed in code.** `next.config.ts` now 308s every `www` request to the apex,
as the first redirect in the list so it resolves in one hop and the path
redirects then apply on the canonical host. The apex host is derived from
`NEXT_PUBLIC_SITE_URL` — the same variable the sitemaps and canonical tags
read — so the three cannot disagree, and a leading `www.` is stripped from it
so a misconfigured value cannot produce a loop.

Verified against a real production build: `www` root, a deep path, and a path
with a query string all 308 to `https://bacwater.ai/...` with the path and
query preserved; the apex host serves 200 and is not redirected; the existing
legacy path redirects still fire on the apex; and a lookalike host
(`wwwXbacwater.ai`) does **not** match, confirming the dots in the host
pattern are literal rather than wildcards.

**Still unverified: production.** Outbound HTTPS to arbitrary hosts is blocked
by this environment's network policy, so I could not observe what
`www.bacwater.ai` did before this change, nor confirm it after deploying. Two
things to check once it ships: that `curl -I https://www.bacwater.ai/` returns
308 to the apex, and that DNS for `www` actually points at the deployment — if
it does not, this code never runs and the duplicate host has some other
origin.

### F3 — Calculator intent lands on the wrong pages

The site's commercial core is a reconstitution calculator. Here is where
calculator queries actually land:

| Query | Impressions | Lands on | Position |
|---|---|---|---|
| bac water calculator | 54 | `/peptide-calculator` | 59.5 |
| bac water calculator | 36 | `/peptides` | 72.7 |
| bacteriostatic water calculator | 48 | `/peptide-calculator` | 61.3 |
| peptide bac water calculator | 24 | `/peptide-calculator` | 70.0 |
| tirzepatide reconstitution calculator | 13 | `/peptides/tirzepatide` | 60.4 |
| ghk cu reconstitution calculator | 10 | `/peptides/ghk-cu` | 49.6 |

`/tools/bac-water` appears **zero** times — consistent with F1. The purpose-built
calculator is invisible, so Google substitutes `/peptide-calculator` (indexed,
position ~60) and, worse, the `/peptides` index page (position ~73).

Roughly 250 impressions of direct product intent are being served by pages that
rank on page 6–8.

---

## 2. What we already rank for

Three clusters carry nearly all impressions. All three are informational, and
all three sit just off the money — page 3 to 5, where CTR is effectively zero.

### Cluster A — Storage, shelf life, expiry (~350+ impressions)

Lands almost entirely on `/learn/bac-water-shelf-life`: **1,407 impressions —
39% of the whole property — 0 clicks, position 35.5.** Confirmed
"Submitted and indexed", last crawled 2026-09-01.

Representative queries: *does bacteriostatic water need to be refrigerated
after opening* (32), *bacteriostatic water shelf life* (19), *do you have to
refrigerate bacteriostatic water* (16), *does bac water need to be
refrigerated* (16), *bac water in fridge* (15), *bac water expiration* (15),
*bacteriostatic water shelf life after opening* (13), *expired bacteriostatic
water* (12), *can you freeze bac water* (10).

This is the site's biggest asset by a wide margin and its biggest waste. One
indexed page, ranking on page 4, for hundreds of impressions of a question it
answers directly.

### Cluster B — Comparison (~150 impressions, best positions on the site)

| Page | Impressions | Position |
|---|---|---|
| `/learn/vs/sodium-chloride` | 256 | **20.2** |
| `/learn/vs/sterile-water` | 192 | 52.7 |

`/learn/vs/sodium-chloride` at position 20 is the **best-positioned
high-volume page on the property** — genuinely close to page 2. Queries:
*bac sodium chloride* (40, pos 31.9), *bac water vs sodium chloride* (16),
*bacteriostatic water vs sodium chloride* (12), *bac water vs bac sodium
chloride* (9, **pos 15.7**).

Meanwhile the sterile-water comparison, on a bigger query set
(*bacteriostatic water vs sterile water* 29, *bacteriostatic vs sterile water*
18, *bac water vs sterile water* 10), sits 32 places worse. Same template,
same site, one third the position. That gap is the cheapest win available.

### Cluster C — Buy / local (~110 impressions)

Lands on `/learn/where-to-buy-bacteriostatic-water` — **315 impressions, 1
click, position 38.4**. This is the page restored in
[webiq1206/bacwater#1](https://github.com/webiq1206/bacwater/pull/1); it is working and
is the site's second-strongest page, which validates that decision.

Queries: *bacteriostatic water near me* (45, **pos 25.0**), *can you buy
bacteriostatic water at walgreens* (17), *bacteriostatic water benz alc
coupon* (10), *bacteriostatic water for injection near me* (6), *can you buy
bacteriostatic water over the counter* (5).

*bacteriostatic water near me* at position 25 on 45 impressions is the single
highest-intent query the site ranks for.

---

## 3. Indexation status

Sampled via the Inspection API. **Do not trust the Sitemaps API `indexed`
count** — it reports `0` for all four sitemaps, but `/peptide-calculator` and
`/learn/bac-water-shelf-life` both verify as "Submitted and indexed". That
field is deprecated and always returns zero; it is not evidence of anything.

| URL | State |
|---|---|
| `/` | Submitted and indexed |
| `/peptide-calculator` | Submitted and indexed |
| `/learn/bac-water-shelf-life` | Submitted and indexed |
| `www./tools/syringe-units` | Submitted and indexed (canonical hijack, F2) |
| `/tools` | Discovered — not indexed |
| `/tools/reverse-bac` | Discovered — not indexed |
| `/tools/syringe-units` | Discovered — not indexed |
| `/tools/bac-water` | **URL unknown to Google** (F1) |
| `/peptides/compare` | **URL unknown to Google** — expected; only added to the sitemap in [webiq1206/bacwater#4](https://github.com/webiq1206/bacwater/pull/4), not yet re-crawled |

Sitemaps are all fetching cleanly with zero errors and zero warnings:
`sitemap-pages.xml` (26 URLs), `sitemap-peptides.xml` (24),
`sitemap-learn.xml` (31), index `sitemap.xml` (81).

---

## 4. What to do, in order

**1. Resolve the host split (F2). — Done in code, needs deploying.** The
`www` → apex 308 is in `next.config.ts`. Deploy it, then confirm with
`curl -I https://www.bacwater.ai/`. Until both hosts stop serving, every crawl
is split and canonical declarations are advisory.

**2. Force a crawl of `/tools/bac-water` (F1).** GSC → URL Inspection →
Request Indexing, on the apex URL. It is unknown to Google, so nothing else —
sitemap priority, internal links — has worked. Then confirm it moves to at
least "Discovered". This is still the leading indicator.

**3. Give the calculator queries a page that ranks (F3).** Roughly 250
impressions of *bac water calculator* / *bacteriostatic water calculator*
intent currently land on `/peptide-calculator` (pos ~60) and `/peptides`
(pos ~73). Once `/tools/bac-water` is crawlable, the two need distinct,
non-competing purposes — or one should redirect into the other. Two pages
serving one intent at position 60 is the current state and it is the worst of
both.

**4. Rewrite `/learn/bac-water-shelf-life` for the questions it already
receives.** 1,407 impressions at position 35.5 is the largest single lever on
the site. The queries are overwhelmingly *does it need refrigerating*, *does
it expire*, *how long after opening*, *can you freeze it*. Lead with direct
answers to those exact phrasings; the 28-day rule and the fridge answer should
be the first thing on the page, not a conclusion.

**5. Bring `/learn/vs/sterile-water` up to `/learn/vs/sodium-chloride`.**
Same template, position 52.7 vs 20.2, on a larger query set. Diff the two
pages and port whatever the sodium-chloride page is doing right.

**6. Then, and only then, authority.** Phase 3 of the August plan is still the
ceiling. But note the revision this data forces: the August conclusion was
"crawl budget rationing on a zero-authority domain." That is still partly
true, yet a page unknown to Google and a canonical Google overrode are
**mechanical faults, not authority symptoms**, and they are fixable this week.

---

## 5. Re-running this

All of it is reproducible from this environment via the Composio Google Search
Console toolkit — `GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY` for the
analytics pulls, `GOOGLE_SEARCH_CONSOLE_INSPECT_URL` per URL,
`GOOGLE_SEARCH_CONSOLE_LIST_SITEMAPS` for sitemap health. The property is
`sc-domain:bacwater.ai` and the connected account holds `siteOwner`.

Worth re-running monthly, and immediately after the host redirect ships.

## 6. Still open

| Item | Blocked on |
|---|---|
| Does the `www` redirect work in production? | Shipped in `next.config.ts` and verified locally; outbound HTTPS is blocked here, so confirm after deploy from an unrestricted network |
| Referring domains / Domain Rating | Ahrefs entitlement (`Insufficient plan` on all endpoints) |
| Whether August's Phase 1 index requests were ever made | Someone with GSC UI access |
| AI citation rate | Unmeasured; needs the prompt panel from §4 of the August plan |

---

## 7. Before-deploy snapshot (3 September 2026)

A second pull taken the same day, immediately before PRs #5–#8 were deployed,
so the post-deploy re-pull has a fixed baseline to diff against. **None of the
code from those PRs was live at this point** — anything that moved here moved
on Google's own schedule, not because of our changes.

Window extended by one day (2026-07-04 → 2026-09-01) so the totals are not
strictly comparable to §0's window; the difference is one day of data.

### Totals — flat

| Metric | §0 pull (→ 08-31) | This pull (→ 09-01) |
|---|---|---|
| Impressions | 3,615 | 3,663 |
| Clicks | 4 | 4 |
| Avg position | 41.5 | 41.4 |

Last three complete days tightened toward better positions —
~50 (Aug 27–29) → ~41 (Aug 30–31) → **36 (Sep 1)** — but that is a few dozen
impressions on one property and predates every change here. Treat as noise
until it holds for a week.

### Index status — one real move, and it is not ours

| URL | §1/§3 pull | This pull | Read |
|---|---|---|---|
| `bacwater.ai/tools/bac-water` | **URL unknown to Google**, no sitemap association | **Discovered — currently not indexed**, now carries a `sitemap-pages.xml` association and apex referring URLs (`/peptides/tirzepatide`, `/tools`) | Google discovered the page on its own by processing the sitemap. Moved into the crawl queue, not out of it. Still not indexed. F1's "unknown" symptom has cleared; the "not crawled" one has not. |
| `www/tools/syringe-units` | Indexed, `googleCanonical = www`, `lastCrawlTime 2026-08-15` | **Identical** — same canonical, same 08-15 crawl | The `www` hijack is unchanged, as expected: the redirect is not deployed and Google has not re-crawled `www` since before our change existed. |
| `bacwater.ai/tools/syringe-units` (apex) | Discovered — not indexed | **Identical** | — |

**This is the row to watch.** When the deploy is live and Google next crawls
`www/tools/syringe-units`, its `lastCrawlTime` should advance past 2026-08-15
and its `coverageState` should flip from "Submitted and indexed" to a redirect
state, with the apex URL taking over. If `lastCrawlTime` is still 08-15 a week
after deploy, either the deploy did not go out or `www` DNS does not point at
it — the two production checks in F2.

### Re-pull after deploy checks, in order

1. `www/tools/syringe-units` — `lastCrawlTime` advanced past 2026-08-15, and
   `coverageState` no longer "Submitted and indexed" on the `www` URL.
2. `bacwater.ai/tools/bac-water` — "Discovered" → "Crawled" → "Submitted and
   indexed" (each is a separate step; the index request in §4 is what pushes it).
3. Totals and the calculator-intent cluster (§F3) — whether `/tools/bac-water`
   starts appearing for *bac water calculator* once it is indexed.
