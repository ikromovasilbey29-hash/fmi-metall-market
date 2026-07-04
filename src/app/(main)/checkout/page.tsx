"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { formatPrice, formatPhoneNumber } from "@/lib/utils";
import { addOrder } from "@/lib/orders";
import { decreaseStock } from "@/lib/admin-products";
import { Loader2, Package, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useT } from "@/hooks/useT";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const t = useT();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "", paymentType: "CASH" });

  const paymentTypes = [
    { value: "CASH", label: t.checkout.cash },
    { value: "CARD", label: t.checkout.card },
    { value: "BANK_TRANSFER", label: t.checkout.bankTransfer },
  ];

  if (items.length === 0) {
    return (
      <div className="container-main py-8 text-center">
        <div className="card p-16 max-w-md mx-auto">
          <Package size={48} className="text-text-muted opacity-30 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{t.checkout.emptyCart}</p>
          <Link href="/catalog" className="btn-primary">{t.cart.toCatalog}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      userEmail: user?.email || form.email || "guest",
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      paymentType: form.paymentType as "CASH" | "CARD" | "BANK_TRANSFER",
      totalPrice: getTotalPrice(),
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        unit: i.product.unit,
      })),
    };

    let orderId: string;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: orderPayload.userEmail,
          fullName: orderPayload.fullName,
          phone: orderPayload.phone,
          email: orderPayload.email,
          address: orderPayload.address,
          paymentType: orderPayload.paymentType,
          items: orderPayload.items,
          totalPrice: orderPayload.totalPrice,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      orderId = data.data.id;
    } catch {
      // Server bilan bog'lanib bo'lmasa — mahalliy saqlaymiz (offline zaxira)
      const order = addOrder(orderPayload);
      orderId = order.id;
    }

    items.forEach((item) => decreaseStock(item.product.id, item.quantity));
    clearCart();
    setLoading(false);
    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <div className="container-main py-8">
      <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
        <ClipboardList size={28} className="text-accent-gold" />
        {t.checkout.title} <span className="gold-text">{t.checkout.titleHighlight}</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-text-primary">{t.checkout.personalInfo}</h2>
            <div>
              <label className="text-text-secondary text-sm mb-1.5 block">{t.checkout.fullName} *</label>
              <input type="text" className="input-field" placeholder={t.checkout.fullNamePlaceholder} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.common.phone} *</label>
                <input type="tel" className="input-field" placeholder={t.checkout.phonePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })} required maxLength={17} />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.checkout.emailOptional}</label>
                <input type="email" className="input-field" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-text-secondary text-sm mb-1.5 block">{t.checkout.deliveryAddress} *</label>
              <textarea className="input-field resize-none" rows={3} placeholder={t.checkout.addressPlaceholder} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-4">{t.checkout.paymentType}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentTypes.map((pt) => (
                <button key={pt.value} type="button" onClick={() => setForm({ ...form, paymentType: pt.value })}
                  className={`p-4 rounded-xl border text-sm font-medium transition-all text-left ${form.paymentType === pt.value ? "border-accent-gold bg-accent-gold/10 text-accent-gold" : "border-border bg-bg-panel text-text-secondary hover:border-border-light"}`}>
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-base" disabled={loading}>
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" /> {t.checkout.sending}</span> : t.checkout.confirmOrder}
          </button>
        </form>

        <div className="card p-6 h-fit sticky top-36">
          <h2 className="font-semibold text-text-primary mb-4">{t.checkout.orderSummary}</h2>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg-panel rounded-lg overflow-hidden flex-shrink-0">
                  {product.imageUrls[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-text-muted opacity-40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-xs truncate">{product.name}</p>
                  <p className="text-text-muted text-xs">×{quantity}</p>
                </div>
                <p className="text-text-primary text-sm font-medium flex-shrink-0">{formatPrice(product.price * quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">{t.cart.total}</span>
              <span className="text-xl font-black gold-text">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
