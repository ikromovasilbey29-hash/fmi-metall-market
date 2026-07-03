/**
 * Yagona mahsulot store — admin panel va frontend bir joydan o'qiydi.
 * Admin panel AdminProduct ni saqlaydi → bu fayl Product formatga o'giradi.
 *
 * Agar localStorage bo'sh bo'lsa → products-data.ts dan SEED ma'lumotlar
 * avtomatik yuklanadi va adminProduct formatiga o'giriladi.
 */

import type { Product } from "@/types";
import { type AdminProduct, lsLoad as adminLoad, lsSave, LS_KEY } from "@/lib/admin-products";
import { productsList } from "@/lib/products-data";

/* ── products-data.ts → AdminProduct (bir martalik seed) ── */
function seedFromProductsData(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(LS_KEY);
  if (existing) return; // allaqachon bor — qayta seed qilmaymiz

  const seeded: AdminProduct[] = productsList.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    category: p.category?.name || "Polat",
    unit: p.unit,
    price: p.price,
    stock: p.stock,
    minStock: Math.floor(p.stock * 0.1),
    badge: p.isPopular ? "Ommabop" : "",
    specs: "",
    imageUrl: p.imageUrls[0] || "",
    isPopular: p.isPopular,
    isNew: false,
    createdAt: p.createdAt,
    updatedAt: p.createdAt,
  }));

  lsSave(seeded);
}

/* AdminProduct → Product (frontend uchun) */
function toProduct(ap: AdminProduct): Product {
  // slug: nomdan yasaymiz
  const slug = ap.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || ap.id;

  // category object
  const catSlug = ap.category.toLowerCase().replace(/\s+/g, "-");
  const category = { id: catSlug, name: ap.category, slug: catSlug, order: 0 };

  return {
    id: ap.id,
    categoryId: catSlug,
    name: ap.name,
    slug,
    description: ap.description || undefined,
    price: ap.price,
    unit: ap.unit,
    imageUrls: ap.imageUrl ? [ap.imageUrl] : [],
    stock: ap.stock,
    isPopular: ap.isPopular || ap.badge === "Ommabop",
    weightPerUnit: undefined,
    metalTypeId: undefined,
    category,
    createdAt: ap.createdAt,
  };
}

/* ── Public API ── */

/** Barcha mahsulotlarni Product[] formatda qaytaradi */
export function getAllProducts(): Product[] {
  // Server tomonida products-data dan statik qaytaramiz
  if (typeof window === "undefined") {
    return productsList;
  }
  // Birinchi marta chaqirilganda seed qilamiz
  seedFromProductsData();
  const adminProducts = adminLoad();
  return adminProducts.map(toProduct);
}

/** Faqat ommaboplarni qaytaradi */
export function getPopularProducts(): Product[] {
  return getAllProducts().filter((p) => p.isPopular);
}

/** Slugga qarab topadi */
export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

/** ID ga qarab topadi */
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}
