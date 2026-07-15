/**
 * Short, tooltip-sized plain-English glosses for the jargon that appears across
 * the site. Kept deliberately simple (aim: a young reader can follow them).
 * Used by the <Term> component on the first use of a hard word in JSX copy.
 * For plain-string copy (DB guides, content data) we inline the gloss instead.
 */
export const GLOSS: Record<string, string> = {
  "bac-water":
    "Sterile water with a preservative (benzyl alcohol) in it. Sterile means it had no germs in it when it was made. The preservative slows germs from growing, so you can use the same vial more than once. It is not safe for newborn babies.",
  reconstitute:
    "To mix dried powder with liquid so you can use it. You add BAC water to the peptide.",
  diluent:
    "The liquid you add to the powder. For peptides, that liquid is usually BAC water.",
  lyophilized:
    "Dried into a powder by freezing, so it lasts a long time before you mix it.",
  concentration:
    "How much peptide is in each 1 mL of liquid. More water makes it weaker; less makes it stronger.",
  "benzyl-alcohol":
    "The preservative in BAC water. It slows germs from growing. It is not safe for newborn babies.",
  preservative:
    "An ingredient that slows germs from growing. It does not stop all germs.",
  "u-100":
    "The marks on an insulin syringe. 100 units equal 1 mL, so 10 units is a tenth of a mL.",
  subcutaneous: "Just under the skin, in the soft fatty layer.",
  secretagogue:
    "A peptide studied for nudging the body's own growth-hormone signals.",
  sterile: "It had no germs in it when it was made.",
};
