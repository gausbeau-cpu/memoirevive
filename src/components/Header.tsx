"use client";

import React, { useState } from "react";
import { MessageCircle, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import LiquidButton from "@/components/LiquidButton";
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-[72px] flex items-center justify-between">
        {/* Logo officiel Mémoire Vive (sans baseline sur mobile pour visibilité maximale) */}
        <Logo size="md" mobileWithoutBaseline className="-ml-4 sm:-ml-5" />

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {content.menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-stone-600 hover:text-brand-purple transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Bouton WhatsApp Liquide */}
          <LiquidButton
            as="a"
            variant="whatsapp"
            href={whatsappHref}
            target="_blank"
            className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-white fill-white" />
            </div>
            <span>{content.helpButton}</span>
          </LiquidButton>

          {/* CTA Principal Liquide */}
          <LiquidButton
            variant="primary"
            onClick={() => onOpenOrderModal()}
            className="flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold"
          >
            <span>{content.ctaButton}</span>
            <span className="bg-brand-pink text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {content.ctaBadge}
            </span>
          </LiquidButton>
        </div>

        {/* Actions Mobiles */}
        <div className="flex md:hidden items-center gap-2">
          {/* Bouton WhatsApp Mobile Liquide */}
          <LiquidButton
            as="a"
            variant="whatsapp"
            href={whatsappHref}
            target="_blank"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center p-0"
            aria-label="Contacter sur WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-white fill-white" />
          </LiquidButton>

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

      {/* Menu Mobile Plein Écran (100dvh, Section 4.2) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 h-screen-dvh flex flex-col justify-between bg-brand-bg/98 backdrop-blur-lg p-5 pt-safe pb-safe md:hidden animate-in fade-in duration-200">
          <div>
            {/* En-tête menu avec Logo et Bouton Fermer */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-border/70">
              <Logo size="md" mobileWithoutBaseline className="-ml-3" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {/* Liens de navigation 48px de haut */}
            <nav className="space-y-2 pt-6">
              {content.menuLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between min-h-[48px] px-4 py-3 rounded-2xl bg-white border border-stone-200/80 font-bold text-base text-brand-charcoal hover:bg-brand-purple/5 active:bg-brand-purple/10 transition-colors shadow-xs"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-brand-purple" strokeWidth={2} />
                </a>
              ))}
            </nav>
          </div>

          {/* Bouton principal en pleine largeur en bas */}
          <div className="pt-4 border-t border-brand-border/70 space-y-3">
            <LiquidButton
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full min-h-[50px] py-3.5 px-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
            >
              <span>{content.mobileCta}</span>
              <ArrowRight className="w-5 h-5" />
            </LiquidButton>

            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
              <span>Aperçu gratuit sans engagement · 0 FCFA</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
