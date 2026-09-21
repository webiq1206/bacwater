# BACwater.ai

A free concentration and measurement utility built with Next.js, TypeScript, Prisma/PostgreSQL and NextAuth. Public calculators do not require an account. The current public site does not sell products.

## Calculation and privacy boundaries

The calculation engine uses deterministic arithmetic. Users provide the amount, final volume, syringe scale and any weekly split from instructions they already have. The tool does not select a treatment, recommend a regimen, establish product compatibility, verify sterility or calculate a safe shelf life.

Saved links allow anyone who receives the link to read the calculation. Private notes and custom names remain restricted to the account owner or creating device. Guest access requires the device claim secret, not merely the shared URL. Saving a link in another browser does not grant edit permission.

## Development

Use Node.js 22 and npm. The authoritative lockfile is package-lock.json. PostgreSQL is required. Copy .env.example to a local .env and supply your own database and authentication values.

Run npm ci, npx prisma generate, npm run db:push, then npm run dev. Seeding is optional and is intended only for a new disposable development database. The seed can overwrite content and must not be run automatically against production.

## Checks

npm test runs calculation, model-guardrail, workspace and security fixtures. npm run build runs those tests and a production build. CI also runs TypeScript and isolated browser checks. Automated browser evidence is not a WCAG certification or proof of real-device behavior.

## Replit deployment

Repository: webiq1206/bacwater. Keep the existing Next.js deployment; do not convert the application to Vite. Verify the Replit checkout has no unrelated changes, fetch origin and pull main using a fast-forward-only update. The post-merge script installs from npm's lockfile and generates Prisma. It does not seed or migrate the database. Use a pooled PostgreSQL endpoint in autoscaled production.

Never use a destructive schema-push flag. Do not seed production as part of a build. Keep AUTH_SECRET stable across deployments. Review the actual production version after publishing; a GitHub push is not proof that Replit pulled or deployed it.

## Access and optional integrations

New registrations always receive the user role. An operator must verify account ownership before granting an administrator role in the database or through an existing authorized administrator. Roles are checked from the database on subsequent authenticated requests.

Missing Anthropic credentials leave the optional explanation assistant unavailable; calculations still work. Provider acceptance of a support email is not proof of inbox delivery. Contact submissions are stored in the admin support inbox and use a request ID to prevent duplicate records.

Optional analytics and session replay are disabled by default. Before setting NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED=true, disable automatic Enhanced Measurement/history, form, advertising and user-provided-data collection in GA4 and verify sanitized event delivery. Consent is required; private account/plan pages and sensitive query data are not tracked. Clarity replay is not enabled by this release.

## Audit records

See audit/2026-09-21 for release evidence, unresolved dependencies and remaining master-audit obligations. Code changes, test verification, production deployment, indexing and ranking are separate statuses.
