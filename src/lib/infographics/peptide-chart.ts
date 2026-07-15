/**
 * Per-compound reconstitution infographic: a horizontal bar chart of the
 * CONCENTRATION (mg/mL) produced at each common vial strength for a given bac
 * water amount. This is pure arithmetic on the numbers shown (concentration =
 * vial amount ÷ water) and asserts no dose or quantity (PRD §9.1.5, §9.11 —
 * the old "syringe units per typical dose" chart was rebuilt for exactly this
 * reason). Doubles as the page's featured, liftable image and social card, and
 * carries the BACwater.ai wordmark.
 */

import type { PeptideRef } from "@/lib/calc/peptides";
import { dosageRows, shortName } from "@/lib/peptides/page-data";
import { PALETTE, esc, svgDoc } from "@/lib/infographics/svg";

export function peptideChartAlt(p: PeptideRef): string {
  const name = shortName(p.name);
  const rows = dosageRows(p);
  const parts = rows.map(
    (r) => `a ${r.vialMg} mg vial with ${r.bacMl} mL of bac water makes ${r.concentrationMgPerMl} mg/mL`
  );
  return `${name} reconstitution reference: ${parts.join("; ")}. Concentration is the vial amount divided by the water added; no dose is assumed.`;
}

export function hasChart(p: PeptideRef): boolean {
  return p.slug !== "custom" && p.commonVialStrengthsMg.length > 0;
}

const TOP = 150;
const ROW_H = 46;
const FOOT = 52;

export function peptideChartDims(p: PeptideRef): { width: number; height: number } {
  const rows = dosageRows(p);
  return { width: 720, height: TOP + rows.length * ROW_H + FOOT };
}

/** The BACwater.ai wordmark lockup, rendered as text so it stays crisp. */
function logo(x: number, y: number): string {
  return `<text x="${x}" y="${y}" font-size="23" font-weight="400" letter-spacing="-0.4" fill="${PALETTE.foreground}">BACwater<tspan font-size="13" font-weight="500" font-style="italic" fill="${PALETTE.accent}"> .ai</tspan></text>`;
}

export function peptideChartSvg(p: PeptideRef): string {
  const name = shortName(p.name);
  const rows = dosageRows(p);

  const width = 720;
  const padL = 232;
  const padR = 96;
  const barMax = width - padL - padR;
  const height = TOP + rows.length * ROW_H + FOOT;

  const maxConc = Math.max(...rows.map((r) => r.concentrationMgPerMl), 1);

  const bars = rows
    .map((r, i) => {
      const y = TOP + i * ROW_H;
      // Reserve ~76px at the end of the longest bar so its value label never
      // runs past the right edge, whatever the compound's numbers are.
      const barW = Math.max(6, (r.concentrationMgPerMl / maxConc) * (barMax - 76));
      const label = `${r.vialMg} mg + ${r.bacMl} mL water`;
      return `
        <text x="${padL - 16}" y="${y + 17}" text-anchor="end" font-size="14" font-weight="600" fill="${PALETTE.foreground}">${esc(label)}</text>
        <rect x="${padL}" y="${y + 2}" width="${barMax}" height="24" rx="4" fill="${PALETTE.surface}"/>
        <rect x="${padL}" y="${y + 2}" width="${barW}" height="24" rx="4" fill="${PALETTE.accent}"/>
        <text x="${padL + barW + 12}" y="${y + 19}" font-size="14" font-weight="700" fill="${PALETTE.foreground}">${r.concentrationMgPerMl} mg/mL</text>
      `;
    })
    .join("");

  const title = `${name}: concentration by vial size after reconstitution`;
  const inner = `
    ${logo(32, 46)}
    <text x="${width - 32}" y="43" text-anchor="end" font-size="11" font-weight="600" letter-spacing="1.5" fill="${PALETTE.accent}">RECONSTITUTION REFERENCE</text>
    <line x1="32" y1="62" x2="${width - 32}" y2="62" stroke="${PALETTE.border}" stroke-width="1"/>
    <text x="32" y="100" font-size="22" font-weight="600" fill="${PALETTE.foreground}">${esc(name)}</text>
    <text x="32" y="124" font-size="13" fill="${PALETTE.muted}">Concentration you get at each common vial size and bac water amount.</text>
    ${bars}
    <text x="32" y="${height - 20}" font-size="11" fill="${PALETTE.muted}">Concentration = vial amount &#247; water added. Longer bar = stronger liquid. No dose is assumed and nothing is for sale.</text>
  `;

  return svgDoc({
    width,
    height,
    title,
    desc: peptideChartAlt(p),
    inner,
  });
}
