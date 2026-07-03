import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  updateUser: (data: Partial<UserData>) => void;
  clearUser: () => void;
  isLoggedIn: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      clearUser: () => set({ user: null }),

      isLoggedIn: () => !!get().user,
    }),
    { name: "fmi-user" }
  )
);
