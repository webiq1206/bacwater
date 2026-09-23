import { CalculatorWorkspace } from "@/components/calculator/calculator-workspace";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { hasPlanAccess } from "@/lib/plan-access";
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
  if (!(await hasPlanAccess(plan, userId))) redirect(`/plan/${plan.publicId}`);

  // Frequency lives in the CalcResult snapshot; plans saved before weekly
  // splitting have none and default to 1 (no split) so their math is unchanged.
  let injectionsPerWeek = 1;
  let secondary: import("@/lib/calc").CalcInput["secondary"];
  try {
    const snapshot = JSON.parse(plan.data) as {
      schedule?: { injectionsPerWeek?: number };
      secondary?: import("@/lib/calc").CalcInput["secondary"];
    };
    secondary = snapshot.secondary;
    if (
      typeof snapshot.schedule?.injectionsPerWeek === "number" &&
      snapshot.schedule.injectionsPerWeek >= 1
    )
      injectionsPerWeek = snapshot.schedule.injectionsPerWeek;
  } catch {
    /* keep default */
  }
  return (
    <CalculatorWorkspace title="Edit calculation" description="Saving updates this plan, its PDF and its labels." backHref={`/plan/${plan.publicId}`} help={<PlanDuplicateButton publicId={plan.publicId} variant="outline" label="Edit a copy instead" />}>
        <PlanEditor
          initial={{
            publicId: plan.publicId,
            name: plan.name,
            peptideSlug: plan.peptideSlug || "custom",
            peptideName: plan.peptideName || "",
            vialStrengthMg: plan.vialStrengthMg,
            doseMcg: plan.doseMcg,
            injectionsPerWeek,
            secondary,
            bacWaterMl: plan.bacWaterMl,
            syringeType: plan.syringeType as never,
            dateMixed: plan.dateMixed ? plan.dateMixed.toISOString().slice(0, 10) : "",
          }}
        />
    </CalculatorWorkspace>
  );
}
