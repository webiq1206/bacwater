"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);
  const [pending, setPending] = useState(false);

  if (!hydrated) return null;

  const subtotal = cartSubtotalCents(items);
  const shipping = subtotal > 5000 ? 0 : 899;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + shipping + tax;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Your cart is empty" });
      return;
    }
    setPending(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      shipping: {
        name: String(form.get("name") || ""),
        address1: String(form.get("address1") || ""),
        address2: String(form.get("address2") || ""),
        city: String(form.get("city") || ""),
        state: String(form.get("state") || ""),
        postal: String(form.get("postal") || ""),
        country: "US",
        phone: String(form.get("phone") || ""),
      },
      items: items.map((i) => ({
        productId: i.productId,
        sku: i.sku,
        name: i.name,
        priceCents: i.priceCents,
        quantity: i.quantity,
      })),
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({ title: "Checkout failed", description: data.error, variant: "destructive" });
        setPending(false);
        return;
      }
      clear();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/checkout/success?order=${data.publicId}`);
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold">Contact</h2>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
              <p className="mt-1 text-xs text-muted-foreground">We&apos;ll send your order confirmation and tracking here.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold">Ship to</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="address1">Address</Label>
                <Input id="address1" name="address1" required autoComplete="address-line1" />
              </div>
              <div>
                <Label htmlFor="address2">Apt, suite (optional)</Label>
                <Input id="address2" name="address2" autoComplete="address-line2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required autoComplete="address-level2" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" required autoComplete="address-level1" maxLength={2} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal">ZIP</Label>
                  <Input id="postal" name="postal" required autoComplete="postal-code" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" autoComplete="tel" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="divide-y divide-border">
            {items.map((i) => (
              <li key={i.productId} className="py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0 overflow-hidden">
                  {i.imageUrl ? (
                    <img src={i.imageUrl} alt={i.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-lg text-muted-foreground">&#x2022;</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {i.quantity}</div>
                </div>
                <div className="text-sm font-medium tabular-nums shrink-0">
                  {formatCurrency(i.priceCents * i.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-success font-medium">Free</span> : formatCurrency(shipping)}</span>
            </div>
            {shipping > 0 ? (
              <p className="text-xs text-muted-foreground">Free shipping on orders over $50</p>
            ) : null}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (est.)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Complete order
          </Button>
          <div className="text-[11px] text-muted-foreground text-center">
            When Stripe is connected, payment happens on Stripe&apos;s hosted page.
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
