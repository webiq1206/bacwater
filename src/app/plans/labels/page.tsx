import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findPeptide, type CalcResult } from "@/lib/calc";
import { formatMl, formatSyringeReading, formatUnits } from "@/lib/calc/format";
import {
  BatchLabelSheet,
  type BatchLabelPlan,
} from "@/components/plan/batch-label-sheet";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Vial labels",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ ids?: string }>;
}

const MAX_PLANS = 24;

export default async function BatchLabelsPage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const requested = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_PLANS);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Same rule as the workspace: your own plans, plus unclaimed guest plans,
  // which are link-accessible anyway. Someone else's owned plan is dropped
  // rather than raising, so one stale id doesn't kill the whole sheet.
  const owners = userId ? [{ userId }, { userId: null }] : [{ userId: null }];
  const plans = requested.length
    ? await prisma.plan.findMany({
        where: { publicId: { in: requested }, OR: owners },
      })
    : [];

  // Preserve the order the ids arrived in, which is the queue's order.
  const ordered = requested
    .map((id) => plans.find((p) => p.publicId === id))
    .filter((p): p is (typeof plans)[number] => Boolean(p));

  if (ordered.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6">
        <h1 className="font-serif text-2xl font-medium tracking-tight">
          Nothing to label
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {requested.length === 0
            ? "Pick the plans you want labels for from My Plans, then choose Print labels."
            : "Those plans could not be found on your account. They may have been deleted."}
        </p>
        <Button asChild variant="brand" className="mt-5">
          <Link href="/plans">Back to My Plans</Link>
        </Button>
      </div>
    );
  }

  const labelPlans: BatchLabelPlan[] = ordered.map((plan) => {
    // Shelf life from the plan's own dates when it has them, else the
    // peptide's refrigerated default. Same derivation as /plan/[id]/label.
    const shelfDays =
      plan.dateMixed && plan.expirationDate
        ? Math.max(
            1,
            Math.round((+plan.expirationDate - +plan.dateMixed) / 86_400_000)
          )
        : findPeptide(plan.peptideSlug ?? "")?.refrigeratedShelfDays ?? 28;

    // Read the syringe reading from the stored snapshot so the printed label
    // matches the plan page and the PDF exactly.
    let doseReading: string;
    let injectionsPerWeek: number | null = null;
    try {
      const parsed = JSON.parse(plan.data) as CalcResult;
      doseReading = formatSyringeReading(parsed.syringeReadout);
      if (
        typeof parsed.schedule?.injectionsPerWeek === "number" &&
        parsed.schedule.injectionsPerWeek >= 1
      ) {
        injectionsPerWeek = parsed.schedule.injectionsPerWeek;
      }
    } catch {
      doseReading = `${formatUnits(plan.syringeUnits)} units`;
    }

    return {
      publicId: plan.publicId,
      planName: plan.name || plan.peptideName || "Untitled plan",
      peptideName: plan.peptideName || "Peptide",
      vialStrengthMg: plan.vialStrengthMg,
      bacWaterMl: formatMl(plan.bacWaterMl),
      doseReading,
      injectionsPerWeek,
      shelfDays,
      defaultMixDate: plan.dateMixed
        ? plan.dateMixed.toISOString().slice(0, 10)
        : "",
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <BatchLabelSheet plans={labelPlans} />
    </div>
  );
}
