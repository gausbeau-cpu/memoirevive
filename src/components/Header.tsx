"use client";

import React, { useState } from "react";
import { MessageCircle, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

interface HeaderProps {
  onOpenOrderModal: (defaultPackage?: string) => void;
}

export default function Header({ onOpenOrderModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = SITE_CONTENT.header;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    content.helpMessage
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo typographique minimaliste */}
        <Logo size="md" />

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {content.menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-stone-600 hover:text-brand-purple transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Bouton WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-[0.98]"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-emerald-700" strokeWidth={2} />
            </div>
            <span>{content.helpButton}</span>
          </a>

          {/* CTA Principal */}
          <button
            type="button"
            onClick={() => onOpenOrderModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white text-xs font-bold shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{content.ctaButton}</span>
            <span className="bg-brand-pink text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {content.ctaBadge}
            </span>
          </button>
        </div>

        {/* Actions Mobiles */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 active:scale-95 transition-transform"
            aria-label="Contacter sur WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-border px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1.5">
            {content.menuLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between min-h-[44px] px-3.5 py-3 rounded-xl bg-stone-50 font-bold text-xs text-brand-charcoal hover:bg-brand-purple/5 active:bg-brand-purple/10 transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-purple" strokeWidth={2} />
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple/95 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <span>{content.mobileCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
