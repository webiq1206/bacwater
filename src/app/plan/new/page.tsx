import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlanForm } from "@/components/plan/plan-form";

export const metadata = {
  title: "Step-by-Step Reconstitution Planner",
  description:
    "Guided peptide reconstitution planner — one question at a time. Perfect for beginners. We'll do all the math.",
};

export default function PlanNewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="mb-10 sm:mb-14 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Guided planner</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            We&apos;ll walk you through it.
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            One question at a time — perfect for your first reconstitution.
            We&apos;ll handle all the math and explain every step along the way.
          </p>
        </div>
        <Link
          href="/plan"
          className="text-sm text-foreground font-medium hover:underline whitespace-nowrap inline-flex items-center gap-1 mt-1"
        >
          Show everything at once <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <PlanForm mode="beginner" />
    </div>
  );
}
