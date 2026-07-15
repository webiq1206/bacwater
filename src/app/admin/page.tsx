import Link from "next/link";
import { FileText, MessageCircle, Users, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const [planCount, userCount, contentCount, openContact, recentPlans] =
    await Promise.all([
      prisma.plan.count(),
      prisma.user.count(),
      prisma.contentBlock.count(),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.plan.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    ]);

  const widgets = [
    { label: "Saved plans", value: planCount, icon: FileText, href: "/admin/plans" },
    { label: "Users", value: userCount, icon: Users, href: "/admin/users" },
    { label: "Content blocks", value: contentCount, icon: BookOpen, href: "/admin/content" },
    { label: "Open contact messages", value: openContact, icon: MessageCircle, href: "/admin/contact" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">
        A quick pulse on the site. BACwater.ai sells nothing — this covers plans,
        content, and contact.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Link key={w.label} href={w.href}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <span className="inline-flex h-10 w-10 rounded-lg bg-muted items-center justify-center">
                  <w.icon className="h-5 w-5 text-foreground" />
                </span>
                <div>
                  <div className="text-2xl font-semibold tabular-nums">{w.value}</div>
                  <div className="text-xs text-muted-foreground">{w.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent plans</h3>
            <Link href="/admin/plans" className="text-xs text-foreground font-medium hover:underline">
              All plans
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {recentPlans.map((p) => (
              <li key={p.id} className="py-3">
                <Link href={`/plan/${p.publicId}`} className="flex items-center justify-between gap-3 hover:underline">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.peptideName || "Plan"}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(p.createdAt)} · {p.dosesPerVial} per vial
                    </div>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </li>
            ))}
            {recentPlans.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">No plans yet.</li>
            ) : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
