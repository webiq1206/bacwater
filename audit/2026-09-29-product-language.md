# Product-language clarity update

## Scope

All 50 product records now have a revised catalog summary, a clearer research question and a short plain-language mechanism explanation. Catalog and search summaries remain synchronized. Product names, aliases, artwork, affiliate destinations and calculator behavior are unchanged.

The detail panel shows the short explanation first. Existing scientific detail remains available under an accessible native disclosure. Evidence limits remain visible outside that disclosure. The source disclosure is separate and continues to link to the existing references with their qualifications.

## Editorial boundaries

The owner authorized a conservative clarity rewrite after review of Amino Club's affiliate terms at https://www.aminoclub.com/us/affiliate-terms (version 1.3, effective May 25, 2026; accessed September 29, 2026).

- Describe compounds, research questions and experimental measurements, not reasons to use a product personally.
- Do not turn research-use labels or citations into implied health, performance, recovery, aesthetic or other personal-benefit claims.
- Distinguish ingredient evidence from blend evidence and parent-compound evidence from prepared-liquid evidence.
- Keep uncertain targets, different peptide forms and Dihexa's retraction explicit.
- Preserve citations and source notes. This presentation pass does not add studies, independently revalidate the literature or certify legal or affiliate compliance.

## Verification

- Full `npm test` passed, including coverage for all 50 distinct plain explanations, synchronized summaries, exact product names and affiliate links.
- Compared all 50 records with the pre-edit version: names, aliases, identity text, detailed mechanisms, evidence limits and source records are unchanged.
- Updated desktop/mobile browser regression fixtures for the new mechanism disclosure and independent source disclosure. These fixtures were not executed locally; no fresh visual-browser pass is claimed.
- Production build passed, including TypeScript and generation of 113 static pages. The environment has no `DATABASE_URL`; database-dependent build reads reported fallback diagnostics. No production database was accessed or tested.
- `npm run test:search-http` passed all 64 built-server HTML/image checks, including all 50 product calculator routes. Database-backed article checks are excluded without a database connection.

Publishing remains the owner's Replit pull-and-republish workflow. A repository update alone does not mean the public site is live with these changes.
