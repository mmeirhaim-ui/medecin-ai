import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Medecin AI — Orientation médicale assistée",
  description:
    "Décrivez vos symptômes, ajoutez des photos si besoin, et recevez une orientation prudente (pas un diagnostic). En français.",
  openGraph: {
    title: "Medecin AI",
    description:
      "Assistant d’orientation médicale : symptômes, photos, urgences.",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="relative z-0 flex min-h-full flex-col text-[var(--ink)]">
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
