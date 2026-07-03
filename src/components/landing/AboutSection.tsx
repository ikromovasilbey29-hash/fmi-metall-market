"use client";

import { CheckCircle2, MapPin } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function AboutSection() {
  const t = useT();
  const highlights = t.landing.about.highlights;

  return (
    <section id="about" className="py-20 bg-bg-primary">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-4 py-2 mb-6">
              <span className="text-accent-gold text-sm font-medium">{t.landing.about.badge}</span>
            </div>
            <h2 className="section-title mb-6">
              {t.landing.about.titleLine1}{" "}
              <span className="gold-text">{t.landing.about.titleHighlight}</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              {t.landing.about.p1}
            </p>
            <p className="text-text-secondary leading-relaxed mb-8">
              {t.landing.about.p2}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent-gold flex-shrink-0" />
                  <span className="text-text-secondary text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-text-muted text-sm">
              <MapPin size={16} className="text-accent-gold" />
              <span>{t.landing.about.address}</span>
            </div>
          </div>

          {/* Right: Visual cards */}
          <div className="grid grid-cols-2 gap-4">
            {t.landing.about.stats.map((item) => (
              <div key={item.label} className="card p-6 text-center hover:border-accent-gold/30 transition-colors duration-300">
                <div className="text-3xl font-black gold-text mb-1">{item.number}</div>
                <div className="text-text-primary font-semibold text-sm mb-1">{item.label}</div>
                <div className="text-text-muted text-xs">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
