"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import LiquidButton from "@/components/LiquidButton";
import { SITE_CONTENT } from "@/content/site";

interface FinalCTAProps {
  onOpenOrderModal: () => void;
}

export default function FinalCTA({ onOpenOrderModal }: FinalCTAProps) {
  const content = SITE_CONTENT.finalCta;

  return (
    <section className="py-16 sm:py-24 bg-[#4C1D95] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-brand-gold text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-brand-gold" strokeWidth={2} />
          <span>{content.badge}</span>
        </div>

        {/* Titre (Fraunces) */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          {content.title}
        </h2>

        {/* Sous-titre */}
        <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
          {content.subtitle}
        </p>

        {/* Bouton d'action CTA Liquide */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <LiquidButton
            variant="primary"
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto min-h-[54px] px-8 py-4 rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
            </div>
            <span>{content.buttonText}</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </LiquidButton>

          <div className="flex items-center gap-2 text-xs text-white/85">
            <ShieldCheck className="w-4 h-4 text-emerald-300" strokeWidth={2} />
            <span>{content.reassurance}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
