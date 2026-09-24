# Supplier-neutral product catalog and calculator selection

## Requested scope

Remove supplier branding from all public text, page descriptions, SVG artwork and accessibility names. Direct links necessarily retain the actual destination domain. No link is disguised with a misleading destination, and paid disclosures remain enabled only for approved exact referral links.

The existing own-brand monogram and ring artwork is implemented as a reusable SVG component. Cards, picker rows and selected calculator panels use it, never supplier photos, logos, scripts, prices or quality claims. The artwork explicitly is not packaging.

## Catalog provenance

Reviewed the complete public US store and opened all 50 distinct individual product destinations on September 23, 2026: https://www.aminoclub.com/us/store . Exact source destinations are stored in src/lib/partners/supplier-catalog.ts. The first seven requested items remain first; 43 additional individual listings include all listed sprays and blends. Sizes, stock, prices, shipping, discounts and test scores are not copied. This is a dated catalog snapshot, not a live inventory feed or a guarantee about future additions. Bundles, memberships, points, bulk order and subscription promotions are not separate chemical products.

Semaglutide, tirzepatide and retatrutide are matched to the existing supplier product destinations glp-1, glp-2 and glp-3. Tesamorelin uses the supplier's exact tesamorlin URL; its linked page also names Tesamorelin in the lot records. Plain labels are not certification of product identity or clinical suitability.

## Interaction and calculation boundaries

Every calculator workspace has a compact product chooser with search and type filters. All 50 products are selectable. The selected product shows our artwork and an exact direct external product link. BAC water remains directly linked without a result or signup. The normal website footer and product shelf stay outside focused calculations. The catalog is still a manual horizontal carousel with search, filters and keyboard/arrows, not an autoplay grid.

The main guided and all-at-once primary compound selectors include the new listings; supported existing single compounds retain their original flow and show matching product art/link. Additional products open dedicated calculation routes. A blend selection uses its own ingredient-based tool, not an inferred single-compound dose. The secondary-ingredient selector does not propose finished solutions as ingredients.

Dedicated routes are noindex and use explicit product keys, with separate persisted inputs per product. Ordinary mass products use user-entered mg, mcg and final volume. Blends require named ingredients with separately entered masses. Sprays use known solution concentration and sample volume, never extra water, injection-unit or spray-count recommendations. A mixed spray requires the ingredient being checked. Water performs volume and bottle-count arithmetic only. No dose, mixing recipe, clinical recommendation or expiry is inferred. Existing hCG IU references remain separate; no nonexistent supplier hCG listing is invented.

## Tests and delivery

Local TypeScript and retained unit/design tests pass. Seventeen additional pure groups verify completeness, neutral names, type mappings, invalid numbers, blank defaults, blend ratios, spray units, water counts, private link boundaries and exact destinations. The retained browser workflow adds coverage of every product route, rendered text/accessibility labels, original art, primary-selector behavior, modal focus, filter/reset, stored inputs, distinct arithmetic modes, unknown-route 404, mobile/enlarged text and WebKit.

Review final CI outcomes for actual acceptance; listing tests in this document is not a claim they ran successfully. No production database, schema, publishing configuration or dependency change. No Replit Agent, TinyFish, supplier signup, purchase or paid attribution was performed. Final GitHub main and Replit publication remain separate.
