"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wendclass/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimitSeconds(data.retryAfter || 600);
          setError(
            data.message ||
              "Trop de tentatives. Accès temporairement verrouillé pour 15 minutes."
          );
        } else {
          setError(
            data.error ||
              `Identifiants incorrects. (${data.remainingAttempts ?? "?"} tentative(s) restante(s))`
          );
        }
        setLoading(false);
        return;
      }

      // Connexion réussie -> Redirection vers le dashboard
      window.location.href = "/wendclass";
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#150F1B] flex flex-col items-center justify-center p-4 selection:bg-brand-purple/30 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="absolute w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-80 h-80 bg-brand-magenta/10 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-[#241B2E] border border-purple-500/20 rounded-3xl p-7 sm:p-9 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {/* Logo officiel Mémoire Vive dans pastille claire arrondie */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-4">
              <Logo size="md" variant="on-dark" href={null} />
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F0FA] tracking-tight">
              Studio Workspace
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Accès réservé à l'administrateur
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Identifiant
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  disabled={loading || rateLimitSeconds !== null}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domaine.bf"
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  disabled={loading || rateLimitSeconds !== null}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || rateLimitSeconds !== null}
              className="w-full mt-2 py-3.5 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Vérification...</span>
              ) : (
                <>
                  <span>Accéder à l'espace de travail</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chiffrement bout en bout & Rate limiting actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
