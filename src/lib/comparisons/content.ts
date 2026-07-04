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
      "If you will use a vial more than once, pick BAC water. It has a preservative (a germ-fighting ingredient) that stops germs from growing, so the vial stays good for weeks. Sterile water has no preservative. Once you open it, use it one time and throw it away. That one preservative is the whole difference.",
    table: [
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Multi-dose safe", bac: "Yes, about 28 days refrigerated", other: "No, single use" },
      { dimension: "Best for", bac: "Reconstituting peptides drawn over days or weeks", other: "One-time single-draw use" },
      { dimension: "Shelf life after opening", bac: "About 28 days refrigerated", other: "Discard after one use" },
    ],
    body: [
      {
        h2: "Why the preservative matters",
        p: "Each time you put a needle into a vial, you add a small risk of germs getting in. The benzyl alcohol (germ-fighting preservative) in BAC water stops germs from growing. This is what lets you use one vial over days or weeks. Sterile water has none of this protection. That is why it is meant for a single draw only.",
      },
      {
        h2: "Can you substitute one for the other?",
        p: "You can use BAC water any time sterile water is called for. The preservative does not harm the peptide. But do not use sterile water in place of BAC water if you plan to draw from the vial more than once. It cannot fight germs between draws.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as sterile water?",
        a: "No. BAC water has 0.9% benzyl alcohol (a germ-fighting preservative). Sterile water has no preservative at all. That is why you can use a BAC water vial many times, but sterile water is one-time use only.",
      },
      {
        q: "Can I use sterile water instead of bac water for peptides?",
        a: "Only if you will use the whole vial in one sitting. For any peptide you draw more than once, BAC water is the standard choice. Its preservative fights germs between draws.",
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
      "Plain saline is salt water (0.9% sodium chloride). It has no preservative, so like sterile water it is one-time use once opened. BAC water adds benzyl alcohol (a germ-fighting preservative) that fights germs across many draws. For peptides you use over time, BAC water is the standard choice.",
    table: [
      { dimension: "Contents", bac: "Sterile water plus 0.9% benzyl alcohol", other: "0.9% sodium chloride in water" },
      { dimension: "Preservative", bac: "Yes", other: "No (plain saline)" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "No (plain saline)" },
      { dimension: "Best for", bac: "Peptide reconstitution over days or weeks", other: "Single-use rinsing or dilution" },
    ],
    body: [
      {
        h2: "Preservative, not salt, is the point",
        p: "For mixing peptides, the key difference is the preservative, not the salt. Plain saline has no preservative. Once you open a vial, use it one time only. BAC water keeps a vial safe to use many times. That is why it is the go-to for peptides used over time.",
      },
      {
        h2: "A note on preserved saline",
        p: "There is also a preserved saline (0.9% saline with benzyl alcohol added). It acts more like BAC water. If your saline is preserved, check the label for benzyl alcohol. Plain saline is the common kind, and it is not preserved.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as saline?",
        a: "No. Saline is salt water (0.9% sodium chloride). BAC water is sterile water with 0.9% benzyl alcohol (a germ-fighting preservative) and no added salt. For mixing peptide vials you use many times, BAC water is the standard choice because it is preserved.",
      },
      {
        q: "Can I use saline instead of bac water for peptides?",
        a: "Plain saline has no preservative, so an opened vial is one-time use. For any peptide you draw more than once, BAC water is better. Its preservative fights germs between draws.",
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
      "A 0.9% sodium chloride solution is just saline, which means salt mixed into water. In its plain form it has no preservative. BAC water is sterile water kept safe with benzyl alcohol (a germ-fighting preservative), and it has no added salt. For peptides you draw more than once, use BAC water.",
    table: [
      { dimension: "Also known as", bac: "Bacteriostatic water, bac water", other: "Normal saline, 0.9% NaCl" },
      { dimension: "Added salt", bac: "No", other: "Yes, 0.9% sodium chloride" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None (plain form)" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "No (plain form)" },
    ],
    body: [
      {
        h2: "Sodium chloride solution is saline",
        p: "0.9% sodium chloride and normal saline are the same thing. So this comparison is the same as the saline one. The thing that matters for mixing peptides is whether the liquid has a preservative for many uses. Plain sodium chloride solution does not.",
      },
    ],
    faqs: [
      {
        q: "Is bac water the same as sodium chloride?",
        a: "No. A 0.9% sodium chloride solution is saline. It has salt in it and, in its plain form, no preservative. BAC water is preserved sterile water with no added salt. BAC water is the standard choice for mixing peptides you use many times.",
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
      "Do not mix peptides with distilled, deionized, or tap water. None of these are sterile. None are made for injection. They carry a real risk of germs. Use BAC water, which is sterile and preserved for many uses. Or use sterile water for a single draw.",
    table: [
      { dimension: "Sterile", bac: "Yes", other: "No" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Intended for injection", bac: "Formulated for reconstitution use", other: "No" },
      { dimension: "Safe for peptides", bac: "Yes", other: "No, do not use" },
    ],
    body: [
      {
        h2: "Clean is not the same as germ-free",
        p: "Distilled and deionized water are cleaned to take out minerals. But clean is not the same as germ-free. They can still hold germs. They are not made for injection. Mixing a peptide with them can put germs in the whole vial.",
      },
    ],
    faqs: [
      {
        q: "Can I use distilled water instead of bac water?",
        a: "No. Distilled, deionized, and tap water are not sterile. They are not made for injection. Use BAC water for peptides you use many times, or sterile water for a single draw.",
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
      "These are not two rival liquids. Benzyl alcohol is the preservative inside BAC water. BAC water is just sterile water with 0.9% benzyl alcohol (a germ-fighting ingredient) added. The benzyl alcohol is what stops germs from growing. So you would never mix a peptide with benzyl alcohol by itself.",
    table: [
      { dimension: "What it is", bac: "Sterile water plus 0.9% benzyl alcohol", other: "The preservative ingredient itself" },
      { dimension: "Used as a diluent", bac: "Yes", other: "No, it is a component" },
      { dimension: "Role", bac: "Reconstitutes and preserves", other: "Provides the bacteriostatic effect" },
      { dimension: "Concentration in bac water", bac: "0.9%", other: "0.9% of the finished bac water" },
    ],
    body: [
      {
        h2: "Benzyl alcohol is the ingredient, not the alternative",
        p: "If you looked up BAC water versus benzyl alcohol, here is the short answer. One is part of the other. BAC water is the finished liquid you mix with. Benzyl alcohol is the 0.9% preservative inside it. Comparing them is like comparing salt water to salt.",
      },
    ],
    faqs: [
      {
        q: "Is benzyl alcohol the same as bac water?",
        a: "No. Benzyl alcohol is the preservative inside BAC water. BAC water is sterile water with 0.9% benzyl alcohol added. That ingredient is what fights germs and makes the vial safe to use many times.",
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
      "BAC water is the go-to liquid for mixing most peptides. Dilute acetic acid (weak vinegar acid) is a special option. It is only used for a few peptides that will not fully dissolve in water. Unless a peptide is marked as hard to dissolve, BAC water is the right choice.",
    table: [
      { dimension: "Typical use", bac: "Most peptides", other: "Specific poorly-soluble peptides only" },
      { dimension: "Preservative", bac: "0.9% benzyl alcohol", other: "None" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "Depends on final solution" },
      { dimension: "When to use", bac: "Default choice", other: "Only when a peptide will not dissolve in water" },
    ],
    body: [
      {
        h2: "Acetic acid is a special-case solvent",
        p: "A few peptides will not dissolve in plain water. In research, a very weak acetic acid (vinegar acid) solution is sometimes used to get them to dissolve first. This is the rare case, not the rule. For almost all peptides, BAC water dissolves the powder just fine.",
      },
    ],
    faqs: [
      {
        q: "When would I use acetic acid instead of bac water?",
        a: "Only for certain peptides that will not fully dissolve in water. Dilute acetic acid (weak vinegar acid) is a special-case solvent for hard-to-dissolve powders. For most peptides, BAC water is the right and standard choice.",
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
      "Most of the time, a product sold as \"reconstitution solution\" is just BAC water under a different name. The way to be sure is to read the label. If it lists 0.9% benzyl alcohol (a germ-fighting preservative), it works just like BAC water. If it lists no preservative, treat it as one-time use like sterile water.",
    table: [
      { dimension: "What it usually is", bac: "Sterile water plus 0.9% benzyl alcohol", other: "Often bacteriostatic water, rebranded" },
      { dimension: "How to confirm", bac: "Labeled bacteriostatic water", other: "Check label for benzyl alcohol" },
      { dimension: "Multi-dose safe", bac: "Yes", other: "Yes if preserved, no if not" },
      { dimension: "Best practice", bac: "Standard choice", other: "Read the ingredients before using" },
    ],
    body: [
      {
        h2: "Read the label to be sure",
        p: "\"Reconstitution solution\" is not one set product. Some kinds are just BAC water. Some use a different preservative. A few have no preservative at all. The only safe way to know how to use it is to read the ingredient list. Look for a preservative like benzyl alcohol.",
      },
    ],
    faqs: [
      {
        q: "Is reconstitution solution the same as bac water?",
        a: "Usually yes. Most reconstitution solution is BAC water sold under a different name. To be sure, check the label for 0.9% benzyl alcohol. If it is there, it works like BAC water. If not, treat it as one-time use.",
      },
    ],
  },
];

export function findComparison(slug: string): ComparisonTopic | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
