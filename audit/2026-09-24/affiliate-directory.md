# Owner-approved affiliate directory

## Scope and source review

The owner supplied https://aminoclub.com?utm_source=affiliate_marketing&code=WEBIQ and authorized direct GitHub writes on September 24, 2026. Public product destinations remain the 50 individually reviewed catalog entries. The existing /recommendations URL and canonical are retained; no product URL, calculator route or database schema is removed.

Reviewed public first-party sources on September 24, 2026:

- https://www.aminoclub.com/shop/affiliate-terms (public version 1.3, effective May 25, 2026)
- https://www.aminoclub.com/us/store
- https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers

The uploaded partner-dashboard screenshot was used as context only. No private dashboard content or account screenshots are committed. No terms were accepted on the owner's behalf.

## Implementation

All catalog destinations append only utm_source=affiliate_marketing and code=WEBIQ to the existing exact product path. Server rendering and provider fallbacks both use the approved attribution. Search text, accounts, saved plans, calculator values, notes, emails and click identifiers are not attached. Links use sponsored, nofollow, noopener and noreferrer, and no-referrer policy. No supplier script, image, iframe, hidden redirect or background referral request is installed.

The default production catalog now uses the owner's approved code. The former pre-approval AMINO_CLUB_ENABLED, AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED and AMINO_CLUB_PRODUCT_LINKS_JSON environment setup is no longer needed by the production default. Explicit custom settings passed to the legacy validator still fail closed and retain their security tests. Set AMINO_CLUB_AFFILIATE_PAUSED=true to suspend attribution immediately at server render; restart or redeploy as required by the hosting environment. Suspension or termination requiring removal of all supplier references would require a separate content takedown, not just this attribution pause.

The directory contains 12 visible cards per page, type filters, alphabetical sorting, local natural-phrase matching, helpful empty states and clear disclosures. All 50 listing links remain in server HTML; without JavaScript all cards become visible. Each entry has an individual research-detail panel. On portrait mobile the panel fills the dynamic viewport, scrolls internally, keeps the supplier action visible and returns keyboard focus to its trigger. The same detail component is available in existing supplier shelves.

## Content limits

Descriptions cover identity, format, similar-name distinctions, labels and batch-document checks. They do not promise health, performance, hormonal, recovery, weight, fitness, anti-aging or cosmetic benefits. There are no instructions for human or animal dosing, administration or cycles. A research-only disclaimer is not used to justify otherwise prohibited claims.

The finder is a closed-vocabulary catalog matcher, not a generative adviser. Health goals and unsupported criteria produce no product recommendations. It does not select products for a study or recommend substitutes. Prices, inventory, purity scores, discounts and expiry dates are not fabricated. Original directory artwork is not represented as supplier packaging. The site describes itself as an independent affiliate, not an official representative.

Commission disclosures and research-only notices are present by product actions in the directory, details, shelves, water links, site search and calculator selectors. Privacy copy reflects public affiliate attribution and local directory search.

## Verification and remaining boundaries

The release adds unit tests for every listing, exact referral parameters, hostile destinations, emergency pause, local search, rejected health intents and individual detail coverage. Browser tests cover all 50 detail dialogs and links, pagination, sorting, search, focus return, mobile geometry, accessible controls, JavaScript-free links, WebKit and absence of external tracking requests. Existing product-calculator and responsive tests are preserved with updated expected referral URLs.

Test scripts alone are not proof of passing. Record actual CI results after execution. All browser tests block external requests, so they do not inflate referral clicks.

The owner's account approval is user-reported. No supplier account login, accepted-terms state, payout setup, real conversion attribution, cookie behavior, live redirect chain or test purchase has been verified. The supplied root URL and a representative attributed deep link could not be fetched by the available web reader. Correct query construction is not a guarantee of commission credit. A legitimate merchant-side attribution check remains necessary, without self-referrals or fake purchases.

This is a technical implementation against the reviewed public terms, not a guarantee of legal compliance or supplier approval. Future term updates and takedown requests require review. Replit publication is separate from a GitHub merge.
