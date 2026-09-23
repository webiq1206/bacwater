import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import { safeJson } from "@/lib/seo/safe-json";
import { PlanForm } from "@/components/plan/plan-form";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/plan/new" },
  title: "Step-by-Step Reconstitution Planner",
  description:
    "Guided peptide reconstitution planner. One question at a time. We'll do all the math.",
  openGraph: {
    title: "Step-by-Step Reconstitution Planner",
    description:
      "Guided peptide reconstitution planner. One question at a time. We'll do all the math.",
    url: "/plan/new",
    type: "website",
    siteName: "BACwater.ai",
  },
};

export default function PlanNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 sm:pt-24 pb-24 sm:pb-32 xl:max-w-7xl">
      <WebPageJsonLd
        name="Step-by-Step Reconstitution Planner"
        description="Guided peptide reconstitution planner. One question at a time. We'll do all the math."
        url="/plan/new"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Build My Plan", url: "/plan" },
          { name: "New Plan", url: "/plan/new" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJson({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Build a calculation from stated inputs",
            description:
              "Use BACwater.ai's step-by-step planner to create a concentration calculation with explicit product and device limitations.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Choose your peptide",
                text: "Select the peptide you're working with from the list. No dose or vehicle is selected for you.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Enter vial strength",
                text: "Enter the amount of peptide in your vial (in mg), as shown on the vial label.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Set your dose",
                text: "Enter how much peptide you want per injection, in mcg or mg.",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Pick your syringe",
                text: "Match the scale on the actual device; the illustration does not choose a syringe.",
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "Get your personalized plan",
                text: "Review your complete reconstitution plan with BAC water amount, syringe units, doses per vial, and printable labels.",
              },
            ],
          }),
        }}
      />
      <CalculatorWorkspace title="Build your calculation" description="Use your label and instructions. We show the math." backHref="/">
        <PlanForm mode="beginner" />
      </CalculatorWorkspace>
    </div>
  );
}
