"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Gift } from "lucide-react";

interface FinalCTAProps {
  onOpenOrderModal: () => void;
}

export default function FinalCTA({ onOpenOrderModal }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#4C1D95] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-brand-gold text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-brand-gold" strokeWidth={2} />
          <span>Faites revivre vos souvenirs dès aujourd'hui</span>
        </div>

        {/* Big Heading (Fraunces) */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Ne laissez plus vos plus beaux souvenirs s'effacer avec le temps.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
          Envoyez votre photo maintenant. Recevez votre aperçu restauré sous 24h. C'est 100% gratuit et sans le moindre engagement.
        </p>

        {/* Pill CTA Button */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-full bg-brand-magenta hover:bg-brand-magenta-hover text-white text-base sm:text-lg font-bold shadow-glow-magenta transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
            </div>
            <span>Commencer ma restauration gratuite</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2 text-xs text-white/85">
            <ShieldCheck className="w-4 h-4 text-emerald-300" strokeWidth={2} />
            <span>0 FCFA d'avance · Paiement Mobile Money uniquement après validation</span>
          </div>
        </div>

      </div>
    </section>
  );
}
