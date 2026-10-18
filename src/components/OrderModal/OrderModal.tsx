"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  Camera,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  MessageCircle,
  RefreshCw,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  OFFERS,
  OfferId,
  isValidOfferId,
  formatOfferPrice,
  getOfferById,
} from "@/content/offers";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";
import { formatBurkinaWhatsAppPhone } from "@/lib/utils";
import LiquidButton from "@/components/LiquidButton";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
}

const DRAFT_KEY = "mv_order_draft_v2";

interface DraftData {
  formatId: OfferId;
  texteAEcrire: string;
  laisserProposerTexte: boolean;
  echeance: "cette_semaine" | "ce_mois" | "plus_tard" | "";
  nom: string;
  telephone: string;
  quartier: string;
  adresseDetails: string;
}

function loadDraft(): Partial<DraftData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(data: Partial<DraftData>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignoré */
  }
}

export function clearOrderDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignoré */
  }
}

function mapLegacyPackage(pkg?: string): OfferId {
  if (!pkg) return "format_40x60";
  if (isValidOfferId(pkg)) return pkg;
  if (pkg === "souvenir") return "format_30x40";
  if (pkg === "heritage") return "format_50x70";
  return "format_40x60";
}

type ModalState = "form" | "submitting" | "error" | "success";

export default function OrderModal({
  isOpen,
  onClose,
  initialPackage = "format_40x60",
}: OrderModalProps) {
  const content = SITE_CONTENT.orderForm;

  // État du formulaire
  const [modalState, setModalState] = useState<ModalState>("form");
  const [selectedFormat, setSelectedFormat] = useState<OfferId>(
    mapLegacyPackage(initialPackage)
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoOriginalSize, setPhotoOriginalSize] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [texteAEcrire, setTexteAEcrire] = useState<string>("");
  const [laisserProposerTexte, setLaisserProposerTexte] = useState<boolean>(false);
  const [echeance, setEcheance] = useState<"cette_semaine" | "ce_mois" | "plus_tard" | "">("");

  const [nom, setNom] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [quartier, setQuartier] = useState<string>("");
  const [adresseDetails, setAdresseDetails] = useState<string>("");
  const [showLandmark, setShowLandmark] = useState<boolean>(false);

  // Erreurs et état serveur
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  // Jauge liquide du bouton d'envoi
  const [gaugeStatus, setGaugeStatus] = useState<
    "idle" | "uploading" | "submitting" | "success" | "error"
  >("idle");
  const [gaugeProgress, setGaugeProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bloquer le scroll d'arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Synchronisation du forfait initial
  useEffect(() => {
    if (initialPackage) {
      setSelectedFormat(mapLegacyPackage(initialPackage));
    }
  }, [initialPackage]);

  // Fermeture par la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleResetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Chargement du brouillon local
  useEffect(() => {
    if (isOpen) {
      const draft = loadDraft();
      if (draft.formatId && isValidOfferId(draft.formatId)) {
        setSelectedFormat(draft.formatId);
      }
      if (draft.texteAEcrire !== undefined) setTexteAEcrire(draft.texteAEcrire);
      if (draft.laisserProposerTexte !== undefined)
        setLaisserProposerTexte(draft.laisserProposerTexte);
      if (draft.echeance !== undefined) setEcheance(draft.echeance);
      if (draft.nom) setNom(draft.nom);
      if (draft.telephone) setTelephone(draft.telephone);
      if (draft.quartier) setQuartier(draft.quartier);
      if (draft.adresseDetails) {
        setAdresseDetails(draft.adresseDetails);
        setShowLandmark(true);
      }
    }
  }, [isOpen]);

  // Sauvegarde automatique du brouillon
  useEffect(() => {
    if (!isOpen) return;
    saveDraft({
      formatId: selectedFormat,
      texteAEcrire,
      laisserProposerTexte,
      echeance,
      nom,
      telephone,
      quartier,
      adresseDetails,
    });
  }, [
    isOpen,
    selectedFormat,
    texteAEcrire,
    laisserProposerTexte,
    echeance,
    nom,
    telephone,
    quartier,
    adresseDetails,
  ]);

  // Gestion de la sélection de photo originale (pleine résolution conservée pour impression PVC)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    setPhotoOriginalSize(file.size);
    setIsCompressing(false);
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTexteAEcrire(suggestion.slice(0, 100));
    setLaisserProposerTexte(false);
    setValidationError(null);
  };

  const handleNeighborhoodClick = (q: string) => {
    setQuartier(q);
    setValidationError(null);
  };

  // Soumission avec suivi de la jauge liquide
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    // Validation stricte
    if (!photoFile && !photoPreview) {
      setValidationError("Merci de choisir une photo pour ton tableau.");
      return;
    }

    if (!nom.trim()) {
      setValidationError("Merci d'indiquer ton nom et prénom.");
      return;
    }

    if (!telephone.trim()) {
      setValidationError("Merci d'indiquer ton numéro WhatsApp.");
      return;
    }

    if (!quartier.trim()) {
      setValidationError("Merci d'indiquer ton quartier à Ouagadougou.");
      return;
    }

    if (!laisserProposerTexte && !texteAEcrire.trim()) {
      setValidationError(
        "Écris un message ou coche « propose-moi un texte » pour continuer."
      );
      return;
    }

    // Démarrage de la jauge liquide
    setGaugeStatus("uploading");
    setGaugeProgress(8);

    try {
      const formData = new FormData();
      if (photoFile) {
        formData.append("photo", photoFile);
      } else if (photoPreview) {
        formData.append("photoUrl", photoPreview);
      }

      formData.append("forfait", selectedFormat);
      formData.append("nom", nom.trim());
      formData.append("telephone", telephone.trim());
      formData.append("quartier", quartier.trim());
      if (adresseDetails.trim()) {
        formData.append("adresseDetails", adresseDetails.trim());
      }
      if (texteAEcrire.trim()) {
        formData.append("texteAEcrire", texteAEcrire.trim().slice(0, 100));
      }
      formData.append("laisserProposerTexte", String(laisserProposerTexte));
      if (echeance) {
        formData.append("echeance", echeance);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/commandes");

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.max(
            8,
            Math.min(99, Math.round((evt.loaded / evt.total) * 100))
          );
          setGaugeProgress(pct);
        }
      };

      xhr.upload.onload = () => {
        setGaugeStatus("submitting");
        setGaugeProgress(100);
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.success) {
            setGaugeStatus("success");
            setGaugeProgress(100);
            setSubmittedOrderId(data.orderId || null);
            clearOrderDraft();
            // Transition vers l'écran de succès existant après perception du badge ✓
            setTimeout(() => {
              setModalState("success");
            }, 800);
          } else {
            throw new Error(
              data.error || "Impossible d’enregistrer ta commande. Réessaie."
            );
          }
        } catch (err: unknown) {
          console.error("Erreur soumission commande:", err);
          const message =
            err instanceof Error ? err.message : "Erreur inattendue.";
          setGaugeStatus("error");
          setGaugeProgress(0);
          setServerError(message);
        }
      };

      xhr.onerror = () => {
        setGaugeStatus("error");
        setGaugeProgress(0);
        setServerError("Erreur réseau. Vérifie ta connexion et réessaie.");
      };

      xhr.send(formData);
    } catch (err: unknown) {
      console.error("Erreur préparation commande:", err);
      const message =
        err instanceof Error ? err.message : "Erreur inattendue.";
      setGaugeStatus("error");
      setGaugeProgress(0);
      setServerError(message);
    }
  };

  const handleResetAndClose = () => {
    setModalState("form");
    setGaugeStatus("idle");
    setGaugeProgress(0);
    setPhotoFile(null);
    setPhotoPreview(null);
    setValidationError(null);
    setServerError(null);
    onClose();
  };

  const firstName = nom.trim().split(" ")[0] || "ami(e)";
  const selectedOffer = getOfferById(selectedFormat) ?? OFFERS[1];

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleResetAndClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all"
    >
      <div
        className="bg-brand-bg w-full sm:max-w-xl h-[95dvh] sm:h-auto sm:max-h-[90vh] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* ================================================================= */}
        {/* Header du modal */}
        {/* ================================================================= */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-brand-border/70 flex items-center justify-between bg-white/95 sticky top-0 z-20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 text-brand-purple" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-base sm:text-lg font-bold text-brand-charcoal leading-tight truncate">
                {modalState === "success"
                  ? content.success.title
                  : content.title}
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2} />
                <span>{content.notice}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 hover:text-brand-charcoal flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label="Fermer la fenêtre de commande"
            title="Fermer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* ================================================================= */}
        {/* Corps : selon l'état */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* ÉTAT 1 : Envoi en cours */}
          {modalState === "submitting" && (
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center animate-pulse">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-charcoal">
                {content.submitting.title}
              </h3>
              <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
                {content.submitting.message}
              </p>
            </div>
          )}

          {/* ÉTAT 2 : Erreur */}
          {modalState === "error" && (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-charcoal">
                {content.error.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
                {serverError || content.error.message}
              </p>

              {/* Bouton de secours direct WhatsApp : aucune commande n'est perdue */}
              <div className="w-full max-w-sm p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2.5 shadow-sm">
                <p className="text-xs font-semibold text-emerald-950">
                  📱 Passe ta commande directement à l’équipe sur WhatsApp :
                </p>
                <LiquidButton
                  as="a"
                  variant="whatsapp"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Bonjour Mémoire Vive, je souhaite commander mon tableau d’anniversaire :\n- Format : ${selectedOffer.name} (${selectedOffer.format} - ${formatOfferPrice(selectedOffer.price)})\n- Nom : ${nom.trim()}\n- Quartier : ${quartier.trim()}\n- Message sur la photo : ${texteAEcrire.trim() || "À me proposer"}\n- Téléphone : ${telephone.trim()}\n\n(Je vous joins ma photo originale)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Envoyer ma commande sur WhatsApp</span>
                </LiquidButton>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1 w-full max-w-xs">
                <LiquidButton
                  variant="primary"
                  onClick={handleSubmit}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                  <span>{content.error.retryButton}</span>
                </LiquidButton>
                <LiquidButton
                  variant="secondary"
                  onClick={() => {
                    setModalState("form");
                    setGaugeStatus("idle");
                  }}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center"
                >
                  <span>{content.error.reviewButton}</span>
                </LiquidButton>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs text-stone-500 hover:text-stone-800 underline py-2 cursor-pointer"
              >
                Fermer la fenêtre
              </button>
            </div>
          )}

          {/* ÉTAT 3 : Succès */}
          {modalState === "success" && (
            <div className="py-6 px-4 sm:px-6 text-center flex flex-col items-center justify-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{content.success.badge}</span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-brand-charcoal">
                  {content.success.title}
                </h3>
                <p className="text-sm text-brand-purple font-medium mt-1">
                  {content.success.thankYou(firstName)}
                </p>
              </div>

              {/* Récapitulatif commande */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm w-full text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Format choisi :</span>
                  <span className="font-bold text-brand-charcoal">
                    {selectedOffer.name} ({selectedOffer.format})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Prix après accord :</span>
                  <span className="font-bold text-brand-purple tabular-nums">
                    {formatOfferPrice(selectedOffer.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Livraison :</span>
                  <span className="font-bold text-emerald-700">
                    Gratuite à {quartier}
                  </span>
                </div>
                {texteAEcrire ? (
                  <div className="text-xs pt-1">
                    <span className="text-stone-500 block mb-0.5">
                      Message sur la photo :
                    </span>
                    <span className="italic text-stone-800 bg-stone-50 p-2 rounded-lg block border border-stone-200/60">
                      « {texteAEcrire} »
                    </span>
                  </div>
                ) : (
                  <div className="text-xs pt-1 text-stone-600 italic">
                    Texte : propositions personnalisées envoyées par WhatsApp.
                  </div>
                )}
              </div>

              {/* Rappel promesse */}
              <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-4 text-left w-full">
                <p className="text-xs text-stone-700 leading-relaxed">
                  📱 <strong>Prochaine étape :</strong> {content.success.reminder}
                </p>
              </div>

              {/* Bouton WhatsApp */}
              <div className="w-full space-y-2.5 pt-2">
                <LiquidButton
                  as="a"
                  variant="whatsapp"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    content.success.whatsappMessage(nom.trim())
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[50px] py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{content.success.whatsappButton}</span>
                </LiquidButton>

                <LiquidButton
                  variant="secondary"
                  onClick={handleResetAndClose}
                  className="w-full min-h-[48px] py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center"
                >
                  <span>{content.success.closeButton}</span>
                </LiquidButton>
              </div>
            </div>
          )}

          {/* ÉTAT 4 : Formulaire mono-écran rapide */}
          {modalState === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur de validation si présent */}
              {validationError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* 1. SELECTION DE LA PHOTO (Zone tactile mobile-first) */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="order-photo-input"
                />

                <label
                  htmlFor="order-photo-input"
                  className={`block relative cursor-pointer rounded-2xl border-2 border-dashed p-4 transition-all text-center ${
                    photoPreview
                      ? "border-brand-purple bg-brand-purple/5"
                      : "border-stone-300 hover:border-brand-purple bg-white hover:bg-stone-50"
                  }`}
                >
                  {photoPreview ? (
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Aperçu photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple">
                          <Check className="w-3.5 h-3.5" />
                          <span>{content.photoReady}</span>
                        </span>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {photoFile?.name}
                          {photoFile?.size && (
                            <span className="ml-1 text-emerald-700 font-medium">
                              · {photoFile.size >= 1024 * 1024
                                ? `${(photoFile.size / (1024 * 1024)).toFixed(1)} Mo`
                                : `${Math.round(photoFile.size / 1024)} Ko`}{" "}
                              (Qualité originale)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 px-2 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-2 shadow-sm">
                        {isCompressing ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-brand-charcoal">
                        {content.photoLabel}
                      </span>
                      <span className="text-xs text-stone-500 mt-0.5">
                        {content.photoSub}
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* 2. CHOIX DU FORMAT (Source : OFFERS) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                    {content.formatTitle}
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    {content.freeDelivery}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {OFFERS.map((offer) => {
                    const isSelected = selectedFormat === offer.id;
                    return (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedFormat(offer.id)}
                        className={`relative rounded-2xl p-3.5 cursor-pointer border-2 transition-all flex items-center justify-between bg-white ${
                          isSelected
                            ? "border-brand-purple shadow-sm bg-brand-purple/[0.02]"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-brand-purple bg-brand-purple text-white"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-brand-charcoal">
                                {offer.name} ({offer.format})
                              </span>
                              {offer.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
                                  {offer.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {offer.slogan}
                            </p>
                          </div>
                        </div>

                        <div className="text-right pl-2">
                          <span className="font-heading font-bold text-base text-brand-purple tabular-nums whitespace-nowrap">
                            {formatOfferPrice(offer.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. MESSAGE SUR LA PHOTO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                    {content.messageLabel}
                  </label>
                  {!laisserProposerTexte && (
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        texteAEcrire.length > 90
                          ? "text-rose-600"
                          : "text-stone-400"
                      }`}
                    >
                      {texteAEcrire.length} / 100
                    </span>
                  )}
                </div>

                {/* Suggestions en pilules cliquables */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {content.messageSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleSuggestionClick(sug)}
                      className="text-xs px-3 py-1.5 min-h-[36px] rounded-full bg-stone-100 hover:bg-brand-purple/10 active:bg-brand-purple/20 text-stone-700 hover:text-brand-purple transition-colors border border-stone-200/80 cursor-pointer flex items-center"
                    >
                      « {sug} »
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  maxLength={100}
                  disabled={laisserProposerTexte}
                  value={texteAEcrire}
                  onChange={(e) => {
                    setTexteAEcrire(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder={
                    laisserProposerTexte
                      ? "On te proposera des idées touchantes par WhatsApp ✨"
                      : content.messagePlaceholder
                  }
                  className={`w-full px-3.5 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-purple/30 ${
                    laisserProposerTexte
                      ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                      : "bg-white text-brand-charcoal border-stone-300 focus:border-brand-purple"
                  }`}
                />

                {/* Case à cocher "Je ne sais pas encore" */}
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={laisserProposerTexte}
                    onChange={(e) => {
                      setLaisserProposerTexte(e.target.checked);
                      if (e.target.checked) {
                        setValidationError(null);
                      }
                    }}
                    className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-stone-300"
                  />
                  <span className="text-xs text-stone-600 font-medium">
                    {content.letUsProposeLabel}
                  </span>
                </label>
              </div>

              {/* 4. ÉCHÉANCE (Optionnel) */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{content.timingTitle}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {content.timingOptions.map((opt) => {
                    const isSelected = echeance === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setEcheance((prev) => (prev === opt.id ? "" : opt.id))
                        }
                        className={`min-h-[44px] py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. COORDONNÉES ET LIVRAISON À OUAGADOUGOU */}
              <div className="space-y-3.5 pt-2 border-t border-stone-200">
                <div>
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block mb-1">
                    {content.contact.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={content.contact.namePlaceholder}
                    className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block mb-1">
                    {content.contact.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => {
                      setTelephone(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={content.contact.phonePlaceholder}
                    className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block mb-1">
                    {content.contact.neighborhoodLabel}
                  </label>
                  <input
                    type="text"
                    value={quartier}
                    onChange={(e) => {
                      setQuartier(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={content.contact.neighborhoodPlaceholder}
                    className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-white"
                  />

                  {/* Chips de sélection rapide des quartiers */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {content.contact.quickNeighborhoods.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleNeighborhoodClick(q)}
                        className={`text-xs px-3 py-1.5 min-h-[34px] rounded-full border transition cursor-pointer flex items-center ${
                          quartier === q
                            ? "bg-brand-purple text-white border-brand-purple font-bold shadow-xs"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repère de livraison optionnel */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowLandmark(!showLandmark)}
                    className="min-h-[36px] py-1 text-xs font-semibold text-brand-purple flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{content.contact.landmarkToggle}</span>
                    {showLandmark ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {showLandmark && (
                    <input
                      type="text"
                      value={adresseDetails}
                      onChange={(e) => setAdresseDetails(e.target.value)}
                      placeholder={content.contact.landmarkPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-white mt-1.5 animate-in fade-in"
                    />
                  )}
                </div>
              </div>

              {/* 6. BOUTON D'ACTION ET RÉASSURANCE */}
              <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 pt-3 sticky bottom-0 bg-brand-bg/95 backdrop-blur-md pb-5 sm:pb-3 border-t border-stone-200/40 -mb-4 sm:-mb-6">
                {serverError && (
                  <div className="mb-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{serverError}</span>
                  </div>
                )}

                <LiquidButton
                  type="submit"
                  variant="primary"
                  disabled={isCompressing || gaugeStatus === "uploading" || gaugeStatus === "submitting"}
                  isGauge={true}
                  gaugeStatus={gaugeStatus}
                  gaugeProgress={gaugeProgress}
                  className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-bold text-base shadow-lg shadow-brand-purple/25 flex items-center justify-center gap-2"
                >
                  <span>{content.submitButton}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </LiquidButton>

                <div className="flex items-center justify-center gap-3 text-[11px] text-stone-500 font-medium text-center mt-2.5">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0 FCFA maintenant</span>
                  </span>
                  <span>·</span>
                  <span>Aperçu sous 24 h</span>
                  <span>·</span>
                  <span>Livraison gratuite</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
