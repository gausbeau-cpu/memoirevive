"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Gift } from "lucide-react";
import HeroHeadline from "./HeroHeadline";
import HeroShowcase from "./HeroShowcase";
import LiquidButton from "@/components/LiquidButton";
import { HeroCycleProvider } from "@/context/HeroCycleContext";
import { SITE_CONTENT } from "@/content/site";

interface HeroProps {
  onOpenOrderModal: () => void;
}

export default function Hero({ onOpenOrderModal }: HeroProps) {
  const content = SITE_CONTENT.hero;

  return (
    <HeroCycleProvider>
      <section id="hero-section" className="relative pt-4 pb-12 sm:pt-10 sm:pb-20 overflow-hidden bg-[#FFFBF7]">
        {/* Halos chaleureux en arrière-plan (sans débordement hors écran) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-brand-purple/10 via-brand-pink/10 to-brand-gold/10 blur-3xl -z-10 pointer-events-none rounded-full" />
        <div className="absolute -top-10 right-0 w-72 h-72 bg-brand-pink/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ========================================================================= */}
          {/* VUE MOBILE (Ordre Section 4.3 : Badge -> Titre -> Sous-titre -> CTA -> Visuel) */}
          {/* ========================================================================= */}
          <div className="flex flex-col lg:hidden space-y-4 text-center">
            {/* Badge de confiance mobile */}
            <div className="hero-stagger-item hero-stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mx-auto shadow-sm">
              <div className="w-4 h-4 rounded-full bg-brand-purple text-white flex items-center justify-center">
                <Gift className="w-2.5 h-2.5" strokeWidth={2} />
              </div>
              <span>{content.mobileBadge}</span>
            </div>

            {/* Titre Mobile à fin changeante */}
            <div className="hero-stagger-item hero-stagger-2">
              <HeroHeadline className="text-center" />
            </div>

            {/* Sous-titre Mobile */}
            <p className="hero-stagger-item hero-stagger-3 text-base text-stone-600 leading-relaxed font-normal px-2">
              {content.subtitle}
            </p>

            {/* Bouton d'action principal + Réassurance (visible sans défiler à 360x640 et 390x844) */}
            <div className="hero-stagger-item hero-stagger-4 space-y-2.5 pt-1">
              <LiquidButton
                variant="primary"
                onClick={onOpenOrderModal}
                className="w-full min-h-[52px] py-4 px-6 rounded-full text-base font-bold flex items-center justify-center gap-3 shadow-lg shadow-brand-purple/20"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
                </div>
                <span>{content.ctaButton}</span>
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </LiquidButton>

              {/* Réassurance sous le bouton */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-full mx-auto w-fit border border-emerald-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
                <span>{content.mobileReassurance}</span>
              </div>
            </div>

            {/* Showcase des réalisations animées placé après le CTA sur mobile */}
            <div className="hero-stagger-item hero-stagger-5 w-full pt-2 pb-1">
              <HeroShowcase />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VUE DESKTOP (2 colonnes 50/50 à partir de 1024px)                         */}
          {/* ========================================================================= */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
            {/* Colonne gauche (Texte + Bouton) */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              <div className="hero-stagger-item hero-stagger-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold shadow-sm">
                <div className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center">
                  <Gift className="w-3 h-3" strokeWidth={2} />
                </div>
                <span>{content.desktopBadge}</span>
              </div>

              {/* Titre Desktop à fin changeante */}
              <div className="hero-stagger-item hero-stagger-2 w-full">
                <HeroHeadline className="text-left" />
              </div>

              <p className="hero-stagger-item hero-stagger-3 text-lg text-stone-600 leading-relaxed font-normal max-w-lg">
                {content.subtitle}
              </p>

              {/* Bullets réassurance */}
              <div className="hero-stagger-item hero-stagger-4 grid grid-cols-2 gap-3 text-xs sm:text-sm text-brand-charcoal font-semibold w-full max-w-md">
                {content.desktopArguments.map((arg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{arg}</span>
                  </div>
                ))}
              </div>

              {/* Bouton d'action */}
              <div className="hero-stagger-item hero-stagger-5 pt-2 space-y-2">
                <LiquidButton
                  variant="primary"
                  onClick={onOpenOrderModal}
                  className="min-h-[52px] py-4 px-8 rounded-full text-base font-bold flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5 text-brand-gold" />
                  <span>{content.ctaButton}</span>
                  <ArrowRight className="w-5 h-5" />
                </LiquidButton>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{content.desktopReassurance}</span>
                </div>
              </div>
            </div>

            {/* Colonne droite (Showcase des réalisations animées) */}
            <div className="lg:col-span-6 w-full">
              <HeroShowcase />
            </div>
          </div>
        </div>
      </section>
    </HeroCycleProvider>
  );
}
