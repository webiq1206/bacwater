import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Contact", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Contact messages</h1>
      <div className="mt-6 grid gap-3">
        {messages.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-5">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-medium">{m.name} <span className="text-xs text-muted-foreground">· {m.email}</span></div>
                  <div className="text-xs text-muted-foreground">{formatDate(m.createdAt)}{m.subject ? ` · ${m.subject}` : ""}</div>
                </div>
                <Badge variant={m.handled ? "success" : "outline"}>{m.handled ? "handled" : "new"}</Badge>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{m.message}</p>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No contact messages yet.</div>
        ) : null}
      </div>
    </div>
  );
}
