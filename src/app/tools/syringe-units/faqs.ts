/**
 * Question-and-answer copy shared by the visible reference sections and the
 * FAQPage schema on /tools/syringe-units. Search Console shows this page
 * receiving "how many units is X mL" style queries, so each heading is the
 * question as people phrase it and each answer is a self-contained sentence.
 * These are scale conversions only, never a dose or a device selection.
 */
export const SYRINGE_UNIT_FAQS = [
  {
    q: "How many units are in 1 mL on a U-100 syringe?",
    a: "100 units. U-100 means 100 units per mL, so 1 mL = 100 units, 0.5 mL = 50 units and 0.1 mL = 10 units. The same ratio applies to a 0.3 mL, 0.5 mL or 1 mL U-100 syringe; only the capacity and the printed graduation spacing differ.",
  },
  {
    q: "How many units is 2 mL of BAC water?",
    a: "2 mL × 100 = 200 U-100 units. That is more than a 1 mL insulin syringe holds, so the arithmetic does not mean a single draw. Check the actual device capacity and the product instructions; the converter only shows the scale relationship.",
  },
  {
    q: "How many U-100 units are in 0.5 mL?",
    a: "0.5 mL × 100 = 50 U-100 units. To check the reverse calculation, divide 50 by 100 to get 0.5 mL. The same ratio gives 25 units for 0.25 mL and 10 units for 0.1 mL.",
  },
  {
    q: "Can you convert mg directly to syringe units?",
    a: "No. Milligrams measure mass, while the U-100 scale corresponds to volume. You also need the concentration in mg/mL. Divide your stated amount by that concentration to get mL, then multiply mL by 100 for the U-100 scale equivalent. For example, 0.5 mg at 2 mg/mL is 0.25 mL, or 25 U-100 units. These are illustrative numbers, not a recommended amount or device.",
  },
] as const;
