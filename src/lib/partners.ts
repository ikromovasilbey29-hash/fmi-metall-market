export type PartnerType   = "SUPPLIER" | "BUYER" | "BOTH";
export type PartnerStatus = "ACTIVE" | "INACTIVE";

export interface Transaction {
  id: string;
  partnerId: string;
  type: "RECEIVED" | "SENT";
  productName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  date: string;
  note?: string | null;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  description?: string | null;
  partnerSince: string;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
}

import type { Translations } from "./i18n/uz";

export function getTypeConfig(t: Translations): Record<PartnerType, { label: string; color: string; bg: string; border: string }> {
  return {
    SUPPLIER: { label: t.adminPartners.typeSupplier, color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/25" },
    BUYER:    { label: t.adminPartners.typeBuyer,    color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/25" },
    BOTH:     { label: t.adminPartners.typeBoth,     color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/25" },
  };
}

export function getStatusCfg(t: Translations): Record<PartnerStatus, { label: string; dot: string }> {
  return {
    ACTIVE:   { label: t.adminPartners.statusActive,   dot: "bg-green-400" },
    INACTIVE: { label: t.adminPartners.statusInactive, dot: "bg-gray-500"  },
  };
}

export const LS_KEY = "fmi_partners";

export function lsLoad(): Partner[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
export function lsSave(d: Partner[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(d));
}
export function uid() {
  return "p-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

export const totalReceived = (p: Partner) =>
  p.transactions.filter(t => t.type === "RECEIVED").reduce((s, t) => s + t.totalPrice, 0);
export const totalSent = (p: Partner) =>
  p.transactions.filter(t => t.type === "SENT").reduce((s, t) => s + t.totalPrice, 0);

export const EMPTY_PARTNER = {
  name: "", type: "SUPPLIER" as PartnerType, status: "ACTIVE" as PartnerStatus,
  phone: "", email: "", website: "", address: "",
  contactPerson: "", description: "",
  partnerSince: new Date().toISOString().split("T")[0],
};

export const EMPTY_TX = {
  type: "RECEIVED" as "RECEIVED" | "SENT",
  productName: "", quantity: "", unit: "tonna",
  totalPrice: "", date: new Date().toISOString().split("T")[0], note: "",
};
