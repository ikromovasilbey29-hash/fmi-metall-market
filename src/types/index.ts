export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  order: number;
  _count?: { products: number };
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  unit: string;
  imageUrls: string[];
  stock: number;
  isPopular: boolean;
  weightPerUnit?: number;
  metalTypeId?: string;
  metalType?: MetalType;
  category?: Category;
  createdAt: string;
}

export interface MetalType {
  id: string;
  name: string;
  densityCoefficient: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  paymentType: "CASH" | "CARD" | "BANK_TRANSFER";
  status: "NEW" | "PROCESSING" | "DELIVERING" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  phone: string[];
  address: string;
  workHours: string;
  email?: string;
  telegram?: string;
  instagram?: string;
  facebook?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Calculator types
export type MetalShape = "armature" | "pipe" | "sheet" | "angle" | "profile";

export interface CalculatorResult {
  weight: number;
  totalPrice: number;
  pricePerKg: number;
}
