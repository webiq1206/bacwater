# Unit controls and homepage order

## Changes

- Removed the redundant catalog product picker from the homepage calculator in commit 51c17a7. The guided product field remains required and is the single selection control.
- Added explicit mg-to-mcg and mcg-to-mg controls to the homepage and full mass converter. Added U-100-to-mL and mL-to-U-100 controls to the homepage and full scale converter.
- Direction changes convert the existing number, preserve the same amount or volume, update the label and formula, and persist in the shared converter session. Clear keeps the chosen direction. Examples match it.
- Added mg/mcg choices to previously fixed mass fields in the reverse, inventory, amount-to-volume, compound, single-product and blend calculators, including individual blend ingredients. Prepared-liquid and known-concentration fields also support mg/mL and mcg/mL.
- Added mL/U-100 choices to the reverse calculator's hypothetical scale reading and the amount-to-volume calculator's measured-volume input. Water-container volumes and product IU remain distinct units.
- Existing guided-plan, schedule and BAC-water unit controls remain available. Existing embedded mass converters already accept both units.
- Replaced the unit accordion with a keyboard-accessible lightbox and exposed it on the homepage calculator and dedicated calculator pages. It explains mg, mcg, mL, U-100, concentration and the distinction between product IU and U-100 scale units. Focus starts at the heading; the definitions scroll independently; Escape closes the dialog and restores focus.
- Moved the research shelf immediately after the hero and its benefit rail, ahead of the toolkit and saved-plan sections.

## Verification

- Regression tests cover exact decimal conversion, bidirectional round trips, zero, invalid input, exponent bounds, partially typed decimals, externally changed or cleared values, and equivalent blend results after mass-unit changes.
- Extended the desktop/mobile hero browser fixture to exercise both converter directions, refresh persistence and unit-dialog focus restoration. Browser fixtures require the existing GitHub Actions browser environment; they were not executed locally.
- The final production build passed, including the full test suite, the rebuilt public embed bundle, TypeScript and 113 generated static pages. The environment has no production database connection; database-dependent reads used existing fallbacks.
- All 64 built-server HTML/image checks passed, including the 50 product routes. Browser-based visual and interaction checks remain for the existing GitHub Actions workflow and the published deployment.

The update does not choose a dose, liquid, ingredient ratio, device or preparation. A U-100 conversion describes the scale relationship only. Publication uses the owner's Replit pull-and-republish workflow.
