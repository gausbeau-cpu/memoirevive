import React from "react";
import { Upload, Sparkles, PackageCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "Envoyez votre photo",
      description: "Prenez en photo votre cliché avec votre smartphone ou chargez votre fichier.",
    },
    {
      number: "2",
      icon: Sparkles,
      title: "Recevez un aperçu gratuit sous 24h",
      description: "Nos graphistes restaurent et ravivent les détails de votre photo sans frais.",
    },
    {
      number: "3",
      icon: PackageCheck,
      title: "Validez et payez seulement si ça vous plaît",
      description: "Réglez en Mobile Money après validation et recevez votre cadre livré chez vous.",
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-14 sm:py-20 bg-[#EDE9FE] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-brand-purple-light px-3.5 py-1.5 rounded-full">
            Simplicité & Transparence
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            Comment ça marche ?
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            3 étapes simples et sans stress. Zéro franc demandé avant votre accord final.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Desktop Horizontal Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-6 left-16 right-16 h-0.5 bg-brand-purple/20 -z-0" />

          {/* Steps Grid / Stack */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group"
                >
                  {/* Mobile Vertical Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden absolute left-6 top-12 bottom-0 w-0.5 bg-brand-purple/25 -z-10 translate-y-2 h-full" />
                  )}

                  {/* 48px Circle with Lucide Icon + Number Badge in top-right */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-purple-light border-2 border-brand-purple flex items-center justify-center text-brand-purple shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    {/* Step Number Badge overlay (top right) */}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-purple text-white font-bold text-[11px] flex items-center justify-center shadow">
                      {step.number}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 pt-1 md:pt-2">
                    <h3 className="font-heading text-base sm:text-lg font-bold text-brand-charcoal mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-xs md:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
