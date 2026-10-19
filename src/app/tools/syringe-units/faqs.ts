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
    a: "100 units. U-100 means 100 units in every mL. So 1 mL is 100 units, 0.5 mL is 50 units and 0.1 mL is 10 units. This is true for the small 0.3 mL, the 0.5 mL and the 1 mL insulin syringes. They only differ in how much they hold and how far apart the lines are.",
  },
  {
    q: "How many units is 2 mL of BAC water?",
    a: "2 mL × 100 = 200 units. A 1 mL insulin syringe only holds 100 units, so you cannot draw 2 mL in one go with it. To add 2 mL of BAC water to a vial, people usually use a bigger syringe or fill the insulin syringe twice.",
  },
  {
    q: "How many U-100 units are in 0.5 mL?",
    a: "0.5 mL × 100 = 50 units. Going back, 50 ÷ 100 = 0.5 mL. In the same way, 0.25 mL is 25 units and 0.1 mL is 10 units.",
  },
  {
    q: "Can you convert mg directly to syringe units?",
    a: "Not directly. mg is powder, units is liquid. You first need to know how many mg are in each mL of your mixed vial. Then: dose ÷ mg per mL = mL, and mL × 100 = units. For example, 0.5 mg at 2 mg per mL is 0.25 mL, which is the 25 line. The BAC water calculator does all of this from your vial amount, your dose and the water you add.",
  },
] as const;
