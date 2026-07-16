/**
 * Static infographics that are the same for everyone: the storage / shelf-life
 * rules card for the FAQ hub's numeric entries, and the shipping timeline for
 * the buy page.
 */

import { PALETTE, esc, svgDoc } from "@/lib/infographics/svg";

/* ---------- Storage & shelf life (FAQ hub) ---------- */

const STORAGE_CARDS = [
  { big: "Fridge", sub: "Keep mixed vials cold, per your product's instructions" },
  { big: "Discard date", sub: "Follow the instructions that came with your product" },
  { big: "Dark", sub: "Keep in the box or foil" },
  { big: "Freezing", sub: "Can damage many peptides. Check your instructions" },
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
  const height = 168;
  const padX = 48;
  const y = 116;
  const n = SHIP_STEPS.length;
  const span = width - padX * 2;
  const step = span / (n - 1);

  const line = `<line x1="${padX}" y1="${y}" x2="${padX + span}" y2="${y}" stroke="${PALETTE.border}" stroke-width="3"/>`;

  const nodes = SHIP_STEPS.map((s, i) => {
    const cx = padX + i * step;
    // Anchor edge labels inward so long descriptions never overflow the canvas:
    // first step left-aligned to its node, last right-aligned, middle centered.
    const anchor = i === 0 ? "start" : i === n - 1 ? "end" : "middle";
    return `
      <circle cx="${cx}" cy="${y}" r="13" fill="${PALETTE.accent}"/>
      <text x="${cx}" y="${y + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="${PALETTE.white}">${i + 1}</text>
      <text x="${cx}" y="${y - 24}" text-anchor="${anchor}" font-size="17" font-weight="700" fill="${PALETTE.foreground}">${esc(s.big)}</text>
      ${splitSub(s.sub, cx, y + 32, 200, anchor)}
    `;
  }).join("");

  const inner = `
    <text x="${padX}" y="38" font-size="20" font-weight="700" fill="${PALETTE.foreground}">How fast bac water ships</text>
    <text x="${padX}" y="62" font-size="13" fill="${PALETTE.muted}">From order to your door, with tracking the whole way.</text>
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

function splitSub(
  sub: string,
  x: number,
  y: number,
  maxW: number,
  anchor: string = "middle"
): string {
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
        `<text x="${x}" y="${y + i * 14}" text-anchor="${anchor}" font-size="11" fill="${PALETTE.muted}">${esc(ln)}</text>`
    )
    .join("");
}
