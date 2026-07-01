import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin · Products", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Button asChild variant="brand"><Link href="/admin/products/new"><Plus className="h-4 w-4" /> New product</Link></Button>
      </div>
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Inventory</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3">
                      <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.sku}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{formatCurrency(p.priceCents)}</td>
                    <td className="p-3">
                      <Badge variant={p.inventory === 0 ? "destructive" : p.inventory < 20 ? "warning" : "outline"}>{p.inventory}</Badge>
                    </td>
                    <td className="p-3"><Badge variant={p.active ? "success" : "outline"}>{p.active ? "active" : "hidden"}</Badge></td>
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
