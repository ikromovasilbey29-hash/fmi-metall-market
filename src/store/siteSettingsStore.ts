import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SiteSettings {
  // Aloqa
  phone1: string;
  phone2: string;
  email: string;
  // Manzil
  address: string;
  workWeek: string;
  workSunday: string;
  // Ijtimoiy tarmoqlar
  telegram: string;
  instagram: string;
  facebook: string;
  // Admin
  adminPassword: string;
}

interface SiteSettingsStore {
  settings: SiteSettings;
  updateSettings: (data: Partial<SiteSettings>) => void;
}

export const useSiteSettingsStore = create<SiteSettingsStore>()(
  persist(
    (set) => ({
      settings: {
        phone1: "+998 91 234 56 78",
        phone2: "+998 93 456 78 90",
        email: "info@fmimetall.uz",
        address: "Buxoro viloyati, G'ijduvon tumani, Markaziy ko'cha",
        workWeek: "08:00 – 18:00",
        workSunday: "09:00 – 15:00",
        telegram: "https://t.me/fmimetall",
        instagram: "https://instagram.com/fmimetall",
        facebook: "",
        adminPassword: "",
      },
      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),
    }),
    { name: "fmi-site-settings" }
  )
);
