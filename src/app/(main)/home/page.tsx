import HeroBanner from "@/components/home/HeroBanner";
import PopularProducts from "@/components/home/PopularProducts";
import LatestBlogPosts from "@/components/home/LatestBlogPosts";
import QuickStats from "@/components/home/QuickStats";

export default function HomePage() {
  return (
    <div className="container-main py-6 space-y-12">
      <HeroBanner />
      <QuickStats />
      <PopularProducts />
      <LatestBlogPosts />
    </div>
  );
}
