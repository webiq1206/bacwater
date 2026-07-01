import Link from "next/link";
import { PlanForm } from "@/components/plan/plan-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  title: "Peptide Reconstitution Plan Builder",
  description:
    "Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.",
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Build My Plan"
        description="Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF."
        url="/plan"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Build My Plan", url: "/plan" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Build My Plan", href: "/plan" }]} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="eyebrow">Plan builder</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
            Build your reconstitution plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Fill in what&apos;s on your vial label. We&apos;ll calculate
            everything: BAC water, syringe units, doses per vial, expiration,
            and supplies. Save it, download a PDF, or print a vial label.
          </p>
        </div>
        <Link
          href="/plan/new"
          className="text-sm text-foreground font-medium hover:underline whitespace-nowrap mt-2"
        >
          First time? Try step-by-step &rarr;
        </Link>
      </div>
      <div className="mt-10 sm:mt-14">
        <PlanForm mode="advanced" />
      </div>
    </div>
  );
}
