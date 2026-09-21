"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_READY, GA_ID, analyticsLocation } from "@/lib/analytics";
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined };
export function AnalyticsPreferences() {
  const pathname = usePathname() || "/";
  const [choice, setChoice] = useState("denied");
  useEffect(() => { try { setChoice(localStorage.getItem(ANALYTICS_CONSENT_KEY) || "denied"); } catch {} }, []);
  useEffect(() => {
    const w = window as unknown as AnalyticsWindow;
    const pageLocation = analyticsLocation(pathname);
    const allowed = ANALYTICS_READY && choice === "granted" && Boolean(pageLocation);
    w[`ga-disable-${GA_ID}`] = !allowed;
    if (!allowed) { w.gtag?.("consent", "update", { analytics_storage: "denied" }); return; }
    w.dataLayer ||= []; w.gtag ||= function () { w.dataLayer!.push(arguments); };
    if (!document.getElementById("bacwater-manual-analytics")) {
      w.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      w.gtag("js", new Date());
      w.gtag("config", GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: pageLocation, page_referrer: "", page_title: "BACwater.ai utility" });
      const script = document.createElement("script"); script.id = "bacwater-manual-analytics"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(script);
    }
    w.gtag("consent", "update", { analytics_storage: "granted" });
    w.gtag("event", "page_view", { page_location: pageLocation, page_referrer: "", page_title: "BACwater.ai utility" });
    const usage = (e: Event) => {
      const name = (e as CustomEvent).detail;
      if (["plan_saved", "plan_updated", "contact_saved", "calculation_completed", "label_printed"].includes(name)) w.gtag?.("event", name, { page_location: pageLocation, page_referrer: "" });
    };
    window.addEventListener("bacwater:usage", usage);
    return () => { window.removeEventListener("bacwater:usage", usage); w[`ga-disable-${GA_ID}`] = true; };
  }, [choice, pathname]);
  function choose(value: string) {
    try { localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch {}
    setChoice(value);
    if (value === "denied") {
      const w = window as unknown as AnalyticsWindow; w[`ga-disable-${GA_ID}`] = true;
      for (const cookie of document.cookie.split(";")) {
        const key = cookie.split("=")[0].trim();
        if (key === "_ga" || key.startsWith("_ga_")) for (const domain of ["", location.hostname, ".bacwater.ai"]) document.cookie = `${key}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }
  return <section className="bac-privacy-preferences border-t border-border px-4 py-5 text-sm" aria-label="Analytics preferences"><div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3"><p className="flex-1 min-w-48">{ANALYTICS_READY ? "Optional usage analytics are off unless you allow them. Calculations work either way." : "Optional analytics and session replay are off. Your calculations work without them."}</p><button type="button" className="min-h-11 rounded-lg border border-border px-4" aria-pressed={choice === "denied"} onClick={() => choose("denied")}>Keep analytics off</button>{ANALYTICS_READY && <button type="button" className="min-h-11 rounded-lg border border-border px-4" aria-pressed={choice === "granted"} onClick={() => choose("granted")}>Allow usage analytics</button>}<a href="/privacy" className="min-h-11 inline-flex items-center underline">Privacy</a></div></section>;
}
