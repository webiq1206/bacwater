# Contact release remediation (2026-10-03)

The contact page adds the verified support mailbox. Existing browser checks then exposed a calculator obstruction and assertions left behind by prior interface changes.

## Product and import changes

- Calculator workspaces render their research-assistant entry point after the calculation in normal document flow. The global fixed launcher is absent on these routes. This preserves the assistant without covering Clear inputs, fields or the action dock.
- The post-merge hook installs dependencies and generates the Prisma client only. It performs no schema push, migration or seed in development or deployment. Production schema changes still need a separately reviewed target and backup.
- No schema, consent, tracking, privacy, arithmetic or payment behavior is changed.

## Assertion reconciliation

- `research-hero.tsx` and `hero-calculator.tsx`: the homepage contains a working calculator with an Expand button and full-screen dialog, replacing the old Open calculator link. Keep first-screen geometry and actual navigation/interaction checks.
- `hero-plan-steps.tsx`: the early preview shows liquid per time and scale units; concentration is displayed on the completed review step. Complete that step before asserting concentration, preserving the original arithmetic expectation.
- `peptide-calc.tsx`: amount/schedule fields are always expanded. Assert that the field is visible instead of seeking a removed disclosure. Product calculators still retain their disclosure and its tests.
- The U-100 converter's negative-value message is “Enter zero or a positive value.” Keep the alert role and empty-result assertions.
- Product pages use `ProductBuyLink` in their sources/purchasing section. Verify its exact attributed destination, sponsored relationship and no-referrer policy instead of seeking the superseded label.

## Added verification

`audit-workspace-research.mjs` exercises ordinary pointer clicks, clearing twice, assistant opening/closing, focus return and preserved values in Chromium/WebKit at 320x568, 390x844, 430x932, 844x390 and 1440x900, plus 320x568 with 200% text and expanded spacing. Requests remain restricted to the disposable localhost origin.

`test-post-merge.sh` executes the import hook against fake npm/npx commands that reject every invocation except dependency installation and client generation, in both deployment contexts. It never touches a database.

Full exact-head CI must finish successfully before release. Preserve the prior source and verify the actual Replit workspace, production backup and deployment SHA before import/publication. Do not run the old hook during reconciliation.
