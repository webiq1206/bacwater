import assert from "node:assert/strict";
import { isClarityUrlAllowed, clarityAllowedNow, CLARITY_CONSENT_KEY } from "../src/lib/clarity";

for (const path of ["/", "/tools/mg-to-mcg", "/learn/glossary", "/peptide-calculator", "/calculate/product/bpc-157"]) {
  assert.equal(isClarityUrlAllowed(`https://bacwater.ai${path}`), true, path);
}
for (const path of ["/admin", "/plans", "/plan", "/plan/private-id", "/plan/private-id/pdf", "/auth/reset-password", "/search", "/contact", "/?email=a", "/tools?value=10", "/learn#private-note", "/embed"]) {
  assert.equal(isClarityUrlAllowed(`https://bacwater.ai${path}`), false, path);
}
assert.equal(isClarityUrlAllowed("https://example.com/"), false);
assert.equal(isClarityUrlAllowed("http://localhost:3000/"), false);
assert.equal(isClarityUrlAllowed("invalid"), false);

const values = new Map<string, string>();
Object.defineProperty(globalThis, "location", { configurable: true, value: new URL("https://bacwater.ai/") });
Object.defineProperty(globalThis, "document", { configurable: true, value: { referrer: "" } });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { globalPrivacyControl: false } });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null } });
assert.equal(clarityAllowedNow(), false, "No replay before consent");
values.set("bacwater.analytics-consent.v1", "granted");
assert.equal(clarityAllowedNow(), false, "Older GA consent does not enable replay");
values.set(CLARITY_CONSENT_KEY, "granted");
assert.equal(clarityAllowedNow(), true);
Object.assign(navigator, { globalPrivacyControl: true });
assert.equal(clarityAllowedNow(), false, "Honor browser privacy control");
Object.assign(navigator, { globalPrivacyControl: false });
Object.assign(document, { referrer: "https://bacwater.ai/plan/private-id" });
assert.equal(clarityAllowedNow(), false, "Private referrers excluded");
Object.assign(document, { referrer: "https://example.com/?email=private" });
assert.equal(clarityAllowedNow(), false, "Query-string referrers excluded");
console.log("PASS Clarity consent, public route boundaries, referrer exclusions and privacy controls.");
