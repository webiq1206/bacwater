"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, LayoutGrid, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutGrid,
  contact: MessageCircle,
  content: BookOpen,
  plans: FileText,
  users: Users,
} as const;

export interface AdminNavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  /** Open items waiting in that queue. Hidden at zero. */
  count?: number;
}

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-0.5 overflow-x-auto px-2 pb-2 lg:block lg:space-y-0.5 lg:overflow-visible">
      {items.map((n) => {
        const Icon = ICONS[n.icon];
        const active =
          n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted/60"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{n.label}</span>
            {n.count ? (
              <span className="ml-auto rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-brand-foreground">
                {n.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
