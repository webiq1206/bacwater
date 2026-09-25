# Session handoff and clear amount schedules

Base: main 070f21e76c996672d91934fe4fa0593f1b1d13eb.

## Changes

A tab-scoped external store now synchronously retains the active mass, unit, final volume, entered amount, amount basis and user-entered frequency. Homepage, product calculators, guided/all-at-once plans, compound tools and related arithmetic tools read compatible values from this record instead of conflicting local-storage drafts. A selection notice asks users to check the new label. Matching hero and standalone converters share their own session entries. Distinct meanings, such as product IU, water-volume counts, ready-made solutions and per-ingredient blends, are not mapped onto mass-based dose fields. Returning to a mass calculator restores the last mass context. Saved-plan edits do not overwrite the active session. Dates and optional blend details are scoped to the selected product.

The amount question now separates an amount for one time, a whole-day total and a whole-week total. Frequency choices include no schedule, once/twice/three times weekly, daily and multiple times daily, plus a blank custom count. The preview states the amount each time and the weekly total. Daily and weekly totals require a compatible explicit frequency. Per-time amounts are never divided merely because frequency changes. Daily schedules that change by day need separate calculations, not an averaged guess.

Unit changes preserve mass. Raw input text remains distinct from validated arithmetic. The existing save contract receives a normalized weekly total and count, retaining the same per-time result without a database migration. There are no prescribed amounts, implied dilution instructions or product-derived schedules.

## Verification

TypeScript, the existing unit suites and design suites passed locally. A new suite passed 23 groups covering schedule arithmetic, all supported single-product handoffs, unit changes, refresh reconstruction, incompatible form boundaries, malformed storage, blocked storage, clear semantics and the saved-plan adapter. Seven changed/new browser scripts pass syntax checks. The new browser journey is wired into the retained browser workflow.

Production build did not complete in this execution environment: Next's font loader could not resolve Google Fonts. Local Chromium also denied navigation to the authorized localhost test server, so no new UI screenshots, interactive browser passes or physical-device claims are made. These boundaries are not bypassed. Browser acceptance and the normal production build still need to run with authorized network/browser access before calling the release fully verified.

The package is a locally committed release candidate, not a remote GitHub push or Replit publication. No production database actions, schema changes, dependencies, lockfile edits, publishing-safety edits, supplier account actions or paid tracking changes were made.
