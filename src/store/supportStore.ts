import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SupportRequest {
  id: string;
  userId: string; // foydalanuvchi identifikatori (demo: email yoki "guest")
  userName: string;
  userPhone: string;
  subject: string; // mavzu
  message: string;
  status: "new" | "answered";
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

interface SupportStore {
  requests: SupportRequest[];
  // Mijoz tomonidan so'rov yuborish
  submitRequest: (data: Omit<SupportRequest, "id" | "status" | "createdAt">) => string;
  // Admin tomonidan javob yozish
  answerRequest: (id: string, answer: string) => void;
  // O'qilmagan so'rovlar soni (admin uchun)
  getUnreadCount: () => number;
}

export const useSupportStore = create<SupportStore>()(
  persist(
    (set, get) => ({
      requests: [
        {
          id: "req-1",
          userId: "user1",
          userName: "Alisher Karimov",
          userPhone: "+998 91 234 56 78",
          subject: "Buyurtma kelmadi",
          message: "Kecha buyurtma berdim ORD-001, lekin hali yetkazib berilmadi. Iltimos tekshirib ko'ring.",
          status: "new",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: "req-2",
          userId: "user2",
          userName: "Kamola Yusupova",
          userPhone: "+998 90 456 78 90",
          subject: "Narx haqida savol",
          message: "Armatura D16 uchun ulgurji narx bormi? 10 tonnadan ko'p olmoqchiman.",
          status: "answered",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          answer: "Salom Kamola! Ha, 10 tonnadan yuqori buyurtmalarda 5% chegirma beramiz. +998 91 000 00 00 raqamiga qo'ng'iroq qiling.",
          answeredAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        },
      ],

      submitRequest: (data) => {
        const id = "req-" + Date.now();
        set((state) => ({
          requests: [
            {
              ...data,
              id,
              status: "new",
              createdAt: new Date().toISOString(),
            },
            ...state.requests,
          ],
        }));
        return id;
      },

      answerRequest: (id, answer) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id
              ? { ...r, status: "answered", answer, answeredAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      getUnreadCount: () => {
        return get().requests.filter((r) => r.status === "new").length;
      },
    }),
    { name: "fmi-support-requests" }
  )
);
