# Live calculation preview and unified search

## Scope

Fix the all-at-once calculation sidebar and remove redundant public-header entry points. Preserve exact partner product names, original catalog images, affiliate URLs, calculator sessions and saved-plan isolation. No dependency versions, lockfile, schema or deployment configuration changes.

## Root causes and changes

The previous sidebar showed one placeholder until product, vial, measurement amount and final volume were complete. Its message omitted the final-volume requirement. The example-volume option prevented readiness, and the form-column styling did not keep the result panel sticky inside the calculator workspace.

The replacement preview reads the same current fields and deterministic calculation as the save action. It shows entered and missing fields immediately, calculates concentration from validated vial and final-volume values, and shows measurement results only when all dependencies are valid. Clearing or invalidating a field removes dependent results. The final volume now comes only from the user's instructions. Incomplete blends remain unsavable.

A desktop sidebar follows its actual scrolling container and sizes itself above the save dock. On smaller screens it becomes an expandable panel with a persistent View calculation action. Details include the exact product, entered values, selected scale, concentration, measurement count, schedule, device diagram, warnings and the existing complete result view.

One labeled Search action replaces the Research supplies link, separate product-search button and bare magnifier in the main header. The same search works in calculator workspaces and mobile headers. Products, calculators, guides and references share one input. The Products filter uses the existing local visual finder and research-detail panel. Browse all products provides a direct route to the directory. Product details preserve search text and focus when closed.

## Executed local checks

TypeScript, the complete existing unit suite and production builds passed. Added 23 grouped unit tests for progressive states, strict numeric inputs, missing volumes, unit conversion, weekly/daily totals, device scales, incomplete blends, hydration and deterministic results.

The isolated production-build browser suite passed all six configurations: Chromium at 1440, 1024, 390 and 320 pixels, plus WebKit at 1440 and 390 pixels. It exercised empty/partial/complete previews, edits and clearing, invalid inputs, unit conversion, weekly splitting, scale changes, refresh, mode switching, sidebar stickiness, mobile controls, the save dock, unified search, product details and directory navigation. No runtime errors, horizontal overflow or automated accessibility findings were reported. Desktop partial/ready screenshots were visually reviewed.

The existing live-product-search suite has been adapted to the single search entry and retained in CI. The new preview suite runs immediately after it. Repository-wide build, consent, hero, content and browser/privacy checks still run independently.

## Boundaries

Tests use a disposable local database and browser emulation, not real visitor data or physical-device certification. Supplier purchases, merchant-side credit and Replit publication are not claimed. Final CI results and release commit are recorded in the pull request.
