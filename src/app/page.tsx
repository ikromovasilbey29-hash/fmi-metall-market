import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AboutSection from "@/components/landing/AboutSection";
import GallerySection from "@/components/landing/GallerySection";
import LocationSection from "@/components/landing/LocationSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <GallerySection />
      <LocationSection />
      <LandingFooter />
    </main>
  );
}
