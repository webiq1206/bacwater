import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import * as React from "react";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { hasPlanAccess } from "@/lib/plan-access";
import type { CalcResult } from "@/lib/calc";
import { PlanPdfDocument } from "@/components/plan/plan-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let result: CalcResult;
  try {
    result = JSON.parse(plan.data) as CalcResult;
  } catch {
    return NextResponse.json({ error: "This plan's data is corrupted." }, { status: 422 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const qrDataUrl = await QRCode.toDataURL(`${siteUrl}/plan/${plan.publicId}`, {
    margin: 1,
    width: 220,
  });

  const session = await auth();
  const canReadNotes = await hasPlanAccess(plan, (session?.user as { id?: string } | undefined)?.id);
  const doc = React.createElement(PlanPdfDocument, {
    plan: { publicId: plan.publicId, createdAt: plan.createdAt, notes: canReadNotes ? plan.notes : null },
    result,
    qrDataUrl,
  });

  // The @react-pdf renderToBuffer type is very narrow; the runtime accepts our Document tree.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Referrer-Policy": "no-referrer",
      "Content-Disposition": `inline; filename="bacwater-plan-${plan.publicId}.pdf"`,
    },
  });
}
