import type { Metadata } from "next";
import CalculatorClient from "@/components/calculator/CalculatorClient";
import CalculatorHeading from "@/components/calculator/CalculatorHeading";

export const metadata: Metadata = {
  title: "Metall og'irlik kalkulyatori",
  description: "Metall og'irligi va narxini online hisoblang — armatura, quvur, list temir, burchak va boshqalar.",
};

export default function CalculatorPage() {
  return (
    <div className="container-main py-8">
      <CalculatorHeading />
      <CalculatorClient />
    </div>
  );
}
