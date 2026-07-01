"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string | null;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  addMany: (items: Array<Omit<CartItem, "quantity"> & { quantity?: number }>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setHydrated: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      add: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: item.quantity ?? 1 }],
          });
        }
      },
      addMany: (items) => {
        items.forEach((item) => get().add(item));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "bacwater-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
}
