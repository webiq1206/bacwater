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
    inventory?: number;
    active?: boolean;
  };
}

export function AddToCartControl({ product }: Props) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  const inventory = product.inventory ?? Infinity;
  const soldOut = product.active === false || inventory <= 0;
  const atMax = qty >= inventory;

  if (soldOut) {
    return (
      <Button variant="outline" size="lg" disabled aria-disabled className="cursor-not-allowed">
        Sold out
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="h-11 w-11 grid place-items-center rounded-l-full hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-10 text-center text-sm font-medium tabular-nums">{qty}</div>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(inventory, q + 1))}
          disabled={atMax}
          className="h-11 w-11 grid place-items-center rounded-r-full hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
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
