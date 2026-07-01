import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Reconstitution Calculator",
  description: "Free peptide reconstitution calculator. Get exact BAC water, syringe units, and doses per vial.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-3xl font-semibold tracking-tight">Reconstitution Calculator</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
        Fast, deterministic math. Save it as a plan when you&apos;re ready.
      </p>
      <div className="mt-8">
        <PlanForm mode="advanced" />
      </div>
    </div>
  );
}
