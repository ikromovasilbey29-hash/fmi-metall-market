import type { Metadata } from "next";
import ProductDetailWrapper from "@/components/products/ProductDetailWrapper";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: "Mahsulot",
    description: "Metall mahsulot tafsilotlari",
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProductDetailWrapper slug={params.slug} />;
}
