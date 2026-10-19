"use client";

import React, { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2, X } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le nouveau code doit contenir au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmation ne correspond pas au nouveau code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/wendclass/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible de modifier le code de connexion.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Erreur modification mot de passe:", err);
      setError("Une erreur de communication est survenue avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#241B2E] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative text-[#F5F0FA]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        {/* Bouton de fermeture tactile */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6 pr-12">
          <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl bg-brand-purple/20 border border-brand-purple/30 text-brand-purple flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 id="change-password-title" className="font-heading text-lg sm:text-xl font-bold tracking-tight">
              Code de connexion
            </h2>
            <p className="text-xs text-stone-400">
              Modifier le mot de passe d’accès au Studio
            </p>
          </div>
        </div>

        {/* Message de succès */}
        {success ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Code modifié avec succès !
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
                Votre nouveau code est immédiatement actif pour vos prochaines connexions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm transition-colors shadow-lg shadow-brand-purple/30"
            >
              Fermer et continuer
            </button>
          </div>
        ) : (
          /* Formulaire */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Mot de passe actuel */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Code de connexion actuel *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  disabled={loading}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Code actuel"
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 pr-11 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white"
                  aria-label={showCurrent ? "Masquer" : "Afficher"}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Nouveau code de connexion *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  disabled={loading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6 caractères minimum"
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 pr-11 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white"
                  aria-label={showNew ? "Masquer" : "Afficher"}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmer nouveau mot de passe */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Confirmer le nouveau code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répéter le nouveau code"
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 pr-11 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white"
                  aria-label={showConfirm ? "Masquer" : "Afficher"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              💡 Le nouveau code sera immédiatement enregistré et actif pour les prochaines connexions.
            </p>

            {/* Boutons d'action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-bold text-sm transition-colors border border-white/10"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm transition-colors shadow-lg shadow-brand-purple/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Enregistrement…</span>
                ) : (
                  <span>Enregistrer</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
