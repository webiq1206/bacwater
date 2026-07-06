"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { updateOrderStatus } from "@/lib/admin-actions";

const STATUSES = [
  "pending", "paid", "needs_attention", "shipped", "cancelled", "refunded",
];

export function OrderStatusForm({ publicId, status, notes }: { publicId: string; status: string; notes: string }) {
  const [s, setS] = useState(status);
  const [n, setN] = useState(notes);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="mt-3 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        await updateOrderStatus(publicId, s, n);
        setPending(false);
        toast({ title: "Order updated", variant: "success" });
      }}
    >
      <div>
        <label className="text-xs text-muted-foreground">Status</label>
        <select value={s} onChange={(e) => setS(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-input bg-card px-3 text-sm">
          {STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Internal notes</label>
        <Textarea value={n} onChange={(e) => setN(e.target.value)} rows={4} />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </Button>
    </form>
  );
}
