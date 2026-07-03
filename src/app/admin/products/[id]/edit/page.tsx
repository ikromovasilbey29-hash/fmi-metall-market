"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { CATEGORIES, UNITS, EMPTY_FORM, lsLoad, lsSave } from "@/lib/admin-products";
import type { AdminProduct } from "@/lib/admin-products";
import ImageUploader from "@/components/admin/ImageUploader";
import { useT } from "@/hooks/useT";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const t = useT();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = lsLoad();
    const found = all.find(p => p.id === id) || null;
    setProduct(found);
    if (found) {
      setForm({ name: found.name, description: found.description, category: found.category, unit: found.unit, price: found.price, stock: found.stock, minStock: found.minStock, badge: found.badge, specs: found.specs, imageUrl: found.imageUrl, isPopular: found.isPopular, isNew: found.isNew });
    }
    setLoading(false);
  }, [id]);

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error(t.adminProducts.productName + "!"); return; }
    if (form.price <= 0)   { toast.error(t.adminProducts.priceLabel + "!"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 350));
    const all = lsLoad();
    const updated = all.map(p => p.id === id ? { ...p, ...form, updatedAt: new Date().toISOString() } : p);
    lsSave(updated);
    toast.success(t.admin.updated + " ✓");
    router.push("/admin/products");
  };

  const handleDelete = () => {
    if (!confirm(`"${product?.name}" ${t.adminProducts.deleteConfirm}`)) return;
    lsSave(lsLoad().filter(p => p.id !== id));
    toast.success(t.adminProducts.deleted);
    router.push("/admin/products");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="text-accent-gold animate-spin" /></div>;
  if (!product) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-text-secondary">{t.adminProducts.notFound}</p>
      <button onClick={() => router.push("/admin/products")} className="btn-primary flex items-center gap-2"><ArrowLeft size={16} /> {t.common.back}</button>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-7">
        <button onClick={() => router.push("/admin/products")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group">
          <span className="w-8 h-8 rounded-xl bg-bg-card border border-border flex items-center justify-center group-hover:border-accent-gold/40 transition-colors">
            <ArrowLeft size={16} />
          </span>
          <span className="text-sm font-medium">{t.adminProducts.backToProducts}</span>
        </button>
        <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-card border border-border text-text-secondary hover:text-red-400 hover:border-red-500/40 text-sm transition-all">
          <Trash2 size={15} /> {t.common.delete}
        </button>
      </div>

      <h1 className="text-2xl font-black text-text-primary mb-6">{t.adminProducts.editTitle}</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.categoryLabel} *</label>
            <select className="input-field" value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.unitLabel} *</label>
            <select className="input-field" value={form.unit} onChange={e => set("unit", e.target.value)}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.productName} *</label>
          <input autoFocus required type="text" className="input-field" placeholder={t.adminProducts.productNamePlaceholder} value={form.name} onChange={e => set("name", e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.descriptionLabel} *</label>
          <textarea rows={4} className="input-field resize-y" placeholder={t.adminProducts.descriptionPlaceholder} value={form.description} onChange={e => set("description", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.priceLabel} *</label>
            <input type="number" min={0} required className="input-field" placeholder={t.adminProducts.pricePlaceholder} value={form.price || ""} onChange={e => set("price", +e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.badgeLabel} <span className="font-normal text-text-muted">{t.adminProducts.badgeOptional}</span></label>
            <input type="text" className="input-field" placeholder={t.adminProducts.badgePlaceholder} value={form.badge} onChange={e => set("badge", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.stockLabel} *</label>
            <input type="number" min={0} required className="input-field" placeholder="100" value={form.stock || ""} onChange={e => set("stock", +e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.minStockLabel} *</label>
            <input type="number" min={0} required className="input-field" placeholder="20" value={form.minStock || ""} onChange={e => set("minStock", +e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.specsLabel} <span className="font-normal text-text-muted">{t.adminProducts.specsHint}</span></label>
          <input type="text" className="input-field" placeholder={t.adminProducts.specsPlaceholder} value={form.specs} onChange={e => set("specs", e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t.adminProducts.imageLabel} <span className="font-normal text-text-muted">{t.adminProducts.imageOptional}</span></label>
          <ImageUploader value={form.imageUrl} onChange={val => set("imageUrl", val)} />
        </div>

        <div className="flex gap-3 pt-2 pb-6">
          <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary flex-1">{t.common.cancel}</button>
          <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-40">
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {t.adminProducts.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}
