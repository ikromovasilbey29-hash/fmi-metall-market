"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import AdminChart from "@/components/admin/AdminChart";
import Link from "next/link";
import { useT } from "@/hooks/useT";
import { formatPrice } from "@/lib/utils";
import { lsLoad, type OrderRecord } from "@/lib/orders";

function formatTimeAgo(iso: string, t: ReturnType<typeof useT>): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return t.notifications.now;
  if (minutes < 60) return `${minutes} ${t.notifications.minutesAgo}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t.notifications.hoursAgo}`;
  const days = Math.floor(hours / 24);
  return `${days} ${t.notifications.daysAgo}`;
}

export default function AdminDashboardPage() {
  const t = useT();
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);
  const [productCount, setProductCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { signal: AbortSignal.timeout(5000) });
      const json = await res.json();
      if (json.success) setAllOrders(json.data);
      else throw new Error(json.error);
    } catch {
      setAllOrders(lsLoad());
    }
    import("@/lib/product-store").then(({ getAllProducts }) => {
      setProductCount(getAllProducts().length);
    });
  }, []);

  useEffect(() => {
    refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fmi_orders" || e.key === "fmi_admin_products") refresh();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const recentOrders = allOrders.slice(0, 5);

  // Yetkazilgan buyurtmalar summasi — "Yetkazildi" deb belgilangach avtomatik hisoblanadi
  const deliveredRevenue = allOrders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statusCounts = {
    NEW: allOrders.filter((o) => o.status === "NEW").length,
    PROCESSING: allOrders.filter((o) => o.status === "PROCESSING").length,
    DELIVERING: allOrders.filter((o) => o.status === "DELIVERING").length,
    DELIVERED: allOrders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: allOrders.filter((o) => o.status === "CANCELLED").length,
  };
  const statusTotal = allOrders.length || 1;

  const stats = [
    { label: t.adminDashboard.monthlySales, value: formatPrice(deliveredRevenue), icon: TrendingUp, color: "text-accent-gold", bg: "bg-accent-gold/10" },
    { label: t.adminDashboard.totalOrders, value: allOrders.length.toLocaleString(), icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: t.adminDashboard.totalUsers, value: "892", change: "+23%", icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
    { label: t.adminDashboard.totalProducts, value: productCount.toLocaleString(), icon: Package, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  const statusMap: Record<string, { label: string; cls: string }> = {
    NEW: { label: t.adminOrders.statusNew, cls: "status-new" },
    PROCESSING: { label: t.adminOrders.statusProcessing, cls: "status-processing" },
    DELIVERING: { label: t.adminOrders.statusDelivering, cls: "status-delivering" },
    DELIVERED: { label: t.adminOrders.statusDelivered, cls: "status-delivered" },
    CANCELLED: { label: t.adminOrders.statusCancelled, cls: "status-cancelled" },
  };

  const orderStatusItems = [
    { label: t.adminOrders.statusNew, value: statusCounts.NEW, total: statusTotal, cls: "bg-blue-400" },
    { label: t.adminOrders.statusProcessing, value: statusCounts.PROCESSING, total: statusTotal, cls: "bg-yellow-400" },
    { label: t.adminOrders.statusDelivering, value: statusCounts.DELIVERING, total: statusTotal, cls: "bg-purple-400" },
    { label: t.adminOrders.statusDelivered, value: statusCounts.DELIVERED, total: statusTotal, cls: "bg-green-400" },
    { label: t.adminOrders.statusCancelled, value: statusCounts.CANCELLED, total: statusTotal, cls: "bg-red-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminDashboard.title}</h1>
          <p className="text-text-muted text-sm mt-1">{t.adminDashboard.subtitle}</p>
        </div>
        <span className="text-text-muted text-sm flex items-center gap-1.5">
          <Clock size={14} /> {t.admin.updatedNow}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                {"change" in stat && stat.change && (
                  <span className="text-green-400 text-xs flex items-center gap-0.5 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={11} /> {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-text-primary">{stat.value}</p>
              <p className="text-text-muted text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Status */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-text-primary mb-6">{t.adminDashboard.monthlySalesDynamics}</h2>
          <AdminChart />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-6">{t.adminDashboard.orderStatus}</h2>
          <div className="space-y-3">
            {orderStatusItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="text-text-primary font-medium">{item.value}</span>
                </div>
                <div className="h-1.5 bg-bg-panel rounded-full overflow-hidden">
                  <div className={`h-full ${item.cls} rounded-full`} style={{ width: `${(item.value / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-text-primary">{t.adminDashboard.recentOrders}</h2>
          <Link href="/admin/orders" className="text-accent-gold text-sm hover:text-accent-gold-hover transition-colors">
            {t.adminDashboard.viewAll} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {[t.adminDashboard.orderId, t.adminDashboard.customer, t.adminDashboard.amount, t.common.status, t.adminDashboard.time].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-text-muted text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-text-muted text-sm">{t.adminOrders.noOrders}</td>
                </tr>
              ) : recentOrders.map((order) => {
                const status = statusMap[order.status];
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                    <td className="py-3 px-4 text-accent-gold text-sm font-mono">{order.id}</td>
                    <td className="py-3 px-4 text-text-primary text-sm">{order.fullName}</td>
                    <td className="py-3 px-4 text-text-primary text-sm font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="py-3 px-4"><span className={`status-badge ${status?.cls}`}>{status?.label}</span></td>
                    <td className="py-3 px-4 text-text-muted text-xs">{formatTimeAgo(order.createdAt, t)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
