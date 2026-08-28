# BACwater.ai — Visibility Audit & Recovery Plan

**Date:** 28 August 2026
**Data sources:** Google Search Console (`sc-domain:bacwater.ai`, 2026-07-01 → 2026-08-25), URL Inspection API, repository source at `dfd8c41`.
**Not available:** Ahrefs API returned `Insufficient plan` on every endpoint, so there is no third-party backlink, Domain Rating, or AI-citation data in this audit. Everything below is derived from GSC and the codebase.

---

## 1. What actually happened

The framing to correct first, because it changes the whole plan:

**There was no drop from a high base. There was never a high base.**

The GSC property holds **no data before 2026-07-01**. The site entered the index around then and has been climbing from zero. Over the full 56 days of available history:

| Metric | Value |
|---|---|
| Impressions | ~2,900 |
| Clicks | **5** |
| CTR | 0.17% |
| Pages with any impression | 38 (of 80 submitted) |

What *did* change, sharply, is **position**:

| Window | Avg. position |
|---|---|
| 4–10 Jul | ~28 |
| 18–24 Jul | ~29 |
| 1–7 Aug | ~40 |
| 15–21 Aug | ~51 |

And impressions actually **rose** while that happened — 963 in Jul 4–24 vs 1,526 in Aug 5–25, matched 21-day windows, **+58%**.

Impressions up, positions down, clicks flat at zero is a specific signature. It is not a penalty and not an algorithmic hit. It is Google **indexing more of the site while trusting none of it** — casting a wider net at progressively worse positions because the domain has no authority to place anything higher.

### The page-level damage

Same matched windows:

| Page | Impressions | Position |
|---|---|---|
| `/learn/bac-water-shelf-life` | 424 → 534 | 25.4 → **43.6** |
| `/learn/where-to-buy-bacteriostatic-water` | 235 → **14** | 35.4 → 64.4 |
| `/learn/vs/sodium-chloride` | 131 → 53 | 13.7 → **28.8** |
| `/peptides/ghk-cu` | 34 → 79 | 29.0 → **59.2** |

Every page that was working got worse. The one that fell off a cliff did so for a reason we caused ourselves.

---

## 2. Diagnosis, ranked

### P0 — The flagship money page is not in the index

`/tools/bac-water` is the exact-match page for the site's single biggest query. Its URL Inspection status is **"Discovered — currently not indexed."** Google knows the URL exists and has chosen not to crawl it.

Consequence, straight from the query→page data:

| Query | Impressions | Serving page | Position |
|---|---|---|---|
| bac water calculator | 57 | `/peptide-calculator` | 59.4 |
| bac water calculator | (same) | `/peptides` | 72.2 |
| bacteriostatic water calculator | 46 | `/peptide-calculator` | 61.0 |
| peptide bac water calculator | 21 | `/peptide-calculator` | 70.2 |

The best page for these queries is sitting outside the index while weaker pages absorb the impressions at position 60–72. Same status on `/tools`, `/tools/syringe-units`, `/tools/reverse-bac`, `/faq`, `/about`, and `/learn` — **the entire calculator directory and every hub page.**

Meanwhile `/shipping-returns`, a policy page that now 301s to `/`, *is* indexed. Google is not making a quality judgement here; it is rationing crawl budget on a two-month-old domain and spending it badly.

**Root cause: domain authority, not on-page SEO.** The tool pages are genuinely well built — unique titles, self-referencing canonicals, `WebPageJsonLd` with breadcrumbs, `SoftwareApplication` schema, an above-the-fold answer block, a quick-reference table, and an FAQ. There is nothing to fix on the pages themselves. They need crawl signal and links.

### P1 — We deleted our own second-best page

On 2026-07-15, commit `12edfab` 301'd `/learn/where-to-buy-bacteriostatic-water` → `/learn/what-is-bac-water` as part of removing the store.

Removing the store was right. Removing the page was not, because the demand did not go with it. That page owned **166 impressions across 40+ distinct queries**:

| Query | Impressions | Position |
|---|---|---|
| bacteriostatic water near me | 45 | 25.0 |
| can you buy bacteriostatic water at walgreens | 17 | 39.0 |
| where can i buy bacteriostatic water | 15 | 76.9 |
| where to buy bacteriostatic water | 11 | 68.0 |
| bacteriostatic water for injection near me | 6 | 46.8 |
| buy bac water online legitimate sources | 1 | **5.0** |
| best place to buy bacteriostatic water 2026 | 1 | **13.0** |

The redirect target answers a different question, so the cluster is dissolving rather than transferring: 235 impressions → 14.

This is the highest-intent traffic on the site and the cheapest thing to win back.

### P2 — Ad units shipped at the worst possible moment

The same commit put AdSense in-content units on content pages. Six-week-old domain, no backlinks, Google still deciding how much of the site to index — and we added ad density to the content it was evaluating. The rankings slide begins about ten days later.

Causation is not provable from this data. But `DEFAULT_AD_SLOT` was still the `"0000000000"` placeholder, meaning **the units never filled**. The site carried the quality risk and the third-party script weight for exactly zero revenue.

### P3 — Blocking age gate on every page

A full-screen `fixed inset-0` overlay that locks body scroll, shown to anyone without the cookie, including every crawler.

To be precise about this: age verification is an **allowed** interstitial under Google's rules, and content sits in the DOM behind it, so this is almost certainly *not* what kept pages out of the index. But it means every first-time visitor and every stricter renderer (Bing, several AI crawlers) meets a covered page before any content. On a site whose entire job is answering a question on arrival, that is a large engagement cost.

### P4 — Crawl artefacts pointing at dead URLs

- `sitemap-learn.xml` re-submitted DB guide slugs that a dedicated static route already submits via `sitemap-pages.xml` — the same URL in two segments, which makes per-segment index counts meaningless.
- The IndexNow pusher submitted `/shop/{slug}` for every active product. `/shop/*` has 301'd to `/tools` since July. We were spending Bing's crawl budget on redirects.
- Its `REDIRECTED` set was missing `how-long-bac-water-lasts`, which also 301s.

### Not a problem (checked and cleared)

Worth recording so nobody re-audits these:

- **Faceted `/learn?type=` / `?topic=` URLs** — correctly handled. Single-dimension filters with ≥3 results self-canonicalise; everything else is `noindex` + canonical back to `/learn`.
- **Internal linking** — header nav, footer, and contextual links are all in good shape. `/tools/bac-water` receives contextual links from the homepage, `/peptide-calculator`, `/peptides/[slug]`, three sibling tools, and `/learn/vs/[topic]`.
- **robots.txt** — correct, and explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot.
- **llms.txt** — genuinely good. Dynamic, complete, accurate.
- **Structured data** — Organization, WebSite, WebPage, Article, FAQPage, BreadcrumbList, SoftwareApplication all present and valid.

The technical SEO on this site is above average. That is precisely why the diagnosis lands on authority and self-inflicted changes rather than on-page work.

---

## 3. Shipped in this change

| # | Change | Files |
|---|---|---|
| 1 | Restored `/learn/where-to-buy-bacteriostatic-water` as a neutral sourcing guide — prescription status, the four routes people use, a vet-the-vial checklist, 6-question FAQ with schema. Names no vendor, discloses "we sell nothing" above the fold. | `src/app/learn/where-to-buy-bacteriostatic-water/page.tsx` |
| 2 | Removed the 301 that was killing it, with a comment recording why it must not come back | `next.config.ts` |
| 3 | Paused ad units behind `NEXT_PUBLIC_ADS_ENABLED` (default off). AdSense script no longer loads at all when disabled. | `src/lib/ads.ts`, `src/components/common/ad-slot.tsx`, `src/app/layout.tsx` |
| 4 | Age gate → non-blocking bottom banner. Same confirmation, same cookie; content stays readable. Declining still blanks the page. | `src/components/common/age-gate.tsx` |
| 5 | `STATIC_LEARN_SLUGS` dedupe so no URL is submitted from two sitemap segments | `src/lib/seo/sitemap.ts`, `src/app/sitemap-learn.xml/route.ts` |
| 6 | IndexNow: stopped submitting dead `/shop/*` URLs, added the missing redirected slug, applied the same dedupe | `src/app/api/admin/indexnow/route.ts` |

Verified: `tsc --noEmit` clean, `npm test` passes, `next build` compiles and emits the new route.

---

## 4. The recovery plan

Ordered by expected impact per unit of effort. Playbook references map to the Edward Sturm implementation manual.

### Phase 1 — Force the index (this week)

Nothing else matters until the calculator pages are indexed.

**Sitemap resubmission is not the lever.** Worth stating, because it is the obvious first instinct. GSC reports `lastDownloaded` of 2026-08-28 for `sitemap.xml` and `sitemap-peptides.xml` — Google is already fetching all three sitemaps daily. Discovery is not the problem; these URLs are discovered. Google is choosing not to crawl them. The only two things that change that are a manual priority-crawl request and authority.

**Do now — these do not depend on the deploy.** None of the following pages are changed by the recovery branch. They are already live and already correct; they just need crawling.

1. **Request indexing manually** in Search Console → URL Inspection → paste URL → *Request Indexing*. In priority order: `/tools/bac-water`, `/tools`, `/learn`, `/faq`, `/about`, `/tools/syringe-units`, `/tools/reverse-bac`. Roughly 60 seconds each; the daily quota is about 10–12 URLs, so all seven fit in one sitting.
2. **Verify Bing Webmaster Tools** is connected and the sitemap is submitted there. Bing feeds Copilot and ChatGPT search; it is currently an unmeasured surface. *(Playbook §3, tool stack)*

**Do after merge and deploy — these need the new code live.**

3. **Request indexing for `/learn/where-to-buy-bacteriostatic-water`.** Not before: until the branch ships, that URL still serves a 301, and requesting indexing on it today just makes Google re-confirm the redirect. It has history and an existing footprint, so once live it should re-index faster than a cold URL.
4. **Fire IndexNow:** `curl -X POST https://bacwater.ai/api/admin/indexnow -H "x-seed-secret: $AUTH_SECRET"`. Also after deploy — the fix that stops it pushing dead `/shop/*` URLs has to be live first, or the run repeats the old mistake.

**Then measure.**

5. **Re-inspect all eight URLs at 7 and 14 days.** If `/tools/bac-water` is still "Discovered — not indexed" after two weeks, the problem is authority alone and Phase 3 becomes the whole job.

### Phase 2 — Convert the impressions already being served (weeks 1–3)

5 clicks on 2,900 impressions is the loudest number in this audit. Some of it is position 50, but not all.

6. **Fix the shelf-life cluster properly.** `/learn/bac-water-shelf-life` takes 1,233 impressions — 42% of all site impressions — and converts one click. It ranks 43.6 for a query set it should own: *"how long does bac water last in fridge"* (23), *"how long is bacteriostatic water good for"* (21), *"does bac water need to be refrigerated"* (13). The page is good; the title is not competing. Rewrite the title/meta to lead with the literal question and a number. *(Playbook §03, query-driven refresh)*
7. **Build the "does it need refrigerating" answer block.** Six of the top 30 queries are refrigeration questions. They deserve a direct, quotable, two-sentence answer at the top of the page — the format answer engines lift. *(Playbook §06, PAA network)*
8. **Run a title-CTR pass on the top 10 pages.** Every one of them inherits a title written for the page, not for the query it actually receives. GSC now says what those queries are.
9. **Resolve the `/peptide-calculator` ↔ `/tools/bac-water` overlap.** Both target "bac water calculator". Once `/tools/bac-water` indexes, watch which Google picks. If it keeps choosing `/peptide-calculator`, narrow that page to "peptide calculator / reconstitution / syringe units" and let the tool own the bac-water term. Do not pre-emptively weaken the only page currently ranking. *(Playbook §01, one intent per URL)*

### Phase 3 — Build the authority that is actually missing (weeks 2–12)

This is the real constraint. Everything above is worth a few positions; this is worth the ranking.

10. **Ship one linkable asset.** The reconstitution calculator already *is* one — it just has no promotion. Give it a stable methodology section, a citable "how the math works" explanation, and an embeddable widget. Then pitch it to peptide forums, harm-reduction resources, and research-supply educational pages. *(Playbook §26, linkable asset program)*
11. **Stand up the AI prompt panel.** 25 fixed prompts — *"how much bac water for a 5mg vial"*, *"bac water vs sterile water"*, *"is bacwater.ai legitimate"*, *"best peptide reconstitution calculator"* — run monthly across ChatGPT, Perplexity, Gemini, Copilot. Record brand mention, cited domains, competitors. This is the only way to measure AI visibility, and right now it is entirely unmeasured. *(Playbook §04)*
12. **Comparison assets against the calculators that currently win.** `bachem peptide calculator` already shows up in our GSC data at position 58 — buyers are comparing. *(Playbook §20, competitor interception)*
13. **Entity corroboration.** `/about` and `/editorial-policy` exist but are not indexed and carry no `sameAs` links to real external profiles. An answer engine asked "is bacwater.ai legitimate" has nothing to corroborate against. *(Playbook §22, entity documentation)*
14. **The Reddit ladder is a real fit here.** This niche genuinely gets *"bac water reddit"*, *"peptide reconstitution reddit"* searches. One transparent resource page synthesising what the discussions actually conclude — clearly our site, not impersonating Reddit — then bridge pages off whatever GSC shows earns impressions. *(Playbook §07)*

### Phase 4 — Operating cadence (ongoing)

15. **Weekly:** GSC review, 5 actions assigned, internal links added to priority pages every Friday.
16. **Monthly:** 5–10 GSC-driven page refreshes, AI panel re-run, scale/improve/hold/stop call on each tactic. *(Playbook §28)*
17. **Re-enable ads** at a real threshold — suggest 500 organic clicks/month — by setting `NEXT_PUBLIC_ADS_ENABLED=true`. And put a real ad-unit ID in `DEFAULT_AD_SLOT` first, or they will not fill this time either.

---

## 5. What to measure

Baseline, 2026-08-28, from this audit — every later claim of improvement compares against it:

| Metric | Baseline |
|---|---|
| Impressions (28d) | ~1,900 |
| Clicks (28d) | 1 |
| Avg. position | ~50 |
| Indexed pages (of 80 submitted) | ~38 with impressions |
| `/tools/bac-water` index status | Discovered — not indexed |
| Buy-cluster impressions | 14 (from 235) |
| Referring domains | Unknown (no Ahrefs access) |
| AI citation rate | Unmeasured |

**The single leading indicator:** `/tools/bac-water` moving to "Submitted and indexed" and beginning to take "bac water calculator" impressions off `/peptide-calculator`. Nothing else in this plan pays off before that does.

---

## Appendix — deferred cleanup

Low priority, noted so it is not lost:

- `src/app/tools/ml-to-units/page.tsx` and `src/app/plan/advanced/page.tsx` are dead code. Both paths have permanent redirects in `next.config.ts`, which always win, so neither component can render. Nothing references them. Safe to delete. *(Attempted in this change; the delete was blocked by a tooling permission.)*
- `X-Frame-Options: DENY` plus CSP `frame-ancestors 'none'` is correct for security but blocks Google's rich-result preview rendering. No indexing impact — keep as is, just do not be surprised by the preview failing.
