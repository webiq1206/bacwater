"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { upsertVendor } from "@/lib/admin-actions";
import { toast } from "@/components/ui/toaster";

type Vendor = {
  id: string;
  name: string;
  contactEmail: string;
  phone: string | null;
  productsSupplied: string | null;
  emailTemplate: string;
  notes: string | null;
  active: boolean;
};

const DEFAULT_TEMPLATE = `Hi {vendor_name} team,

Please fulfill order {order_id}:
{items}

Ship to:
{ship_to}

Customer email: {customer_email}
Order placed: {placed_at}

Reply when shipped with tracking. Thanks,
BACWater.ai`;

export function VendorForm({ vendor }: { vendor?: Vendor }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await upsertVendor(fd);
        setPending(false);
        if (res.ok) {
          toast({ title: "Vendor saved", variant: "success" });
          router.push("/admin/vendors");
          router.refresh();
        } else {
          toast({ title: "Save failed", description: res.error, variant: "destructive" });
        }
      }}
      className="grid gap-6 md:grid-cols-2"
    >
      {vendor?.id ? <input type="hidden" name="id" value={vendor.id} /> : null}
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Vendor name</Label>
          <Input name="name" defaultValue={vendor?.name} required className="mt-2" />
        </div>
        <div>
          <Label>Contact email</Label>
          <Input name="contactEmail" type="email" defaultValue={vendor?.contactEmail} required className="mt-2" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" defaultValue={vendor?.phone ?? ""} className="mt-2" />
        </div>
        <div>
          <Label>Products supplied</Label>
          <Input name="productsSupplied" defaultValue={vendor?.productsSupplied ?? ""} className="mt-2" placeholder="Comma-separated SKUs" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={vendor?.active ?? true} />
          Active
        </label>
        <div>
          <Label>Internal notes</Label>
          <Textarea name="notes" rows={4} defaultValue={vendor?.notes ?? ""} />
        </div>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Email template</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Placeholders: {"{vendor_name}"}, {"{order_id}"}, {"{items}"}, {"{ship_to}"}, {"{customer_email}"}, {"{placed_at}"}
          </p>
          <Textarea name="emailTemplate" rows={16} defaultValue={vendor?.emailTemplate ?? DEFAULT_TEMPLATE} className="mt-2 font-mono text-sm" required />
        </div>
        <Button type="submit" variant="brand" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save vendor
        </Button>
      </CardContent></Card>
    </form>
  );
}
