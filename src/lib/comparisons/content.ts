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
  sources: string[];
}

export const COMPARISONS: ComparisonTopic[] = [
  {
    "slug": "sterile-water",
    "otherName": "Sterile water",
    "title": "BAC Water vs Sterile Water: Read the Product Label",
    "metaTitle": "BAC Water vs Sterile Water: Read the Product Label",
    "metaDescription": "Compare preservative and container labeling without assuming one water product can replace another. Drug-specific compatibility comes before concentration math.",
    "verdict": "The names do not make these products interchangeable. Bacteriostatic water contains a preservative; a sterile-water product can have different ingredients, container instructions and intended uses.",
    "table": [
      {
        "dimension": "Preservative",
        "bac": "Check benzyl alcohol label",
        "other": "Check exact product"
      },
      {
        "dimension": "Container",
        "bac": "Multi-dose labeling",
        "other": "Read package designation"
      },
      {
        "dimension": "Substitution",
        "bac": "Product-specific",
        "other": "Not decided by name"
      }
    ],
    "body": [
      {
        "h2": "Sterile describes a property, not a complete formula.",
        "p": "Do not use the word sterile alone as a list of ingredients. Read the full product name, preservative information and container designation. Single-dose instructions and multi-dose instructions are different, and preservative does not make contamination impossible."
      },
      {
        "h2": "Compatibility is the deciding question.",
        "p": "The drug instructions determine which vehicle is appropriate. A plan to access a container repeatedly does not override those instructions. The earlier statement on this site that BAC water can always replace sterile water was incorrect."
      }
    ],
    "faqs": [
      {
        "q": "Can a calculator choose between them?",
        "a": "No. A concentration calculation uses a stated amount and final volume. It cannot establish vehicle compatibility, a storage period or an aseptic preparation method."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water",
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html"
    ]
  },
  {
    "slug": "saline",
    "otherName": "Saline",
    "title": "BAC Water vs Saline: Salt and Preservative Are Different",
    "metaTitle": "BAC Water vs Saline: Salt and Preservative Are Different",
    "metaDescription": "Saline is not one universal product. Compare sodium chloride content, preservative labeling and intended use before considering a substitution.",
    "verdict": "Saline and BAC water are different descriptions. Saline identifies a salt solution, while bacteriostatic describes inhibition of bacterial growth. The words alone do not establish a complete formulation or a suitable substitute.",
    "table": [
      {
        "dimension": "Salt",
        "bac": "No sodium chloride listed",
        "other": "Check salt concentration"
      },
      {
        "dimension": "Preservative",
        "bac": "Benzyl alcohol on label",
        "other": "May be present or absent"
      },
      {
        "dimension": "Purpose",
        "bac": "Specified diluent uses",
        "other": "Read intended-use label"
      }
    ],
    "body": [
      {
        "h2": "Do not assume all saline is preservative-free.",
        "p": "Bacteriostatic sodium chloride is one preserved saline product. Saline products also differ by concentration and intended use. A nasal, irrigation or other saline label should not be treated as an interchangeable injection diluent."
      },
      {
        "h2": "Check salt and preservative separately.",
        "p": "The name, sodium chloride percentage, preservative statement and container instructions are separate fields to verify. The comparison with bacteriostatic sodium chloride addresses the case where both products contain a preservative."
      }
    ],
    "faqs": [
      {
        "q": "Does the same salt percentage make two products equivalent?",
        "a": "No. An ingredient percentage does not identify every ingredient, the product quality controls, intended use or compatibility instructions."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/sodium-chloride-injection",
      "https://www.pfizermedical.com/bacteriostatic-water"
    ]
  },
  {
    "slug": "sodium-chloride",
    "otherName": "Preserved saline",
    "title": "BAC Water vs Bacteriostatic Sodium Chloride",
    "metaTitle": "BAC Water vs Bacteriostatic Sodium Chloride",
    "metaDescription": "Both labels can include benzyl alcohol. The sodium chloride content is a separate difference; compare exact formulations rather than using saline as a synonym for water.",
    "verdict": "These two labeled products can both contain benzyl alcohol. Bacteriostatic sodium chloride also contains salt. Preservative presence therefore does not make their formulations identical.",
    "table": [
      {
        "dimension": "Salt",
        "bac": "No sodium chloride listed",
        "other": "0.9% sodium chloride"
      },
      {
        "dimension": "Preservative",
        "bac": "Read product concentration",
        "other": "0.9% benzyl alcohol"
      },
      {
        "dimension": "Exchangeable?",
        "bac": "Check drug instructions",
        "other": "Check drug instructions"
      }
    ],
    "body": [
      {
        "h2": "The two percentages describe different ingredients.",
        "p": "Pfizer describes its Bacteriostatic 0.9% Sodium Chloride Injection as containing 9 mg/mL sodium chloride and 9 mg/mL benzyl alcohol. The repeated number does not mean the two ingredients are the same thing."
      },
      {
        "h2": "A preserved product is not automatically the specified vehicle.",
        "p": "Read the drug-specific preparation instructions, not just the word bacteriostatic. This page addresses preserved saline; the broader saline comparison explains why the general label does not tell you whether preservative is present."
      }
    ],
    "faqs": [
      {
        "q": "Is BAC water sodium chloride?",
        "a": "No. Do not use BAC water as a synonym for saline. Identify the actual ingredients and intended use on the container rather than relying on an abbreviation."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/sodium-chloride-injection",
      "https://www.pfizermedical.com/bacteriostatic-water"
    ]
  },
  {
    "slug": "distilled-water",
    "otherName": "Distilled water",
    "title": "BAC Water vs Distilled Water: Process Is Not Product Grade",
    "metaTitle": "BAC Water vs Distilled Water: Process Is Not Product Grade",
    "metaDescription": "Distilled describes a purification process. It does not by itself establish sterility, pharmaceutical grade, preservatives or suitability as an injection diluent.",
    "verdict": "Distilled is not a complete product specification. A purification description alone does not establish a sterile pharmaceutical product, an intended administration route or compatibility with another substance.",
    "table": [
      {
        "dimension": "Description",
        "bac": "Labeled pharmaceutical vehicle",
        "other": "Purification description"
      },
      {
        "dimension": "Preservative",
        "bac": "Read product label",
        "other": "Not implied by the word"
      },
      {
        "dimension": "Suitability",
        "bac": "Exact product instructions",
        "other": "Not established by name"
      }
    ],
    "body": [
      {
        "h2": "Read the intended use, not just the water source.",
        "p": "Household or laboratory water should not be treated as an injection product merely because the label says distilled. Conversely, a purification method alone cannot tell you the entire status of every finished product made from that water."
      },
      {
        "h2": "No home preparation recipe follows from this comparison.",
        "p": "Combining purified water and a preservative does not reproduce a finished product's manufacturing, testing or packaging controls. This site provides no recipe for making an injectable vehicle."
      }
    ],
    "faqs": [
      {
        "q": "Will a concentration calculator detect the wrong water?",
        "a": "No. The same arithmetic can produce a number for an unsuitable mixture. Input validation is not a sterility, identity or compatibility test."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ]
  },
  {
    "slug": "benzyl-alcohol",
    "otherName": "Benzyl alcohol",
    "title": "BAC Water vs Benzyl Alcohol: Ingredient vs Finished Product",
    "metaTitle": "BAC Water vs Benzyl Alcohol: Ingredient vs Finished Product",
    "metaDescription": "Benzyl alcohol is an ingredient, not another name for bacteriostatic water. Product concentration, intended use and manufacturing controls still matter.",
    "verdict": "Benzyl alcohol and BAC water are not synonyms. One is a chemical ingredient; the other is a finished water product whose label states its preservative content and intended uses.",
    "table": [
      {
        "dimension": "Identity",
        "bac": "Finished labeled solution",
        "other": "An ingredient"
      },
      {
        "dimension": "Concentration",
        "bac": "Stated on product label",
        "other": "Depends on supplied product"
      },
      {
        "dimension": "Use",
        "bac": "Follow exact instructions",
        "other": "Not a ready substitute"
      }
    ],
    "body": [
      {
        "h2": "Read the percentage on the actual product.",
        "p": "Do not assume every water label has the same preservative concentration. The manufacturer's label is the reference, not an internet recipe or a familiar abbreviation."
      },
      {
        "h2": "An ingredient does not reproduce a finished vehicle.",
        "p": "This comparison is not a formulation recipe. Ingredient purity, concentration and finished-product requirements cannot be verified by the calculator. Do not interpret a correct percentage calculation as an approval to prepare a vehicle."
      }
    ],
    "faqs": [
      {
        "q": "Does preservative remove all contamination risk?",
        "a": "No. CDC states that preservatives do not provide complete protection against contamination. Product handling and discard instructions still apply."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water",
      "https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html"
    ]
  },
  {
    "slug": "acetic-acid",
    "otherName": "Acetic acid solution",
    "title": "BAC Water vs Acetic Acid Solution: Check the Formulation",
    "metaTitle": "BAC Water vs Acetic Acid Solution: Check the Formulation",
    "metaDescription": "An acetic acid concentration does not identify a complete reconstitution product. Confirm the specified solvent, grade, additives and intended use.",
    "verdict": "A solution labeled with acetic acid is not automatically equivalent to BAC water. Its acid concentration, other ingredients and intended use need to be identified before compatibility can be considered.",
    "table": [
      {
        "dimension": "Named ingredient",
        "bac": "Preservative in water",
        "other": "Acetic acid concentration"
      },
      {
        "dimension": "Acidity",
        "bac": "Read actual label",
        "other": "Read actual label"
      },
      {
        "dimension": "Compatibility",
        "bac": "Product-specific",
        "other": "Product-specific"
      }
    ],
    "body": [
      {
        "h2": "Avoid a universal solvent rule.",
        "p": "This site does not select a solvent from a compound name. The product or validated laboratory method must specify the vehicle and conditions. An acidity description is not a substitute for that information."
      },
      {
        "h2": "Keep consumer and product instructions separate.",
        "p": "A household acid product is not identified as a suitable pharmaceutical vehicle by the shared ingredient name. No home-dilution or substitution procedure is provided here."
      }
    ],
    "faqs": [
      {
        "q": "Can a cleaner syringe mark justify changing the solvent?",
        "a": "No. A convenient displayed volume is an arithmetic property, not evidence that another solvent is compatible or appropriate."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ]
  },
  {
    "slug": "reconstitution-solution",
    "otherName": "Reconstitution solution",
    "title": "BAC Water vs Reconstitution Solution: What the Label Must Say",
    "metaTitle": "BAC Water vs Reconstitution Solution: What the Label Must Say",
    "metaDescription": "Reconstitution solution is a purpose description, not a complete ingredient list. Check the named vehicle, concentration, additives and product instructions.",
    "verdict": "Reconstitution solution describes a purpose, not one universal formula. It may not identify the same contents as a product labeled Bacteriostatic Water for Injection.",
    "table": [
      {
        "dimension": "Name",
        "bac": "Identifies a water product",
        "other": "Describes a purpose"
      },
      {
        "dimension": "Ingredients",
        "bac": "Read product label",
        "other": "Must be separately stated"
      },
      {
        "dimension": "Storage",
        "bac": "Exact product instructions",
        "other": "Exact product instructions"
      }
    ],
    "body": [
      {
        "h2": "Resolve an incomplete label before calculating.",
        "p": "Look for the full vehicle name, concentrations, preservative statement, intended use and the accompanying product instructions. A vendor nickname does not supply missing formulation details."
      },
      {
        "h2": "Do not infer a mixing volume from vial strength.",
        "p": "A milligram total can be divided by many different volumes. A calculator cannot select the intended formulation from those mathematical possibilities. Use a stated final volume or concentration before comparing results."
      }
    ],
    "faqs": [
      {
        "q": "Is reconstitution solution always BAC water?",
        "a": "No such equivalence follows from the phrase alone. Verify what the supplied container actually contains and which product instructions apply."
      }
    ],
    "sources": [
      "https://www.pfizermedical.com/bacteriostatic-water"
    ]
  }
];
export function findComparison(slug: string): ComparisonTopic | undefined { return COMPARISONS.find((c) => c.slug === slug); }
