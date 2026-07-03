"use client";

import { Calculator } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function CalculatorHeading() {
  const t = useT();
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-text-primary mb-2 flex items-center gap-3">
        <Calculator size={28} className="text-accent-gold" />
        {t.calculator.title} <span className="gold-text">{t.calculator.titleHighlight}</span>
      </h1>
      <p className="text-text-secondary">
        {t.calculator.subtitle}
      </p>
    </div>
  );
}
