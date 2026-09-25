"use client";

import Link from "next/link";
import { SiteSearchButton } from "@/components/search/site-search";
import { ProductSearchButton } from "@/components/search/product-search";
import productSearchStyles from "@/components/search/product-search.module.css";
import { Wordmark } from "@/components/brand/wordmark";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, User, X, LogOut, LayoutGrid, LogIn, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./research-header.module.css";

const NAV = [
  { href: "/peptide-calculator", label: "Calculator" },
  { href: "/tools", label: "More tools" },
  { href: "/learn", label: "Learn" },
  { href: "/recommendations", label: "Research supplies" },
];
const ITEM = "flex items-center gap-2.5 px-3.5 min-h-11 py-2.5 text-sm hover:bg-muted transition-colors";

/** Account icon + dropdown. Preserve both signed-in and signed-out entry points. */
function AccountMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative" onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); trigger.current?.focus(); } }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
      <button type="button" onClick={() => setOpen((s) => !s)} aria-label="Account" aria-controls="account-options" ref={trigger} aria-expanded={open} className="inline-flex h-11 w-11 items-center justify-center border border-border bg-white hover:bg-muted transition-colors"><User className="h-4 w-4" /></button>
      {open ? <>
        <div className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
        <div id="account-options" className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-border bg-white shadow-lift py-1 overflow-hidden">
          {isAuthenticated ? <>
            <Link href="/plans" onClick={() => setOpen(false)} className={ITEM}><LayoutGrid className="h-4 w-4 text-muted-foreground" /> My Plans</Link>
            <button type="button" onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className={cn(ITEM, "w-full text-left")}><LogOut className="h-4 w-4 text-muted-foreground" /> Sign out</button>
          </> : <>
            <div className="px-3.5 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Account</div>
            <Link href="/signin" onClick={() => setOpen(false)} className={ITEM}><LogIn className="h-4 w-4 text-muted-foreground" /> Sign in</Link>
            <Link href="/signup" onClick={() => setOpen(false)} className={ITEM}><UserPlus className="h-4 w-4 text-muted-foreground" /> Create account</Link>
            <div className="my-1 h-px bg-border" />
            <Link href="/plans" onClick={() => setOpen(false)} className={ITEM}><LayoutGrid className="h-4 w-4 text-muted-foreground" /> My Plans</Link>
          </>}
        </div>
      </> : null}
    </div>
  );
}

export function SiteHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  if (pathname?.startsWith("/admin")) return null;
  return <header onKeyDown={(e) => { if (e.key === "Escape" && open && !e.defaultPrevented && !(e.target instanceof Element && e.target.closest('[role="dialog"]'))) { e.preventDefault(); setOpen(false); trigger.current?.focus(); } }} className={cn(styles.header, "sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm")}>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" aria-label="BACwater.ai home"><Wordmark/></Link>
      <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(`${n.href}/`));
          return <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={cn("px-3 py-1.5 text-sm transition-colors", active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground")}>{n.label}</Link>;
        })}
        <ProductSearchButton/>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/plans" className={styles.plansLink}>My plans</Link>
        <SiteSearchButton compact/>
        <AccountMenu isAuthenticated={isAuthenticated} />
        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" ref={trigger} onClick={() => setOpen((s) => !s)} className="lg:hidden inline-flex h-11 w-11 items-center justify-center border border-border hover:bg-muted">{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
      </div>
    </div>
    {open ? <div id="mobile-navigation" className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-white">
      <nav aria-label="Expanded mobile navigation" className="mx-auto flex max-w-7xl flex-col p-3">
        <div className={productSearchStyles.mobileMenuSearch}><ProductSearchButton/></div>
        {NAV.map((n) => <Link key={n.href} href={n.href} aria-current={pathname === n.href || pathname?.startsWith(`${n.href}/`) ? "page" : undefined} onClick={() => setOpen(false)} className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border">{n.label}</Link>)}
        <Link href="/plans" onClick={() => setOpen(false)} className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border">My Plans</Link>
        {isAuthenticated ? <button type="button" onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted text-left">Sign out</button> : <>
          <Link href="/signin" onClick={() => setOpen(false)} className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border">Sign in</Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted">Create account</Link>
        </>}
      </nav>
    </div> : null}
  </header>;
}
