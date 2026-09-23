import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
export default function Layout({ children }: { children: ReactNode }) {
  return <><SoftwareAppJsonLd name="mg to mcg converter" description="A bidirectional mass-unit converter with exact decimal shifting, labeled inputs and clear validation." url="/tools/mg-to-mcg" />{children}</>;
}
