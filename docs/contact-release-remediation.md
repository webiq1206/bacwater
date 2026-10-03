# Contact release remediation (2026-10-03)

The contact page adds the verified support mailbox. Existing browser checks then exposed a calculator obstruction and assertions left behind by prior interface changes.

## Product and import changes

- Calculator workspaces render their research-assistant entry point after the calculation in normal document flow. The global fixed launcher is absent on these routes. This preserves the assistant without covering Clear inputs, fields or the action dock.
- Calculator headers wrap their controls and constrain their grid column at narrow/enlarged sizes. The prior clipped header could scroll the fixed workspace horizontally when Help received focus, shifting privacy content out of view. Search retains its accessible name in compact form. Existing privacy geometry/choice assertions remain, with added header-control geometry checks.
- Compact product-toolbar spacing keeps its two actions on one row on ordinary phones, bringing the first calculation field back into the first screen while preserving 44px touch targets, labels and disclosures.
- The post-merge hook installs dependencies and generates the Prisma client only. It performs no schema push, migration or seed in development or deployment. Production schema changes still need a separately reviewed target and backup.
- No schema, consent, tracking, privacy, arithmetic or payment behavior is changed.

## Assertion reconciliation

- `research-hero.tsx` and `hero-calculator.tsx`: the homepage contains a working calculator with an Expand button and full-screen dialog, replacing the old Open calculator link. Keep first-screen geometry and actual navigation/interaction checks.
- `hero-plan-steps.tsx`: the early preview shows liquid per time and scale units; concentration is displayed on the completed review step. Assert the exact early preview (0.1 mL and 10 U-100 units), then retain the 20 mg/mL concentration assertion on the destination product calculator. Keep the shared step unchanged for the subsequent planner handoff.
- `peptide-calc.tsx`: amount/schedule fields are always expanded. Assert that the field is visible instead of seeking a removed disclosure. Product calculators still retain their disclosure and its tests.
- The U-100 converter's negative-value message is “Enter zero or a positive value.” Keep the alert role and empty-result assertions.
- Product pages use `ProductBuyLink` in their sources/purchasing section. Verify its exact attributed destination, sponsored relationship and no-referrer policy instead of seeking the superseded label.

## Added verification

`audit-workspace-research.mjs` exercises ordinary pointer clicks, clearing twice, assistant opening/closing, focus return and preserved values in Chromium/WebKit at 320x568, 375x812, 390x844, 430x932, 768x1024, 844x390, 1024x768 and 1440x900, plus 320x568 with 200% text and expanded spacing. Requests remain restricted to the disposable localhost origin.

`test-post-merge.sh` executes the import hook against fake npm/npx commands that reject every invocation except dependency installation and client generation, in both deployment contexts. It never touches a database.

Full exact-head CI must finish successfully before release. Preserve the prior source and verify the actual Replit workspace, production backup and deployment SHA before import/publication. Do not run the old hook during reconciliation.
