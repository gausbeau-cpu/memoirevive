import React from "react";
import { Upload, Sparkles, PackageCheck } from "lucide-react";
import { SITE_CONTENT } from "@/content/site";

export default function HowItWorks() {
  const content = SITE_CONTENT.howItWorks;
  const icons = [Upload, Sparkles, PackageCheck];

  return (
    <section id="comment-ca-marche" className="py-14 sm:py-20 bg-[#EDE9FE] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-white px-3.5 py-1.5 rounded-full shadow-sm">
            {content.badge}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            {content.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {content.subtitle}
          </p>
        </div>

        {/* Conteneur des étapes */}
        <div className="relative max-w-4xl mx-auto">
          {/* Ligne horizontale de connexion desktop */}
          <div className="hidden md:block absolute top-6 left-16 right-16 h-0.5 bg-brand-purple/20 -z-0" />

          {/* Grille des étapes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {content.steps.map((step, index) => {
              const Icon = icons[index] || Sparkles;
              return (
                <div
                  key={step.number}
                  className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group"
                >
                  {/* Ligne verticale de connexion mobile */}
                  {index < content.steps.length - 1 && (
                    <div className="md:hidden absolute left-6 top-12 bottom-0 w-0.5 bg-brand-purple/25 -z-10 translate-y-2 h-full" />
                  )}

                  {/* Disque icône avec badge de numéro */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-purple flex items-center justify-center text-brand-purple shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-purple text-white font-bold text-[11px] flex items-center justify-center shadow">
                      {step.number}
                    </span>
                  </div>

                  {/* Contenu textuel */}
                  <div className="flex-1 pt-1 md:pt-2">
                    <h3 className="font-heading text-base sm:text-lg font-bold text-brand-charcoal mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs md:mx-auto">
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
