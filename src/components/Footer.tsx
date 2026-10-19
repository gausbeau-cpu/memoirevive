import React from "react";
import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

export default function Footer() {
  const content = SITE_CONTENT.footer;
  const brand = SITE_CONTENT.brand;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
          {/* Logo et présentation */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <Logo size="md" variant="on-dark" className="-ml-4 sm:-ml-5" />
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              {content.description}
            </p>
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-brand-pink shrink-0" strokeWidth={2} />
              <span>{brand.city}, Burkina Faso</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-0 text-xs sm:text-sm">
              {content.navLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/#") || link.href.startsWith("#") ? (
                    <a
                      href={link.href}
                      className="min-h-[44px] flex items-center hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="min-h-[44px] flex items-center hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct & Paiement */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Paiement & Contact
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span>{content.whatsappLabel}</span>
              </a>
              <p className="text-stone-400 text-xs">
                {content.paymentNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <p>{content.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-stone-400">
            <Link
              href="/conditions-generales"
              className="min-h-[44px] flex items-center hover:text-stone-200 transition-colors"
            >
              Conditions Générales
            </Link>
            <span className="hidden sm:inline text-stone-600">·</span>
            <Link
              href="/politique-de-confidentialite"
              className="min-h-[44px] flex items-center hover:text-stone-200 transition-colors"
            >
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
