"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useT } from "@/hooks/useT";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const t = useT();

  const slides = [
    {
      id: 1,
      title: t.home.heroSlide1Title,
      subtitle: t.home.heroSlide1Sub,
      badge: t.home.heroBadge1,
      badgeColor: "bg-green-500",
      cta: t.home.heroSlide1Cta,
      ctaHref: "/catalog",
      gradient: "from-blue-900/40 to-bg-primary",
    },
    {
      id: 2,
      title: t.home.heroSlide2Title,
      subtitle: t.home.heroSlide2Sub,
      badge: t.home.heroBadge2,
      badgeColor: "bg-accent-gold",
      cta: t.home.heroSlide2Cta,
      ctaHref: "/catalog?sale=true",
      gradient: "from-yellow-900/30 to-bg-primary",
    },
    {
      id: 3,
      title: t.home.heroSlide3Title,
      subtitle: t.home.heroSlide3Sub,
      badge: t.home.heroBadge3,
      badgeColor: "bg-purple-500",
      cta: t.home.heroSlide3Cta,
      ctaHref: "/calculator",
      gradient: "from-purple-900/30 to-bg-primary",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];

  return (
    <div className="relative rounded-2xl overflow-hidden bg-bg-card border border-border min-h-48 md:min-h-64">
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-700`} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative z-10 flex items-center justify-between p-8 md:p-12 min-h-48 md:min-h-64">
        <div className="max-w-lg">
          <span className={`inline-block ${slide.badgeColor} text-bg-primary text-xs font-bold px-3 py-1 rounded-full mb-4`}>{slide.badge}</span>
          <h2 className="text-2xl md:text-4xl font-black text-text-primary mb-3 leading-tight">{slide.title}</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">{slide.subtitle}</p>
          <Link href={slide.ctaHref} className="btn-primary inline-flex items-center gap-2 text-sm">{slide.cta}</Link>
        </div>
      </div>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg-primary/60 hover:bg-bg-primary border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg-primary/60 hover:bg-bg-primary border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all">
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-accent-gold" : "w-2 bg-border-light"}`} />
        ))}
      </div>
    </div>
  );
}
