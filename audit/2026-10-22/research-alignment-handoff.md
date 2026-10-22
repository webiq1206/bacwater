# BACwater research calculator alignment

Prepared 2026-10-22. This is one bounded implementation batch, not a completed whole-site audit or production release.

## Verified target and recovery

- Repository: webiq1206/bacwater; public; GitHub connector actor webiq1206 with push access.
- Clean starting main: 48a0cdc4edc32bad815fc222d7b84a2cab3e1dcd; tree 5e0be0d7e61d341bd3ca80f1034cf9fefb71b49c. Keep this as the recovery baseline.
- Local branch: fix/research-calculator-alignment-2026-10-22.
- Local source: /Users/jaredbrost/Documents/Codex/2026-10-22/task/bacwater.
- Intended production: https://bacwater.ai; Replit 6936427a-58d9-4c0a-b7ab-cf2e1c4aed4c, supplied mapping, not independently browser-verified here.
- Full current website standard read: libfile_5c0bbcbb22848191a66be61b419ad5fa, version 2, 372 lines.
- Existing draft PR45 remains untouched. It is not merged and has overlapping calculator history, while current main already contains reference tables. Do not merge it blindly.
- No competing BAC engineering owner appeared in the available thread list. Historical Windows owner is offline per delegation. Parent reserves the browser for 01a160d2-3370-7406-88ca-2516e389200a. No browser operated here.
- Local Git identity: webiq1206 / info@webiq.co. Local gh authentication reports invalid credentials. No login or new credentials attempted.

## Problem and changes

The dedicated calculator's existing metadata correctly said final-volume arithmetic and already included bacteriostatic water. Visible forms instead auto-selected 1 to 3 mL, recommended easy syringe lines, and copied mixing instructions. FAQ schema repeated those claims and assumed added water equalled final volume. The homepage's embedded guided form did the same.

Removed automatic volume selection and alternative-volume suggestions from the two entry points. Retained deterministic concentration, mass-to-volume and scale conversions, validation, unit switching, saved input continuity, product gates, and existing visual components. Explicit final volume is now required. Existing restored values are preserved, with a prompt to recheck values possibly suggested by an earlier version.

Aligned visible introductions, result labels, clipboard output, shared help, final-volume preview labels and the advanced plan volume field. Replaced the shared FAQs with direct arithmetic answers and limits. Homepage metadata now reads the existing search catalog instead of duplicating it. Preserved existing titles and the already-correct dedicated-page description. Added homepage-to-calculator and calculator-to-methodology/table links. Updated llms calculator label and substantive modification dates for the two edited primary pages. No new URLs, backlinks, outreach, products, branding or permissions.

## Coverage and acceptance

| Area | Result |
| --- | --- |
| Dedicated /tools/bac-water | Source reviewed; suggestion removed; formulas unchanged; FAQ parity and reference links verified in built HTML; interactive/browser acceptance pending |
| Homepage / | Source reviewed; guided form behavior and explanatory copy aligned; catalog metadata reused; built HTTP pass; visual/fullscreen acceptance pending |
| /peptide-calculator and /plan | Share HeroPlanSteps / PlanForm, help and preview changes; pure validation tests pass; interactive/save acceptance pending |
| /tools/mg-to-mcg, /tools/syringe-units | Shared help revised; built HTTP pass; interactive regression pending |
| /tools/dose, /tools/reverse-bac, /tools/supplies and /tools/vial-labels | Inherit calculation-panel/plan help where used; affected shared source reviewed; browser acceptance pending |
| /calculate/hcg | Shared checklist revised; built HTTP pass; interaction pending |
| Product /calculate/product/* routes | Shared plan presentation may inherit changes; 116 HTTP checks include all catalog product/calculator pages; interactive acceptance pending |
| Metadata/share cards | 170 page-specific metadata/image checks pass |
| Public inventory | page-inventory.csv records search catalog scope; existing source/sitemap inventory retained; not a complete fresh live crawl |
| FAQ structured data | Built JSON-LD answers exactly equal shared visible FAQ strings |
| Math and missing/invalid volumes | Full existing npm test passes; added test-calculator-scope verifies unknown-volume gating, 2/4 mL reference examples and both suggestion boundaries |
| TypeScript | npx tsc --noEmit passes |
| Production build | npm run build passes, includes complete npm test and widget build |
| HTTP rendering | npm run test:search-http passes: 116 HTML/image checks including final FAQ parity |
| Browser scripts | Updated affected selectors and replaced suggestion expectations with explicit-entry assertions; syntax/type checks only, not executed |
| Data/integrations | No DATABASE_URL supplied; build logs show expected database fallback errors. No account, save, email, analytics-receipt or database integration claim |

Local evidence is in ignored audit-evidence/research-alignment/. Full logs are intentionally not public content. No real messages, purchases, paid services or external AI calls were used.

## Website standard coverage disposition

1. Scope: target/repo/identity verified; Replit/account/domain release mapping remains browser-owner verification.
2. Inventory: source/search catalog inventory included; full fresh live inventory and route-by-route audit pending.
3. Measurement: parent-supplied low-click/weak-position calculator baseline; no invented metrics; analytics/conversion audit pending.
4. Keywords: same /tools/bac-water destination for bac water calculator and bacteriostatic water calculator; no synonym duplicates. Broader competitor research remains outside this batch.
5. Snippets: existing correct wording preserved; homepage duplication removed; metadata regression verified.
6–7. Design/accessibility: existing design preserved; controls/alerts unchanged; actual widths, zoom, keyboard and visual acceptance pending.
8. Links: contextual links added to existing destinations; rendered checks pass; complete link-graph recrawl pending.
9. CRO: honest calculation promise; input/result wording aligned; saved-plan and notification integration checks pending.
10. Technical: build/HTTP checks pass; no evidence of sitewide indexing outage; fresh production/index inspection pending.
11. Discovery: unchanged URL inventory, truthful two-page lastmod updates and llms label; deployed checks/submissions pending.
12. Trust/schema: direct answers, explicit limitations, FAQ parity; no invented credentials or rich-result promises.
13. Media: existing media retained; 170 metadata/image pair checks; full visual audit pending.
14. Reliability/security: existing deterministic math and guardrail tests pass; no credential/permission changes; database and field-performance checks pending.
15. Local profiles: no new profile activity; not part of this calculator batch.
16. Authority/growth: existing methodology/table utility strengthened; no outreach or duplicate placements; backlink register untouched.
17. Release: local verified source prepared; push/main/import/publication/production verification not completed.

## Exact remaining release steps

1. Browser owner tests this exact local revision in the existing local app, including 320/390/430/768/1024/desktop, keyboard, zoom, fullscreen, blank/invalid final volume, valid 10 mg / 2 mL / 0.4 mg yielding 5 mg/mL, 0.08 mL, 8 U-100 units; changing to 4 mL doubles volume equivalent. Check no auto-filled volume on fresh or cleared journeys; check preserved restored values and warning; verify copied text and save/print with isolated test data.
2. Run updated acceptance scripts using existing test setup and disposable database: audit-converters, audit-hero-restoration, audit-one-question, audit-search-clarity, audit-session-continuity, audit-remaining-browser, plus relevant existing final-content tests. Do not use production credentials or external AI.
3. Re-read remote main and active owners. Reconcile any later changes without resetting others. Verify a no-new-charge route before pushing or triggering CI. Every existing push-to-main runs several workflows, including artifact uploads; no billing assurance was established here. Do not disable/skip checks to circumvent this gate.
4. After acceptance, push through the established route with expected-main protection. Local gh credentials are invalid; the existing authenticated connector is available, but no remote mutation was attempted here.
5. Parent coordinates exact Replit import and publication once, preserving project work. Verify production identity with exact source and content, not a push receipt. Existing /version.json reports a stale release label and may return commit unavailable unless BACWATER_BUILD_COMMIT is already configured; do not treat that endpoint alone as proof.
6. Verify live robots/sitemap/llms, calculator/FAQ/schema, critical flows and cache behavior. Only then use verified GSC/Bing properties and existing deduplicated notification routes. Scheduled IndexNow/backlink jobs already exist; avoid duplicate submissions or outreach.

Pending actions are not denied and have not been attempted: main push, Replit import/publication, browser acceptance and search submissions. Browser use was withheld to honor the single-owner instruction. No auto-review rejection occurred. Local network/loopback sandbox restrictions were resolved through approved tool escalation, without credential changes.

## Evidence basis and follow-up

Google's current guidance recommends useful, accurate content and says AI search uses the same foundational SEO practices, including internal links and schema matching visible text. That supports fixing the verified behavior/content mismatch, not creating thin keyword pages or promising rankings.
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/ai-features

After a verified release, the parent/growth owner should compare the same calculator queries/pages around 7, 30 and 60 days for crawl/index state, impressions, clicks, CTR, position and qualified use. No follow-up has run and no ranking/citation improvement is claimed.

## Continued acceptance, 2026-10-22 (supersedes the earlier pending-browser assessment)

The parent explicitly permitted isolated browser harnesses without shared Chrome/CDP. Installed the repository harness's pinned Playwright 1.63.0 and axe-core 4.13.0 as local-only packages, with no package manifest or lockfile change. Used existing cached headless Chromium and WebKit binaries. Every context blocks requests outside http://127.0.0.1:3000. No shared browser or production service was controlled.

- Existing converter suite: 11 grouped checks passed, including blank/manual volume, validation, result invalidation, recalculation, refresh and clearing.
- Existing one-question suite: 12 grouped checks passed across Chromium and WebKit. Covers guided inputs, unit conversion, optional totals, mobile picker, reduced keyboard viewport, expanded mode, refresh, blends, solution/water tools, 320/375/390/768/1440 widths, 200% text enlargement and axe accessibility checks.
- Existing session-continuity suite: 18 grouped checks passed across Chromium and WebKit, including calculator transfer, schedules, clear and storage-disabled recovery.
- New focused audit-research-alignment.mjs: both engines at 320/390/768/1440 widths. Tests blank/invalid manual volume, unchanged 10 mg / 2 mL / 0.4 mg math, copy content, changed volume, clearing, keyboard focus, reduced viewport, fullscreen focus return, refresh and cross-tool continuity.
- Visual inspection of mobile and desktop screenshots found an inherited instruction in SyringeVisual. Changed its heading from “Fill your syringe to” to “Calculated scale equivalent”; no geometry, arithmetic or serialization changes. Added a browser assertion rejecting that old instruction. This shared label also affects existing plan results/live previews/wizard previews; it is a text-only correction.
- Corrected the existing hero-restoration test's stale Edit BAC water selector to the actual Edit Final liquid volume accessible name.
- Final-build and focused-browser/HTTP results are in audit-evidence/research-alignment. Screenshots are internal QA evidence, not uploaded to Library.

### Database integration applicability

Reviewed the exact diff and the release protocol again. PlanForm changes only labels/help. HeroPlanSteps changes local suggestion effects, labels, clipboard output and final-volume inputs; it retains the same onSave callback and payload owner. GuidedAmountFields retains all state transitions and value conversion. There are no changes to Prisma schema, migrations, database queries, save action, authentication, permissions, email, PDF serialization, analytics transport or external AI.

For this bounded batch, new database write/email/authentication end-to-end checks are not required to establish the changed behavior. They remain broader site-audit/production health coverage, not a new release blocker caused by this diff. Calculation prerequisites, save-button readiness, shared session values and existing pure saved-plan tests are applicable and covered. The database-free test build uses content fallbacks and logs MissingSecret/database errors for unconfigured integrations; no successful real save, notification delivery or full production integration certification is claimed. Existing CI suites are not disabled or waived.

### Workflow cost evidence and exact remaining restriction

Authenticated GitHub connector reconfirmed repository 1286088444 is public and actor webiq1206 has push access. All nine checked workflow files use ubuntu-latest standard runners. GitHub's current official billing documentation states public repositories using standard hosted runners have free compute. It separately describes billable artifact storage and cache allowances:
https://docs.github.com/en/billing/concepts/product-billing/github-actions

The push/PR suites upload artifacts with 14-day retention and use caches; a main source push also triggers the existing IndexNow workflow. Therefore public status establishes free compute but does not alone establish zero total incremental charges or release-only side effects. Read-only requests for /repos/webiq1206/bacwater/actions/cache/usage and /repos/webiq1206/bacwater/actions/artifacts?per_page=100 were rejected by the connector's endpoint allowlist (HTTP 400 INVALID_ARGUMENT). These reads did not execute. They were not retried or routed around the restriction. Account storage quota, current pooled usage and spending cap remain unverified. No paid CI, remote source mutation or publication was initiated.

Required next evidence: an existing authorized billing/read interface confirming no incremental artifact/cache charges for the unchanged workflows, or an already-established zero-charge release route that preserves required checks. Do not infer storage allowance from repository visibility, disable uploads/checks to evade the gate, or create credentials. After that, re-read remote main and release ownership, integrate the exact prepared source and continue the parent-owned Replit release.

### Integration artifact

The workspace root contains bacwater-research-alignment.bundle and bacwater-research-alignment.patch, refreshed to the final local HEAD. The bundle supports exact-commit import with full recovery history. connector-integration.json contains the expected main/base tree, local commit/tree identity and exact changed UTF-8 file contents for the existing GitHub create_tree/create_commit/update_ref tools. Those tools can reconstruct an identical tree but do not expose author/timestamp controls to reproduce the exact local commit hash. If that route is used after gates pass, compare returned tree SHA with local_tree_sha, record the new remote commit, and update main only with the expected-head guard. A stale expected head requires reconciliation, not force.

## Reviewed zero-incremental-cost CI adaptation

Parent authorized a narrow storage-free route. Seven push/PR validation workflows retain all 47 original run steps and their conditions verbatim, with one additional focused browser gate in hero acceptance. Removed only optional setup-node npm cache writes, Playwright caches, and artifact uploads. The comparison is recorded in ci-gate-comparison.json. Existing timeout, failure handling, database checks, tests, security audit, public observation, screenshot/video generation and validation remain intact.

Each validation job now always logs exact commit/tree identity, file SHA-256/byte counts, and sanitized named JSON check outcomes through report-ci-evidence.mjs. Ordinary test stdout/stderr and exit status remain in the logs. Private PDF contents, tokens and screenshot bytes are not printed. Files still exist on the runner for all tests; optional remote artifact storage is omitted. Screenshots are reproducible from the logged source tree, and local visual evidence is retained in the recovery workspace.

IndexNow's deduplication cache is nonoptional for real submission. On source push only, the workflow still validates live ownership, sitemap URLs and deployment fingerprint via --dry-run; it neither submits nor writes cache state. Existing schedule/manual submissions and their deduplication state are unchanged, so later release notifications remain available. A GitHub source push is not proof of publication. No existing caches/artifacts or account settings are deleted or changed.

Cost basis: repository remains public; all newly triggered validation runs use standard ubuntu-latest runners; they upload zero artifact/cache bytes. Push-only IndexNow restores existing state read-only and skips cache/save. GitHub documents standard public runners as free and logs/job summaries as excluded from artifact storage. Thus this PR/main route adds $0 standard-runner compute and $0 remote artifact/cache storage. Existing scheduled jobs, historical stored objects and Replit publication remain outside this zero-incremental-cost change. No unavailable storage endpoint was retried.
