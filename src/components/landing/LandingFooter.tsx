"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const t = useT();
  const f = t.landing.footer;

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-main py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-bg-primary font-black text-sm">FM</span>
              </div>
              <div>
                <span className="font-bold text-text-primary text-sm">F.M.I</span>
                <p className="text-accent-gold text-xs font-medium">Metall Market</p>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{f.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { label: f.linkHome, href: "/" },
                { label: f.linkCatalog, href: "/catalog" },
                { label: f.linkBlog, href: "/blog" },
                { label: f.linkCalculator, href: "/calculator" },
                { label: f.linkAbout, href: "#about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-text-muted hover:text-accent-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{f.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-accent-gold mt-0.5 flex-shrink-0" />
                <span className="text-text-muted text-sm">{f.addressShort}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-accent-gold flex-shrink-0" />
                <a href="tel:+998912345678" className="text-text-muted hover:text-accent-gold text-sm transition-colors">
                  +998 91 234 56 78
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-accent-gold flex-shrink-0" />
                <a href="mailto:info@fmimetall.uz" className="text-text-muted hover:text-accent-gold text-sm transition-colors">
                  info@fmimetall.uz
                </a>
              </li>
            </ul>
          </div>

          {/* Work Hours */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">{f.workHoursTitle}</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-accent-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-text-primary">{f.weekdays}</p>
                  <p className="text-text-muted">{f.weekdaysTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-text-primary">{f.sunday}</p>
                  <p className="text-text-muted">{f.sundayTime}</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2 mt-5">
              <a
                href="https://t.me/fmimetall"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-bold"
              >
                TG
              </a>
              <a
                href="https://instagram.com/fmimetall"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-pink-500/20 border border-pink-500/30 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-500/30 transition-colors text-xs font-bold"
              >
                IG
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-sm">
            © {currentYear} F.M.I Metall Market. {f.rights}
          </p>
          <p className="text-text-muted text-xs">
            {f.locationLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
