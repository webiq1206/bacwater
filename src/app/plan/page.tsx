import { PlanForm } from "@/components/plan/plan-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/plan" },
  title: "Peptide Reconstitution Plan Builder",
  description:
    "Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.",
  openGraph: {
    title: "Peptide Reconstitution Plan Builder",
    description:
      "Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.",
    url: "/plan",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Build My Plan"
        description="Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF."
        url="/plan"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Build My Plan", url: "/plan" },
        ]}
      />
      <div className="hidden sm:block">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Build My Plan", href: "/plan" },
          ]}
        />
      </div>
      <div className="hidden sm:block max-w-3xl mb-6 sm:mb-14">
        <div className="eyebrow">Plan builder</div>
        <h1 className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-serif font-medium tracking-tight">
          Build your reconstitution plan
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Tell us what&apos;s on your vial label. We&apos;ll do the math (BAC
          water, syringe units, doses per vial, expiration, supplies) and
          explain it all in plain English.
        </p>
        <p className="mt-2 text-sm text-muted-foreground hidden sm:block">
          New to this? Use the guided wizard. It walks you through one
          question at a time.
        </p>
      </div>
      <PlanForm mode="beginner" />
    </div>
  );
}
