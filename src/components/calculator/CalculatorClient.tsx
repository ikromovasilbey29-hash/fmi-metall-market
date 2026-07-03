"use client";

import { useState } from "react";
import {
  Calculator, ShoppingCart, RefreshCw,
  Minus, Square, AlignJustify, Triangle, Layers, Package, ChevronRight,
} from "lucide-react";
import { calculateMetalWeight, formatPrice, formatWeight } from "@/lib/utils";
import { productsList } from "@/lib/products-data";
import type { MetalShape } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

const metalTypeToCategory: Record<string, string> = {
  armature: "Armatura",
  pipe: "Profil quvur",
  sheet: "List temir",
  angle: "Burchak",
  profile: "I-profil",
};

interface Dimensions {
  diameter?: number; length?: number; count?: number;
  outerDiameter?: number; wallThickness?: number;
  width?: number; thickness?: number;
  side1?: number; side2?: number; height?: number;
}

function getDimsFromSlug(slug: string): Dimensions {
  if (slug.includes("armatura")) {
    const d = slug.match(/d(\d+)/i);
    return { diameter: d ? parseInt(d[1]) : 12, length: 6, count: 1 };
  }
  if (slug.includes("list-temir")) {
    const t = slug.match(/(\d+)mm/);
    return { length: 1.5, width: 6, thickness: t ? parseInt(t[1]) : 3 };
  }
  if (slug.includes("profil-quvur")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    return { outerDiameter: s ? parseInt(s[1]) : 40, wallThickness: s ? parseInt(s[3]) : 2, length: 6, count: 1 };
  }
  if (slug.includes("burchak")) {
    const s = slug.match(/(\d+)x(\d+)x(\d+)/);
    return { side1: s ? parseInt(s[1]) : 40, side2: s ? parseInt(s[2]) : 40, thickness: s ? parseInt(s[3]) : 4, length: 6, count: 1 };
  }
  return { length: 6, count: 1 };
}

function getMetalTypeFromCategory(categoryName?: string): MetalShape {
  if (!categoryName) return "armature";
  if (categoryName === "Armatura") return "armature";
  if (categoryName === "Profil quvur") return "pipe";
  if (categoryName === "List temir") return "sheet";
  if (categoryName === "Burchak") return "angle";
  return "profile";
}

function getDefaultPrice(type: MetalShape): number {
  const prices: Record<MetalShape, number> = { armature: 8200, pipe: 9800, sheet: 12500, angle: 10200, profile: 11000 };
  return prices[type];
}

export default function CalculatorClient() {
  const t = useT();
  const [selectedType, setSelectedType]       = useState<MetalShape>("armature");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [dims, setDims]                       = useState<Dimensions>({ diameter: 12, length: 6, count: 1 });
  const [result, setResult]                   = useState<{ weight: number; price: number; pricePerKg: number } | null>(null);
  const addToCart = useCartStore((s) => s.addItem);

  const metalTypes = [
    { id: "armature", label: t.calculator.armature,  Icon: Minus },
    { id: "pipe",     label: t.calculator.pipe,      Icon: Square },
    { id: "sheet",    label: t.calculator.sheet,     Icon: Layers },
    { id: "angle",    label: t.calculator.angle,     Icon: Triangle },
    { id: "profile",  label: t.calculator.profile,   Icon: AlignJustify },
  ] as const;

  const matchedProducts = productsList.filter(p => p.category?.name === metalTypeToCategory[selectedType]);

  const updateDim = (key: keyof Dimensions, value: number) => { setDims(prev => ({ ...prev, [key]: value })); setResult(null); };

  const handleTypeChange = (type: MetalShape) => {
    setSelectedType(type);
    setSelectedProduct(null);
    setResult(null);
    if (type === "armature") setDims({ diameter: 12, length: 6, count: 1 });
    else if (type === "pipe")    setDims({ outerDiameter: 57, wallThickness: 3.5, length: 6, count: 1 });
    else if (type === "sheet")   setDims({ length: 1.5, width: 6, thickness: 3 });
    else if (type === "angle")   setDims({ side1: 40, side2: 40, thickness: 4, length: 6, count: 1 });
    else if (type === "profile") setDims({ height: 100, width: 50, thickness: 5, length: 6, count: 1 });
  };

  const handleProductSelect = (productId: string) => {
    const product = productsList.find(p => p.id === productId);
    if (!product) return;
    setSelectedProduct(productId);
    setResult(null);
    setSelectedType(getMetalTypeFromCategory(product.category?.name));
    setDims(getDimsFromSlug(product.slug));
  };

  const calculate = () => {
    const weight = calculateMetalWeight({ type: selectedType, density: 7850, dimensions: dims as Record<string, number> });
    const product = selectedProduct ? productsList.find(p => p.id === selectedProduct) : null;
    const pricePerKg = product?.price || getDefaultPrice(selectedType);
    setResult({ weight, price: weight * pricePerKg, pricePerKg });
  };

  const handleAddToCart = () => {
    const product = selectedProduct ? productsList.find(p => p.id === selectedProduct) : null;
    if (product) { addToCart(product, dims.count || 1); toast.success(`${product.name} ${t.product.addToCart}`); }
    else toast(t.calculator.calculate, { icon: "ℹ️" });
  };

  const selectedProductData = selectedProduct ? productsList.find(p => p.id === selectedProduct) : null;

  // O'lcham maydonlari konfiguratsiyasi
  const dimFields: Record<MetalShape, { key: keyof Dimensions; label: string; placeholder: string }[]> = {
    armature: [
      { key: "diameter",  label: t.calculator.diameter, placeholder: "12" },
      { key: "length",    label: t.calculator.length,   placeholder: "6" },
      { key: "count",     label: t.calculator.count,    placeholder: "1" },
    ],
    pipe: [
      { key: "outerDiameter",  label: t.calculator.outerDiameter,  placeholder: "57" },
      { key: "wallThickness",  label: t.calculator.wallThickness,  placeholder: "3.5" },
      { key: "length",         label: t.calculator.length,         placeholder: "6" },
      { key: "count",          label: t.calculator.count,          placeholder: "1" },
    ],
    sheet: [
      { key: "length",    label: t.calculator.sheetLength, placeholder: "1.5" },
      { key: "width",     label: t.calculator.sheetWidth,  placeholder: "6" },
      { key: "thickness", label: t.calculator.thickness,   placeholder: "3" },
    ],
    angle: [
      { key: "side1",     label: t.calculator.side1,     placeholder: "40" },
      { key: "side2",     label: t.calculator.side2,     placeholder: "40" },
      { key: "thickness", label: t.calculator.thickness, placeholder: "4" },
      { key: "length",    label: t.calculator.length,    placeholder: "6" },
      { key: "count",     label: t.calculator.count,     placeholder: "1" },
    ],
    profile: [
      { key: "height",    label: t.calculator.height,    placeholder: "100" },
      { key: "width",     label: t.calculator.width,     placeholder: "50" },
      { key: "thickness", label: t.calculator.wallThickness, placeholder: "5" },
      { key: "length",    label: t.calculator.length,    placeholder: "6" },
      { key: "count",     label: t.calculator.count,     placeholder: "1" },
    ],
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* ===== CHAP: Sozlamalar ===== */}
      <div className="lg:col-span-3 space-y-5">

        {/* 1. Metall turi */}
        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-accent-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold">1</span>
            {t.calculator.metalType}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {metalTypes.map((type) => (
              <button key={type.id} onClick={() => handleTypeChange(type.id as MetalShape)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${selectedType === type.id ? "border-accent-gold bg-accent-gold/10" : "border-border hover:border-border-light bg-bg-panel"}`}>
                <div className="mb-2">
                  <type.Icon size={22} className={selectedType === type.id ? "text-accent-gold" : "text-text-muted"} />
                </div>
                <p className={`text-sm font-medium ${selectedType === type.id ? "text-accent-gold" : "text-text-primary"}`}>{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Mahsulot tanlash */}
        {matchedProducts.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-accent-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold">2</span>
              {t.common.category}
              <span className="text-text-muted text-xs font-normal">({t.adminProducts.imageOptional})</span>
            </h2>
            <div className="space-y-2">
              {matchedProducts.map((product) => (
                <button key={product.id} onClick={() => handleProductSelect(product.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedProduct === product.id ? "border-accent-gold bg-accent-gold/10" : "border-border hover:border-border-light bg-bg-panel"}`}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-card flex-shrink-0">
                    {product.imageUrls[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-text-muted opacity-40" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${selectedProduct === product.id ? "text-accent-gold" : "text-text-primary"}`}>{product.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{formatPrice(product.price)} / {product.unit}</p>
                  </div>
                  {selectedProduct === product.id ? (
                    <div className="w-5 h-5 bg-accent-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-bg-primary text-xs font-bold">✓</span>
                    </div>
                  ) : (
                    <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. O'lchamlar */}
        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-accent-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold">3</span>
            {t.calculator.calculate}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dimFields[selectedType].map((field) => (
              <div key={field.key}>
                <label className="text-text-secondary text-sm mb-1.5 block">{field.label}</label>
                <input
                  type="number" min="0" step="0.1"
                  className="input-field"
                  placeholder={field.placeholder}
                  value={dims[field.key] || ""}
                  onChange={(e) => updateDim(field.key, parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={calculate} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Calculator size={18} /> {t.calculator.calculate}
            </button>
            <button onClick={() => { setResult(null); handleTypeChange(selectedType); setSelectedProduct(null); }}
              className="btn-secondary px-4 flex items-center gap-2" title={t.calculator.reset}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== O'NG: Natija ===== */}
      <div className="lg:col-span-2">
        <div className="card p-6 sticky top-36">
          <h2 className="font-semibold text-text-primary mb-5">{t.calculator.result}</h2>

          {selectedProductData && (
            <div className="flex items-center gap-3 p-3 bg-accent-gold/5 border border-accent-gold/20 rounded-xl mb-5">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-card flex-shrink-0">
                {selectedProductData.imageUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedProductData.imageUrls[0]} alt={selectedProductData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-text-muted opacity-40" /></div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-accent-gold text-xs font-medium">{t.common.category}</p>
                <p className="text-text-primary text-sm font-semibold truncate">{selectedProductData.name}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-bg-panel rounded-xl p-5 border border-border-light text-center">
                <p className="text-text-muted text-sm mb-1">{t.calculator.weight}</p>
                <p className="text-3xl font-black gold-text">{formatWeight(result.weight)}</p>
              </div>
              <div className="bg-bg-panel rounded-xl p-5 border border-border-light text-center">
                <p className="text-text-muted text-sm mb-1">{t.calculator.totalPrice}</p>
                <p className="text-2xl font-black text-text-primary">{formatPrice(result.price)}</p>
                <p className="text-text-muted text-xs mt-1">
                  {formatPrice(result.pricePerKg)}/kg × {formatWeight(result.weight)}
                </p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-text-muted text-xs mb-3 text-center">* {t.common.noData}</p>
                <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> {t.product.addToCart}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Calculator size={48} className="text-text-muted opacity-30 mx-auto mb-4" />
              <p className="text-text-muted text-sm">{t.calculator.subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
