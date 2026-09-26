export const ANALYTICS_CONSENT_KEY = "bacwater.analytics-consent.v1";
export const ANALYTICS_READY = process.env.NEXT_PUBLIC_ANALYTICS_MANUAL_CONFIRMED === "true";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CWEKGP6NKB";
export function isPublicAnalyticsPath(path: string): boolean {
 return path === "/" || /^\/(tools|learn|peptides)(\/|$)/.test(path) || /^\/calculate\/(?:product\/)?[a-z0-9-]+$/.test(path) || ["/recommendations", "/search", "/peptide-calculator", "/plan", "/plan/new", "/about", "/contact", "/faq", "/methodology", "/compare-calculators"].includes(path);
}
export function analyticsLocation(path: string): string | null {
 if (!isPublicAnalyticsPath(path) || path.includes("?") || path.includes("#")) return null;
 const category = path.startsWith("/calculate/") ? "/calculate" : path.startsWith("/peptides/") ? "/peptides/reference" : path.startsWith("/learn/") ? "/learn/article" : path;
 return `https://bacwater.ai${category}`;
}
export const USAGE_EVENTS = ["plan_saved", "plan_updated", "contact_saved", "calculation_completed", "label_printed", "tool_started", "input_corrected", "form_error", "product_details_opened", "supplier_clicked", "result_copied"] as const;
export function trackUsage(event: typeof USAGE_EVENTS[number]) {
 if (typeof window === "undefined" || !ANALYTICS_READY || !USAGE_EVENTS.includes(event)) return;
 try {
  if (localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted" || !isPublicAnalyticsPath(location.pathname)) return;
  window.dispatchEvent(new CustomEvent("bacwater:usage", { detail: event }));
 } catch { /* Optional measurement never blocks a task. */ }
}
