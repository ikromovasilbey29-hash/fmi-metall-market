import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Debt {
  id: string;
  creditorName: string;     // Kompaniya yoki shaxs ismi
  creditorType: "company" | "person";
  phone: string;
  description: string;      // Qarz sababi
  totalAmount: number;      // Jami qarz summasi
  paidAmount: number;       // To'langan summa
  currency: "uzs";
  dueDate?: string;         // To'lash muddati
  status: "active" | "partial" | "paid";
  createdAt: string;
  payments: DebtPayment[];  // To'lovlar tarixi
}

export interface DebtPayment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

interface DebtStore {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "createdAt" | "paidAmount" | "status" | "payments">) => void;
  addPayment: (debtId: string, payment: Omit<DebtPayment, "id">) => void;
  deleteDebt: (id: string) => void;
  getRemainingAmount: (debt: Debt) => number;
  getPercentPaid: (debt: Debt) => number;
}

const initialDebts: Debt[] = [
  {
    id: "d1",
    creditorName: "Toshkent Metall Zavodi",
    creditorType: "company",
    phone: "+998 71 123 45 67",
    description: "Armatura D12 partiyasi uchun qarz",
    totalAmount: 50000000,
    paidAmount: 20000000,
    currency: "uzs",
    dueDate: "2026-08-01",
    status: "partial",
    createdAt: "2026-06-01",
    payments: [
      { id: "p1", amount: 10000000, date: "2026-06-10", note: "Birinchi to'lov" },
      { id: "p2", amount: 10000000, date: "2026-06-25", note: "Ikkinchi to'lov" },
    ],
  },
  {
    id: "d2",
    creditorName: "Abdullayev Behruz",
    creditorType: "person",
    phone: "+998 90 987 65 43",
    description: "Quvur materiallari uchun shaxsiy qarz",
    totalAmount: 15000000,
    paidAmount: 0,
    currency: "uzs",
    dueDate: "2026-07-15",
    status: "active",
    createdAt: "2026-06-15",
    payments: [],
  },
];

export const useDebtStore = create<DebtStore>()(
  persist(
    (set, get) => ({
      debts: initialDebts,

      addDebt: (debt) => {
        set((s) => ({
          debts: [
            {
              ...debt,
              id: "d-" + Date.now(),
              paidAmount: 0,
              status: "active",
              payments: [],
              createdAt: new Date().toISOString().split("T")[0],
            },
            ...s.debts,
          ],
        }));
      },

      addPayment: (debtId, payment) => {
        set((s) => ({
          debts: s.debts.map((d) => {
            if (d.id !== debtId) return d;
            const newPaid = d.paidAmount + payment.amount;
            const newPayment: DebtPayment = { ...payment, id: "pay-" + Date.now() };
            const status: Debt["status"] =
              newPaid >= d.totalAmount ? "paid" : newPaid > 0 ? "partial" : "active";
            return { ...d, paidAmount: newPaid, status, payments: [...d.payments, newPayment] };
          }),
        }));
      },

      deleteDebt: (id) => set((s) => ({ debts: s.debts.filter((d) => d.id !== id) })),

      getRemainingAmount: (debt) => Math.max(0, debt.totalAmount - debt.paidAmount),

      getPercentPaid: (debt) =>
        debt.totalAmount > 0 ? Math.min(100, Math.round((debt.paidAmount / debt.totalAmount) * 100)) : 0,
    }),
    { name: "fmi-debts" }
  )
);
