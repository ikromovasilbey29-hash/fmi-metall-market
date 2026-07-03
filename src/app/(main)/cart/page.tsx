"use client";

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/hooks/useT";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const t = useT();

  if (items.length === 0) {
    return (
      <div className="container-main py-8">
        <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
          <ShoppingCart size={28} className="text-accent-gold" />
          <span className="gold-text">{t.cart.title}</span>
        </h1>
        <div className="card p-16 text-center">
          <ShoppingCart size={64} className="text-text-muted opacity-30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">{t.cart.empty}</h2>
          <p className="text-text-muted mb-6">{t.cart.emptyDesc}</p>
          <Link href="/catalog" className="btn-primary inline-flex items-center gap-2">
            {t.cart.toCatalog} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
          <ShoppingCart size={28} className="text-accent-gold" />
          <span className="gold-text">{t.cart.title}</span>
          <span className="text-text-muted text-xl ml-2">({items.length} {t.cart.itemsCount})</span>
        </h1>
        <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1.5 transition-colors">
          <Trash2 size={15} />
          {t.cart.clear}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-bg-panel flex-shrink-0">
                {product.imageUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-text-muted opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.slug}`} className="font-semibold text-text-primary hover:text-accent-gold transition-colors text-sm line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-accent-gold text-sm font-bold mt-0.5">
                  {formatPrice(product.price)}/{product.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-border hover:border-accent-gold bg-bg-panel flex items-center justify-center text-text-secondary hover:text-text-primary transition-all">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-text-primary text-sm">{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-lg border border-border hover:border-accent-gold bg-bg-panel flex items-center justify-center text-text-secondary hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border">
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-text-primary text-sm">{formatPrice(product.price * quantity)}</p>
                <button onClick={() => removeItem(product.id)} className="text-text-muted hover:text-red-400 mt-1 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-36">
            <h2 className="font-semibold text-text-primary mb-5">{t.cart.summary}</h2>
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-text-muted truncate flex-1 mr-2">{product.name} ×{quantity}</span>
                  <span className="text-text-primary font-medium flex-shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary">{t.cart.total}</span>
                <span className="text-xl font-black gold-text">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 text-center">
              {t.cart.checkout} <ArrowRight size={18} />
            </Link>
            <Link href="/catalog" className="btn-secondary w-full mt-3 flex items-center justify-center gap-2 text-center text-sm">
              {t.cart.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
