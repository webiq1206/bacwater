# BACwater.ai Page Speed & Core Web Vitals Plan

**Date:** 2026-07-02 (new)

Target: **95+ on mobile and desktop** (Lighthouse/PageSpeed Insights) with all Core Web Vitals in the "good" band. This site is architecturally well-positioned for that already; the work is mostly closing a few specific gaps, not a rebuild.

Core Web Vitals thresholds (good): **LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.** Supporting: TTFB, render-blocking, image formats, font loading, third-party scripts, caching.

---

## Current strengths (already working for us)

- **Infographics are inline SVG** (peptide chart, comparison, storage, shipping) rendered server-side via `Infographic`. No layout shift on load, no extra image request, and they scale crisply. This is the ideal CWV choice and removes a common CLS + LCP source.
- **Fonts via `next/font`** (`Inter`, `Cormorant_Garamond`, `JetBrains_Mono` in `src/app/layout.tsx`) with `display: "swap"`. next/font self-hosts and preloads, eliminating render-blocking requests to Google Fonts and FOIT. Good.
- **Minimal JS.** Most pages are server components; interactivity is isolated to the calculators, cart, and header. Small hydration surface = low INP risk and low main-thread work.
- **Third-party scripts are gated correctly.** GA4 and Microsoft Clarity load only in production (`process.env.NODE_ENV === "production"`) and with `strategy="afterInteractive"` (`src/app/layout.tsx`). They stay off the critical path and out of dev. Good.
- **Static generation.** Peptide and comparison pages use `generateStaticParams`; sitemaps and llms.txt use `revalidate = 3600`. Static/ISR responses keep TTFB low.
- **Security headers set globally** in `next.config.ts` (HSTS, nosniff, frame options, CSP). CSP is scoped to the analytics/font hosts actually used.

---

## Known gap: raw `<img>` of local SVGs without dimensions

**The one real optimization gap.** Product images render as raw `<img src={product.imageUrl}>` with `object-contain` and **no explicit `width`/`height`** in three places:

- `src/app/shop/[slug]/page.tsx` (PDP hero image and the "Also useful" related-product thumbnails)
- `src/app/page.tsx` (homepage featured-product grid)
- (any other product-card render)

Because these are vector SVGs inside a fixed `aspect-square` container, the **CLS risk is low** (the container reserves the box, so the image does not reflow layout) and the **LCP risk is low** (vectors are tiny). But it is still an optimization and correctness gap:

1. No `width`/`height` attributes means the intrinsic-size hint is missing; on any product where `imageUrl` is a raster (or becomes one), CLS would appear.
2. Raw `<img>` bypasses `next/image` optimization: no automatic responsive `srcset`, no lazy-loading defaults, no format negotiation, and no `priority` hint for the LCP element.
3. The PDP hero is frequently the LCP element and currently has no `priority`/`fetchpriority` hint, so the browser may deprioritize it.

**Fix (either approach, in priority order):**

- **Preferred:** migrate these to `next/image` (`import Image from "next/image"`), set explicit `width`/`height` (or `fill` inside the existing `aspect-square` box with `sizes`), add `priority` to the **PDP hero only**, and let the related-product and homepage-grid images stay lazy (default). Configure `next.config.ts` `images.formats: ["image/avif", "image/webp"]` for raster fallbacks. For SVGs specifically, `next/image` passes them through (with `dangerouslyAllowSVG` if needed) but the main win is the explicit dimensions + `priority` on the hero and lazy defaults on the rest.
- **Minimum viable (if staying on `<img>`):** add explicit `width` and `height` attributes to every product `<img>`, add `loading="lazy"` + `decoding="async"` to the non-hero images, and add `fetchpriority="high"` to the PDP hero. This closes the CLS-safety and LCP-priority gaps without adopting `next/image`.

---

## Core Web Vitals plan by metric

### LCP (Largest Contentful Paint) target <= 2.5s

- **Identify the LCP element per template.** On content pages (peptide, comparison, FAQ) it is the H1 or the opening answer paragraph, both server-rendered text, so LCP is already fast. On PDPs it is the hero image.
- Add `priority`/`fetchpriority="high"` to the **PDP hero image** (the gap above).
- Serif display font (`Cormorant_Garamond`) is used in H1s; `next/font` already preloads it, so the H1 LCP text is not font-blocked. Keep `display: "swap"`.
- Keep the hero/answer content server-rendered (it is) so LCP does not wait on hydration.
- Do not add above-the-fold client components to content pages.

### INP (Interaction to Next Paint) target <= 200ms

- Interactive surface is small (calculators, cart store, header menu). Keep it that way.
- The calculators are deterministic math (no network, no heavy libs), so input handling is cheap. Verify no synchronous heavy work on each keystroke; debounce if a calculator recomputes a large table on every input.
- Cart state (`useCart` Zustand-style store) is hydrated client-side; ensure `CartHydrator` does not block interactivity. It runs after paint, which is fine.
- Analytics are `afterInteractive`, so they do not compete with first interaction.

### CLS (Cumulative Layout Shift) target <= 0.1

- Inline SVG infographics: no shift (good).
- Product images: reserved by `aspect-square` containers (good), but add explicit dimensions as belt-and-suspenders (the gap above) so a future raster image cannot shift.
- Fonts: `display: "swap"` can cause a small shift when the swap happens; because `next/font` preloads and the fallback metrics are adjusted automatically, this is minimal. Verify with a field/lab check; if the serif swap shifts H1s, adjust with a size-adjusted fallback.
- The sticky header is `position: sticky` with a fixed `h-16`; ensure it never causes a shift on scroll (fixed height already prevents this).
- Accordions (FAQ) expand on click, which is user-initiated and does not count against CLS.

### TTFB target < 0.8s

- Static + ISR pages already deliver low TTFB. Keep `generateStaticParams` on the peptide/comparison clusters.
- DB-backed pages (homepage featured products, `/buy`, `/shop`, PDP, FAQ DB block) hit Prisma at request time. Ensure these are cached/ISR where the data is slow-changing: products and FAQ content change rarely, so add `revalidate` (ISR) to the homepage, `/shop`, `/buy`, and PDPs rather than fully dynamic rendering, so most requests are served from cache. Confirm the `.catch(() => [])` fallbacks do not hide a slow query; a slow DB call inflates TTFB even with a fallback.
- Verify the Prisma connection is pooled on the deploy target (Replit) so cold DB connects do not spike TTFB.

### Render-blocking

- `next/font` self-hosts fonts (no blocking Google Fonts request). Good.
- No blocking third-party CSS/JS: GA and Clarity are `afterInteractive`. Good.
- CSP already restricts to needed hosts. No render-blocking third parties beyond analytics, which are non-blocking.

### Image formats

- Local SVGs are ideal (vector, tiny, no format concern).
- For any raster product image, serve **AVIF/WebP** via `next/image` (`images.formats`) with SVG passthrough.
- Ensure `imageUrl` assets in `public/` are optimized (SVGO for SVGs to strip metadata).

### Font loading

- Already optimal: `next/font` + `swap` + subsetting to `latin`. Weights are limited (serif 400/500/600). Do not add unused weights. Consider dropping `JetBrains_Mono` if it is only used in a couple of tabular spots that could use `font-variant-numeric: tabular-nums` on the sans font instead, saving one font family download.

### Third-party scripts

- GA4 + Clarity: prod-gated, `afterInteractive`. Good. Keep it this way; do not move to `beforeInteractive`.
- No other third parties detected. If Stripe.js is loaded on checkout, load it only on the checkout route and `afterInteractive`/on-demand, not globally.

### Caching

- Static assets: Next.js fingerprints and long-caches `/_next/static` by default. Good.
- llms.txt and sitemaps set explicit `Cache-Control: public, max-age=3600, s-maxage=3600` and `revalidate = 3600`. Good.
- Add `Cache-Control` / ISR to the DB-backed marketing pages (homepage, shop, buy, PDP) as noted under TTFB.
- SVG infographic routes (`.svg/route.ts`) should send a long `Cache-Control` header since they are deterministic per slug; verify they do (add `public, max-age=86400, immutable`-style caching if missing).

---

## Prioritized checklist

| Priority | Action | Metric | Effort |
|----------|--------|--------|--------|
| 1 | Add explicit `width`/`height` to all product `<img>`; add `fetchpriority="high"` to PDP hero, `loading="lazy"` + `decoding="async"` to the rest | CLS, LCP | Low |
| 2 | Migrate product images to `next/image` with `priority` on PDP hero, lazy elsewhere; set `images.formats: ["image/avif","image/webp"]` | LCP, CLS, bytes | Medium |
| 3 | Add ISR (`revalidate`) to homepage, `/shop`, `/buy`, PDPs so DB-backed pages serve from cache | TTFB | Low |
| 4 | Verify SVG infographic routes send a long `Cache-Control`; add if missing | TTFB, repeat views | Low |
| 5 | Confirm calculators do no heavy synchronous work per keystroke; debounce table recompute if needed | INP | Low |
| 6 | Verify Prisma pooling on the deploy target (cold-connect TTFB) | TTFB | Low |
| 7 | Consider dropping `JetBrains_Mono` in favor of `tabular-nums` on the sans font | bytes, render | Low |
| 8 | Field-check the serif-font swap for H1 CLS; add size-adjusted fallback if it shifts | CLS | Low |

---

## Expected outcome

The architecture (inline SVG, next/font, minimal JS, prod-gated afterInteractive analytics, static/ISR) already puts the content pages (peptides, comparisons, FAQ, learn) at or near 95+ with all CWV green, because their LCP is server-rendered text and they have almost no client JS or layout shift. The 95+ target across the board is gated primarily on the **product-image handling** (checklist #1 to #2) and **DB-page caching** (checklist #3). Closing those two areas should bring the commercial pages (homepage, shop, buy, PDP) up to parity with the content pages.
