import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/dose" },
  title: "Dose Calculator - mcg to Syringe Units",
  description:
    "Enter your vial concentration and the volume you measure to calculate your exact amount in mcg, mg, and insulin syringe units. Shows the math step by step.",
  openGraph: {
    title: "Dose Calculator - mcg to Syringe Units",
    description:
      "Enter your vial concentration and the volume you measure to calculate your exact amount in mcg, mg, and insulin syringe units. Shows the math step by step.",
    url: "/tools/dose",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Dose Calculator"
        description="Enter your vial concentration and the volume you measure to calculate your exact amount in mcg, mg, and insulin syringe units. Shows the math step by step."
        url="/tools/dose"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Dose Calculator", url: "/tools/dose" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>The amount you measure depends on two things: the concentration of your reconstituted peptide (mg/mL) and the volume you measure.</strong>{" "}
            On a U-100 insulin syringe, 10 units = 0.1 mL. If your concentration is 2.5 mg/mL and you measure 10 units (0.1 mL), the amount is 250 mcg. Enter your values below to calculate your exact amount in mcg, mg, and syringe units.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">How peptide reconstitution works</Link></li>
            <li><Link href="/learn/what-syringe-units-mean" className="text-muted-foreground hover:text-foreground underline transition-colors">What syringe units mean</Link></li>
            <li><Link href="/learn/how-to-read-an-insulin-syringe" className="text-muted-foreground hover:text-foreground underline transition-colors">How to read an insulin syringe</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "Dose Calculator",
            description:
              "Calculate your exact amount in mcg, mg, and insulin syringe units from your vial concentration and the volume you measure.",
            url: "/tools/dose",
          }}
          quickRef={{
            head: ["Concentration", "Measure (units)", "Volume", "Amount"],
            rows: [
              ["1 mg/mL", "10 units", "0.1 mL", "100 mcg"],
              ["2.5 mg/mL", "10 units", "0.1 mL", "250 mcg"],
              ["2.5 mg/mL", "20 units", "0.2 mL", "500 mcg"],
              ["5 mg/mL", "10 units", "0.1 mL", "500 mcg"],
              ["5 mg/mL", "20 units", "0.2 mL", "1,000 mcg"],
            ],
            caption:
              "On a U-100 syringe, 10 units equals 0.1 mL. Amount (mcg) = concentration (mg/mL) x volume (mL) x 1,000.",
          }}
          faqs={[
            {
              q: "How do I calculate the amount from concentration?",
              a: "Multiply the concentration (mg/mL) by the volume you measure (mL), then multiply by 1,000 to get micrograms. For example, 2.5 mg/mL measured at 0.1 mL is 250 mcg.",
            },
            {
              q: "How many units should I measure for 250 mcg?",
              a: "It depends on concentration. At 2.5 mg/mL, 250 mcg is 0.1 mL, which is 10 units on a U-100 syringe. Use the calculator to match your own concentration.",
            },
            {
              q: "Is the amount in mg or mcg?",
              a: "The amounts you measure are usually stated in micrograms (mcg). 1 mg equals 1,000 mcg, so 0.25 mg is 250 mcg.",
            },
          ]}
        />
      </div>
    </>
  );
}
