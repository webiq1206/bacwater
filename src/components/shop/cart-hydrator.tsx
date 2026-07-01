"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

// Ensures the cart store rehydrates from localStorage on the client.
export function CartHydrator() {
  const setHydrated = useCart((s) => s.setHydrated);
  useEffect(() => {
    setHydrated();
  }, [setHydrated]);
  return null;
}
