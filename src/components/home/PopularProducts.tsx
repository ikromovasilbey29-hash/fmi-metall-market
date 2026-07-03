"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { usePopularProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";

export default function PopularProducts() {
  const { products, loading } = usePopularProducts();
  const t = useT();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">
            {t.home.popularProducts.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gold-text">{t.home.popularProducts.split(" ").at(-1)}</span>
          </h2>
          <p className="text-text-muted text-sm mt-1">{t.home.popularProductsDesc}</p>
        </div>
        <Link href="/catalog" className="flex items-center gap-1.5 text-accent-gold hover:text-accent-gold-hover text-sm font-medium transition-colors">
          {t.home.viewAll} <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="text-accent-gold animate-spin" /></div>
      ) : products.length === 0 ? (
        <p className="text-text-muted text-center py-12">{t.catalog.notFound}</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
