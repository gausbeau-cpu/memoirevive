import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, FileText } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Conditions Générales | Mémoire Vive",
  description: "Conditions générales d'utilisation et de vente du service Mémoire Vive.",
};

export default function ConditionsGenerales() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-charcoal">
      {/* Top Simple Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center text-white shadow-glow-purple">
              <Sparkles className="w-4 h-4 text-brand-gold" strokeWidth={2} />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-brand-charcoal">
              Mémoire <span className="text-brand-purple">Vive</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-purple hover:text-brand-purple-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white rounded-[2rem] p-6 sm:p-12 border border-brand-border/80 shadow-warm-card">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple-light text-brand-purple text-xs font-bold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Informations contractuelles</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
            Conditions Générales
          </h1>
          <p className="text-sm text-brand-muted mb-8 pb-6 border-b border-brand-border/60">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          {/* Legal Text Area */}
          <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-brand-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                1. Objet du service
              </h2>
              <p>
                Le contenu de cette section sera fourni prochainement. Mémoire Vive propose des services de restauration numérique de photographies et d'encadrement artisanal livrés à Ouagadougou.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                2. Aperçu gratuit et commande sans engagement
              </h2>
              <p>
                Le contenu de cette section sera fourni prochainement. Le client bénéficie systématiquement d'un aperçu numérique gratuit avant tout paiement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                3. Tarifs et modalités de paiement
              </h2>
              <p>
                Le contenu de cette section sera fourni prochainement. Les paiements s'effectuent par Mobile Money (Orange Money, Moov Money) uniquement après validation de l'aperçu.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                4. Livraison et garantie
              </h2>
              <p>
                Le contenu de cette section sera fourni prochainement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                5. Service client & contact
              </h2>
              <p>
                Pour toute demande ou assistance concernant une commande, vous pouvez joindre notre service client sur WhatsApp au{" "}
                <a
                  href="https://wa.me/22675864399"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-purple hover:underline"
                >
                  +226 75 86 43 99
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
