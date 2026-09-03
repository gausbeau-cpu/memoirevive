"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";

interface StickyMobileBarProps {
  onOpenOrderModal: () => void;
}

export default function StickyMobileBar({ onOpenOrderModal }: StickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-brand-border/80 shadow-[0_-4px_25px_rgba(124,58,237,0.12)] md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        {/* Quick WhatsApp button (Circular) */}
        <a
          href="https://wa.me/22675864399?text=Bonjour%20M%C3%A9moire%20Vive%2C%20j%27ai%20une%20question"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
        </a>

        {/* Pill Primary CTA for thumb */}
        <button
          onClick={onOpenOrderModal}
          className="flex-1 min-h-[48px] px-5 py-3 rounded-full bg-brand-purple text-white font-bold text-sm shadow-glow-purple active:scale-98 transition-transform flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-brand-gold" strokeWidth={2} />
            </div>
            <span className="truncate">Restaurer ma photo</span>
          </div>
          <span className="bg-brand-magenta text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wider shrink-0">
            0 FCFA
          </span>
        </button>
      </div>
    </div>
  );
}
