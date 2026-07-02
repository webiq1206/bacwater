/**
 * Shared helpers and palette for the custom infographics.
 *
 * Every Learn article type (peptide guide, comparison, FAQ hub, buy page) gets
 * a bespoke, generated SVG infographic. SVG keeps them tiny, crisp at any
 * size, and machine-readable (the numbers are real text a search or AI crawler
 * can lift). The same generator string is rendered inline on the page and
 * served at a real image URL for ImageObject schema and social cards.
 *
 * Colors are literal hex (not CSS variables) so the standalone .svg routes
 * render identically to the inline version. They mirror the site palette.
 */

export const PALETTE = {
  accent: "#2d6a4f",
  accentSoft: "#f0f7f2",
  foreground: "#1a1a1a",
  muted: "#6b7280",
  border: "#e5e7eb",
  surface: "#f8f8f7",
  white: "#ffffff",
  amber: "#b45309",
};

export function svgResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wrap generated inner markup in a titled, accessible SVG document. */
export function svgDoc({
  width,
  height,
  title,
  desc,
  inner,
}: {
  width: number;
  height: number;
  title: string;
  desc: string;
  inner: string;
}): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="ig-title ig-desc" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"><title id="ig-title">${esc(title)}</title><desc id="ig-desc">${esc(desc)}</desc><rect x="0" y="0" width="${width}" height="${height}" fill="${PALETTE.white}"/>${inner}</svg>`;
}
