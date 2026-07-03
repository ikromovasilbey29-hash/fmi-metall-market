"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/hooks/useT";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "—";
  const t = useT();

  return (
    <div className="container-main py-16 flex justify-center">
      <div className="card p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-400" />
        </div>
        <h1 className="text-3xl font-black text-text-primary mb-3">
          {t.orderSuccess.title} <span className="gold-text">{t.orderSuccess.titleHighlight}</span>
        </h1>
        <p className="text-text-secondary mb-6 leading-relaxed">{t.orderSuccess.desc}</p>
        <div className="bg-bg-panel border border-border rounded-xl p-4 mb-8">
          <p className="text-text-muted text-sm mb-1">{t.orderSuccess.orderNumber}</p>
          <p className="text-accent-gold font-bold text-lg font-mono">{orderId}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/profile/orders" className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Package size={18} /> {t.orderSuccess.myOrders}
          </Link>
          <Link href="/catalog" className="btn-primary flex-1 flex items-center justify-center gap-2">
            {t.orderSuccess.continueShopping} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
