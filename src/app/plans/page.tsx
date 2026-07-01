import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ExternalLink, FileText, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
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
          <h1 className="text-3xl font-semibold tracking-tight">My Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your saved reconstitution plans, ready to open, print, or reorder.
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

function PlanList({ plans }: { plans: Array<{ id: string; publicId: string; peptideName: string | null; vialStrengthMg: number; doseMcg: number; syringeUnits: number; dosesPerVial: number; dateMixed: Date | null; expirationDate: Date | null; createdAt: Date; archived: boolean }> }) {
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {plans.map((p) => (
        <li key={p.id}>
          <Card>
            <CardContent className="p-5">
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
                <dd className="text-right">{p.doseMcg} mcg</dd>
                <dt className="text-muted-foreground">Syringe</dt>
                <dd className="text-right font-medium text-brand">{p.syringeUnits} units</dd>
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
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <Card className="mt-4">
      <CardContent className="p-12 text-center">
        <div className="text-lg font-semibold">No plans yet</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Build your first plan to save it here.
        </p>
        <div className="mt-6">
          <Button asChild variant="brand" size="lg">
            <Link href="/plan">Build my first plan</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
