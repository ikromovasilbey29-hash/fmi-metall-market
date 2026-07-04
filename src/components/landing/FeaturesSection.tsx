"use client";

import {
  ShoppingCart,
  Truck,
  Shield,
  Calculator,
  Bell,
  BarChart3,
  Phone,
  Clock,
} from "lucide-react";
import { useT } from "@/hooks/useT";

const ICONS = [ShoppingCart, Truck, Shield, Calculator, Bell, BarChart3, Phone, Clock];
const COLORS = [
  { color: "text-blue-400", bg: "bg-blue-400/10" },
  { color: "text-green-400", bg: "bg-green-400/10" },
  { color: "text-accent-gold", bg: "bg-accent-gold/10" },
  { color: "text-purple-400", bg: "bg-purple-400/10" },
  { color: "text-orange-400", bg: "bg-orange-400/10" },
  { color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { color: "text-pink-400", bg: "bg-pink-400/10" },
  { color: "text-indigo-400", bg: "bg-indigo-400/10" },
];

export default function FeaturesSection() {
  const t = useT();
  const features = t.landing.features.items.map((item, i) => ({
    ...item,
    icon: ICONS[i],
    ...COLORS[i],
  }));

  return (
    <section id="features" className="py-20 bg-bg-secondary">
      <div className="container-main">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">
            {t.landing.features.title} <span className="gold-text">{t.landing.features.titleHighlight}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card p-6 hover:border-accent-gold/30 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} className={feature.color} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
