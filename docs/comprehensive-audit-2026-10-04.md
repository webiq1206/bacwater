# BACwater audit and release coverage — October 4, 2026

## Revision and scope

- Published `/version.json`: `e7692397f69c080fd72e43fc84f51a8246814b67`, release `2026-09-23-calculator-first-design`.
- Reconciled GitHub main: `d3b52ce55a8bf4553412e28ffbc388c0c2314e14`. Only three automated backlink evidence files changed since the previous main; merged those records into PR37 without conflicts.
- Existing PR37 fixes remain unpublished. Preserve the research-only content, brand, saved plans, privacy boundaries, and calculator functionality. No Stripe work.
- This is a checkpoint, **not a completed live desktop/mobile audit or a production-readiness declaration**.

## New defect and correction

The shared formatter removed exponent zeros when JavaScript `toFixed` returned scientific notation. Reproduction: `formatNumeric(1.25e30, 8)` returned `1.25e+3`. The fix trims only the fractional mantissa and preserves the exponent. The same formatter is used by calculation results, summaries, capacity warnings, labels and exports.

Regression coverage includes positive/negative exponent boundaries, small nonzero values, nonfinite values, precision choices, shared display consumers, and a complete planner calculation whose allowed input ranges produce a large result. Existing amount/capacity warnings stay intact. No calculation formulas or suitability thresholds changed. Independent review is required for this material display correction and the pending PR's restored-state change before merge.

## Live HTTP inventory

`audit-2026-10-04-http.csv` records every URL discovered from the live sitemap and public links, plus known non-indexed public routes. Capture finished **2026-10-04 13:46:48 UTC**: **249 URLs returned 200**, zero remaining URLs. This includes **248 HTML URLs and one linked MP4**, not 249 independent page designs. All HTML documents had one H1. Four deliberately missing routes returned 404. Sitemap index, its three children, robots, llms and version endpoints returned 200.

Raw HTML and the full HTTP receipt are retained in the local `bacwater-live-http-20261004/` artifact directory, outside Git. HTTP reachability and server-rendered text do not prove hydrated interactions, visual layout, keyboard behavior, downloads or authentication. A protected route redirecting to a sign-in page is not a successful signed-in journey.

## Page, component and journey inventory

The adjacent source-route inventory lists all page templates, including protected templates. The URL CSV expands discovered public dynamic routes and filter states. Dynamic customer plan IDs are intentionally excluded from live crawling.

| Family / component | Routes or variants | Required journeys and available isolated coverage |
|---|---|---|
| Website navigation and landing | `/`, `/about`, `/tools`, `/compare-calculators`, `/sitemap` | Header/menu, footer, search, calculator entry, back/forward; master-audit, sitewide-design, search-clarity |
| Guided and all-at-once planner | `/peptide-calculator`, `/plan`, `/plan/new`, homepage hero | Product choice, custom product, mg/mcg, each/day/week and count, final volume, syringe options, review/edit/reset, interrupted session restoration; hero-restoration, session-continuity, plan-preview, remaining-browser |
| BAC concentration | `/tools/bac-water` | Known volume vs explicit math example, optional amount, invalid/incomplete/zero/negative, edit/recalculate, reload/reset; converters |
| Amount / volume | `/tools/dose` | Both directions, concentration override, mass/scale switches, shared amount semantics, blank/invalid/boundary/reset; remaining-browser, unit-switching, session-continuity |
| Reverse concentration | `/tools/reverse-bac` | Mass, per-time amount and U-100/mL equivalent, unsupported results, clear; remaining-browser, unit-switching |
| Inventory arithmetic | `/tools/supplies` | Whole count, whole portions, optional volume, amount larger than vial, fractional boundaries, clear; remaining-browser, calculation unit tests |
| Exact mass conversion | `/tools/mg-to-mcg`, homepage converter | Both directions, decimal/exponent bounds, partial/invalid text, zero, repeat clear, route/reload continuity; unit-switching, remaining-browser |
| U-100 / mL conversion | `/tools/syringe-units` | Both directions, scale/capacity distinction, zero, negative, small decimals, exponents, persistence and clear; converters, unit-switching |
| Compound references and IU | `/peptides`, `/peptides/compare`, `/peptides/[slug]`, `/calculate/[slug]` | Reference entry, mass product vs HCG activity IU, no IU/mass carryover, invalid values, reset; product-catalog, session-continuity, remaining-browser |
| Supplier product calculators | `/calculate/product/[id]` | Single mass, premixed total, individual blend ingredients, ready-made solution and named ingredient, water/container inventory; product-catalog, product-calculation tests |
| Product discovery | `/recommendations`, `/products/[id]`, `/preferred-source`, `/research-finder`, `/search` | Search/filter/picker, correct product links, disclosures, modal dismissal and focus, reopen; product-search, affiliate-directory, sitewide-design |
| Education | `/learn` and filters, `/learn/[slug]`, `/learn/vs/[topic]`, glossary and static guides | Article/index links, comparison diagrams, relevant calculator links, content clarity, search; final-content, master-audit |
| Utility / sharing | `/embed`, `/share-tools`, `/tools/vial-labels`, `/plans/labels` | Copy, share dialog, download/print/label, units and privacy; remaining-browser, journeys, embed tests |
| Support and policies | `/contact`, `/faq`, `/methodology`, `/editorial-policy`, `/disclaimer`, `/privacy`, `/terms` | Read content, links, invalid form, validation and retry. Contact persistence tested only with synthetic local records; no live submissions |
| Accounts | `/signin`, `/signup`, `/forgot-password`, `/reset-password` | Validation, expiry, recovery, account isolation; disposable DB recovery and journey suites. No live account/mail writes |
| Saved plans | `/plans`, `/plan/[id]`, edit and label variants | Guest save/claim, owner notes, stranger read-only, private PDF, delete/undo and reload; isolated journeys/remaining suites. No customer records accessed |
| Admin / publication | `/admin` and child pages | Access boundaries, editorial lifecycle, publish/unpublish; disposable DB/browser suites only. No production admin state changed |
| Shared calculator workspace | All standalone tools | Help close/return/Escape, search and research dialogs, focus return, action reachability, repeated clear, header/sticky overlap; workspace-research, calculator-focus/reflow |

These are test-suite mappings, not a claim that every listed combination was newly executed. Final-head CI receipts must accompany release review; historical CI green at `546d8ac` is insufficient for the new head.

## Responsive and accessibility matrix

Existing isolated browser coverage includes Chromium and WebKit at 320×568, 375×812, 390×844, 430×932, 768×1024, 844×390 landscape, 1024×768 and 1440×900, plus enlarged text. Master-audit adds public-template Chromium/Firefox/WebKit checks; focus/reflow suites check keyboard focus, scrolling, 200% text/spacing and action geometry. These are browser-engine viewport tests, **not physical phones**. Native on-screen keyboard, real-device pinch zoom, assistive-technology behavior, and every calculator option across every viewport remain unverified unless explicitly evidenced.

Current live interactive coverage is blocked. No screenshot-only or desktop-only result is promoted to a mobile pass. The app's visualViewport handler is source evidence only until its real keyboard behavior can be observed.

## Access and release gates

The one newly authorized retry to open `bac-release-preflight-20261003` on `direct_local_121594732146065532` at `https://replit.com/@webiqco/BAC-Water` was rejected before execution. Automatic review said the general BACwater audit authorization did not authorize shared authenticated browser/session effects. No alternate route or another session was used to bypass it; the active P5 session was preserved.

Required next steps:

1. Obtain independent review of the formatter fix and pending state restoration; confirm final-head tests/typecheck/build/browser checks. This repo has no separate lint script/configured lint workflow; do not claim an unrun lint pass.
2. Once that review passes, update main as authorized, preserve latest remote changes and verify main's exact CI.
3. Resolve the specific shared-browser access approval. Inspect BAC Water Replit origin/head/dirty state and runtime binding; preserve any divergent work, confirm source recovery and production DB backup before import.
4. Import exact GitHub main, do not run old schema-pushing hooks, seeds or Replit AI. Publish only the correct app `6936427a-58d9-4c0a-b7ab-cf2e1c4aed4c` after preflight.
5. Verify the published version and perform actual desktop/mobile public journeys and visual review, including the reported reset obstruction, restoration, supported calculator types, and small-screen/landscape behavior. Do not submit live forms without applicable authorization.

Production DB backup/binding, authenticated workspace parity, comprehensive live interactions and final deployment are still unresolved. No paid provider calls, credential changes or production writes were made by this audit checkpoint.
