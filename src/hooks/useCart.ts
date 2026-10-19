'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariation } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, variationId: string | null, quantity: number, product: Product, variation?: ProductVariation) => void;
  removeItem: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItemKey: (productId: string, variationId: string | null) => string;
}

function getItemKey(productId: string, variationId: string | null): string {
  return variationId ? `${productId}_${variationId}` : productId;
}

function getItemPrice(item: CartItem): number {
  if (item.variation) {
    return item.variation.sale_price ?? item.variation.regular_price;
  }
  if (item.product) {
    return item.product.sale_price ?? item.product.regular_price;
  }
  return 0;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (productId, variationId, quantity, product, variation) => {
        const key = getItemKey(productId, variationId);
        const existing = get().items.find(
          (item) => getItemKey(item.product_id, item.variation_id) === key
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              getItemKey(item.product_id, item.variation_id) === key
                ? { ...item, quantity: item.quantity + quantity, product, variation }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id: key,
                product_id: productId,
                variation_id: variationId,
                quantity,
                product,
                variation,
              },
            ],
          });
        }
      },

      removeItem: (itemKey) => {
        set({
          items: get().items.filter(
            (item) => getItemKey(item.product_id, item.variation_id) !== itemKey
          ),
        });
      },

      updateQuantity: (itemKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemKey);
          return;
        }
        set({
          items: get().items.map((item) =>
            getItemKey(item.product_id, item.variation_id) === itemKey
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + getItemPrice(item) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemKey,
    }),
    {
      name: 'style-secrets-cart',
      partialize: (state) => ({
        items: state.items.map(({ id, product_id, variation_id, quantity, product, variation }) => ({
          id, product_id, variation_id, quantity, product, variation,
        })),
      }),
    }
  )
);

export const useCart = useCartStore;
export default useCartStore;
