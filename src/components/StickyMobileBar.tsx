"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";
import LiquidButton from "@/components/LiquidButton";

interface StickyMobileBarProps {
  onOpenOrderModal: () => void;
}

export default function StickyMobileBar({ onOpenOrderModal }: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const content = SITE_CONTENT.stickyMobileBar;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md border-t border-brand-border/80 shadow-[0_-4px_25px_rgba(124,58,237,0.12)] md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        {/* Bouton rapide WhatsApp */}
        <LiquidButton
          as="a"
          variant="whatsapp"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            content.whatsappMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center shrink-0 p-0"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
        </LiquidButton>

        {/* Bouton CTA principal sous le pouce */}
        <LiquidButton
          variant="primary"
          onClick={onOpenOrderModal}
          className="flex-1 min-h-[48px] px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-brand-gold" strokeWidth={2} />
            </div>
            <span className="whitespace-normal leading-tight font-bold">{content.buttonText}</span>
          </div>
          <span className="bg-brand-pink text-white text-xs px-2 py-0.5 rounded-full font-bold tracking-wider shrink-0">
            {content.buttonBadge}
          </span>
        </LiquidButton>
      </div>
    </div>
  );
}
