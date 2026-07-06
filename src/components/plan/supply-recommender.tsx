"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Package, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import type { SupplyRecommendation } from "@/lib/calc";
import { toast } from "@/components/ui/toaster";
import Link from "next/link";

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
  const [pricesFailed, setPricesFailed] = useState(false);
  const addMany = useCart((s) => s.addMany);

  useEffect(() => {
    fetch(
      `/api/products?skus=${supplies
        .map((s) => encodeURIComponent(s.sku))
        .join(",")}`
    )
      .then((r) => r.json())
      .then(
        (data: {
          products: Array<{
            id: string;
            slug: string;
            sku: string;
            name: string;
            priceCents: number;
            imageUrl: string | null;
          }>;
        }) => {
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
          setPricesFailed(false);
          setRows(merged);
        }
      )
      .catch(() => {
        setPricesFailed(true);
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

  const activeRows = (rows ?? []).filter((r) => !r.removed);
  const totalCents = activeRows.reduce(
    (sum, r) => sum + r.priceCents * r.quantity,
    0
  );

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
      toast({
        title: "Nothing to add",
        description: "Adjust the recommendations first.",
      });
      return;
    }
    addMany(items);
    toast({
      title: "Added to cart",
      description: `${items.length} item${items.length === 1 ? "" : "s"} added.`,
      variant: "success",
    });
  }

  const displayRows =
    rows ??
    supplies.map(
      (s) =>
        ({
          ...s,
          productId: null,
          slug: null,
          priceCents: 0,
          imageUrl: null,
          removed: false,
        }) as Row
    );

  return (
    <div
      className="border-2 bg-card shadow-sm"
      style={{ borderColor: "var(--color-accent-guide)" }}
    >
      {/* Accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: "var(--color-accent-guide)" }}
      />

      {/* Header */}
      <div
        className="p-6 sm:p-8 border-b"
        style={{
          background: "var(--color-accent-guide-soft)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Package className="h-5 w-5 accent-check" />
          <div className="eyebrow" style={{ color: "var(--color-accent-guide)" }}>Next step</div>
        </div>
        <h4 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Everything you&apos;ll need
        </h4>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
          Based on your plan, here&apos;s exactly what you need to get started.
          Quantities are pre-calculated. Adjust or remove anything you already
          have.
        </p>
      </div>

      {rows === null && (
        <div className="px-6 sm:px-8 py-3 text-xs text-muted-foreground border-b border-border">
          Loading live prices...
        </div>
      )}
      {pricesFailed && (
        <div className="px-6 sm:px-8 py-3 text-xs text-muted-foreground border-b border-border">
          We couldn&apos;t load live prices right now. You can still see what you
          need below, or{" "}
          <Link href="/shop" className="text-foreground font-medium underline">
            browse the shop
          </Link>
          .
        </div>
      )}

      {/* Items */}
      <ul className="divide-y divide-border">
        {displayRows.map((row, i) => (
          <li
            key={row.sku}
            className={`flex items-start gap-4 p-5 sm:px-8 ${
              row.removed ? "opacity-40" : ""
            }`}
          >
            <div className="h-14 w-14 bg-muted grid place-items-center shrink-0 overflow-hidden">
              {row.imageUrl ? (
                <img
                  src={row.imageUrl}
                  alt={row.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-tight">{row.name}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {row.reason}
              </div>
              {row.priceCents > 0 && (
                <div className="text-sm font-medium mt-1 tabular-nums">
                  ${(row.priceCents / 100).toFixed(2)}
                  {row.quantity > 1 && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      &times; {row.quantity}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min={0}
                value={row.quantity}
                onChange={(e) => {
                  const q = parseInt(e.target.value || "0", 10);
                  setRows((prev) => {
                    const base = prev ?? (rows as Row[]);
                    if (!base) return prev;
                    const next = [...base];
                    next[i] = { ...next[i], quantity: q, removed: q === 0 };
                    return next;
                  });
                }}
                className="h-9 w-16 border border-input bg-card text-center text-sm tabular-nums"
              />
              <button
                type="button"
                onClick={() => {
                  setRows((prev) => {
                    const base = prev ?? (rows as Row[]);
                    if (!base) return prev;
                    const next = [...base];
                    next[i] = { ...next[i], removed: true, quantity: 0 };
                    return next;
                  });
                }}
                className="h-9 w-9 grid place-items-center border border-border hover:bg-muted"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div
        className="p-6 sm:p-8 border-t"
        style={{
          background: "var(--color-accent-guide-soft)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {totalCents > 0 && (
            <div className="text-sm text-muted-foreground">
              Estimated total:{" "}
              <span className="text-foreground font-semibold text-lg tabular-nums">
                ${(totalCents / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
            <Button variant="brand" size="lg" onClick={addAll}>
              <ShoppingBag className="h-4 w-4" /> Add all to cart
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">
                Browse shop <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
