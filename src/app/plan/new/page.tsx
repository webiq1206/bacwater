import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Step-by-step planner",
  description:
    "Guided reconstitution planner — one question at a time. We'll do the math.",
};

export default function PlanNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="mb-10 sm:mb-14 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            One question at a time.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guided flow, ideal for your first reconstitution.
          </p>
        </div>
        <Link
          href="/plan"
          className="text-sm text-brand font-medium hover:underline whitespace-nowrap inline-flex items-center gap-1 mt-1"
        >
          Show all fields on one page <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <PlanForm mode="beginner" />
    </div>
  );
}
