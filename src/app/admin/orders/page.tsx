import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string; vendor?: string; q?: string }>;
}

export const metadata = { title: "Admin · Orders", robots: { index: false, follow: false } };

export default async function OrdersListPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status;
  const vendor = params.vendor;
  const q = params.q?.trim();

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(vendor ? { vendorStatus: vendor } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q } },
              { publicId: { contains: q } },
              { shippingName: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} matching</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/api/admin/orders/export?status=${status || ""}&vendor=${vendor || ""}`}>
            <Download className="h-4 w-4" /> Export CSV
          </Link>
        </Button>
      </div>

      <form className="mt-4 flex flex-wrap gap-2 items-center" action="/admin/orders">
        <Input name="q" placeholder="Search order id, email, or name" defaultValue={q} className="max-w-sm" />
        <select name="status" defaultValue={status || ""} className="h-10 rounded-full border border-input bg-card px-3 text-sm">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="needs_attention">Needs attention</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <select name="vendor" defaultValue={vendor || ""} className="h-10 rounded-full border border-input bg-card px-3 text-sm">
          <option value="">All vendor states</option>
          <option value="none">None</option>
          <option value="queued">Queued</option>
          <option value="submitted">Submitted</option>
          <option value="confirmed">Confirmed</option>
        </select>
        <Button size="sm" type="submit">Apply</Button>
      </form>

      <Card className="mt-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3">
                      <Link href={`/admin/orders/${o.publicId}`} className="font-medium hover:underline">
                        #{o.publicId}
                      </Link>
                    </td>
                    <td className="p-3">
                      <div>{o.shippingName || "-"}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="p-3">{o.items.length}</td>
                    <td className="p-3 font-medium tabular-nums">{formatCurrency(o.totalCents)}</td>
                    <td className="p-3"><Badge variant={o.status === "paid" ? "success" : o.status === "shipped" ? "brand" : o.status === "needs_attention" ? "warning" : "outline"}>{o.status}</Badge></td>
                    <td className="p-3"><Badge variant={o.vendorStatus === "submitted" ? "brand" : o.vendorStatus === "queued" ? "warning" : "outline"}>{o.vendorStatus}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr><td className="p-8 text-center text-muted-foreground" colSpan={7}>No orders match those filters.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
