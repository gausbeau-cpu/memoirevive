"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// -------------------------------------------------------------------------
// Types & constantes
// -------------------------------------------------------------------------

interface OrderData {
  photoFile: File | null;
  photoPreview: string | null;
  packageId: string;
  fullName: string;
  phone: string;
  neighborhood: string;
  addressDetails: string;
  occasionNote?: string;
}

interface StepSuccessProps {
  orderData: OrderData;
  onClose: () => void;
  onBack: () => void;
}

type Phase = "recap" | "submitting" | "error" | "success";

const PACKAGES: Record<
  string,
  { name: string; price: number; size: string }
> = {
  souvenir: { name: "Forfait Souvenir", price: 10000, size: "13×18 cm" },
  memoire: {
    name: "Forfait Mémoire",
    price: 20000,
    size: "Cadre Bois Noble 20×30 cm",
  },
  heritage: {
    name: "Forfait Héritage",
    price: 35000,
    size: "Grand Format Galerie 30×40 cm",
  },
};

// -------------------------------------------------------------------------
// Composant
// -------------------------------------------------------------------------

export default function StepSuccess({
  orderData,
  onClose,
  onBack,
}: StepSuccessProps) {
  const [phase, setPhase] = useState<Phase>("recap");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const pkg = PACKAGES[orderData.packageId] ?? PACKAGES.memoire;

  // -----------------------------------------------------------------------
  // Soumission réelle vers l'API
  // -----------------------------------------------------------------------
  const handleSubmit = async () => {
    setPhase("submitting");
    setErrorMsg("");

    try {
      const formData = new FormData();

      // Photo : fichier réel ou URL externe (photo de démo)
      if (orderData.photoFile) {
        formData.append("photo", orderData.photoFile);
      } else if (orderData.photoPreview) {
        formData.append("photoUrl", orderData.photoPreview);
      }

      formData.append("forfait", orderData.packageId);
      formData.append("nom", orderData.fullName);
      formData.append("telephone", orderData.phone);
      formData.append("quartier", orderData.neighborhood);
      formData.append("adresseDetails", orderData.addressDetails || "");
      formData.append("occasionNote", orderData.occasionNote || "");

      const res = await fetch("/api/commandes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            "Erreur lors de l'envoi. Vérifiez votre connexion et réessayez."
        );
      }

      // ✅ Succès confirmé — effacer le brouillon localStorage
      try {
        localStorage.removeItem("mv_order_draft");
      } catch {
        /* ignoré */
      }

      setOrderId(data.orderId ?? null);
      setPhase("success");
    } catch (err) {
      console.error("Erreur soumission commande:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur réseau. Vérifiez votre connexion et réessayez."
      );
      setPhase("error");
    }
  };

  // -----------------------------------------------------------------------
  // Phase : RÉCAPITULATIF
  // -----------------------------------------------------------------------
  if (phase === "recap") {
    return (
      <div className="space-y-5">
        {/* Titre */}
        <div className="text-center sm:text-left">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-charcoal">
            Récapitulatif de votre demande
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Vérifiez vos informations avant d'envoyer.{" "}
            <span className="text-emerald-700 font-semibold">
              Aucun paiement maintenant.
            </span>
          </p>
        </div>

        {/* Carte récap */}
        <div className="bg-stone-50 rounded-3xl p-5 border border-brand-border/80 space-y-4">
          {/* Photo + Forfait */}
          <div className="flex items-center gap-3 pb-3 border-b border-brand-border/60">
            {orderData.photoPreview && (
              <img
                src={orderData.photoPreview}
                alt="Votre photo"
                className="w-14 h-16 rounded-2xl object-cover border border-white shadow-sm shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-brand-charcoal truncate">
                {pkg.name}
              </p>
              <p className="text-xs text-brand-muted truncate">{pkg.size}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-heading font-bold text-base text-brand-charcoal block">
                {formatPrice(pkg.price)}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold block">
                0 FCFA payé
              </span>
            </div>
          </div>

          {/* Informations client */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-brand-charcoal w-24 shrink-0">
                Nom :
              </span>
              <span className="text-stone-700">{orderData.fullName}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-brand-charcoal w-24 shrink-0">
                WhatsApp :
              </span>
              <span className="text-stone-700 font-mono">{orderData.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-brand-charcoal w-24 shrink-0">
                Quartier :
              </span>
              <span className="text-stone-700">{orderData.neighborhood}</span>
            </div>
            {orderData.addressDetails && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-brand-charcoal w-24 shrink-0">
                  Repère :
                </span>
                <span className="text-stone-700">{orderData.addressDetails}</span>
              </div>
            )}
            {orderData.occasionNote && (
              <div className="flex items-start gap-2 pt-1 border-t border-brand-border/40 mt-1">
                <span className="font-semibold text-brand-charcoal w-24 shrink-0">
                  Note :
                </span>
                <span className="text-stone-700 italic">
                  « {orderData.occasionNote} »
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rappel garantie */}
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <ShieldCheck
            className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="leading-snug">
            <strong>Garantie :</strong> Vous recevrez votre aperçu gratuit par
            WhatsApp sous 24h. Vous ne payez{" "}
            <strong>qu'après votre accord final</strong>. Si le résultat ne vous
            convient pas, 0 FCFA facturé.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[50px] px-5 py-3 rounded-full border border-brand-border text-brand-charcoal font-semibold text-sm hover:bg-stone-100 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span>Retour</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 min-h-[50px] py-3.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm sm:text-base shadow-glow-purple transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            <span>Envoyer ma demande</span>
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Phase : ENVOI EN COURS
  // -----------------------------------------------------------------------
  if (phase === "submitting") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-purple-light flex items-center justify-center">
          <Loader2
            className="w-9 h-9 text-brand-purple animate-spin"
            strokeWidth={2}
          />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">
            Envoi en cours…
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            Votre photo est en cours d'envoi sécurisé. Ne fermez pas cette
            fenêtre.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Phase : ERREUR
  // -----------------------------------------------------------------------
  if (phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-9 h-9 text-red-500" strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-brand-charcoal">
            L'envoi a échoué
          </h3>
          <p className="text-xs text-red-600 font-semibold mt-2 max-w-xs mx-auto">
            {errorMsg}
          </p>
          <p className="text-xs text-brand-muted mt-2">
            Vos informations sont conservées. Vérifiez votre connexion internet,
            puis réessayez.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2.5 w-full max-w-xs">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2} />
            <span>Réessayer</span>
          </button>

          <button
            type="button"
            onClick={() => setPhase("recap")}
            className="w-full min-h-[44px] py-2.5 px-5 rounded-full bg-stone-100 hover:bg-stone-200 text-brand-charcoal font-semibold text-xs transition-colors"
          >
            Vérifier mes informations
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Phase : SUCCÈS ✅
  // -----------------------------------------------------------------------
  return (
    <div className="text-center space-y-5 py-2">
      {/* Badge succès */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" strokeWidth={2.5} />
      </div>

      <div>
        <span className="inline-block px-3.5 py-1 rounded-full bg-brand-purple-light text-brand-purple text-xs font-bold uppercase tracking-wider mb-2">
          Demande Reçue avec Succès
        </span>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
          Votre photo est entre de bonnes mains
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-md mx-auto">
          Merci{" "}
          <strong className="text-brand-charcoal">{orderData.fullName}</strong>.
          Nos artistes graphistes commencent la restauration de votre souvenir
          dès aujourd'hui.
        </p>
      </div>

      {/* Récap carte */}
      <div className="bg-stone-50 rounded-3xl p-5 border border-brand-border/80 text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-3">
            {orderData.photoPreview && (
              <img
                src={orderData.photoPreview}
                alt="Aperçu"
                className="w-12 h-12 rounded-2xl object-cover border border-white shadow-sm"
              />
            )}
            <div>
              <p className="font-bold text-xs sm:text-sm text-brand-charcoal">
                {pkg.name} ({pkg.size})
              </p>
              <p className="text-[11px] text-brand-muted">
                Statut :{" "}
                <span className="text-brand-purple font-semibold">
                  En cours de restauration
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-heading font-bold text-sm sm:text-base text-brand-charcoal">
              {formatPrice(pkg.price)}
            </span>
            <span className="block text-[10px] text-emerald-700 font-bold">
              0 FCFA payé
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-brand-muted">
          <div>
            <span className="font-semibold text-brand-charcoal">
              Numéro WhatsApp :
            </span>
            <p className="text-stone-700 truncate font-mono">
              {orderData.phone}
            </p>
          </div>
          <div>
            <span className="font-semibold text-brand-charcoal">
              Livraison :
            </span>
            <p className="text-stone-700 truncate">
              {orderData.neighborhood}, Ouagadougou
            </p>
          </div>
        </div>

        {orderId && (
          <div className="pt-1 border-t border-brand-border/40">
            <p className="text-[10px] text-stone-400">
              Référence :{" "}
              <span className="font-mono text-stone-500">{orderId}</span>
            </p>
          </div>
        )}
      </div>

      {/* Rappel garantie */}
      <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200/80 text-left flex items-start gap-3 text-xs text-amber-900">
        <ShieldCheck
          className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"
          strokeWidth={2}
        />
        <p className="leading-snug">
          <strong>Rappel :</strong> Vous recevrez un message WhatsApp sous 24h
          avec votre lien d'aperçu gratuit. Vous ne réglez en Mobile Money
          qu'après avoir donné votre accord final !
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <a
          href={`https://wa.me/22675864399?text=Bonjour%20Mémoire%20Vive%2C%20je%20viens%20de%20déposer%20ma%20photo%20(${encodeURIComponent(
            orderData.fullName
          )})`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[48px] py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01]"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={2} />
          <span>Suivre en direct sur WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] py-2.5 px-5 rounded-full bg-stone-100 hover:bg-stone-200 text-brand-charcoal font-semibold text-xs sm:text-sm transition-colors"
        >
          Fermer et revenir à l'accueil
        </button>
      </div>

      {/* Badge Sparkles déco */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted">
        <Sparkles className="w-3 h-3 text-brand-purple" strokeWidth={2} />
        <span>Restauration traitée sous 24h</span>
      </div>
    </div>
  );
}
