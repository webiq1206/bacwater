> Historical preparation record. Superseded by sitewide-design.md: ordinary supplier links now display without a referral account; paid attribution remains off pending verification.

# AminoClub integration preparation

Prepared September 23, 2026 for BACwater.ai. Target GitHub main was verified as
73629e2b6fff695365406ea579f37792d1a004ac. This patch touches no build configuration,
Prisma model, authentication, paid subscription or live account. The design-v2 revision adds a separate quick calculator using existing numeric helpers.

## Actual status

Prepared and tested in the local working container only. Not committed or pushed
to GitHub, not applied in Replit and not published. Partner signup has not started;
no email code was requested, no partner terms were accepted and no referral code
was issued. Current connector tools exposed repository reads, but no write actions;
no connected interactive browser was available for the external account form.

## Included

- Original, scoped BACwater homepage design. See design-v2.md for the interactive hero and the later design changes.
- Four curated product cards: Amino H2O, BPC-157, GHK-Cu and TB-500. These are not
  the complete AminoClub catalog and are not selected from a visitor's inputs.
- Separate recommendations and disclosure page, conditional homepage/footer links,
  conditional sitemap membership and aligned editorial/privacy statements.
- Strict hostname, path, scheme, credential and query validation for exact verified
  dashboard deep links. The code does not invent a referral parameter or code.
- Visible commission disclosure beside the paid links, sponsored/nofollow link
  attributes, no-referrer policy and no supplier script, pixel or image requests.
- Supplier section disabled by default, including its public route and sitemap
  entry, until approval and verified links are explicitly configured.
- No health claims, reviews, quality guarantees, price/stock feed, copied logos,
  product photography, checkout or automatically prefilled purchase flow.

The product names and destinations were checked against the supplier's public
pages. BACwater has not independently tested the products, authenticated reports
with laboratories or established clinical suitability. Keep medical calculation
and editorial references separate from paid supplier content.

## Activation requirements

Complete the supplier's account flow using the owner-designated email and its
one-time code. The operator must meet the program's eligibility requirements,
review and accept the terms, and complete any required identity/tax/payment steps
through the supplier's secure interface. Do not store those documents or codes in
this repository or ask for them in a public chat.

Obtain confirmation that the planned BACwater placement complies with the partner
program. Copy exact approved product deep links from the dashboard. The current
validator supports URLs on www.aminoclub.com at the four reviewed product paths,
with simple non-sensitive attribution parameters. If the approved format differs,
revise and test the validator from actual documentation. Do not fabricate a link,
force a redirect, scrape an endpoint, or substitute somebody else's referral code.

Only after those checks, set AMINO_CLUB_PRODUCT_LINKS_JSON to the verified mapping,
set AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED to true, and set AMINO_CLUB_ENABLED to
true. Configuration changes require deployment/restart and production verification.
Do not set either boolean just to make the preview visible. The offline design
preview uses disabled supplier controls and is not an account or attribution test.

To suspend the supplier section, set AMINO_CLUB_ENABLED to false, restart/publish
and verify that its page, navigation and sitemap entry are removed. No automatic
partner-status API has been implemented. The operator owns suspension monitoring.

## Verification completed locally

TypeScript passed with strict inherited compiler settings. Existing npm assertion
suites passed, plus 32 new partner-configuration/URL-boundary checks. The isolated
server-rendered component preview was checked at 320, 390, 768 and 1440 CSS pixels
for overflow, heading count, disclosures, link qualifiers and inert destinations.
Desktop and phone previews were visually inspected, including correcting a mobile
heading-spacing issue. These checks do not certify the complete Next.js runtime.

No production build, database-integration run, vendor signup, vendor-attribution
test, browser authentication test, real-device/screen-reader review, complete
sitewide visual review or deployment was performed for this patch.

## Design basis and limitations

The reference site's accessible page structure showed a prominent introductory
section, product collections, documentation links and repeatable product detail
layouts. The prepared design uses an original BACwater composition with a warm
background, green accents, generous card spacing and readable actions. This is
not a pixel-matched copy or a completed full-site restyle. A full rendered AminoClub
page screenshot could not be inspected with the available public browsing tools.
No proprietary image, font, review, guarantee or identity was copied.

## Dated sources

Checked September 23, 2026:

- https://www.aminoclub.com/us/affiliate
- https://www.aminoclub.com/us/account
- https://www.aminoclub.com/shop/affiliate-terms (version v1.3, May 25, 2026)
- https://www.aminoclub.com/us/products/amino-h2o
- https://www.aminoclub.com/us/products/bpc-157
- https://www.aminoclub.com/us/products/ghk-cu
- https://www.aminoclub.com/us/products/tb-500
- https://www.aminoclub.com/us/coa
- https://www.aminoclub.com/us/research-use
- https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links

A supplier statement remains a supplier statement. The sources establish the
published program and listing descriptions, not independent product verification,
regulatory approval, binding legal advice or endorsement by BACwater.

## Revision 02

The companion design-v2.md records the updated homepage, source changes, test scope and delivery status. Earlier preparation records above do not claim a live release.
