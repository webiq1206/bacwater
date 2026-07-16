"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, User, X, LogOut, LayoutGrid, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/plan", label: "Build My Plan" },
  { href: "/peptides", label: "Compound Reference" },
  { href: "/tools", label: "Calculators" },
  { href: "/learn", label: "Learning Center" },
];

const ITEM = "flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-muted transition-colors";

/** Account icon + dropdown. Works signed-in (My Plans / Sign out) or signed-out
 *  (Sign in / Create account), so there's always a login entry point. */
function AccountMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center border border-border bg-white hover:bg-muted transition-colors"
      >
        <User className="h-4 w-4" />
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-border bg-white shadow-lift py-1 overflow-hidden"
          >
            {isAuthenticated ? (
              <>
                <Link href="/plans" role="menuitem" onClick={() => setOpen(false)} className={ITEM}>
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" /> My Plans
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className={cn(ITEM, "w-full text-left")}
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" /> Sign out
                </button>
              </>
            ) : (
              <>
                <div className="px-3.5 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Account
                </div>
                <Link href="/signin" role="menuitem" onClick={() => setOpen(false)} className={ITEM}>
                  <LogIn className="h-4 w-4 text-muted-foreground" /> Sign in
                </Link>
                <Link href="/signup" role="menuitem" onClick={() => setOpen(false)} className={ITEM}>
                  <UserPlus className="h-4 w-4 text-muted-foreground" /> Create account
                </Link>
                <div className="my-1 h-px bg-border" />
                <Link href="/plans" role="menuitem" onClick={() => setOpen(false)} className={ITEM}>
                  <LayoutGrid className="h-4 w-4 text-muted-foreground" /> My Plans
                </Link>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function SiteHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-medium tracking-tight leading-none">
            BACwater
          </span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase leading-none pb-0.5">
            .ai
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-3 py-1.5 text-sm transition-colors",
                  active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AccountMenu isAuthenticated={isAuthenticated} />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((s) => !s)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center border border-border hover:bg-muted"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="mx-auto flex max-w-7xl flex-col p-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/plans"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border"
            >
              My Plans
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted text-left"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
