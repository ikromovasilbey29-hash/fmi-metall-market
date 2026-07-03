"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { AdminProduct, lsLoad, lsSave, stockStatus } from "@/lib/admin-products";
import { useT } from "@/hooks/useT";

function ImageCell({ url }: { url: string }) {
  const [err, setErr] = useState(false);
  if (!url || err) return <Package size={16} className="text-text-muted opacity-30" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const t = useT();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("Hammasi");

  useEffect(() => { setProducts(lsLoad()); }, []);

  const allCats = [t.common.all, ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const mt = catFilter === t.common.all || catFilter === "Hammasi" || p.category === catFilter;
    const q  = search.trim().toLowerCase();
    const ms = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return mt && ms;
  });

  const handleDelete = (p: AdminProduct) => {
    if (!confirm(`"${p.name}" ${t.adminProducts.deleteConfirm}`)) return;
    const updated = products.filter(x => x.id !== p.id);
    lsSave(updated);
    setProducts(updated);
    toast.success(t.adminProducts.deleted);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminProducts.title}</h1>
          <p className="text-text-muted text-sm mt-1">{products.length} {t.catalog.productsCount}</p>
        </div>
        <button onClick={() => router.push("/admin/products/new")}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminProducts.addNew}
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder={t.adminProducts.searchPlaceholder}
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                catFilter === c ? "bg-accent-gold text-bg-primary" : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-panel/60">
                {[t.adminProducts.tableNum, t.adminProducts.tableProduct, t.adminProducts.tableCategory, t.adminProducts.tablePrice, t.adminProducts.tableStock, t.adminProducts.tableMinStock, t.adminProducts.tableStatus, t.adminProducts.tableActions].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-text-muted text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-text-muted">
                    <Package size={36} className="opacity-20 mx-auto mb-2" />
                    {t.adminProducts.notFound}
                  </td>
                </tr>
              ) : filtered.map((p, idx) => {
                const st = stockStatus(p.stock, p.minStock);
                const isLow = p.stock > 0 && p.stock < p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-bg-panel/40 transition-colors group">
                    <td className="py-4 px-4 text-text-muted text-sm">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-bg-panel border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ImageCell url={p.imageUrl} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-text-primary font-bold text-sm leading-snug">{p.name}</p>
                          {p.description && <p className="text-text-muted text-xs mt-0.5 line-clamp-1 max-w-[240px]">{p.description}</p>}
                          {p.badge && (
                            <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded font-medium border ${
                              p.badge === "Yangi" || p.badge === "Новинка" ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                              : p.badge === "Ommabop" || p.badge === "Популярно" ? "bg-purple-500/15 text-purple-400 border-purple-500/25"
                              : "bg-accent-gold/15 text-accent-gold border-accent-gold/25"
                            }`}>{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-secondary text-sm">{p.category}</td>
                    <td className="py-4 px-4">
                      <p className="text-green-400 font-bold text-sm">{formatPrice(p.price)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`font-bold text-sm ${isLow ? "text-orange-400" : p.stock <= 0 ? "text-red-400" : "text-text-primary"}`}>
                        {p.stock <= 0 ? "—" : `${p.stock} ${p.unit}`}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-text-muted text-sm">{p.minStock} {p.unit}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                          className="px-3 py-1.5 rounded-xl bg-bg-panel border border-border text-text-secondary hover:text-text-primary hover:border-accent-gold/40 text-xs font-medium transition-all">
                          {t.adminProducts.editBtn}
                        </button>
                        <button onClick={() => handleDelete(p)}
                          className="p-1.5 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-bg-panel/30 flex items-center justify-between">
            <p className="text-text-muted text-xs">{filtered.length} {t.adminProducts.shown}</p>
            <p className="text-text-muted text-xs">
              {t.adminProducts.emptyLabel} <span className="text-red-400 font-medium">{filtered.filter(p => p.stock <= 0).length}</span>
              {" · "}
              {t.adminProducts.lowLabel} <span className="text-orange-400 font-medium">{filtered.filter(p => p.stock > 0 && p.stock < p.minStock).length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
