"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, User, Phone, MapPin, AlertCircle } from "lucide-react";

interface StepContactProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  neighborhood: string;
  onNeighborhoodChange: (val: string) => void;
  addressDetails: string;
  onAddressDetailsChange: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const OUAGA_NEIGHBORHOODS = [
  "Ouaga 2000",
  "Karpala",
  "Dassasgho",
  "Somgandé",
  "Pissy",
  "Gounghin",
  "Tampouy",
  "Saaba",
  "Koulouba",
  "Zone 1 / Cité An III",
  "Wayalghin",
  "Patte d'Oie",
];

export default function StepContact({
  fullName,
  onFullNameChange,
  phone,
  onPhoneChange,
  neighborhood,
  onNeighborhoodChange,
  addressDetails,
  onAddressDetailsChange,
  onBack,
  onNext,
}: StepContactProps) {
  const [error, setError] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError("Veuillez renseigner un numéro de téléphone WhatsApp valide.");
      return;
    }
    if (!neighborhood.trim()) {
      setError("Veuillez préciser votre quartier à Ouagadougou.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-4">
      <div className="text-center sm:text-left">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-charcoal">
          Étape 3 : Contact & Livraison
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Votre numéro WhatsApp servira à vous envoyer votre <span className="font-bold text-brand-purple">aperçu gratuit</span>.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
          Nom et Prénom *
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Ex: Aminata Ouedraogo"
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Phone (WhatsApp) */}
      <div>
        <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
          Numéro WhatsApp pour l'aperçu *
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Ex: +226 70 00 00 00"
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
          />
        </div>
      </div>

      {/* Neighborhood in Ouagadougou */}
      <div>
        <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
          Quartier de livraison à Ouagadougou *
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <input
            type="text"
            required
            value={neighborhood}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            placeholder="Ex: Ouaga 2000, Karpala, Dassasgho..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
          />
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {OUAGA_NEIGHBORHOODS.slice(0, 6).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onNeighborhoodChange(q)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                neighborhood === q
                  ? "bg-brand-purple text-white border-brand-purple font-semibold"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Landmark / Details */}
      <div>
        <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
          Repère de livraison <span className="text-stone-400 font-normal lowercase">(optionnel)</span>
        </label>
        <input
          type="text"
          value={addressDetails}
          onChange={(e) => onAddressDetailsChange(e.target.value)}
          placeholder="Ex: Face à la pharmacie, 2e von à droite..."
          className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Buttons (Pill format) */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[50px] px-5 py-3 rounded-full border border-brand-border text-brand-charcoal font-semibold text-sm hover:bg-stone-100 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span>Retour</span>
        </button>

        <button
          type="submit"
          className="flex-1 min-h-[50px] py-3.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm sm:text-base shadow-glow-purple transition-all flex items-center justify-center gap-2"
        >
          <span>Voir le récapitulatif</span>
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
