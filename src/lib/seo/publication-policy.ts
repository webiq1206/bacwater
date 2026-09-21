import { STATIC_PAGES, STATIC_LEARN_SLUGS } from "@/lib/seo/sitemap";
import { PEPTIDES } from "@/lib/calc/peptides";
import { COMPARISONS } from "@/lib/comparisons/content";
export const LEGACY_LEARN_SLUGS = new Set(["bac-water-vs-sterile-water", "how-long-bac-water-lasts"]);
export const RESERVED_LEARN_SLUGS = new Set([...STATIC_LEARN_SLUGS, ...LEGACY_LEARN_SLUGS, "vs", "storage-infographic.svg"]);
export const CODE_PUBLIC_PATHS = new Set([
  ...STATIC_PAGES.map(p => p.path || "/"),
  ...PEPTIDES.map(p => `/peptides/${p.slug}`),
  ...COMPARISONS.map(p => `/learn/vs/${p.slug}`),
]);
export const SEARCH_CONTENT_WHERE = { published: true, kind: { in: ["guide", "page"] }, noindex: false, canonicalPath: null };
export function isPublicNotificationPath(path: string): boolean {
  return CODE_PUBLIC_PATHS.has(path) || /^\/learn\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
}
export function validateCanonicalPath(path: string): boolean {
  return !/[?#%\\\s]/.test(path) && isPublicNotificationPath(path);
}
