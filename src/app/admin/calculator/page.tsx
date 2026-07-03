"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

export default function AdminCalculatorPage() {
  const t = useT();
  const [saving, setSaving] = useState(false);
  const [prices, setPrices] = useState({
    armature: 8200,
    pipe: 9800,
    sheet: 12500,
    angle: 10200,
    profile: 11000,
  });
  const [densities, setDensities] = useState({
    steel: 7850,
    aluminum: 2700,
    copper: 8900,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success(t.adminCalculator.toastSaved);
  };

  const priceFields = [
    { label: t.adminCalculator.priceArmature, key: "armature" as const },
    { label: t.adminCalculator.pricePipe, key: "pipe" as const },
    { label: t.adminCalculator.priceSheet, key: "sheet" as const },
    { label: t.adminCalculator.priceAngle, key: "angle" as const },
    { label: t.adminCalculator.priceProfile, key: "profile" as const },
  ];

  const densityFields = [
    { label: t.adminCalculator.densitySteel, key: "steel" as const },
    { label: t.adminCalculator.densityAluminum, key: "aluminum" as const },
    { label: t.adminCalculator.densityCopper, key: "copper" as const },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminCalculator.title}</h1>
          <p className="text-text-muted text-sm mt-1">{t.adminCalculator.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Narxlar */}
        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent-gold" />
            {t.adminCalculator.currentPricesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceFields.map((item) => (
              <div key={item.key}>
                <label className="text-text-secondary text-sm mb-1.5 block">{item.label}</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input-field pr-20"
                    value={prices[item.key]}
                    onChange={(e) => setPrices({ ...prices, [item.key]: +e.target.value })}
                    min={0}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">{t.adminCalculator.priceUnit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zichlik */}
        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent-gold" />
            {t.adminCalculator.densityTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {densityFields.map((item) => (
              <div key={item.key}>
                <label className="text-text-secondary text-sm mb-1.5 block">{item.label}</label>
                <div className="relative">
                  <input
                    type="number"
                    className="input-field pr-20"
                    value={densities[item.key]}
                    onChange={(e) => setDensities({ ...densities, [item.key]: +e.target.value })}
                    min={0}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">{t.adminCalculator.densityUnit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
          {saving ? <><Loader2 size={18} className="animate-spin" /> {t.adminCalculator.saving}</> : <><Save size={18} /> {t.adminCalculator.save}</>}
        </button>
      </form>
    </div>
  );
}
