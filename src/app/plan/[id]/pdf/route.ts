import { NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import * as React from "react";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import type { CalcResult } from "@/lib/calc";
import { formatDate } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#0b0e12",
  },
  brand: { fontSize: 12, color: "#0f766e", fontWeight: 700 },
  h1: { fontSize: 22, fontWeight: 700, marginTop: 6 },
  muted: { color: "#5b6472", fontSize: 10, marginTop: 3 },
  card: {
    borderWidth: 1,
    borderColor: "#e8eaee",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#5b6472" },
  value: { fontWeight: 700 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 16 },
  li: { marginTop: 4, flexDirection: "row" },
  liNum: { width: 16, color: "#0f766e", fontWeight: 700 },
  liText: { flex: 1 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 9, color: "#98a1af", textAlign: "center" },
  chip: {
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
  },
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const plan = await prisma.plan.findUnique({ where: { publicId: id } });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const result: CalcResult = JSON.parse(plan.data);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const qrDataUrl = await QRCode.toDataURL(`${siteUrl}/plan/${plan.publicId}`, { margin: 1, width: 220 });

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "LETTER", style: styles.page },
      React.createElement(
        View,
        { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" } },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brand }, "BACwater.ai"),
          React.createElement(Text, { style: styles.h1 }, result.input.peptideName || "Reconstitution plan"),
          React.createElement(Text, { style: styles.muted }, `Plan ${plan.publicId} · Saved ${formatDate(plan.createdAt)}`)
        ),
        React.createElement(Image, { src: qrDataUrl, style: { width: 90, height: 90 } })
      ),

      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: { fontSize: 12, fontWeight: 700 } }, "Summary"),
        React.createElement(Text, { style: { marginTop: 4 } }, result.summary),
        React.createElement(
          View,
          { style: { marginTop: 10 } },
          detail("Vial strength", `${result.input.vialStrengthMg} mg`),
          detail("BAC water added", `${result.usedBacMl} mL`),
          detail("Final concentration", `${result.finalConcentrationMgPerMl} mg/mL (${result.finalConcentrationMcgPerMl} mcg/mL)`),
          detail("Dose", `${result.input.doseMcg} mcg`),
          detail("Dose volume", `${result.doseVolumeMl.toFixed(3)} mL`),
          detail("Syringe reading", result.syringeReadout.displayLabel),
          detail("Doses per vial", `${result.dosesPerVial}`),
          detail("Date mixed", result.input.dateMixed ? formatDate(result.input.dateMixed) : "-"),
          detail("Expiration", result.expiration.date ? formatDate(result.expiration.date) : `${result.expiration.days} days after mixing`)
        )
      ),

      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.h2 }, "Step-by-step instructions"),
        ...result.instructions.map((s, i) =>
          React.createElement(
            View,
            { style: styles.li, key: i },
            React.createElement(Text, { style: styles.liNum }, `${i + 1}.`),
            React.createElement(Text, { style: styles.liText }, s)
          )
        )
      ),

      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: { fontSize: 12, fontWeight: 700 } }, "Storage & expiration"),
        React.createElement(Text, { style: { marginTop: 4 } }, result.expiration.note),
        React.createElement(Text, { style: { marginTop: 6, color: "#5b6472" } }, `Shelf life: ${result.expiration.days} days refrigerated`)
      ),

      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.h2 }, "Supply checklist"),
        ...result.supplies.map((s) =>
          React.createElement(
            View,
            { style: styles.li, key: s.sku },
            React.createElement(Text, { style: styles.liNum }, `${s.quantity}×`),
            React.createElement(Text, { style: styles.liText }, `${s.name}: ${s.reason}`)
          )
        )
      ),

      plan.notes
        ? React.createElement(
            View,
            { style: styles.card },
            React.createElement(Text, { style: { fontSize: 12, fontWeight: 700 } }, "Notes"),
            React.createElement(Text, { style: { marginTop: 4 } }, plan.notes)
          )
        : null,

      React.createElement(
        Text,
        { style: styles.footer, fixed: true },
        "BACwater.ai · This is not medical advice. Verify inputs against the label of your vial."
      )
    )
  );

  // The @react-pdf renderToBuffer type is very narrow; the actual runtime accepts our Document tree.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="bacwater-plan-${plan.publicId}.pdf"`,
    },
  });
}

function detail(k: string, v: string) {
  return React.createElement(
    View,
    { style: styles.row, key: k },
    React.createElement(Text, { style: styles.label }, k),
    React.createElement(Text, { style: styles.value }, v)
  );
}
