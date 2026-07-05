/**
 * Static HowTo structured-data definitions for eligible instructional guides.
 *
 * Each entry maps a guide slug to the supplies, tools, totalTime, and ordered
 * steps that should be emitted as HowTo JSON-LD alongside the ArticleJsonLd on
 * the /learn/[slug] route. Only add slugs whose visible content actually
 * describes an ordered process with discrete steps.
 */

export interface HowToStep {
  name?: string;
  text: string;
}

export interface HowToSchema {
  description?: string;
  supplies?: string[];
  tools?: string[];
  totalTime?: string;
  steps: HowToStep[];
}

export const HOWTO_SCHEMAS: Record<string, HowToSchema> = {
  "how-to-reconstitute-bpc-157": {
    description:
      "A step-by-step guide to reconstituting a BPC-157 peptide vial using bacteriostatic water and an insulin syringe.",
    totalTime: "PT10M",
    supplies: [
      "BPC-157 vial (typically 5 mg)",
      "Bacteriostatic water (BAC water), 30 mL vial",
      "Insulin syringe (1 mL / 100 units recommended)",
      "Alcohol prep pads",
    ],
    steps: [
      {
        name: "Prepare your workspace",
        text: "Clean your surface and wash your hands. Gather your vial, BAC water, syringe, and alcohol pads.",
      },
      {
        name: "Swab both vial tops",
        text: "Use a fresh alcohol prep pad on the rubber stopper of both the BPC-157 vial and the BAC water vial. Let them air dry for a few seconds.",
      },
      {
        name: "Draw BAC water",
        text: "For a 5 mg vial, draw 2 mL of BAC water. This creates a concentration of 2.5 mg/mL, which makes a 250 mcg dose exactly 10 units on a U-100 syringe.",
      },
      {
        name: "Add water to the peptide vial",
        text: "Insert the needle into the BPC-157 vial at an angle. Let the water run slowly down the inside wall of the vial. Do not spray it directly onto the powder.",
      },
      {
        name: "Swirl gently",
        text: "Roll the vial between your palms. Never shake. Shaking can denature the peptide.",
      },
      {
        name: "Confirm clarity",
        text: "The solution should be completely clear with no visible particles. If powder remains, wait a few minutes and swirl again.",
      },
    ],
  },

  "how-to-reconstitute-tirzepatide": {
    description:
      "A step-by-step guide to reconstituting a tirzepatide vial using bacteriostatic water and an insulin syringe.",
    totalTime: "PT10M",
    supplies: [
      "Tirzepatide vial (common strengths: 5 mg, 10 mg, 15 mg)",
      "Bacteriostatic water (BAC water)",
      "Insulin syringe (0.5 mL or 1 mL)",
      "Alcohol prep pads",
    ],
    steps: [
      {
        name: "Swab vial tops",
        text: "Clean both the tirzepatide vial and BAC water vial rubber stoppers with separate alcohol pads.",
      },
      {
        name: "Draw BAC water",
        text: "The amount depends on your vial strength and desired dose. For a 10 mg vial, adding 1 mL of BAC water creates a 10 mg/mL concentration. Use a BAC water calculator for the exact amount based on your dose.",
      },
      {
        name: "Add water to the vial",
        text: "Inject the BAC water slowly down the side of the vial. Avoid direct contact with the powder.",
      },
      {
        name: "Dissolve gently",
        text: "Roll the vial between your palms. Tirzepatide typically dissolves quickly. The solution should be clear and colorless.",
      },
    ],
  },

  "how-to-reconstitute-semaglutide": {
    description:
      "A step-by-step guide to reconstituting a semaglutide vial using bacteriostatic water and an insulin syringe.",
    totalTime: "PT10M",
    supplies: [
      "Semaglutide vial (common strengths: 3 mg, 5 mg)",
      "Bacteriostatic water (BAC water)",
      "Insulin syringe (0.5 mL or 1 mL)",
      "Alcohol prep pads",
    ],
    steps: [
      {
        name: "Clean vial tops",
        text: "Swab both vial stoppers with alcohol prep pads.",
      },
      {
        name: "Draw BAC water",
        text: "For a 5 mg vial, adding 2.5 mL of BAC water creates a concentration of 2 mg/mL. Adjust based on your target dose using a BAC water calculator.",
      },
      {
        name: "Inject slowly",
        text: "Angle the needle so the water runs down the glass wall of the vial. Do not aim directly at the powder.",
      },
      {
        name: "Mix gently",
        text: "Roll the vial between your palms until the powder is fully dissolved. The solution should be clear.",
      },
    ],
  },

  "how-to-read-an-insulin-syringe": {
    description:
      "How to read the unit markings on an insulin syringe and draw an accurate dose.",
    tools: ["Insulin syringe (U-100, 1 mL, 0.5 mL, or 0.3 mL)"],
    steps: [
      {
        name: "Identify your syringe size",
        text: "Insulin syringes come in three common sizes: 1 mL (100 units) with marks every 2 units, 0.5 mL (50 units) with marks every 1 unit, and 0.3 mL (30 units) with marks every half-unit.",
      },
      {
        name: "Read the level at eye level",
        text: "Hold the syringe horizontally at eye level. Read the measurement from the top edge of the plunger (the flat rubber surface), not from the tip of the needle or the bottom of the plunger.",
      },
      {
        name: "Pull the plunger to your dose",
        text: "Pull the plunger back to the line matching your dose in units. On a U-100 syringe, 10 units equals 0.10 mL.",
      },
      {
        name: "Insert the needle and draw",
        text: "Insert the needle into the inverted vial. Push the air in, then pull back past your target mark. Tap out air bubbles, then push the plunger back to the exact line.",
      },
    ],
  },
};
