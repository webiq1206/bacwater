/**
 * Question-and-answer copy shared by the visible reference sections and the
 * FAQPage schema on /tools/bac-water. Search Console shows this page and the
 * homepage receiving "how much BAC water" queries, so the questions are worded
 * the way people ask them. Every answer keeps the site's boundary: the
 * product instructions set the volume; the calculator checks the arithmetic.
 */
export const BAC_WATER_FAQS = [
  {
    q: "How do I know how much BAC water to add?",
    a: "The instructions for the exact product, or the stated concentration of an existing solution, set the final volume. Vial strength alone cannot answer it: 10 mg in 1 mL is 10 mg/mL and the same 10 mg in 2 mL is 5 mg/mL. Enter the volume from your instructions and this calculator shows the resulting concentration so you can check the arithmetic.",
  },
  {
    q: "How much BAC water goes in a 5 mg or 10 mg vial?",
    a: "There is no universal volume. As arithmetic only, 5 mg in 1 mL is 5 mg/mL, 5 mg in 2 mL is 2.5 mg/mL, and 10 mg in 2 mL is 5 mg/mL. Which volume applies to a real product comes from its instructions, vial capacity and compatibility, none of which a calculator can verify.",
  },
  {
    q: "Does adding more BAC water change the amount in the vial?",
    a: "No. More liquid lowers the concentration, but the total mass stays the same before any losses. 6 mg in 2 mL is 3 mg/mL; the same 6 mg in 3 mL is 2 mg/mL. Each measured portion then needs a larger volume for the same mass.",
  },
  {
    q: "Is the final volume the same as the water added?",
    a: "Not necessarily. The calculator uses the final solution volume. Dissolved material, losses and vial capacity are not inferred, so use the final volume stated in your instructions or measured for an existing solution.",
  },
] as const;
