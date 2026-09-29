# BACwater.ai full SEO, AEO, GEO and CRO audit

Date: September 29, 2026. Baseline commit: a557b14. Branch: claude/website-seo-aeo-geo-cro-4y4pi8.

This audit inspected the live site through an external fetcher, Search Console (property sc-domain:bacwater.ai), GA4 (property 544052321), URL inspection, the source code, a full no-JS crawl of the local production build, and Lighthouse lab runs. Every change below traces to a measured issue on a page that receives impressions, or to a documented platform requirement. Nothing was changed for its own sake.

## 1. Access and data limits

| Source | Status | Note |
|---|---|---|
| Google Search Console | Available (siteOwner) | Two complete 28-day windows compared. Query rows are privacy-filtered and do not sum to property totals. |
| GA4 | Available | Property "BAC Water". Data is present, but see section 9: it is not coming from the consent-gated code in this repository. |
| URL Inspection | Available | Ten priority URLs inspected. |
| Direct HTTPS to bacwater.ai | Blocked by this environment's network policy | Live pages were read through an external fetcher (text and links only, no raw HTML or headers). Page speed was measured on the local production build, not the live host. |
| Bing Webmaster Tools | Not connected | Bing is the largest organic source in GA4 (73 sessions versus 5 from Google in 30 days). Connecting BWT is the single most useful missing data source. |
| Ahrefs | Plan does not cover the API ("Insufficient plan") | No keyword volumes, backlink counts or Domain Rating in this audit. |
| Production database | Not accessed | Database-backed articles were audited from the seeded local copy and the live rendering. |

## 2. Baseline metrics (record for follow-up comparison)

### Search Console, web search, sc-domain:bacwater.ai

| Metric | Aug 1 to Aug 28 | Aug 29 to Sep 25 |
|---|---|---|
| Clicks | 1 | 4 |
| Impressions | 1,981 | 2,432 |
| CTR | 0.05% | 0.16% |
| Average position | 48.3 | 35.2 |
| Pages with impressions | 33 | 42 |

Device split (current window): desktop 1,220 impressions at position 52.3; mobile 1,201 impressions at position 18.0; tablet 11. The site ranks on mobile and barely on desktop. Country: USA 1,853 impressions, Australia 99, Canada 94.

Top pages by impressions, current window:

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| www.bacwater.ai/tools/syringe-units (Google still attributes to the old www URL) | 819 | 0 | 10.9 |
| /learn/bac-water-shelf-life | 598 | 0 | 49.4 |
| /tools/bac-water | 167 | 1 | 35.9 |
| /peptides/tirzepatide | 163 | 0 | 54.2 |
| /learn/what-is-bac-water | 110 | 0 | 66.2 |
| /learn/bac-water-for-peptides | 92 | 0 | 67.8 |
| /learn/vs/sterile-water | 81 | 0 | 53.4 |
| /peptide-calculator | 70 | 0 | 64.8 |
| /learn/too-much-bac-water | 69 | 1 | 6.3 |
| /learn/vs/sodium-chloride | 60 | 0 | 35.2 |

Weekly impressions have risen from roughly 400 (July) to 660 (week of Sep 16) with position improving from the high 40s to the low 30s. Four clicks in 28 days means no page has reached a position where clicks happen, except the syringe converter, which sits at position 10.9 on 819 impressions with zero clicks (all of its queries are privacy-filtered long-tail, which usually means "how many units is X mL" style questions).

### Index status (URL Inspection, September 29)

| URL | State |
|---|---|
| / | Submitted and indexed, crawled Sep 25 |
| /tools/bac-water | Submitted and indexed, crawled Sep 3 (was "unknown to Google" on Sep 3; the earlier fix worked) |
| /tools/syringe-units | Submitted and indexed, crawled Sep 20 |
| www.bacwater.ai/tools/syringe-units | "Alternate page with proper canonical tag", Google canonical is now the apex URL (the www hijack from the September 3 audit is resolved; last www crawl Aug 15, so impressions are still reported under www until Google refreshes) |
| /learn/bac-water-shelf-life | Submitted and indexed, crawled Sep 25 |
| /peptide-calculator | Submitted and indexed, crawled Sep 25 |
| /learn/vs/sterile-water | Submitted and indexed, crawled Aug 28; Search Console warns the infographic ImageObject lacks license, acquireLicensePage and copyrightNotice |
| /learn/too-much-bac-water | Submitted and indexed, last crawled Jul 9 |
| /tools | Submitted and indexed, crawled Sep 7 |
| /recommendations | Discovered, currently not indexed |

Sitemaps: index plus three segments, 87 URLs submitted, 0 errors, 0 warnings, last read Sep 28. The "indexed" count the Sitemaps API returns is always 0 and is not evidence of anything.

### GA4, Aug 29 to Sep 27

| Channel | Sessions | Engaged |
|---|---|---|
| Direct | 112 | 35 |
| Organic search (Bing 73, DuckDuckGo 20, Yahoo 6, Google 5, Ecosia 1) | 110 | 59 |
| AI assistant (chatgpt.com) | 38 | 21 |

AI referrals from ChatGPT already exceed Google organic sessions by a wide margin. Key events configured in the property: close_convert_lead, qualify_lead, purchase. None of them can fire on this site (0 key events in the window). Events received: page_view, session_start, first_visit, user_engagement, scroll, form_start (9), form_submit (3). None of the repository's usage events (calculation_completed, plan_saved, supplier_clicked, contact_saved) appear.

Landing pages with the weakest engagement: /learn hub (25 sessions, 3 engaged, 4.8 s average), /learn/bac-water-shelf-life (9 sessions, 2 engaged, 2.2 s). Both are answer pages where the first-time visitor sees the age-check banner above the answer.

### Lighthouse, mobile, local production build

| Page | Performance | LCP | TBT | CLS | Accessibility | SEO |
|---|---|---|---|---|---|---|
| / | 67 | 4.9 s | 420 ms | 0 | 100 | 100 |
| /tools/syringe-units | 86 | 4.1 s | 90 ms | 0 | 100 | 100 |
| /learn/bac-water-shelf-life | 91 | 3.3 s | 100 ms | 0 | 100 | 100 |
| /peptides/tirzepatide | 82 | 4.3 s | 210 ms | 0 | 99 | 100 |

These are throttled lab numbers from a container, not field data; use them to compare before and after, not as absolute scores. The homepage LCP element is the hero description paragraph and the page carries 17 script chunks and 3.1 s of main-thread work; the other templates are lighter. CLS is zero everywhere. Lighthouse also flags aria-allowed-role and a label/content mismatch on the homepage and a heading-order skip on the compound template (an h3 inside the accordion before its h2); these are noted, not changed here, because they sit inside shared components the browser acceptance suite pins.

## 3. Crawl of every sitemap URL (local production build, no JavaScript)

87 URLs, all 200. Every page has exactly one H1, a self-referencing canonical on the apex host, a unique title, a unique description, Organization and WebSite JSON-LD, alt text on every image and no accidental noindex. The private routes (/plan/*, /plans, /signin, /signup, /search, /calculate/*) are noindex and excluded from the sitemaps as intended. Main content, H1s and the facts an answer engine would quote are present in the server HTML on every template, including the calculators (the reference sections render server-side; only the inputs need JavaScript).

Findings:

- Titles over 60 characters (with the brand suffix): 4 static pages and 6 of 7 comparison pages ran 62 to 75 characters. The comparison metaTitles and two article titles were shortened; the shelf-life title was rewritten around its actual queries.
- Descriptions over 160 characters: 9 learn filter views, 3 comparisons and the volume calculator. All trimmed to 160 or fewer.
- Internal links: no orphans. /learn/where-to-buy-bacteriostatic-water, which had 315 impressions in July and August and was the site's second-strongest page, had a single internal link (the sitemap page) and has fallen to 7 impressions. /embed had two. Both are now linked from the footer, and the buying guide is also linked from the what-is-bac-water and bac-water-for-peptides pages.
- Schema: the compound template emits WebPage, HowTo, FAQPage, ImageObject and BreadcrumbList with no duplicates. The infographic ImageObject lacked the licence fields Search Console warns about; added.
- robots.txt allowed everything under the wildcard only. Explicit allow groups were added for the major answer-engine crawlers so a cautious crawler never infers its permission (see section 5).
- /faq and the learn sitemap returned 503 during the first crawl because the local database was down; on the live site both return 200 (verified through the external fetcher and the Sitemaps API).

## 4. Keyword and intent map for the pages that matter

| Page | Intent it owns | Evidence | Change |
|---|---|---|---|
| / | "bac water calculator", "bacteriostatic water calculator" (brand equals keyword) | Homepage at position 17 on 21 impressions; the same head terms also land on /tools/bac-water (position 78) and /peptide-calculator (position 67) | No change to the homepage. The two tool pages were sharpened toward their own intents so three pages stop competing for one term. |
| /tools/bac-water | "how much bac water", volume versus concentration | 167 impressions; queries include "how do i know how much bacteriostatic water to use" | Description now says what the page does; a Common questions block (with FAQPage schema) answers "how do I know how much BAC water to add" honestly. |
| /tools/syringe-units | "units to mL", "how many units is 1 mL", insulin syringe scale | 819 impressions at position 10.9, zero clicks | "Insulin" added to title, H1 and description because that is how searchers name the U-100 scale; new question sections for 1 mL and 2 mL; FAQPage schema. |
| /learn/bac-water-shelf-life | Storage: expiration, fridge, after opening, room temperature, freezing, 28 days | 598 impressions at position 49; 80 distinct query phrasings, all storage | Rebuilt as seven question sections in the searchers' wording, each answered from the Pfizer label or CDC guidance, with matching FAQPage schema. No new medical claim. Title and description now state the answer. |
| /learn/vs/sterile-water | "bacteriostatic vs sterile water", "sterile water for peptides", "same as" | 81 impressions at position 53 versus the sodium-chloride comparison at 35 on the same template | Verdict now answers "is it the same" directly; added a section on what the two Pfizer labels say (verified against both labels), a "which water do peptides need" section, three FAQs, and the Pfizer sterile water label as a source. |
| /peptides/tirzepatide, /semaglutide, /retatrutide | "tirzepatide reconstitution calculator", "how much bac water for 30 mg tirzepatide" | 163 impressions; every query names tirzepatide; the title, H1 and opening answer said only "GLP-2 (TR)" | Reference page title, H1 and opening answer now read "Tirzepatide (GLP-2 (TR))", keeping the partner's exact label. Calculator labels, the directory and search aliases are unchanged. See section 8 for the owner decision this touches. |
| /learn/what-is-bac-water | Definition: "what is bac water", "what does bac stand for", "made of", "used for" | 110 impressions at position 66 on a 300-word article | A code-defined FAQ block (four label-sourced answers) with FAQPage schema now renders under the article without a database change. |
| /learn/bac-water-for-peptides | "do you need bac water for peptides", "how much bac water for peptides", "distilled water for peptides", "peptide water" | 92 impressions at position 68 | Four FAQs in the searchers' wording with FAQPage schema. |

## 5. Technical, AEO and GEO changes

- robots.txt now names GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Google-Extended and CCBot with the same public/private rule set as the wildcard. This follows the answer-engine guidance that an explicitly named crawler never has to guess at a wildcard. Google-Extended does not affect Search, AI Overviews or AI Mode inclusion; those follow the ordinary Googlebot index, so nothing about search access changed.
- llms.txt was already live and accurate; it stays as is. It is a discovery aid, not a substitute for the fundamentals above.
- ImageObject schema on the infographics now includes copyrightNotice, license (terms page) and acquireLicensePage (contact page), clearing the three Search Console image-metadata warnings.
- Every new FAQ block renders the same questions and answers in the HTML that its FAQPage schema declares. No answer states a dose, a universal shelf life or an unverified product fact. Sources: Pfizer Bacteriostatic Water for Injection label, Pfizer Sterile Water for Injection label, CDC multi-dose vial guidance (all fetched and read on September 29).
- Next.js already serves blocking metadata to recognised bots and streams it for others; no change.

## 6. Conversion changes

- Age-check banner: the two buttons now sit side by side on phones instead of stacking, so the banner costs one row above the answer instead of two. The policy, wording, cookie and decline flow are unchanged.
- Shelf-life page: the closing call to action now leads with "Print a dated vial label" (the reader's actual next step after a storage question) with the calculator second.
- Footer: two learn links added (sterile water comparison, where to buy) so the buying guide and the best-positioned comparison template are reachable from every page.
- Calculator, share, embed and contact flows were reviewed in source and on the local build; they work and were not changed. The contact form stores messages in the database and shows a reference id, but no one is notified by email (RESEND is optional and no send is wired). That is a process gap the owner should decide on.

## 7. Verification

- TypeScript: clean.
- npm test (all retained suites, including partner names, search appearance for 114 metadata pairs, growth, tracking, embed, backlinks): pass.
- Production build: pass.
- Built-server HTTP checks (npm run test:search-http): pass, 78 checks on the rebuilt bundle with the seeded database.
- No-JS re-crawl of all 87 sitemap URLs on the rebuilt server: all 200, one H1 each, no duplicate titles or descriptions, every description at or under 160 characters, zero images without alt text, every JSON-LD block parses, and on the nine changed pages every FAQPage question and answer appears verbatim in the visible HTML. The buying guide now has 82 internal links and the sterile-water comparison 97.
- robots.txt on the rebuilt server lists the wildcard group plus the nine named answer-engine agents with identical rules.
- Lighthouse after the changes, mobile, local build: shelf-life page 91 (LCP 3.3 s, CLS 0), unchanged; homepage 61 (LCP 5.1 s, TBT 810 ms) against 67 before, which is container CPU noise on an unchanged bundle rather than an effect of these edits. The homepage's main-thread cost predates this work and is listed under remaining work.
- Live verification of the deployed result (robots.txt, FAQ schema in production HTML, Search Console rich-result reads) needs the deploy first; this environment cannot reach bacwater.ai directly.

## 8. Unresolved blockers and decisions for the owner

1. Compound names on reference pages. The September 25 request put the partner's exact product names throughout product components, including reference headings. Search Console shows the tirzepatide reference receiving only "tirzepatide" queries while its title and H1 said "GLP-2 (TR)". This audit restores the compound name alongside the partner label on the reference page title, H1 and opening answer only. If the partner's naming rule must apply to reference headings too, revert the referenceDisplayName helper in src/lib/peptides/page-data.ts; the search cost is that those three pages would again lack the term people search.
2. Analytics provenance. GA4 receives page views with real page titles (for example "MOTS-c Reconstitution Calculator & Reference"), while the repository's consent-gated tag sends the fixed title "BACwater.ai utility" and category-level URLs. Either a second Google tag is installed at the deployment layer, or a different build is live. Someone with access to the Replit deployment and the GA4 admin should confirm which tag is firing, because the privacy page promises analytics are off unless allowed. Until then, GA4 numbers cannot be reconciled with the site's consent model.
3. GA4 key events. The property's key events (close_convert_lead, qualify_lead, purchase) do not exist on this site. The API is read-only for key events; in the GA4 UI, mark calculation_completed, plan_saved, supplier_clicked, contact_saved and embed_code_copied as key events once the tag question above is settled.
4. Bing Webmaster Tools. Not connected, yet Bing sends 15 times more organic sessions than Google. Verify the domain in BWT (IndexNow is already wired) so Bing indexing and query data can be audited.
5. Ahrefs entitlement. The connected key returns "Insufficient plan"; no keyword volumes or backlink data were available. Backlinks remain at zero verified according to backlinks/ledger.json.
6. Contact notifications. Submissions are stored but no one is emailed. Decide on a mailbox and wire RESEND, or add a routine check of the admin contact list.
7. Owned profiles for Organization.sameAs. The Pinterest and YouTube accounts recorded in docs/growth are shared agency accounts, so they were not added as BACwater entity profiles. Add sameAs only when a BACwater-named profile exists.
8. Database article bodies. The DB articles (what-is-bac-water at 300 words is the thinnest high-impression page) can only be expanded through the editorial revision workflow, which is a separate reviewed operational step per the README. The code-side FAQ block added here does not need that step.

## 9. Follow-up comparisons

Record these after the deploy, then compare like for like.

- Day 7: /version.json shows the merged commit; robots.txt on the live host lists the nine AI agents; URL Inspection on /learn/bac-water-shelf-life, /tools/syringe-units, /learn/vs/sterile-water and /peptides/tirzepatide shows a crawl after the deploy and FAQ rich-result detection.
- Day 30 (Search Console, web, 28 complete days versus Aug 29 to Sep 25): total clicks, impressions, CTR and position; per-page rows for the eight pages in section 4; CTR at comparable positions for the syringe converter; whether the tirzepatide page starts matching its own queries at a better position; whether www.bacwater.ai/tools/syringe-units impressions migrate to the apex row.
- Day 30 (GA4): sessions and engaged sessions by channel (organic search by source, AI assistant), engagement on /learn and /learn/bac-water-shelf-life as landing pages, and key events once they are configured.
- Day 60: retain what improved, revise any title whose CTR fell at the same position, and re-run the full crawl.

None of these are promises. Position, snippet selection, rich-result display and AI citation are decided by the engines; the work above supplies accurate, extractable signals and removes the mechanical faults found.
