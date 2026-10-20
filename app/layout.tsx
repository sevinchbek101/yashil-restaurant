import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import PremiumMotion from "@/components/PremiumMotion";

export const metadata: Metadata = {
  title: "YASHIL BOWL — Sog‘lom taomlar",
  description: "Yangi va foydali bowl hamda salatlar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <a className="skipLink" href="#main-content">Asosiy mazmunga o‘tish</a>
        <PremiumMotion />
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}

