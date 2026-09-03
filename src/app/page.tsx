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
  const [selectedPackage, setSelectedPackage] = useState<string>("memoire");

  const handleOpenOrderModal = (pkgId: string = "memoire") => {
    setSelectedPackage(pkgId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg relative pb-16 md:pb-0">
      {/* 1. Bandeau de Réassurance Supérieur */}
      <TrustBar />

      {/* Header & Logo */}
      <Header onOpenOrderModal={() => handleOpenOrderModal("memoire")} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section + Curseur Interactif Avant/Après */}
        <Hero onOpenOrderModal={() => handleOpenOrderModal("memoire")} />

        {/* 3. Comment ça marche (3 étapes Cialdini/Hick) */}
        <HowItWorks />

        {/* 4. Les 3 Forfaits (Souvenir, Mémoire [Best-seller], Héritage) */}
        <PricingSection onSelectPackage={(pkgId) => handleOpenOrderModal(pkgId)} />

        {/* 5. Garantie Inconditionnelle & Renversement du Risque */}
        <GuaranteeSection />

        {/* 6. Preuve Sociale Locale (Ouagadougou) */}
        <Testimonials />

        {/* 7. FAQ Courte & Précise */}
        <FAQSection />

        {/* 8. Appel à l'Action Final */}
        <FinalCTA onOpenOrderModal={() => handleOpenOrderModal("memoire")} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Bar on Mobile */}
      <StickyMobileBar onOpenOrderModal={() => handleOpenOrderModal("memoire")} />

      {/* 4-Step Interactive Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        initialPackage={selectedPackage}
      />
    </div>
  );
}
