/**
 * Comparison infographic: a side-by-side visual of the two or three key
 * differences between bac water and the other liquid, plus the one-line
 * verdict. Complements the on-page table and gives image search and
 * multimodal answer engines a second, liftable path to the comparison.
 */

import type { ComparisonTopic } from "@/lib/comparisons/content";
import { PALETTE, esc, svgDoc } from "@/lib/infographics/svg";

function firstSentence(text: string): string {
  const m = text.match(/^[^.]*\./);
  return (m ? m[0] : text).trim();
}

export function comparisonDims(c: ComparisonTopic): { width: number; height: number } {
  const rows = c.table.slice(0, 3);
  return { width: 720, height: 150 + rows.length * 72 + 74 };
}

export function comparisonAlt(c: ComparisonTopic): string {
  const rows = c.table.slice(0, 3);
  const parts = rows.map(
    (r) => `${r.dimension}: bac water ${r.bac}, ${c.otherName} ${r.other}`
  );
  return `${c.title} infographic. ${parts.join("; ")}.`;
}

export function comparisonSvg(c: ComparisonTopic): string {
  const rows = c.table.slice(0, 3);
  const width = 720;
  const padX = 32;
  const colGap = 16;
  const labelW = 150;
  const colW = (width - padX * 2 - labelW - colGap * 2) / 2;
  const bacX = padX + labelW + colGap;
  const otherX = bacX + colW + colGap;

  const headerY = 118;
  const rowTop = 150;
  const rowH = 72;
  const height = rowTop + rows.length * rowH + 74;

  const headers = `
    <text x="${padX}" y="${headerY}" font-size="12" font-weight="600" fill="${PALETTE.muted}"></text>
    <rect x="${bacX}" y="${headerY - 22}" width="${colW}" height="30" rx="4" fill="${PALETTE.accent}"/>
    <text x="${bacX + colW / 2}" y="${headerY - 2}" text-anchor="middle" font-size="14" font-weight="700" fill="${PALETTE.white}">Bac water</text>
    <rect x="${otherX}" y="${headerY - 22}" width="${colW}" height="30" rx="4" fill="${PALETTE.surface}"/>
    <text x="${otherX + colW / 2}" y="${headerY - 2}" text-anchor="middle" font-size="14" font-weight="700" fill="${PALETTE.foreground}">${esc(c.otherName)}</text>
  `;

  const body = rows
    .map((r, i) => {
      const y = rowTop + i * rowH;
      return `
        <text x="${padX}" y="${y + 30}" font-size="13" font-weight="600" fill="${PALETTE.foreground}">${esc(r.dimension)}</text>
        <rect x="${bacX}" y="${y + 8}" width="${colW}" height="${rowH - 16}" rx="4" fill="${PALETTE.accentSoft}"/>
        ${wrap(r.bac, bacX + 12, y + 30, colW - 24, PALETTE.accent)}
        <rect x="${otherX}" y="${y + 8}" width="${colW}" height="${rowH - 16}" rx="4" fill="${PALETTE.surface}"/>
        ${wrap(r.other, otherX + 12, y + 30, colW - 24, PALETTE.foreground)}
      `;
    })
    .join("");

  const inner = `
    <text x="${padX}" y="42" font-size="20" font-weight="700" fill="${PALETTE.foreground}">${esc(c.title)}</text>
    <rect x="${padX}" y="58" width="${width - padX * 2}" height="30" rx="4" fill="${PALETTE.accentSoft}"/>
    <text x="${padX + 12}" y="78" font-size="13" font-weight="600" fill="${PALETTE.accent}">${esc(firstSentence(c.verdict))}</text>
    ${headers}
    ${body}
    <text x="${padX}" y="${height - 20}" font-size="11" fill="${PALETTE.muted}">For research and educational use only. bacwater.ai</text>
  `;

  return svgDoc({
    width,
    height,
    title: c.title,
    desc: comparisonAlt(c),
    inner,
  });
}

/** Very small word-wrap for cell text (max two lines). */
function wrap(text: string, x: number, y: number, maxW: number, fill: string): string {
  const approxChar = 6.4; // px per char at 12px
  const maxChars = Math.max(6, Math.floor(maxW / approxChar));
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
    if (lines.length >= 2) break;
  }
  if (cur && lines.length < 2) lines.push(cur);
  if (lines.length === 2 && words.join(" ").length > lines.join(" ").length) {
    lines[1] = lines[1].replace(/\s*\S*$/, "") + "...";
  }
  return lines
    .map(
      (ln, i) =>
        `<text x="${x}" y="${y + i * 15}" font-size="12" font-weight="600" fill="${fill}">${esc(ln)}</text>`
    )
    .join("");
}
