import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { PlanForm } from "@/components/plan/plan-form";
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
      <CalculatorWorkspace title="Build your calculation" description="Use your label and instructions. We show the math." backHref="/">
        <PlanForm mode="beginner" />
      </CalculatorWorkspace>
    </div>
  );
}
