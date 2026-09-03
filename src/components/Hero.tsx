"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Gift } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface HeroProps {
  onOpenOrderModal: () => void;
}

export default function Hero({ onOpenOrderModal }: HeroProps) {
  return (
    <section className="relative pt-4 pb-12 sm:pt-10 sm:pb-20 overflow-hidden bg-[#FFFBF7]">
      {/* Subtle warm decorative blobs in background */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-brand-purple/10 via-brand-magenta/10 to-brand-gold/10 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-magenta/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT (Strict Vertical Stack: Titre -> Sous-titre -> Slider -> CTA) */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:hidden space-y-4 text-center">
          {/* Trust Mini-Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple-light border border-brand-purple/20 text-brand-purple text-xs font-bold mx-auto shadow-sm">
            <div className="w-4 h-4 rounded-full bg-brand-purple text-white flex items-center justify-center">
              <Gift className="w-2.5 h-2.5" strokeWidth={2} />
            </div>
            <span>Le cadeau souvenir idéal à Ouagadougou</span>
          </div>

          {/* 2. Titre Mobile (Fraunces, très grand, >= 3x texte) */}
          <h1 className="font-heading text-3xl sm:text-4xl leading-[1.15] font-bold text-brand-charcoal tracking-tight">
            Offrez une seconde vie à vos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-purple">
              photos de famille
            </span>
          </h1>

          {/* 3. Sous-titre Mobile */}
          <p className="text-base text-brand-muted leading-relaxed font-normal px-2">
            Envoyez votre photo, recevez un aperçu gratuit sous 24h, payez seulement si ça vous plaît.
          </p>

          {/* 4. Curseur Avant/Après (Pleine largeur avec carrousel 6 catégories) */}
          <div className="w-full pt-1 pb-2">
            <BeforeAfterSlider />
          </div>

          {/* 5. Bouton d'action (Juste sous l'image, pleine largeur, pilule, >= 48px) */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={onOpenOrderModal}
              className="w-full min-h-[52px] py-4 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white text-base font-bold shadow-glow-purple transition-all duration-200 active:scale-98 flex items-center justify-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
              </div>
              <span>Envoyer ma photo</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Reassurance under button */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-full mx-auto w-fit border border-emerald-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
              <span>Aperçu 100% gratuit · Zéro franc d'avance</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEWPORT (2 colonnes 50/50 à partir de 1024px)                     */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Texte + Bouton) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-light border border-brand-purple/20 text-brand-purple text-xs font-bold shadow-sm">
              <div className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center">
                <Gift className="w-3 h-3" strokeWidth={2} />
              </div>
              <span>Le cadeau souvenir personnalisé à Ouagadougou</span>
            </div>

            {/* Titre Desktop (max 60% de sa colonne pour une lisibilité optimale) */}
            <h1 className="font-heading text-4xl xl:text-5xl leading-[1.15] font-bold text-brand-charcoal tracking-tight max-w-[90%]">
              Offrez une seconde vie à vos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-purple">
                photos de famille
              </span>
            </h1>

            {/* Sous-titre Desktop */}
            <p className="text-lg text-brand-muted leading-relaxed font-normal max-w-lg">
              Envoyez votre photo, recevez un aperçu gratuit sous 24h, payez seulement si ça vous plaît.
            </p>

            {/* Bullets réassurance */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-brand-charcoal font-semibold w-full max-w-md">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
                </div>
                <span>Aperçu gratuit avant paiement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
                </div>
                <span>Cadre en bois véritable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
                </div>
                <span>Livraison Ouagadougou</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
                </div>
                <span>Orange & Moov Money</span>
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="pt-2 flex flex-col items-start gap-3">
              <button
                onClick={onOpenOrderModal}
                className="min-h-[54px] px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white text-lg font-bold shadow-glow-purple transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-gold group-hover:rotate-12 transition-transform" strokeWidth={2} />
                </div>
                <span>Envoyer ma photo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                <span>0 FCFA maintenant · Paiement après validation de l'aperçu</span>
              </div>
            </div>

          </div>

          {/* Right Column (Curseur Avant/Après & Carrousel 6 catégories) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <BeforeAfterSlider />
          </div>
        </div>

      </div>
    </section>
  );
}
