"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartClient() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const remove = useCart((s) => s.remove);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const clear = useCart((s) => s.clear);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mt-6 border border-border p-8 sm:p-12 text-center">
        <div className="mx-auto h-12 w-12 bg-muted grid place-items-center">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div className="mt-4 text-lg font-serif font-medium tracking-tight">Your cart is empty</div>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          The easiest way to fill it: <Link href="/plan" className="text-foreground font-medium underline">build a plan</Link> and
          we&apos;ll recommend exactly what you need with a one-click &ldquo;Add all to cart.&rdquo;
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand"><Link href="/plan">Build a plan first <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild variant="outline"><Link href="/shop">Browse the shop</Link></Button>
        </div>
      </div>
    );
  }

  const subtotal = cartSubtotalCents(items);

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="border border-border p-6 sm:p-8">
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.productId} className="py-4 flex items-start gap-4">
              <div className="h-14 w-14 bg-muted grid place-items-center shrink-0 overflow-hidden">
                {i.imageUrl ? (
                  <img src={i.imageUrl} alt={i.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-2xl text-muted-foreground">&#x2022;</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${i.slug}`} className="font-medium hover:underline">
                  {i.name}
                </Link>
                <div className="text-xs text-muted-foreground mt-0.5">{i.sku}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => updateQuantity(i.productId, i.quantity - 1)}
                    className="h-9 w-9 grid place-items-center hover:bg-muted"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-9 text-center text-sm tabular-nums">{i.quantity}</div>
                  <button
                    onClick={() => updateQuantity(i.productId, i.quantity + 1)}
                    className="h-9 w-9 grid place-items-center hover:bg-muted"
                    aria-label="Increase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="w-20 text-right font-medium tabular-nums">
                  {formatCurrency(i.priceCents * i.quantity)}
                </div>
                <button
                  onClick={() => remove(i.productId)}
                  className="h-9 w-9 grid place-items-center border border-border hover:bg-muted"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={clear}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear cart
        </button>
      </div>

      <div className="border border-border h-fit p-6 sm:p-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">{subtotal >= 5000 ? <span className="text-success font-medium">Free</span> : "Calculated at checkout"}</span>
          </div>
          {subtotal < 5000 ? (
            <p className="text-xs text-muted-foreground">
              Add {formatCurrency(5000 - subtotal)} more for free shipping
            </p>
          ) : null}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-muted-foreground">Calculated at checkout</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-semibold">
            <span>Estimated total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button asChild variant="brand" size="lg" className="w-full mt-2">
            <Link href="/checkout">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="text-[11px] text-muted-foreground text-center">
            Secure checkout. Free shipping on orders over $50.
          </div>
      </div>
    </div>
  );
}
