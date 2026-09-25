# Search appearance update

Date: September 25, 2026. Baseline: af8508e114eba92d22051dad2901060c67e00fcd.

## Verified findings and changes

- The legacy favicon was the default Vercel triangle. Its stable URL now serves the existing BACwater droplet as a 192-pixel PNG. The original asset remains recoverable in Git history. Root metadata and public metadata share the branded icon, including Apple touch metadata.
- Search-facing copy is centralized in `src/lib/seo/search-appearance.ts`. All 31 static sitemap destinations have reviewed, purpose-specific titles and descriptions. The 24 compound routes use their actual names and unit distinctions. Seven comparisons retain their existing, differentiated copy. Thirty-six potential single-filter learning destinations reuse the existing editorial copy and live indexing policy.
- These 98 supported combinations are not a claim that 98 pages are indexed or even currently eligible for indexing. Filter eligibility still depends on live result counts. No new landing pages were created.
- Titles and descriptions lead with the relevant task and actual utility. No demand, rank, pricing, credentials, clinical results or CTR figures were invented. The homepage keeps its existing focused title and description. Private/noindex settings, canonicals and stable URLs remain intact.
- Open Graph and Twitter titles now match the rendered document title, with the brand present once. Each supported destination has a 1200-by-630 branded title card. Image descriptions identify the visible droplet and topic, rather than adding unrelated keywords. The bounded image route rejects unknown and private paths. It needs no remote image, font, AI service or live database.
- Other published CMS articles retain their editorial title/description fields and the accurately described branded fallback image. Their live records were not available for individual review during this update. Existing content charts and their accessible descriptions remain intact; decorative artwork is not forced to repeat keywords.
- Organization schema identifies the actual logo. WebPage and Article image references use the same preview-image policy. Public pages permit large image previews without overriding private/noindex restrictions. No special AI markup, rich-result eligibility or placement guarantee is claimed.

## Verification

- TypeScript checks passed.
- Production build passed. The isolated build had no database and logged expected failed database reads, so this does not certify live CMS content.
- All 98 metadata/image combinations passed tests for distinct titles, single brand attribution, matching social metadata, PNG encoding, dimensions and descriptive image alternatives. Unknown/private-path exclusion and CMS fallback tests passed.
- Built-server HTTP checks passed for six representative pages: homepage, mg-to-mcg, U-100-to-mL, peptide calculator, research directory and privacy. Their document metadata, social image alternatives and icon links survived framework rendering. The branded icon, legacy favicon and generated share-card endpoints returned PNG successfully. This is not a full 98-page rendered crawl.
- Calculation, prior audit-improvement, research-design and affiliate-directory tests passed locally. Rendered preview cards were visually inspected, including the long comparison title.
- CI now reruns generated-image and built-server checks. New CI results must be checked for the pushed revision; local results are not a substitute for production verification.

## Remaining work and exact next actions

1. Owner: pull the new main revision into Replit and republish after reviewing its CI results. Confirm `/version.json`, the homepage icon link, `/icon`, `/favicon.ico` and a generated card in production. At the start of this work the public version endpoint still reported 66d9fe2f1d6596c4db211cb3a1612b2d38a7dd63, not main.
2. Search data: GSC Wizard returned `payment_required` because the subscription/trial ended. No purchase was made. Restore that connection or supply GSC Performance exports for complete 28-day and three-month windows, with query, page, device and country tables. No CTR diagnosis or improvement measurement has been claimed.
3. Separate CTR changes caused by rank, query mix, country/device mix and SERP features from possible snippet effects. Compare like-for-like query/page cohorts. Use qualified calculator use or affiliate outcomes where valid tracking is available, not raw clicks alone.
4. Existing layout checks: both failed workflows on the baseline trace to the same 320-by-568 homepage CTA viewport assertion. Builds, calculation tests, privacy checks and the full public-route audit passed on that baseline. This search-focused update does not change mobile layout or weaken those tests. The layout issue remains open.
5. CMS owner/editor: review live article titles, descriptions and body relevance once database or CMS access is available. The code fallback is verified, but individual live records are not.
6. Search processing: after deployment, request a homepage recrawl using authorized Search Console access. Verify Google's selected favicon and snippets over time. Neither publishing nor requesting a recrawl proves indexing or search appearance.

## Follow-up measurement

- Around day 7 after publication: owner checks the deployed revision, rendered metadata, icon/image responses, crawl errors and indexed canonical selection where access permits.
- Around day 30: owner or SEO reviewer compares complete query/page CTR cohorts, positions, device/country mix and qualified outcomes. Check a stable buyer-question panel for accurate AI mentions and citations; do not report a separate AI-only GSC metric.
- Around day 60: retain useful copy, revise weak high-impression listings only after checking rank and intent, and review CMS fallbacks. These are recommended review dates, not scheduled jobs or completed future checks.

## Official guidance reviewed

- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Google chooses search snippets and supports one favicon per hostname. Metadata and images improve the supplied signals, but cannot force the displayed title, snippet, image, icon, ranking or AI citation. Image alternative text describes images; titles and meta descriptions do not have alt attributes.
