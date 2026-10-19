/**
 * Question-and-answer copy shared by the visible reference sections and the
 * FAQPage schema on /tools/bac-water. Search Console shows this page and the
 * homepage receiving "how much BAC water" queries, so the questions are worded
 * the way people ask them and each answer starts with a direct, plain reply.
 */
export const BAC_WATER_FAQS = [
  {
    q: "How do I know how much BAC water to add?",
    a: "First check the instructions that came with your product. If they say an amount, use that. If they do not, type your vial amount and your dose into the calculator and tap Suggest an amount for me. It picks a common amount, usually 1 to 3 mL, that makes your dose land on an easy line of an insulin syringe. Any amount works for the math. It only changes how far you fill the syringe.",
  },
  {
    q: "How much BAC water goes in a 5 mg or 10 mg vial?",
    a: "It depends on your dose. For many doses, 2 mL is a comfortable amount. As math only: 5 mg in 2 mL is 2.5 mg per mL, so a 250 mcg dose is the 10 line on an insulin syringe. 10 mg in 2 mL is 5 mg per mL, so the same 250 mcg dose is the 5 line. Type your own numbers to see your lines.",
  },
  {
    q: "Does adding more BAC water change the amount in the vial?",
    a: "No. The powder in the vial stays the same. More water only spreads it out, so each mL is weaker and you fill the syringe a little further for the same dose. 6 mg in 2 mL is 3 mg per mL. The same 6 mg in 3 mL is 2 mg per mL.",
  },
  {
    q: "Is the BAC water amount the same as the final liquid volume?",
    a: "For a normal dry powder vial, yes, close enough for this math. The powder adds almost no volume. If your vial already has liquid in it, type the total liquid after you add the water instead.",
  },
] as const;
