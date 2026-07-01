import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Disclaimer"
        description="Disclaimer for BACwater.ai."
        url="/disclaimer"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Disclaimer", url: "/disclaimer" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer", href: "/disclaimer" }]} />
      <div className="eyebrow">Legal</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">Disclaimer</h1>
      <div className="mt-6 prose prose-neutral max-w-none text-foreground/90 space-y-4">
        <p>
          BACwater.ai is an educational and research tool. Content on this site
          does not constitute medical, veterinary, or professional advice, and
          nothing here should be interpreted as diagnosing, treating, curing,
          or preventing any condition.
        </p>
        <p>
          Products offered through BACwater.ai, including bacteriostatic
          water, syringes, and alcohol prep pads, are sold for laboratory
          research and educational use only.
        </p>
        <p>
          Our calculators use verified, transparent formulas backed by
          automated tests. Even so, you are responsible for verifying the
          values printed on your vial and your syringe. Small mislabels can
          produce large dosing errors. When in doubt, consult a qualified
          professional.
        </p>
        <p>
          By using this site, you accept full responsibility for your use of
          the information and products offered.
        </p>
      </div>
    </div>
  );
}
