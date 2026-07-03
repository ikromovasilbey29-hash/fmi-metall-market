import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllProducts } from "@/lib/product-store";

export interface InventoryItem {
  productId: string;
  name: string;
  stock: number;
  unit: string;
  price: number;
  categoryName: string;
}

interface InventoryStore {
  inventory: InventoryItem[];
  // Mahsulot sotilganda ombor kamaytirish
  decreaseStock: (productId: string, quantity: number) => void;
  // Mahsulot qo'shilganda ombor oshirish
  increaseStock: (productId: string, quantity: number) => void;
  // Joriy stock olish
  getStock: (productId: string) => number;
  // Admin panel o'zgarishlarini sinxronlashtirish
  syncWithProducts: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      inventory: [],

      decreaseStock: (productId, quantity) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.productId === productId
              ? { ...item, stock: Math.max(0, item.stock - quantity) }
              : item
          ),
        }));
      },

      increaseStock: (productId, quantity) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.productId === productId
              ? { ...item, stock: item.stock + quantity }
              : item
          ),
        }));
      },

      getStock: (productId) => {
        const item = get().inventory.find((i) => i.productId === productId);
        return item?.stock ?? 0;
      },

      syncWithProducts: () => {
        if (typeof window === "undefined") return;
        const products = getAllProducts();
        const existing = get().inventory;

        // Yangi mahsulotlarni qo'shamiz, mavjudlarini qoldirамiz
        const synced: InventoryItem[] = products.map((p) => {
          const found = existing.find((i) => i.productId === p.id);
          return {
            productId: p.id,
            name: p.name,
            // Mavjud bo'lsa uning stockini saqlaymiz, yangi bo'lsa product-dan olamiz
            stock: found ? found.stock : p.stock,
            unit: p.unit,
            price: p.price,
            categoryName: p.category?.name || "",
          };
        });

        set({ inventory: synced });
      },
    }),
    { name: "fmi-inventory" }
  )
);
