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
            <div className="[&_span]:text-white [&_span.text-stone-500]:text-stone-400">
              <Logo size="md" />
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
            <ul className="space-y-2 text-xs sm:text-sm">
              {content.navLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/#") || link.href.startsWith("#") ? (
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-white transition-colors">
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
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center">
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
          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400">
            <Link href="/conditions-generales" className="hover:text-stone-200 transition-colors">
              Conditions Générales
            </Link>
            <span>·</span>
            <Link href="/politique-de-confidentialite" className="hover:text-stone-200 transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
