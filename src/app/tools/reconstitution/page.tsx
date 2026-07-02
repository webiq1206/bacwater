import Link from "next/link";
import { PlanForm } from "@/components/plan/plan-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";

export const metadata = {
  alternates: { canonical: "/tools/reconstitution" },
  title: "Free Peptide Reconstitution Calculator",
  description:
    "Free peptide reconstitution calculator. Enter your vial size, dose, and syringe to get exact BAC water amount, syringe units, and doses per vial. For research use.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Free Peptide Reconstitution Calculator"
        description="Free peptide reconstitution calculator. Enter your vial size, dose, and syringe to get exact BAC water amount, syringe units, and doses per vial. For research use."
        url="/tools/reconstitution"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Reconstitution Calculator", url: "/tools/reconstitution" },
        ]}
      />
      <SoftwareAppJsonLd
        name="Peptide Reconstitution Calculator"
        description="Free peptide reconstitution calculator: enter your vial size, dose, and syringe to get the exact BAC water amount, syringe units, and doses per vial."
        url="/tools/reconstitution"
      />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Reconstitution Calculator", href: "/tools/reconstitution" },
      ]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Calculator</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Reconstitution Calculator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Enter your peptide, vial size, dose, and syringe type. We&apos;ll
          calculate exactly how much BAC water to add, how many syringe units
          to draw, and how many doses you&apos;ll get per vial.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Want a guided, step-by-step walkthrough instead?{" "}
          <Link href="/plan/new" className="text-foreground font-medium underline">
            Try the plan builder
          </Link>
          .
        </p>
      </div>
      <div className="mt-10">
        <PlanForm mode="advanced" />
      </div>
      <section className="mt-14 border-t border-border pt-8 max-w-3xl">
        <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">How peptide reconstitution works</Link></li>
          <li><Link href="/learn/common-mistakes-to-avoid" className="text-muted-foreground hover:text-foreground underline transition-colors">Common reconstitution mistakes to avoid</Link></li>
          <li><Link href="/learn/peptide-reconstitution-chart" className="text-muted-foreground hover:text-foreground underline transition-colors">Peptide reconstitution quick-reference chart</Link></li>
          <li><Link href="/learn/how-to-store-reconstituted-peptides" className="text-muted-foreground hover:text-foreground underline transition-colors">How to store reconstituted peptides</Link></li>
        </ul>
      </section>
    </div>
  );
}
