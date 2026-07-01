import Link from "next/link";
import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Build my plan",
  description:
    "Enter your peptide, vial strength, dose, and syringe. Get an exact reconstitution plan with plain-English explanations and a printable PDF.",
};

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Build your plan.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill in what&apos;s on your vial. Watch the math on the right. Save
            it when you&apos;re happy.
          </p>
        </div>
        <Link
          href="/plan/new"
          className="text-sm text-brand font-medium hover:underline whitespace-nowrap mt-2"
        >
          Prefer step-by-step? →
        </Link>
      </div>
      <div className="mt-10 sm:mt-14">
        <PlanForm mode="advanced" />
      </div>
    </div>
  );
}
