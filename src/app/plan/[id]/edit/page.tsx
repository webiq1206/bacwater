import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlanEditor } from "@/components/plan/plan-editor";
import { PlanDuplicateButton } from "@/components/plan/plan-duplicate-button";

interface Props { params: Promise<{ id: string }>; }

export const metadata = { title: "Edit plan", robots: { index: false, follow: false } };

export default async function PlanEditPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();

  // Editing writes to this plan now, so the page must not render for someone
  // whose save the action would reject. Same rule the actions enforce: an
  // owned plan is its owner's, an unclaimed guest plan stays editable by
  // whoever holds the link. Non-owners are sent back to the plan, where
  // Duplicate gives them their own copy to change.
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (plan.userId && plan.userId !== userId) redirect(`/plan/${plan.publicId}`);

  // Frequency lives in the CalcResult snapshot; plans saved before weekly
  // splitting have none and default to 1 (no split) so their math is unchanged.
  let injectionsPerWeek = 1;
  try {
    const snapshot = JSON.parse(plan.data) as {
      schedule?: { injectionsPerWeek?: number };
    };
    if (
      typeof snapshot.schedule?.injectionsPerWeek === "number" &&
      snapshot.schedule.injectionsPerWeek >= 1
    )
      injectionsPerWeek = snapshot.schedule.injectionsPerWeek;
  } catch {
    /* keep default */
  }
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      <Link
        href={`/plan/${plan.publicId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plan
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Edit plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes update this plan in place. Its link, PDF and vial labels
            keep working and will show the new numbers.
          </p>
        </div>
        {/* The alternative to editing in place, offered here rather than
            described here: this copies the plan and opens the copy, leaving
            the original exactly as it is. */}
        <PlanDuplicateButton
          publicId={plan.publicId}
          variant="outline"
          label="Edit a copy instead"
          className="shrink-0"
        />
      </div>
      <div className="mt-8">
        <PlanEditor
          initial={{
            publicId: plan.publicId,
            name: plan.name,
            peptideSlug: plan.peptideSlug || "custom",
            peptideName: plan.peptideName || "",
            vialStrengthMg: plan.vialStrengthMg,
            doseMcg: plan.doseMcg,
            injectionsPerWeek,
            bacWaterMl: plan.bacWaterMl,
            syringeType: plan.syringeType as never,
            dateMixed: plan.dateMixed ? plan.dateMixed.toISOString().slice(0, 10) : "",
          }}
        />
      </div>
    </div>
  );
}
