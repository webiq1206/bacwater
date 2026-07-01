import Link from "next/link";
import { AlertCircle, Boxes, FileText, ShoppingCart, TrendingUp, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminDashboard() {
  const [
    newOrders,
    awaitingVendor,
    submittedToVendor,
    shipped,
    needsAttention,
    lowInventory,
    recentPlans,
    recentSales,
    revenue,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "paid", vendorStatus: "none" } }),
    prisma.order.count({ where: { vendorStatus: "queued" } }),
    prisma.order.count({ where: { vendorStatus: "submitted" } }),
    prisma.order.count({ where: { status: "shipped" } }),
    prisma.order.count({ where: { status: "needs_attention" } }),
    prisma.product.findMany({ where: { active: true, inventory: { lt: 20 } }, take: 5 }),
    prisma.plan.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { in: ["paid", "shipped"] } },
    }),
  ]);

  const widgets = [
    { label: "New orders", value: newOrders, icon: ShoppingCart, href: "/admin/orders?status=paid&vendor=none" },
    { label: "Awaiting vendor submission", value: awaitingVendor, icon: Boxes, href: "/admin/orders?vendor=queued" },
    { label: "Submitted to vendor", value: submittedToVendor, icon: Truck, href: "/admin/orders?vendor=submitted" },
    { label: "Shipped", value: shipped, icon: Truck, href: "/admin/orders?status=shipped" },
    { label: "Needs attention", value: needsAttention, icon: AlertCircle, href: "/admin/orders?status=needs_attention" },
    { label: "Revenue (paid+shipped)", value: formatCurrency(revenue._sum.totalCents || 0), icon: TrendingUp, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">A quick pulse on the store.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent orders</h3>
              <Link href="/admin/orders" className="text-xs text-foreground font-medium hover:underline">All orders</Link>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {recentSales.map((o) => (
                <li key={o.id} className="py-3">
                  <Link href={`/admin/orders/${o.publicId}`} className="flex items-center justify-between gap-3 hover:underline">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">#{o.publicId} · {o.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(o.createdAt)} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold">{formatCurrency(o.totalCents)}</div>
                      <Badge variant={o.status === "paid" ? "success" : o.status === "shipped" ? "brand" : "outline"}>
                        {o.status}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
              {recentSales.length === 0 ? (
                <li className="py-8 text-center text-sm text-muted-foreground">No orders yet.</li>
              ) : null}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent plans</h3>
              <Link href="/admin/plans" className="text-xs text-foreground font-medium hover:underline">All plans</Link>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {recentPlans.map((p) => (
                <li key={p.id} className="py-3">
                  <Link href={`/plan/${p.publicId}`} className="flex items-center justify-between gap-3 hover:underline">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.peptideName || "Plan"}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)} · {p.dosesPerVial} doses/vial
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

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Low inventory alerts</h3>
            <Link href="/admin/products" className="text-xs text-foreground font-medium hover:underline">Manage products</Link>
          </div>
          {lowInventory.length === 0 ? (
            <div className="mt-4 text-sm text-muted-foreground">Inventory looks healthy.</div>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {lowInventory.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sku}</div>
                  </div>
                  <Badge variant={p.inventory === 0 ? "destructive" : "warning"}>
                    {p.inventory} left
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
