> Historical preparation record. Superseded by sitewide-design.md: ordinary supplier links now display without a referral account; paid attribution remains off pending verification.

# BACwater design revision 02

Prepared locally on September 23, 2026 in response to feedback on the first AminoClub-inspired preview. This is a design and component implementation, not a supplier signup or a production release.

## Direction

Retain BACwater's calculator-first purpose. Use a light sage hero, forest-green primary actions, a restrained serif accent, and a stronger light/dark section rhythm. Supplier cards have distinct typographic identities without copying a supplier logo, product photograph, review, badge or packaging.

The hero now contains a real three-mode calculation component. Concentration uses entered mass and final volume; mass conversion uses the existing exact decimal helper; U-100 conversion uses the confirmed scale ratio. The example values are explicitly illustrative, not preparation or dosing instructions. The card supports keyboard tabs, edit, validation, reset and clipboard-error feedback. Opening a full tool does not claim to transfer or save the preview values.

The homepage proceeds from calculation to the tool directory, saved-plan capabilities, the conditional supplier directory, learning resources, compound references, and one closing action. The original educational context remains available through a native disclosure. Header routes, account access, footer destinations and public metadata are preserved, with shorter navigation labels and revised spacing.

## Preview versus application

The single-file interactive preview renders the same new components. Supplier cards are explicitly in preview mode, contain disabled controls and no outbound supplier links. Ordinary full-tool and account links lead to the existing public website in another tab; the preview is not a complete local deployment of every website route.

The application source still uses getAminoPartner. Both approval switches and valid dashboard-supplied product links are required before the supplier section can appear. The recommendations route, footer entry and sitemap entry remain hidden while disabled. No supplier account, verification code, agreement, referral code, tracking cookie or price feed was created.

The offline preview uses available system-font approximations. The application retains its existing Montserrat, Fraunces and JetBrains Mono font configuration. No font files are redistributed.

## Verification

The original assertion suites and 32 partner-boundary checks passed. Added 28 focused calculator/design checks passed. Strict TypeScript checking passed after regenerating the local Prisma client for the supplied schema; no database was changed.

The offline React preview passed 18 browser checks, including seven widths (320, 375, 390, 430, 768, 1024, 1440), numeric edits and invalid values, exact small-mass conversion, long-result wrapping, keyboard tab selection, reset, unavailable clipboard recovery, mobile/account menu focus return, native disclosure, and inactive supplier controls. No runtime or hydration errors were recorded. An additional doubled-font diagnostic at 390 pixels showed no document-width overflow after correcting tab wrapping and footer links.

Desktop and mobile screenshots were visually reviewed. A clipped small-screen saved-plan illustration and long-result decorative overflow were corrected. These are browser-engine/component tests, not complete-process WCAG certification, physical-device tests or live account acceptance.

A full Next.js production build, receiving-system analytics, production application integration and actual deployment were not performed in this design pass. Source is not committed or pushed to GitHub, applied to Replit, or live.

## Source baseline

GitHub main was read and confirmed as 73629e2b6fff695365406ea579f37792d1a004ac. Local source originated from the supplied b13b086 build archive. The subsequent five-file production-type-isolation fix is not touched by this design patch; the patched pre-existing paths are unchanged between those revisions. Preserve that build fix and unrelated work when applying this cumulative patch. Do not revert or replace the repository with this partial files directory.
