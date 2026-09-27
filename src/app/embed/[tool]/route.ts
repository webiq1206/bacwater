/**
 * The framed widget document served to third-party pages.
 *
 * This is a route handler rather than a page so the response is a complete,
 * self-contained HTML document: it does not inherit the site header, footer,
 * age gate, supplier shelf or analytics from the root layout, none of which
 * belong inside somebody else's page. There is no client JavaScript. The form
 * submits back to this same URL with a GET, and the arithmetic runs on the
 * server through src/lib/embed/widget-math.ts, so an embedded copy always
 * agrees with the on-site calculator and works with scripting disabled.
 *
 * The framing carve-out lives in next.config.ts: every other route keeps
 * X-Frame-Options: DENY and frame-ancestors 'none', and only /embed/* is
 * allowed to be framed. These documents are sent noindex because they are thin
 * duplicates of the tool pages, which are the pages that should rank.
 */
import { findEmbedWidget, attributionUrl, type EmbedWidget } from "@/lib/embed/registry";
import { concentrationMgPerMl, mgToMcg, mcgToMg, mlToU100, u100ToMl, positiveInput, displayNumber } from "@/lib/embed/widget-math";

/** Escapes text interpolated into the response document. */
function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

interface Field { name: string; label: string; unit: string }
interface Row { label: string; value: string }

const FIELDS: Record<EmbedWidget["kind"], Field[]> = {
  concentration: [
    { name: "amount", label: "Amount in the vial", unit: "mg" },
    { name: "volume", label: "Final liquid volume", unit: "mL" },
  ],
  "syringe-units": [{ name: "volume", label: "Volume", unit: "mL" }, { name: "units", label: "or U-100 units", unit: "units" }],
  "mass-convert": [{ name: "mg", label: "Milligrams", unit: "mg" }, { name: "mcg", label: "or micrograms", unit: "mcg" }],
};

/**
 * Results for the entered values, or null when nothing usable was entered.
 * Each widget reads whichever field the visitor filled; a second filled field
 * is ignored rather than guessed at.
 */
function compute(widget: EmbedWidget, params: URLSearchParams): Row[] | null {
  const num = (name: string) => positiveInput(params.get(name));
  if (widget.kind === "concentration") {
    const amount = num("amount"), volume = num("volume");
    if (amount == null || volume == null) return null;
    const perMl = concentrationMgPerMl(amount, volume);
    return [
      { label: "In each mL", value: `${displayNumber(perMl)} mg/mL` },
      { label: "Same value in mcg", value: `${displayNumber(mgToMcg(perMl))} mcg/mL` },
      { label: "On a U-100 scale, 1 mL is", value: `${displayNumber(mlToU100(1))} units` },
    ];
  }
  if (widget.kind === "syringe-units") {
    const volume = num("volume"), units = num("units");
    if (volume != null) return [{ label: `${displayNumber(volume)} mL on a U-100 scale`, value: `${displayNumber(mlToU100(volume))} units` }];
    if (units != null) return [{ label: `${displayNumber(units)} U-100 units`, value: `${displayNumber(u100ToMl(units))} mL` }];
    return null;
  }
  const mg = num("mg"), mcg = num("mcg");
  if (mg != null) return [{ label: `${displayNumber(mg)} mg`, value: `${displayNumber(mgToMcg(mg))} mcg` }];
  if (mcg != null) return [{ label: `${displayNumber(mcg)} mcg`, value: `${displayNumber(mcgToMg(mcg))} mg` }];
  return null;
}

const STYLE = `*{box-sizing:border-box}
body{margin:0;padding:16px;font:400 15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#10212e;background:#fff}
h1{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
p.sub{margin:4px 0 14px;font-size:13px;color:#5a6b78}
label{display:block;font-size:13px;font-weight:500;margin-bottom:4px}
.f{margin-bottom:10px}
.r{display:flex;gap:6px}
input{flex:1;min-width:0;min-height:42px;padding:8px 10px;font:inherit;border:1px solid #cdd8e1;border-radius:8px;background:#fff;color:inherit}
input:focus-visible{outline:2px solid #0f7d8c;outline-offset:1px}
.u{display:flex;align-items:center;padding:0 10px;font-size:13px;color:#5a6b78;background:#f2f6f8;border:1px solid #cdd8e1;border-radius:8px}
button{min-height:42px;width:100%;margin-top:4px;padding:10px 14px;font:inherit;font-weight:600;color:#fff;background:#0f7d8c;border:0;border-radius:8px;cursor:pointer}
button:focus-visible{outline:2px solid #10212e;outline-offset:2px}
table{width:100%;margin:14px 0 0;border-collapse:collapse;font-size:14px}
th,td{padding:7px 0;text-align:left;border-top:1px solid #e2e8f0;vertical-align:top}
th{font-weight:500;color:#5a6b78}
td{font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.note{margin:14px 0 0;font-size:12px;line-height:1.5;color:#5a6b78}
.note a{color:#0c6673}
@media(prefers-color-scheme:dark){
body{background:#0d1a22;color:#e8eef2}
input{background:#122430;border-color:#28414f;color:inherit}
.u{background:#122430;border-color:#28414f;color:#9fb1bd}
th{color:#9fb1bd}th,td{border-color:#1e3341}
p.sub,.note{color:#9fb1bd}.note a{color:#5ec4d2}}`;

function document_(widget: EmbedWidget, params: URLSearchParams): string {
  const rows = compute(widget, params);
  const fields = FIELDS[widget.kind]
    .map(field => {
      const parsed = positiveInput(params.get(field.name));
      const value = parsed == null ? "" : String(parsed);
      return `<div class="f"><label for="${esc(field.name)}">${esc(field.label)}</label><div class="r">` +
        `<input id="${esc(field.name)}" name="${esc(field.name)}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value)}">` +
        `<span class="u">${esc(field.unit)}</span></div></div>`;
    })
    .join("");
  const results = rows
    ? `<table><tbody>${rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${esc(r.value)}</td></tr>`).join("")}</tbody></table>`
    : "";
  const canonical = esc(attributionUrl(widget));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>${esc(widget.title)} calculator</title>
<link rel="canonical" href="${canonical}">
<style>${STYLE}</style></head><body>
<h1>${esc(widget.title)}</h1><p class="sub">${esc(widget.description)}</p>
<form method="get" action="/embed/${esc(widget.slug)}">${fields}<button type="submit">Calculate</button></form>
${results}
<p class="note">Arithmetic on the numbers you enter. It does not choose an amount, a liquid, a device or a treatment, and it does not verify what a vial contains. Follow the instructions that came with the product. <a href="${canonical}" target="_blank" rel="noopener">Open the full calculator on BACwater.ai</a>.</p>
</body></html>`;
}

export async function GET(request: Request, context: { params: Promise<{ tool: string }> }) {
  const { tool } = await context.params;
  const widget = findEmbedWidget(tool);
  if (!widget) {
    return new Response("Unknown widget.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  const params = new URL(request.url).searchParams;
  return new Response(document_(widget, params), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Thin framed duplicates of the tool pages. Keep them crawlable but
      // unranked so they never compete with the page attribution points at.
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}

export const dynamic = "force-dynamic";

