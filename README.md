# BACwater.ai

Free concentration and measurement utilities built with Next.js, TypeScript, Prisma/PostgreSQL and NextAuth. Public calculations do not require an account. The website does not sell water or peptides, prescribe a treatment or select a dose.

## Application boundaries

The arithmetic uses entered amounts and final liquid volume. The mass converter preserves supported decimal-prefix relationships. U-100 conversion is a scale relationship, not device selection. hCG product IU is separate from milligrams and syringe units. The website does not verify contents, compatibility, sterility or a safe storage period.

Saved links allow their recipient to read the calculation. Private notes and custom plan names require the owning account or creating-device secret. Public share identifiers do not grant editing permission. Authorization is enforced at the server and administrator pages check stored roles before reading records.

## Development and tests

Use Node.js 22 and the committed npm lockfile. Run npm ci and npx prisma generate with your own local database configuration. Initialize only a disposable development database as appropriate. Never run the production seed as a deployment step.

npm test runs the retained assertion suites. npm run build runs those tests and a Webpack production build. The read-only GitHub workflows additionally exercise publication transactions, conservative editorial revisions, durable rate limits, browser journeys, private PDF content, the known public inventory and responsive browser engines. These results do not constitute clinical, legal, security or WCAG certification.

The pinned Next.js 16.3.5 font loader assumed an upstream font URL always ended in an extension and intermittently failed valid builds. scripts/prepare-font-loader.mjs installs a small checked compatibility change after dependency installation: the extension is read from a recognized binary font header. Downloading and self-hosting remain unchanged. It fails on an unsupported response and requires review when Next.js is upgraded. No font file is included in the audit deliverables.

## Replit production deployment

Repository: webiq1206/bacwater. Preserve the existing Next.js deployment and unrelated work. Verify the checkout and origin, fetch and fast-forward main, then use the normal Republish controls. Do not reset over unrelated uncommitted changes.

Before the first publication of this release, retain a production database backup. The configured build installs the lockfile, generates Prisma, applies the additive schema and runs scripts/apply-editorial-revisions.ts in apply mode before building. That script changes only title/body values that match the recorded legacy default fingerprints; independent edits, publication flags, canonical choices and missing records are preserved. Review its output and any skipped independent content. This is a controlled content update, not a production reseed.

Keep AUTH_SECRET stable, use an appropriate pooled database connection for autoscaling, and never accept a destructive schema-push flag. /version.json exposes only the release marker and build commit. Compare it after actual publication; GitHub main, the Replit workspace and public deployment are separate states.

## Explanation and analytics options

Built-in explanations recompute trusted arithmetic and do not require an AI provider. Optional external topic routing requires explicit configuration, an authorized model and key, user consent and authentication. It sends the permitted question for selection of a fixed topic, not a saved plan, private notes or model-generated numeric answer. Durable global and account limits apply. Do not enable this optional mode without its approved operational budget and live acceptance test.

Optional analytics and session replay are off by default. Keep NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED=false until the receiving GA4 property is verified, automatic sensitive collection is disabled, and consent plus actual sanitized event receipt is tested. Private routes are excluded. A contact event is not delivered email; a print event is not proof of physical printing.

## Audit and remaining acceptance

See audit/2026-09-22/master-release.md and audit/manual-action-required.md. The private conversation handoff contains the full 115-parent source register, page briefs, evidence, all 28 growth dispositions, actual original demonstrations and reviewable external drafts. No external outreach, social publication, new account, purchase or future scheduled check is claimed by this repository release.
