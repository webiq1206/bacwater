# Website audit implementation, September 26, 2026

The established cream, sage, forest and lime palette, serif emphasis, calculator-first layout, original product illustrations, all 50 catalog listings and the approved supplier attribution remain in place. This is an implementation record, not a claim of measured conversion uplift or completed production deployment.

## Owner decisions

- Product selection remains required before product calculations. Generic mass tools require an eligible selected product. Activity units, blends, solutions and water use separate calculators. Pure unit converters remain product-independent.
- GLOW, KLOW, CJC-1295 / Ipamorelin (No DAC), and Wolverine are each one premixed product. The default calculation uses total blend mass and final volume. Sample-volume math and ingredient breakdowns are optional.
- Ingredient names are prefilled for the selected blend. An individual breakdown requires each labeled ingredient amount, without guessing a ratio. Saved amounts are matched by ingredient identity, never reassigned by row position.
- The BPC-157/TB-500 solution also distinguishes total blend from one ingredient, using its labeled concentration. Changing that interpretation clears the concentration field.
- The audit's proposal to skip product selection is superseded by the owner's explicit requirement.

## Sitewide findings

| Audit item | Implemented change | Benefit / limit |
| --- | --- | --- |
| S1: irrelevant hCG wording | Compound template now links to the IU calculator only for hCG. Other compounds use an appropriate generic action. | Removes contradictory instructions. |
| S2: first-visit notice | Shorter notice and accessible scope disclosure; age decision preserved. | Less text before the page task. Visual acceptance and conversion effect remain unverified. |
| S3: validation | Specific decimal, zero, negative, missing and range messages; associated input errors and cleared invalid results. | More direct correction. |
| S4: mobile reading | Larger hero explanation text; responsive HTML comparison cards; larger dialog close targets. | Readability improvements require device rendering verification. |
| S5: repetition | Consolidated compound limitations, removed duplicate inline charts and redundant rail facts. | Clearer hierarchy with full source material retained. |
| S6: task names | Consistent amount-to-volume, U-100 volume, vial counts and saved-calculation labels. | Easier navigation between entry and destination. |
| S7: article sharing | Fourteen authored guides use the established route-specific branded social cards and consistent Article imagery. | More descriptive sharing; no social performance claim. |
| S8: search titles | Shorter, specific authored-guide titles and descriptions. | Search clarity; CTR effect needs Search Console data. |
| S9: evidence | Exact verified document titles and supporting notes; truthful publisher and correction links. | No invented editor, credential or clinical review. |
| S10: loading | Product research details and full research records are deferred until opened; initial catalog uses compact copy. | Less initial detail code. No Lighthouse or Core Web Vitals improvement asserted. |
| S11: measurement | Allowlisted, consent-gated starts, valid results, corrections, copies, product details, supplier clicks and form errors, alongside existing save/contact/print counters. Product routes collapse to a broad category. | No numeric inputs, search text, tokens or private record IDs transmitted. Receiving analytics configuration still needs verification. |
| S12: next action | Topic-matched article CTA and related reading before the secondary preferred-source promotion. | Clearer answer-to-tool journey; uplift requires measurement. |

## Page and journey findings

| Page / component | Implemented change |
| --- | --- |
| Sign in / recovery | Forgot-password entry, show-password controls, neutral request response, random hashed single-use tokens, expiry and action limits. Reset is atomic and revokes outstanding links and old sessions. Email token is removed from the browser fragment after reading. Recovery pages are noindex and use no-referrer. |
| GLOW reference and calculator | Three-ingredient identity reconciled with the supplier listing. Default total-blend math and optional per-ingredient results, with no assumed proportions. |
| Guided calculation | Product-first entry retained. Direct product routes give concentration before optional amount/schedule inputs. Existing guided saving flow remains available. |
| BAC water tool | Concentration from its two required numeric values after product selection; optional amount-to-volume disclosure. |
| Learning index | Task groups first, general guides separated from compound references; filters retained. |
| Site search | Product title opens research details. A separate Use in calculator link states its destination. Keyboard navigation supports both links and detail buttons. |
| Product directory | Suggestions collapse after a committed query and return when edited. Complete product cards remain available. |
| Registration | Plain passphrase guidance, show-password control, account-specific benefits and nearby terms/privacy links. |
| Contact | Clear support scope, supplier-order direction and a stored-record receipt reference on success. |
| Comparison exports | Full wrapped titles and complete rows, with a separate printable SVG. Mobile reading uses HTML rather than a reduced drawing. |
| FAQ | Task groups, jump navigation, deduplicated questions and matching visible FAQ structured data. |
| About / methodology / editorial policy | Organizational accountability and correction route; links to formulas and scope. |
| Saved plans / PDF / labels | Existing ownership, device/account distinction and export behavior retained. Full interactive release acceptance remains necessary. |

## All 26 learning pages

| Page | Change |
| --- | --- |
| /learn/bac-water-for-peptides | Values-needed checklist and direct label/concentration links. |
| /learn/bac-water-shelf-life | Responsive date comparison and visible correction note. |
| /learn/common-mistakes-to-avoid | Wrong-input / reason / check examples and task-relevant links. |
| /learn/glossary | Alphabetical term navigation and direct links from calculator unit help. |
| /learn/how-peptide-reconstitution-works | Accessible concentration equation figure and relevant tool CTA. |
| /learn/how-to-read-a-peptide-vial | Original fictitious-label figure separating total mass, volume and concentration. |
| /learn/how-to-read-an-insulin-syringe | Large illustrative interval diagram with a text equivalent. |
| /learn/how-to-reconstitute-bpc-157 | Accurate shorter metadata, preserved correction note and specific calculation CTA. |
| /learn/how-to-reconstitute-semaglutide | Exact FDA source names, shorter metadata and concentration task links. |
| /learn/how-to-reconstitute-tirzepatide | Shorter input-and-units metadata and relevant links. |
| /learn/how-to-store-reconstituted-peptides | Record checklist, label link and separated historical correction. |
| /learn/how-to-use-an-insulin-syringe | Accurate scale-and-limits summary and primary interval-reading link. |
| /learn/insulin-syringe-sizes | Capacity illustration that does not invent graduation spacing. |
| /learn/peptide-reconstitution-chart | Printable arithmetic worksheet and relevant method/unit/label links. |
| /learn/too-much-bac-water | Before/after concentration figure and visible correction note. |
| /learn/what-is-bac-water | Terminology figure, topic-specific sharing card and product-comparison links. |
| /learn/what-syringe-units-mean | Separate volume-scale and concentration-dependent mass steps. |
| /learn/what-you-cannot-know | Can-calculate / cannot-verify comparison. |
| /learn/where-to-buy-bacteriostatic-water | Research-supplier context visually distinguished from product-label checks. |
| /learn/vs/sterile-water | Responsive comparison, separate export and retained correction note. |
| /learn/vs/saline | Exact manufacturer source label and preserved-saline cross-link. |
| /learn/vs/sodium-chloride | Responsive ingredient comparison and exact manufacturer source label. |
| /learn/vs/distilled-water | Complete readable export and responsive comparison. |
| /learn/vs/benzyl-alcohol | Full wrapped export title and ingredient-versus-product comparison. |
| /learn/vs/acetic-acid | Label-information checklist and glossary link. |
| /learn/vs/reconstitution-solution | Label-information checklist and complete export title. |

## Verification

- TypeScript checks passed.
- Full npm test suite passed, including product-format gates, every catalog record, all four powder blend totals and ingredient breakdowns, blend-solution interpretation, legacy ingredient mapping, validation, token helpers and article presentation.
- Production build passed.
- 112 metadata/social-card pairs and branded icon checks passed.
- 64 built-server HTML/image checks passed locally, including all 50 product routes, hCG and both recovery pages. This verifies server responses and markup, not browser hydration or visual layout.
- CI now uses disposable PostgreSQL for atomic password-reset, token expiry/reuse, password replacement, session invalidation and action-budget tests. It also checks the 14 database-backed article routes. The CI run for application commit `2e02b309a5b4eb25939ac754b721fa7cf08d50e5` passed all steps, including those database tests and all 78 HTML/image checks.
- Existing browser regression fixtures were updated to choose products through the interface, open optional fields, check total-versus-ingredient blend results, follow product-detail navigation and recognize the stored contact receipt. Manual desktop/mobile rendering remains unconfirmed.
- No production database was changed, no real support submission was made and no email was sent during local verification.

## Remaining operational checks

- Replit: fetch and fast-forward the intended main commit, preserve unrelated work, keep the existing production backup and use normal Republish controls. Do not run seed or schema push against production; this change needs no schema migration. Verify /version.json after publication.
- Confirm the existing Resend sender and API key work for a controlled recovery email and staff support reply. A stored support receipt is not email delivery.
- Render and interact on desktop and 320/360/390/430 px screens, including phone keyboards, first-visit notice, nested dialogs, focus return, blend-mode changes, anonymous save/reload/claim, shared-view privacy and printed output. The cloud browser could not access this local build, so these checks are not claimed as completed.
- Keep optional analytics disabled until the receiving property and sanitized event receipt are verified. Measure conversion and search CTR after release; no lift is assumed.
- Lighthouse / real Core Web Vitals and authenticated Search Console data remain unavailable. The prior PageSpeed request returned 429.
- Shareable product-detail URLs and naming a real individual editor remain ideas requiring business input, not invented additions to this release.

## Follow-up: guided homepage calculator

The homepage card now presents the existing PlanForm as six compact steps: product, vial label, amount/schedule, final volume, device/optional date, and review/save. Its forest header, cream/sage surfaces, product artwork, converter tabs and lime result panel are retained.

- The homepage and full guided workspace use the same calculation engine, schedule interpretation, session fields, step draft and save action. This is a presentation variant, not a second calculation engine.
- Product selection is required. Powder blends, ready-made solutions, water and IU selections open their dedicated calculators. Their total-premixed-blend defaults and optional ingredient breakdowns are unchanged.
- Back/Continue, field-specific errors, review edit controls, copy and clear are available on mobile and desktop. The mobile flow can be completed inline, with full screen available as an explicit choice.
- Only one form is mounted at a time. Entries, the current step, an edited plan name and in-flight save results survive moving between inline/full-screen mode. Converter tabs remain independent.
- Restored drafts are clamped to the earliest missing prerequisite. Invalid or incomplete inputs remove dependent results and prevent continuing or saving.
- Added pure step-gating tests and updated Chromium/WebKit CI journeys for inline mobile steps, full-screen switching, refresh, converter continuity, review edits, anonymous saving, product-specific routing, enlarged text and accessibility.
- Local verification: full unit suite, new guided-flow tests, TypeScript, production build and 64 built-server HTML/image checks passed. Browser regression execution is delegated to the repository's existing isolated CI workflows; physical-device and published-site verification remain separate.
- No production data, supplier inventory, affiliate attribution or deployment settings were changed. Publication still uses the normal Replit workflow.
