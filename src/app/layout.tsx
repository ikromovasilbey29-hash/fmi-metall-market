import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "F.M.I Metall Market — Metall mahsulotlari savdosi",
    template: "%s | F.M.I Metall Market",
  },
  description:
    "Buxoro viloyati, G'ijduvon tumanidagi F.M.I Metall Market — armatura, profil quvur, list temir, burchak va boshqa metall mahsulotlari. Onlayn buyurtma bering!",
  keywords: [
    "metall",
    "armatura",
    "quvur",
    "list temir",
    "metall bozori",
    "G'ijduvon",
    "Buxoro",
    "FMI Metall Market",
  ],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "F.M.I Metall Market",
    title: "F.M.I Metall Market — Metall mahsulotlari savdosi",
    description:
      "Buxoro viloyati, G'ijduvon tumanidagi F.M.I Metall Market — armatura, profil quvur, list temir va boshqa metall mahsulotlari.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className={`${inter.className} bg-bg-primary text-text-primary antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1F1F1F",
              color: "#F5F5F5",
              border: "1px solid #2A2A2A",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#D4AF37",
                secondary: "#0A0A0A",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
