"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Gift } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { SITE_CONTENT } from "@/content/site";

interface HeroProps {
  onOpenOrderModal: () => void;
}

export default function Hero({ onOpenOrderModal }: HeroProps) {
  const content = SITE_CONTENT.hero;

  return (
    <section className="relative pt-4 pb-12 sm:pt-10 sm:pb-20 overflow-hidden bg-[#FFFBF7]">
      {/* Halos chaleureux en arrière-plan */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-brand-purple/10 via-brand-pink/10 to-brand-gold/10 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ========================================================================= */}
        {/* VUE MOBILE (Stack vertical strict : Titre -> Sous-titre -> Slider -> CTA) */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:hidden space-y-4 text-center">
          {/* Badge de confiance mobile */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mx-auto shadow-sm">
            <div className="w-4 h-4 rounded-full bg-brand-purple text-white flex items-center justify-center">
              <Gift className="w-2.5 h-2.5" strokeWidth={2} />
            </div>
            <span>{content.mobileBadge}</span>
          </div>

          {/* Titre Mobile */}
          <h1 className="font-heading text-3xl sm:text-4xl leading-[1.15] font-bold text-brand-charcoal tracking-tight">
            {content.title}
          </h1>

          {/* Sous-titre Mobile */}
          <p className="text-base text-stone-600 leading-relaxed font-normal px-2">
            {content.subtitle}
          </p>

          {/* Curseur Avant/Après */}
          <div className="w-full pt-1 pb-2">
            <BeforeAfterSlider />
          </div>

          {/* Bouton d'action principal */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="w-full min-h-[52px] py-4 px-6 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white text-base font-bold shadow-lg shadow-brand-purple/25 transition-all duration-200 active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
              </div>
              <span>{content.ctaButton}</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Réassurance sous le bouton */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-full mx-auto w-fit border border-emerald-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
              <span>{content.mobileReassurance}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VUE DESKTOP (2 colonnes 50/50 à partir de 1024px)                         */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
          {/* Colonne gauche (Texte + Bouton) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold shadow-sm">
              <div className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center">
                <Gift className="w-3 h-3" strokeWidth={2} />
              </div>
              <span>{content.desktopBadge}</span>
            </div>

            <h1 className="font-heading text-4xl xl:text-5xl leading-[1.15] font-bold text-brand-charcoal tracking-tight max-w-[90%]">
              {content.title}
            </h1>

            <p className="text-lg text-stone-600 leading-relaxed font-normal max-w-lg">
              {content.subtitle}
            </p>

            {/* Bullets réassurance */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-brand-charcoal font-semibold w-full max-w-md">
              {content.desktopArguments.map((arg, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{arg}</span>
                </div>
              ))}
            </div>

            {/* Bouton d'action */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={onOpenOrderModal}
                className="min-h-[52px] py-4 px-8 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white text-base font-bold shadow-lg shadow-brand-purple/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span>{content.ctaButton}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{content.desktopReassurance}</span>
              </div>
            </div>
          </div>

          {/* Colonne droite (Curseur Avant/Après) */}
          <div className="lg:col-span-6 w-full">
            <BeforeAfterSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
