import type { ReactNode } from "react";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
export default function Layout({children}:{children:ReactNode}){return <><SoftwareAppJsonLd name="Dose and Volume Calculator: mg, mcg and mL" description="Convert an entered amount to mL or find mass in a measured volume using a known concentration. Formulas, unit checks and no dose recommendation." url="/tools/dose" />{children}</>;}
