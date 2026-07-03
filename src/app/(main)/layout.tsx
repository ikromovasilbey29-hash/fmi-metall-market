import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SupportWidget from "@/components/layout/SupportWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />
      <main className="pt-[112px] flex-1">{children}</main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
