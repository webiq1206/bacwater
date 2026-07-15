/**
 * Editorial content for the /peptides/[slug] cluster.
 *
 * The numeric dosage tables, syringe math, and reconstitution steps are all
 * derived deterministically from the calculator and peptides.ts. This file
 * carries the genuinely unique, human-written context per peptide so the pages
 * are not templated text with a single word swapped. All copy is framed for
 * research and education only, never as medical or dosing advice.
 */

import type { PeptideCategory } from "@/lib/calc/peptides";

export interface PeptideContent {
  /** One or two sentences: what this peptide is. */
  what: string;
  /** What it is researched or reconstituted for, framed as research. */
  uses: string;
  /** Peptide-specific mixing, handling, or storage caveat. Optional. */
  caveat?: string;
  /** Brand names, alternate spellings, or commonly-searched aliases. Optional. */
  aka?: string;
  /** Extra FAQ entries beyond the auto-generated per-strength and storage ones. */
  faqs?: { q: string; a: string }[];
}

/** Shared framing per category, used as supporting context on each page. */
export const CATEGORY_CONTEXT: Record<PeptideCategory, string> = {
  healing:
    "Healing and recovery peptides are among the most commonly reconstituted research compounds. The reconstitution process is the same as any other peptide: add bacteriostatic water, swirl gently, and refrigerate.",
  growth:
    "Growth hormone secretagogues (peptides studied for nudging the body's own growth-hormone signals) are usually mixed at low strength, because the amounts studied are small. Picking the right amount of BAC water keeps each dose on an easy-to-read mark on the syringe.",
  metabolic:
    "Metabolic peptides include the GLP-1 class (they act on a body signal called GLP-1, which is studied in research for its role in appetite and blood sugar pathways). They are often reconstituted for research. The amounts studied vary a lot, so working out the BAC water for your exact vial matters more here than almost anywhere.",
  cognitive:
    "Cognitive research peptides are typically reconstituted in small volumes. The reconstitution method is standard, and shelf life once mixed follows the same refrigeration rules as other peptides.",
  cosmetic:
    "Cosmetic and skin research peptides reconstitute the same way as any other peptide. Some carry a natural color once mixed, which is normal and not a sign of a problem.",
  reproductive:
    "Reproductive research peptides are reconstituted with bacteriostatic water using the standard method. Verify the strength and units printed on your vial carefully, since labeling conventions vary in this group.",
  longevity:
    "Longevity research peptides are reconstituted using the standard method. Once mixed, they follow the same refrigerated shelf-life rules as other peptides.",
  other:
    "Reconstitution works the same way for any peptide: add bacteriostatic water, swirl gently, refrigerate, and calculate the water amount so your dose lands at a clean number on the syringe.",
};

export const PEPTIDE_CONTENT: Record<string, PeptideContent> = {
  "bpc-157": {
    what: "BPC-157 is a synthetic peptide derived from a protein found in gastric juice, studied in research settings for tissue repair and recovery.",
    uses: "In research it is most associated with connective tissue, gut, and general recovery models. It is one of the most commonly reconstituted peptides.",
    caveat: "BPC-157 is light-sensitive once mixed. Keep the reconstituted vial in its box or wrapped in foil in the refrigerator.",
  },
  "tb-500": {
    what: "TB-500 is a synthetic fragment of the protein Thymosin Beta-4, studied in research for tissue repair and flexibility.",
    uses: "Researchers often pair it conceptually with BPC-157 in recovery models. Because studied amounts are larger than most peptides, doses are measured in milligrams rather than micrograms.",
    aka: "Also written as Thymosin Beta-4 or TB500.",
    caveat: "Because a typical research amount is larger, a 1 mL insulin syringe is usually the most practical choice.",
  },
  ipamorelin: {
    what: "Ipamorelin is a lab-made peptide. It is a growth hormone secretagogue, which means it is studied for gently nudging the body's own growth-hormone signals.",
    uses: "It is frequently reconstituted alongside CJC-1295 in growth hormone research. Studied amounts are small, so concentration and syringe choice matter.",
    caveat: "Small research amounts mean a 0.3 mL insulin syringe with half-unit marks is often easier to read than a 1 mL syringe.",
  },
  "cjc-1295-no-dac": {
    what: "CJC-1295 without DAC, also called Mod GRF 1-29, is a lab-made peptide in the growth-hormone group. It has a short half-life, which means it does not last long in the body once it is used.",
    uses: "It is often studied together with Ipamorelin. The 'no DAC' version is less stable once reconstituted, so it is typically mixed in smaller batches.",
    aka: "Also searched as CJC no DAC or Mod GRF 1-29.",
    caveat: "This version is less stable in solution. Use it within about three weeks and keep it cold and dark.",
  },
  "cjc-1295-with-dac": {
    what: "CJC-1295 with DAC is a lab-made peptide in the growth-hormone group. The 'DAC' part is added so it lasts longer in the body (a longer half-life) than the no-DAC version.",
    uses: "The DAC extends how long it stays active in research models compared to the no-DAC version, which is the main reason researchers choose one over the other.",
    aka: "Also searched as CJC with DAC.",
    caveat: "Studied amounts are larger than the no-DAC version, so verify which variant your vial contains before calculating.",
  },
  sermorelin: {
    what: "Sermorelin is a lab-made peptide in the growth-hormone group. It is one of the shorter pieces studied in this class.",
    uses: "It is a long-standing research compound in the growth hormone secretagogue group. Reconstitution follows the standard method.",
    caveat: "Sermorelin is relatively delicate once mixed. Refrigerate it right away and use it within about three weeks.",
  },
  hexarelin: {
    what: "Hexarelin is a growth hormone releasing peptide known for its potency in research models.",
    uses: "It sits in the same secretagogue family as Ipamorelin and GHRP peptides. Studied amounts are small.",
  },
  semaglutide: {
    what: "Semaglutide is a lab-made peptide. It is one of the most studied peptides for how the body handles food and weight. It works on a body signal called GLP-1 (a GLP-1 receptor agonist).",
    uses: "It is frequently reconstituted for research into metabolic and appetite pathways. Studied amounts start very low and increase slowly.",
    aka: "Sometimes searched as GLP-3 (a common misspelling of GLP-1) and known by the brand names Ozempic and Wegovy.",
    caveat: "Research amounts vary widely and are usually very small. Confirm the exact milligram strength printed on your vial before calculating.",
    faqs: [
      {
        q: "Is semaglutide a GLP-1 or GLP-3?",
        a: "Semaglutide is a GLP-1 receptor agonist. There is no drug called GLP-3, which is almost always a misspelling of GLP-1. If you searched for how to mix GLP-3, this is the page you want.",
      },
    ],
  },
  tirzepatide: {
    what: "Tirzepatide is a lab-made peptide studied for how the body handles food and weight. It works on two body signals at once, called GIP and GLP-1 (a dual receptor agonist), instead of just one.",
    uses: "It acts on two receptor pathways rather than one, which is what distinguishes it from single-agonist GLP-1 peptides in research.",
    aka: "Known by the brand names Mounjaro and Zepbound, and sometimes searched as GLP-3 or GLP-1.",
    caveat: "Tirzepatide vials come in a wide range of strengths. Never freeze the reconstituted solution, and verify the exact strength on your vial before calculating.",
    faqs: [
      {
        q: "How much BAC water do I add to a 30 mg or 60 mg tirzepatide vial?",
        a: "Use the calculator above and enter your exact vial strength. Larger vials such as 30 mg or 60 mg simply reach a higher concentration for the same BAC water amount, so your dose lands at fewer syringe units. Confirm the strength printed on your vial.",
      },
      {
        q: "Is tirzepatide the same as Mounjaro or Zepbound?",
        a: "Mounjaro and Zepbound are brand names for tirzepatide. Research vials are labeled by milligram strength rather than brand, so calculate based on the milligrams printed on your vial.",
      },
    ],
  },
  retatrutide: {
    what: "Retatrutide is an emerging triple receptor agonist peptide studied in metabolic research.",
    uses: "It is one of the newer metabolic research compounds. Because it is emerging, studied amounts and vial strengths vary, so calculating for your specific vial is important.",
    aka: "Often shortened to reta.",
    caveat: "As an emerging compound, published references are limited. Verify your vial strength and confirm your intended amount before mixing.",
  },
  cagrilintide: {
    what: "Cagrilintide is a lab-made peptide studied for how the body handles food and weight. It is an amylin analog (a lab-made copy of a natural body signal called amylin) and is often studied next to GLP-1 peptides.",
    uses: "It is studied for its complementary action to GLP-1 compounds. Reconstitution is standard.",
  },
  "mots-c": {
    what: "MOTS-c is a lab-made copy of a peptide that comes from the mitochondria, the tiny power plants inside cells. It is studied in metabolic and longevity research.",
    uses: "Studied amounts are relatively large compared with growth peptides, so doses are often measured in milligrams.",
  },
  epithalon: {
    what: "Epithalon is a small lab-made peptide (it is made of four building blocks, so it is called a tetrapeptide). It is studied in longevity and cellular research.",
    uses: "It is commonly researched in cycles. Reconstitution follows the standard method.",
    aka: "Also spelled Epitalon. Both spellings refer to the same peptide.",
  },
  "ghk-cu": {
    what: "GHK-Cu is a small lab-made peptide (made of three building blocks, so it is called a tripeptide) that holds onto copper. It is studied in skin, hair, and tissue research.",
    uses: "It is one of the most common cosmetic research peptides and is available in higher vial strengths than most peptides.",
    aka: "Also called copper peptide.",
    caveat: "A blue tint after reconstitution is completely normal and comes from the copper. It is not a sign of contamination.",
  },
  "melanotan-2": {
    what: "Melanotan II is a lab-made copy of a natural hormone that affects skin color (a melanocyte-stimulating hormone). It is studied in pigmentation research.",
    uses: "It is studied for its effect on melanin pathways. Researchers typically begin with a very small test amount.",
    aka: "Often abbreviated MT2 or MT-2.",
    caveat: "Because responses vary, researchers usually start with a very low test amount and observe before adjusting.",
  },
  "ss-31": {
    what: "SS-31, also known as Elamipretide, is a lab-made peptide that targets the mitochondria (the tiny power plants inside cells). It is studied in cellular energy research.",
    uses: "It is studied for its interaction with mitochondrial membranes. Reconstitution is standard.",
    aka: "Also known as Elamipretide.",
  },
  selank: {
    what: "Selank is a lab-made peptide based on a natural one that helps steer the immune system. It is studied in cognitive research.",
    uses: "It is studied in behavioral and cognitive research models. Reconstitution follows the standard method.",
  },
  semax: {
    what: "Semax is a synthetic peptide studied in cognitive and neurological research.",
    uses: "It is often grouped with Selank in nootropic research. Studied amounts are small.",
  },
  "aod-9604": {
    what: "AOD-9604 is a lab-made piece of the growth-hormone molecule (a fragment, not the whole thing). It is studied in metabolic research.",
    uses: "It is a fragment rather than a full growth hormone peptide, which is what distinguishes it in research. Studied amounts are small.",
  },
  "kisspeptin-10": {
    what: "Kisspeptin-10 is a peptide studied in reproductive and hormonal signaling research.",
    uses: "It is studied for its role in hormonal signaling pathways. Vial strengths vary, so verify your label.",
    caveat: "Strengths in this group vary. Confirm the milligram amount on your vial before calculating.",
  },
  "pt-141": {
    what: "PT-141, also known as Bremelanotide, is a lab-made peptide that works on a body signal system called melanocortin. It is studied in reproductive research.",
    uses: "It is related to Melanotan II but studied for different pathways. Reconstitution is standard.",
    aka: "Also known as Bremelanotide.",
  },
  hcg: {
    what: "HCG is a hormone studied in reproductive research and typically supplied as a lyophilized research powder.",
    uses: "It is reconstituted the same way as peptides, but its strength is often stated in international units (IU) rather than milligrams.",
    aka: "Research HCG.",
    caveat: "HCG strength is frequently labeled in IU, not mg. Confirm the units on your vial before using any milligram-based calculator, since the two are not interchangeable.",
    faqs: [
      {
        q: "My HCG vial is labeled in IU, not mg. What do I do?",
        a: "HCG is commonly measured in international units rather than milligrams. If your vial is labeled in IU, use the IU value your product documentation provides rather than a milligram-based calculation, since IU and mg are not directly interchangeable for HCG.",
      },
    ],
  },
  "glow-blend": {
    what: "The Glow Blend is a combination product containing GHK-Cu and BPC-157 in a single vial, studied in skin and recovery research.",
    uses: "Because it is a blend, every draw delivers both peptides in proportion. It is reconstituted as one product using the total vial strength on the label.",
    caveat: "Reference the label for the exact ratio of each peptide. Verify both component amounts, and expect a blue tint from the copper in GHK-Cu.",
  },
  custom: {
    what: "This page covers reconstitution for any peptide not listed individually, using the same deterministic math and standard method.",
    uses: "If your peptide is not in our roster, the reconstitution principles are identical: add bacteriostatic water, swirl gently, refrigerate, and calculate the water amount for a clean dose. Verify every value against your own vial label.",
    caveat: "Because this is a general page, there is no fixed dosage table. Enter your own vial strength and dose in the calculator, and always confirm against the label on your vial.",
  },
};
