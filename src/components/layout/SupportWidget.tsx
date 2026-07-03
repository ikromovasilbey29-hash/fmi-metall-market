"use client";

import { useState } from "react";
import { MessageSquarePlus, X, Send, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { useSupportStore } from "@/store/supportStore";
import toast from "react-hot-toast";
import { formatPhoneNumber } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  const subjects = lang === "ru"
    ? ["Заказ не пришёл", "Отмена заказа", "Вопрос о цене", "Вопрос о товаре", "Другая проблема"]
    : ["Buyurtma kelmadi", "Buyurtmani bekor qilish", "Narx haqida savol", "Mahsulot haqida savol", "Boshqa muammo"];

  const [form, setForm] = useState({ userName: "", userPhone: "", subject: subjects[0], message: "" });
  const submitRequest = useSupportStore((s) => s.submitRequest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    submitRequest({ userId: "guest-" + Date.now(), userName: form.userName, userPhone: form.userPhone, subject: form.subject, message: form.message });
    setLoading(false);
    setSent(true);
    toast.success(t.support.messageSent);
  };

  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setForm({ userName: "", userPhone: "", subject: subjects[0], message: "" });
  };

  const nameLabel    = lang === "ru" ? "Ваше имя" : "Ismingiz";
  const phoneLabel   = lang === "ru" ? "Телефон" : "Telefon";
  const subjectLabel = lang === "ru" ? "Тема" : "Mavzu";
  const msgLabel     = lang === "ru" ? "Сообщение *" : "Xabar *";
  const msgPlaceholder = lang === "ru" ? "Напишите вашу проблему или вопрос..." : "Muammo yoki savolingizni yozing...";
  const sentTitle    = lang === "ru" ? "Ваш запрос отправлен!" : "So'rovingiz yuborildi!";
  const sentDesc     = lang === "ru" ? "Наш специалист рассмотрит и ответит вам через уведомление." : "Tez orada mutaxassisimiz ko'rib chiqib, bildirishnoma orqali javob beradi.";
  const sendingLabel = lang === "ru" ? "Отправляется..." : "Yuborilmoqda...";

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-accent-gold hover:bg-accent-gold-hover text-bg-primary px-4 py-3 rounded-full shadow-glow font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        title={t.support.title}>
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">{t.support.title}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                  <MessageSquarePlus size={16} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm">{t.support.title}</p>
                  <p className="text-text-muted text-xs">{t.support.subtitle}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {sent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{sentTitle}</h3>
                  <p className="text-text-muted text-sm mb-5">{sentDesc}</p>
                  <button onClick={handleClose} className="btn-primary w-full">{t.support.close}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-text-secondary text-xs mb-1 block">{nameLabel}</label>
                      <input type="text" className="input-field text-sm" placeholder={nameLabel} value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-text-secondary text-xs mb-1 block">{phoneLabel}</label>
                      <input type="tel" className="input-field text-sm" placeholder="+998 XX XXX XX XX" value={form.userPhone} onChange={(e) => setForm({ ...form, userPhone: formatPhoneNumber(e.target.value) })} required maxLength={17} />
                    </div>
                  </div>
                  <div>
                    <label className="text-text-secondary text-xs mb-1 block">{subjectLabel}</label>
                    <div className="relative">
                      <select className="input-field text-sm appearance-none pr-9" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                        {subjects.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-text-secondary text-xs mb-1 block">{msgLabel}</label>
                    <textarea className="input-field text-sm resize-none" rows={4} placeholder={msgPlaceholder} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                    {loading ? <><Loader2 size={16} className="animate-spin" /> {sendingLabel}</> : <><Send size={16} /> {t.support.send}</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
