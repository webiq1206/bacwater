import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/supplies" },
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-is-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">What is BAC water?</Link></li>
            <li><Link href="/learn/insulin-syringe-sizes" className="text-muted-foreground hover:text-foreground underline transition-colors">Insulin syringe sizes explained</Link></li>
            <li><Link href="/learn/how-to-store-reconstituted-peptides" className="text-muted-foreground hover:text-foreground underline transition-colors">How to store reconstituted peptides</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "Supply Calculator",
            description:
              "Turn your peptide, dose, and cycle length into a complete shopping list with exact quantities of bac water, syringes, and prep pads.",
            url: "/tools/supplies",
          }}
          quickRef={{
            head: ["Item", "Typical 4-week daily protocol"],
            rows: [
              ["Peptide vial", "1"],
              ["Bac water", "1 vial"],
              ["Insulin syringes", "28 (1 per injection)"],
              ["Alcohol prep pads", "56 (2 per injection)"],
            ],
            caption:
              "Quantities scale with your dose, injection frequency, and cycle length.",
          }}
          faqs={[
            {
              q: "How many syringes do I need for a peptide cycle?",
              a: "Usually one insulin syringe per injection. A 4-week daily protocol is about 28 syringes. Multiply your injections per day by the number of days in your cycle.",
            },
            {
              q: "How much bac water do I need for a cycle?",
              a: "Often a single vial of bacteriostatic water reconstitutes one peptide vial. If you run multiple vials or larger volumes, plan for more. The calculator gives an exact amount.",
            },
            {
              q: "Do I need alcohol prep pads?",
              a: "Yes. Wipe the vial stopper and the injection site with an alcohol prep pad each time. Two pads per injection is a common plan.",
            },
          ]}
        />
      </div>
    </>
  );
}
