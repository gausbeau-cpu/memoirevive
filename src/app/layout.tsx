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
  viewportFit: "cover",
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
  icons: {
    icon: [
      { url: "/brand/memoire-vive-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/memoire-vive-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/memoire-vive-icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/memoire-vive-favicon.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/brand/memoire-vive-icon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/brand/memoire-vive-icon-16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/brand/memoire-vive-icon.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/brand/memoire-vive-favicon.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-charcoal antialiased selection:bg-brand-purple/20 selection:text-brand-purple">
        {children}
      </body>
    </html>
  );
}
