import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  MessageCircle,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const [
    openContact,
    unpublishedContent,
    planCount,
    userCount,
    contentCount,
    recentContact,
    expiringPlans,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.contentBlock.count({ where: { published: false } }),
    prisma.plan.count(),
    prisma.user.count(),
    prisma.contentBlock.count(),
    prisma.contactMessage.findMany({
      where: { handled: false },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, subject: true, message: true, createdAt: true },
    }),
    prisma.plan.count({
      where: {
        archived: false,
        expirationDate: { lt: new Date(), not: null },
      },
    }),
  ]);

  // Work first, vanity metrics second. Each queue links to the workspace that
  // clears it rather than to a list you then have to click through.
  const queues = [
    {
      href: "/admin/contact",
      label: "Messages to answer",
      count: openContact,
      icon: MessageCircle,
      done: "Inbox is clear.",
    },
    {
      href: "/admin/content",
      label: "Drafts to publish",
      count: unpublishedContent,
      icon: BookOpen,
      done: "Everything is published.",
    },
  ];

  const stats = [
    { label: "Saved plans", value: planCount, href: "/admin/plans", icon: FileText },
    { label: "Users", value: userCount, href: "/admin/users", icon: Users },
    { label: "Content blocks", value: contentCount, href: "/admin/content", icon: BookOpen },
    {
      label: "Active plans past shelf life",
      value: expiringPlans,
      href: "/admin/plans",
      icon: FileText,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        What needs attention, and where to go and clear it.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {queues.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className={`group flex items-center gap-4 rounded-2xl border p-5 transition-colors ${
              q.count > 0
                ? "border-border bg-card hover:bg-muted/50"
                : "border-border bg-muted/20"
            }`}
          >
            <span
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                q.count > 0 ? "bg-brand text-brand-foreground" : "bg-muted"
              }`}
            >
              {q.count > 0 ? (
                <q.icon className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-2xl font-semibold tabular-nums">
                {q.count > 0 ? q.count : "0"}
              </span>
              <span className="block text-sm text-muted-foreground">
                {q.count > 0 ? q.label : q.done}
              </span>
            </span>
            {q.count > 0 ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </Link>
        ))}
      </div>

      {recentContact.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Waiting on you</h2>
            <Link
              href="/admin/contact"
              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              Open triage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentContact.map((m) => (
              <li key={m.id}>
                <Link
                  href="/admin/contact"
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {m.subject || m.message.slice(0, 70)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.name} · {formatDate(m.createdAt)}
                    </div>
                  </div>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div className="mt-2 text-xl font-semibold tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
