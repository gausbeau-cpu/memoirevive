"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const content = SITE_CONTENT.faq;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    content.contactBlock.message
  )}`;

  return (
    <section id="faq" className="py-14 sm:py-24 bg-[#EDE9FE] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* En-tête */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
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

        {/* Liste accordéon */}
        <div className="space-y-3.5">
          {content.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full min-h-[56px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-brand-charcoal hover:text-brand-purple transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-heading pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-brand-purple text-white rotate-180"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bloc d'aide WhatsApp */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-sm text-brand-charcoal">
              {content.contactBlock.title}
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              {content.contactBlock.subtitle}
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-sm transition active:scale-[0.98] shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{content.contactBlock.buttonText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
