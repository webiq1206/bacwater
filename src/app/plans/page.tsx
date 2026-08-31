import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatSyringeReading, formatUnits } from "@/lib/calc/format";
import type { CalcResult } from "@/lib/calc";
import { DevicePlansList } from "@/components/plan/device-plans-list";
import { ClaimDevicePlans } from "@/components/plan/claim-device-plans";
import { PlansWorkspace, type PlanSummary } from "@/components/plan/plans-workspace";

export const metadata = {
  title: "My Plans",
  description: "Your saved peptide reconstitution plans.",
  robots: { index: false, follow: false },
};

export default async function PlansPage() {
  const session = await auth();

  // Signed-out visitors still get their plans, the ones saved on this device,
  // read client-side from localStorage. No forced sign-in. Those plans live
  // only in the browser, so they keep the simple card list rather than the
  // account-backed workspace.
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              My Plans
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your saved reconstitution plans. Open, rename, or print anytime.
            </p>
          </div>
          <Button asChild variant="brand">
            <Link href="/plan">
              <Plus className="h-4 w-4" /> New plan
            </Link>
          </Button>
        </div>
        <DevicePlansList />
      </div>
    );
  }

  const userId = (session.user as { id?: string }).id!;
  const plans = await prisma.plan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (plans.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
        <ClaimDevicePlans />
        <div className="eyebrow">Dashboard</div>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          My Plans
        </h1>
        <EmptyState />
      </div>
    );
  }

  // The syringe reading is read from each stored snapshot so the queue matches
  // the plan page and the PDF exactly (same rounding, correct units/mL label).
  // Older or corrupt rows fall back to the denormalised column.
  const summaries: PlanSummary[] = plans.map((p) => {
    let readout: string;
    let injectionsPerWeek: number | null = null;
    try {
      const parsed = JSON.parse(p.data) as CalcResult;
      readout = formatSyringeReading(parsed.syringeReadout);
      if (
        typeof parsed.schedule?.injectionsPerWeek === "number" &&
        parsed.schedule.injectionsPerWeek >= 1
      ) {
        injectionsPerWeek = parsed.schedule.injectionsPerWeek;
      }
    } catch {
      readout = `${formatUnits(p.syringeUnits)} units`;
    }
    return {
      publicId: p.publicId,
      name: p.name,
      peptideName: p.peptideName,
      vialStrengthMg: p.vialStrengthMg,
      doseMcg: p.doseMcg,
      dosesPerVial: p.dosesPerVial,
      syringeUnits: p.syringeUnits,
      readout,
      injectionsPerWeek,
      archived: p.archived,
      dateMixed: p.dateMixed?.toISOString() ?? null,
      expirationDate: p.expirationDate?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return (
    <div className="mx-auto max-w-[110rem] px-3 pb-16 pt-10 sm:px-6 sm:pt-16">
      <ClaimDevicePlans />
      <PlansWorkspace plans={summaries} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 border border-border p-8 sm:p-12">
      <div className="mx-auto max-w-md text-center">
        <div className="font-serif text-xl font-medium tracking-tight">
          You&apos;re just 3 questions away from your first plan
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pick your peptide, vial strength, and dose. We&apos;ll calculate
          everything else (BAC water, syringe units, step-by-step instructions,
          and a printable vial label).
        </p>
        <div className="mt-6">
          <Button asChild variant="brand" size="lg">
            <Link href="/plan">
              Build my first plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 border-t border-border pt-6 text-center sm:grid-cols-3">
        <div className="text-sm">
          <div className="font-medium text-foreground">Want the background?</div>
          <p className="mt-1 text-xs text-muted-foreground">
            <Link href="/learn" className="underline">
              Read the guides
            </Link>{" "}
            first. They take about 5 minutes.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Know your numbers?</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the{" "}
            <Link href="/tools" className="underline">
              calculators
            </Link>{" "}
            directly for a quick one-off answer.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Just need the math?</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Use our{" "}
            <Link href="/tools" className="underline">
              standalone calculators
            </Link>{" "}
            for quick one-off answers.
          </p>
        </div>
      </div>
    </div>
  );
}
