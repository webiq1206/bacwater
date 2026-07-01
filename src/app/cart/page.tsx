import { CartClient } from "@/components/shop/cart-client";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
      <CartClient />
    </div>
  );
}
