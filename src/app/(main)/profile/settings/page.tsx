"use client";

import Link from "next/link";
import { Settings, ArrowLeft, Globe } from "lucide-react";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";
import type { Lang } from "@/lib/i18n";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const t = useT();
  const { lang, setLang } = useLanguageStore();

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    toast.success(t.settings.saved);
  };

  return (
    <div className="container-main py-8 max-w-xl">
      <Link href="/profile" className="flex items-center gap-2 text-text-muted hover:text-accent-gold text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        {t.common.back}
      </Link>
      <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
        <Settings size={28} className="text-accent-gold" />
        {t.settings.title}
      </h1>

      <div className="card p-6 space-y-4">
        {/* Til tanlash */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-accent-gold" />
            <div>
              <p className="text-text-primary font-medium text-sm">{t.settings.language}</p>
              <p className="text-text-muted text-xs">{lang === "uz" ? t.settings.uz : t.settings.ru}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {(["uz", "ru"] as Lang[]).map((l) => (
              <button key={l} onClick={() => handleLangChange(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                  lang === l ? "bg-accent-gold text-bg-primary" : "bg-bg-panel border border-border text-text-secondary hover:text-text-primary"
                }`}>
                {l === "uz" ? "🇺🇿 UZ" : "🇷🇺 RU"}
              </button>
            ))}
          </div>
        </div>

        {/* Bildirishnomalar */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-text-primary font-medium text-sm">{t.settings.notifications}</p>
            <p className="text-text-muted text-xs">{t.settings.uz === "O'zbek" ? "Yangi mahsulot va aksiyalar haqida" : "О новых товарах и акциях"}</p>
          </div>
          <div className="w-11 h-6 bg-accent-gold rounded-full cursor-pointer relative">
            <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-bg-primary rounded-full shadow" />
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-text-primary font-medium text-sm">Email {t.settings.notifications}</p>
            <p className="text-text-muted text-xs">{lang === "uz" ? "Buyurtma holati haqida email" : "Email о статусе заказа"}</p>
          </div>
          <div className="w-11 h-6 bg-bg-panel border border-border rounded-full cursor-pointer relative">
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-text-muted rounded-full shadow" />
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-text-primary font-medium text-sm">{lang === "uz" ? "Hisobni o'chirish" : "Удалить аккаунт"}</p>
            <p className="text-text-muted text-xs">{lang === "uz" ? "Barcha ma'lumotlar o'chiriladi" : "Все данные будут удалены"}</p>
          </div>
          <button className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-400/50 px-3 py-1.5 rounded-lg transition-all">
            {t.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
