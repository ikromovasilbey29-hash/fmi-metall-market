"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types";
import { getAllProducts, getPopularProducts } from "@/lib/product-store";

/**
 * Barcha mahsulotlar — admin panel bilan sinxron.
 * localStorage o'zgarganda avtomatik yangilanadi.
 */
export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setProducts(getAllProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // localStorage o'zgarishlarini kuzatamiz (boshqa tabdan ham)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fmi_admin_products") refresh();
    };

    // Sahifa focus bo'lganda ham yangilaymiz (admin → frontend tab almashtirish)
    const handleFocus = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refresh]);

  return { products, loading, refresh };
}

/** Faqat ommabop mahsulotlar */
export function usePopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(getPopularProducts());
    setLoading(false);
  }, []);

  return { products, loading };
}
