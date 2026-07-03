"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingCart, Bell, Heart, BarChart2,
  User, Menu, X, ChevronDown, LogOut, Package, Settings, Calculator,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

const CATEGORIES_UZ = [
  "Armatura", "Profil quvur", "List temir", "Burchak",
  "Quduq halqasi", "Sim", "I-profil", "Kanal",
];
const CATEGORIES_RU = [
  "Арматура", "Профильная труба", "Листовой металл", "Уголок",
  "Кольца колодца", "Проволока", "И-профиль", "Швеллер",
];
// URL uchun har doim UZ kategoriya slug ishlatamiz
const CATEGORIES_SLUG = [
  "Armatura", "Profil quvur", "List temir", "Burchak",
  "Quduq halqasi", "Sim", "I-profil", "Kanal",
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  useEffect(() => { setMounted(true); }, []);

  const cartCount = useCartStore((s) => s.getTotalItems());
  const compareCount = useCompareStore((s) => s.items.length);
  const favoriteCount = useFavoriteStore((s) => s.items.length);
  const notifCount = useNotificationStore((s) => s.getUnreadCount());
  const user = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);
  const showBadge = mounted;

  const categories = lang === "ru" ? CATEGORIES_RU : CATEGORIES_UZ;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-effect border-b border-border">
        <div className="container-main">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-bg-primary font-black text-sm">FM</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-text-primary text-sm leading-none">F.M.I</span>
                <p className="text-accent-gold text-xs font-medium leading-none">Metall Market</p>
              </div>
            </Link>

            {/* Katalog */}
            <Link
              href="/catalog"
              className="flex-shrink-0 hidden sm:flex items-center gap-1.5 px-4 py-2 bg-accent-gold hover:bg-accent-gold-hover text-bg-primary text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <Package size={16} />
              {t.nav.catalog}
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  className="input-field pl-10 pr-4 py-2.5 text-sm"
                  placeholder={t.nav.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Language switcher */}
              {mounted && <LanguageSwitcher />}

              {/* Compare */}
              <Link href="/compare" className="relative p-2.5 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors" title={t.nav.compare}>
                <BarChart2 size={20} />
                {showBadge && compareCount > 0 && <span className="badge">{compareCount}</span>}
              </Link>

              {/* Favorites */}
              <Link href="/profile/favorites" className="relative p-2.5 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors" title={t.nav.favorites}>
                <Heart size={20} />
                {showBadge && favoriteCount > 0 && <span className="badge">{favoriteCount}</span>}
              </Link>

              {/* Notifications */}
              <Link href="/notifications" className="relative p-2.5 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors" title={t.nav.notifications}>
                <Bell size={20} />
                {showBadge && notifCount > 0 && <span className="badge">{notifCount}</span>}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors" title={t.nav.cart}>
                <ShoppingCart size={20} />
                {showBadge && cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="w-7 h-7 bg-accent-gold/20 border border-accent-gold/30 rounded-full flex items-center justify-center">
                    {showBadge && user ? (
                      <span className="text-accent-gold font-bold text-xs uppercase">
                        {user.firstName[0]}{user.lastName?.[0] || ""}
                      </span>
                    ) : (
                      <User size={14} className="text-accent-gold" />
                    )}
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-xl shadow-card animate-slide-down overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="text-text-primary font-semibold text-sm">
                        {showBadge && user ? `${user.firstName} ${user.lastName}`.trim() : t.nav.user}
                      </p>
                      <p className="text-text-muted text-xs">{showBadge && user?.email || ""}</p>
                    </div>
                    <div className="p-1">
                      {[
                        { icon: User, label: t.nav.profile, href: "/profile" },
                        { icon: Heart, label: t.nav.favorites, href: "/profile/favorites" },
                        { icon: Package, label: t.nav.orders, href: "/profile/orders" },
                        { icon: Settings, label: t.nav.settings, href: "/profile/settings" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.label} href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-panel text-text-secondary hover:text-text-primary transition-colors text-sm"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Icon size={16} />
                            {item.label}
                          </Link>
                        );
                      })}
                      <button
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors text-sm w-full mt-1 border-t border-border"
                        onClick={() => { clearUser(); router.push("/"); }}
                      >
                        <LogOut size={16} />
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile toggle */}
              <button className="md:hidden p-2 rounded-lg hover:bg-bg-card text-text-secondary hover:text-text-primary" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="bg-bg-secondary border-b border-border overflow-hidden">
        <div className="container-main">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2.5">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href={`/catalog?category=${encodeURIComponent(CATEGORIES_SLUG[i])}`}
                className="flex-shrink-0 px-4 py-1.5 text-sm text-text-secondary hover:text-accent-gold hover:bg-accent-gold/10 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
            <Link
              href="/calculator"
              className="flex-shrink-0 px-4 py-1.5 text-sm text-accent-gold bg-accent-gold/10 border border-accent-gold/20 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5"
            >
              <Calculator size={14} />
              {t.nav.calculator}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border animate-slide-down">
          <div className="container-main py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-10 text-sm"
                  placeholder={t.nav.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </form>
            <div className="flex items-center gap-3 mb-3">
              <Link href="/catalog"
                className="flex items-center gap-2 px-4 py-2.5 bg-accent-gold text-bg-primary text-sm font-semibold rounded-lg flex-1 justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <Package size={16} />
                {t.nav.catalog}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
