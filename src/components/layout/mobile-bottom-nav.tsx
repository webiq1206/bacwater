"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Home, Wand2, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/plan",
    label: "Build",
    icon: Wand2,
    match: (p: string) => (p === "/plan" || p.startsWith("/plan/")) || p.startsWith("/tools"),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: BookOpen,
    match: (p: string) =>
      p.startsWith("/learn") || p.startsWith("/faq") || p.startsWith("/peptides"),
  },
  {
    href: "/plans",
    label: "Account",
    icon: User,
    match: (p: string) => p.startsWith("/plans"),
  },
];

/**
 * Native-style bottom navigation on mobile (§8). Hidden on large screens (the
 * header nav covers those), in admin, and during the wizard / results pages,  * those have their own bottom sticky action bars and would otherwise collide.
 */
export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const hidden =
    pathname === "/plan" ||
    pathname === "/plan/new" ||
    pathname.startsWith("/plan/") ||
    pathname.startsWith("/admin");
  useEffect(() => {
    const update = () => {
      const active = document.activeElement;
      document.body.dataset.bacInputActive = String(active instanceof HTMLElement && (active.matches("input,textarea,select") || active.isContentEditable));
    };
    document.addEventListener("focusin", update); document.addEventListener("focusout", update);
    return () => { document.removeEventListener("focusin", update); document.removeEventListener("focusout", update); delete document.body.dataset.bacInputActive; };
  }, []);
  if (hidden) return null;

  return (
    <>
      {/* In-flow spacer so page content clears the fixed bar on mobile. */}
      <div className="bac-bottom-spacer lg:hidden" aria-hidden />
      <nav aria-label="Mobile primary navigation" className="bac-bottom-nav lg:hidden no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {ITEMS.map((it) => {
            const active = it.match(pathname);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex min-h-14 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <it.icon className="h-5 w-5" />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
