import Link from "next/link";
import { FileText, LayoutGrid, MessageCircle, Users } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/plans", label: "Plans", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/contact", label: "Contact", icon: MessageCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-border bg-card lg:min-h-screen">
          <div className="p-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span aria-hidden className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-foreground text-[11px] font-bold">
                BW
              </span>
              <span>Admin</span>
            </Link>
          </div>
          <nav className="px-2 py-2 space-y-0.5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 px-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">← Back to site</Link>
          </div>
        </aside>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
