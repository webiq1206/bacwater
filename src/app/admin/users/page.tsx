import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserRoleSwitcher } from "@/components/admin/user-role-switcher";

export const metadata = { title: "Admin · Users", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { plans: true, orders: true } } } });
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Plans</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3 font-medium">{u.email}</td>
                    <td className="p-3">{u.name || "-"}</td>
                    <td className="p-3"><UserRoleSwitcher userId={u.id} role={u.role as "user" | "admin"} /></td>
                    <td className="p-3">{u._count.plans}</td>
                    <td className="p-3">{u._count.orders}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
