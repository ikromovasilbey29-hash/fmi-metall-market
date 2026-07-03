"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, ChevronRight } from "lucide-react";
import { getOrderStatusLabel, getOrderStatusClass, formatPrice } from "@/lib/utils";
import { getOrdersByUser, type OrderRecord } from "@/lib/orders";
import { useUserStore } from "@/store/userStore";
import { useT } from "@/hooks/useT";

export default function OrdersPage() {
  const t = useT();
  const user = useUserStore((s) => s.user);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const refresh = useCallback(() => {
    setOrders(getOrdersByUser(user?.email || "guest"));
  }, [user?.email]);

  useEffect(() => {
    refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fmi_orders") refresh();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  return (
    <div className="container-main py-8 max-w-3xl">
      <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
        <Package size={28} className="text-accent-gold" />
        {t.orders.title}
      </h1>

      {orders.length === 0 ? (
        <div className="card p-16 text-center">
          <Package size={64} className="text-text-muted opacity-30 mx-auto mb-4" />
          <p className="text-text-secondary mb-2">{t.orders.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card p-5 flex items-center justify-between hover:border-accent-gold/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-panel rounded-xl flex items-center justify-center">
                  <Package size={22} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-bold text-text-primary font-mono text-sm">{order.id}</p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} {t.orders.items}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-text-primary">{formatPrice(order.totalPrice)}</p>
                  <span className={`status-badge mt-1 ${getOrderStatusClass(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <ChevronRight size={18} className="text-text-muted group-hover:text-accent-gold transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
