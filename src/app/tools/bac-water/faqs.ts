/** Shared visible answers and FAQ schema. Examples are arithmetic, not instructions. */
export const BAC_WATER_FAQS = [
  {
    q: "Can a BAC water calculator choose how much water to add?",
    a: "No. Mass and a measurement amount do not establish a suitable diluent or preparation volume. This calculator needs an independently specified final liquid volume. It calculates concentration and volume equivalents only, not dosing or preparation advice.",
  },
  {
    q: "How is concentration calculated for 5 mg or 10 mg?",
    a: "Divide total mass by final liquid volume. As arithmetic examples, 5 mg in a final volume of 2 mL is 2.5 mg/mL, while 10 mg in 2 mL is 5 mg/mL. These examples do not recommend 2 mL for a product.",
  },
  {
    q: "Does a larger final volume change the total mass?",
    a: "In this mathematical model, the total mass stays constant. A larger final volume lowers concentration: 6 mg in 2 mL is 3 mg/mL; 6 mg in 3 mL is 2 mg/mL. The model assumes a uniform solution and ignores losses.",
  },
  {
    q: "Is water added always the same as final liquid volume?",
    a: "No. Final liquid volume means the total volume of the resulting solution. Added water alone does not establish that volume. The calculator does not estimate powder displacement or account for existing liquid; enter an independently specified final volume.",
  },
  {
    q: "What do U-100 units mean in this calculator?",
    a: "They express a volume scale: 100 U-100 units equals 1 mL, so 8 units equals 0.08 mL. These scale units are not mg, mcg or product IU. A calculated scale equivalent is not an instruction to measure or administer a product.",
  },
] as const;
