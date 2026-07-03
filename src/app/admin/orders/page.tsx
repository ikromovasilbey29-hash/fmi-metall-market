"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";
import { formatPrice } from "@/lib/utils";
import { lsLoad, updateOrderStatus, type OrderRecord, type OrderStatus } from "@/lib/orders";

export default function AdminOrdersPage() {
  const t = useT();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const refresh = useCallback(() => setOrders(lsLoad()), []);

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

  const paymentLabels: Record<string, string> = {
    CASH: t.checkout.cash,
    CARD: t.checkout.card,
    BANK_TRANSFER: t.checkout.bankTransfer,
  };

  const statusMap: Record<string, { label: string; cls: string }> = {
    NEW: { label: t.adminOrders.statusNew, cls: "status-new" },
    PROCESSING: { label: t.adminOrders.statusProcessing, cls: "status-processing" },
    DELIVERING: { label: t.adminOrders.statusDelivering, cls: "status-delivering" },
    DELIVERED: { label: t.adminOrders.statusDelivered, cls: "status-delivered" },
    CANCELLED: { label: t.adminOrders.statusCancelled, cls: "status-cancelled" },
  };

  const statusOptions = [
    { value: "NEW", label: t.adminOrders.statusNew },
    { value: "PROCESSING", label: t.adminOrders.statusProcessing },
    { value: "DELIVERING", label: t.adminOrders.statusDelivering },
    { value: "DELIVERED", label: t.adminOrders.statusDelivered },
    { value: "CANCELLED", label: t.adminOrders.statusCancelled },
  ];

  const filterTabs = [
    { key: "all", label: t.common.all },
    { key: "NEW", label: t.adminOrders.statusNew },
    { key: "PROCESSING", label: t.adminOrders.statusProcessing },
    { key: "DELIVERING", label: t.adminOrders.statusDelivering },
    { key: "DELIVERED", label: t.adminOrders.statusDelivered },
    { key: "CANCELLED", label: t.adminOrders.statusCancelled },
  ];

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const status = newStatus as OrderStatus;
    updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status } : null);
    toast.success(`${t.adminOrders.statusUpdated} ${statusMap[status]?.label}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminOrders.title}</h1>
          <p className="text-text-muted text-sm mt-1">{orders.length} {t.adminOrders.itemsSuffix}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === tab.key ? "bg-accent-gold text-bg-primary font-medium" : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[t.adminOrders.orderId, t.adminOrders.customer, t.adminOrders.phone, t.adminOrders.items, t.adminOrders.amount, t.adminOrders.status, t.adminOrders.date, ""].map((h) => (
                <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-text-muted text-sm">{t.adminOrders.noOrders}</td>
              </tr>
            ) : filtered.map((order) => {
              const status = statusMap[order.status];
              return (
                <tr key={order.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                  <td className="py-4 px-4 text-accent-gold text-sm font-mono">{order.id}</td>
                  <td className="py-4 px-4 text-text-primary text-sm font-medium">{order.fullName}</td>
                  <td className="py-4 px-4 text-text-secondary text-sm">{order.phone}</td>
                  <td className="py-4 px-4 text-text-secondary text-sm">{order.items.length} {t.adminOrders.itemsSuffix}</td>
                  <td className="py-4 px-4 text-text-primary text-sm font-bold">{formatPrice(order.totalPrice)}</td>
                  <td className="py-4 px-4">
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer outline-none ${status.cls}`}>
                      {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-bg-card text-text-primary">{o.label}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-4 text-text-muted text-xs">{new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-4 px-4">
                    <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted hover:text-accent-gold transition-all">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary">{t.adminOrders.detail}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t.adminOrders.orderId, value: selectedOrder.id },
                  { label: t.adminOrders.orderDate, value: new Date(selectedOrder.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: t.adminOrders.customer, value: selectedOrder.fullName },
                  { label: t.adminOrders.phone, value: selectedOrder.phone },
                  { label: t.adminOrders.orderAddress, value: selectedOrder.address },
                  { label: t.adminOrders.paymentType, value: paymentLabels[selectedOrder.paymentType] || selectedOrder.paymentType },
                  { label: t.adminOrders.itemsCount, value: `${selectedOrder.items.length} ${t.adminOrders.itemsSuffix}` },
                  { label: t.adminOrders.totalAmount, value: formatPrice(selectedOrder.totalPrice) },
                ].map((item) => (
                  <div key={item.label} className="bg-bg-panel rounded-lg p-3">
                    <p className="text-text-muted text-xs mb-0.5">{item.label}</p>
                    <p className="text-text-primary text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminOrders.changeStatus}</label>
                <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} className="input-field">
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
