import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "Supply Calculator - What You Need for a Cycle",
  description:
    "Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Supply Calculator"
        description="Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads."
        url="/tools/supplies"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Supply Calculator", url: "/tools/supplies" },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>The supplies you need depend on your peptide, dose, injection frequency, and cycle length.</strong>{" "}
            A typical 4-week daily protocol requires 1 peptide vial, 1 vial of BAC water, 28 insulin syringes, and 56 alcohol prep pads (2 per injection). Enter your details below for an exact shopping list with quantities and reasons.
          </p>
        </section>
      </div>
      {children}
    </>
  );
}
