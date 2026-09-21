export const ANALYTICS_CONSENT_KEY = "bacwater.analytics-consent.v1";
export const ANALYTICS_READY = process.env.NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED === "true";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CWEKGP6NKB";
export function isPublicAnalyticsPath(path: string): boolean {
  return path === "/" || /^\/(tools|learn|peptides)(\/|$)/.test(path) || ["/peptide-calculator", "/plan", "/plan/new", "/about", "/contact", "/faq"].includes(path);
}
export function analyticsLocation(path: string): string | null {
  if (!isPublicAnalyticsPath(path) || path.includes("?") || path.includes("#")) return null;
  // Only classify broad page types. Compound identities never leave this site.
  const category = path.startsWith("/peptides/") ? "/peptides/reference" : path.startsWith("/learn/") ? "/learn/article" : path;
  return `https://bacwater.ai${category}`;
}
export function trackUsage(event: "plan_saved" | "plan_updated" | "contact_saved" | "calculation_completed" | "label_printed") {
  if (typeof window === "undefined" || !ANALYTICS_READY) return;
  try {
    if (localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted" || !isPublicAnalyticsPath(location.pathname)) return;
    window.dispatchEvent(new CustomEvent("bacwater:usage", { detail: event }));
  } catch { /* Optional measurement never blocks a task. */ }
}
