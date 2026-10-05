# Narrow follow-up to historical PR review

Base: main `61d0bb3af84c20882785394e842cee2f678cc938`. Do not merge the older competing session implementations in PR24/27/30. Current amount-basis semantics and all calculation math are retained.

## Added acceptance and affected routes

- The Chromium/WebKit session suite now opens independent tabs on `/calculate/product/bpc-157`, enters different numbers and verifies both tabs retain their own values through reload.
- A separate isolated context blocks sessionStorage before app initialization. The real homepage hero accepts synthetic entries, follows its Next.js link to `/peptide-calculator`, and retains them in memory. A document marker verifies client navigation. A hard reload must lose that memory-only draft rather than claim unavailable persistence.
- `/products` permanently redirects to the existing `/recommendations` canonical directory. Individual `/products/[id]` routes remain unchanged. The six-engine/viewport search suite asserts raw HTTP 308, destination, followed URL and canonical metadata, then retains its existing product-detail navigation check.
- The shared local matcher recognizes only the named AHK-Cu/GHK-Cu copper identities and explicit `no/not/without/exclude/excluding/except` format clauses. It checks restricted intent before parsing exclusions. It does not infer blend composition, benefits, suitability or alternative products. Existing positive-format precedence is preserved. Unknown vocabulary and contradictory filters return no results.
- Unit regressions cover exclusions across all four formats, copper/category intersections, invalid vocabulary and restricted intent. Browser search checks both copper results, contradictory format filtering and recovery to the original search journeys. Existing all-50 identity, destination, privacy and arithmetic suites remain required.

## Evidence and limits

A lightweight native Node probe of copied unchanged source modules (relative import extensions adjusted only in the temporary directory) passed 64 assertions: all 50 exact names, copper matches, exclusions, restricted/unknown queries and category intersections. Both changed browser scripts pass syntax checks; git diff check passes. Rendered browser behavior and redirect behavior require the new cloud CI run; no local build or live submission was performed.

Independent review identified a multi-format exclusion bug in the first candidate: `no sprays or blends` treated blends as a positive request. The revision consumes the full format list, including `and`, `or` and comma-separated items. Added unit and browser regressions preserve all exclusions, contradictory/unknown intent handling and restricted-query checks. An additional 289 pure-source probes pass across format pairs, three separators and six exclusion prefixes. Redirect acceptance now verifies query parameters survive the 308 and followed navigation while the canonical remains `/recommendations`. The initial candidate's results are not acceptance for this revised head.

No new dependency, schema, production configuration, supplier request, browser session, Replit import or publication. Production acceptance remains governed by the existing source/database/backup preflight and live audit gates. Historical inventory entry `/products` should now be tested as a redirect, not an additional page design. The directory, product detail URLs and calculator route families remain in the existing audit inventory.
