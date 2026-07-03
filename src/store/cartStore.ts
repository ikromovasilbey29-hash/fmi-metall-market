import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";
import toast from "react-hot-toast";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        const currentQty = existing?.quantity || 0;
        const available = Math.max(0, product.stock - currentQty);

        if (available <= 0) {
          toast.error(`Omborda faqat ${product.stock} ${product.unit} mavjud — barchasi savatda`);
          return;
        }

        const qtyToAdd = Math.min(quantity, available);
        if (qtyToAdd < quantity) {
          toast(`Zaxira yetarli emas — faqat ${qtyToAdd} ${product.unit} qo'shildi (jami: ${product.stock})`, { icon: "⚠️" });
        }

        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + qtyToAdd }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: qtyToAdd }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const items = get().items;
        const item = items.find((i) => i.product.id === productId);
        if (!item) return;

        const clamped = Math.min(quantity, item.product.stock);
        if (clamped < quantity) {
          toast.error(`Omborda faqat ${item.product.stock} ${item.product.unit} mavjud`);
        }

        set({
          items: items.map((i) =>
            i.product.id === productId ? { ...i, quantity: clamped } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "fmi-cart",
    }
  )
);
