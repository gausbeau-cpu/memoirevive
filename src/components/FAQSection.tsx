"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Comment puis-je envoyer ma photo si je n'ai pas de scanner ?",
      answer:
        "C'est très simple : posez votre photo sur une table bien éclairée par la lumière du jour (sans reflet direct ni ombre) et prenez-la en photo avec votre smartphone. Nos graphistes et notre technologie se chargent de redresser les angles, gommer les pliures et restaurer la netteté des visages.",
    },
    {
      question: "Quand et comment se fait le paiement ?",
      answer:
        "Aucun paiement n'a lieu à la commande. Nous effectuons le travail en premier et vous recevez un aperçu sous 24h. Si le résultat vous émeut, vous validez et effectuez le règlement en toute sécurité par Mobile Money (Orange Money ou Moov Money). Si cela ne vous convient pas, vous ne payez strictement rien.",
    },
    {
      question: "Quels sont les délais de traitement et de livraison à Ouagadougou ?",
      answer:
        "L'aperçu numérique vous est envoyé en moins de 24 heures. Après votre validation, l'impression fine art et l'encadrement en atelier prennent 24 à 48 heures. Votre cadre est ensuite livré directement à votre domicile ou bureau à Ouagadougou.",
    },
    {
      question: "Que se passe-t-il si mon cadre arrive abîmé lors de la livraison ?",
      answer:
        "Chaque colis est emballé avec une protection renforcée. Si le cadre ou la vitre arrive endommagé, nous vous le remplaçons immédiatement et gratuitement, sans discussion.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-24 bg-[#EDE9FE] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-brand-purple-light px-3.5 py-1.5 rounded-full">
            Questions Fréquentes
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Des réponses transparentes pour commander l'esprit 100% serein.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-brand-border/80 overflow-hidden shadow-warm-card transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full min-h-[56px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-brand-charcoal hover:text-brand-purple transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-heading pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-brand-purple text-white rotate-180 shadow-glow-purple" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm text-brand-muted leading-relaxed border-t border-stone-100 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Direct Help fallback */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-brand-border/80 shadow-warm-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-sm text-brand-charcoal">
              Une autre question particulière ?
            </h4>
            <p className="text-xs text-brand-muted mt-0.5">
              Notre équipe à Ouagadougou vous répond directement sur WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/22675864399?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20les%20cadres%20M%C3%A9moire%20Vive"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
