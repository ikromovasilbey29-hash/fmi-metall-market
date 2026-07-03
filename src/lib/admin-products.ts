/* Shared types & helpers for admin products */

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  badge: string;          // "Yangi", "Ommabop", "Premium" etc — free text
  specs: string;          // comma-separated: "A-III, GOST 5781, 12m"
  imageUrl: string;       // single URL (main image)
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  "Polat", "Armatura", "List temir", "Profil quvur",
  "Burchak", "Alyuminiy", "Quduq halqasi", "Sim", "I-profil", "Kanal",
];

export const UNITS = ["tonna", "kg", "metr", "dona", "m²", "m³"];

export const LS_KEY = "fmi_admin_products";

const SEED: AdminProduct[] = [
  {
    id: "1", name: "Armatura polat", category: "Polat",
    description: "Qurilish uchun A-III sinfli armatura, 6–40mm diametrda. Yuqori mustahkamlik va korroziyaga chidamlilik. GOST 5781-82 standartiga muvofiq.",
    unit: "tonna", price: 285000, stock: 85, minStock: 20,
    badge: "Ommabop", specs: "A-III, GOST 5781, 6–40mm",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    isPopular: true, isNew: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "2", name: "Kanal polat (UPN)", category: "Polat",
    description: "Konstruktiv polat kanal profil, UPN 100–400 seriyasi. Ko'prik, ustun va tosh ko'taruvchi konstruktsiyalarda ishlatiladi.",
    unit: "tonna", price: 320000, stock: 42, minStock: 15,
    badge: "", specs: "UPN 100-400, GOST 8240",
    imageUrl: "",
    isPopular: false, isNew: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "3", name: "Polat list (varaq)", category: "Polat",
    description: "Tekis polat varaq, 1.5–20mm qalinlikda. Mashina va konstruktsiya ishlab chiqarishda keng qo'llaniladi.",
    unit: "tonna", price: 310000, stock: 120, minStock: 30,
    badge: "", specs: "1.5–20mm, GOST 19903",
    imageUrl: "",
    isPopular: false, isNew: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "4", name: "Quvur polat", category: "Polat",
    description: "Elektr qaynoq quvur, 15–530mm diametr. Suv, gaz va neft quvurlari uchun.",
    unit: "tonna", price: 340000, stock: 18, minStock: 20,
    badge: "Yangi", specs: "15–530mm, GOST 10704",
    imageUrl: "",
    isPopular: false, isNew: true,
    createdAt: "2026-06-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "5", name: "Alyuminiy profil", category: "Alyuminiy",
    description: "Konstruktiv alyuminiy profil, turli shakllarda. Yengil va mustahkam.",
    unit: "tonna", price: 890000, stock: 35, minStock: 10,
    badge: "", specs: "6060, 6063 T5",
    imageUrl: "",
    isPopular: false, isNew: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "6", name: "Alyuminiy list", category: "Alyuminiy",
    description: "Tekis alyuminiy varaq, 0.5–10mm qalinlik. Keng qo'llanish.",
    unit: "tonna", price: 920000, stock: 67, minStock: 15,
    badge: "Ommabop", specs: "0.5–10mm, GOST 21631",
    imageUrl: "",
    isPopular: true, isNew: false,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
  },
];

export function lsLoad(): AdminProduct[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return SEED;
    return JSON.parse(raw);
  } catch { return SEED; }
}

export function lsSave(data: AdminProduct[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  // Frontend useProducts hook'ini xabardor qilamiz
  window.dispatchEvent(new StorageEvent("storage", { key: LS_KEY }));
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function stockStatus(stock: number, minStock: number) {
  if (stock <= 0)       return { label: "Tugagan", cls: "bg-red-500/15 text-red-400 border-red-500/25" };
  if (stock < minStock) return { label: "Kam",     cls: "bg-orange-500/15 text-orange-400 border-orange-500/25" };
  return                       { label: "Mavjud",  cls: "bg-green-500/15 text-green-400 border-green-500/25" };
}

export const EMPTY_FORM: Omit<AdminProduct, "id" | "createdAt" | "updatedAt"> = {
  name: "", description: "", category: "Polat", unit: "tonna",
  price: 0, stock: 0, minStock: 0,
  badge: "", specs: "", imageUrl: "",
  isPopular: false, isNew: false,
};
