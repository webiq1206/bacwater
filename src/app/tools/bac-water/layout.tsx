import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/bac-water" },
  title: "BAC Water Calculator - How Much to Add",
  description:
    "Enter your peptide and vial amount to find out exactly how much bacteriostatic water to add for clean, easy-to-measure amounts on a standard insulin syringe.",
  openGraph: {
    title: "BAC Water Calculator - How Much to Add",
    description:
      "Enter your peptide and vial amount to find out exactly how much bacteriostatic water to add for clean, easy-to-measure amounts on a standard insulin syringe.",
    url: "/tools/bac-water",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="BAC Water Calculator"
        description="Enter your peptide and vial amount to find out exactly how much bacteriostatic water to add for clean, easy-to-measure amounts on a standard insulin syringe."
        url="/tools/bac-water"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "BAC Water Calculator", url: "/tools/bac-water" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>The amount of BAC water to add depends on your vial amount and how much you want to measure.</strong>{" "}
            As an example, adding 2 mL to a 5 mg BPC-157 vial makes 2.5 mg/mL, so measuring 250 mcg comes out to 10 units on a U-100 syringe. Use the calculator below for your exact numbers.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-is-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What is BAC water?</Link></li>
            <li><Link href="/learn/bac-water-for-peptides" className="text-muted-foreground hover:text-foreground underline transition-colors">BAC water for peptides</Link></li>
            <li><Link href="/learn/vs/sterile-water" className="text-muted-foreground hover:text-foreground underline transition-colors">BAC water vs. sterile water</Link></li>
            <li><Link href="/learn/bac-water-shelf-life" className="text-muted-foreground hover:text-foreground underline transition-colors">How long BAC water lasts</Link></li>
            <li><Link href="/learn/too-much-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What happens if you add too much BAC water</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "BAC Water Calculator",
            description:
              "Find how much bacteriostatic water to add to a peptide vial for clean, easy-to-measure amounts on an insulin syringe.",
            url: "/tools/bac-water",
          }}
          quickRef={{
            head: ["Vial amount", "Bac water to add", "Example measurement", "Units"],
            rows: [
              ["2 mg", "1 mL", "100 mcg", "5 units"],
              ["5 mg", "2 mL", "250 mcg", "10 units"],
              ["10 mg", "2 mL", "500 mcg", "10 units"],
              ["15 mg", "3 mL", "500 mcg", "10 units"],
            ],
            caption:
              "Examples that put a measurement at a clean syringe mark. Use the calculator above for your exact vial and amount.",
          }}
          faqs={[
            {
              q: "How much bac water for a 5 mg vial?",
              a: "A common starting point is 2 mL of bacteriostatic water for a 5 mg vial. That gives 2.5 mg/mL, so measuring 250 mcg is 10 units on a U-100 syringe. Adjust the water to move the measurement to an easier mark.",
            },
            {
              q: "Can you add too much bac water?",
              a: "Adding more is not a safety problem, but it makes each measurement a larger volume to measure. Too little makes the measurement a very small, hard-to-measure volume. Aim for a measurement that lands near a round number of units.",
            },
            {
              q: "Does adding more bac water change how much peptide you get?",
              a: "No. More bac water lowers the concentration, so you measure a larger volume for the same amount of peptide. The amount of peptide stays the same; only the volume you measure changes.",
            },
          ]}
        />
      </div>
    </>
  );
}
