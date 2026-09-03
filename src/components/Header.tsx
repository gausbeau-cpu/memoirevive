"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Menu, X, ArrowRight, ShieldCheck, Heart } from "lucide-react";

interface HeaderProps {
  onOpenOrderModal: (defaultPackage?: string) => void;
}

export default function Header({ onOpenOrderModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center text-white shadow-glow-purple group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-brand-gold" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-charcoal flex items-center gap-1">
              Mémoire <span className="text-brand-purple">Vive</span>
            </span>
            <span className="text-[10px] sm:text-xs text-brand-muted font-semibold -mt-1 tracking-wider uppercase">
              Restauration & Encadrement
            </span>
          </div>
        </a>

        {/* Right Actions Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* WhatsApp Quick Button */}
          <a
            href="https://wa.me/22675864399?text=Bonjour%20M%C3%A9moire%20Vive%2C%20j%27aimerais%20des%20informations%20sur%20la%20restauration%20d%27une%20photo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
            </div>
            <span>Aide WhatsApp</span>
          </a>

          {/* Primary CTA (Desktop) */}
          <button
            onClick={() => onOpenOrderModal()}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold shadow-glow-purple transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Aperçu gratuit</span>
            <span className="bg-brand-magenta text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              0 FCFA
            </span>
          </button>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="https://wa.me/22675864399?text=Bonjour%20M%C3%A9moire%20Vive"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700"
            aria-label="Contacter sur WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
          </a>


          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center transition-colors"
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

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-border px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-2">
            <a
              href="#forfaits"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 font-bold text-sm text-brand-charcoal"
            >
              <span>Nos 3 Forfaits</span>
              <ArrowRight className="w-4 h-4 text-brand-purple" strokeWidth={2} />
            </a>
            <a
              href="#comment-ca-marche"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 font-bold text-sm text-brand-charcoal"
            >
              <span>Comment ça marche</span>
              <ArrowRight className="w-4 h-4 text-brand-purple" strokeWidth={2} />
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 font-bold text-sm text-brand-charcoal"
            >
              <span>Questions fréquentes</span>
              <ArrowRight className="w-4 h-4 text-brand-purple" strokeWidth={2} />
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderModal();
            }}
            className="w-full py-3.5 px-5 rounded-full bg-brand-purple text-white font-bold text-sm shadow-glow-purple flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brand-gold" strokeWidth={2} />
            <span>Envoyer ma photo (0 FCFA d'avance)</span>
          </button>
        </div>
      )}
    </header>
  );
}
