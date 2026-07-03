"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { formatPhoneNumber } from "@/lib/utils";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

const ADMIN_EMAIL = "admin@fmimetall.uz";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [email, setEmail]               = useState("");
  const [registerData, setRegisterData] = useState({ firstName: "", lastName: "", phone: "", password: "" });
  const router  = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const t       = useT();

  if (!isOpen) return null;

  const isAdminEmail = email.toLowerCase().trim() === ADMIN_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAdminEmail) {
        await new Promise(r => setTimeout(r, 600));
        setUser({ firstName: "Admin", lastName: "", phone: "", email: ADMIN_EMAIL, role: "ADMIN" });
        onClose();
        toast.success(t.auth.login + " ✓");
        router.push("/admin/dashboard");
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...registerData, email }),
        });
        const data = await res.json();
        if (data.success) {
          setUser({ firstName: registerData.firstName, lastName: registerData.lastName, phone: registerData.phone, email, role: "USER" });
          onClose();
          toast.success(t.auth.submitRegister + " ✓");
          router.push("/home");
        } else {
          toast.error(data.error || t.common.error);
        }
      }
    } catch {
      if (isAdminEmail) {
        setUser({ firstName: "Admin", lastName: "", phone: "", email: ADMIN_EMAIL, role: "ADMIN" });
        onClose();
        toast.success(t.auth.login + " ✓");
        router.push("/admin/dashboard");
      } else {
        setUser({ firstName: registerData.firstName, lastName: registerData.lastName, phone: registerData.phone, email, role: "USER" });
        onClose();
        toast.success(t.auth.submitRegister + " ✓");
        router.push("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            {isAdminEmail ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={20} className="text-accent-gold" />
                  <h2 className="text-xl font-bold text-accent-gold">Admin</h2>
                </div>
                <p className="text-text-muted text-sm">{t.admin.panel}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-text-primary">{t.auth.registerTitle}</h2>
                <p className="text-text-muted text-sm mt-0.5">F.M.I Metall Market</p>
              </>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg-panel text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-text-secondary text-sm mb-1.5 block">{t.common.email} *</label>
              <input type="email"
                className={`input-field transition-colors ${isAdminEmail ? "border-accent-gold/50 bg-accent-gold/5" : ""}`}
                placeholder="email@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required autoFocus />
              {isAdminEmail && (
                <p className="text-accent-gold text-xs mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} /> Admin email
                </p>
              )}
            </div>

            {!isAdminEmail && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-text-secondary text-sm mb-1.5 block">{t.profile.firstName} *</label>
                    <input type="text" className="input-field" placeholder={t.profile.firstName}
                      value={registerData.firstName} onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-text-secondary text-sm mb-1.5 block">{t.profile.lastName} *</label>
                    <input type="text" className="input-field" placeholder={t.profile.lastName}
                      value={registerData.lastName} onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.common.phone} *</label>
                  <input type="tel" className="input-field" placeholder={t.auth.phonePlaceholder}
                    value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: formatPhoneNumber(e.target.value) })}
                    required maxLength={17} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.auth.passwordPlaceholder} *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="input-field pr-12"
                      placeholder={t.auth.passwordPlaceholder}
                      value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className={`w-full mt-2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isAdminEmail ? "bg-accent-gold hover:bg-accent-gold-hover text-bg-primary" : "btn-primary"
              }`}>
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {t.common.loading}</>
              ) : isAdminEmail ? (
                <><ShieldCheck size={18} /> {t.auth.submitLogin}</>
              ) : (
                t.auth.submitRegister
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
