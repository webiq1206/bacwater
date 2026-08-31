import { prisma } from "@/lib/db";
import { UsersWorkspace, type UserRecord } from "@/components/admin/users-workspace";

export const metadata = { title: "Admin · Users", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      // Totals must not come from the capped `plans` list below.
      _count: { select: { plans: true } },
      plans: {
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          publicId: true,
          name: true,
          peptideName: true,
          vialStrengthMg: true,
          doseMcg: true,
          archived: true,
          createdAt: true,
        },
      },
    },
  });

  // One grouped query for message counts beats a per-user lookup.
  const messageGroups = await prisma.contactMessage.groupBy({
    by: ["email", "handled"],
    _count: { _all: true },
  });
  const messageTotals = new Map<string, { total: number; open: number }>();
  for (const g of messageGroups) {
    const key = g.email.toLowerCase();
    const entry = messageTotals.get(key) ?? { total: 0, open: 0 };
    entry.total += g._count._all;
    if (!g.handled) entry.open += g._count._all;
    messageTotals.set(key, entry);
  }

  const records: UserRecord[] = users.map((u) => {
    const messages = messageTotals.get(u.email.toLowerCase()) ?? { total: 0, open: 0 };
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      planCount: u._count.plans,
      archivedPlanCount: u.plans.filter((p) => p.archived).length,
      messageCount: messages.total,
      openMessageCount: messages.open,
      plans: u.plans.map((p) => ({
        publicId: p.publicId,
        name: p.name,
        peptideName: p.peptideName,
        vialStrengthMg: p.vialStrengthMg,
        doseMcg: p.doseMcg,
        archived: p.archived,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  });

  return <UsersWorkspace users={records} initialEmail={email} />;
}
