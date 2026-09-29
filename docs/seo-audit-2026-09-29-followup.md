# SEO, AEO, GEO and CRO follow-up: 2026-09-29

This follow-up reconciles the earlier audit with the latest approved BAC Water homepage. It preserves existing URLs, content, metadata, product artwork, calculator behavior and the recent design. The private owner report retains the full 138-page intent map and refreshed analytics baseline; analytics exports and synthetic record identifiers do not belong in this public repository.

## Priorities and decisions

1. Resolve measurement administration before interpreting conversion rates. The current GA4 stream has the wrong default domain and automatic enhanced measurement remains enabled. The connected authorization permits reads but not edits. Keep the manual analytics readiness gate disabled until administration and safe event receipt are verified.
2. Correct two reproduced accessibility defects without altering the design. Carousel slides used an ARIA role that is invalid on an article element. The illustrative saved-record container had an accessible name without a supporting role. Use named groups for both.
3. Monitor the existing converter and learning-page search appearances after recrawling. Their recently updated titles and descriptions should not be rewritten again on the same day without new evidence.
4. Obtain Clarity access, a verified notification destination and approved account-test credentials before claiming full behavior, email delivery or account-recovery verification. Partner checkout remains an external journey.

## Evidence and validation

- The live sitemap contains 138 canonical indexable URLs. HTTP crawling verified 131 sitemap URLs; rendered-browser requests verified the remaining seven, including a transiently failed compound URL and six filtered learning collections. All 138 returned 200. Requests rejected by the execution network proxy are classified as audit-path failures, not site errors.
- Fresh successful HTTP responses retain unique titles/descriptions, one H1 and self-canonicals. The seven browser-verified pages also expose the expected title, description, canonical, H1 and indexing directive. Existing metadata and structured-data tests pass.
- Public robots directives permit relevant search and AI crawlers, retain protected-path exclusions and advertise the sitemap. A rendered-browser request to an unknown page returned a real 404 with noindex.
- A live mobile arithmetic journey at 390 px produced 3 mg/mL and 0.1 mL / 10 U-100 units for the synthetic 12 mg, 4 mL and 0.3 mg example. Resizing to 1440 px preserved the result. These are test values, not product instructions.
- A single unthrottled mobile browser sample reported LCP 392 ms, FCP 392 ms, TTFB 131.8 ms and CLS 0. INP was unavailable. This is a session observation, not field Core Web Vitals or a representative mobile performance benchmark.
- The production build, required prebuild suite, tracking tests and 165 metadata/image checks passed. The local build has no production database and logs expected database-unavailable fallbacks. Production data and database-dependent journeys require live verification.
- The same-day earlier audit already exercised anonymous save, PDF, labels and a labeled contact submission. This follow-up does not present those earlier observations as newly repeated tests.

## Remaining verification boundaries

Google/Bing index coverage and visibility can change only after recrawling and sufficient traffic. Consent-based analytics, AI referrals and outbound partner clicks are not proof of citations or purchases. No fabricated authors, reviews, ratings, local locations or credentials were added. No speculative AI files, keyword padding or duplicate landing pages were introduced. A later qualified expert review of research content is still appropriate; source links alone do not constitute scientific validation of every claim.

The complete earlier audit and primary guidance remain in `seo-audit-2026-09-29.md`.
