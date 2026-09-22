import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
export default function Layout({children}:{children:ReactNode}){return <><SoftwareAppJsonLd name="Vial Inventory Calculator: Count Known Measurements" description="Count vials from stated mass, amount per measurement and a known count. No inferred treatment cycle, frequency or supply purchase recommendation." url="/tools/supplies" />{children}</>;}
