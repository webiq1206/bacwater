import Link from "next/link";
import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Free Peptide Reconstitution Calculator",
  description:
    "Free peptide reconstitution calculator. Enter your vial size, dose, and syringe — get exact BAC water amount, syringe units, and doses per vial. No account needed.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
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
    </div>
  );
}
