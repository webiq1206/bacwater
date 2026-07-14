import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { findPeptide, type CalcResult } from "@/lib/calc";
import { formatMl, formatSyringeReading, formatUnits } from "@/lib/calc/format";
import { LabelSheet } from "@/components/plan/label-sheet";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Vial label",
  robots: { index: false, follow: false },
};

export default async function LabelPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();

  const shelfDays =
    plan.dateMixed && plan.expirationDate
      ? Math.max(
          1,
          Math.round((+plan.expirationDate - +plan.dateMixed) / 86_400_000)
        )
      : findPeptide(plan.peptideSlug ?? "")?.refrigeratedShelfDays ?? 28;

  // Use the stored result's syringe reading so the label matches the plan page
  // and PDF exactly (same rounding, correct units-vs-mL label).
  let doseReading: string;
  try {
    const parsed = JSON.parse(plan.data) as CalcResult;
    doseReading = formatSyringeReading(parsed.syringeReadout);
  } catch {
    doseReading = `${formatUnits(plan.syringeUnits)} units`;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 pb-24">
      <LabelSheet
        publicId={plan.publicId}
        peptideName={plan.peptideName || "Peptide"}
        vialStrengthMg={plan.vialStrengthMg}
        bacWaterMl={formatMl(plan.bacWaterMl)}
        doseReading={doseReading}
        shelfDays={shelfDays}
      />
    </div>
  );
}
