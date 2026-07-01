import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Printer, Save, ArrowLeft, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import type { CalcResult } from "@/lib/calc";
import { PlanResults } from "@/components/plan/plan-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { PlanNotesForm } from "@/components/plan/plan-notes-form";
import { PlanQr } from "@/components/plan/plan-qr";
import { AiAssistantDrawer } from "@/components/plan/ai-assistant-drawer";
import { CopyLinkClient } from "@/components/plan/copy-link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  return {
    title: plan
      ? `${plan.peptideName ?? "Reconstitution plan"} — ${plan.publicId}`
      : "Plan not found",
    robots: { index: false, follow: false },
  };
}

export default async function PublicPlanPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();

  const result = JSON.parse(plan.data) as CalcResult;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <div className="eyebrow">
            Plan · {plan.publicId}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight mt-1">
            {plan.peptideName || "Reconstitution plan"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saved {formatDate(plan.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/plans">
              <ArrowLeft className="h-4 w-4" /> My Plans
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/plan/${plan.publicId}/label`}>
              <Printer className="h-4 w-4" /> Vial label
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/plan/${plan.publicId}/pdf`}>
              <Download className="h-4 w-4" /> Download PDF
            </Link>
          </Button>
          <Button asChild variant="brand">
            <Link href={`/plan/${plan.publicId}/edit`}>
              <Save className="h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <PlanResults result={result} />

          <Card className="mt-6">
            <CardContent className="p-6 sm:p-8">
              <h3 className="font-semibold text-lg">Your notes</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Add anything you want to remember about this plan.
              </p>
              <div className="mt-4">
                <PlanNotesForm publicId={plan.publicId} initial={plan.notes || ""} />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 h-fit no-print">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Share
              </div>
              <PlanQr publicId={plan.publicId} />
              <div className="mt-3 text-xs text-muted-foreground break-all">
                bacwater.ai/plan/{plan.publicId}
              </div>
              <div className="mt-3">
                <CopyLinkClient publicId={plan.publicId} />
              </div>
            </CardContent>
          </Card>

          <AiAssistantDrawer plan={result} />

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-brand">
                <Sparkles className="h-4 w-4" />
                <div className="text-sm font-medium">Tip</div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Use the printable label to stick on your reconstituted vial. Scan
                the QR code to jump right back to this plan.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

