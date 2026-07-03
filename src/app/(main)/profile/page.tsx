"use client";

import { useState, useEffect, useRef } from "react";
import { User, Phone, Mail, Lock, Camera, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import { formatPhoneNumber } from "@/lib/utils";
import { useT } from "@/hooks/useT";

export default function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useT();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email });
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(t.profile.avatarSizeError); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setAvatarPreview(ev.target?.result as string); toast.success(t.profile.avatarHint); };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email });
    toast.success(t.profile.updated);
    setLoading(false);
  };

  const initials = form.firstName && form.lastName ? `${form.firstName[0]}${form.lastName[0]}`
    : form.firstName ? form.firstName[0] : "U";

  return (
    <div className="container-main py-8 max-w-2xl">
      <h1 className="text-3xl font-black text-text-primary mb-8 flex items-center gap-3">
        <User size={28} className="text-accent-gold" />
        <span className="gold-text">{t.profile.title}</span>
      </h1>
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
          <div className="relative">
            <div className="w-20 h-20 bg-accent-gold/20 border-2 border-accent-gold/30 rounded-full flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black gold-text uppercase">{initials}</span>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-accent-gold rounded-full flex items-center justify-center border-2 border-bg-card hover:bg-accent-gold-hover transition-colors">
              <Camera size={12} className="text-bg-primary" />
            </button>
          </div>
          <div>
            <p className="text-xl font-bold text-text-primary">{form.firstName} {form.lastName}</p>
            <p className="text-text-muted text-sm">{form.email}</p>
            {avatarPreview && (
              <button type="button" onClick={() => setAvatarPreview(null)} className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors">
                {t.profile.avatar}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><User size={14} /> {t.profile.firstName}</label>
              <input type="text" className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><User size={14} /> {t.profile.lastName}</label>
              <input type="text" className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><Phone size={14} /> {t.common.phone}</label>
            <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })} placeholder="+998 XX XXX XX XX" maxLength={17} />
          </div>
          <div>
            <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><Mail size={14} /> {t.common.email}</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="pt-2 border-t border-border">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Lock size={16} className="text-accent-gold" /> {t.profile.changePassword}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.profile.currentPassword}</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.profile.newPassword}</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2 w-full justify-center" disabled={loading}>
            {loading ? <><Loader2 size={18} className="animate-spin" /> {t.profile.saving}</> : <><Save size={18} /> {t.profile.saveChanges}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
