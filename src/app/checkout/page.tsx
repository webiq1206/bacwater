import { CheckoutClient } from "@/components/shop/checkout-client";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="eyebrow">Checkout</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">Almost there</h1>
      <p className="mt-2 text-muted-foreground leading-relaxed">
        Fill in your shipping info and we&apos;ll take care of the rest. Free shipping on orders over $50.
      </p>
      <CheckoutClient />
    </div>
  );
}
