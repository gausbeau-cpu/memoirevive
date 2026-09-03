import React from "react";
import { ShieldCheck, RefreshCw, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";

export default function GuaranteeSection() {
  return (
    <section className="py-14 sm:py-20 bg-[#EC4899] text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          
          {/* Shield Emblem */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-[#EC4899] shadow-2xl transition-transform hover:scale-105">
              <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14" strokeWidth={2.2} />
            </div>
          </div>

          {/* Guarantee Content */}
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
              <span>Garantie Totale « Zéro Risque »</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Vous voyez l'aperçu avant de payer. Si ça ne vous convient pas, vous ne payez rien.
            </h3>

            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
              Nous réalisons la restauration complète de votre photo en premier. Vous recevez l'aperçu sous 24h. Si le résultat ne vous satisfait pas à 100%, <strong>vous ne payez absolument rien</strong>. Aucune question posée.
            </p>

            {/* Sub-guarantees */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm text-white font-semibold">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm py-2 px-4 rounded-full border border-white/25">
                <HeartHandshake className="w-4 h-4 text-brand-gold shrink-0" strokeWidth={2} />
                <span>Cadre remplacé si endommagé</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm py-2 px-4 rounded-full border border-white/25">
                <RefreshCw className="w-4 h-4 text-brand-gold shrink-0" strokeWidth={2} />
                <span>Retouches gratuites incluses</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
