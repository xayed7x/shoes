import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;

  // Mutations
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;

  // Drawer control
  openCart: () => void;
  closeCart: () => void;

  // Derived (called as functions to work around Zustand's snapshot model)
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.variant.id === variant.id);
          if (existing) {
            const newQuantity = Math.min(existing.quantity + quantity, variant.stock);
            return {
              items: state.items.map((i) =>
                i.variant.id === variant.id
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
              isOpen: true,
            };
          }
          const clampedQty = Math.min(quantity, variant.stock);
          return {
            items: [...state.items, { product, variant, quantity: clampedQty }],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variant.id !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variant.id !== variantId)
              : state.items.map((i) =>
                  i.variant.id === variantId
                    ? { ...i, quantity: Math.min(quantity, i.variant.stock) }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) =>
            sum + (i.variant.price_override ?? i.product.price) * i.quantity,
          0
        ),
    }),
    {
      name: "soleil-cart-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
