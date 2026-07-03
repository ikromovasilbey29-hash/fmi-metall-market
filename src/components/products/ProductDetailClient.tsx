"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  BarChart2,
  Calculator,
  Plus,
  Minus,
  Package,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import ProductReviews from "@/components/products/ProductReviews";
import { useT } from "@/hooks/useT";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const t = useT();

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const { toggleItem, isInFavorites } = useFavoriteStore();

  const inFav = isInFavorites(product.id);
  const inCompare = isInCompare(product.id);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty} × ${product.name} savatga qo'shildi`);
  };

  // Texnik xususiyatlar slug dan ajratib olish
  const specs = getSpecsFromProduct(product, t);

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/catalog" className="flex items-center gap-1.5 text-text-muted hover:text-accent-gold transition-colors">
          <ChevronLeft size={16} />
          {t.product.breadcrumbCatalog}
        </Link>
        <span className="text-border-light">/</span>
        <Link
          href={`/catalog?category=${product.category?.name}`}
          className="text-text-muted hover:text-accent-gold transition-colors"
        >
          {product.category?.name}
        </Link>
        <span className="text-border-light">/</span>
        <span className="text-text-secondary truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* ===== CHAP: Rasmlar ===== */}
        <div>
          {/* Asosiy rasm */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-bg-card border border-border mb-3 relative">
            {product.imageUrls[activeImg] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrls[activeImg]}
                alt={product.name}
                className={cn("w-full h-full object-cover", !inStock && "grayscale opacity-50")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={80} className="text-text-muted opacity-30" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isPopular && (
                <span className="bg-accent-gold text-bg-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-current" /> {t.product.popular}
                </span>
              )}
              {!inStock && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t.product.outOfStockBadge}
                </span>
              )}
            </div>
          </div>

          {/* Kichik rasmlar */}
          {product.imageUrls.length > 1 && (
            <div className="flex gap-3">
              {product.imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                    i === activeImg
                      ? "border-accent-gold shadow-glow"
                      : "border-border hover:border-border-light"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Qo'shimcha ma'lumot kartochkalari */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, label: t.product.quickDelivery, sub: t.product.region },
              { icon: Shield, label: t.product.qualityGuar, sub: t.product.certified },
              { icon: CheckCircle2, label: t.product.original, sub: t.product.gostStandard },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="card p-3 text-center">
                  <Icon size={20} className="text-accent-gold mx-auto mb-1" />
                  <p className="text-text-primary text-xs font-medium">{item.label}</p>
                  <p className="text-text-muted text-xs">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== O'NG: Ma'lumot ===== */}
        <div className="flex flex-col gap-5">
          {/* Kategoriya va nom */}
          <div>
            <Link
              href={`/catalog?category=${product.category?.name}`}
              className="text-accent-gold text-sm font-medium hover:underline"
            >
              {product.category?.name}
            </Link>
            <h1
              className={cn(
                "text-3xl font-black mt-1 leading-tight",
                inStock ? "text-text-primary" : "text-text-muted line-through decoration-2"
              )}
            >
              {product.name}
            </h1>
          </div>

          {/* Narx va mavjudlik */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm mb-0.5">{t.common.price}</p>
              <p className={cn("text-4xl font-black", inStock ? "gold-text" : "text-text-muted line-through decoration-2")}>
                {formatPrice(product.price)}
              </p>
              <p className="text-text-muted text-sm">1 {product.unit} {t.product.perUnit}</p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border",
                  inStock
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                )}
              >
                {inStock ? (
                  <><CheckCircle2 size={14} /> {t.product.inStock}</>
                ) : (
                  <><XCircle size={14} /> {t.product.outOfStockBadge}</>
                )}
              </div>
              {inStock && (
                <p className="text-text-muted text-xs mt-1">
                  {product.stock.toLocaleString()} {product.unit} {t.product.stock}
                </p>
              )}
            </div>
          </div>

          {/* Tavsif */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-text-primary mb-2">{t.product.productAbout}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {product.description}
              </p>
            </div>
          )}

          {/* Texnik xususiyatlar */}
          {specs.length > 0 && (
            <div>
              <h3 className="font-semibold text-text-primary mb-3">{t.product.specs}</h3>
              <div className="grid grid-cols-2 gap-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-bg-panel rounded-xl p-3 flex flex-col gap-0.5">
                    <p className="text-text-muted text-xs">{spec.label}</p>
                    <p className="text-text-primary text-sm font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Miqdor tanlash */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">{t.product.quantityLabel} ({product.unit})</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-bg-card">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-bg-panel text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock || undefined}
                  value={qty}
                  onChange={(e) => setQty(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock || 1))}
                  className="w-16 text-center font-bold text-text-primary bg-transparent outline-none text-lg"
                />
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="w-12 h-12 flex items-center justify-center hover:bg-bg-panel text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="text-text-muted text-sm">
                {t.product.totalLabel}{" "}
                <span className="text-accent-gold font-bold text-base">
                  {formatPrice(product.price * qty)}
                </span>
              </div>
            </div>
            {inStock && (
              <p className="text-text-muted text-xs mt-2">
                {product.stock.toLocaleString()} {product.unit} {t.product.stock}
              </p>
            )}
          </div>

          {/* Asosiy tugma */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            {inStock ? t.product.addToCart : t.product.outOfStock}
          </button>

          {/* Qo'shimcha tugmalar */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toggleItem(product)}
              className={cn(
                "py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all",
                inFav
                  ? "border-red-400/40 bg-red-500/10 text-red-400"
                  : "border-border hover:border-red-400/40 text-text-secondary hover:text-red-400"
              )}
            >
              <Heart size={16} fill={inFav ? "currentColor" : "none"} />
              {inFav ? t.product.inFavorites : t.product.addToFavorites}
            </button>
            <button
              onClick={() => addToCompare(product)}
              className={cn(
                "py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all",
                inCompare
                  ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                  : "border-border hover:border-accent-gold/40 text-text-secondary hover:text-accent-gold"
              )}
            >
              <BarChart2 size={16} />
              {inCompare ? t.product.inCompare : t.product.addToCompare}
            </button>
          </div>

          {/* Kalkulyator havolasi */}
          {product.metalType && (
            <Link
              href="/calculator"
              className="flex items-center gap-2 p-4 bg-accent-gold/5 border border-accent-gold/20 rounded-xl text-accent-gold hover:bg-accent-gold/10 transition-colors group"
            >
              <Calculator size={18} />
              <div>
                <p className="text-sm font-semibold">{t.product.calculatorLink}</p>
                <p className="text-xs text-accent-gold/70">
                  {t.product.calculatorLinkSub}
                </p>
              </div>
              <ChevronLeft size={16} className="ml-auto rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Mijozlar fikrlari va baholari */}
      <ProductReviews product={product} />

      {/* O'xshash mahsulotlar */}
      <RelatedProducts currentId={product.id} categoryName={product.category?.name} />
    </div>
  );
}

// Slugdan texnik xususiyatlar chiqarish
function getSpecsFromProduct(product: Product, t: ReturnType<typeof useT>) {
  const L = t.product.specLabels;
  const specs: { label: string; value: string }[] = [];

  if (product.metalType) {
    specs.push({ label: L.material, value: product.metalType.name });
    specs.push({ label: L.density, value: `${product.metalType.densityCoefficient} kg/m³` });
  }
  if (product.weightPerUnit) {
    specs.push({ label: L.weightPerUnit, value: `${product.weightPerUnit} kg` });
  }
  specs.push({ label: L.unit, value: product.unit });
  specs.push({ label: L.standard, value: L.standardValue });

  // Slugdan qo'shimcha ma'lumot
  const slug = product.slug;
  if (slug.includes("armatura")) {
    const d = slug.match(/d(\d+)/i);
    if (d) specs.push({ label: L.diameter, value: `${d[1]} mm` });
    specs.push({ label: L.length, value: "6 metr" });
    specs.push({ label: L.grade, value: slug.includes("a500") ? "A500" : "A400" });
  }
  if (slug.includes("list-temir") || slug.includes("list")) {
    const m = slug.match(/(\d+)mm/);
    if (m) specs.push({ label: L.thickness, value: `${m[1]} mm` });
    specs.push({ label: L.size, value: "1.5 × 6 metr" });
  }
  if (slug.includes("profil-quvur") || slug.includes("quvur")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    if (s) {
      specs.push({ label: L.section, value: `${s[1]}×${s[2]} mm` });
      specs.push({ label: L.wallThickness, value: `${s[3]} mm` });
    }
    specs.push({ label: L.length, value: "6 metr" });
  }
  if (slug.includes("burchak")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    if (s) {
      specs.push({ label: L.edges, value: `${s[1]}×${s[2]} mm` });
      specs.push({ label: L.thickness, value: `${s[3]} mm` });
    }
    specs.push({ label: L.length, value: "6 metr" });
  }

  return specs;
}

// O'xshash mahsulotlar komponenti
function RelatedProducts({
  currentId,
  categoryName,
}: {
  currentId: string;
  categoryName?: string;
}) {
  const [related, setRelated] = useState<Product[]>([]);
  const t = useT();

  useEffect(() => {
    import("@/lib/product-store").then(({ getAllProducts }) => {
      const all = getAllProducts();
      const filtered = all
        .filter((p) => p.id !== currentId && p.category?.name === categoryName)
        .slice(0, 4);
      setRelated(filtered);
    });
  }, [currentId, categoryName]);

  if (related.length === 0) return null;

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-black text-text-primary mb-6">
        {t.product.relatedProducts} <span className="gold-text">{t.product.relatedHighlight}</span>
      </h2>
      <div className="product-grid">
        {related.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
