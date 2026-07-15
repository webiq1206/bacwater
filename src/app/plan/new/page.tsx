import { PlanForm } from "@/components/plan/plan-form";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
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
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 sm:pt-24 pb-24 sm:pb-32">
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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Build a personalized peptide reconstitution plan",
            description:
              "Use BACwater.ai's step-by-step planner to create an exact reconstitution plan for your peptide vial.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Choose your peptide",
                text: "Select the peptide you're working with from the list. We'll pre-fill common vial sizes and doses.",
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
                text: "Choose which insulin syringe you'll use (0.3 mL, 0.5 mL, or 1 mL).",
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
      {/* Breadcrumb is desktop-only in the wizard — on mobile it's nav clutter
          that pushes the first question toward the fold. Stays in the DOM for
          its BreadcrumbList structured data. */}
      <div className="hidden sm:block">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Build My Plan", href: "/plan" },
            { label: "New Plan", href: "/plan/new" },
          ]}
        />
      </div>
      {/* Marketing intro is desktop-only: on mobile it costs ~220px and pushes
          the first question below the fold. The mode toggle + step bar + card
          give enough context, so the wizard opens straight into the question. */}
      <div className="hidden sm:block mb-10 sm:mb-14">
        <div className="eyebrow">Guided planner</div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
          We&apos;ll walk you through it.
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          One question at a time. We handle all the math and explain every step
          in plain English.
        </p>
      </div>
      <PlanForm mode="beginner" />
    </div>
  );
}
