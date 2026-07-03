import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface FavoriteStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInFavorites: (productId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInFavorites(product.id)) {
          set({ items: [...get().items, product] });
          toast.success("Sevimlilarga qo'shildi ❤️");
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
        toast("Sevimlilardan olib tashlandi", { icon: "💔" });
      },

      toggleItem: (product) => {
        if (get().isInFavorites(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInFavorites: (productId) => {
        return get().items.some((i) => i.id === productId);
      },
    }),
    {
      name: "fmi-favorites",
    }
  )
);
