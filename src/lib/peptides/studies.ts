/**
 * "What published research looked at" (PRD v3 §9.1.3 / §9.1.5).
 *
 * Source links identify the historical references reviewed by this release, with the source URL
 * attached. These are STUDY DETAILS, not instructions, an amount given to
 * animals cannot be turned into a safe amount for a person. The selected abstracts are not a comprehensive clinical review.
 *
 * Verify against the linked source before relying on any figure.
 */
export interface Study {
  species: string;
  amount: string;
  frequency: string;
  duration: string;
  route: string;
  gloss: string;
  sourceTitle: string;
  sourceUrl: string;
}

export interface CompoundStudies {
  humanEvidence: string;
  fdaStatus: string;
  studies: Study[];
}

export const STUDIES: Record<string, CompoundStudies> = {
  "bpc-157": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Rats (male Wistar)",
        amount: "10 mcg/kg or 10 ng/kg",
        frequency: "Once daily",
        duration: "Up to 90 days after surgery",
        route: "Intraperitoneal",
        gloss: "Looked at healing of a surgically cut knee ligament.",
        sourceTitle:
          "Cerovecki T, et al. BPC 157 improves ligament healing in the rat. J Orthop Res, 2010.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/20225319/",
      },
      {
        species: "Rats (male Wistar)",
        amount: "10 mcg/kg, 10 ng/kg, or 10 pg/kg",
        frequency: "Once daily",
        duration: "Assessed over 21 days",
        route: "Intraperitoneal",
        gloss: "Looked at Achilles tendon-to-bone healing after surgical detachment.",
        sourceTitle: "Krivic A, et al. Achilles detachment in rat and BPC 157. J Orthop Res, 2006.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/16583442/",
      },
    ],
  },
  "tb-500": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Rats (skin wound model) and human keratinocytes",
        amount: "As little as 10 pg was active in cell assays",
        frequency: "See the original methods; not resolved from this abstract",
        duration: "Measured at 4 and 7 days",
        route: "Topical and intraperitoneal",
        gloss: "Looked at whether it speeds wound closure and cell migration.",
        sourceTitle: "Malinda KM, et al. Thymosin beta4 accelerates wound healing. J Invest Dermatol, 1999.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/10469335/",
      },
    ],
  },
  semaglutide: {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "Use the current label for the exact product",
        frequency: "Not selected by this calculator",
        duration: "Product-specific",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed: OZEMPIC (semaglutide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79",
      },
    ],
  },
  tirzepatide: {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "Use the current label for the exact product",
        frequency: "Not selected by this calculator",
        duration: "Product-specific",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed, MOUNJARO (tirzepatide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d2d7da5d-ad07-4228-955f-cf7e355c8cc0",
      },
    ],
  },
  ipamorelin: {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Rats (adult female Sprague-Dawley)",
        amount: "18, 90, or 450 mcg/day",
        frequency: "Three times daily",
        duration: "15 days",
        route: "Subcutaneous",
        gloss: "Looked at whether it increases longitudinal bone growth rate.",
        sourceTitle: "Johansen PB, et al. Ipamorelin induces longitudinal bone growth in rats. GH IGF Res, 1999.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/10373343/",
      },
    ],
  },
  "cjc-1295": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Human (healthy adult men)",
        amount: "60 or 90 mcg/kg",
        frequency: "Single injection",
        duration: "Assessed over ~1 week",
        route: "Subcutaneous",
        gloss: "Looked at whether it raises GH/IGF-I while preserving pulsatile GH release.",
        sourceTitle: "Ionescu M, Frohman LA. CJC-1295 and pulsatile GH secretion. J Clin Endocrinol Metab, 2006.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/17018654/",
      },
    ],
  },
  "ghk-cu": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Rats (implanted wound-chamber model)",
        amount: "Various concentrations (concentration-dependent effect)",
        frequency: "Sequential injections into the wound chamber",
        duration: "Wound-chamber implantation period",
        route: "Local injection",
        gloss: "Looked at whether it boosts connective-tissue buildup in healing wounds.",
        sourceTitle: "Maquart FX, et al. GHK-Cu stimulates connective tissue in rat wounds. J Clin Invest, 1993.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/8227353/",
      },
    ],
  },
  "melanotan-2": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Human (10 men with erectile dysfunction)",
        amount: "0.025 mg/kg",
        frequency: "Single dose per session",
        duration: "6-hour monitoring period",
        route: "Subcutaneous",
        gloss: "Looked at whether it initiates erections, measured objectively.",
        sourceTitle: "Wessells H, et al. Melanotropic peptide initiates erections. J Urol, 1998.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/9679884/",
      },
    ],
  },
  "pt-141": {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "Use the current label for the exact product",
        frequency: "Not selected by this calculator",
        duration: "Product-specific",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed, VYLEESI (bremelanotide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8c9607a2-5b57-4a59-b159-cf196deebdd9",
      },
    ],
  },
  semax: {
    humanEvidence: "Selected source context, not a complete literature review. The species and formulation limit what each study can establish.",
    fdaStatus: "Research details are not product instructions or an approval assessment.",
    studies: [
      {
        species: "Rats",
        amount: "50 mcg/kg",
        frequency: "Single administration",
        duration: "Single dose",
        route: "Intranasal",
        gloss: "Looked at hippocampal BDNF/trkB expression and learning.",
        sourceTitle: "Dolotov OV, et al. Semax regulates BDNF and trkB in rat hippocampus. Brain Res, 2006.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/16996037/",
      },
    ],
  },
};

/** Aliased slugs so lookups match the site's peptide slugs. */
const ALIASES: Record<string, string> = {
  
  "cjc-1295-with-dac": "cjc-1295",
  bremelanotide: "pt-141",
};

export function studiesFor(slug: string): CompoundStudies | null {
  return STUDIES[slug] ?? STUDIES[ALIASES[slug] ?? ""] ?? null;
}
