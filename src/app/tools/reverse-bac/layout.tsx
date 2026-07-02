import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/reverse-bac" },
  title: "Reverse BAC Water Calculator - Units to Water",
  description:
    "Work backwards. Choose the dose and the exact syringe units you want to draw, and get the precise amount of bacteriostatic water to add to your vial.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Reverse BAC Water Calculator"
        description="Choose the dose and the exact syringe units you want to draw, and get the precise amount of bacteriostatic water to add."
        url="/tools/reverse-bac"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Reverse BAC Water Calculator", url: "/tools/reverse-bac" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>
              To make a dose read at an exact number of units, work backwards
              from the units you want.
            </strong>{" "}
            Pick your vial strength, your target dose, and the units you want to
            draw (for example 20 units). This reverse calculator returns the
            precise amount of bacteriostatic water to add so the dose lands
            exactly there on a U-100 insulin syringe.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-is-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What is BAC water?</Link></li>
            <li><Link href="/learn/what-syringe-units-mean" className="text-muted-foreground hover:text-foreground underline transition-colors">What syringe units mean</Link></li>
            <li><Link href="/learn/too-much-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What happens if you add too much BAC water</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "Reverse BAC Water Calculator",
            description:
              "Enter your vial strength, target dose, and the units you want to draw to get the exact amount of bacteriostatic water to add.",
            url: "/tools/reverse-bac",
          }}
          quickRef={{
            head: ["Target units", "Bac water (5 mg vial, 250 mcg dose)", "Concentration"],
            rows: [
              ["10 units", "2 mL", "2.5 mg/mL"],
              ["15 units", "3 mL", "1.67 mg/mL"],
              ["20 units", "4 mL", "1.25 mg/mL"],
              ["25 units", "5 mL", "1 mg/mL"],
            ],
            caption:
              "Example: a 5 mg vial dosed at 250 mcg. More bac water spreads the same dose across more units.",
          }}
          faqs={[
            {
              q: "How do I make my dose an exact number of units?",
              a: "Work backwards. Decide the units you want to draw, then set the bac water so the concentration matches. This reverse calculator does that: enter the vial strength, dose, and target units, and it returns the exact water to add.",
            },
            {
              q: "Why would I want a specific number of units?",
              a: "Round numbers like 10 or 20 units are easier to draw accurately and harder to misread than an odd volume like 0.17 mL. Choosing the units first makes every injection simpler.",
            },
            {
              q: "What if the calculator asks for a lot of water?",
              a: "Very high target units at a small dose can require a large volume of bac water, which spreads the peptide thin. If the amount looks impractical, choose fewer units.",
            },
          ]}
        />
      </div>
    </>
  );
}
