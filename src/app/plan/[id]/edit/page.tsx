import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanEditor } from "@/components/plan/plan-editor";

interface Props { params: Promise<{ id: string }>; }

export const metadata = { title: "Edit plan", robots: { index: false, follow: false } };

export default async function PlanEditPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight">Edit plan</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Editing creates a new saved plan and keeps the original.
      </p>
      <div className="mt-8">
        <PlanEditor
          initial={{
            peptideSlug: plan.peptideSlug || "custom",
            peptideName: plan.peptideName || "",
            vialStrengthMg: plan.vialStrengthMg,
            doseMcg: plan.doseMcg,
            bacWaterMl: plan.bacWaterMl,
            syringeType: plan.syringeType as never,
            dateMixed: plan.dateMixed ? plan.dateMixed.toISOString().slice(0, 10) : "",
            notes: plan.notes || "",
          }}
        />
      </div>
    </div>
  );
}
