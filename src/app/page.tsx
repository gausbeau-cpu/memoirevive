"use client";

import React, { useState } from "react";
import TrustBar from "@/components/TrustBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileBar from "@/components/StickyMobileBar";
import OrderModal from "@/components/OrderModal/OrderModal";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("format_40x60");

  const handleOpenOrderModal = (formatId: string = "format_40x60") => {
    setSelectedFormat(formatId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg relative pb-24 md:pb-0">
      {/* 1. Bandeau de réassurance supérieur */}
      <TrustBar />

      {/* 2. Header & Logo typographique */}
      <Header onOpenOrderModal={() => handleOpenOrderModal("format_40x60")} />

      {/* Contenu principal */}
      <main className="flex-1">
        {/* 3. Hero Section + Comparateur Avant/Après */}
        <Hero onOpenOrderModal={() => handleOpenOrderModal("format_40x60")} />

        {/* 4. Comment ça marche en 3 étapes */}
        <HowItWorks />

        {/* 5. Les 3 formats (Petit 30x40, Coup de cœur 40x60, Grand 50x70) */}
        <PricingSection onSelectPackage={(formatId) => handleOpenOrderModal(formatId)} />

        {/* 6. Garantie Zéro Risque */}
        <GuaranteeSection />

        {/* 7. Témoignages (désactivés tant qu'aucun avis réel n'est collecté) */}
        <Testimonials />

        {/* 8. Questions fréquentes */}
        <FAQSection />

        {/* 9. Appel à l'action final */}
        <FinalCTA onOpenOrderModal={() => handleOpenOrderModal("format_40x60")} />
      </main>

      {/* 10. Pied de page */}
      <Footer />

      {/* 11. Barre fixe mobile au bas de l'écran */}
      <StickyMobileBar onOpenOrderModal={() => handleOpenOrderModal("format_40x60")} />

      {/* 12. Formulaire de commande mono-écran ultra-rapide (< 45s) */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        initialPackage={selectedFormat}
      />
    </div>
  );
}
