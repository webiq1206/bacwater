"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import type { SupplyRecommendation } from "@/lib/calc";
import { toast } from "@/components/ui/toaster";

interface Props {
  supplies: SupplyRecommendation[];
}

interface Row extends SupplyRecommendation {
  productId: string | null;
  slug: string | null;
  priceCents: number;
  imageUrl: string | null;
  removed: boolean;
}

export function SupplyRecommender({ supplies }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const addMany = useCart((s) => s.addMany);

  useEffect(() => {
    fetch(`/api/products?skus=${supplies.map((s) => encodeURIComponent(s.sku)).join(",")}`)
      .then((r) => r.json())
      .then((data: { products: Array<{ id: string; slug: string; sku: string; name: string; priceCents: number; imageUrl: string | null }> }) => {
        const merged: Row[] = supplies.map((s) => {
          const found = data.products.find((p) => p.sku === s.sku);
          return {
            ...s,
            productId: found?.id ?? null,
            slug: found?.slug ?? null,
            priceCents: found?.priceCents ?? 0,
            imageUrl: found?.imageUrl ?? null,
            removed: false,
          };
        });
        setRows(merged);
      })
      .catch(() => {
        setRows(
          supplies.map((s) => ({
            ...s,
            productId: null,
            slug: null,
            priceCents: 0,
            imageUrl: null,
            removed: false,
          }))
        );
      });
  }, [supplies]);

  function addAll() {
    if (!rows) return;
    const items = rows
      .filter((r) => !r.removed && r.productId && r.slug)
      .map((r) => ({
        productId: r.productId!,
        slug: r.slug!,
        sku: r.sku,
        name: r.name,
        priceCents: r.priceCents,
        quantity: r.quantity,
        imageUrl: r.imageUrl,
      }));
    if (items.length === 0) {
      toast({ title: "Nothing to add", description: "Adjust the recommendations first." });
      return;
    }
    addMany(items);
    toast({
      title: "Added to cart",
      description: `${items.length} item${items.length === 1 ? "" : "s"} added.`,
      variant: "success",
    });
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge variant="brand">Recommended supplies</Badge>
            <h4 className="mt-2 text-xl font-semibold tracking-tight">
              Everything you&apos;ll need
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-selected based on your plan. Adjust quantities or remove any item.
            </p>
          </div>
          <Button variant="brand" onClick={addAll}>
            <ShoppingBag className="h-4 w-4" /> Add all to cart
          </Button>
        </div>

        <ul className="mt-6 divide-y divide-border">
          {(rows || supplies.map((s) => ({ ...s, productId: null, slug: null, priceCents: 0, imageUrl: null, removed: false } as Row))).map((row, i) => (
            <li key={row.sku} className="flex items-start gap-4 py-4">
              <div className="h-14 w-14 rounded-xl bg-muted grid place-items-center text-xl shrink-0">
                {row.sku.startsWith("BAC") ? "💧" : row.sku.startsWith("SYR") ? "💉" : row.sku.startsWith("ALC") ? "🧴" : "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{row.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{row.reason}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min={0}
                  value={row.quantity}
                  onChange={(e) => {
                    const q = parseInt(e.target.value || "0", 10);
                    setRows((prev) => {
                      const base = prev ?? rows;
                      if (!base) return prev;
                      const next = [...base];
                      next[i] = { ...next[i], quantity: q, removed: q === 0 };
                      return next;
                    });
                  }}
                  className="h-9 w-16 rounded-full border border-input bg-background text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRows((prev) => {
                      const base = prev ?? rows;
                      if (!base) return prev;
                      const next = [...base];
                      next[i] = { ...next[i], removed: true, quantity: 0 };
                      return next;
                    });
                  }}
                  className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-muted"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
