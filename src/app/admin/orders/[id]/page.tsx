import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { VendorSubmitPanel } from "@/components/admin/vendor-submit-panel";

interface Props { params: Promise<{ id: string }>; }
export const metadata = { title: "Admin · Order", robots: { index: false, follow: false } };

export default async function OrderDetail({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { publicId: id },
    include: { items: true, vendorSubmissions: { include: { vendor: true } }, user: true },
  });
  if (!order) return notFound();
  const vendors = await prisma.vendor.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Order #{order.publicId}</h1>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(order.createdAt)} · {order.email}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{formatCurrency(order.totalCents)}</div>
          <div className="mt-1 flex gap-2">
            <Badge variant={order.status === "paid" ? "success" : order.status === "shipped" ? "brand" : "outline"}>{order.status}</Badge>
            <Badge variant={order.vendorStatus === "submitted" ? "brand" : order.vendorStatus === "queued" ? "warning" : "outline"}>vendor: {order.vendorStatus}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">Line items</h3>
              <table className="mt-3 w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground uppercase">
                  <tr><th className="pb-2">Product</th><th className="pb-2">SKU</th><th className="pb-2 text-right">Qty</th><th className="pb-2 text-right">Unit</th><th className="pb-2 text-right">Line</th></tr>
                </thead>
                <tbody>
                  {order.items.map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <td className="py-2">{i.productName}</td>
                      <td className="py-2 text-muted-foreground">{i.sku}</td>
                      <td className="py-2 text-right">{i.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(i.unitCents)}</td>
                      <td className="py-2 text-right">{formatCurrency(i.unitCents * i.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(order.subtotalCents)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatCurrency(order.shippingCents)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(order.taxCents)}</span></div>
                <div className="flex justify-between font-semibold border-t border-border pt-2"><span>Total</span><span>{formatCurrency(order.totalCents)}</span></div>
              </div>
            </CardContent>
          </Card>

          <VendorSubmitPanel order={order} vendors={vendors} submissions={order.vendorSubmissions} />

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold">Internal notes</h3>
              <OrderStatusForm
                publicId={order.publicId}
                status={order.status}
                notes={order.internalNotes || ""}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 h-fit">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Ship to</div>
              <div className="mt-2 text-sm">
                <div className="font-medium">{order.shippingName}</div>
                <div>{order.shippingAddress1}</div>
                {order.shippingAddress2 ? <div>{order.shippingAddress2}</div> : null}
                <div>{order.shippingCity}, {order.shippingState} {order.shippingPostal}</div>
                <div>{order.shippingCountry}</div>
                {order.shippingPhone ? <div className="text-muted-foreground">{order.shippingPhone}</div> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Customer</div>
              <div className="mt-2 text-sm">
                <div className="font-medium">{order.email}</div>
                {order.user?.name ? <div className="text-muted-foreground">{order.user.name}</div> : null}
                <div className="text-xs text-muted-foreground mt-1">
                  {order.user ? `Account: ${order.user.email}` : "Guest checkout"}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
