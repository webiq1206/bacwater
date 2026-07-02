import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/bac-water" },
  title: "BAC Water Calculator - How Much to Add",
  description:
    "Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="BAC Water Calculator"
        description="Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe."
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
            <strong>The amount of BAC water to add depends on your vial strength and your target dose.</strong>{" "}
            Most users add 1–2 mL of bacteriostatic water to create a concentration where each dose equals 5–10 units on a standard U-100 insulin syringe. For example, adding 2 mL to a 5 mg BPC-157 vial creates a 2.5 mg/mL concentration, making a 250 mcg dose exactly 10 units. Use the calculator below for your exact numbers.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-is-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What is BAC water?</Link></li>
            <li><Link href="/learn/bac-water-vs-sterile-water" className="text-muted-foreground hover:text-foreground underline transition-colors">BAC water vs. sterile water</Link></li>
            <li><Link href="/learn/how-long-bac-water-lasts" className="text-muted-foreground hover:text-foreground underline transition-colors">How long BAC water lasts</Link></li>
            <li><Link href="/learn/too-much-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What happens if you add too much BAC water</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
