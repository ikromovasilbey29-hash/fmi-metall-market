/* Buyurtmalar — localStorage asosidagi umumiy ma'lumot manbai.
   Checkout, Admin/Orders va Profile/Orders shu yerdan o'qiydi/yozadi. */

export type OrderStatus = "NEW" | "PROCESSING" | "DELIVERING" | "DELIVERED" | "CANCELLED";
export type PaymentType = "CASH" | "CARD" | "BANK_TRANSFER";

export interface OrderItemRecord {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface OrderRecord {
  id: string;
  userEmail: string;       // buyurtma bergan foydalanuvchi (yoki "guest")
  fullName: string;
  phone: string;
  email: string;
  address: string;
  paymentType: PaymentType;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemRecord[];
  createdAt: string;       // ISO sana
}

export const LS_KEY = "fmi_orders";

const SEED: OrderRecord[] = [
  {
    id: "ORD-001", userEmail: "demo@fmimetall.uz", fullName: "Alisher Karimov", phone: "+998 91 234 56 78", email: "demo@fmimetall.uz",
    address: "G'ijduvon tumani, Markaziy ko'cha 12", paymentType: "CASH", status: "NEW", totalPrice: 2450000,
    items: [{ productId: "1", name: "Armatura D12", quantity: 300, price: 8200, unit: "kg" }],
    createdAt: "2026-06-28T09:00:00.000Z",
  },
  {
    id: "ORD-002", userEmail: "demo@fmimetall.uz", fullName: "Bobur Toshmatov", phone: "+998 93 345 67 89", email: "demo@fmimetall.uz",
    address: "Buxoro sh., Navoiy ko'cha 45", paymentType: "CARD", status: "PROCESSING", totalPrice: 5800000,
    items: [{ productId: "2", name: "List temir 3mm", quantity: 460, price: 12500, unit: "kg" }],
    createdAt: "2026-06-28T11:30:00.000Z",
  },
  {
    id: "ORD-003", userEmail: "demo@fmimetall.uz", fullName: "Kamola Yusupova", phone: "+998 90 456 78 90", email: "demo@fmimetall.uz",
    address: "G'ijduvon, Bog'ishamol mahallasi", paymentType: "CASH", status: "DELIVERING", totalPrice: 1200000,
    items: [{ productId: "3", name: "Profil quvur", quantity: 130, price: 9200, unit: "kg" }],
    createdAt: "2026-06-27T14:15:00.000Z",
  },
  {
    id: "ORD-004", userEmail: "demo@fmimetall.uz", fullName: "Nodir Rahimov", phone: "+998 99 567 89 01", email: "demo@fmimetall.uz",
    address: "Kogon sh., Mustaqillik ko'cha 7", paymentType: "BANK_TRANSFER", status: "DELIVERED", totalPrice: 8900000,
    items: [{ productId: "4", name: "Burchak 40x40x4", quantity: 900, price: 9900, unit: "kg" }],
    createdAt: "2026-06-26T08:45:00.000Z",
  },
  {
    id: "ORD-005", userEmail: "demo@fmimetall.uz", fullName: "Dilnoza Umarova", phone: "+998 94 678 90 12", email: "demo@fmimetall.uz",
    address: "G'ijduvon, Yangi hayot ko'cha 3", paymentType: "CASH", status: "CANCELLED", totalPrice: 3400000,
    items: [{ productId: "5", name: "List temir 2mm", quantity: 295, price: 11500, unit: "kg" }],
    createdAt: "2026-06-25T16:20:00.000Z",
  },
];

export function lsLoad(): OrderRecord[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

export function lsSave(orders: OrderRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new StorageEvent("storage", { key: LS_KEY }));
}

export function uid(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FMI-${timestamp}-${random}`;
}

/** Yangi buyurtma qo'shadi va uni qaytaradi */
export function addOrder(data: Omit<OrderRecord, "id" | "status" | "createdAt">): OrderRecord {
  const order: OrderRecord = {
    ...data,
    id: uid(),
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  const all = lsLoad();
  lsSave([order, ...all]);
  return order;
}

/** Buyurtma holatini yangilaydi */
export function updateOrderStatus(id: string, status: OrderStatus) {
  const all = lsLoad();
  const updated = all.map((o) => (o.id === id ? { ...o, status } : o));
  lsSave(updated);
  return updated;
}

/** Foydalanuvchi bo'yicha buyurtmalar */
export function getOrdersByUser(userEmail: string): OrderRecord[] {
  return lsLoad().filter((o) => o.userEmail === userEmail);
}
