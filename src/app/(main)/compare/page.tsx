"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingCart, BarChart2, Package } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

export default function ComparePage() {
  const { items, removeItem, clearItems } = useCompareStore();
  const addToCart = useCartStore((s) => s.addItem);
  const t = useT();

  if (items.length === 0) {
    return (
      <div className="container-main py-8">
        <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
          <BarChart2 size={28} className="text-accent-gold" />
          {t.compare.title} <span className="gold-text">{t.compare.titleHighlight}</span>
        </h1>
        <div className="card p-16 text-center">
          <BarChart2 size={64} className="text-text-muted opacity-30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">{t.compare.empty}</h2>
          <p className="text-text-muted mb-6">{t.compare.emptyDesc}</p>
          <Link href="/catalog" className="btn-primary">{t.compare.toCatalog}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
          <BarChart2 size={28} className="text-accent-gold" />
          {t.compare.title} <span className="gold-text">{t.compare.titleHighlight}</span>
          <span className="text-text-muted text-xl font-normal">({items.length} {t.compare.count})</span>
        </h1>
        <button onClick={clearItems} className="text-text-muted hover:text-red-400 text-sm flex items-center gap-1.5 transition-colors">
          <X size={15} /> {t.compare.clear}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <td className="w-40 p-4 text-text-muted text-sm font-medium">{t.common.name}</td>
              {items.map((product) => (
                <td key={product.id} className="p-4 min-w-[200px]">
                  <div className="card p-3 relative">
                    <button onClick={() => removeItem(product.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-bg-panel hover:bg-red-500/20 flex items-center justify-center text-text-muted hover:text-red-400 transition-all">
                      <X size={12} />
                    </button>
                    {product.imageUrls[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-28 object-cover rounded-lg mb-2" />
                    ) : (
                      <div className="w-full h-28 bg-bg-panel rounded-lg mb-2 flex items-center justify-center">
                        <Package size={24} className="text-text-muted opacity-40" />
                      </div>
                    )}
                    <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-text-primary hover:text-accent-gold transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label={t.compare.price} highlight>
              {items.map((p) => (
                <td key={p.id} className="p-4">
                  <span className="text-accent-gold font-bold">{formatPrice(p.price)}</span>
                  <span className="text-text-muted text-xs">/{p.unit}</span>
                </td>
              ))}
            </CompareRow>
            <CompareRow label={t.compare.unit}>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-text-primary text-sm">{p.unit}</td>
              ))}
            </CompareRow>
            <CompareRow label={t.compare.stock} highlight>
              {items.map((p) => (
                <td key={p.id} className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${p.stock > 0 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {p.stock > 0 ? `${t.compare.inStock} (${p.stock} ${p.unit})` : t.compare.outOfStock}
                  </span>
                </td>
              ))}
            </CompareRow>
            <CompareRow label={t.compare.category}>
              {items.map((p) => (
                <td key={p.id} className="p-4 text-text-secondary text-sm">{p.category?.name || "—"}</td>
              ))}
            </CompareRow>
            <tr>
              <td className="p-4 text-text-muted text-sm font-medium">{t.compare.order}</td>
              {items.map((p) => (
                <td key={p.id} className="p-4">
                  <button
                    onClick={() => { addToCart(p, 1); toast.success(`${p.name} savatga qo'shildi`); }}
                    disabled={p.stock === 0}
                    className="btn-primary text-sm py-2 w-full flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={14} /> {t.compare.addToCart}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareRow({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-bg-secondary/50" : ""}>
      <td className="p-4 text-text-muted text-sm font-medium border-t border-border">{label}</td>
      {children}
    </tr>
  );
}
