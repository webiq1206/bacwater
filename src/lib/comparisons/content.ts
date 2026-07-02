/**
 * Content for the /learn/vs/[topic] comparison cluster.
 *
 * Each topic consolidates every phrasing variant of one comparison ("is bac
 * water the same as saline", "bac water vs saline for peptides", etc.), opens
 * with a direct verdict, and carries a side-by-side table. All copy is factual
 * and framed for research and education, never medical advice.
 */

export interface ComparisonRow {
  dimension: string;
  bac: string;
  other: string;
}

export interface ComparisonTopic {
  slug: string;
  otherName: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** 40-60 word direct verdict that opens the page. */
  verdict: string;
  table: ComparisonRow[];
  body: { h2: string; p: string }[];
  faqs: { q: string; a: string }[];
}

export const COMPARISONS: ComparisonTopic[] = [
  {
    slug: "sterile-water",
    otherName: "Sterile Water",
    title: "BAC Water vs Sterile Water",
    metaTitle: "BAC Water vs Sterile Water for Peptides",
    metaDescription:
      "Bac water contains a benzyl alcohol preservative for multi-dose use. Sterile water has none and is single-use. Use bac water for peptide reconstitution.",
    verdict:
      "For reconstituting peptides you draw from more than once, use bacteriostatic water. It contains 0.9% benzyl alcohol, a preservative that suppresses bacterial growth so a vial stays usable for weeks. Sterile water has no preservative, which makes it single-use once opened. That preservative is the entire difference.",
    table: [
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Multi-dose safe", bac: "Yes, about 28 days refrigerated", other: "No, single use" },
      { dimension: "Best for", bac: "Reconstituting peptides drawn over days or weeks", other: "One-time single-draw use" },
      { dimension: "Shelf life after opening", bac: "About 28 days refrigerated", other: "Discard after one use" },
    ],
    body: [
      {
        h2: "Why the preservative matters",
        p: "Every time you insert a needle into a vial you introduce a small contamination risk. The benzyl alcohol in bacteriostatic water suppresses bacterial growth, which is what makes a multi-dose vial safe to use over days or weeks. Sterile water offers no such protection, so it is intended for a single draw.",
      },
      {
        h2: "Can you substitute one for the other?",
        p: "You can use bacteriostatic water anywhere sterile water is called for, since the preservative does not affect the peptide. You should not use sterile water where bacteriostatic water is called for if you plan to re-enter the vial, because it will not resist contamination between draws.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as sterile water?",
        a: "No. Bacteriostatic water contains 0.9% benzyl alcohol as a preservative, and sterile water contains no preservative at all. That preservative is what lets a bac water vial be used across multiple draws, while sterile water is single-use.",
      },
      {
        q: "Can I use sterile water instead of bac water for peptides?",
        a: "Only if you will draw the entire vial in a single session. For any peptide you plan to draw from more than once, bacteriostatic water is the standard choice because its preservative resists contamination between draws.",
      },
    ],
  },
  {
    slug: "saline",
    otherName: "Saline",
    title: "BAC Water vs Saline",
    metaTitle: "BAC Water vs Saline for Peptides",
    metaDescription:
      "Saline is 0.9% sodium chloride with no preservative. Bac water adds benzyl alcohol for multi-dose use. Bac water is the standard choice for reconstitution.",
    verdict:
      "Plain saline is 0.9% sodium chloride with no preservative, so like sterile water it is single-use once opened. Bacteriostatic water adds a benzyl alcohol preservative that resists contamination across multiple draws. For reconstituting peptides you use over time, bacteriostatic water is the standard choice.",
    table: [
      { dimension: "Contents", bac: "Sterile water plus 0.9% benzyl alcohol", other: "0.9% sodium chloride in water" },
      { dimension: "Preservative", bac: "Yes", other: "No (plain saline)" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "No (plain saline)" },
      { dimension: "Best for", bac: "Peptide reconstitution over days or weeks", other: "Single-use rinsing or dilution" },
    ],
    body: [
      {
        h2: "Preservative, not salt, is the point",
        p: "The practical difference for reconstitution is the preservative, not the salt content. Plain normal saline has no preservative, so an opened vial should be treated as single-use. Bacteriostatic water keeps a multi-dose vial usable, which is why it is the default for peptides drawn over time.",
      },
      {
        h2: "A note on preserved saline",
        p: "Bacteriostatic sodium chloride (0.9% saline with benzyl alcohol) does exist and behaves more like bac water. If your saline is preserved, check the label for benzyl alcohol. Plain saline, the common form, is not preserved.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as saline?",
        a: "No. Saline is 0.9% sodium chloride in water. Bacteriostatic water is sterile water with a 0.9% benzyl alcohol preservative and no added salt. For reconstituting multi-dose peptide vials, bac water is the standard choice because it is preserved.",
      },
      {
        q: "Can I use saline instead of bac water for peptides?",
        a: "Plain saline has no preservative, so an opened vial is single-use. For any peptide you draw more than once, bacteriostatic water is preferred because its preservative resists contamination between draws.",
      },
    ],
  },
  {
    slug: "sodium-chloride",
    otherName: "Sodium Chloride",
    title: "BAC Water vs Sodium Chloride",
    metaTitle: "BAC Water vs Sodium Chloride Solution",
    metaDescription:
      "0.9% sodium chloride is saline: salt water with no preservative. Bac water is preserved sterile water. Use bac water for multi-dose peptide reconstitution.",
    verdict:
      "A 0.9% sodium chloride solution is saline, meaning salt dissolved in water with no preservative in its plain form. Bacteriostatic water is sterile water preserved with benzyl alcohol and no added salt. For reconstituting peptides you draw more than once, use bacteriostatic water.",
    table: [
      { dimension: "Also known as", bac: "Bacteriostatic water, bac water", other: "Normal saline, 0.9% NaCl" },
      { dimension: "Added salt", bac: "No", other: "Yes, 0.9% sodium chloride" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None (plain form)" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "No (plain form)" },
    ],
    body: [
      {
        h2: "Sodium chloride solution is saline",
        p: "0.9% sodium chloride and normal saline are the same thing. The comparison to bacteriostatic water is therefore the same as the saline comparison: the deciding factor for reconstitution is whether the diluent is preserved for multi-dose use, which plain sodium chloride solution is not.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as sodium chloride?",
        a: "No. A 0.9% sodium chloride solution is saline, which contains dissolved salt and, in its plain form, no preservative. Bacteriostatic water is preserved sterile water with no added salt. Bac water is the standard choice for multi-dose peptide reconstitution.",
      },
    ],
  },
  {
    slug: "distilled-water",
    otherName: "Distilled Water",
    title: "BAC Water vs Distilled Water",
    metaTitle: "BAC Water vs Distilled Water for Peptides",
    metaDescription:
      "Distilled, deionized, and tap water are not sterile and not for injection. Only use bacteriostatic or sterile water to reconstitute peptides.",
    verdict:
      "Do not reconstitute peptides with distilled, deionized, or regular tap water. None of them are sterile or intended for injection, so they carry a real contamination risk. Use bacteriostatic water, which is both sterile and preserved for multi-dose use, or sterile water for a single draw.",
    table: [
      { dimension: "Sterile", bac: "Yes", other: "No" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Intended for injection", bac: "Formulated for reconstitution use", other: "No" },
      { dimension: "Safe for peptides", bac: "Yes", other: "No, do not use" },
    ],
    body: [
      {
        h2: "Purity is not the same as sterility",
        p: "Distilled and deionized water are purified to remove minerals, but purification is not sterilization. They can still carry microorganisms and are not manufactured as injectables. Reconstituting a peptide with them risks contaminating the entire vial.",
      },
    ],
    faqs: [
      {
        q: "Can I use distilled water instead of bac water?",
        a: "No. Distilled, deionized, and tap water are not sterile and are not intended for injection. Use bacteriostatic water for multi-dose reconstitution, or sterile water for a single draw.",
      },
    ],
  },
  {
    slug: "benzyl-alcohol",
    otherName: "Benzyl Alcohol",
    title: "BAC Water vs Benzyl Alcohol",
    metaTitle: "BAC Water vs Benzyl Alcohol Explained",
    metaDescription:
      "Benzyl alcohol is not an alternative to bac water. It is the 0.9% preservative inside bac water that makes it bacteriostatic and multi-dose safe.",
    verdict:
      "These are not two competing diluents. Benzyl alcohol is the preservative inside bacteriostatic water. Bac water is simply sterile water with 0.9% benzyl alcohol added. The benzyl alcohol is what suppresses bacterial growth and makes the water bacteriostatic, so you would never reconstitute with benzyl alcohol on its own.",
    table: [
      { dimension: "What it is", bac: "Sterile water plus 0.9% benzyl alcohol", other: "The preservative ingredient itself" },
      { dimension: "Used as a diluent", bac: "Yes", other: "No, it is a component" },
      { dimension: "Role", bac: "Reconstitutes and preserves", other: "Provides the bacteriostatic effect" },
      { dimension: "Concentration in bac water", bac: "0.9%", other: "0.9% of the finished bac water" },
    ],
    body: [
      {
        h2: "Benzyl alcohol is the ingredient, not the alternative",
        p: "If you searched for bac water versus benzyl alcohol, the short answer is that one contains the other. Bacteriostatic water is the finished diluent, and benzyl alcohol is the 0.9% preservative in it. Comparing them is like comparing salt water to salt.",
      },
    ],
    faqs: [
      {
        q: "Is benzyl alcohol the same as bac water?",
        a: "No. Benzyl alcohol is the preservative inside bacteriostatic water. Bac water is sterile water with 0.9% benzyl alcohol added, and that ingredient is what makes it bacteriostatic and safe for multi-dose use.",
      },
    ],
  },
  {
    slug: "acetic-acid",
    otherName: "Acetic Acid",
    title: "BAC Water vs Acetic Acid",
    metaTitle: "BAC Water vs Acetic Acid for Peptides",
    metaDescription:
      "Bac water dissolves most peptides. Dilute acetic acid is only used for specific peptides that will not fully dissolve in water. Bac water is the default.",
    verdict:
      "Bacteriostatic water is the default diluent for most peptides. Dilute acetic acid is a specialty option used only for certain peptides that do not fully dissolve in water. Unless a peptide is specifically noted as hard to dissolve, bacteriostatic water is the correct choice.",
    table: [
      { dimension: "Typical use", bac: "Most peptides", other: "Specific poorly-soluble peptides only" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "Depends on final solution" },
      { dimension: "When to use", bac: "Default choice", other: "Only when a peptide will not dissolve in water" },
    ],
    body: [
      {
        h2: "Acetic acid is a specialty solvent",
        p: "A small number of peptides resist dissolving in plain water. In research settings, a very dilute acetic acid solution is sometimes used to get them into solution first. This is the exception, not the rule. For the vast majority of peptides, bacteriostatic water dissolves the powder cleanly.",
      },
    ],
    faqs: [
      {
        q: "When would I use acetic acid instead of bac water?",
        a: "Only for specific peptides that do not fully dissolve in water. Dilute acetic acid is a specialty solvent for hard-to-dissolve compounds. For most peptides, bacteriostatic water is the correct and standard diluent.",
      },
    ],
  },
  {
    slug: "reconstitution-solution",
    otherName: "Reconstitution Solution",
    title: "BAC Water vs Reconstitution Solution",
    metaTitle: "Is Reconstitution Solution the Same as BAC Water?",
    metaDescription:
      "Reconstitution solution is usually bacteriostatic water under another name. Check the label for 0.9% benzyl alcohol to confirm it is preserved for multi-dose use.",
    verdict:
      "In most cases a product sold as reconstitution solution is bacteriostatic water under a different name. The way to confirm is the label: if it lists 0.9% benzyl alcohol, it is preserved and works exactly like bac water. If it lists no preservative, treat it as single-use like sterile water.",
    table: [
      { dimension: "What it usually is", bac: "Sterile water plus 0.9% benzyl alcohol", other: "Often bacteriostatic water, rebranded" },
      { dimension: "How to confirm", bac: "Labeled bacteriostatic water", other: "Check label for benzyl alcohol" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "Yes if preserved, no if not" },
      { dimension: "Best practice", bac: "Standard choice", other: "Read the ingredients before using" },
    ],
    body: [
      {
        h2: "Read the label to be sure",
        p: "Reconstitution solution is not a single standardized product. Some are simply bacteriostatic water, some are preserved differently, and a few are unpreserved. The only reliable way to know how to handle it is to read the ingredient list and look for a preservative such as benzyl alcohol.",
      },
    ],
    faqs: [
      {
        q: "Is reconstitution solution the same as bac water?",
        a: "Usually yes. Most reconstitution solution is bacteriostatic water sold under a different name. Confirm by checking the label for 0.9% benzyl alcohol. If it is present, it is preserved and works like bac water; if not, treat it as single-use.",
      },
    ],
  },
];

export function findComparison(slug: string): ComparisonTopic | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
