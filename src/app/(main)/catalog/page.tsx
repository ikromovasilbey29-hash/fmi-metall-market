import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/catalog/CatalogClient";
import CatalogHeading from "@/components/catalog/CatalogHeading";

export const metadata: Metadata = {
  title: "Mahsulotlar katalogi",
  description: "Armatura, profil quvur, list temir, burchak va boshqa metall mahsulotlari.",
};

export default function CatalogPage() {
  return (
    <div className="container-main py-8">
      <CatalogHeading />

      {/* useSearchParams uchun Suspense kerak */}
      <Suspense fallback={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-bg-card" />
          ))}
        </div>
      }>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
