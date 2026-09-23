import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gate every /admin page. The server actions already checked the role, but
  // rendering is where the data leaks, so the check has to happen here too.
  const admin = await requireAdminPage();

  // Open-work counts live in the nav so a queue with something waiting is
  // visible from anywhere in the panel, not only from the dashboard.
  const [openContact, draftContent] = await Promise.all([
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.contentBlock.count({ where: { published: false } }),
  ]);

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" as const },
    { href: "/admin/contact", label: "Contact", icon: "contact" as const, count: openContact },
    { href: "/admin/content", label: "Content", icon: "content" as const, count: draftContent },
    { href: "/admin/publication", label: "Publishing", icon: "content" as const },
    { href: "/admin/plans", label: "Plans", icon: "plans" as const },
    { href: "/admin/users", label: "Users", icon: "users" as const },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-border bg-card lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="p-4">
            <Link href="/" aria-label="BACwater.ai home"><Wordmark/></Link><p className="mt-3 text-xs font-medium">Site admin</p>
          </div>
          <AdminNav items={nav} />
          <div className="mt-6 hidden px-4 pb-4 text-xs text-muted-foreground lg:block">
            <div className="truncate">{admin.email}</div>
            <Link href="/" className="mt-1 inline-block hover:underline">
              ← Back to site
            </Link>
          </div>
        </aside>
        <div className="min-w-0 p-3 sm:p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
