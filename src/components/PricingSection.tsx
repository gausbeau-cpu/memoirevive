"use client";

import React from "react";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { OFFERS, COMMON_INCLUSIONS, formatOfferPrice, Offer } from "@/content/offers";
import { SITE_CONTENT } from "@/content/site";

interface PricingSectionProps {
  onSelectPackage: (formatId: string) => void;
}

export default function PricingSection({ onSelectPackage }: PricingSectionProps) {
  const content = SITE_CONTENT.pricing;

  return (
    <section id="formats" className="py-16 sm:py-24 bg-[#FFFBF7] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* En-tête de la section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-3.5 py-1.5 rounded-full shadow-sm">
            {content.badge}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {content.subtitle}
          </p>
        </div>

        {/* Grille des 3 offres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {OFFERS.map((offer: Offer) => {
            const isHighlight = offer.id === "format_40x60";

            return (
              <div
                key={offer.id}
                className={`relative rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? "bg-white border-2 border-brand-purple shadow-xl shadow-brand-purple/10 ring-4 ring-brand-purple/10 lg:-translate-y-3 pt-10 sm:pt-11"
                    : "bg-white border border-stone-200 shadow-sm hover:shadow-md pt-8 sm:pt-9"
                }`}
              >
                {/* Badge visuel ("Notre coup de cœur" ou "Grand format") */}
                {offer.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                    <span
                      className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${
                        isHighlight
                          ? "bg-brand-pink text-white"
                          : "bg-brand-gold text-white"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{offer.badge}</span>
                    </span>
                  </div>
                )}

                {/* Contenu principal de la carte */}
                <div>
                  <div className="text-center pb-4 border-b border-stone-100">
                    <h3 className="font-heading text-xl font-bold text-brand-charcoal">
                      {offer.name}
                    </h3>
                    <p className="text-xs font-semibold text-stone-500 mt-0.5">
                      Format {offer.format}
                    </p>
                    <p className="text-xs text-brand-purple font-medium mt-1">
                      {offer.slogan}
                    </p>

                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-charcoal tabular-nums">
                        {formatOfferPrice(offer.price)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 inline-block border border-emerald-200/60">
                      0 FCFA d’avance · Paiement après accord
                    </span>
                  </div>

                  {/* Ce qui est inclus */}
                  <div className="py-6 space-y-2.5">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Inclus avec ce format :
                    </span>
                    {COMMON_INCLUSIONS.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton de sélection */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectPackage(offer.id)}
                    className={`w-full min-h-[48px] py-3.5 px-4 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98] ${
                      isHighlight
                        ? "bg-brand-purple hover:bg-brand-purple/95 text-white shadow-brand-purple/20"
                        : "bg-stone-900 hover:bg-stone-800 text-white"
                    }`}
                  >
                    <span>Choisir {offer.format}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-stone-500 font-medium text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aperçu gratuit avant paiement</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
