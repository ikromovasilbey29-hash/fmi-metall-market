import type { Product } from "@/types";

export const allProducts: Record<string, Product> = {
  "armatura-d8-a400": {
    id: "1",
    categoryId: "cat1",
    name: "Armatura D8 A400",
    slug: "armatura-d8-a400",
    description:
      "Diametri 8mm bo'lgan A400 markali po'lat armatura. Yengil konstruktsiyalar, panjara va to'siqlar uchun mos. GOST 5781-82 standartiga muvofiq ishlab chiqarilgan. Yaxshi egiluvchanlik va yuqori tortishish mustahkamligi bilan ajralib turadi.",
    price: 7800,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop",
    ],
    stock: 5000,
    isPopular: false,
    weightPerUnit: 0.395,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat1", name: "Armatura", slug: "armatura", order: 1 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "armatura-d10-a400": {
    id: "2",
    categoryId: "cat1",
    name: "Armatura D10 A400",
    slug: "armatura-d10-a400",
    description:
      "Diametri 10mm bo'lgan A400 markali po'lat armatura. Qurilish poydevori, pol plitasi va devor konstruktsiyalarida keng qo'llaniladi. Yuqori korroziyaga chidamliligi va mustahkamligi bilan ajralib turadi. GOST 5781-82 standartiga mos.",
    price: 8000,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop",
    ],
    stock: 4000,
    isPopular: true,
    weightPerUnit: 0.617,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat1", name: "Armatura", slug: "armatura", order: 1 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "armatura-d12-a400": {
    id: "3",
    categoryId: "cat1",
    name: "Armatura D12 A400",
    slug: "armatura-d12-a400",
    description:
      "Diametri 12mm bo'lgan A400 markali po'lat armatura. Qurilish poydevorida, plitalar va devor konstruktsiyalarida keng qo'llaniladi. GOST 5781-82 standartiga mos. Eng ko'p ishlatiladigan armatura turi — qurilishda universal yechim.",
    price: 8200,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop",
    ],
    stock: 6000,
    isPopular: true,
    weightPerUnit: 0.888,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat1", name: "Armatura", slug: "armatura", order: 1 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "list-temir-2mm": {
    id: "4",
    categoryId: "cat2",
    name: "List temir 2mm",
    slug: "list-temir-2mm",
    description:
      "Qalinligi 2mm bo'lgan yassi list temir. O'lchami 1.5×6 metr. Metall konstruktsiyalar, to'siq va qoplamalar yasashda qo'llaniladi. Sirt silliq, birxil qalinlikda. GOST 19903-74 standartiga muvofiq.",
    price: 11500,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=600&fit=crop",
    ],
    stock: 2000,
    isPopular: false,
    weightPerUnit: 15.7,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat2", name: "List temir", slug: "list-temir", order: 2 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "list-temir-3mm": {
    id: "5",
    categoryId: "cat2",
    name: "List temir 3mm",
    slug: "list-temir-3mm",
    description:
      "Qalinligi 3mm bo'lgan yassi list temir. O'lchami 1.5×6 metr. Og'irroq konstruktsiyalar, mashina va mexanizm qismlari, zamin qoplamalari uchun mos. Sirt silliq, birxil qalinlikda. GOST 19903-74 standartiga muvofiq.",
    price: 12500,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=600&fit=crop",
    ],
    stock: 1500,
    isPopular: true,
    weightPerUnit: 23.6,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat2", name: "List temir", slug: "list-temir", order: 2 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "profil-quvur-20x20x2": {
    id: "6",
    categoryId: "cat3",
    name: "Profil quvur 20×20×2",
    slug: "profil-quvur-20x20x2",
    description:
      "Kvadrat kesimli profil quvur, o'lchami 20×20mm, devor qalinligi 2mm. Yengil metall konstruktsiyalar, mebel karkasi, panjara va to'siqlar uchun mos. Uzunligi 6 metr. GOST 8639-82 standartiga muvofiq.",
    price: 9200,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    ],
    stock: 3000,
    isPopular: false,
    weightPerUnit: 1.12,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat3", name: "Profil quvur", slug: "profil-quvur", order: 3 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "profil-quvur-40x40x2": {
    id: "7",
    categoryId: "cat3",
    name: "Profil quvur 40×40×2",
    slug: "profil-quvur-40x40x2",
    description:
      "Kvadrat kesimli profil quvur, o'lchami 40×40mm, devor qalinligi 2mm. O'rta va og'ir metall konstruktsiyalar, ustun va to'sinlar uchun mos. Uzunligi 6 metr. Eng ko'p ishlatiladigan profil quvur turi. GOST 8639-82 standartiga muvofiq.",
    price: 9800,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    ],
    stock: 2500,
    isPopular: true,
    weightPerUnit: 2.34,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat3", name: "Profil quvur", slug: "profil-quvur", order: 3 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },

  "burchak-40x40x4": {
    id: "8",
    categoryId: "cat4",
    name: "Burchak 40×40×4",
    slug: "burchak-40x40x4",
    description:
      "Teng yoqli burchak profil, qirralari 40×40mm, qalinligi 4mm. Metall konstruktsiyalar, pol va devor karkasi, ferma va panjaralarda ishlatiladi. Uzunligi 6 metr. GOST 8509-93 standartiga muvofiq.",
    price: 9900,
    unit: "kg",
    imageUrls: [
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565793979465-a694a6d1e8a8?w=600&h=600&fit=crop",
    ],
    stock: 1800,
    isPopular: false,
    weightPerUnit: 2.42,
    metalTypeId: "mt1",
    createdAt: new Date().toISOString(),
    category: { id: "cat4", name: "Burchak", slug: "burchak", order: 4 },
    metalType: { id: "mt1", name: "Po'lat", densityCoefficient: 7850 },
  },
};

export const productsList = Object.values(allProducts);
