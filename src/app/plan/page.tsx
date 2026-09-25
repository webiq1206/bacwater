import { withSocialMetadata } from "@/lib/seo/social-metadata";
import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { PlanForm } from "@/components/plan/plan-form";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = withSocialMetadata({
  alternates: { canonical: "/plan" },
  title: "Peptide Reconstitution Plan Builder",
  description:
    "Enter the stated amount, final liquid volume and measurement from your instructions. Check concentration and scale readings, then save a calculation or print a PDF.",
  openGraph: {
    title: "Peptide Reconstitution Plan Builder",
    description:
      "Enter the stated amount, final liquid volume and measurement from your instructions. Check concentration and scale readings, then save a calculation or print a PDF.",
    url: "/plan",
    type: "website",
    siteName: "BACwater.ai",
  },
});

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-12 xl:max-w-7xl">
      <WebPageJsonLd
        name="Build My Plan"
        description="Enter the stated amount, final liquid volume and measurement from your instructions. Check concentration and scale readings, then save a calculation or print a PDF."
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
