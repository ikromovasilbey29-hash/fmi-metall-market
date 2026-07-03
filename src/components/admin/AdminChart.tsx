"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useT } from "@/hooks/useT";

const rawValues = [
  { savdo: 32000000, buyurtma: 145 },
  { savdo: 28000000, buyurtma: 120 },
  { savdo: 38000000, buyurtma: 178 },
  { savdo: 42000000, buyurtma: 200 },
  { savdo: 39000000, buyurtma: 185 },
  { savdo: 45000000, buyurtma: 220 },
];

function CustomTooltip({ active, payload, label, currency }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  currency: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-3 shadow-card">
        <p className="text-text-muted text-xs mb-2">{label}</p>
        <p className="text-accent-gold font-bold text-sm">
          {(payload[0].value / 1000000).toFixed(1)}M {currency}
        </p>
      </div>
    );
  }
  return null;
}

export default function AdminChart() {
  const t = useT();
  const data = t.adminDashboard.chartMonths.map((month, i) => ({ month, ...rawValues[i] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6B6B6B", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B6B6B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
        />
        <Tooltip content={<CustomTooltip currency={t.common.currency} />} cursor={{ fill: "rgba(212,175,55,0.05)" }} />
        <Bar dataKey="savdo" fill="#D4AF37" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
