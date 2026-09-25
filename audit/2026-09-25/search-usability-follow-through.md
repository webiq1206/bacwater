# Search and usability follow-through

Date: September 25, 2026. Baseline: e08b3a41aa9b14e5d83328e930489dbb60fb7a9c. Site: https://bacwater.ai. Business model: free calculation/reference utilities with disclosed research-product affiliate links. GitHub main updates are authorized; production publication remains with the owner in Replit.

## Prioritized implementation record

| Priority | Issue and affected URLs | Change | Acceptance and status |
| --- | --- | --- | --- |
| P1 | Homepage primary action below a small phone screen | Place the existing action before the live calculator, matching DOM focus order. Retain viewport-filling hero minimum height without clipping enlarged content. | Implemented. Existing Chromium/WebKit eight-width CTA, live calculator and reflow tests must pass. |
| P1 | Useful conversion content requires opening Help on /tools/bac-water, /tools/mg-to-mcg, /tools/syringe-units | Render reference content once, below the active calculator, in the normal scrolling workspace. Keep optional supply guidance in Help. | Implemented. Check all three routes at 320, 390, 768 and 1440 CSS pixels in both browser engines; verify server HTML and retained calculator interaction. |
| P1 | U-100 page does not answer the conversion immediately | Put the 100-to-1 relationship in the opening, extend the table, explain 0.5 mL conversion and why mg needs concentration. Add a contextual known-concentration link. | Implemented. Preserve illustrative-value labels and U-100-only scope; verify 25 units gives 0.25 mL. |
| P2 | Mass converter's opening omits its defining relationship | State 1 mg = 1,000 mcg and both arithmetic directions. Preserve exact decimal conversion and input persistence. | Implemented. Existing arithmetic suites retained. |
| P2 | Homepage storage card sends visitors to a general limits article | Link the storage question directly to /learn/bac-water-shelf-life with a descriptive title and summary. Other limits links remain. | Implemented. Stable URLs retained; no redirect or index-policy changes. |
| P0 release | Main and production differ | Push the verified batch to main and inspect automated workflows. Owner pulls and publishes only after reviewing acceptance. | Production remains pending. Do not attribute GSC changes to unpublished code. |
| P2 measurement | CTR interpretation requires rank and query context | Retain the private GSC baseline. Compare equivalent page/query/device/country cohorts and actual qualified events where receiving access exists. | Analysis complete for retrieved data; GA4/CRM receiving access remains blocked. Optional analytics stays disabled. |

Shared component change: CalculatorWorkspace gains an optional reference slot. It is supplied only on the three listed tool URLs. Other workspaces retain their existing behavior. Homepage CSS change affects only the homepage shared hero. The guide-card change affects only the homepage. No private data, raw GSC exports or account details are included in this repository.

## Research and reasoning

Reviewed September 25 using web retrieval, without a controlled geography/device or a claim of fixed rankings. Intent: U-100 syringe units to mL conversion. Three competing destinations were inspected:

- https://www.peptidetables.com/tools/units-to-ml: conversion tables and reverse-direction explanations.
- https://www.donedose.com/calculators/syringe-calculator: answer-first opening, converter and common questions.
- https://pepprep.net/guide/units-to-ml: concise explanation and related reference paths.

The useful content pattern is a direct answer, working tool, transparent arithmetic and relevant follow-up. Competitor medical instructions were not adopted or treated as evidence. The added examples are arithmetic and do not prescribe a dose, diluent, device or administration method. No medical authority, review credentials, product results or stock claims were invented.

Official guidance reviewed:

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

Platform guidance supports crawlable links, useful textual content and accurate structured data. Moving this site's tool reference out of Help is a site-specific usability improvement, not a claim that accessible collapsed content cannot be indexed. FAQ rich-result eligibility, ranking gains and AI citations are not promised.

## Verification and release checkpoint

Before publication: complete TypeScript/build, metadata/image tests, built-server HTTP checks and the existing five GitHub workflow gates. The browser additions cover the exact three affected reference pages and retain all previous assertions. Existing tests are not weakened to conceal the mobile CTA regression.

Production is not updated by a GitHub push. After the owner pulls main and publishes in Replit, verify /version.json, the homepage at small widths, all three calculator references, retained input and Help behavior, the branded favicon and generated images. Recheck submitted sitemaps and selected canonicals. A successful request or 200 response does not prove indexing.

## Follow-up

Owner/SEO reviewer: review production crawl and appearance after about 7 days; compare complete 28-day cohorts after about 30 days; review qualified outcomes, page utility and AI accuracy after about 60 days. The experiment hypothesis is that clearer answers and easier access to tools reduce friction for relevant visitors. Primary outcome is qualified calculator use where correctly measured, with search clicks at comparable positions as a supporting metric. Guardrails are calculation accuracy, privacy, mobile usability and factual copy. Current sparse traffic does not support a confident controlled CTR lift estimate; use usability evidence and descriptive comparisons. Retain helpful clarity, revise demonstrable problems, and do not scale unverified claims. No recurring jobs, external posts, outreach or spending are created.

Related records: [Search appearance](search-appearance.md), [full audit task list](../full-audit-task-list.md), [scope checkpoint](checkpoint.md). The private GSC export and page/task handoff remain outside GitHub. This batch does not certify every original audit requirement, live CMS record, physical device or receiving integration.

Local verification: TypeScript passed; production build passed; 98 metadata/image combinations, 11 built-server HTML/image checks, the calculation suite and six audit-improvement checks passed. The isolated build does not certify live database content. Sitemap last-modified dates were updated only for the homepage and the three substantially changed tool pages, using a fixed editorial change date rather than request time.
