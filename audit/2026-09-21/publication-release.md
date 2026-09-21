# Publication and editorial repair release

Prepared September 21, 2026. This is a continuation of the merged 103-file repair release (main 5a33ab27b8b5db456c69928824e30a98bed0a3b0), not a fresh audit or a claim that all marketing operations are complete.

## Implemented source

The content editor now has search title, description, noindex and canonical controls. Publication writes use a validated transaction with stale-edit protection, route/alias collision checks and canonical-target validation. A published slug rename creates an ID-based alias, so repeated renames redirect directly to the current slug. Unpublished targets are not redirected into public visibility. Deletion removes aliases. A canonical target with published dependent pages cannot be excluded or deleted until those references are corrected.

Public catalogs, sitemaps and llms.txt share published/indexable/self-canonical CMS inclusion rules. Content publication invalidates site layouts and related excerpts. Dynamic article rendering reflects the current content record. Repository-managed static URLs are protected against ineffective CMS edits: their database copies cannot silently pretend to change the source page.

IndexNow changes are durably queued within the same transaction as content edits. Duplicate paths coalesce; revisions and processing leases prevent an older response from acknowledging a newer edit. The bounded drain verifies the public ownership file, honors retry delays, and distinguishes submitted, accepted, blocked, rejected and failed outcomes. It runs on publishing activity or authorized manual retry, not on an invented scheduled worker. Pending events survive request failure. Delivery is disabled outside the canonical production origin and may be disabled with INDEXNOW_ENABLED=false.

The admin notification endpoint no longer accepts AUTH_SECRET in a query string. GET is read-only. POST requires an authenticated administrator and a same-origin request. The Publishing admin screen shows the actual queue and supports explicit retry. A successful notification is not indexing proof. Remove saved secret-bearing endpoint URLs; assess secret rotation if an old URL was actually used or logged.

Editorial and metadata repairs separate arithmetic from dose/diluent selection, remove unsupported calculated expiry and review claims, and stop emitting static HowTo steps for mutable articles whose visible content may differ. The U-100 converter now has explicit labels, reversible editing, retained values, clear negative-input errors, zero/small-value handling, and no assumed graduation spacing. Homepage, flagship calculator and converter metadata have differentiated purposes without changing established URLs.

/version.json exposes only a non-secret release marker and build commit. Use it to verify the deployed version after publication, not to infer deployment from GitHub status.

## Database and deployment

This second batch introduces additive schema changes: optional SEO fields and default-false noindex on ContentBlock, plus ContentRedirect and IndexNowEvent tables. Existing content retains its current publication/indexability defaults. It does not drop customer records or seed production.

Before publication, retain a production database backup and verify the Replit checkout and origin. The existing Replit deployment applies the Prisma schema without a data-loss flag, then builds. Do not omit the schema step or run production seeds. Deploy the complete matching source/schema revision together. A rollback can retain the additive tables and fields; do not drop them merely to revert application code.

This conversation has not demonstrated a direct Replit shell connection, a Replit pull, or a new production deployment. No Replit Agent prompt or TinyFish run was used for this continuation. GitHub main, Replit checkout and public deployment are separate states.

## Verification contract

Retained tests run only against the guarded localhost PostgreSQL fixture. They cover 14 publication/notification transaction cases, the real CMS lifecycle, a focused bidirectional converter flow, 11 saved-plan/contact/account journeys, private-versus-shared PDF text, and the whole discovered public route inventory. Public-provider submission uses a mocked transport in database tests and is disabled on localhost.

Use the final PR/main GitHub Actions artifacts for observed pass/fail outcomes, dates, screenshots and counts. This document does not substitute a written test plan for executed results. Browser engines and CSS viewports are not physical devices or a WCAG certification.

## Remaining external acceptance

The production schema/pull/publication and production recrawl still require observed execution. Actual IndexNow acceptance requires the canonical host and its ownership file after deployment. GA4 receiving-side settings, Bing account access, production notification receipt and optional provider credentials remain separately unverified. Qualified clinical review of the complete article catalog, physical-device/screen-reader testing, complete individual competitor/content briefs and authorized growth distribution remain open in the master audit scope. Do not mark these complete because the software tests pass.

## Evidence for strategy and consequential choices

The connected GSC baseline through September 19 showed 2,201 impressions and 3 clicks over the returned 28-day window. The longer query/page export contained 743 reported rows. These are observed search data, not a rank guarantee or proof of future lift. Existing URLs were preserved rather than migrated for keyword wording alone.

A September 21 public search review used the exact queries bac water calculator, syringe units mL calculator and mg to mcg calculator. First-party competitor pages reviewed included https://bacwater.help/, https://pepformula.com/, https://www.peppal.app/calculator, https://www.donedose.com/calculators/syringe-calculator and https://humancalculations.com/syringe-units-calculator. The search interface did not expose a controlled device or physical search location, so these are page/feature observations, not measured local ranks. Fast access to arithmetic, visible unit relationships and clear limitations informed the changes. Competitor medical assertions and dosage presets were not treated as evidence of safety or copied.

Primary implementation references checked September 21: https://nextjs.org/docs/app/api-reference/functions/after, https://www.indexnow.org/documentation and https://developers.google.com/search/docs/appearance/preferred-sources. Product-specific storage corrections use https://www.pfizermedical.com/bacteriostatic-water and https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html. Missing publication dates are unknown, not inferred.
