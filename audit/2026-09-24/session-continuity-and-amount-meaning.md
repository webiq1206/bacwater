# Shared calculator session and explicit amount meaning

## Scope

This change addresses the homepage-to-product data loss and the ambiguous amount/schedule step. It builds on remote main 070f21e76c996672d91934fe4fa0593f1b1d13eb. The approved hero, product catalog and SEO metadata remain in place. No database schema, dependency, lockfile or deployment configuration is changed.

## Data ownership

Compatible mass calculators share a single versioned browser-tab draft: vial amount and mass unit, final volume, entered amount and unit, whether that amount is each time or the whole week, explicit weekly count, selected product, current guided step, device scale and entered date. Writes happen synchronously before navigation, not in delayed per-page save effects. React reads a stable empty server snapshot and subscribes to browser updates.

Only fields with the same meaning are transferred. Standalone mass conversion and U-100 conversion have their own shared converter records, not the vial's mass. Water supplies, ready-made solutions, blend ingredients, sample volumes and hCG activity IU retain separate records. Switching a mass product retains numbers but asks the visitor to check the new label. Clearing a converter does not clear the vial. Saved-plan editing is isolated from the active session.

The old hero draft can be imported from the same tab. Device-wide localStorage plan drafts are not imported. Normal same-tab navigation and reload use sessionStorage; when storage is denied, the current document remains usable in memory. Browser tab duplication and session restoration follow browser behavior. Only an explicit Save action writes a plan. Private notes, ownership tokens, account identity and search terms are not added to the shared calculation record.

## Amount semantics

The visitor chooses Amount each time or Total for the week. The same typed number is retained when they clarify its meaning. Frequency is optional for an each-time amount. A weekly total requires an explicit whole count before a per-time amount can be shown. No frequency is inferred from the product.

Arithmetic-only example: 4 mg each time, twice a week, totals 8 mg per week. A total of 4 mg for the week, split twice, is 2 mg each time. The summary and copied result state that distinction. Frequency does not change concentration. Changing mg to mcg preserves mass, not just the text of the unit.

New saved snapshots retain amountBasis and whether a frequency was actually entered in the existing JSON data field. Legacy snapshots without amountBasis keep their prior weekly-split arithmetic. Existing saved calculations are not silently rewritten.

## Validation and verification

The added pure session/schedule suite covers 18 grouped cases. Offline Chromium component fixtures use actual React components and CSS with mocked Next navigation and storage adapters. They cover the 40 mg / 2 mL transfer, product choice, each-time/weekly/daily meanings, returning to the hero, guided progress, storage reconstruction, clear behavior, unit isolation, saved-edit isolation, storage denial, four widths and enlarged text.

The real-router `audit-session-schedule.mjs` suite is added to the existing browser workflow. It is separate from the offline fixtures. Local execution of a browser against the Next server was blocked by an administrator policy, so that end-to-end run is not claimed locally. No browser policy was changed. The local Next build used fallback fonts because external fonts were unavailable, and no test database service was available. Database-backed account/save/PDF acceptance, normal production fonts, real mobile keyboards, screen readers and live deployment still require the normal CI/deployment environment.

References: React useSyncExternalStore documentation; MDN Window.sessionStorage documentation; W3C WAI Multi-page Forms tutorial. These inform implementation, not a claim of accessibility certification or clinical validation.
