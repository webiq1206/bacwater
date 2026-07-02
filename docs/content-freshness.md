# Content Freshness Cadence

Dosing norms, product availability, and the comparison landscape in this
category shift quickly. Stale claims on a page that Google or an AI answer
engine already trusts hurt long-term authority more than a slower rollout, so
we audit content on a fixed schedule.

## Cadence

Run a full content audit **at least once per quarter**.

## Quarterly checklist

1. **Bump the review date.** Update `LAST_REVIEWED` in
   `src/lib/content-meta.ts`. This updates the "Last reviewed" line across the
   entire peptide and comparison clusters in one edit. Only bump it after you
   have actually re-verified the content below, never as a cosmetic change.

2. **Verify every dosage table.** Confirm the vial strengths in
   `src/lib/calc/peptides.ts` (`commonVialStrengthsMg`) still match what is
   commonly sold for each peptide. The peptide pages and their dosage charts
   derive entirely from these values.

3. **Re-check comparison claims.** Review `src/lib/comparisons/content.ts` for
   any factual drift in the bac water vs. sterile water / saline / etc.
   comparisons.

4. **Re-check buy-page and shipping claims.** Confirm the shipping windows and
   returns terms in `src/app/shipping-returns/page.tsx`, `src/app/buy/page.tsx`,
   and the shipping infographic still match actual operations.

5. **Confirm storage / shelf-life numbers.** The FAQ storage infographic and
   the per-peptide `refrigeratedShelfDays` should still reflect current
   references.

6. **Re-validate structured data.** Spot-check that FAQPage, HowTo, Product,
   and ImageObject schema still validate after any content changes.

7. **Scan for em dashes.** Grep the source for the em dash character
   (Unicode U+2014); it must return nothing. No em dashes anywhere, in copy,
   headings, meta, alt text, or schema.

## Where content lives

- Peptide pages: `src/app/peptides/[slug]/page.tsx` + `src/lib/peptides/*`
- Comparison pages: `src/app/learn/vs/[topic]/page.tsx` + `src/lib/comparisons/content.ts`
- Learn taxonomy / catalog: `src/lib/learn/*`
- Infographics: `src/lib/infographics/*`
- Seeded guides & FAQs (edit in admin, or `prisma/seed.ts` /
  `src/app/api/admin/seed/route.ts`, then re-seed on deploy)
