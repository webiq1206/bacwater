"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Home, Calculator, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/peptide-calculator",
    label: "Calculate",
    icon: Calculator,
    match: (p: string) => p === "/peptide-calculator" || p === "/plan" || p.startsWith("/plan/") || p.startsWith("/tools"),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/learn") || p.startsWith("/faq") || p.startsWith("/peptides"),
  },
  { href: "/plans", label: "Account", icon: User, match: (p: string) => p.startsWith("/plans") },
];

/** The wizard and admin have their own navigation and action placement. */
export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const hidden = pathname === "/plan" || pathname === "/plan/new" || pathname.startsWith("/plan/") || pathname.startsWith("/admin");

  useEffect(() => {
    let mounted = true;
    const update = () => {
      if (!mounted) return;
      const active = document.activeElement;
      const editing = active instanceof HTMLElement && (
        active.matches("input,textarea,select") || active.isContentEditable ||
        // A Clear/Submit action is part of the active form interaction too.
        // Restoring the bar between pointerdown and click can cover the target.
        (Boolean(active.closest("main")) && active.matches("button,[role='combobox']"))
      );
      document.body.dataset.bacInputActive = String(editing);
    };
    // focusout can temporarily expose document.body before the next control
    // receives focus. Evaluate after that transition instead of flashing the bar.
    const afterFocusChange = () => queueMicrotask(update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", afterFocusChange);
    update();
    return () => {
      mounted = false;
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", afterFocusChange);
      delete document.body.dataset.bacInputActive;
    };
  }, [pathname]);

  if (hidden) return null;
  return (
    <>
      <div className="bac-bottom-spacer lg:hidden" aria-hidden />
      <nav aria-label="Mobile primary navigation" className="bac-bottom-nav lg:hidden no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-md grid-cols-4">
          {ITEMS.map(item => {
            const active = item.match(pathname);
            return (
              <Link key={item.href} href={item.href} className={cn("flex min-h-14 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground")} aria-current={active ? "page" : undefined}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
