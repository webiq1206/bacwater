import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";

// The server page provides one metadata/WebPage definition, and the converter
// contains the explanation, examples and relevant links visible to the reader.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SoftwareAppJsonLd
        name="U-100 syringe units to mL converter"
        description="A two-way mathematical converter between milliliters and U-100 scale units, with explicit input validation and worked examples."
        url="/tools/syringe-units"
      />
      {children}
    </>
  );
}
