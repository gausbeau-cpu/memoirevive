import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

export const metadata = {
  title: "Conditions Générales | Mémoire Vive",
  description:
    "Conditions générales de vente et d’utilisation du service de tableaux photo personnalisés Mémoire Vive à Ouagadougou.",
};

export default function ConditionsGenerales() {
  const brand = SITE_CONTENT.brand;

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-charcoal">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="sm" showTagline={false} />

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-purple hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l’accueil</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white rounded-[2rem] p-6 sm:p-12 border border-stone-200 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Informations contractuelles</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
            Conditions Générales
          </h1>
          <p className="text-sm text-stone-500 mb-8 pb-6 border-b border-stone-200">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-6 text-sm sm:text-base text-stone-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                1. Objet du service
              </h2>
              <p>
                Mémoire Vive propose un service de création de tableaux photo personnalisés montés sur panneau PVC, destinés aux cadeaux d’anniversaire à Ouagadougou. La prestation comprend l’optimisation et la retouche du portrait, l’intégration calligraphique d’un message personnalisé sur la photo, le tirage monté prêt à offrir et la livraison gratuite.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                2. Aperçu gratuit sans aucun paiement préalable
              </h2>
              <p>
                L’envoi de la commande via le formulaire en ligne n’engage aucun paiement immédiat (0 FCFA d’avance). Un aperçu numérique haute définition est adressé par WhatsApp sous 24 heures. Le client est libre de valider l’aperçu ou de demander des ajustements. Si le résultat ne convient pas, la commande est annulée sans aucun frais.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                3. Tarification et paiement Mobile Money
              </h2>
              <p>
                Les tarifs des trois formats sont fermes et affichés en Francs CFA (FCFA) : Petit 30x40 cm (12 000 FCFA), Coup de cœur 40x60 cm (20 000 FCFA) et Grand 50x70 cm (30 000 FCFA). Le règlement s’effectue exclusivement après validation de l’aperçu, par Mobile Money (Orange Money ou Moov Money).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                4. Fabrication, livraison et garantie de remplacement
              </h2>
              <p>
                Dès réception du règlement faisant suite à la validation de l’aperçu, le tableau est monté en atelier et livré gratuitement à Ouagadougou sous 24 heures (délai total maximum de 48 heures). Si le tableau arrive endommagé ou détérioré lors du transport, il est remplacé immédiatement et sans frais supplémentaires.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                5. Contact et assistance
              </h2>
              <p>
                Pour toute question ou suivi de commande, notre équipe est joignable directement par WhatsApp au{" "}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-purple hover:underline"
                >
                  {brand.phone}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
