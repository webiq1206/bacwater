/**
 * "What published research looked at" (PRD v3 §9.1.3 / §9.1.5).
 *
 * Every row here comes from a real, fetched primary source, with the source URL
 * attached. These are STUDY DETAILS, not instructions, an amount given to
 * animals cannot be turned into a safe amount for a person. Only compounds with
 * verified sources appear; the rest render no table (honest by omission).
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
    humanEvidence:
      "No published human clinical trials; the evidence is animal (rat) and cell studies.",
    fdaStatus: "Not FDA-approved.",
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
    humanEvidence:
      "The parent molecule (thymosin beta-4) has entered early human trials; the TB-500 fragment itself has no published human trials.",
    fdaStatus: "Not FDA-approved.",
    studies: [
      {
        species: "Rats (skin wound model) and human keratinocytes",
        amount: "As little as 10 pg was active in cell assays",
        frequency: "Single application at wounding",
        duration: "Measured at 4 and 7 days",
        route: "Topical and intraperitoneal",
        gloss: "Looked at whether it speeds wound closure and cell migration.",
        sourceTitle: "Malinda KM, et al. Thymosin beta4 accelerates wound healing. J Invest Dermatol, 1999.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/10469335/",
      },
    ],
  },
  semaglutide: {
    humanEvidence: "FDA-approved with large human clinical trials.",
    fdaStatus: "FDA-approved (Ozempic, semaglutide injection).",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "0.25 mg to 2 mg (approved range)",
        frequency: "Once weekly",
        duration: "Ongoing chronic use",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed: OZEMPIC (semaglutide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79",
      },
    ],
  },
  tirzepatide: {
    humanEvidence: "FDA-approved with large human clinical trials.",
    fdaStatus: "FDA-approved (Mounjaro, tirzepatide injection).",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "2.5 mg to 15 mg (approved range)",
        frequency: "Once weekly",
        duration: "Ongoing chronic use",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed, MOUNJARO (tirzepatide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d2d7da5d-ad07-4228-955f-cf7e355c8cc0",
      },
    ],
  },
  ipamorelin: {
    humanEvidence: "No published human efficacy trials; the evidence is animal (rat) and cell studies.",
    fdaStatus: "Not FDA-approved.",
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
    humanEvidence: "Limited early-phase human pharmacology data; no large efficacy trials.",
    fdaStatus: "Not FDA-approved.",
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
    humanEvidence:
      "No large human clinical trials; the primary evidence is animal (rat) and cell/tissue studies.",
    fdaStatus: "Not FDA-approved as a drug.",
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
    humanEvidence: "A few small early human studies; no approved product and no large trials.",
    fdaStatus: "Not FDA-approved.",
    studies: [
      {
        species: "Human (10 men with erectile dysfunction)",
        amount: "0.025 mg/kg",
        frequency: "Single dose per session",
        duration: "Single-session monitoring",
        route: "Subcutaneous",
        gloss: "Looked at whether it initiates erections, measured objectively.",
        sourceTitle: "Wessells H, et al. Melanotropic peptide initiates erections. J Urol, 1998.",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/9679884/",
      },
    ],
  },
  "pt-141": {
    humanEvidence: "FDA-approved with human clinical trials supporting the approved use.",
    fdaStatus: "FDA-approved (Vyleesi, bremelanotide injection).",
    studies: [
      {
        species: "Human (FDA-approved labeling)",
        amount: "1.75 mg per dose",
        frequency: "As needed (max 1/24h, 8/month)",
        duration: "As-needed use",
        route: "Subcutaneous",
        gloss: "The approved product's labeling: the reference for amounts, not this site.",
        sourceTitle: "DailyMed, VYLEESI (bremelanotide) Prescribing Information.",
        sourceUrl:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8c9607a2-5b57-4a59-b159-cf196deebdd9",
      },
    ],
  },
  semax: {
    humanEvidence:
      "Registered/used clinically in Russia; human data are mostly Russian-language, with one small English-published human study. No FDA/EMA review.",
    fdaStatus: "Not FDA-approved (registered as a drug in Russia only).",
    studies: [
      {
        species: "Human (healthy volunteers)",
        amount: "0.25–1.0 mg (~4–16 mcg/kg)",
        frequency: "Single administration",
        duration: "Assessed over 20–24 hours",
        route: "Intranasal",
        gloss: "Looked at attention and EEG measures in healthy adults.",
        sourceTitle: "Kaplan AY, et al. Semax displays nootropic-like activity in humans. Neurosci Res Comm, 1996.",
        sourceUrl:
          "https://onlinelibrary.wiley.com/doi/abs/10.1002/%28SICI%291520-6769%28199609%2919%3A2%3C115%3A%3AAID-NRC171%3E3.0.CO%3B2-B",
      },
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
  "cjc-1295-no-dac": "cjc-1295",
  "cjc-1295-with-dac": "cjc-1295",
  bremelanotide: "pt-141",
};

export function studiesFor(slug: string): CompoundStudies | null {
  return STUDIES[slug] ?? STUDIES[ALIASES[slug] ?? ""] ?? null;
}
