import React from "react";
import { Sparkles, MapPin, ShieldCheck, HeartHandshake } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="bg-[#4C1D95] text-white text-xs sm:text-sm py-2 px-4 shadow-inner">
      <div className="max-w-6xl mx-auto flex items-center justify-center sm:justify-between overflow-x-auto no-scrollbar gap-4 font-medium">
        {/* Element 1 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-brand-gold" strokeWidth={2} />
          </div>
          <span>Aperçu gratuit avant paiement</span>
        </div>
        
        {/* Element 2 */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 text-white/95">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MapPin className="w-3 h-3 text-brand-magenta" strokeWidth={2} />
          </div>
          <span>Livraison soignée à Ouagadougou</span>
        </div>

        {/* Element 3 */}
        <div className="hidden md:flex items-center gap-2 shrink-0 text-white/95">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3 h-3 text-brand-gold" strokeWidth={2} />
          </div>
          <span>0 FCFA d'avance · Zéro risque</span>
        </div>
      </div>
    </div>
  );
}
