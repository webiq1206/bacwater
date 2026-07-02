import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { findPeptide } from "@/lib/calc";
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

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 pb-24">
      <LabelSheet
        publicId={plan.publicId}
        peptideName={plan.peptideName || "Peptide"}
        vialStrengthMg={plan.vialStrengthMg}
        bacWaterMl={plan.bacWaterMl}
        syringeUnits={plan.syringeUnits}
        shelfDays={shelfDays}
      />
    </div>
  );
}
