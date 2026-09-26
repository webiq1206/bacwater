/** Exact public workspaces. Reference, account and print pages keep their own layout. */
export const CALCULATOR_ROUTES = [
  { href: "/peptide-calculator", label: "Peptide calculator" },
  { href: "/plan", label: "Guided calculation" },
  { href: "/plan/new", label: "New calculation" },
  { href: "/tools/bac-water", label: "BAC water calculator" },
  { href: "/tools/dose", label: "Amount-to-volume" },
  { href: "/tools/mg-to-mcg", label: "mg to mcg" },
  { href: "/tools/syringe-units", label: "U-100 units to mL" },
  { href: "/tools/reverse-bac", label: "Find final volume" },
  { href: "/tools/supplies", label: "Vial counts" },
] as const;
export function isCalculatorWorkspace(path: string): boolean {
  return CALCULATOR_ROUTES.some(route => route.href === path) ||
    /^\/calculate\/product\/[a-z0-9-]+$/.test(path) || /^\/calculate\/[a-z0-9-]+$/.test(path) || /^\/plan\/[A-Za-z0-9_-]+\/edit$/.test(path);
}
