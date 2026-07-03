"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { getProductBySlug } from "@/lib/product-store";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function ProductDetailWrapper({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const t = useT();

  useEffect(() => {
    const found = getProductBySlug(slug) ?? null;
    setProduct(found);
  }, [slug]);

  // Yuklanmoqda
  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={36} className="text-accent-gold animate-spin" />
      </div>
    );
  }

  // Topilmadi
  if (product === null) {
    return (
      <div className="container-main py-16 text-center">
        <p className="text-text-secondary text-xl mb-4">{t.product.notFound}</p>
        <a href="/catalog" className="btn-primary inline-block">{t.product.backToCatalog}</a>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
