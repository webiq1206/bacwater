"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isCalculatorWorkspace } from "@/lib/calculator-routes";
/** Keep website promotions and navigation out of a dedicated calculation route. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return isCalculatorWorkspace(usePathname() || "/") ? null : <>{children}</>;
}
