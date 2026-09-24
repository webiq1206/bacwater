# WEBIQ affiliate directory implementation

Owner request and code received September 24, 2026. Base main: 070f21e76c996672d91934fe4fa0593f1b1d13eb.

## Delivered code

- All50 default catalog purchase destinations use the owner-supplied `utm_source=affiliate_marketing&code=WEBIQ` on the exact existing individual product path. The root link is preserved in the shared affiliate module. No visitor information or cart operation is added.
- `/products` provides a progressively revealed, locally searchable and filterable directory. Every existing listing has a separate `/products/[slug]` research profile. Original BACwater artwork is retained; no supplier logo, copied packaging, invented review, price, purity claim or discount is used.
- Local natural-word filtering covers compound identities, names and formats, with explicit format exclusions. It is not a generative AI recommender. Requests mentioning personal use, medical goals, dosing or animal use do not return product suggestions. Unknown searches do not generate substitutes. No input is transmitted, logged as analytics, stored in the URL, or sent to a model.
- Commission and research-only disclosures accompany purchase links in the directory, profiles, existing shelves, calculator product selection, BACwater links and site search. Links retain sponsored/nofollow/noopener/noreferrer and no-referrer.
- Paid merchandising is removed from clinical/reference and learning pages, which include historical study material. Calculator arithmetic and saved data are unchanged. Their product selectors identify names and formats, never choose a compound or amount from a health goal.
- Existing URLs are preserved. Product profiles have individual canonicals, ordinary WebPage metadata, source links and crawl paths in XML/HTML sitemaps and internal search. No invented Product offers or ratings are emitted.

## Configuration and suspension

The default is the expressly authorized WEBIQ catalog. Explicit `AMINO_CLUB_ENABLED=false` or `AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED=false` suspends paid attribution; the independent directory remains. Empty/unset `AMINO_CLUB_PRODUCT_LINKS_JSON` uses all50 maintained defaults. A nonempty legacy override replaces the map. Remove an obsolete override or supply all50 verified links rather than silently accepting partial paid coverage. Replit deployments with old false flags must be updated before publishing. These flags do not assert that KYC, payout eligibility or merchant-side conversion attribution was verified.

A takedown request may require removing content, not merely switching attribution off. Handle supplier notices promptly and update or remove affected placements.

## Compliance review basis, not a legal certification

Reviewed the screenshot and the supplier's full published partner terms v1.3, effective May25,2026, on September24,2026. Section4 bans human-use instructions, health/function/performance/recovery/weight/anti-aging and other prohibited claims even alongside a disclaimer. Section5 requires clear commission disclosure. Sections2–3 limit authority and brand use; Sections9–10 address discretionary enforcement and removal; Section16 addresses changed terms.

Sources:
- https://www.aminoclub.com/us/affiliate-terms
- https://www.aminoclub.com/us/affiliate
- https://www.aminoclub.com/us/research-use
- https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking

Catalog names and destinations were checked September23,2026 in the previous catalog release. The maintained50 are a dated catalog, not a live or guaranteed-complete stock feed. No additional inventory scraping is introduced. A profile's identity notes do not authenticate a batch or imply research outcomes.

## Verification and delivery boundaries

Local pure TypeScript tests include40 affiliate/search groups,32 URL/partner groups,17 catalog/calculation groups and14 search/clarity groups. Full Next.js production build and browser acceptance run in isolated CI. Consult the exact GitHub run conclusions and artifacts for the pushed revision; this record itself does not declare those runs passed or the site published.

Browser tests cover all50 profiles, exact purchase URLs, responsive layouts, accessibility, search boundaries, no external merchant requests, WebKit navigation and discovery. Existing calculator, hero, consent and whole-site regressions remain in place.

No merchant purchase, self-referral, fabricated click, commission test, KYC submission, terms acceptance, payout setup or production database operation is performed. The screenshot still shows an acceptance/unlock-payouts button; the owner must confirm account onboarding in their own secure dashboard. A correct URL is not proof that a commission will be recorded, particularly when the merchant's discount-attribution rules apply.
