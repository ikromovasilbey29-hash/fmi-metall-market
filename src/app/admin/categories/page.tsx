"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, ChevronRight, ArrowLeft, Package } from "lucide-react";
import { productsList as initialProductsList } from "@/lib/products-data";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { useT } from "@/hooks/useT";

const initialCategories = [
  { id: "1", name: "Armatura", slug: "armatura" },
  { id: "2", name: "List temir", slug: "list-temir" },
  { id: "3", name: "Profil quvur", slug: "profil-quvur" },
  { id: "4", name: "Burchak", slug: "burchak" },
  { id: "5", name: "Quduq halqasi", slug: "quduq-halqasi" },
  { id: "6", name: "Sim", slug: "sim" },
  { id: "7", name: "I-profil", slug: "i-profil" },
  { id: "8", name: "Kanal", slug: "kanal" },
];

const units = ["kg", "tonna", "metr", "dona"];

type Category = typeof initialCategories[0];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts]     = useState<Product[]>(initialProductsList);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const t = useT();

  // Kategoriya modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [catSaving, setCatSaving] = useState(false);

  // Mahsulot tanlash modal (mavjud mahsulotlardan)
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSaving, setProductSaving] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Har bir kategoriyaga tegishli mahsulotlar soni
  const getCount = (catName: string) =>
    products.filter((p) => p.category?.name === catName).length;

  // Tanlangan kategoriya mahsulotlari
  const categoryProducts = selectedCategory
    ? products.filter((p) => p.category?.name === selectedCategory.name)
    : [];

  // ===== Kategoriya CRUD =====
  const openAddCat = () => {
    setEditCat(null);
    setCatForm({ name: "", slug: "" });
    setShowCatModal(true);
  };

  const openEditCat = (c: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCat(c);
    setCatForm({ name: c.name, slug: c.slug });
    setShowCatModal(true);
  };

  const handleDeleteCat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cat = categories.find((c) => c.id === id)!;
    const count = getCount(cat.name);
    if (count > 0) {
      toast.error(`Bu kategoriyada ${count} ta mahsulot bor. Avval mahsulotlarni o'chiring.`);
      return;
    }
    if (!confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCategory?.id === id) setSelectedCategory(null);
    toast.success("Kategoriya o'chirildi");
  };

  const handleCatNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setCatForm({ name, slug });
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setCatSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (editCat) {
      setCategories((prev) => prev.map((c) => c.id === editCat.id ? { ...c, ...catForm } : c));
      toast.success("Kategoriya yangilandi");
    } else {
      setCategories((prev) => [...prev, { ...catForm, id: Date.now().toString() }]);
      toast.success("Yangi kategoriya qo'shildi");
    }
    setCatSaving(false);
    setShowCatModal(false);
  };

  // ===== Mahsulot tanlash (mavjud mahsulotlardan) =====
  const openAddProduct = () => {
    setSelectedProductIds([]);
    setProductSearch("");
    setShowProductModal(true);
  };

  // Hali bu kategoriyaga tegishli bo'lmagan mahsulotlar
  const availableProducts = products.filter(
    (p) => p.category?.name !== selectedCategory?.name
  );

  const filteredAvailable = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleProductSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssignProducts = async () => {
    if (selectedProductIds.length === 0) {
      toast.error("Kamida bitta mahsulot tanlang");
      return;
    }
    if (!selectedCategory) return;
    setProductSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    // Tanlangan mahsulotlarning kategoriyasini o'zgartirish
    setProducts((prev) =>
      prev.map((p) =>
        selectedProductIds.includes(p.id)
          ? {
              ...p,
              categoryId: selectedCategory.id,
              category: {
                id: selectedCategory.id,
                name: selectedCategory.name,
                slug: selectedCategory.slug,
                order: 0,
              },
            }
          : p
      )
    );

    setProductSaving(false);
    setShowProductModal(false);
    toast.success(`${selectedProductIds.length} ta mahsulot "${selectedCategory.name}" kategoriyasiga qo'shildi!`);
  };

  // ===== Kategoriya ichki ko'rinishi =====
  if (selectedCategory) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="p-2 rounded-xl hover:bg-bg-card border border-border text-text-muted hover:text-text-primary transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-text-primary flex items-center gap-2">
              {selectedCategory.name}
              <span className="text-text-muted text-xl font-normal">({categoryProducts.length} {t.catalog.productsCount})</span>
            </h1>
            <p className="text-text-muted text-sm mt-0.5">/{selectedCategory.slug}</p>
          </div>
          <button onClick={openAddProduct} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={18} /> Mahsulot qo&apos;shish
          </button>
        </div>

        {/* Mahsulotlar */}
        {categoryProducts.length === 0 ? (
          <div className="card p-16 text-center">
            <Package size={56} className="text-text-muted opacity-30 mx-auto mb-4" />
            <p className="text-text-primary font-semibold mb-2">Bu kategoriyada mahsulot yo&apos;q</p>
            <p className="text-text-muted text-sm mb-6">
              Quyidagi tugmani bosib bu kategoriyaga mahsulot qo&apos;shing
            </p>
            <button onClick={openAddProduct} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Mahsulot qo&apos;shish
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Rasm", "Nomi", "Narx", "Zaxira", "Holat"].map((h) => (
                    <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoryProducts.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-panel flex-shrink-0">
                        {p.imageUrls[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={18} className="text-text-muted opacity-40" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-text-primary text-sm font-medium">{p.name}</p>
                      {p.isPopular && (
                        <span className="text-xs bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          Ommabop
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-accent-gold font-bold text-sm">{formatPrice(p.price)}</p>
                      <p className="text-text-muted text-xs">/{p.unit}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${p.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                        {p.stock > 0 ? `${p.stock.toLocaleString()} ${p.unit}` : "Tugagan"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        p.stock > 0
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {p.stock > 0 ? "Faol" : "Tugagan"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mahsulot tanlash modali */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
            <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-lg shadow-card animate-slide-up flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
                <div>
                  <h3 className="font-bold text-text-primary">{t.adminCategories.productSelectModalTitle}</h3>
                  <p className="text-text-muted text-xs mt-0.5">
                    Kategoriya: <span className="text-accent-gold font-medium">{selectedCategory.name}</span>
                    {selectedProductIds.length > 0 && (
                      <span className="ml-2 text-accent-gold">· {selectedProductIds.length} ta tanlandi</span>
                    )}
                  </p>
                </div>
                <button onClick={() => setShowProductModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                  <X size={18} />
                </button>
              </div>

              {/* Qidiruv */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    className="input-field pl-9 text-sm"
                    placeholder="Mahsulot nomi yoki kategoriya..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    autoFocus
                  />
                  <Package size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>

              {/* Mahsulotlar ro'yxati */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {filteredAvailable.length === 0 ? (
                  <div className="text-center py-10">
                    <Package size={36} className="text-text-muted opacity-30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">
                      {productSearch ? `"${productSearch}" topilmadi` : "Barcha mahsulotlar allaqachon bu yoki boshqa kategoriyalarda"}
                    </p>
                  </div>
                ) : (
                  filteredAvailable.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProductSelect(p.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-accent-gold bg-accent-gold/10"
                            : "border-border hover:border-border-light bg-bg-panel"
                        }`}
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? "border-accent-gold bg-accent-gold" : "border-border"
                        }`}>
                          {isSelected && <span className="text-bg-primary text-xs font-black">✓</span>}
                        </div>

                        {/* Rasm */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-card flex-shrink-0">
                          {p.imageUrls[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageUrls[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-text-muted opacity-40" />
                            </div>
                          )}
                        </div>

                        {/* Ma'lumot */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isSelected ? "text-accent-gold" : "text-text-primary"}`}>
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-text-muted">{p.category?.name || "Kategoriyasiz"}</span>
                            <span className="text-xs text-accent-gold font-medium">{formatPrice(p.price)}/{p.unit}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border flex-shrink-0 flex gap-3">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary flex-1">
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleAssignProducts}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  disabled={productSaving || selectedProductIds.length === 0}
                >
                  {productSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {selectedProductIds.length > 0
                    ? `${selectedProductIds.length} ta qo'shish`
                    : "Tanlang"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== Asosiy kategoriyalar ro'yxati =====
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminCategories.title}</h1>
          <p className="text-text-muted text-sm mt-1">{categories.length} ta kategoriya</p>
        </div>
        <button onClick={openAddCat} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminCategories.addCategory}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border bg-bg-panel">
          <p className="text-text-muted text-xs">{t.adminCategories.subtitle}</p>
        </div>
        <div className="divide-y divide-border">
          {categories.map((cat) => {
            const count = getCount(cat.name);
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-bg-panel/50 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 bg-accent-gold/10 border border-accent-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold font-bold text-sm">{cat.name[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium text-sm group-hover:text-accent-gold transition-colors">{cat.name}</p>
                  <p className="text-text-muted text-xs">/{cat.slug}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  count > 0
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-bg-panel text-text-muted border-border"
                }`}>
                  {count} mahsulot
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => openEditCat(cat, e)}
                    className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent-gold transition-all"
                    title="Tahrirlash"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCat(cat.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                    title="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <ChevronRight size={16} className="text-text-muted group-hover:text-accent-gold transition-colors" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Kategoriya modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCatModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary">{editCat ? t.adminCategories.editModalTitle : t.adminCategories.newModalTitle}</h3>
              <button onClick={() => setShowCatModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveCat} className="p-5 space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminCategories.categoryName} *</label>
                <input
                  className="input-field"
                  value={catForm.name}
                  onChange={(e) => handleCatNameChange(e.target.value)}
                  required
                  placeholder="Armatura"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminCategories.slug} (URL)</label>
                <input
                  className="input-field font-mono text-sm"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  placeholder="armatura"
                />
                <p className="text-text-muted text-xs mt-1">{t.adminCategories.slugAutoHint}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCatModal(false)} className="btn-secondary flex-1">{t.adminCategories.cancel}</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={catSaving}>
                  {catSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editCat ? t.adminCategories.save : t.adminCategories.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
