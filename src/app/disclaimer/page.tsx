export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">Disclaimer</h1>
      <div className="mt-6 prose prose-neutral max-w-none text-foreground/90 space-y-4">
        <p>
          BACWater.ai is an educational and research tool. Content on this site
          does not constitute medical, veterinary, or professional advice, and
          nothing here should be interpreted as diagnosing, treating, curing,
          or preventing any condition.
        </p>
        <p>
          Products offered through BACWater.ai — including bacteriostatic
          water, syringes, and alcohol prep pads — are sold for laboratory
          research and educational use only.
        </p>
        <p>
          Our calculators use deterministic formulas verified with automated
          tests. Even so, you are responsible for verifying the values printed
          on your vial and your syringe. Small mislabels can produce large
          dosing errors. When in doubt, consult a qualified professional.
        </p>
        <p>
          By using this site, you accept full responsibility for your use of
          the information and products offered.
        </p>
      </div>
    </div>
  );
}
