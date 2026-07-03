"use client";

import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function QuickStats() {
  const t = useT();

  const stats = [
    { icon: Package,    label: t.home.stats.products, value: "500+",   color: "text-blue-400",     bg: "bg-blue-400/10" },
    { icon: ShoppingBag, label: t.home.stats.orders,  value: "1,240",  color: "text-green-400",    bg: "bg-green-400/10" },
    { icon: Users,       label: t.home.stats.clients, value: "890",    color: "text-purple-400",   bg: "bg-purple-400/10" },
    { icon: TrendingUp,  label: t.home.stats.years,   value: "15+",    color: "text-accent-gold",  bg: "bg-accent-gold/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-black text-text-primary">{stat.value}</p>
              <p className="text-text-muted text-xs">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
