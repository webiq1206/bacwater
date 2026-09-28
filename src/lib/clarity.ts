export const CLARITY_PROJECT_ID = "xgb3ipxhf6";
export const CLARITY_CONSENT_KEY = "bacwater.clarity-consent.v1";
export const CLARITY_READY = process.env.NEXT_PUBLIC_CLARITY_ENABLED !== "false";

/** Saved plans, account pages, search strings and shared links never enter replay. */
export function isClarityUrlAllowed(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.origin !== "https://bacwater.ai" || url.search || url.hash) return false;
    return ["/", "/tools", "/learn", "/peptides", "/peptide-calculator", "/about", "/faq", "/methodology", "/compare-calculators", "/share-tools"].includes(url.pathname)
      || /^\/(tools|learn|peptides)\/[a-z0-9/-]+$/.test(url.pathname)
      || /^\/calculate\/(?:product\/)?[a-z0-9-]+$/.test(url.pathname);
  } catch { return false; }
}

type ClaritySdk = typeof import("clarity-js").clarity;
let sdk: ClaritySdk | undefined;
let loading: Promise<ClaritySdk> | undefined;
let guardsInstalled = false;
let active = false;
let generation = 0;

export function stopClarity() {
  generation++;
  sdk?.stop();
  active = false;
}

export function updateClarityConsent(granted: boolean) {
  if (!granted) {
    // Stop first: the SDK's consent-withdrawal path otherwise schedules its
    // own restart in cookieless mode, which would violate our opt-out promise.
    stopClarity();
    for (const key of ["_clck", "_clsk"]) for (const domain of ["", location.hostname, ".bacwater.ai"])
      document.cookie = `${key}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
  }
}

export function clarityAllowedNow() {
  let allowed = false;
  try {
    allowed = CLARITY_READY && localStorage.getItem(CLARITY_CONSENT_KEY) === "granted"
      && isClarityUrlAllowed(location.href)
      && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.search || referrer.hash || (referrer.origin === location.origin && !isClarityUrlAllowed(referrer.href))) allowed = false;
    }
  } catch { allowed = false; }
  return allowed;
}

export function syncClarity() {
  if (!clarityAllowedNow()) { stopClarity(); return; }
  if (active) return;
  if (!guardsInstalled) {
    guardsInstalled = true;
    // Register before Clarity wraps history. Its wrapper calls this original
    // first, so recording stops before any route or private URL is observed.
    for (const method of ["pushState", "replaceState"] as const) {
      const original = history[method];
      history[method] = function (...args: Parameters<History[typeof method]>) {
        if (args[2] != null && new URL(String(args[2]), location.href).href !== location.href) stopClarity();
        return original.apply(this, args);
      };
    }
    window.addEventListener("popstate", stopClarity, true);
    window.addEventListener("hashchange", stopClarity, true);
  }
  const requestedGeneration = ++generation;
  // Import the official SDK only after consent. Unlike the auto-starting tag,
  // this lets us recheck consent and the URL after a slow network download.
  loading ||= import("clarity-js").then(module => (sdk = module.clarity));
  void loading.then(client => {
    if (requestedGeneration !== generation || !clarityAllowedNow() || active) return;
    // Project and ingestion endpoint verified from this project's hosted tag.
    client.start({ projectId: CLARITY_PROJECT_ID, upload: "https://l.clarity.ms/collect", track: false, content: false, mask: ["body"], cookies: [], lean: false });
    client.consentv2({ ad_Storage: "denied", analytics_Storage: "granted" });
    active = true;
  }).catch(() => { loading = undefined; });
}
