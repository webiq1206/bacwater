import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Content", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const items = await prisma.contentBlock.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <Button asChild variant="brand"><Link href="/admin/content/new"><Plus className="h-4 w-4" /> New</Link></Button>
      </div>
      <Card className="mt-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Kind</th>
                <th className="p-3">Published</th>
                <th className="p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3"><Link href={`/admin/content/${c.id}`} className="font-medium hover:underline">{c.title}</Link></td>
                  <td className="p-3 text-muted-foreground">{c.slug}</td>
                  <td className="p-3"><Badge variant="outline">{c.kind}</Badge></td>
                  <td className="p-3">{c.published ? <Badge variant="success">Yes</Badge> : <Badge variant="outline">No</Badge>}</td>
                  <td className="p-3 text-xs text-muted-foreground">{formatDate(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
