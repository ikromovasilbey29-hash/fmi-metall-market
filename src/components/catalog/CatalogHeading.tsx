"use client";

import { useT } from "@/hooks/useT";

export default function CatalogHeading() {
  const t = useT();
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-text-primary mb-1">
        {t.catalog.title} <span className="gold-text">{t.catalog.titleHighlight}</span>
      </h1>
      <p className="text-text-muted text-sm">
        {t.catalog.subtitle}
      </p>
    </div>
  );
}
