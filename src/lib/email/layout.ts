/**
 * One branded layout for every email the site sends.
 *
 * Email clients ignore most modern CSS, so the HTML uses tables, inline
 * styles and web-safe font fallbacks. Every message also carries a plain-text
 * twin built from the same blocks, so the two never drift apart.
 */

export const EMAIL_BRAND = {
  name: "BACwater.ai",
  siteUrl: "https://bacwater.ai",
  logoUrl: "https://bacwater.ai/brand/bacwater-wordmark-email.png",
  tagline: "Math help for mixing BAC water. Not medical advice.",
  colors: {
    ink: "#18382d",
    page: "#f7f8f2",
    card: "#ffffff",
    muted: "#506451",
    soft: "#edf2e5",
    border: "#d7dfce",
    accent: "#dfedb3",
  },
  fonts: {
    sans: "Montserrat, 'Segoe UI', Helvetica, Arial, sans-serif",
    serif: "Fraunces, Georgia, 'Times New Roman', serif",
  },
} as const;

export type EmailBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "button"; label: string; href: string }
  | { type: "link"; label: string; href: string }
  | { type: "note"; text: string }
  | { type: "details"; title?: string; rows: Array<[label: string, value: string]> };

export interface EmailContent {
  subject: string;
  /** Short summary shown next to the subject in the inbox list. */
  preheader: string;
  /** Large heading at the top of the card. Optional for conversational replies. */
  heading?: string;
  blocks: EmailBlock[];
  /** Why the person is receiving this email, shown in the footer. */
  reason?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const { colors: c, fonts: f } = EMAIL_BRAND;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LINK_STYLE = `color:${c.ink};text-decoration:underline;text-underline-offset:2px`;
const URL_OR_EMAIL = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"]|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

/** Escape text, then turn bare web addresses and email addresses into links. */
export function inlineHtml(text: string): string {
  let out = "";
  let last = 0;
  for (const match of text.matchAll(URL_OR_EMAIL)) {
    const value = match[0];
    const index = match.index ?? 0;
    out += escapeHtml(text.slice(last, index));
    const href = value.includes("@") && !/^https?:/i.test(value) ? `mailto:${value}` : value;
    out += `<a href="${escapeHtml(href)}" style="${LINK_STYLE}">${escapeHtml(value)}</a>`;
    last = index + value.length;
  }
  return out + escapeHtml(text.slice(last)).replace(/\n/g, "<br>");
}

/**
 * Turn text typed by a person into blocks: a blank line starts a new
 * paragraph, and a paragraph where every line starts with "- " becomes a list.
 */
export function plainTextToBlocks(body: string): EmailBlock[] {
  return body
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map(chunk => chunk.replace(/^\n+|\s+$/g, ""))
    .filter(Boolean)
    .flatMap((chunk): EmailBlock[] => {
      const lines = chunk.split("\n");
      const bullet = /^\s*[-*•]\s+/;
      // A lead-in such as "Items:" followed only by dash lines becomes a short paragraph and a list.
      let start = lines.length;
      while (start > 0 && bullet.test(lines[start - 1])) start--;
      const items = lines.slice(start).map(line => line.replace(bullet, ""));
      if (!items.length) return [{ type: "paragraph", text: chunk }];
      if (start === 0) return [{ type: "list", items }];
      return [{ type: "paragraph", text: lines.slice(0, start).join("\n") }, { type: "list", items }];
    });
}

const P = `margin:0 0 16px;font-family:${f.sans};font-size:16px;line-height:1.6;color:${c.ink}`;

function blockHtml(block: EmailBlock): string {
  switch (block.type) {
    case "paragraph":
      return `<p style="${P}">${inlineHtml(block.text)}</p>`;
    case "list":
      return `<ul style="margin:0 0 16px;padding:0 0 0 22px;font-family:${f.sans};font-size:16px;line-height:1.6;color:${c.ink}">${block.items
        .map(item => `<li style="margin:0 0 6px">${inlineHtml(item)}</li>`)
        .join("")}</ul>`;
    case "button":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px"><tr><td align="center" bgcolor="${c.ink}" style="border-radius:999px">
<a href="${escapeHtml(block.href)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${f.sans};font-size:16px;font-weight:600;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px;background:${c.ink}">${escapeHtml(block.label)}</a>
</td></tr></table>`;
    case "link":
      return `<p style="margin:0 0 16px;font-family:${f.sans};font-size:14px;line-height:1.6;color:${c.muted}">${escapeHtml(block.label)}<br><a href="${escapeHtml(block.href)}" style="${LINK_STYLE};word-break:break-all">${escapeHtml(block.href)}</a></p>`;
    case "note":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px"><tr><td style="padding:14px 16px;border-radius:12px;background:${c.soft};font-family:${f.sans};font-size:14px;line-height:1.6;color:${c.muted}">${inlineHtml(block.text)}</td></tr></table>`;
    case "details":
      return `${block.title ? `<p style="margin:8px 0 8px;font-family:${f.sans};font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${c.muted}">${escapeHtml(block.title)}</p>` : ""}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid ${c.border};border-radius:12px;border-collapse:separate">${block.rows
        .map(
          ([label, value], i) =>
            `<tr><td valign="top" style="padding:12px 16px;${i ? `border-top:1px solid ${c.border};` : ""}font-family:${f.sans};font-size:13px;line-height:1.5;color:${c.muted};width:34%">${escapeHtml(label)}</td><td valign="top" style="padding:12px 16px;${i ? `border-top:1px solid ${c.border};` : ""}font-family:${f.sans};font-size:15px;line-height:1.5;color:${c.ink}">${inlineHtml(value)}</td></tr>`,
        )
        .join("")}</table>`;
  }
}

function blockText(block: EmailBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "list":
      return block.items.map(item => `- ${item}`).join("\n");
    case "button":
      return `${block.label}:\n${block.href}`;
    case "link":
      return `${block.label}\n${block.href}`;
    case "note":
      return block.text;
    case "details":
      return [block.title?.toUpperCase(), ...block.rows.map(([label, value]) => `${label}:\n${value}`)].filter(Boolean).join("\n\n");
  }
}

export function renderEmail(content: EmailContent): RenderedEmail {
  const { subject, preheader, heading, blocks, reason } = content;
  const footerLines = [reason, EMAIL_BRAND.tagline].filter(Boolean) as string[];

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(subject)}</title>
<style>
  body{margin:0;padding:0;background:${c.page}}
  a{color:${c.ink}}
  @media (max-width:620px){
    .bw-card{padding:28px 22px !important;border-radius:16px !important}
    .bw-heading{font-size:24px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${c.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${escapeHtml(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.page}" style="background:${c.page}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td style="padding:0 4px 20px">
<a href="${EMAIL_BRAND.siteUrl}" target="_blank" style="text-decoration:none"><img src="${EMAIL_BRAND.logoUrl}" width="192" height="48" alt="${EMAIL_BRAND.name}" style="display:block;border:0;outline:none;width:192px;height:48px"></a>
</td></tr>
<tr><td class="bw-card" bgcolor="${c.card}" style="background:${c.card};border:1px solid ${c.border};border-radius:20px;padding:36px 36px 20px">
${heading ? `<h1 class="bw-heading" style="margin:0 0 20px;font-family:${f.serif};font-size:28px;font-weight:600;line-height:1.25;letter-spacing:-.01em;color:${c.ink}">${escapeHtml(heading)}</h1>\n` : ""}${blocks.map(blockHtml).join("\n")}
</td></tr>
<tr><td style="padding:20px 8px 0;font-family:${f.sans};font-size:12px;line-height:1.6;color:${c.muted}">
${footerLines.map(line => `<p style="margin:0 0 6px">${escapeHtml(line)}</p>`).join("")}
<p style="margin:0"><a href="${EMAIL_BRAND.siteUrl}" target="_blank" style="color:${c.muted};text-decoration:underline">bacwater.ai</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  // In plain text a button is already a link, so a "copy this link" fallback for the same address is dropped.
  const buttonHrefs = new Set(blocks.flatMap(b => (b.type === "button" ? [b.href] : [])));
  const text = [
    heading,
    ...blocks.filter(b => !(b.type === "link" && buttonHrefs.has(b.href))).map(blockText),
    "--",
    ...footerLines,
    EMAIL_BRAND.siteUrl,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { subject, html, text };
}

/** Make sure every message shows the brand name as the sender. */
export function senderAddress(raw: string | undefined, fallback: string): string {
  const value = (raw || fallback).trim();
  return value.includes("<") ? value : `${EMAIL_BRAND.name} <${value}>`;
}
