import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "Syringe Unit Converter - mL to Units",
  description:
    "Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Syringe Unit Converter"
        description="Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes."
        url="/tools/syringe-units"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Syringe Unit Converter", url: "/tools/syringe-units" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>On a U-100 insulin syringe, 100 units = 1 mL.</strong>{" "}
            So 10 units = 0.1 mL, 50 units = 0.5 mL, and 1 unit = 0.01 mL. The unit markings make it easier to measure small peptide doses without doing decimal math. Enter any value below to convert instantly.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-syringe-units-mean" className="text-muted-foreground hover:text-foreground underline transition-colors">What syringe units mean</Link></li>
            <li><Link href="/learn/how-to-use-an-insulin-syringe" className="text-muted-foreground hover:text-foreground underline transition-colors">How to use an insulin syringe</Link></li>
            <li><Link href="/learn/insulin-syringe-sizes" className="text-muted-foreground hover:text-foreground underline transition-colors">Insulin syringe sizes explained</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
