import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "mg to mcg Converter - Milligrams to Micrograms",
  description:
    "Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg. This makes switching instant.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="mg to mcg Converter"
        description="Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg - this makes switching instant."
        url="/tools/mg-to-mcg"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "mg to mcg Converter", url: "/tools/mg-to-mcg" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>1 milligram (mg) = 1,000 micrograms (mcg).</strong>{" "}
            To convert mg to mcg, multiply by 1,000. To convert mcg to mg, divide by 1,000. Peptide vial labels typically use mg (e.g., 5 mg BPC-157), while dose protocols use mcg (e.g., 250 mcg per injection). Use the converter below for instant results.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/how-to-read-a-peptide-vial" className="text-muted-foreground hover:text-foreground underline transition-colors">How to read a peptide vial label</Link></li>
            <li><Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">How peptide reconstitution works</Link></li>
            <li><Link href="/learn/peptide-reconstitution-chart" className="text-muted-foreground hover:text-foreground underline transition-colors">Peptide reconstitution quick-reference chart</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
