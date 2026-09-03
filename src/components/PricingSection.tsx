"use client";

import React from "react";
import { CheckCircle2, Sparkles, Star, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PricingSectionProps {
  onSelectPackage: (pkg: string) => void;
}

export default function PricingSection({ onSelectPackage }: PricingSectionProps) {
  const packages = [
    {
      id: "souvenir",
      name: "Souvenir",
      tagline: "L'essentiel pour redécouvrir un instant précieux",
      price: 10000,
      format: "Cadre simple · 13 x 18 cm",
      isPopular: false,
      features: [
        "Restauration numérique basique des rayures et plis",
        "Cadre photo sobre et soigné prêt à poser",
        "Aperçu gratuit avant tout paiement",
        "Livraison soignée à Ouagadougou",
      ],
      buttonText: "Choisir le forfait Souvenir",
      buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
    },
    {
      id: "memoire",
      name: "Mémoire",
      tagline: "Le chef-d'œuvre le plus apprécié pour offrir ou préserver",
      price: 20000,
      format: "Cadre Bois Noble · 20 x 30 cm",
      isPopular: true,
      features: [
        "Restauration avancée ultra-nette des visages et détails",
        "Cadre en bois véritable qui dure toute une vie (20x30cm)",
        "Colorisation complète des photos Noir et Blanc",
        "Fichier numérique Haute Définition envoyé par WhatsApp",
        "Carte message personnalisée incluse",
        "Bon de réduction de 20% sur la prochaine commande",
      ],
      buttonText: "Choisir le forfait Mémoire",
      buttonClass: "bg-brand-purple hover:bg-brand-purple-hover text-white shadow-glow-purple",
    },
    {
      id: "heritage",
      name: "Héritage",
      tagline: "Le prestige intemporel pour vos trésors de famille",
      price: 35000,
      format: "Grand Cadre Galerie · 30 x 40 cm",
      isPopular: false,
      badgeText: "Finition Prestige",
      features: [
        "Restauration d'art premium avec retouches manuelles minutieuses",
        "Grand cadre artisanal haut de gamme (30x40cm)",
        "Colorisation prestige ultra-réaliste et fichier HD Master",
        "Petit tirage 10x15cm supplémentaire offert",
        "Carte message personnalisée incluse",
        "Bon de réduction de 20% sur la prochaine commande",
      ],
      buttonText: "Choisir le forfait Héritage",
      buttonClass: "bg-brand-gold hover:bg-brand-gold-hover text-white shadow-glow-gold",
    },
  ];

  // Mobile Order: Mémoire in first place, then Souvenir, then Héritage
  const mobilePackages = [
    packages.find((p) => p.id === "memoire")!,
    packages.find((p) => p.id === "souvenir")!,
    packages.find((p) => p.id === "heritage")!,
  ];

  const renderCard = (pkg: typeof packages[0], isDesktopCentered: boolean = false) => {
    return (
      <div
        key={pkg.id}
        className={`relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
          pkg.isPopular
            ? "bg-brand-purple-soft border-2 border-brand-purple shadow-warm-card-hover ring-4 ring-brand-purple/10 pt-10 sm:pt-11 " +
              (isDesktopCentered ? "lg:-translate-y-4" : "")
            : "bg-white border border-brand-border/80 shadow-warm-card hover:shadow-warm-card-hover pt-8 sm:pt-9"
        }`}
      >
        {/* Popular Badge for Mémoire: Pill + Subtext underneath */}
        {pkg.isPopular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 w-full px-2">
            <div className="bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-purple text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-glow-purple uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
              <span>Le plus choisi</span>
            </div>
            <span className="text-[11px] font-semibold text-brand-purple bg-white border border-brand-purple/20 px-2.5 py-0.5 rounded-full mt-1 shadow-xs whitespace-nowrap">
              85% de nos clients le choisissent
            </span>
          </div>
        )}

        {/* Card Header & Content */}
        <div>
          {/* Top Badge area for non-popular cards to maintain alignment */}
          <div className="h-6 mb-2 flex items-center justify-center">
            {!pkg.isPopular && pkg.badgeText && (
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-600" strokeWidth={2} />
                <span>{pkg.badgeText}</span>
              </div>
            )}
          </div>

          {/* Centered Name */}
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal text-center">
            {pkg.name}
          </h3>

          {/* Centered Frame Type & Size */}
          <div className="flex justify-center mt-2">
            <span className="text-xs font-bold text-brand-purple bg-brand-purple-light px-3.5 py-1 rounded-full text-center">
              {pkg.format}
            </span>
          </div>

          {/* Centered Tagline */}
          <p className="text-xs sm:text-sm text-brand-muted mt-2.5 text-center min-h-[36px] max-w-xs mx-auto leading-relaxed">
            {pkg.tagline}
          </p>

          {/* Centered Price & Reassurance */}
          <div className="mt-4 mb-6 pb-6 border-b border-brand-border/60 text-center flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-heading font-black text-brand-charcoal">
                {formatPrice(pkg.price)}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold mt-1.5 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2} />
              <span>0 FCFA maintenant · Paiement après aperçu</span>
            </p>
          </div>

          {/* Features List with Lucide CheckCircle2 */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Ce qui est inclus :
            </p>
            {pkg.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-charcoal">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    pkg.isPopular ? "bg-brand-purple text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button (Pill format) */}
        <div className="pt-2">
          <button
            onClick={() => onSelectPackage(pkg.id)}
            className={`w-full min-h-[48px] py-3.5 px-5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${pkg.buttonClass}`}
          >
            <span>{pkg.buttonText}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
          <p className="text-center text-[11px] text-brand-muted mt-2 font-medium">
            Aperçu gratuit · Sans engagement
          </p>
        </div>
      </div>
    );
  };

  return (
    <section id="forfaits" className="py-14 sm:py-24 relative bg-[#FFFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-magenta bg-brand-magenta-light px-3.5 py-1.5 rounded-full">
            Tarifs Clairs & Forfaits Complets
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            3 forfaits simples. Zéro frais caché.
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Pas de configurateur complexe. Choisissez le format qui convient à votre souvenir. Vous ne payez qu'après avoir validé l'aperçu gratuit.
          </p>
        </div>

        {/* Mobile Viewport: Stacked vertically with Mémoire shown first */}
        <div className="flex flex-col md:hidden space-y-6 pt-4">
          {mobilePackages.map((pkg) => renderCard(pkg, false))}
        </div>

        {/* Desktop Viewport: 3 in line with Mémoire centered & elevated */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-6">
          {packages.map((pkg) => renderCard(pkg, true))}
        </div>

      </div>
    </section>
  );
}
