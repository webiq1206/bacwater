import { STATIC_PAGES, SITE_URL } from "./sitemap";
import type { LearnEntry } from "@/lib/learn/catalog";
const labels: Record<string, string> = {
  "/": "BACwater.ai: concentration and measurement tools",
  "/peptide-calculator": "Peptide concentration calculator",
  "/plan": "Plan Builder", "/plan/new": "Guided Plan Builder",
  "/tools": "All calculation tools", "/tools/bac-water": "BAC water volume calculator",
  "/tools/dose": "Amount to volume calculator", "/tools/reverse-bac": "Concentration to final volume calculator",
  "/tools/syringe-units": "U-100 syringe units and mL converter", "/tools/mg-to-mcg": "mg and mcg converter",
  "/tools/supplies": "Portion and vial count calculator", "/tools/vial-labels": "Printable vial labels",
  "/peptides": "Compound reference directory", "/peptides/compare": "Compound references side by side",
  "/learn": "Learning center", "/faq": "Common calculation and BAC water questions",
  "/methodology": "Calculator formulas, assumptions and reproducible checks",
  "/compare-calculators": "Choose the calculator for your task",
  "/recommendations": "Research product directory with affiliate disclosures",
  "/about": "About the publisher", "/contact": "Contact and corrections",
  "/editorial-policy": "Editorial and sourcing policy", "/disclaimer": "Scope and limitations",
  "/privacy": "Privacy and optional analytics", "/terms": "Terms of use",
  "/preferred-source": "Google source preferences", "/sitemap": "Complete public site map",
};
const clean = (text: string) => text.replace(/[\r\n\[\]<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 220);
export function buildLlmsGuide(catalog: LearnEntry[]) {
  const entries = new Map(catalog.map(entry => [entry.url, { title: entry.title, description: entry.excerpt }]));
  for (const page of STATIC_PAGES) {
    const path = page.path || "/";
    if (!entries.has(path)) entries.set(path, { title: labels[path] || path.split("/").pop()!.replaceAll("-", " "), description: "" });
  }
  const sections = new Map<string, string[]>([["Calculation tools", []], ["Reference guides and comparisons", []], ["Publisher and product context", []], ["Optional", []]]);
  for (const [path, entry] of entries) {
    const section = path.startsWith("/learn") || path.startsWith("/peptides") || path === "/faq" ? "Reference guides and comparisons"
      : ["/privacy", "/terms", "/preferred-source", "/sitemap"].includes(path) ? "Optional"
      : path === "/" || path.startsWith("/tools") || path.startsWith("/plan") || path === "/peptide-calculator" || path === "/methodology" || path === "/compare-calculators" ? "Calculation tools" : "Publisher and product context";
    sections.get(section)!.push(`- [${clean(labels[path] || entry.title)}](${SITE_URL}${path})${entry.description ? `: ${clean(entry.description)}` : ""}`);
  }
  return "# BACwater.ai\n\n> Free concentration and measurement tools using deterministic arithmetic, with product-label references and an independent research-supply affiliate directory.\n\nThe site does not sell products or select a dose. It cannot establish identity, compatibility, sterility or a safe storage period. Enter verified amounts and final volumes from the applicable instructions. Research examples are not instructions for human use. Affiliate commissions do not constitute independent testing.\n\nLinks below lead to public HTML. Private accounts, saved-plan identifiers, notes, drafts and administrative records are excluded. This optional discovery guide does not control crawler access or guarantee indexing, rankings or AI citations.\n\n" + [...sections].filter(([, links]) => links.length).map(([heading, links]) => `## ${heading}\n\n${links.join("\n")}`).join("\n\n") + "\n";
}
