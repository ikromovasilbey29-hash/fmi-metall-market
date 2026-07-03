"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X, Folder, SearchX, Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useAllProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products: allProducts, loading } = useAllProducts();
  const t = useT();

  const urlCategory = searchParams.get("category") || "";
  const urlSearch   = searchParams.get("search") || "";
  const [sort, setSort]         = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortOptions = [
    { value: "default", label: t.catalog.sortDefault },
    { value: "price-asc", label: t.catalog.sortPriceAsc },
    { value: "price-desc", label: t.catalog.sortPriceDesc },
    { value: "name-asc", label: t.catalog.sortNameAsc },
  ];

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (urlCategory && urlCategory !== "Hammasi") {
      result = result.filter(p => p.category?.name === urlCategory);
    }
    const q = urlSearch.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [allProducts, urlCategory, urlSearch, sort]);

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/catalog?${params.toString()}`);
  };
  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/catalog?${params.toString()}`);
  };
  const clearAll = () => router.push("/catalog");

  const hasFilter = (urlCategory && urlCategory !== "Hammasi") || urlSearch.trim() !== "";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="text-accent-gold animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Faol filterlar */}
      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-text-muted text-sm">{t.catalog.filterLabel}</span>
          {urlCategory && urlCategory !== "Hammasi" && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-sm font-medium rounded-lg">
              <Folder size={13} /> {urlCategory}
              <button onClick={clearCategory} className="hover:text-red-400 transition-colors ml-0.5"><X size={13} /></button>
            </span>
          )}
          {urlSearch.trim() && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg">
              <Search size={13} /> &quot;{urlSearch}&quot;
              <button onClick={clearSearch} className="hover:text-red-400 transition-colors ml-0.5"><X size={13} /></button>
            </span>
          )}
          <button onClick={clearAll} className="text-text-muted hover:text-red-400 text-xs transition-colors underline">
            {t.catalog.clearAll}
          </button>
        </div>
      )}

      {/* Sort va View */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-text-muted text-sm">
          <span className="text-text-primary font-semibold">{filtered.length}</span> {t.catalog.productsCount}
        </p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-bg-card border border-border text-text-secondary text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-gold"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-accent-gold text-bg-primary" : "bg-bg-card text-text-muted hover:text-text-primary"}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-accent-gold text-bg-primary" : "bg-bg-card text-text-muted hover:text-text-primary"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className={viewMode === "grid" ? "product-grid" : "space-y-3"}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <SearchX size={56} className="text-text-muted opacity-40 mx-auto mb-4" />
          <p className="text-text-secondary mb-2 text-lg font-semibold">{t.catalog.notFound}</p>
          <p className="text-text-muted text-sm mb-4">
            {urlSearch
              ? `"${urlSearch}" ${t.catalog.notFoundSearch}`
              : t.catalog.notFoundCategory}
          </p>
          <button onClick={clearAll} className="btn-secondary text-sm">
            {t.catalog.viewAll}
          </button>
        </div>
      )}
    </div>
  );
}
