import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PlanQr } from "@/components/plan/plan-qr";
import { findPeptide } from "@/lib/calc";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Vial label",
  robots: { index: false, follow: false },
};

const LABEL_COUNT = 12;

export default async function LabelPage({ params }: Props) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return notFound();

  const shelfDays =
    plan.dateMixed && plan.expirationDate
      ? Math.max(
          1,
          Math.round(
            (+plan.expirationDate - +plan.dateMixed) / 86_400_000
          )
        )
      : findPeptide(plan.peptideSlug ?? "")?.refrigeratedShelfDays ?? 28;

  const labels = Array.from({ length: LABEL_COUNT });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 pb-24">
      {/* Label sizing lives here so screen and print match the physical size. */}
      <style>{`
        .label-sheet {
          display: grid;
          grid-template-columns: repeat(auto-fill, 2.5in);
          gap: 0.2in;
          justify-content: center;
        }
        .vial-label {
          width: 2.5in;
          height: 1.5in;
          box-sizing: border-box;
          padding: 0.12in 0.14in;
          border: 1px dashed var(--color-border);
          border-radius: 0.08in;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          background: #ffffff;
        }
        .vl-write {
          border-bottom: 1px solid #9ca3af;
          min-width: 0.9in;
          display: inline-block;
          height: 0.9em;
        }
        @media print {
          .label-sheet {
            gap: 0.1in;
            justify-content: flex-start;
          }
          .vial-label {
            border: 1px solid #9ca3af;
            border-radius: 0;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Printable vial labels
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
            Each label is 2.5 by 1.5 inches. Print at 100% scale (no page
            scaling), cut along the outlines, and write the mix date on the
            label when you actually mix that vial. Use one label per vial.
          </p>
        </div>
        <div className="rounded-full border border-border bg-muted px-4 h-10 grid place-items-center text-sm text-muted-foreground shrink-0">
          Use &#8984;/Ctrl+P to print
        </div>
      </div>

      <div className="mt-8 label-sheet">
        {labels.map((_, i) => (
          <div key={i} className="vial-label">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[7px] uppercase tracking-widest text-muted-foreground leading-none">
                  BACwater.ai
                </div>
                <div className="text-[13px] font-semibold leading-tight truncate mt-0.5">
                  {plan.peptideName || "Peptide"}
                </div>
                <div className="text-[8px] text-muted-foreground leading-tight mt-0.5">
                  {plan.vialStrengthMg} mg vial &middot; {plan.bacWaterMl} mL BAC
                  &middot; {plan.syringeUnits} u/dose
                </div>
              </div>
              <div className="shrink-0">
                <PlanQr publicId={plan.publicId} size={54} />
              </div>
            </div>

            <div className="text-[8px] leading-relaxed">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Mixed</span>
                <span className="vl-write" />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-muted-foreground">Exp</span>
                <span className="vl-write" />
                <span className="text-muted-foreground whitespace-nowrap">
                  within {shelfDays} d
                </span>
              </div>
            </div>

            <div className="text-[8px] text-muted-foreground leading-tight">
              Refrigerate &middot; protect from light &middot; do not freeze
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
