import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "general" | "order" | "product" | "blog" | "support";
  isRead: boolean;
  userId?: string;
  createdAt: string;
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (data: Omit<AppNotification, "id" | "isRead" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "n1",
          title: "Yangi mahsulotlar keldi!",
          message: "Do'konimizga yangi armatura D16 A500 va profil quvurlar qo'shildi.",
          type: "product",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "n2",
          title: "Buyurtmangiz holati o'zgardi",
          message: "ORD-002 buyurtmangiz 'Tayyorlanmoqda' holatiga o'tdi.",
          type: "order",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ],

      addNotification: (data) => {
        set((state) => ({
          notifications: [
            {
              ...data,
              id: "n-" + Date.now(),
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        }));
      },

      markRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    { name: "fmi-notifications" }
  )
);
