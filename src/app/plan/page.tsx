import { PlanForm } from "@/components/plan/plan-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/plan" },
  title: "Peptide Reconstitution Plan Builder",
  description:
    "Enter your peptide, vial strength, dose, and syringe. Get an calculation using your own instructions with plain-English explanations and a printable PDF.",
  openGraph: {
    title: "Peptide Reconstitution Plan Builder",
    description:
      "Enter your peptide, vial strength, dose, and syringe. Get an calculation using your own instructions with plain-English explanations and a printable PDF.",
    url: "/plan",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-12 xl:max-w-7xl">
      <WebPageJsonLd
        name="Build My Plan"
        description="Enter your peptide, vial strength, dose, and syringe. Get an calculation using your own instructions with plain-English explanations and a printable PDF."
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
      <div className="max-w-3xl mb-6">
        <div className="eyebrow">Plan builder</div>
        <h1 className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-serif font-medium tracking-tight">
          Build your calculation, one step at a time
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          Copy the numbers from your label and instructions. We’ll show the math and help you save it.
        </p>
        <p className="mt-2 text-sm text-muted-foreground hidden sm:block">
          Answer one question at a time. You can go back and change an answer.
        </p>
      </div>
      <PlanForm mode="beginner" />
    </div>
  );
}
