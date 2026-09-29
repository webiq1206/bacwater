# Research finder, disclaimer and plain-language update

Reviewed September 29, 2026.

## Visitor experience

- `/research-finder` accepts a lab question in natural language. It uses 16 reviewed topic groups, exact catalog names and aliases, and conversation context for follow-up questions and product-type filters.
- Broad or multi-topic questions ask the visitor to narrow the question. Unknown topics return no invented alternatives.
- Cards use the real catalog IDs, the shared quick-look dialog, full product guides, study summaries, source links, evidence type and limitations. There are no generated product IDs, sources or scientific claims.
- This is a guided, deterministic search over reviewed notes. It is explicitly described that way in the interface and disclaimer. It is not an unrestricted LLM and does not fetch new research live.
- Personal-use, medical, treatment, dosing and administration requests produce no product cards. Adding “for research” does not override that restriction. A blocked thread must be explicitly reset before a new lab question.
- A research match is a reading suggestion, not a declaration that a product is suitable for an experiment. Retracted, related-molecule, ingredient-only and supplier-description evidence remain labeled.
- The input and up to 12 exchanges stay in React page state. No chat requests, external model, browser storage or query-string persistence. Existing Clarity allowlisting excludes the finder; entered and displayed text also has a masking attribute.

## Content coverage

- All 50 product guides: simpler questions, how-it-works explanations, concrete processes and study findings. Nine spray records inherit their ingredient explanation with a finished-liquid limitation; Adalank and Adamax retain their own evidence gaps.
- Product identities and all catalog summaries remain synchronized with the shared records.
- All 24 compound reference entries, unit/science glossaries, calculator explanation text, main FAQ answers and 14 article summaries use simpler language.
- `plain-articles.ts` contains rewrites for the 27 known guide/FAQ records. The public article, FAQ and catalog paths project these rewrites only when title/body match an exact reviewed default or the fingerprint of the original legacy default. This avoids overwriting independent CMS edits and requires no database migration. Publication flags, metadata overrides and unrelated content remain intact.
- Third- to fifth-grade reading level is an editorial target, not a claim that every scientific name or source title meets an automated score.

## Disclaimer sources and boundaries

- Amino Club: https://www.aminoclub.com/us/disclaimer (retrieved successfully September 29, 2026).
- Affiliate rules: https://www.aminoclub.com/us/affiliate-terms (previously reviewed in the owner-completed researcher session, v1.3).
- FDA: https://www.fda.gov/drugs/enforcement-activities-fda/unapproved-drugs
- FDA: https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss
- The supplied footer screenshot was used as a layout reference. Wording is specific to BACwater.ai. We did not copy a blanket claim that an FDA disclaimer is legally required or that a notice makes human-use claims acceptable.
- The expanded `/disclaimer` distinguishes calculators, catalog matching, evidence limits, research products, FDA claims and the independent affiliate relationship. It does not claim that every peptide molecule lacks an approved prescription form, or that an approval for one drug covers a partner vial.

## Verification and release

- Production build and existing automated tests, including calculator and blend/unit regression checks.
- Finder tests cover all catalog names, all topics, follow-ups, ambiguity, absent formats, unsupported names, evidence limitations, health requests and article-edit preservation.
- Built-server HTTP checks cover the new routes, footer notice, source links, all 50 product pages and all 50 product calculators.
- This workspace has no production database access. Independently edited CMS content and its live presentation still need review in production.
- Browser visual verification is pending. The local browser preview was blocked by the browser environment. Code and HTTP checks are not a substitute for a live desktop/mobile visual pass.
- Push to `main` supplies the update for the existing Replit publishing workflow; a GitHub commit alone is not proof that bacwater.ai has been republished.
