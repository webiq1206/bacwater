/**
 * Static infographics that are the same for everyone: the storage / shelf-life
 * rules card for the FAQ hub's numeric entries, and the shipping timeline for
 * the buy page.
 */

import { PALETTE, esc, svgDoc } from "@/lib/infographics/svg";

/* ---------- Storage & shelf life (FAQ hub) ---------- */

const STORAGE_CARDS = [
  { big: "Fridge", sub: "Store at 36-46 F (2-8 C)" },
  { big: "~28 days", sub: "Typical shelf life once mixed" },
  { big: "Dark", sub: "Keep in the box or foil" },
  { big: "Never freeze", sub: "Freezing destroys peptides" },
];

export function storageAlt(): string {
  return `Reconstituted peptide storage rules: ${STORAGE_CARDS.map((c) => `${c.big}, ${c.sub}`).join("; ")}.`;
}

export function storageSvg(): string {
  const width = 720;
  const height = 210;
  const padX = 32;
  const cardGap = 14;
  const cardW = (width - padX * 2 - cardGap * 3) / 4;
  const cardY = 88;
  const cardH = 92;

  const cards = STORAGE_CARDS.map((c, i) => {
    const x = padX + i * (cardW + cardGap);
    return `
      <rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" fill="${PALETTE.accentSoft}" stroke="${PALETTE.border}"/>
      <text x="${x + cardW / 2}" y="${cardY + 40}" text-anchor="middle" font-size="19" font-weight="700" fill="${PALETTE.accent}">${esc(c.big)}</text>
      ${splitSub(c.sub, x + cardW / 2, cardY + 62, cardW - 16)}
    `;
  }).join("");

  const inner = `
    <text x="${padX}" y="42" font-size="20" font-weight="700" fill="${PALETTE.foreground}">Storing reconstituted peptides</text>
    <text x="${padX}" y="66" font-size="13" fill="${PALETTE.muted}">Four rules that keep a mixed vial usable for its full shelf life.</text>
    ${cards}
  `;

  return svgDoc({
    width,
    height,
    title: "Reconstituted peptide storage rules",
    desc: storageAlt(),
    inner,
  });
}

/* ---------- Shipping timeline (buy page) ---------- */

const SHIP_STEPS = [
  { big: "Order", sub: "Place your order online" },
  { big: "1-2 days", sub: "Packed and shipped with tracking" },
  { big: "2-5 days", sub: "Delivered to your door in the US" },
];

export function shippingAlt(): string {
  return `Bac water shipping timeline: ${SHIP_STEPS.map((s) => `${s.big}, ${s.sub}`).join("; ")}.`;
}

export function shippingSvg(): string {
  const width = 720;
  const height = 190;
  const padX = 48;
  const y = 110;
  const n = SHIP_STEPS.length;
  const span = width - padX * 2;
  const step = span / (n - 1);

  const line = `<line x1="${padX}" y1="${y}" x2="${padX + span}" y2="${y}" stroke="${PALETTE.border}" stroke-width="3"/>`;

  const nodes = SHIP_STEPS.map((s, i) => {
    const cx = padX + i * step;
    return `
      <circle cx="${cx}" cy="${y}" r="12" fill="${PALETTE.accent}"/>
      <text x="${cx}" y="${y + 5}" text-anchor="middle" font-size="12" font-weight="700" fill="${PALETTE.white}">${i + 1}</text>
      <text x="${cx}" y="${y - 28}" text-anchor="middle" font-size="17" font-weight="700" fill="${PALETTE.foreground}">${esc(s.big)}</text>
      ${splitSub(s.sub, cx, y + 34, 190)}
    `;
  }).join("");

  const inner = `
    <text x="${padX}" y="44" font-size="20" font-weight="700" fill="${PALETTE.foreground}">How fast bac water ships</text>
    <text x="${padX}" y="68" font-size="13" fill="${PALETTE.muted}">From order to your door, with tracking the whole way.</text>
    ${line}
    ${nodes}
  `;

  return svgDoc({
    width,
    height,
    title: "Bac water shipping timeline",
    desc: shippingAlt(),
    inner,
  });
}

/* ---------- helpers ---------- */

function splitSub(sub: string, cx: number, y: number, maxW: number): string {
  const approxChar = 5.6;
  const maxChars = Math.max(8, Math.floor(maxW / approxChar));
  const words = sub.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines
    .slice(0, 2)
    .map(
      (ln, i) =>
        `<text x="${cx}" y="${y + i * 14}" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">${esc(ln)}</text>`
    )
    .join("");
}
