"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "@/components/ui/toaster";

interface Props {
  product: {
    id: string;
    slug: string;
    sku: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
  };
}

export function AddToCartControl({ product }: Props) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-10 w-10 grid place-items-center rounded-l-full hover:bg-muted"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-10 text-center text-sm font-medium tabular-nums">{qty}</div>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="h-10 w-10 grid place-items-center rounded-r-full hover:bg-muted"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        variant="brand"
        size="lg"
        onClick={() => {
          add({
            productId: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            priceCents: product.priceCents,
            imageUrl: product.imageUrl,
            quantity: qty,
          });
          toast({ title: "Added to cart", description: product.name, variant: "success" });
        }}
      >
        <ShoppingBag className="h-4 w-4" /> Add to cart
      </Button>
    </div>
  );
}
