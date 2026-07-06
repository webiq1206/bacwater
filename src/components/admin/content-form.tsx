"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { upsertContent } from "@/lib/admin-actions";
import { toast } from "@/components/ui/toaster";

type Content = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  body: string;
  published: boolean;
};

export function ContentForm({ content }: { content?: Content }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await upsertContent(fd);
        setPending(false);
        if (res.ok) {
          toast({ title: "Saved", variant: "success" });
          router.push("/admin/content");
          router.refresh();
        } else {
          toast({ title: "Save failed", description: res.error, variant: "destructive" });
        }
      }}
      className="grid gap-6 md:grid-cols-[1fr_320px]"
    >
      {content?.id ? <input type="hidden" name="id" value={content.id} /> : null}
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Title</Label>
          <Input name="title" defaultValue={content?.title} required className="mt-2" />
        </div>
        <div>
          <Label>Body (markdown-lite: **bold**, blank line = new paragraph)</Label>
          <Textarea name="body" rows={20} defaultValue={content?.body} required className="font-mono text-sm" />
        </div>
        <Button type="submit" variant="brand" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Slug</Label>
          <Input name="slug" defaultValue={content?.slug} required className="mt-2" />
        </div>
        <div>
          <Label>Kind</Label>
          <select name="kind" defaultValue={content?.kind || "guide"} className="mt-2 w-full h-12 rounded-lg border border-input bg-card px-4 text-base">
            <option value="guide">guide</option>
            <option value="faq">faq</option>
            <option value="page">page</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={content?.published ?? true} />
          Published
        </label>
      </CardContent></Card>
    </form>
  );
}
