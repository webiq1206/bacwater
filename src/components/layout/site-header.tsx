"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart, cartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/plan", label: "Build My Plan" },
  { href: "/peptides", label: "Peptides" },
  { href: "/shop", label: "Shop" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Tools" },
  { href: "/buy", label: "Buy Bac Water" },
];

export function SiteHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const [open, setOpen] = useState(false);
  const count = cartCount(items);

  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2"
        >
          <span className="font-serif text-2xl font-medium tracking-tight leading-none">
            BACwater
          </span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase leading-none pb-0.5">
            .ai
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => {
            const active =
              pathname === n.href ||
              (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link
              href="/plans"
              className="inline-flex items-center justify-center border border-border bg-white h-10 w-10 hover:bg-muted transition-colors"
              aria-label="My plans"
              title="My plans"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 border border-border bg-white px-3 h-10 text-sm font-medium hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {hydrated && count > 0 ? (
              <span className="absolute -top-1 -right-1 rounded-full bg-foreground text-white text-[10px] font-bold h-5 min-w-5 px-1 grid place-items-center">
                {count}
              </span>
            ) : null}
          </Link>
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
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border last:border-b-0"
              >
                {n.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/plans"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border last:border-b-0"
              >
                My Plans
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
