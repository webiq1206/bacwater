import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Admin · Vendors", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
        <Button asChild variant="brand"><Link href="/admin/vendors/new"><Plus className="h-4 w-4" /> New vendor</Link></Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {vendors.map((v) => (
          <Link key={v.id} href={`/admin/vendors/${v.id}`}>
            <Card className="hover:shadow-[var(--shadow-lift)] transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.contactEmail}</div>
                  </div>
                  <Badge variant={v.active ? "success" : "outline"}>{v.active ? "active" : "inactive"}</Badge>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Supplies: {v.productsSupplied || "—"}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {vendors.length === 0 ? (
          <div className="text-sm text-muted-foreground">No vendors yet. Create one to send order emails.</div>
        ) : null}
      </div>
    </div>
  );
}
