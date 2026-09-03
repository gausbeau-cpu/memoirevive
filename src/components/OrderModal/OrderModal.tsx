"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ShieldCheck } from "lucide-react";
import StepUpload from "./StepUpload";
import StepPackage from "./StepPackage";
import StepContact from "./StepContact";
import StepSuccess from "./StepSuccess";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
}

const DRAFT_KEY = "mv_order_draft";

function loadDraft(): Partial<{
  selectedPackage: string;
  occasionNote: string;
  fullName: string;
  phone: string;
  neighborhood: string;
  addressDetails: string;
}> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(data: object) {
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

export default function OrderModal({
  isOpen,
  onClose,
  initialPackage = "memoire",
}: OrderModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [occasionNote, setOccasionNote] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<string>(initialPackage);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<string>("");

  // Charger le brouillon au montage
  useEffect(() => {
    if (isOpen) {
      const draft = loadDraft();
      if (draft.occasionNote !== undefined) setOccasionNote(draft.occasionNote);
      if (draft.selectedPackage) setSelectedPackage(draft.selectedPackage);
      if (draft.fullName) setFullName(draft.fullName);
      if (draft.phone) setPhone(draft.phone);
      if (draft.neighborhood) setNeighborhood(draft.neighborhood);
      if (draft.addressDetails) setAddressDetails(draft.addressDetails);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Sauvegarder le brouillon à chaque changement des champs texte
  useEffect(() => {
    if (!isOpen) return;
    saveDraft({
      selectedPackage,
      occasionNote,
      fullName,
      phone,
      neighborhood,
      addressDetails,
    });
  }, [isOpen, selectedPackage, occasionNote, fullName, phone, neighborhood, addressDetails]);

  useEffect(() => {
    if (initialPackage) {
      setSelectedPackage(initialPackage);
    }
  }, [initialPackage]);

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

  if (!isOpen) return null;

  const handleReset = () => {
    setCurrentStep(1);
    setPhotoPreview(null);
    setPhotoFile(null);
    setOccasionNote("");
    setFullName("");
    setPhone("");
    setNeighborhood("");
    setAddressDetails("");
    onClose();
  };

  const stepsHeader = [
    { num: 1, label: "Photo" },
    { num: 2, label: "Forfait" },
    { num: 3, label: "Livraison" },
    { num: 4, label: "Confirmation" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      {/* Modal Container */}
      <div
        className="bg-white w-full sm:max-w-xl rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-border/70 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-purple" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-brand-charcoal leading-tight">
                Demande de restauration gratuite
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                <span>0 FCFA maintenant · Paiement après aperçu</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Step Progress Bar */}
        {currentStep < 4 && (
          <div className="px-6 pt-3 pb-2 bg-stone-50/50 border-b border-brand-border/40">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-brand-purple -translate-y-1/2 z-0 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (stepsHeader.length - 2)) * 100}%`,
                }}
              />

              {stepsHeader.slice(0, 3).map((s) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-brand-purple text-white shadow-sm"
                          : isCurrent
                          ? "bg-brand-purple text-white ring-4 ring-brand-purple/20 shadow-glow-purple"
                          : "bg-white text-stone-400 border border-stone-300"
                      }`}
                    >
                      {s.num}
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 ${
                        isCurrent ? "text-brand-purple" : "text-stone-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentStep === 1 && (
            <StepUpload
              photoPreview={photoPreview}
              onPhotoSelected={(url, file) => {
                setPhotoPreview(url);
                setPhotoFile(file);
              }}
              occasionNote={occasionNote}
              onOccasionNoteChange={setOccasionNote}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <StepPackage
              selectedPackage={selectedPackage}
              onSelectPackage={setSelectedPackage}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <StepContact
              fullName={fullName}
              onFullNameChange={setFullName}
              phone={phone}
              onPhoneChange={setPhone}
              neighborhood={neighborhood}
              onNeighborhoodChange={setNeighborhood}
              addressDetails={addressDetails}
              onAddressDetailsChange={setAddressDetails}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <StepSuccess
              orderData={{
                photoFile,
                photoPreview,
                packageId: selectedPackage,
                fullName,
                phone,
                neighborhood,
                addressDetails,
                occasionNote,
              }}
              onClose={handleReset}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
