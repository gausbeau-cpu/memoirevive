"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le nouveau code doit comporter au moins 6 caractères.");
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
        setError(data.error || "Impossible de mettre à jour le mot de passe.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Une erreur de communication est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#150F1B] text-[#F5F0FA]">
      <AdminHeader
        title="Paramètres & Sécurité"
        subtitle="Gestion du code de connexion et des accès au Studio Mémoire Vive"
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {/* Bandeau Informatif Sécurité */}
        <div className="bg-[#241B2E] border border-purple-500/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 min-w-[48px] rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg">
                Protection Active du Studio
              </h2>
              <p className="text-xs text-stone-400">
                Rate-limiting anti brute-force (5 tentatives / 15 min) et jetons signés HMAC-SHA256
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>wendclasss@gmail.com</span>
          </div>
        </div>

        {/* Carte de modification du mot de passe */}
        <div className="bg-[#241B2E] border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 text-brand-purple flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg">
                Modifier le code de connexion
              </h3>
              <p className="text-xs text-stone-400">
                Changez le mot de passe requis pour vous connecter à l’adresse /wendclass
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Code modifié avec succès !</p>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  Votre nouveau code est immédiatement enregistré et actif pour vos futures connexions.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
            {/* Mot de passe actuel */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Code actuel *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  disabled={loading}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Code de connexion actuel"
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
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Nouveau code *
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
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
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
                  placeholder="Répétez le nouveau code"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm transition-colors shadow-lg shadow-brand-purple/30 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Enregistrement en cours…" : "Mettre à jour le code de connexion"}
              </button>
            </div>
          </form>
        </div>

        {/* Bonnes pratiques de sécurité */}
        <div className="bg-[#1C1425] border border-white/5 rounded-2xl p-5 text-xs text-stone-400 space-y-2">
          <div className="flex items-center gap-2 text-stone-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Recommandations de sécurité</span>
          </div>
          <p>
            • Choisissez un mot de passe robuste combinant lettres, chiffres et caractères spéciaux.
          </p>
          <p>
            • Ne communiquez jamais votre code de connexion à des tiers.
          </p>
          <p>
            • En cas d’oubli de votre code, l’accès de secours reste possible via les variables d’environnement du serveur Vercel.
          </p>
        </div>
      </main>
    </div>
  );
}
