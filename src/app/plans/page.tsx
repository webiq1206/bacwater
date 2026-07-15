import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Download, ExternalLink, FileText, Lightbulb, Plus, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { formatDose, formatSyringeReading, formatUnits } from "@/lib/calc/format";
import type { CalcResult } from "@/lib/calc";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlansRowActions } from "@/components/plan/plans-row-actions";

export const metadata = {
  title: "My Plans",
  description: "Your saved peptide reconstitution plans.",
  robots: { index: false, follow: false },
};

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?next=/plans");

  const userId = (session.user as { id?: string }).id!;
  const [active, archived] = await Promise.all([
    prisma.plan.findMany({
      where: { userId, archived: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({
      where: { userId, archived: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">My Plans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your saved reconstitution plans. Open, print, or reorder anytime.
          </p>
        </div>
        <Button asChild variant="brand">
          <Link href="/plan">
            <Plus className="h-4 w-4" /> New plan
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="mt-8">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archived.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {active.length === 0 ? (
            <EmptyState />
          ) : (
            <PlanList plans={active} />
          )}
        </TabsContent>
        <TabsContent value="archived">
          {archived.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-16">
              Nothing archived yet.
            </div>
          ) : (
            <PlanList plans={archived} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlanList({ plans }: { plans: Array<{ id: string; publicId: string; peptideName: string | null; vialStrengthMg: number; doseMcg: number; syringeUnits: number; dosesPerVial: number; dateMixed: Date | null; expirationDate: Date | null; createdAt: Date; archived: boolean; data: string }> }) {
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {plans.map((p) => {
        // Read the syringe reading from the stored result so it matches the
        // plan page and PDF exactly (same rounding, correct units/mL label).
        // Fall back to the denormalized column for older/corrupt rows.
        let readout: string;
        try {
          const parsed = JSON.parse(p.data) as CalcResult;
          readout = formatSyringeReading(parsed.syringeReadout);
        } catch {
          readout = `${formatUnits(p.syringeUnits)} units`;
        }
        return (
        <li key={p.id}>
          <div className="border border-border bg-card p-5 rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/plan/${p.publicId}`}
                    className="font-semibold text-lg tracking-tight hover:underline"
                  >
                    {p.peptideName || "Untitled plan"}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Saved {formatDate(p.createdAt)}
                  </div>
                </div>
                {p.expirationDate ? (
                  <Badge variant={new Date(p.expirationDate) < new Date() ? "destructive" : "outline"}>
                    Exp {formatDate(p.expirationDate)}
                  </Badge>
                ) : null}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Vial</dt>
                <dd className="text-right">{p.vialStrengthMg} mg</dd>
                <dt className="text-muted-foreground">Dose</dt>
                <dd className="text-right">{formatDose(p.doseMcg)}</dd>
                <dt className="text-muted-foreground">Draw per dose</dt>
                <dd className="text-right font-medium text-foreground">{readout}</dd>
                <dt className="text-muted-foreground">Doses/vial</dt>
                <dd className="text-right">{p.dosesPerVial}</dd>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/plan/${p.publicId}`}>
                    <ExternalLink className="h-4 w-4" /> Open
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/plan/${p.publicId}/pdf`}>
                    <Download className="h-4 w-4" /> PDF
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/plan/${p.publicId}/label`}>
                    <FileText className="h-4 w-4" /> Label
                  </Link>
                </Button>
                <PlansRowActions publicId={p.publicId} archived={p.archived} />
              </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="mt-4 border border-border p-8 sm:p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="text-xl font-serif font-medium tracking-tight">You&apos;re just 3 questions away from your first plan</div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
      <div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-3 gap-4 text-center">
        <div className="text-sm">
          <div className="font-medium text-foreground">Want the background?</div>
          <p className="mt-1 text-muted-foreground text-xs">
            <Link href="/learn" className="underline">Read the guides</Link> first. They take about 5 minutes.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Know your numbers?</div>
          <p className="mt-1 text-muted-foreground text-xs">
            Use the <Link href="/tools" className="underline">calculators</Link> directly for a quick one-off answer.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Just need the math?</div>
          <p className="mt-1 text-muted-foreground text-xs">
            Use our <Link href="/tools" className="underline">standalone calculators</Link> for quick one-off answers.
          </p>
        </div>
      </div>
    </div>
  );
}
