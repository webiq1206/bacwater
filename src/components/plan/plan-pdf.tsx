/**
 * Professional, multi-page reconstitution reference guide (PDF).
 *
 * Rendered server-side with @react-pdf/renderer from `src/app/plan/[id]/pdf/route.ts`.
 * Every displayed number goes through the shared formatters in
 * `@/lib/calc/format` so the PDF always matches the results page, the plans
 * list, and the vial label.
 */
import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Rect,
  Line,
  Path,
} from "@react-pdf/renderer";
import type { CalcResult } from "@/lib/calc";
import { findPeptide, findSyringe } from "@/lib/calc";
import {
  formatConcentration,
  formatDose,
  formatMl,
  formatSyringeReading,
  formatUnits,
} from "@/lib/calc/format";
import { formatDate } from "@/lib/utils";

// Brand palette (see brand-system): Bone / Charcoal / Sage / Mist / Line.
// `teal` keys are kept for naming compatibility but now carry the sage accent.
// Bump when the guide's layout/contents change, so a printed copy can be
// matched to the template that produced it.
const GUIDE_VERSION = "1.1";

// Provenance of each printed number, mirroring the results page's chips: what
// the user typed, what the calculator derived, and what comes from research.
type Provenance = "user" | "calculated" | "research";
const SRC_LABEL: Record<Provenance, string> = {
  user: "YOU ENTERED",
  calculated: "WE CALCULATED",
  research: "FROM RESEARCH",
};

const C = {
  ink: "#2c302f", // charcoal, primary text + hero number
  teal: "#5d6561", // sage, accent (eyebrow, table header, syringe marker)
  tealSoft: "#cfd4cf", // sage hairline
  tealBg: "#eef0ec", // light sage tint
  muted: "#6a706b", // secondary text
  faint: "#9aa09b", // mist, captions
  border: "#e4e1dd", // line
  panel: "#f5f3f0", // warm panel
  warnInk: "#6f5324",
  warnBg: "#faf6ee",
  warnBorder: "#e6dcc4",
};

const s = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    lineHeight: 1.5,
    color: C.ink,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.4,
    color: C.teal,
    fontFamily: "Helvetica-Bold",
  },
  h1: { fontSize: 21, fontFamily: "Helvetica-Bold", marginTop: 5 },
  subtitle: { fontSize: 11, color: C.muted, marginTop: 2 },
  metaLine: { fontSize: 8.5, color: C.faint, marginTop: 4 },

  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 22,
    marginBottom: 8,
  },
  sectionTitleFirst: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },

  divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginTop: 14 },

  card: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },

  qrCaption: { fontSize: 7.5, color: C.faint, textAlign: "center", marginTop: 3 },

  heroWrap: {
    backgroundColor: C.tealBg,
    borderWidth: 1,
    borderColor: C.tealSoft,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: { fontSize: 8.5, letterSpacing: 1, color: C.muted, fontFamily: "Helvetica-Bold" },
  heroNumber: { fontSize: 34, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: C.ink, marginTop: 2 },
  heroSub: { fontSize: 9.5, color: C.muted, marginTop: 4 },

  gridRow: { flexDirection: "row", marginTop: 10 },
  gridCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 9,
    marginRight: 8,
  },
  gridCellLast: { marginRight: 0 },
  cellLabel: { fontSize: 7.5, letterSpacing: 0.6, color: C.muted, fontFamily: "Helvetica-Bold" },
  cellValue: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 3 },
  cellSub: { fontSize: 7.5, color: C.faint, marginTop: 1 },
  cellSrc: { fontSize: 6.5, letterSpacing: 0.5, fontFamily: "Helvetica-Bold", marginTop: 3 },

  step: { flexDirection: "row", marginTop: 7 },
  stepNum: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: C.teal,
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 3,
    marginRight: 9,
  },
  stepText: { flex: 1, paddingTop: 1 },

  calloutWarn: {
    backgroundColor: C.warnBg,
    borderWidth: 1,
    borderColor: C.warnBorder,
    borderRadius: 8,
    padding: 11,
    marginTop: 10,
  },
  calloutTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: C.warnInk, marginBottom: 3 },
  calloutItem: { fontSize: 9, color: C.warnInk, marginTop: 2 },

  panel: {
    backgroundColor: C.panel,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },

  kv: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  kvLabel: { color: C.muted },
  kvValue: { fontFamily: "Helvetica-Bold" },

  // Reference table
  tHead: {
    flexDirection: "row",
    backgroundColor: C.teal,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tHeadCell: { flex: 1, color: "#ffffff", fontSize: 8.5, fontFamily: "Helvetica-Bold", padding: 6 },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.border },
  tRowAlt: { backgroundColor: C.panel },
  tRowHi: { backgroundColor: C.tealBg },
  tCell: { flex: 1, fontSize: 9, padding: 6 },
  tCellHi: { fontFamily: "Helvetica-Bold", color: C.teal },

  bullet: { flexDirection: "row", marginTop: 4 },
  bulletDot: { width: 12, color: C.teal, fontFamily: "Helvetica-Bold" },
  bulletText: { flex: 1 },

  disclaimerBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  disclaimerText: { fontSize: 8, color: C.muted, lineHeight: 1.55 },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 44,
    right: 44,
  },
  footerRule: { borderTopWidth: 1, borderTopColor: C.border, marginBottom: 5 },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: C.faint },
});

function Footer() {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerRule} />
      <View style={s.footerRow}>
        <Text style={s.footerText}>
          BACwater.ai · For laboratory research use only, not for human or veterinary use.
        </Text>
        <Text
          style={s.footerText}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </View>
  );
}

/**
 * The syringe illustration for the PDF. Deliberately drawn to match the
 * results-page SyringeVisual exactly, same orientation (needle left, plunger
 * right), same barrel/flange/plunger shapes, the same graduation marks, and the
 * same "measure to here" marker above the fill line, so what a user sees online
 * and what they download are identical (PRD §9.6).
 */
function SyringeGraphic({
  fillPercent,
  scale,
  maxValue,
}: {
  fillPercent: number;
  scale: "u100" | "ml";
  /** Numeric capacity in the syringe's own scale (100 units, or 1 mL). */
  maxValue: number;
}) {
  const clamped = Math.max(0, Math.min(100, fillPercent));
  const marks = scale === "u100" ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] : [0, 25, 50, 75, 100];
  const labelForMark = (m: number) =>
    scale === "u100" ? `${(maxValue * m) / 100}` : `${((maxValue * m) / 100).toFixed(2)}`;

  // Geometry mirrors SyringeVisual's viewBox (0 0 520 140).
  const needleTipX = 12;
  const needleBaseX = 80;
  const cY = 70;
  const nH = 3;
  const barrelX = 80;
  const barrelEndX = 430;
  const barrelY = 38;
  const barrelH = 64;
  const barrelR = 6;
  const innerX = barrelX + 4;
  const innerW = barrelEndX - 4 - innerX;
  const fillW = (clamped / 100) * innerW;
  const fillEndX = innerX + fillW;
  const rodEndX = 510;

  const ink = C.ink;
  const accent = C.teal;
  const tickTop = barrelY + barrelH + 3;

  return (
    <Svg width={468} height={126} viewBox="0 0 520 140">
      {/* needle hub + tapered shaft (left) */}
      <Rect x={needleBaseX - 12} y={cY - 10} width={16} height={20} rx={2} fill={ink} opacity={0.2} />
      <Path
        d={`M ${needleTipX} ${cY} L ${needleBaseX - 12} ${cY - nH} L ${needleBaseX - 12} ${cY + nH} Z`}
        fill={ink}
        opacity={0.35}
      />
      {/* barrel */}
      <Rect x={barrelX} y={barrelY} width={barrelEndX - barrelX} height={barrelH} rx={barrelR} fill="#f5f3f0" stroke={ink} strokeWidth={1.5} strokeOpacity={0.25} />
      {/* flange at barrel end */}
      <Rect x={barrelEndX - 3} y={barrelY - 8} width={6} height={barrelH + 16} rx={2} fill={ink} opacity={0.12} />
      {/* liquid fill */}
      {clamped > 0 ? (
        <Rect x={innerX} y={barrelY + 4} width={Math.max(0, fillW)} height={barrelH - 8} rx={3} fill={C.tealSoft} />
      ) : null}
      {/* plunger head at fill boundary */}
      <Rect x={fillEndX - 2} y={barrelY + 2} width={10} height={barrelH - 4} rx={2} fill={ink} opacity={0.18} />
      {/* plunger rod + thumb rest (right) */}
      <Rect x={barrelEndX} y={cY - 3} width={rodEndX - barrelEndX} height={6} rx={2} fill={ink} opacity={0.12} />
      <Rect x={rodEndX - 4} y={cY - 14} width={8} height={28} rx={3} fill={ink} opacity={0.12} />
      {/* major graduation marks + labels */}
      {marks.map((m) => {
        const x = innerX + (m / 100) * innerW;
        return (
          <React.Fragment key={m}>
            <Line x1={x} y1={tickTop} x2={x} y2={tickTop + 10} stroke={ink} strokeWidth={1.2} strokeOpacity={0.5} />
            <Text x={x} y={tickTop + 22} textAnchor="middle" style={{ fontSize: 8, fill: C.muted }}>
              {labelForMark(m)}
            </Text>
          </React.Fragment>
        );
      })}
      {/* minor ticks (u100, every 5) */}
      {scale === "u100"
        ? [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((m) => {
            const x = innerX + (m / 100) * innerW;
            return <Line key={`mi${m}`} x1={x} y1={tickTop} x2={x} y2={tickTop + 4} stroke={ink} strokeWidth={0.6} strokeOpacity={0.25} />;
          })
        : null}
      {/* measure-to-here marker above the fill line */}
      {clamped > 0 && clamped < 100 ? (
        <React.Fragment>
          <Path d={`M ${fillEndX} ${barrelY - 2} L ${fillEndX - 5} ${barrelY - 10} L ${fillEndX + 5} ${barrelY - 10} Z`} fill={accent} />
          <Line x1={fillEndX} y1={barrelY - 10} x2={fillEndX} y2={barrelY - 18} stroke={accent} strokeWidth={1.5} />
        </React.Fragment>
      ) : null}
    </Svg>
  );
}

interface PlanPdfProps {
  plan: {
    publicId: string;
    createdAt: Date;
    notes: string | null;
  };
  result: CalcResult;
  qrDataUrl: string;
}

export function PlanPdfDocument({ plan, result, qrDataUrl }: PlanPdfProps) {
  const peptideName = result.input.peptideName || "Reconstitution plan";
  const peptideRef = result.input.peptideSlug ? findPeptide(result.input.peptideSlug) : null;
  const syringe = findSyringe(result.input.syringeType as never);
  const conc = result.finalConcentrationMgPerMl; // mg/mL

  // Build a dosage reference table: draw amount -> volume -> peptide delivered.
  const isU100 = result.syringeReadout.kind === "u100";
  const maxUnits = syringe.maxUnits || 100;
  const rows: { draw: string; volume: string; amount: string; highlight: boolean }[] = [];
  const chosenUnits = result.syringeReadout.valueRounded;
  if (isU100) {
    const step = maxUnits <= 30 ? 5 : maxUnits <= 50 ? 5 : 10;
    for (let u = step; u <= maxUnits; u += step) {
      const ml = u / 100;
      const mcg = ml * conc * 1000;
      rows.push({
        draw: `${u} units`,
        volume: `${ml.toFixed(2)} mL`,
        amount: formatDose(Math.round(mcg)),
        highlight: Math.abs(u - chosenUnits) < step / 2,
      });
    }
  } else {
    const maxMl = syringe.maxVolumeMl;
    const step = maxMl / 8;
    for (let v = step; v <= maxMl + 1e-9; v += step) {
      const mcg = v * conc * 1000;
      rows.push({
        draw: `${v.toFixed(2)} mL`,
        volume: `${v.toFixed(2)} mL`,
        amount: formatDose(Math.round(mcg)),
        highlight: Math.abs(v - result.doseVolumeMl) < step / 2,
      });
    }
  }

  const bacSource: Provenance =
    Math.abs(result.usedBacMl - result.recommendedBacMl) < 0.01 ? "calculated" : "user";
  const srcColor: Record<Provenance, string> = {
    user: C.muted,
    calculated: C.teal,
    research: C.warnInk,
  };

  const figures: { label: string; value: string; sub?: string; src: Provenance }[] = [
    { label: "VIAL STRENGTH", value: `${result.input.vialStrengthMg} mg`, src: "user" },
    { label: "BAC WATER ADDED", value: `${formatMl(result.usedBacMl)} mL`, src: bacSource },
    {
      label: "CONCENTRATION",
      value: `${formatConcentration(conc)} mg/mL`,
      sub: `${result.finalConcentrationMcgPerMl.toLocaleString()} mcg/mL`,
      src: "calculated",
    },
    { label: "AMOUNT", value: formatDose(result.input.doseMcg), src: "user" },
    { label: "VOLUME TO MEASURE", value: `${result.doseVolumeMl.toFixed(3)} mL`, src: "calculated" },
    { label: "MEASUREMENTS PER VIAL", value: `${result.dosesPerVial}`, src: "calculated" },
  ];

  return (
    <Document
      title={`BACwater.ai, ${peptideName} reconstitution guide`}
      author="BACwater.ai"
    >
      {/* ---------------- PAGE 1, Summary ---------------- */}
      <Page size="LETTER" style={s.page}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>RECONSTITUTION REFERENCE GUIDE</Text>
            <Text style={s.h1}>{peptideName}</Text>
            <Text style={s.subtitle}>
              {peptideRef?.category
                ? `${peptideRef.category[0].toUpperCase()}${peptideRef.category.slice(1)} research peptide`
                : "Research compound"}
            </Text>
            <Text style={s.metaLine}>
              Plan {plan.publicId} · Generated {formatDate(plan.createdAt)} · Guide v{GUIDE_VERSION}
            </Text>
          </View>
          <View style={{ alignItems: "center", marginLeft: 12 }}>
            <Image src={qrDataUrl} style={{ width: 74, height: 74 }} />
            <Text style={s.qrCaption}>Scan to open online</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Hero */}
        <View style={s.heroWrap}>
          <View>
            <Text style={s.heroLabel}>MEASURE THIS MUCH EACH TIME</Text>
            <Text style={s.heroNumber}>{formatSyringeReading(result.syringeReadout)}</Text>
            <Text style={s.heroSub}>
              {`= ${result.doseVolumeMl.toFixed(3)} mL  ·  ${formatDose(result.input.doseMcg)}`}
            </Text>
          </View>
          <View style={{ maxWidth: 150 }}>
            <Text style={{ fontSize: 8.5, color: C.muted }}>
              on your {syringe.label}
            </Text>
          </View>
        </View>

        {/* Key figures grid */}
        <View style={s.gridRow}>
          {figures.slice(0, 3).map((f, i) => (
            <View key={f.label} style={[s.gridCell, i === 2 ? s.gridCellLast : {}]}>
              <Text style={s.cellLabel}>{f.label}</Text>
              <Text style={s.cellValue}>{f.value}</Text>
              {f.sub ? <Text style={s.cellSub}>{f.sub}</Text> : null}
              <Text style={[s.cellSrc, { color: srcColor[f.src] }]}>{SRC_LABEL[f.src]}</Text>
            </View>
          ))}
        </View>
        <View style={s.gridRow}>
          {figures.slice(3, 6).map((f, i) => (
            <View key={f.label} style={[s.gridCell, i === 2 ? s.gridCellLast : {}]}>
              <Text style={s.cellLabel}>{f.label}</Text>
              <Text style={s.cellValue}>{f.value}</Text>
              {f.sub ? <Text style={s.cellSub}>{f.sub}</Text> : null}
              <Text style={[s.cellSrc, { color: srcColor[f.src] }]}>{SRC_LABEL[f.src]}</Text>
            </View>
          ))}
        </View>

        {/* Syringe graphic, mirrors the results page exactly */}
        <View wrap={false}>
          <Text style={s.sectionTitle}>Where to measure on the syringe</Text>
          <View style={[s.card, { paddingVertical: 16 }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <View>
                <Text style={{ fontSize: 8, letterSpacing: 1, color: C.teal, fontFamily: "Helvetica-Bold" }}>
                  MEASURE TO HERE
                </Text>
                <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 1 }}>
                  {result.syringeReadout.displayLabel}
                </Text>
              </View>
              <Text style={{ fontSize: 8.5, color: C.muted }}>
                Syringe: {isU100 ? `${maxUnits} units` : `${syringe.maxVolumeMl} mL`}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <SyringeGraphic
                fillPercent={result.syringeReadout.fillPercent}
                scale={isU100 ? "u100" : "ml"}
                maxValue={isU100 ? maxUnits : syringe.maxVolumeMl}
              />
            </View>
            <Text style={{ fontSize: 7.5, letterSpacing: 1, color: C.muted, textAlign: "center", marginTop: 2 }}>
              {isU100 ? "UNITS" : "ML"}
            </Text>
          </View>
        </View>

        {/* Blend companion */}
        {result.secondary ? (
          <View style={s.panel}>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
              This is a blend
            </Text>
            <Text style={{ fontSize: 9.5, color: C.muted }}>
              {`Every draw also delivers ${formatDose(result.secondary.companionDoseMcg)} of ${result.secondary.peptideName} (${formatConcentration(result.secondary.concentrationMgPerMl)} mg/mL in the same vial).`}
            </Text>
          </View>
        ) : null}

        {/* Research disclaimer strip */}
        <View style={[s.panel, { marginTop: 14 }]}>
          <Text style={{ fontSize: 8.5, color: C.muted }}>
            This guide provides general reconstitution math for laboratory research and
            educational use only. It is not medical advice. Always verify every value against
            the label on your vial.
          </Text>
        </View>

        <Footer />
      </Page>

      {/* ---------------- PAGE 2, Preparation ---------------- */}
      <Page size="LETTER" style={s.page}>
        <Text style={s.sectionTitleFirst}>Step-by-step laboratory preparation</Text>
        <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 6 }}>
          Work on a clean surface. Do each step in order. There is no rush.
        </Text>
        {result.instructions.map((step, i) => (
          <View key={i} style={s.step}>
            <Text style={s.stepNum}>{i + 1}</Text>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}

        {result.warnings.length > 0 ? (
          <View style={s.calloutWarn}>
            <Text style={s.calloutTitle}>Before you mix, double-check these</Text>
            {result.warnings.map((w, i) => (
              <Text key={i} style={s.calloutItem}>
                • {w}
              </Text>
            ))}
          </View>
        ) : null}

        <View wrap={false}>
          <Text style={s.sectionTitle}>Mixing tips</Text>
          <View style={s.card}>
            <View style={s.bullet}>
              <Text style={s.bulletDot}>›</Text>
              <Text style={s.bulletText}>
                Aim the BAC water at the glass wall, not directly onto the powder. A gentle
                stream protects the peptide.
              </Text>
            </View>
            <View style={s.bullet}>
              <Text style={s.bulletDot}>›</Text>
              <Text style={s.bulletText}>
                Roll or swirl it. Do not shake it, if your product&apos;s instructions say so.
              </Text>
            </View>
            <View style={s.bullet}>
              <Text style={s.bulletDot}>›</Text>
              <Text style={s.bulletText}>
                Wait until the solution is completely clear before measuring your first amount.
              </Text>
            </View>
          </View>
        </View>

        {plan.notes ? (
          <>
            <Text style={s.sectionTitle}>Your notes</Text>
            <View style={s.card}>
              <Text>{plan.notes}</Text>
            </View>
          </>
        ) : null}

        <Footer />
      </Page>

      {/* ---------------- PAGE 3, Reference & storage ---------------- */}
      <Page size="LETTER" style={s.page}>
        <View wrap={false}>
          <Text style={s.sectionTitleFirst}>Dosage reference table</Text>
          <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 8 }}>
            At {formatConcentration(conc)} mg/mL, here is how much peptide each amount delivers.
            Your plan&apos;s amount is highlighted.
          </Text>
          <View>
            <View style={s.tHead}>
              <Text style={s.tHeadCell}>Measure on syringe</Text>
              <Text style={s.tHeadCell}>Volume</Text>
              <Text style={s.tHeadCell}>Peptide delivered</Text>
            </View>
            {rows.map((r, i) => (
              <View
                key={i}
                style={[
                  s.tRow,
                  r.highlight ? s.tRowHi : i % 2 === 1 ? s.tRowAlt : {},
                ]}
              >
                <Text style={[s.tCell, r.highlight ? s.tCellHi : {}]}>{r.draw}</Text>
                <Text style={[s.tCell, r.highlight ? s.tCellHi : {}]}>{r.volume}</Text>
                <Text style={[s.tCell, r.highlight ? s.tCellHi : {}]}>{r.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        <View wrap={false}>
          <Text style={s.sectionTitle}>Storage & stability</Text>
          <View style={s.card}>
            <View style={s.kv}>
              <Text style={s.kvLabel}>Shelf life (refrigerated)</Text>
              <Text style={s.kvValue}>{result.expiration.days} days</Text>
            </View>
            {result.expiration.date ? (
              <View style={s.kv}>
                <Text style={s.kvLabel}>Discard on</Text>
                <Text style={s.kvValue}>{formatDate(result.expiration.date)}</Text>
              </View>
            ) : null}
            <View style={[s.kv, { marginTop: 4 }]}>
              <Text style={{ color: C.muted, flex: 1 }}>{result.expiration.note}</Text>
            </View>
            <View style={{ marginTop: 6 }}>
              <View style={s.bullet}>
                <Text style={s.bulletDot}>›</Text>
                <Text style={s.bulletText}>Keep it cold. Refrigerate as soon as it is mixed.</Text>
              </View>
              <View style={s.bullet}>
                <Text style={s.bulletDot}>›</Text>
                <Text style={s.bulletText}>Keep it dark. Store in the box or wrap the vial in foil.</Text>
              </View>
              <View style={s.bullet}>
                <Text style={s.bulletDot}>›</Text>
                <Text style={s.bulletText}>Freezing can damage many peptides. Check your product&apos;s instructions.</Text>
              </View>
            </View>
          </View>
        </View>

        <View wrap={false}>
          <Text style={s.sectionTitle}>Supplies for this plan</Text>
          <View style={s.card}>
            {result.supplies.map((sup) => (
              <View key={sup.sku} style={s.step}>
                <Text style={[s.stepNum, { backgroundColor: C.ink }]}>{sup.quantity}</Text>
                <Text style={s.stepText}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{sup.name}</Text>
                  {`: ${sup.reason}`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {result.assumptions.length > 0 ? (
          <View wrap={false}>
            <Text style={s.sectionTitle}>How we calculated this</Text>
            <View style={s.panel}>
              {result.assumptions.map((a, i) => (
                <View key={i} style={s.bullet}>
                  <Text style={s.bulletDot}>›</Text>
                  <Text style={[s.bulletText, { color: C.muted, fontSize: 9 }]}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* What this plan does not decide, mirrors the results self-check */}
        <View wrap={false}>
          <Text style={s.sectionTitle}>What this plan does not decide</Text>
          <View style={s.panel}>
            <Text style={{ fontSize: 9, color: C.muted }}>
              You entered the vial amount, how much to measure, and your syringe. The site
              worked out the concentration, the syringe units, and the measurements per vial,
              and the shelf life comes from research. This plan does not decide how much to use,
              how often, or whether a compound is safe or right for anyone. Those are not math.
            </Text>
          </View>
        </View>

        {/* Full legal disclaimer */}
        <View style={s.disclaimerBox} wrap={false}>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
            Important: research use only
          </Text>
          <Text style={s.disclaimerText}>
            BACwater.ai calculates concentration and measurement values from the numbers you
            enter. It sells nothing and recommends no vendor. All information and calculations
            are provided strictly for laboratory research and educational purposes. Nothing here
            is intended for human or veterinary use, for diagnosis or treatment of any condition,
            or as a substitute for professional medical advice. The calculations in this guide
            are general reconstitution math based on the values you entered. Always verify every
            number against your vial&apos;s own label and documentation before use. Handle all
            materials according to accepted laboratory safety practices and dispose of sharps in
            an approved sharps container.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
