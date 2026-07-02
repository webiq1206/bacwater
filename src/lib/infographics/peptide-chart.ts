/**
 * Per-peptide dosage infographic: a horizontal bar chart showing the syringe
 * units for a typical dose at each common vial strength, with the bac water
 * amount and concentration labeled. This visualizes the mg-to-units
 * relationship and doubles as the page's featured, liftable image.
 */

import type { PeptideRef } from "@/lib/calc/peptides";
import { dosageRows, shortName } from "@/lib/peptides/page-data";
import { PALETTE, esc, svgDoc } from "@/lib/infographics/svg";

export function peptideChartAlt(p: PeptideRef): string {
  const name = shortName(p.name);
  const rows = dosageRows(p);
  const parts = rows.map(
    (r) => `${r.vialMg} mg vial with ${r.bacMl} mL bac water gives ${r.units} units per ${r.doseLabel} dose`
  );
  return `${name} bac water dosage chart: ${parts.join("; ")}.`;
}

export function hasChart(p: PeptideRef): boolean {
  return p.slug !== "custom" && p.commonVialStrengthsMg.length > 0;
}

export function peptideChartDims(p: PeptideRef): { width: number; height: number } {
  const rows = dosageRows(p);
  return { width: 720, height: 88 + rows.length * 46 + 56 };
}

export function peptideChartSvg(p: PeptideRef): string {
  const name = shortName(p.name);
  const rows = dosageRows(p);
  const doseLabel = rows[0]?.doseLabel ?? "";

  const width = 720;
  const padL = 210;
  const padR = 90;
  const top = 88;
  const rowH = 46;
  const barMax = width - padL - padR;
  const height = top + rows.length * rowH + 56;

  const maxUnits = Math.max(...rows.map((r) => r.units), 10);

  const bars = rows
    .map((r, i) => {
      const y = top + i * rowH;
      const barW = Math.max(6, (r.units / maxUnits) * barMax);
      const label = `${r.vialMg} mg vial + ${r.bacMl} mL`;
      const conc = `${r.concentrationMgPerMl} mg/mL`;
      return `
        <text x="${padL - 14}" y="${y + 15}" text-anchor="end" font-size="14" font-weight="600" fill="${PALETTE.foreground}">${esc(label)}</text>
        <text x="${padL - 14}" y="${y + 31}" text-anchor="end" font-size="11" fill="${PALETTE.muted}">${esc(conc)}</text>
        <rect x="${padL}" y="${y + 2}" width="${barMax}" height="24" rx="3" fill="${PALETTE.surface}"/>
        <rect x="${padL}" y="${y + 2}" width="${barW}" height="24" rx="3" fill="${PALETTE.accent}"/>
        <text x="${padL + barW + 10}" y="${y + 19}" font-size="14" font-weight="700" fill="${PALETTE.foreground}">${r.units} units</text>
      `;
    })
    .join("");

  const title = `${name}: bac water to draw for a ${doseLabel} dose`;
  const inner = `
    <text x="32" y="40" font-size="20" font-weight="700" fill="${PALETTE.foreground}">${esc(name)} dosage chart</text>
    <text x="32" y="64" font-size="13" fill="${PALETTE.muted}">Syringe units for a typical ${esc(doseLabel)} dose, by vial strength (U-100 syringe).</text>
    ${bars}
    <text x="32" y="${height - 20}" font-size="11" fill="${PALETTE.muted}">Bars show units to draw per dose. Longer bar = more units. Verify the strength on your own vial. bacwater.ai</text>
  `;

  return svgDoc({
    width,
    height,
    title,
    desc: peptideChartAlt(p),
    inner,
  });
}
