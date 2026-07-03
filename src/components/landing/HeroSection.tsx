"use client";

import { useState } from "react";
import { ArrowRight, ShoppingBag, Calculator, Star } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useT } from "@/hooks/useT";

export default function HeroSection() {
  const [authOpen, setAuthOpen] = useState(false);
  const t = useT();

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.05),transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container-main relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-4 py-2 mb-6">
                <Star size={14} className="text-accent-gold fill-accent-gold" />
                <span className="text-accent-gold text-sm font-medium">
                  {t.landing.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="text-text-primary">{t.landing.hero.titleLine1}</span>
                <br />
                <span className="gold-text">{t.landing.hero.titleLine2}</span>
                <br />
                <span className="text-text-primary">{t.landing.hero.titleLine3}</span>
              </h1>

              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg">
                {t.landing.hero.desc}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setAuthOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <ShoppingBag size={18} />
                  {t.landing.hero.ctaCatalog}
                  <ArrowRight size={18} />
                </button>
                <a href="#features" className="btn-secondary flex items-center gap-2">
                  <Calculator size={18} />
                  {t.landing.hero.ctaFeatures}
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
                {[
                  { value: "500+", label: t.landing.hero.statProducts },
                  { value: "1000+", label: t.landing.hero.statClients },
                  { value: "5+", label: t.landing.hero.statYears },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-black gold-text">{stat.value}</div>
                    <div className="text-text-muted text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                {/* Main card */}
                <div className="card p-8 w-80 shadow-glow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center">
                      <span className="text-bg-primary font-black text-lg">FM</span>
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">F.M.I Metall Market</p>
                      <p className="text-text-muted text-sm">{t.landing.hero.cardSubtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Armatura D12", price: "8 200 so'm/kg", stock: true },
                      { name: "List temir 3mm", price: "12 500 so'm/kg", stock: true },
                      { name: "Profil quvur", price: "9 800 so'm/kg", stock: true },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-bg-panel rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary">{item.name}</p>
                          <p className="text-xs text-accent-gold">{item.price}</p>
                        </div>
                        {item.stock && (
                          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                            {t.landing.hero.cardAvailable}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary w-full mt-4 text-sm">
                    {t.landing.hero.cardViewAll}
                  </button>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-accent-gold text-bg-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-glow">
                  {t.landing.hero.cardBadgeNew}
                </div>
                <div className="absolute -bottom-4 -left-4 card px-4 py-2">
                  <p className="text-xs text-text-muted">{t.landing.hero.cardTodayOrders}</p>
                  <p className="text-lg font-bold gold-text">+47 ta</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs">{t.landing.hero.scrollHint}</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
        </div>
      </section>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
