import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/dose" },
  title: "Dose Calculator - mcg to Syringe Units",
  description:
    "Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Dose Calculator"
        description="Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step."
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
            <strong>Your dose depends on two things: the concentration of your reconstituted peptide (mg/mL) and the volume you draw.</strong>{" "}
            On a U-100 insulin syringe, 10 units = 0.1 mL. If your concentration is 2.5 mg/mL and you draw 10 units (0.1 mL), your dose is 250 mcg. Enter your values below to calculate your exact dose in mcg, mg, and syringe units.
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
      </div>
    </>
  );
}
