# Product information update, September 29, 2026

All 50 catalog products now use two reading layers:

- A short quick-look dialog: identity, research question, simple mechanism, format, evidence type and the main limitation. Its primary action opens the full guide.
- A `/products/[id]` guide: overview, expanded plain-language explanation, a qualified research summary, source links, product checks, definitions, questions and the product-specific calculator.

The catalog, search index, page titles and XML/human sitemaps link to the full guides. Calculator links retain their own destinations. No calculator arithmetic, ingredient quantities or default ratios changed.

## Content and provenance

The owner supplied screenshots of Amino Club's product structure, ingredient/specification cards and research references. The current KLOW page was also inspected in the existing owner-verified browser session. Layout and organization were adapted into BACwater's existing colors, typography and artwork.

The 29 product assignments visible in the Amino H2O screenshot are stored in `research-categories.ts`. Its printed total says 28, but 29 cards are visible. BACwater uses its own computed counts. Tissue-Repair is called Tissue research to avoid a promised outcome. Amino H2O is under Lab supplies. The other 20 products remain under Additional compounds; the screenshot does not establish their category assignments. Spray categories are not inferred from the ingredient name.

Existing reviewed research sources in `product-content.ts` were retained. `product-guides.ts` adds the plain-language reading layer and a source-linked starting summary for every product. The guide distinguishes animal/cell work, related-molecule work, ingredient-only evidence, product information and the Dihexa retraction. Selected primary records were rechecked during this update, including the Selank cell study, Cagrilintide structure study, AHK-Cu study, Pinealon study and Dihexa retraction notice. This was not a new systematic review of all literature.

No supplier prices, stock, batch purity, storage temperatures or bottle amounts were copied as permanent facts. Guides link to current labels and batch reports. Affiliate attribution and independent-site disclosures remain in place. The current affiliate-terms URL is `/us/affiliate-terms`.

## Validation

Coverage checks require all 50 guides, source-backed summary links, preserved evidence boundaries, working category intersections and sitemap coverage. Production HTML checks cover all 50 full product routes and all 50 calculator routes. The browser acceptance fixtures were updated for the two-layer journey.

The local browser preview was blocked by the browser client. Do not describe this update as visually verified on physical devices or as deployed to bacwater.ai. Publishing still uses the existing GitHub-to-Replit workflow. The copy aims for a fifth-grade reading level; this is not a certified reading-grade assessment.
