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
  title: "Mémoire Vive | Tableaux photo cadeaux d’anniversaire à Ouagadougou",
  description:
    "Le plus beau cadeau pour son anniversaire : sa photo préférée sur un vrai tableau monté sur panneau PVC. Aperçu gratuit sous 24 h avant paiement, livraison gratuite à Ouagadougou.",
  keywords: [
    "tableau photo personnalisé",
    "cadeau anniversaire Ouagadougou",
    "Mémoire Vive",
    "photo anniversaire Burkina Faso",
    "tirage tableau PVC Ouaga",
  ],
  openGraph: {
    title: "Mémoire Vive — Tableaux photo personnalisés pour cadeaux d’anniversaire",
    description:
      "Aperçu 100 % gratuit avant tout paiement. Retouche de portrait, message personnalisé et tirage PVC livré à Ouagadougou.",
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
