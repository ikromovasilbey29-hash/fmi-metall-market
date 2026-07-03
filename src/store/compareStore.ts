import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import toast from "react-hot-toast";

const MAX_COMPARE = 4;

interface CompareStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        if (items.length >= MAX_COMPARE) {
          toast.error(`Taqqoslash ro'yxatiga maksimal ${MAX_COMPARE} ta mahsulot qo'shish mumkin`);
          return;
        }
        if (items.find((i) => i.id === product.id)) {
          toast("Bu mahsulot allaqachon taqqoslash ro'yxatida", { icon: "ℹ️" });
          return;
        }
        set({ items: [...items, product] });
        toast.success("Taqqoslash ro'yxatiga qo'shildi");
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      clearItems: () => set({ items: [] }),

      isInCompare: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
    }),
    {
      name: "fmi-compare",
    }
  )
);
