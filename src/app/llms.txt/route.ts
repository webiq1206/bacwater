import { PEPTIDES } from "@/lib/calc/peptides";
import { PEPTIDE_CONTENT } from "@/lib/peptides/content";
import { shortName } from "@/lib/peptides/page-data";
import { COMPARISONS } from "@/lib/comparisons/content";
import { SITE_URL } from "@/lib/seo/sitemap";

export const revalidate = 3600;

/**
 * Dynamic llms.txt (llmstxt.org format). Generated from the live peptide roster
 * and comparison set so it always reflects the current site, listing the pages
 * and facts that help LLM crawlers understand and cite BACwater.ai.
 */
export function GET() {
  const u = (p: string) => `${SITE_URL}${p}`;

  const peptideLines = PEPTIDES.map((p) => {
    const short = shortName(p.name);
    if (p.slug === "custom") {
      return `- [Any other peptide](${u("/peptides/custom")}): BAC water calculator and reconstitution method for peptides not listed individually`;
    }
    const what = PEPTIDE_CONTENT[p.slug]?.what ?? "";
    const desc = `How much bac water for ${short}, dosage table by vial strength, reconstitution steps, storage, and shelf life`;
    return `- [${short}](${u(`/peptides/${p.slug}`)}): ${desc}${what ? `. ${what}` : ""}`;
  });

  const comparisonLines = COMPARISONS.map(
    (c) => `- [${c.title}](${u(`/learn/vs/${c.slug}`)}): ${c.metaDescription}`
  );

  const body = `# BACwater.ai

> A BAC water (bacteriostatic water) concentration and measurement calculator for peptide reconstitution. Enter the numbers on your vial to get exact BAC water amounts, concentration, syringe units, and printable vial labels. All math is deterministic and verified, never AI-generated. Nothing is sold; no vendor is recommended.

## Key pages

- [Homepage](${u("/")}): The complete BAC water calculator and reconstitution guide
- [Plan Builder](${u("/plan")}): Enter your peptide, vial strength, dose, and syringe to get an exact reconstitution plan with PDF export and printable vial labels
- [Guided planner](${u("/plan/new")}): Guided planner, one question at a time
- [Compound reference](${u("/peptides")}): Per-compound BAC water calculators and reconstitution references
- [Learning Center](${u("/learn")}): Filterable guides, comparisons, and FAQs on BAC water and reconstitution
- [FAQ](${u("/faq")}): Direct answers on BAC water storage, ingredients, prescription status, and safety

## Calculators

- [BAC water calculator](${u("/tools/bac-water")}): How much BAC water to add based on vial strength and target dose
- [Reconstitution calculator](${u("/tools/reconstitution")}): BAC water amount, syringe units, doses per vial, and step-by-step instructions
- [Dose calculator](${u("/tools/dose")}): Convert concentration and draw volume to an exact dose in mcg, mg, and syringe units
- [Supply calculator](${u("/tools/supplies")}): Supplies needed for a full peptide cycle
- [Syringe unit converter](${u("/tools/syringe-units")}): Convert between mL and U-100 insulin syringe units (100 units = 1 mL)
- [mg to mcg converter](${u("/tools/mg-to-mcg")}): Convert milligrams to micrograms (1 mg = 1,000 mcg)
- [Reverse BAC water calculator](${u("/tools/reverse-bac")}): Choose the dose and the exact syringe units you want to draw, and get the precise BAC water amount to add
- [Free printable vial labels](${u("/tools/vial-labels")}): Printable peptide vial labels with a QR code showing strength, concentration, dose, mix date, and discard date

## Guides and reference

- [BAC water and peptide shelf life](${u("/learn/bac-water-shelf-life")}): How long an opened bac water vial can be used, and why compound-specific stability depends on your product's instructions
- [Peptide reconstitution glossary](${u("/learn/glossary")}): Plain-English definitions of BAC water, benzyl alcohol, reconstitution, lyophilization, U-100, and subcutaneous

## Peptide reconstitution guides

${peptideLines.join("\n")}

## BAC water comparisons

${comparisonLines.join("\n")}

## Key facts

- BAC water (bacteriostatic water) is sterile water with 0.9% benzyl alcohol added as a preservative
- The benzyl alcohol suppresses bacterial growth, which makes a vial safe for multiple draws over weeks
- On a U-100 insulin syringe, 100 units = 1 mL and 10 units = 0.1 mL
- 1 mg = 1,000 mcg
- Reconstituted peptides should be refrigerated (about 36 to 46 F, or 2 to 8 C) and protected from light
- How long a reconstituted peptide lasts depends on the compound and formulation; follow the instructions that came with your product rather than a general figure
- An opened multi-dose BAC water vial is commonly dated and discarded within about 28 days (the standard multi-dose vial guidance), unless the manufacturer states otherwise
- All calculations use deterministic, tested formulas, never AI-generated math
- Products are sold for laboratory research and educational purposes only, and nothing on the site is medical advice

## Policies

- [Editorial and sourcing policy](${u("/editorial-policy")}): How content is researched, fact-checked, and kept current
- [Shipping and returns](${u("/shipping-returns")}): Shipping times and returns policy
- [Disclaimer](${u("/disclaimer")}): Research use and not-medical-advice disclaimer
- [Privacy](${u("/privacy")}) and [Terms](${u("/terms")})

## About

BACwater.ai provides deterministic peptide reconstitution calculations, printable vial labels with QR codes, and PDF plan exports. Every calculation shows the exact formula used so the work can be verified. For research and educational use only. Not medical advice.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
