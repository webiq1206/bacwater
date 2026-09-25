# Product naming, research explanations and detail-panel presentation

## Requested scope

September 25, 2026: use the partner's exact product names throughout customer-facing product components; replace product "listings" with "products"; explain identity, research questions and mechanisms in everyday language; redesign detail lightboxes; remove the review date and section. All existing owner-approved WEBIQ affiliate destinations must remain intact.

Baseline: ebbc6b65bf2054df65de637aa4387c1394f3867a. This includes the security repair, recent SEO metadata work, and the reference-page directory-link changes. No production publication is part of this commit.

## Source and content approach

Manually opened the public store and all fifty individual product pages on September 25, 2026. Product-page headings, not abbreviations or guessed molecular names, are authoritative for customer-facing product titles. Exact names are recorded independently in scripts/fixtures/partner-product-names.json. GLP-1 (SM), GLP-2 (TR), GLP-3 (RT), Amino H2O, Tesamorlin, Kisspeptin and each specific SPRAY/Spray capitalization are retained as the partner writes them. Spaces around blend-name slashes follow the source headings. The names in source paper titles and existing user-entered/saved labels are not rewritten as claims about the partner's products.

Primary product source: https://www.aminoclub.com/us/store and https://www.aminoclub.com/us/products/<existing-product-id>. Every exact URL is recorded with its corresponding entry in src/lib/partners/product-content.ts. No automated scraping job or live feed was added. Manual source review does not verify batch identity, purity, current stock or supplier statements independently.

The separate sections answer three questions: What it is; What researchers study; How it works. Each is a short paragraph. Scientific terms are explained within the text. A fourth, product-specific note identifies evidence limits. Incomplete evidence stays incomplete: there are no invented mechanisms, benefit promises, recommended quantities, administration methods, or inferred human suitability. Definitions distinguish NAD+ and 5-Amino-1MQ from peptides, individual substances from blends, parent-compound research from modified sprays, and thymosin beta-4 from ambiguous TB-500 forms. No claim is made that a mechanism or study result establishes the performance of a supplier's product or blend.

Independent research links are supplementary compound-context sources, not product certificates. Representative sources consulted include:

- https://www.nature.com/articles/s41421-024-00700-0 (three receptor-bound structures)
- https://pubmed.ncbi.nlm.nih.gov/8227353/ (copper-peptide tissue experiment)
- https://pubmed.ncbi.nlm.nih.gov/20225319/ (BPC-157 experimental ligament model)
- https://pubmed.ncbi.nlm.nih.gov/10469335/ (full thymosin beta-4 experimental tissue context, not TB-500 equivalence)
- https://pubmed.ncbi.nlm.nih.gov/25738459/ (MOTS-c cell metabolism)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC2431115/ (KPV cellular transport/signaling)
- https://pubmed.ncbi.nlm.nih.gov/16996037/ (SEMAX experimental signaling)

These selected sources and supplier descriptions are not a systematic literature review. Some PubMed pages challenge browser access. No guarantee of reading-grade certification, medical validation, legal compliance, or affiliate approval is made.

Partner terms reviewed: https://www.aminoclub.com/shop/affiliate-terms (v1.3). Accurate product-name references are permitted; official impersonation, derivative supplier branding, health/fitness/cosmetic claims, human or animal administration advice and concealed affiliate relationships are excluded. The original BACwater artwork is a labeled abstract illustration, never a supplier package or a chemically exact diagram. Supplier logos and package photos were not recreated or modified.

## Implementation boundaries

Names, display marks, short descriptions and scientific-name search aliases share one product data source. The same display-name adapter feeds known product selectors, fresh calculator labels, reference navigation/headings, charts, search and social metadata. Stable IDs, scientific-reference URLs, formulas, explicit custom labels, historical saved labels, publication source titles and study descriptions remain intact. No database migration or production-content rewrite is performed.

Product detail panels use a distinct responsive CSS module, readable HTML product names rather than clipped SVG text, a desktop two-column overview, three numbered explanations, optional expanded sources, a short evidence limitation and an always-reachable affiliate action. Mobile panels fill the viewport and scroll internally. Close/Escape restore focus and the existing directory filter. The review section, date, identifier grid and generic warning wall are removed. Supplier source links inside the panel use the same validated WEBIQ attribution as the primary action.

No packages, framework versions, lockfile, .replit settings, auth settings, production credentials, schema or numeric calculation formulas are changed. The temporary source-transfer workflow is removed from the final tree. No background supplier requests or referral clicks are used in validation.

## Verification

A local TypeScript parser checked source syntax, and 614 local data/name/search/paragraph-length assertions passed before transfer. These do not replace full type checking or browser testing.

Added unit tests cover all fifty exact names, stable destinations, artwork names, search aliases, product-selector coverage, the three text sections, evidence limits, source URLs, protected affiliate parameters, unchanged example arithmetic and preservation of explicit saved names.

Added Chromium and WebKit regression coverage checks all fifty titles, cards, detail headings, source expansion and attribution, search aliases, calculator names, evidence/terminology removal, desktop/mobile/landscape layout, long names, enlarged text, accessibility checks, filter retention and keyboard focus return. Existing assertions were updated only where the requested visible product name or heading changed; numeric, link-security, privacy, and routing assertions are retained.

Test scripts are not proof of success. Final executed CI results, exact tested commit, and visual artifact review will be recorded in the pull-request conversation before merge. Publishing and merchant-side conversion credit remain separate operational checks.
