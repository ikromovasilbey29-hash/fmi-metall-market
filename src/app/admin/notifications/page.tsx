"use client";

import { useState } from "react";
import { Bell, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

const initialNotifications = [
  { id: "1", title: "Yangi mahsulotlar keldi!", message: "Armatura D16 A500 va profil quvurlar qo'shildi.", type: "product", sent: "28.06.2026", recipients: 892 },
  { id: "2", title: "Yozgi chegirmalar!", message: "Tanlangan mahsulotlarda 15% gacha chegirma.", type: "promo", sent: "25.06.2026", recipients: 892 },
  { id: "3", title: "Yangi maqola chop etildi", message: "Armatura tanlash bo'yicha yangi qo'llanma.", type: "blog", sent: "20.06.2026", recipients: 892 },
];

const typeColors: Record<string, string> = {
  product: "bg-green-500/10 text-green-400 border-green-500/20",
  promo: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
  blog: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  general: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdminNotificationsPage() {
  const t = useT();
  const typeLabels: Record<string, string> = {
    product: t.adminNotifications.typeProduct,
    promo: t.adminNotifications.typePromo,
    blog: t.adminNotifications.typeBlog,
    general: t.adminNotifications.typeGeneral,
  };
  const [notifications, setNotifications] = useState(initialNotifications);
  const [form, setForm] = useState({ title: "", message: "", type: "general" });
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error(t.adminNotifications.toastFillFields);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    const newNotif = {
      id: Date.now().toString(),
      title: form.title,
      message: form.message,
      type: form.type,
      sent: new Date().toLocaleDateString("uz-UZ"),
      recipients: 892,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setForm({ title: "", message: "", type: "general" });
    setSending(false);
    toast.success(t.adminNotifications.toastSentAll);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary">{t.adminNotifications.title}</h1>
        <p className="text-text-muted text-sm mt-1">{t.adminNotifications.subtitle}</p>
      </div>

      {/* Yuborish formasi */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
          <Send size={18} className="text-accent-gold" />
          {t.adminNotifications.formTitle}
        </h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-text-secondary text-sm mb-1.5 block">{t.adminNotifications.titleLabel} *</label>
            <input
              type="text"
              className="input-field"
              placeholder={t.adminNotifications.titlePlaceholder}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-text-secondary text-sm mb-1.5 block">{t.adminNotifications.messageLabel}</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder={t.adminNotifications.messagePlaceholder}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-text-secondary text-sm mb-1.5 block">{t.adminNotifications.typeLabel}</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="general">{t.adminNotifications.typeGeneral}</option>
                <option value="product">{t.adminNotifications.typeProduct}</option>
                <option value="promo">{t.adminNotifications.typePromo}</option>
                <option value="blog">{t.adminNotifications.typeBlog}</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary flex items-center gap-2 px-6" disabled={sending}>
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
                {sending ? t.adminNotifications.sending : t.adminNotifications.send}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Yuborilganlar tarixi */}
      <div>
        <h2 className="font-semibold text-text-primary mb-4">{t.adminNotifications.historyTitle}</h2>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-accent-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell size={18} className="text-accent-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-text-primary font-semibold text-sm">{notif.title}</p>
                    <p className="text-text-muted text-xs mt-0.5">{notif.message}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColors[notif.type] || "bg-bg-panel text-text-muted border-border"}`}>
                    {typeLabels[notif.type] || notif.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-text-muted text-xs">
                  <span>{notif.sent}</span>
                  <span>{notif.recipients} {t.adminNotifications.recipientsSuffix}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
