import { isCalculatorWorkspace } from "@/lib/calculator-routes";
import { PEPTIDES } from "@/lib/calc/peptides";
import { SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";

export const CLARITY_PROJECT_ID = "xgb3ipxhf6";
export const CLARITY_CONSENT_KEY = "bacwater.clarity-consent.v1";
export const CLARITY_READY = process.env.NEXT_PUBLIC_CLARITY_ENABLED !== "false";

/** Diluent and site words that are not a research-compound identity. */
const GENERIC_SUBJECTS = new Set([
  "bac",
  "bac-water",
  "bacteriostatic",
  "bacteriostatic-water",
  "custom",
  "h2o",
  "peptide",
  "peptides",
  "water",
]);

/** Substance comparisons. Their addresses and titles name the other compound. */
const COMPARISON_SUBJECTS = [
  "acetic-acid",
  "benzyl-alcohol",
  "distilled-water",
  "reconstitution-solution",
  "saline",
  "sodium-chloride",
  "sterile-water",
];

const ALLOWED_PATHS = new Set([
  "/",
  "/about",
  "/compare-calculators",
  "/contact",
  "/disclaimer",
  "/editorial-policy",
  "/faq",
  "/learn",
  "/methodology",
  "/preferred-source",
  "/privacy",
  "/share-tools",
  "/sitemap",
  "/terms",
  "/tools",
]);

const BLOCKED_PREFIXES = [
  "/admin",
  "/auth",
  "/calculate",
  "/embed",
  "/forgot-password",
  "/peptide-calculator",
  "/peptides",
  "/plan",
  "/plans",
  "/products",
  "/recommendations",
  "/research-finder",
  "/reset-password",
  "/search",
  "/signin",
  "/signup",
];

function subjectToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function subjectTokens(): string[] {
  const tokens = new Set<string>(COMPARISON_SUBJECTS);
  for (const peptide of PEPTIDES) {
    if (peptide.slug !== "custom") tokens.add(peptide.slug);
    for (const alias of peptide.aliases ?? []) tokens.add(subjectToken(alias));
  }
  for (const product of SUPPLIER_PRODUCTS) {
    tokens.add(product.id);
    tokens.add(subjectToken(product.name));
    for (const alias of product.aliases ?? []) tokens.add(subjectToken(alias));
  }
  return [...tokens].filter(token => token.length >= 3 && !GENERIC_SUBJECTS.has(token));
}

const SUBJECTS = subjectTokens();

function mentionsSubject(path: string): boolean {
  const haystack = path.toLowerCase();
  return SUBJECTS.some(token => {
    let from = 0;
    while (from < haystack.length) {
      const at = haystack.indexOf(token, from);
      if (at < 0) return false;
      const before = at === 0 ? "/" : haystack[at - 1];
      const after = haystack[at + token.length] ?? "/";
      if ((before === "/" || before === "-") && (after === "/" || after === "-" || after === undefined)) return true;
      from = at + 1;
    }
    return false;
  });
}

/**
 * Clarity may run only where the address and title cannot name a compound,
 * calculator, product, peptide or saved plan. Query strings and fragments stay out.
 */
export function isClarityUrlAllowed(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.origin !== "https://bacwater.ai" || url.search || url.hash) return false;
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
    if (isCalculatorWorkspace(path) || path.startsWith("/tools/") || path === "/learn/vs" || path.startsWith("/learn/vs/")) return false;
    if (BLOCKED_PREFIXES.some(prefix => path === prefix || path.startsWith(`${prefix}/`))) return false;
    if (ALLOWED_PATHS.has(path)) return true;
    if (path.startsWith("/learn/")) return !mentionsSubject(path);
    return false;
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

function installHistoryGuard() {
  if (guardsInstalled || typeof window === "undefined") return;
  guardsInstalled = true;
  // Install before Next.js binds history and before Clarity wraps it, so a
  // client navigation stops replay while the address is still the previous page.
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    history[method] = function (...args: Parameters<History[typeof method]>) {
      const next = args[2];
      if (next != null) {
        try {
          const destination = new URL(String(next), location.href);
          if (destination.href !== location.href) stopClarity();
        } catch { stopClarity(); }
      }
      return original.apply(this, args);
    };
  }
  const navigation = (window as Window & { navigation?: EventTarget }).navigation;
  navigation?.addEventListener("navigate", (event) => {
    const destination = (event as Event & { destination?: { url?: string } }).destination?.url;
    if (destination && destination !== location.href) stopClarity();
  });
  // Stop before Clarity's click handler can attach the destination address.
  const stopForLink = (event: Event) => {
    const node = event.target;
    if (!(node instanceof Element)) return;
    const link = node.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    try {
      const destination = new URL(link.href, location.href);
      if (destination.href !== location.href && !isClarityUrlAllowed(destination.href)) stopClarity();
    } catch { stopClarity(); }
  };
  document.addEventListener("pointerdown", stopForLink, true);
  document.addEventListener("mousedown", stopForLink, true);
  document.addEventListener("click", stopForLink, true);
  document.addEventListener("keydown", (event) => { if (event.key === "Enter") stopForLink(event); }, true);
  window.addEventListener("popstate", () => { if (!isClarityUrlAllowed(location.href)) stopClarity(); }, true);
  window.addEventListener("hashchange", stopClarity, true);
}

if (typeof window !== "undefined") installHistoryGuard();

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
  installHistoryGuard();
  if (!clarityAllowedNow()) { stopClarity(); return; }
  if (active) return;
  const requestedGeneration = ++generation;
  // Import the official SDK only after consent and only on an allowed route.
  loading ||= import("clarity-js").then(module => (sdk = module.clarity));
  void loading.then(client => {
    if (requestedGeneration !== generation || !clarityAllowedNow() || active) return;
    client.start({ projectId: CLARITY_PROJECT_ID, upload: "https://l.clarity.ms/collect", track: false, content: false, mask: ["body"], cookies: [], lean: false });
    client.consentv2({ ad_Storage: "denied", analytics_Storage: "granted" });
    active = true;
  }).catch(() => { loading = undefined; });
}
