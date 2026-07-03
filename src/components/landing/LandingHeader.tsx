"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useT } from "@/hooks/useT";

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const t = useT();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-bg-primary font-black text-sm">FM</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-text-primary text-sm leading-none">F.M.I</span>
                <p className="text-accent-gold text-xs font-medium leading-none">Metall Market</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="nav-link">{t.landing.nav.about}</a>
              <a href="#features" className="nav-link">{t.landing.nav.features}</a>
              <a href="#gallery" className="nav-link">{t.landing.nav.gallery}</a>
              <a href="#location" className="nav-link">{t.landing.nav.location}</a>
            </nav>

            {/* Register Button */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher compact />
              <button onClick={() => setAuthOpen(true)} className="btn-primary text-sm py-2">
                {t.landing.register}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-bg-secondary animate-slide-down">
            <div className="container-main py-4 flex flex-col gap-4">
              <a href="#about" className="nav-link py-2" onClick={() => setMenuOpen(false)}>{t.landing.nav.about}</a>
              <a href="#features" className="nav-link py-2" onClick={() => setMenuOpen(false)}>{t.landing.nav.features}</a>
              <a href="#gallery" className="nav-link py-2" onClick={() => setMenuOpen(false)}>{t.landing.nav.gallery}</a>
              <a href="#location" className="nav-link py-2" onClick={() => setMenuOpen(false)}>{t.landing.nav.location}</a>
              <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <button
                  onClick={() => { setAuthOpen(true); setMenuOpen(false); }}
                  className="btn-primary text-sm flex-1 text-center"
                >
                  {t.landing.register}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
