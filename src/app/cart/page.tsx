import { CartClient } from "@/components/shop/cart-client";

export const metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="eyebrow">Cart</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
        Your supplies
      </h1>
      <CartClient />
    </div>
  );
}
