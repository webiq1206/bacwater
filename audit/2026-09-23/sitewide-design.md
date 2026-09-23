# Calculator-first design rollout

Based on main 73629e2 and the approved Design V2 source. Prepared September 23, 2026.

## Changes

The approved homepage is implemented with a working three-mode calculator. Shared site colors, typography, borders, field styles, cards, tables, navigation, and reading layouts extend the visual direction to tools, guide/compound templates, account pages, saved-plan workspaces, and admin pages. A new outlined BACwater.ai wordmark and matching drop/measurement icon are self-hosted vector artwork, not font binaries. Public and admin headers share the mark.

Calculator labels and introductions use short sentences and explain units alongside controls. Required technical terms, limits and source detail remain available. Readability is a design target, not a claim that a child has tested or should use these adult research tools. The site is not directed at minors.

Supplier product sections now always use a manual horizontal carousel with touch scrolling, arrow buttons, keyboard controls, visible positions, reduced-motion behavior, and every item present in server HTML. Required order: BAC water, GLP-1 / Semaglutide, Tirzepatide, Retatrutide, BPC-157, GHK-Cu, TB-500. Suppliers' GLP-1 (SM), GLP-2 (TR), and GLP-3 (RT) product labels are shown to avoid mistaken destinations. A separate BAC-water link remains outside the scrolling cards and appears alongside calculator supply checks and in the footer.

The latest request supersedes the original hidden-catalog preview: ordinary public supplier links are now available without a partner account. Exact paid referral URLs remain behind the existing approval and validation gates. Invalid or missing configuration falls back to the ordinary exact product page, never to invented codes or a different compound. Signup has not been performed. No paid attribution, stock, prices, discounts, copied images, tests, clinical claims or vendor endorsement are invented.

Supply helpers identify what information and measuring equipment should be checked against the existing product instructions. They do not choose a dose, compound, diluent or device and do not infer a water-bottle purchase count from final solution volume. Actual entered amounts are not attached to supplier URLs. Outbound links suppress the referrer and contain no dynamic personal or health values. Fixed product ordering does not vary by inputs or user.

## Sources checked

September 23, 2026, first-party product pages:
- https://www.aminoclub.com/us/products/amino-h2o
- https://www.aminoclub.com/us/products/glp-1
- https://www.aminoclub.com/us/products/glp-2
- https://www.aminoclub.com/us/products/glp-3
- https://www.aminoclub.com/us/products/bpc-157
- https://www.aminoclub.com/us/products/ghk-cu
- https://www.aminoclub.com/us/products/tb-500
- https://www.aminoclub.com/shop/affiliate-terms

These establish public destinations, supplier naming, and research-use restrictions only. No independent product testing or approval is claimed. Supplier content and availability may change.

## Verification

Use the final commit's CI artifacts for outcomes. Existing arithmetic, security, publication, privacy, consent, build-type-isolation and route checks are retained. Added fixtures check all seven product destinations, paid-link boundaries, the new wordmark, calculator-first ordering, 7 viewport widths, ordinary-link sitemap membership, carousel controls, enlarged text and no supplier network requests before an outbound click. Mock/test environments do not prove real-device accessibility or live referral attribution.

## Release boundaries

This work changes source and visual presentation, not production data or the deployment command. Keep the earlier production type-isolation fix. Replit synchronization, Republish and live verification are separate steps. Do not seed a production database. The original master assignment's external account, growth and specialized-review gaps are not closed by a visual release.
