import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";

// The page owns its metadata and the calculator owns its visible explanation.
// Do not prepend a second introduction or append contradictory legacy FAQs.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SoftwareAppJsonLd
        name="BAC water volume calculator"
        description="Check concentration and measurement units from user-entered amounts and a stated final liquid volume. This is a mathematical utility."
        url="/tools/bac-water"
      />
      {children}
    </>
  );
}
