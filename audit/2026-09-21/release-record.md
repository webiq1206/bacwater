# BACwater repair release, September 21, 2026

## Scope and status

This release contains actual source repairs, not a request for Replit Agent to make changes. It is a substantial implementation batch, not completion of every obligation in the Master Website Audit and Implementation Prompt.

Production publication is a separate step. A GitHub push does not prove that Replit pulled the commit or published it. No Replit Agent prompt was used for this continuation. The attempted direct browser inspection of Replit was blocked by insufficient browser-tool credits. No purchase was made and no stale Replit deployment was published.

## Implemented source changes

- Access and privacy: public share links are read-only; owner notes and private names require the account or creation secret; write authorization is enforced server-side; private PDF content is not cached publicly. Signup cannot grant administrator privileges from an unverified email allowlist. Stored roles are rechecked, invalid sessions cannot enumerate plans, and each admin page checks authorization before reading records.
- Calculations: validate finite inputs and frequency boundaries; preserve blend data on edits; correct the small-volume dilution warning; remove inferred treatment schedules and unsupported storage/expiry calculations. User-entered instructions remain the basis for the arithmetic.
- Forms and navigation: accessible control names, keyboard-reachable overflow tables, mobile safe-area behavior, menu Escape/focus handling, recoverable form errors, clear disabled Save states, advanced-mode save confirmation, and narrow-screen action wrapping.
- Support: contact success reflects an actual stored record; request IDs prevent duplicate records; retries do not invent delivery. No real customers were contacted by tests.
- Crawling and content: permissive wildcard public crawler policy with private restrictions; safe JSON-LD/Markdown serialization; failure-aware public catalogs, XML sitemaps and llms.txt; publication cache invalidation; corrected storage reference and stale commerce claims.
- Analytics: optional collection is disabled until receiving-side manual configuration is verified; consent, sanitized page categories and private-route exclusion are implemented. Clarity replay is not enabled by this release.
- Dependencies: reviewed patched versions and removal of unused packages. The September 21 test dependency report found zero known advisories. This is not a guarantee that the application has no security defects.
- Deployment: npm lockfile is authoritative; Replit builds and the post-merge hook use npm ci. Production seeds are not part of the deployment. No database schema change was introduced by this release.

## Evidence and acceptance

Baseline source: 349aef4d4171388540b79159755bf06b75a8f57e. Recoverable baseline source, production HTML and screenshots were captured before edits.

The baseline covered 90 discovered public/utility URLs, 180 primary renders and 63 additional viewport/engine checks. Thirty-five URLs had automated accessibility findings. The repaired test crawl cleared those findings. A separate 320-pixel homepage action overflow was then repaired.

The retained CI checks TypeScript, five assertion suites, production build, known dependency advisories, 11 application journeys, owner-versus-shared PDF text, every discovered public page, structured-data parsing, missing-route status, and responsive browser engines. Review the final commit's GitHub Actions artifacts for exact outcomes. Captured fixture data uses example.test and an explicitly guarded disposable PostgreSQL database, not production customer records.

The journey checks cover guest saving, stored arithmetic, owner notes, unauthorized action replay, shared read-only access, PDF responses, deduplicated support records, signup and plan claiming, role changes, and deleted-session isolation.

Browser scope: Chromium at 390 and 1440 CSS pixels across the known inventory; shared-template checks at 320, 375, 430, 768 and 1024; Firefox and WebKit engine checks. This is engine/viewport emulation, not physical iPhone or Android testing. Automated results do not establish WCAG conformance. Core Web Vitals field performance and a complete screen-reader/manual-state audit are not certified.

## Search and integration baseline

Authorized GSC property: sc-domain:bacwater.ai. The 28-day summary through September 19 returned 3 clicks, 2,201 impressions, 0.1363% CTR and aggregate average position 38.8081. The longer query/page request returned 743 privacy-filtered rows. Query rows do not necessarily reconcile to property totals. URLs with search impressions are not a substitute for URL Inspection indexing results.

GA4 receiving-system access was not connected to the available account; Bing Webmaster credentials and Ahrefs access were not available. Do not claim those integrations were fully verified. Before enabling analytics, verify the intended GA4 property and disable automatic Enhanced Measurement/history/form collection, user-provided data and advertising signals. Confirm only sanitized manual events arrive. Keep NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED=false until that is done.

## Remaining master-audit work

The master document maps 115 parent B/T/S/E/G/I/C requirements. Parent mapping is not completion of their compound obligations. The following remain open rather than being renamed done:

1. Direct Replit Git synchronization, publication and production recrawl with an observed deployed commit.
2. Full individual keyword/competitor briefs and thin-content review for every intended landing page. Shared/template repairs do not certify each article's clinical accuracy.
3. Qualified review of medical-adjacent content, privacy interpretation and remaining formulation-specific claims; verified reviewer identities must be supplied, not invented.
4. Complete CMS create/edit/rename/noindex/canonical/unpublish/delete lifecycle fixtures and event-driven IndexNow delivery. Failure handling and invalidation are implemented, but this complete lifecycle is not certified.
5. Receiving-system analytics, production support/notification receipt, optional AI/OAuth provider checks, physical-device and screen-reader tests, field performance and operational monitoring ownership.
6. Complete external profile/citation/backlink research and applicable growth production/distribution. All 28 G playbooks remain distinct in the handoff operating record. Prepared scripts, prompts and pitches are not published assets or sent outreach. Real reviews, credentials, videos, creator agreements and news must not be fabricated.

GBP/local-service creation is not justified by an online-only free calculator. No fictitious location, service area, customer testimonial or product offer was created. Reassess only with verified eligible business facts.

## Research used for consequential corrections

Checked September 21, 2026:

- Pfizer product labeling: https://www.pfizermedical.com/bacteriostatic-water. Storage for that specific water product, not a universal mixed-product shelf life.
- CDC injection safety: https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html. Opened multi-dose vial guidance and manufacturer exceptions.
- GA4 manual pageviews: https://developers.google.com/analytics/devguides/collection/ga4/views. send_page_view=false alone does not disable Enhanced Measurement history events.
- Next.js maintainer advisory: https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4. Patched framework dependency decision, supplemented by the actual npm audit report.

## Deployment and rollback

Verify the Replit checkout is clean, confirm its origin is webiq1206/bacwater, fetch and fast-forward main, then publish through the normal deployment controls. Never overwrite unrelated uncommitted work. Keep AUTH_SECRET stable, retain the pooled production database connection, and do not run seed data.

After publishing, compare the deployed source identity, run the public crawl against https://bacwater.ai, and use controlled accounts for production-safe critical flow verification. An unchanged public page is not proof of the new release.

Retain the last deployment for emergency rollback, but prefer a targeted repair because the baseline contains known access and dependency defects. This batch introduces no production data migration to reverse.

Resume checkpoint: begin with the final main commit and this release's CI evidence, not a new baseline audit. Resolve the six open categories above and retain blocked/external statuses. No future check, outreach, scheduled job or Replit publication is claimed by this document.
