import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mémoire Vive | Restauration & Encadrement de Photos à Ouagadougou",
  description:
    "Offrez une seconde vie à vos photos de famille les plus précieuses. Aperçu gratuit avant paiement, retouche IA & artisanale, livraison à Ouagadougou.",
  keywords: [
    "restauration photo",
    "encadrement Ouagadougou",
    "Mémoire Vive",
    "cadeau personnalisé Burkina",
    "photos de famille",
    "retouche photo IA",
  ],
  openGraph: {
    title: "Mémoire Vive — Restauration & Encadrement de Photos",
    description:
      "Aperçu gratuit avant tout paiement. Redonnez vie à vos souvenirs de famille et recevez un cadre en bois noble livré à Ouagadougou.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-charcoal antialiased selection:bg-brand-purple/20 selection:text-brand-purple">
        {children}
      </body>
    </html>
  );
}
