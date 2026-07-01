import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const vendor = searchParams.get("vendor") || undefined;

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(vendor ? { vendorStatus: vendor } : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "publicId","email","status","vendorStatus","totalCents",
    "shippingName","shippingAddress1","shippingCity","shippingState","shippingPostal",
    "createdAt","itemCount","items",
  ];
  const rows = orders.map((o) => [
    o.publicId, o.email, o.status, o.vendorStatus, o.totalCents,
    o.shippingName ?? "", o.shippingAddress1 ?? "", o.shippingCity ?? "", o.shippingState ?? "", o.shippingPostal ?? "",
    o.createdAt.toISOString(), o.items.length,
    o.items.map((i) => `${i.sku}x${i.quantity}`).join(";"),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));

  const csv = [header.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
