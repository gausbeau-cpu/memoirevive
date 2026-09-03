"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles, AlertCircle, ArrowRight, X } from "lucide-react";

interface StepUploadProps {
  photoPreview: string | null;
  onPhotoSelected: (url: string, file: File | null) => void;
  occasionNote: string;
  onOccasionNoteChange: (note: string) => void;
  onNext: () => void;
}

export default function StepUpload({
  photoPreview,
  onPhotoSelected,
  occasionNote,
  onOccasionNoteChange,
  onNext,
}: StepUploadProps) {
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, HEIC).");
        return;
      }
      setError("");
      const objectUrl = URL.createObjectURL(file);
      onPhotoSelected(objectUrl, file);
    }
    // Reset file input value so re-selecting same file triggers change
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez déposer un fichier image valide.");
        return;
      }
      setError("");
      const objectUrl = URL.createObjectURL(file);
      onPhotoSelected(objectUrl, file);
    }
  };

  const handleUseSample = (url: string) => {
    setError("");
    onPhotoSelected(url, null);
  };

  const handleContinue = () => {
    if (!photoPreview) {
      setError("Veuillez sélectionner ou charger une photo pour continuer.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="text-center sm:text-left">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-charcoal">
          Étape 1 : Téléchargez votre photo
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Chargez votre photo ou prenez-la directement avec votre téléphone.
        </p>
      </div>

      {/* Upload Dropzone - Entire container is clickable/tapable */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative w-full border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all select-none ${
          isDragging
            ? "border-brand-purple bg-brand-purple-light/40 scale-[1.01]"
            : photoPreview
            ? "border-brand-purple bg-brand-purple-light/20"
            : "border-brand-border hover:border-brand-purple bg-stone-50 hover:bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          id="photo-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Sélectionner une photo"
        />

        {photoPreview ? (
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-48 sm:w-48 sm:h-56 rounded-3xl overflow-hidden shadow-warm-card border-2 border-white mb-3">
              <img
                src={photoPreview}
                alt="Aperçu photo chargée"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onPhotoSelected("", null);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-black transition-colors shadow-md z-10"
                title="Supprimer la photo"
                aria-label="Supprimer la photo"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple-light text-brand-purple text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" strokeWidth={2} />
              <span>Photo prête ! Touchez n'importe où pour changer</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3 py-2">
            <div className="w-16 h-16 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center shadow-sm">
              <Upload className="w-8 h-8" strokeWidth={2} />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-brand-charcoal">
                Touchez ici pour choisir votre photo
              </p>
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                Galerie smartphone, appareil photo ou fichier
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-700 text-[11px] font-semibold">
              <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Photo floue, ancienne ou abîmée acceptée</span>
            </div>
          </div>
        )}
      </div>


      {/* Quick Sample Selector */}
      {!photoPreview && (
        <div className="pt-1">
          <p className="text-xs font-semibold text-brand-muted mb-2 text-center sm:text-left">
            Ou essayez instantanément avec un exemple :
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleUseSample(
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                )
              }
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-brand-purple-light/40 border border-stone-200 text-xs font-medium text-brand-charcoal flex items-center gap-2.5 transition-colors text-left"
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                alt="Exemple Portrait"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="truncate font-semibold">Portrait de famille</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleUseSample(
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
                )
              }
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-brand-purple-light/40 border border-stone-200 text-xs font-medium text-brand-charcoal flex items-center gap-2.5 transition-colors text-left"
            >
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                alt="Exemple Portrait Vintage"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="truncate font-semibold">Portrait vintage N&B</span>
            </button>
          </div>
        </div>
      )}

      {/* Optional Note */}
      <div>
        <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1.5">
          Précisions ou occasion <span className="text-stone-400 font-normal lowercase">(optionnel)</span>
        </label>
        <textarea
          value={occasionNote}
          onChange={(e) => onOccasionNoteChange(e.target.value)}
          placeholder="Ex: C'est le mariage de mes parents en 1984. Merci de raviver les détails et coloriser les tenues..."
          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-purple focus:outline-none placeholder:text-stone-400 min-h-[75px] resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Next Step Button (Pill) */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full min-h-[50px] py-3.5 px-6 rounded-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-base shadow-glow-purple transition-all flex items-center justify-center gap-2"
      >
        <span>Continuer : Choisir mon forfait</span>
        <ArrowRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
