import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Build my plan — advanced",
  description: "Compact calculator layout with instant results.",
};

export default function PlanAdvancedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight">Advanced planner</h1>
      <p className="text-sm text-muted-foreground mt-1">Live math on every change.</p>
      <div className="mt-8">
        <PlanForm mode="advanced" />
      </div>
    </div>
  );
}
