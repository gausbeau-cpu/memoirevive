import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { SITE_CONTENT, WHATSAPP_NUMBER } from "@/content/site";

export const metadata = {
  title: "Politique de Confidentialité | Mémoire Vive",
  description:
    "Protection des données personnelles et stricte confidentialité des photos confiées à Mémoire Vive.",
};

export default function PolitiqueDeConfidentialite() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Protection des données</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-stone-500 mb-8 pb-6 border-b border-stone-200">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-6 text-sm sm:text-base text-stone-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                1. Respect strict de la vie privée
              </h2>
              <p>
                Mémoire Vive traite les photos transmises avec le plus haut niveau de confidentialité. Les clichés personnels, souvenirs familiaux et portraits confiés ne sont jamais divulgués, vendus ou réutilisés à des fins publicitaires sans autorisation écrite et préalable.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                2. Données collectées
              </h2>
              <p>
                Dans le cadre strict du traitement et de la livraison de ta commande, nous collectons : ton nom, ton numéro WhatsApp, ton quartier à Ouagadougou, tes indications éventuelles de livraison et le fichier photo sélectionné. Ces données ne sont exploitées que pour la communication de l’aperçu et l’acheminement du tableau.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                3. Sécurité et conservation
              </h2>
              <p>
                Les photos originales sont stockées dans un espace sécurisé et privé (bucket non accessible publiquement). L’accès public à l’aperçu est protégé par un identifiant aléatoire sécurisé (UUID non devinable).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                4. Tes droits et suppression
              </h2>
              <p>
                Tu disposes d’un droit d’accès, de rectification et de suppression totale de tes photos et données personnelles. Pour exercer ce droit, un simple message via WhatsApp suffit au{" "}
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
