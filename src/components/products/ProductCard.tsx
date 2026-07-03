"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, BarChart2, ShoppingCart, Package, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

interface ProductCardProps {
  product: Product;
}

// Slugdan qisqa texnik ma'lumot chiqarish
function getQuickSpecs(product: Product, t: ReturnType<typeof useT>): { label: string; value: string }[] {
  const L = t.product.specLabels;
  const slug = product.slug;
  const specs: { label: string; value: string }[] = [];

  if (slug.includes("armatura")) {
    const d = slug.match(/d(\d+)/i);
    if (d) specs.push({ label: L.diameter, value: `${d[1]} mm` });
    specs.push({ label: L.length, value: "6 m" });
    specs.push({ label: L.grade, value: slug.includes("a500") ? "A500" : "A400" });
  } else if (slug.includes("list-temir")) {
    const m = slug.match(/(\d+)mm/);
    if (m) specs.push({ label: L.thickness, value: `${m[1]} mm` });
    specs.push({ label: L.size, value: "1.5×6 m" });
    specs.push({ label: L.standard, value: "GOST" });
  } else if (slug.includes("profil-quvur")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    if (s) {
      specs.push({ label: L.section, value: `${s[1]}×${s[2]} mm` });
      specs.push({ label: L.wallThickness, value: `${s[3]} mm` });
    }
    specs.push({ label: L.length, value: "6 m" });
  } else if (slug.includes("burchak")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    if (s) {
      specs.push({ label: L.edges, value: `${s[1]}×${s[2]} mm` });
      specs.push({ label: L.thickness, value: `${s[3]} mm` });
    }
    specs.push({ label: L.length, value: "6 m" });
  }

  return specs.slice(0, 3);
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const { toggleItem, isInFavorites } = useFavoriteStore();
  const t = useT();

  const inCompare = isInCompare(product.id);
  const inFavorites = isInFavorites(product.id);
  const hasImage = product.imageUrls.length > 0 && !imgError;
  const inStock = product.stock > 0;
  const specs = getQuickSpecs(product, t);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} ${t.product.addToCart}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCompare(product);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="card group flex flex-col overflow-hidden hover:border-accent-gold/40 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Rasm */}
      <div className="relative overflow-hidden bg-bg-panel aspect-[4/3]">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              !inStock && "grayscale opacity-50"
            )}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-text-muted opacity-40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isPopular && (
            <span className="bg-accent-gold text-bg-primary text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Star size={10} className="fill-current" /> {t.product.popular}
            </span>
          )}
          {!inStock && (
            <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              {t.product.outOfStockBadge}
            </span>
          )}
        </div>

        {/* Hover tugmalar */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
              inFavorites
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-bg-primary/80 border-border text-text-muted hover:text-red-400 hover:border-red-400/40"
            )}
            title={t.product.addToFavorites}
          >
            <Heart size={14} fill={inFavorites ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleAddToCompare}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
              inCompare
                ? "bg-accent-gold/20 border-accent-gold/40 text-accent-gold"
                : "bg-bg-primary/80 border-border text-text-muted hover:text-accent-gold hover:border-accent-gold/40"
            )}
            title={t.product.addToCompare}
          >
            <BarChart2 size={14} />
          </button>
        </div>
      </div>

      {/* Kontent */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {/* Kategoriya */}
        <p className="text-text-muted text-xs">{product.category?.name || t.common.category}</p>

        {/* Nom */}
        <h3
          className={cn(
            "font-bold text-sm leading-snug transition-colors line-clamp-2",
            inStock
              ? "text-text-primary group-hover:text-accent-gold"
              : "text-text-muted line-through decoration-2"
          )}
        >
          {product.name}
        </h3>

        {/* Texnik xususiyatlar */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specs.map((spec) => (
              <span
                key={spec.label}
                className="inline-flex items-center gap-1 bg-bg-panel border border-border text-text-secondary text-xs px-2 py-0.5 rounded-md"
              >
                <span className="text-text-muted">{spec.label}:</span>
                <span className="font-medium text-text-primary">{spec.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Qisqa tavsif */}
        {product.description && (
          <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Narx + mavjudlik */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <p
              className={cn(
                "font-black text-lg leading-none",
                inStock ? "text-accent-gold" : "text-text-muted line-through decoration-2"
              )}
            >
              {formatPrice(product.price)}
            </p>
            <p className="text-text-muted text-xs mt-0.5">/ {product.unit}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                inStock
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              )}
            >
              {inStock ? t.product.inStock : t.product.outOfStock}
            </span>
            {inStock && (
              <span className="text-text-muted text-xs">
                {product.stock.toLocaleString()} {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Tugma */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2 mt-1"
        >
          <ShoppingCart size={15} />
          {inStock ? t.product.buyNow : t.product.outOfStock}
        </button>
      </div>
    </Link>
  );
}
