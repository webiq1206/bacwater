import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Build my plan — beginner",
  description: "Answer one question at a time. We'll do the math.",
};

export default function PlanNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 pb-24">
      <PlanForm mode="beginner" />
    </div>
  );
}
