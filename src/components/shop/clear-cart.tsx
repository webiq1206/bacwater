"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/**
 * Clears the cart once, on mount. Rendered on the checkout success page so the
 * cart is emptied only after payment (or an offline order) is confirmed, not
 * before redirecting to Stripe (where the customer might still cancel).
 */
export function ClearCart() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
