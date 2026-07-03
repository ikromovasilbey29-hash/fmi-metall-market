"use client";

import { Heart, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

export default function FavoritesPage() {
  const { items, removeItem } = useFavoriteStore();
  const addToCart = useCartStore((s) => s.addItem);
  const t = useT();

  if (items.length === 0) {
    return (
      <div className="container-main py-8">
        <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
          <Heart size={28} className="text-accent-gold" />
          <span className="gold-text">{t.favorites.title}</span>
        </h1>
        <div className="card p-16 text-center">
          <Heart size={64} className="text-text-muted opacity-30 mx-auto mb-4" />
          <p className="text-text-secondary mb-2">{t.favorites.empty}</p>
          <p className="text-text-muted text-sm mb-6">{t.favorites.emptyDesc}</p>
          <Link href="/catalog" className="btn-primary">{t.favorites.toCatalog}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
        <Heart size={28} className="text-accent-gold" />
        <span className="gold-text">{t.favorites.title}</span>
        <span className="text-text-muted text-xl font-normal">({items.length})</span>
      </h1>

      <div className="product-grid">
        {items.map((product) => (
          <div key={product.id} className="card overflow-hidden group hover:border-accent-gold/30 transition-all duration-300">
            <Link href={`/product/${product.slug}`}>
              <div className="aspect-square overflow-hidden bg-bg-panel">
                {product.imageUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-text-muted opacity-30" />
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.slug}`} className="font-semibold text-text-primary hover:text-accent-gold transition-colors text-sm line-clamp-2 mb-2 block">
                {product.name}
              </Link>
              <p className="text-accent-gold font-bold mb-3">{formatPrice(product.price)}/{product.unit}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { addToCart(product, 1); toast.success(`${product.name} ${t.product.addToCart}`); }}
                  className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={14} />
                  {t.cart.checkout.split(" ")[0]}
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 rounded-lg border border-border hover:border-red-400/40 hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                  title={t.favorites.remove}
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
