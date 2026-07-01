import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanQr } from "@/components/plan/plan-qr";
import { formatDate } from "@/lib/utils";

interface Props { params: Promise<{ id: string }>; }

export const metadata = { title: "Vial label", robots: { index: false, follow: false } };

export default async function LabelPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();
  const dateStr = plan.dateMixed ? formatDate(plan.dateMixed) : "—";
  const expStr = plan.expirationDate ? formatDate(plan.expirationDate) : "—";
  // 8 labels per page (2 columns × 4 rows)
  const labels = Array.from({ length: 8 });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-24">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Printable vial labels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Print at 100% scale. Cut along the outlines. Best on 60 lb+ label paper.
          </p>
        </div>
        <div className="rounded-full border border-border bg-muted px-4 h-10 grid place-items-center text-sm text-muted-foreground">
          Use ⌘/Ctrl+P to print
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 print:gap-0 print:mt-0">
        {labels.map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-dashed border-border p-4 print:border-solid print:break-inside-avoid"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">BACWater.ai</div>
                <div className="text-base font-semibold leading-tight">{plan.peptideName || "Peptide"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{plan.vialStrengthMg} mg vial · {plan.bacWaterMl} mL BAC</div>
              </div>
              <div className="shrink-0">
                <PlanQr publicId={plan.publicId} size={80} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-0.5 text-[11px]">
              <div className="text-muted-foreground">Mixed</div>
              <div className="text-right">{dateStr}</div>
              <div className="text-muted-foreground">Expires</div>
              <div className="text-right">{expStr}</div>
              <div className="text-muted-foreground">Per dose</div>
              <div className="text-right font-semibold">
                {plan.syringeUnits} u
              </div>
              <div className="text-muted-foreground">Store</div>
              <div className="text-right">Refrigerate</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
