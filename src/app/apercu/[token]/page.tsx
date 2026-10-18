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
import Logo from "@/components/Logo";
import LiquidButton from "@/components/LiquidButton";
import { getPublicPreviewByToken } from "@/lib/supabase-db";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

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
      description: "Tableaux photo personnalisés à Ouagadougou.",
    };
  }

  const title = SITE_CONTENT.publicPreview.openGraph.title(data.clientNom);
  const description = SITE_CONTENT.publicPreview.openGraph.description(
    data.forfaitNom
  );

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
  const content = SITE_CONTENT.publicPreview;

  // 1. Cas : Token introuvable ou inexistant
  if (!data) {
    return (
      <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
            {content.notFound.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {content.notFound.message}
          </p>
          <div className="pt-2 space-y-2">
            <LiquidButton
              as="a"
              variant="whatsapp"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Bonjour Mémoire Vive, j’ai une question sur mon lien d’aperçu."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{content.notFound.whatsappButton}</span>
            </LiquidButton>
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] text-xs font-semibold text-brand-purple hover:underline pt-1"
            >
              {content.notFound.homeButton}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Messages WhatsApp pré-remplis
  const whatsappValidateUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    content.ready.validateMessage(data.clientNom, data.forfaitNom)
  )}`;

  const whatsappRevisionUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    content.ready.adjustMessage(data.clientNom)
  )}`;

  // 2. Cas : Aperçu en cours de préparation (retouche pas encore uploadée)
  if (!data.photoApercuUrl) {
    return (
      <main className="min-h-screen bg-brand-bg flex flex-col justify-between p-4 sm:p-6 selection:bg-brand-purple/20">
        <div className="max-w-lg w-full mx-auto my-auto py-8">
          {/* En-tête marque */}
          <div className="text-center mb-6">
            <Logo size="md" />
          </div>

          {/* Carte d'attente */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Clock className="w-8 h-8 text-brand-purple" strokeWidth={2} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[11px] font-bold uppercase tracking-wider mb-2">
                {content.pending.badge}
              </span>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                {content.pending.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {content.pending.message(data.clientNom, data.forfaitNom)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-left flex items-start gap-3 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={2} />
              <p className="leading-snug">
                {content.pending.notice}
              </p>
            </div>

            <div className="pt-2">
              <LiquidButton
                as="a"
                variant="whatsapp"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Bonjour Mémoire Vive, je suis ${data.clientNom} et je voulais prendre des nouvelles de mon aperçu.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-3 px-5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{content.pending.whatsappButton}</span>
              </LiquidButton>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <footer className="text-center text-[11px] text-stone-500 py-4">
          Mémoire Vive · Tableaux photo personnalisés pour cadeaux d’anniversaire à Ouagadougou 🇧🇫
        </footer>
      </main>
    );
  }

  // 3. Cas : Aperçu prêt et disponible !
  return (
    <main className="min-h-screen bg-brand-bg flex flex-col justify-between p-4 sm:p-6 selection:bg-brand-purple/20">
      <div className="max-w-md sm:max-w-lg w-full mx-auto py-3 sm:py-6 space-y-4 sm:space-y-5">
        {/* En-tête Marque */}
        <div className="flex items-center justify-between px-1">
          <Logo size="sm" showTagline={false} />

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
            <span>{content.ready.badge}</span>
          </span>
        </div>

        {/* Titre & Informations */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold">
            <Heart className="w-3 h-3 fill-brand-purple text-brand-purple" />
            <span>
              {data.forfaitNom} {data.forfaitFormat ? `· ${data.forfaitFormat}` : ""}
            </span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
            {content.ready.title(data.clientNom)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
            {content.ready.subtitle}
          </p>
        </div>

        {/* Carte grand format de l'aperçu */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-stone-200 shadow-sm space-y-3.5 transition-all">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-900 border-2 border-white shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photoApercuUrl}
              alt={`Aperçu tableau pour ${data.clientNom}`}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <span>{content.ready.photoBadge}</span>
            </div>
          </div>

          {/* Rappel du message personnalisé */}
          {data.texteAEcrire && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
              <p className="font-medium text-stone-700">
                {content.ready.customTextLabel(data.texteAEcrire)}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {content.ready.spellingCheckNotice}
              </p>
            </div>
          )}

          {/* Rappel de la garantie */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
            <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="leading-snug">
              {content.ready.guaranteeNotice}
            </p>
          </div>
        </div>

        {/* Boutons d'action WhatsApp */}
        <div className="space-y-3 pt-1">
          {/* Bouton de validation principal */}
          <LiquidButton
            as="a"
            variant="primary"
            href={whatsappValidateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[54px] py-4 px-6 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-brand-purple/25 flex items-center justify-center gap-2.5"
          >
            <span>{content.ready.validateButton}</span>
            <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
          </LiquidButton>

          {/* Lien secondaire de révision */}
          <div className="text-center">
            <a
              href={whatsappRevisionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] text-xs text-stone-500 hover:text-brand-purple transition-colors font-semibold py-2 px-4 rounded-full hover:bg-stone-100"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{content.ready.adjustButton}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="text-center text-[11px] text-stone-500 py-4">
        Mémoire Vive · Tableaux photo personnalisés pour cadeaux d’anniversaire à Ouagadougou 🇧🇫
      </footer>
    </main>
  );
}
