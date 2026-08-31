import { prisma } from "@/lib/db";
import { PlansWorkspace, type PlanRow } from "@/components/admin/plans-workspace";

export const metadata = { title: "Admin · Plans", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminPlansPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    select: {
      publicId: true,
      name: true,
      peptideName: true,
      vialStrengthMg: true,
      doseMcg: true,
      dosesPerVial: true,
      archived: true,
      expirationDate: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  // Summary rows only. The selected plan's full CalcResult snapshot is fetched
  // on demand by the workspace.
  const rows: PlanRow[] = plans.map((p) => ({
    publicId: p.publicId,
    name: p.name,
    peptideName: p.peptideName,
    ownerEmail: p.user?.email ?? null,
    vialStrengthMg: p.vialStrengthMg,
    doseMcg: p.doseMcg,
    dosesPerVial: p.dosesPerVial,
    archived: p.archived,
    expirationDate: p.expirationDate?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <PlansWorkspace
      plans={rows}
      initialId={id && rows.some((r) => r.publicId === id) ? id : undefined}
    />
  );
}
