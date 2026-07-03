import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " so'm";
}

export function formatWeight(weight: number): string {
  if (weight >= 1000) {
    return (weight / 1000).toFixed(2) + " tonna";
  }
  return weight.toFixed(2) + " kg";
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NEW: "Yangi",
    PROCESSING: "Tayyorlanmoqda",
    DELIVERING: "Yetkazilmoqda",
    DELIVERED: "Yetkazildi",
    CANCELLED: "Bekor qilindi",
  };
  return labels[status] || status;
}

export function getOrderStatusClass(status: string): string {
  const classes: Record<string, string> = {
    NEW: "status-new",
    PROCESSING: "status-processing",
    DELIVERING: "status-delivering",
    DELIVERED: "status-delivered",
    CANCELLED: "status-cancelled",
  };
  return classes[status] || "";
}

// O'zbek telefon raqami formatlash: +998 XX XXX XX XX
export function formatPhoneNumber(value: string): string {
  // Faqat raqamlarni olish
  const digits = value.replace(/\D/g, "");

  // 998 bilan boshlanmasa qo'shamiz
  let d = digits;
  if (d.startsWith("998")) {
    d = d;
  } else if (d.startsWith("0")) {
    d = "998" + d.slice(1);
  } else if (d.length > 0 && !d.startsWith("998")) {
    d = "998" + d;
  }

  // Maksimal 12 ta raqam (998 + 9 ta)
  d = d.slice(0, 12);

  // Formatlash: +998 XX XXX XX XX
  if (d.length <= 3) return d.length ? "+" + d : "";
  if (d.length <= 5) return `+${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
  if (d.length <= 10) return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FMI-${timestamp}-${random}`;
}

// Metall og'irlik hisoblash formulalari
export function calculateMetalWeight(params: {
  type: "armature" | "pipe" | "sheet" | "angle" | "profile";
  density: number; // kg/m³
  dimensions: Record<string, number>;
}): number {
  const { type, density, dimensions } = params;

  switch (type) {
    case "armature": {
      // V = π * (d/2)² * L * n
      const d = dimensions.diameter / 1000; // mm -> m
      const L = dimensions.length;
      const n = dimensions.count || 1;
      const volume = Math.PI * Math.pow(d / 2, 2) * L * n;
      return volume * density;
    }
    case "pipe": {
      // V = π * ((D/2)² - (d/2)²) * L * n
      const D = dimensions.outerDiameter / 1000;
      const d = (dimensions.outerDiameter - 2 * dimensions.wallThickness) / 1000;
      const L = dimensions.length;
      const n = dimensions.count || 1;
      const volume = Math.PI * (Math.pow(D / 2, 2) - Math.pow(d / 2, 2)) * L * n;
      return volume * density;
    }
    case "sheet": {
      // V = L * W * t
      const L = dimensions.length;
      const W = dimensions.width;
      const t = dimensions.thickness / 1000;
      const volume = L * W * t;
      return volume * density;
    }
    case "angle": {
      // Taxminiy hisoblash: (a + b - t) * t * L * n
      const a = dimensions.side1 / 1000;
      const b = dimensions.side2 / 1000;
      const t = dimensions.thickness / 1000;
      const L = dimensions.length;
      const n = dimensions.count || 1;
      const volume = (a + b - t) * t * L * n;
      return volume * density;
    }
    case "profile": {
      // Taxminiy: (2*h + 2*b - 4*t) * t * L * n
      const h = dimensions.height / 1000;
      const b = dimensions.width / 1000;
      const t = dimensions.thickness / 1000;
      const L = dimensions.length;
      const n = dimensions.count || 1;
      const volume = (2 * h + 2 * b - 4 * t) * t * L * n;
      return volume * density;
    }
    default:
      return 0;
  }
}
