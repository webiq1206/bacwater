"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { upsertProduct } from "@/lib/admin-actions";
import { toast } from "@/components/ui/toaster";

type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  useCase: string | null;
  priceCents: number;
  imageUrl: string | null;
  inventory: number;
  active: boolean;
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await upsertProduct(fd);
        setPending(false);
        if (res.ok) {
          toast({ title: "Product saved", variant: "success" });
          router.push("/admin/products");
          router.refresh();
        } else {
          toast({ title: "Save failed", description: res.error, variant: "destructive" });
        }
      }}
      className="grid gap-6 md:grid-cols-2"
    >
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={product?.name} required className="mt-2" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input name="slug" defaultValue={product?.slug} required className="mt-2" />
        </div>
        <div>
          <Label>SKU</Label>
          <Input name="sku" defaultValue={product?.sku} required className="mt-2" />
        </div>
        <div>
          <Label>Category</Label>
          <select name="category" defaultValue={product?.category || "bac-water"} className="mt-2 w-full h-12 rounded-lg border border-input bg-card px-4 text-base">
            <option value="bac-water">BAC water</option>
            <option value="syringes">Syringes</option>
            <option value="alcohol-pads">Alcohol pads</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label>Price (cents)</Label>
          <Input name="priceCents" type="number" defaultValue={product?.priceCents} required className="mt-2" />
        </div>
        <div>
          <Label>Inventory</Label>
          <Input name="inventory" type="number" defaultValue={product?.inventory ?? 0} required className="mt-2" />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input name="imageUrl" defaultValue={product?.imageUrl ?? ""} className="mt-2" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          Active
        </label>
      </CardContent></Card>
      <Card><CardContent className="p-6 space-y-4">
        <div>
          <Label>Use case</Label>
          <Input name="useCase" defaultValue={product?.useCase ?? ""} className="mt-2" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea name="description" rows={12} defaultValue={product?.description} required />
        </div>
        <Button type="submit" variant="brand" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save product
        </Button>
      </CardContent></Card>
    </form>
  );
}
