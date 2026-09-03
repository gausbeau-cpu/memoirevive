import React from "react";
import Link from "next/link";
import { Sparkles, Heart, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-brand-gold" strokeWidth={2} />
              </div>
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                Mémoire <span className="text-brand-purple">Vive</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Service artisanal de restauration et d'encadrement photo à Ouagadougou. Redonnez vie à vos souvenirs précieux et offrez des cadeaux inoubliables.
            </p>
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-brand-magenta shrink-0" strokeWidth={2} />
              <span>Ouagadougou, Burkina Faso</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/#forfaits" className="hover:text-white transition-colors">
                  Nos 3 Forfaits
                </a>
              </li>
              <li>
                <a href="/#comment-ca-marche" className="hover:text-white transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-white transition-colors">
                  Questions fréquentes
                </a>
              </li>
              <li>
                <Link href="/conditions-generales" className="hover:text-white transition-colors">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Contact & Paiement
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <a
                href="https://wa.me/22675864399"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <span>WhatsApp : +226 75 86 43 99</span>
              </a>
              <p className="text-stone-400 text-xs">
                Paiement sécurisé par Orange Money et Moov Money après validation de l'aperçu.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <p>© {new Date().getFullYear()} Mémoire Vive. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400">
            <Link href="/conditions-generales" className="hover:text-stone-200 transition-colors">
              Conditions Générales
            </Link>
            <span>·</span>
            <Link href="/politique-de-confidentialite" className="hover:text-stone-200 transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
          <p className="flex items-center gap-1.5">
            <span>Fait pour les familles du Burkina Faso</span>
            <Heart className="w-3.5 h-3.5 text-brand-magenta fill-brand-magenta" strokeWidth={1.5} />
          </p>
        </div>
      </div>
    </footer>
  );
}

