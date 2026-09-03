import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Clock,
  Heart,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { getPublicPreviewByToken } from "@/lib/supabase-db";

interface PageProps {
  params: {
    token: string;
  };
}

// -------------------------------------------------------------------------
// Métadonnées dynamiques & Balises Open Graph pour Vignette WhatsApp
// -------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await getPublicPreviewByToken(params.token);

  if (!data) {
    return {
      title: "Aperçu de commande | Mémoire Vive",
      description: "Service de restauration et d'encadrement photo à Ouagadougou.",
    };
  }

  const title = `${data.clientNom}, votre aperçu Mémoire Vive est prêt 💜`;
  const description = `Découvrez le résultat de votre ${data.forfaitNom}. Vous ne payez que si ça vous plaît.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: data.photoApercuUrl ? [{ url: data.photoApercuUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.photoApercuUrl ? [data.photoApercuUrl] : undefined,
    },
  };
}

// -------------------------------------------------------------------------
// Page Publique Aperçu
// -------------------------------------------------------------------------
export default async function PublicPreviewPage({ params }: PageProps) {
  const data = await getPublicPreviewByToken(params.token);

  // 1. Cas : Token introuvable ou inexistant
  if (!data) {
    return (
      <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-warm-card space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
            Lien d'aperçu introuvable
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Ce lien est invalide ou a expiré. Si vous venez de passer commande,
            vérifiez le lien reçu par message.
          </p>
          <div className="pt-2 space-y-2">
            <a
              href="https://wa.me/22675864399?text=Bonjour%20M%C3%A9moire%20Vive%2C%20j%27ai%20une%20question%20sur%20mon%20lien%20d%27aper%C3%A7u."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l'équipe sur WhatsApp</span>
            </a>
            <Link
              href="/"
              className="inline-block text-xs font-semibold text-brand-purple hover:underline pt-2"
            >
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Messages WhatsApp pré-remplis
  const whatsappValidateUrl = `https://wa.me/22675864399?text=${encodeURIComponent(
    `Bonjour, je valide l'aperçu de ma commande (${data.clientNom} — forfait ${data.forfaitNom}). Comment procéder pour le paiement ?`
  )}`;

  const whatsappRevisionUrl = `https://wa.me/22675864399?text=${encodeURIComponent(
    `Bonjour, l'aperçu de ma commande (${data.clientNom}) ne me convient pas encore, pouvons-nous en discuter ?`
  )}`;

  // 2. Cas : Aperçu en cours de préparation (retouche pas encore uploadée)
  if (!data.photoApercuUrl) {
    return (
      <main className="min-h-screen bg-brand-bg flex flex-col justify-between p-4 sm:p-6 selection:bg-brand-purple/20">
        <div className="max-w-lg w-full mx-auto my-auto py-8">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-2xl bg-brand-purple text-white flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-brand-gold" />
              </div>
              <span className="font-heading font-black text-xl text-brand-charcoal tracking-tight">
                Mémoire <span className="text-brand-purple">Vive</span>
              </span>
            </Link>
          </div>

          {/* Pending Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-warm-card text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Clock className="w-8 h-8 text-brand-purple" strokeWidth={2} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-purple-light text-brand-purple text-[11px] font-bold uppercase tracking-wider mb-2">
                Restauration en cours
              </span>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                Votre aperçu est en cours de préparation
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                Bonjour <strong className="text-brand-charcoal">{data.clientNom}</strong> !
                Nos graphistes sont actuellement en train de restaurer votre photo avec soin pour votre{" "}
                <span className="font-semibold text-brand-purple">
                  {data.forfaitNom} {data.forfaitFormat ? `(${data.forfaitFormat})` : ""}
                </span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-left flex items-start gap-3 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={2} />
              <p className="leading-snug">
                Vous recevrez une notification par WhatsApp dès que votre aperçu sera prêt. Vous pourrez alors le consulter ici en haute définition.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/22675864399?text=Bonjour%20M%C3%A9moire%20Vive%2C%20je%20suis%20${encodeURIComponent(
                  data.clientNom
                )}%20et%20je%20voulais%20prendre%20des%20nouvelles%20de%20ma%20photo.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-3 px-5 rounded-full bg-stone-100 hover:bg-stone-200 text-brand-charcoal font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Nous écrire sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[11px] text-brand-muted py-4">
          Mémoire Vive · Préservons vos précieux souvenirs à Ouagadougou 🇧🇫
        </footer>
      </main>
    );
  }

  // 3. Cas : Aperçu prêt et disponible !
  return (
    <main className="min-h-screen bg-brand-bg flex flex-col justify-between p-3.5 sm:p-6 selection:bg-brand-purple/20">
      <div className="max-w-md sm:max-w-lg w-full mx-auto py-3 sm:py-6 space-y-4 sm:space-y-5">
        {/* Header Branding */}
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-brand-gold" />
            </div>
            <span className="font-heading font-black text-lg text-brand-charcoal tracking-tight">
              Mémoire <span className="text-brand-purple">Vive</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
            <span>Aperçu Gratuit</span>
          </span>
        </div>

        {/* Title & Customer Intro */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-purple-light text-brand-purple text-xs font-bold">
            <Heart className="w-3 h-3 fill-brand-purple text-brand-purple" />
            <span>{data.forfaitNom} {data.forfaitFormat ? `· ${data.forfaitFormat}` : ""}</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
            {data.clientNom}, votre souvenir est prêt
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto">
            Découvrez la restauration réalisée par notre studio.
          </p>
        </div>

        {/* Large Framed Preview Image Card */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-brand-border shadow-warm-card space-y-3.5 transition-all">
          <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-stone-900 border-2 border-white shadow-md group">
            <img
              src={data.photoApercuUrl}
              alt={`Aperçu restauré pour ${data.clientNom}`}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>Haute Définition</span>
            </div>
          </div>

          {/* Guarantee Reassurance Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
            <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="leading-snug">
              <strong>Zéro risque :</strong> Si le résultat vous convient, nous lançons l'impression et l'encadrement. Si ce n'est pas le cas, <strong>vous ne payez absolument rien</strong>.
            </p>
          </div>
        </div>

        {/* Call To Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Main Acceptance Button */}
          <a
            href={whatsappValidateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[54px] py-4 px-6 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-hover hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-glow-purple flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>🎉 Ça me plaît, je valide !</span>
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </a>

          {/* Secondary Revision Link */}
          <div className="text-center">
            <a
              href={whatsappRevisionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-purple transition-colors font-semibold py-1.5 px-3 rounded-full hover:bg-stone-100"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ce n'est pas encore tout à fait ça ? Parlons-en</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-brand-muted py-4">
        Mémoire Vive · Service de restauration photo & encadrement à Ouagadougou 🇧🇫
      </footer>
    </main>
  );
}
