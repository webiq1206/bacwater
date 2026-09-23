"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function SiteFrame({children,shelf}:{children:ReactNode;shelf:ReactNode}) {
 const path=usePathname()||"/";
 const area=path.startsWith("/admin")?"admin":path.startsWith("/plan")||path==="/signin"||path==="/signup"?"account":path.startsWith("/tools")||path==="/peptide-calculator"?"calculator":path.startsWith("/learn")||path.startsWith("/peptides")?"reference":path==="/"?"home":"page";
 const showShelf=path!=="/"&&path!=="/recommendations"&&!path.startsWith("/admin")&&!path.startsWith("/plans/labels")&&!(path!=="/plan/new"&&/^\/plan\/[^/]+(?:\/|$)/.test(path))&&path!=="/signin"&&path!=="/signup";
 return <div data-bac-page={area} className="bac-site-frame"><div className="bac-page-content">{children}</div>{showShelf&&shelf}</div>;
}
