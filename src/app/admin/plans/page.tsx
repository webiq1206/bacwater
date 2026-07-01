import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Plans", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: true } });
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Plans</h1>
      <p className="text-sm text-muted-foreground mt-1">{plans.length} plans (most recent 200)</p>
      <Card className="mt-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Peptide</th>
                <th className="p-3">User</th>
                <th className="p-3">Vial</th>
                <th className="p-3">Dose</th>
                <th className="p-3">Doses/vial</th>
                <th className="p-3">Created</th>
                <th className="p-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.peptideName || "—"}</td>
                  <td className="p-3">{p.user?.email || <span className="text-muted-foreground">guest</span>}</td>
                  <td className="p-3">{p.vialStrengthMg} mg</td>
                  <td className="p-3">{p.doseMcg} mcg</td>
                  <td className="p-3">{p.dosesPerVial}</td>
                  <td className="p-3 text-xs text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="p-3">
                    <Link href={`/plan/${p.publicId}`} className="text-foreground hover:underline">Open</Link>
                    {" · "}
                    <Link href={`/plan/${p.publicId}/pdf`} className="text-foreground hover:underline">PDF</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
