"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSiteSettingsStore } from "@/store/siteSettingsStore";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

export default function Footer() {
  const { settings } = useSiteSettingsStore();
  const currentYear = new Date().getFullYear();
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  const navLinks = [
    { label: lang === "ru" ? "Главная" : "Bosh sahifa", href: "/home" },
    { label: t.nav.catalog, href: "/catalog" },
    { label: t.blog.title, href: "/blog" },
    { label: t.nav.calculator, href: "/calculator" },
    { label: t.nav.compare, href: "/compare" },
    { label: t.nav.favorites, href: "/profile/favorites" },
  ];

  const weekLabel   = lang === "ru" ? "Понедельник – Суббота" : "Dushanba – Shanba";
  const sundayLabel = lang === "ru" ? "Воскресенье" : "Yakshanba";
  const catLabel    = lang === "ru" ? "Типы товаров" : "Mahsulot turlari";

  const cats = lang === "ru"
    ? ["Арматура", "Листовой металл", "Профильная труба", "Уголок", "Проволока", "И-профиль"]
    : ["Armatura", "List temir", "Profil quvur", "Burchak", "Sim", "I-profil"];
  const catSlugs = ["Armatura", "List temir", "Profil quvur", "Burchak", "Sim", "I-profil"];

  return (
    <footer className="bg-bg-secondary border-t border-border mt-16">
      <div className="container-main py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-bg-primary font-black text-sm">FM</span>
              </div>
              <div>
                <span className="font-bold text-text-primary text-sm">F.M.I</span>
                <p className="text-accent-gold text-xs font-medium">Metall Market</p>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-4">{t.footer.description}</p>
            <div className="flex gap-2">
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-bold">TG</a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-pink-500/20 border border-pink-500/30 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-colors text-xs font-bold">IG</a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-600/20 border border-blue-600/30 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-600/30 transition-colors text-xs font-bold">FB</a>
              )}
            </div>
          </div>

          {/* Havolalar */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t.footer.links}</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-muted hover:text-accent-gold text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 bg-text-muted group-hover:bg-accent-gold rounded-full transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t.footer.contacts}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-accent-gold mt-0.5 flex-shrink-0" />
                <span className="text-text-muted text-sm">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-accent-gold flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href={`tel:${settings.phone1.replace(/\s/g, "")}`} className="text-text-muted hover:text-accent-gold text-sm transition-colors">{settings.phone1}</a>
                  {settings.phone2 && <a href={`tel:${settings.phone2.replace(/\s/g, "")}`} className="text-text-muted hover:text-accent-gold text-sm transition-colors">{settings.phone2}</a>}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-accent-gold flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-text-muted hover:text-accent-gold text-sm transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>

          {/* Ish vaqti */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t.footer.workHours}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-accent-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-text-primary font-medium">{weekLabel}</p>
                  <p className="text-text-muted">{settings.workWeek}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-text-muted mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-text-primary font-medium">{sundayLabel}</p>
                  <p className="text-text-muted">{settings.workSunday}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <h4 className="font-semibold text-text-primary mb-3 text-sm">{catLabel}</h4>
              <div className="flex flex-wrap gap-1.5">
                {cats.map((cat, i) => (
                  <Link key={cat} href={`/catalog?category=${encodeURIComponent(catSlugs[i])}`}
                    className="text-xs text-text-muted hover:text-accent-gold bg-bg-panel hover:bg-accent-gold/10 border border-border hover:border-accent-gold/30 px-2 py-0.5 rounded-md transition-all">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-sm">© {currentYear} F.M.I Metall Market. {t.footer.allRights}</p>
          <p className="text-text-muted text-xs">{lang === "ru" ? "Гиждуванский район, Бухарская область, Узбекистан" : "Buxoro viloyati, G'ijduvon tumani, O'zbekiston"}</p>
        </div>
      </div>
    </footer>
  );
}
