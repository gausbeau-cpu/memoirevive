"use client";

import React from "react";
import { Check, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StepPackageProps {
  selectedPackage: string;
  onSelectPackage: (pkgId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function StepPackage({
  selectedPackage,
  onSelectPackage,
  onBack,
  onNext,
}: StepPackageProps) {
  const packages = [
    {
      id: "souvenir",
      name: "Souvenir",
      price: 10000,
      size: "Format 13x18cm",
      summary: "Restauration numérique basique + cadre sobre prêt à poser.",
      highlight: false,
    },
    {
      id: "memoire",
      name: "Mémoire",
      price: 20000,
      size: "Format Bois Noble 20x30cm",
      summary: "Restauration avancée + Cadre bois qualité + Colorisation + Fichier HD + Carte cadeau.",
      badgeText: "Le plus choisi",
      highlight: true,
    },
    {
      id: "heritage",
      name: "Héritage",
      price: 35000,
      size: "Grand Format Galerie 30x40cm",
      summary: "Restauration d'art premium + Grand cadre + Tirage 10x15 offert + Fichier HD Master.",
      badgeText: "Prestige",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center sm:text-left">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-charcoal">
          Étape 2 : Choisissez votre forfait
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Sélectionnez la finition désirée. Paiement demandé uniquement après votre validation de l'aperçu.
        </p>
      </div>

      {/* Package List */}
      <div className="space-y-3">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-brand-purple bg-brand-purple-light/25 shadow-warm-card ring-2 ring-brand-purple/20"
                  : "border-brand-border/80 bg-white hover:border-brand-purple/50"
              }`}
            >
              {pkg.badgeText && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-brand-gold" strokeWidth={2} />
                  <span>{pkg.badgeText}</span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Circular Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      isSelected
                        ? "border-brand-purple bg-brand-purple text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-heading font-bold text-base text-brand-charcoal">
                        {pkg.name}
                      </h4>
                      <span className="text-xs font-bold text-brand-purple">
                        {pkg.size}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted mt-1 leading-snug">
                      {pkg.summary}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <span className="font-heading font-black text-sm sm:text-base text-brand-charcoal">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-bold">
                    0F d'avance
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Pill format) */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[50px] px-5 py-3 rounded-full border border-brand-border text-brand-charcoal font-semibold text-sm hover:bg-stone-100 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span>Retour</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 min-h-[50px] py-3.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm sm:text-base shadow-glow-purple transition-all flex items-center justify-center gap-2"
        >
          <span>Continuer : Mes coordonnées</span>
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
