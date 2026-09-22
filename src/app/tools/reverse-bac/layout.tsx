import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
export default function Layout({children}:{children:ReactNode}){return <><SoftwareAppJsonLd name="Reverse BAC Water Calculator: Final Volume Math" description="Explore the relationship between stated mass, final volume and a U-100 reading. A mathematical check, not a diluent or preparation recommendation." url="/tools/reverse-bac" />{children}</>;}
