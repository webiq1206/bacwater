import { CheckoutClient } from "@/components/shop/checkout-client";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Fast and simple. Guest checkout — no account required.
      </p>
      <CheckoutClient />
    </div>
  );
}
