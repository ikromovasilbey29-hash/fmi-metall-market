"use client";

import { useState, useEffect } from "react";
import { Save, Phone, MapPin, Globe, Mail, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";
import { formatPhoneNumber } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";
import type { Lang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSiteSettingsStore();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = useT();
  const { lang, setLang } = useLanguageStore();

  // Lokal state — form
  const [contacts, setContacts] = useState({
    phone1: settings.phone1,
    phone2: settings.phone2,
    email: settings.email,
  });
  const [address, setAddress] = useState({
    address: settings.address,
    workWeek: settings.workWeek,
    workSunday: settings.workSunday,
  });
  const [social, setSocial] = useState({
    telegram: settings.telegram,
    instagram: settings.instagram,
    facebook: settings.facebook,
  });
  const [newPassword, setNewPassword] = useState("");

  // Store o'zgarganda form yangilansin
  useEffect(() => {
    setContacts({ phone1: settings.phone1, phone2: settings.phone2, email: settings.email });
    setAddress({ address: settings.address, workWeek: settings.workWeek, workSunday: settings.workSunday });
    setSocial({ telegram: settings.telegram, instagram: settings.instagram, facebook: settings.facebook });
  }, []); // eslint-disable-line

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));

    updateSettings({
      ...contacts,
      ...address,
      ...social,
      ...(newPassword ? { adminPassword: newPassword } : {}),
    });

    setSaving(false);
    setSaved(true);
    setNewPassword("");
    toast.success("Barcha o'zgarishlar saqlandi!");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary">{t.adminSettings.title}</h1>
        <p className="text-text-muted text-sm mt-1">{t.adminSettings.title}</p>
      </div>

      {/* Til tanlash */}
      <div className="card p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-text-primary font-semibold text-sm">{t.adminSettings.language}</p>
          <p className="text-text-muted text-xs mt-0.5">{lang === "uz" ? "O'zbek tili faol" : "Русский язык активен"}</p>
        </div>
        <div className="flex items-center gap-2">
          {(["uz", "ru"] as Lang[]).map((l) => (
            <button key={l} onClick={() => { setLang(l); toast.success(t.adminSettings.saved); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${lang === l ? "bg-accent-gold text-bg-primary" : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"}`}>
              {l === "uz" ? "🇺🇿 UZ" : "🇷🇺 RU"}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Aloqa ma'lumotlari */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Phone size={18} className="text-accent-gold" />
              {t.adminSettings.contactInfoTitle}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminSettings.phone1Label}</label>
                <input
                  type="tel"
                  className="input-field"
                  value={contacts.phone1}
                  onChange={(e) => setContacts({ ...contacts, phone1: formatPhoneNumber(e.target.value) })}
                  placeholder="+998 XX XXX XX XX"
                  maxLength={17}
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminSettings.phone2Label}</label>
                <input
                  type="tel"
                  className="input-field"
                  value={contacts.phone2}
                  onChange={(e) => setContacts({ ...contacts, phone2: formatPhoneNumber(e.target.value) })}
                  placeholder="+998 XX XXX XX XX"
                  maxLength={17}
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminSettings.emailLabel}</label>
                <input
                  type="email"
                  className="input-field"
                  value={contacts.email}
                  onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                  placeholder="info@example.uz"
                />
              </div>
            </div>
          </div>

          {/* Manzil va ish vaqti */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-accent-gold" />
              {t.adminSettings.addressWorkHoursTitle}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminSettings.addressLabel}</label>
                <input
                  type="text"
                  className="input-field"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  placeholder={t.adminSettings.addressPlaceholder}
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">Ish vaqti (Du–Sha)</label>
                <input
                  type="text"
                  className="input-field"
                  value={address.workWeek}
                  onChange={(e) => setAddress({ ...address, workWeek: e.target.value })}
                  placeholder="08:00 – 18:00"
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">Ish vaqti (Yakshanba)</label>
                <input
                  type="text"
                  className="input-field"
                  value={address.workSunday}
                  onChange={(e) => setAddress({ ...address, workSunday: e.target.value })}
                  placeholder="09:00 – 15:00"
                />
              </div>
            </div>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Globe size={18} className="text-accent-gold" />
              Ijtimoiy tarmoqlar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="text-blue-400 font-bold text-xs">TG</span> Telegram
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={social.telegram}
                  onChange={(e) => setSocial({ ...social, telegram: e.target.value })}
                  placeholder="https://t.me/..."
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="text-pink-400 font-bold text-xs">IG</span> Instagram
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={social.instagram}
                  onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5">
                  <span className="text-blue-500 font-bold text-xs">FB</span> Facebook
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={social.facebook}
                  onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                  placeholder="https://facebook.com/... (ixtiyoriy)"
                />
              </div>
            </div>
          </div>

          {/* Admin kirish */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Mail size={18} className="text-accent-gold" />
              {t.adminSettings.adminLoginTitle}
            </h2>
            <div className="space-y-4">
              {/* Admin email — readonly */}
              <div className="p-4 bg-accent-gold/5 border border-accent-gold/20 rounded-xl flex items-start gap-3">
                <CheckCircle2 size={18} className="text-accent-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-text-muted text-xs mb-0.5">{t.adminSettings.adminEmailNote}</p>
                  <p className="text-accent-gold font-mono font-bold text-sm">admin@fmimetall.uz</p>
                  <p className="text-text-muted text-xs mt-1">
                    {t.adminSettings.adminEmailHint}
                  </p>
                </div>
              </div>

              {/* Parol o'zgartirish */}
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">
                  {t.adminSettings.newPasswordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-12"
                    placeholder={t.adminSettings.newPasswordPlaceholder}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword && newPassword.length < 8 && (
                  <p className="text-red-400 text-xs mt-1">{t.adminSettings.passwordMinLength}</p>
                )}
              </div>

              {/* Joriy saqlangan sozlamalar preview */}
              <div className="pt-2 border-t border-border">
                <p className="text-text-muted text-xs mb-2">{t.adminSettings.currentSavedData}</p>
                <div className="space-y-1">
                  <p className="text-text-secondary text-xs flex items-center gap-1.5">
                    <Phone size={11} className="text-accent-gold" />
                    {settings.phone1}
                  </p>
                  <p className="text-text-secondary text-xs flex items-center gap-1.5">
                    <MapPin size={11} className="text-accent-gold" />
                    {settings.address.slice(0, 40)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saqlash tugmasi */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 px-8"
            disabled={saving || (!!newPassword && newPassword.length < 8)}
          >
            {saving ? (
              <><Loader2 size={18} className="animate-spin" /> {t.adminSettings.saving}</>
            ) : saved ? (
              <><CheckCircle2 size={18} /> {t.adminSettings.savedExclaim}</>
            ) : (
              <><Save size={18} /> {t.adminSettings.saveAllChanges}</>
            )}
          </button>
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 size={16} />
              Muvaffaqiyatli saqlandi
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
