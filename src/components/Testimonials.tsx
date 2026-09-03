import React from "react";
import { Star, MapPin, Sparkles, Heart } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Aminata Ouedraogo",
      location: "Ouaga 2000, Ouagadougou",
      package: "Forfait Mémoire",
      comment:
        "J'avais une vieille photo de mariage de mes parents en noir et blanc, déchirée sur les coins. Quand j'ai reçu l'aperçu colorisé sous 24h, j'ai eu des frissons. Ma mère a pleuré en ouvrant son cadre. Le rendu du bois noble est magnifique !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Moussa Sawadogo",
      location: "Karpala, Ouagadougou",
      package: "Forfait Héritage",
      comment:
        "Le principe de voir l'aperçu gratuitement m'a totalement rassuré. J'ai payé par Orange Money après avoir validé le résultat. Livraison rapide et cadre 30x40cm très solide. Service 5 étoiles.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Fatimata Compaoré",
      location: "Dassasgho, Ouagadougou",
      package: "Forfait Mémoire",
      comment:
        "J'ai pris la photo de notre vieille photo avec mon téléphone, et le résultat final est d'une netteté incroyable. Même les yeux et les sourires ont été reconstitués avec soin. Je recommande les yeux fermés.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="py-14 sm:py-24 relative bg-[#FFFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-brand-purple-light px-3.5 py-1.5 rounded-full">
            Témoignages & Souvenirs
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-3">
            Ils ont fait revivre leurs plus beaux moments
          </h2>
          <p className="text-sm sm:text-base text-brand-muted mt-2">
            Des familles à Ouagadougou qui ont préservé l'émotion de leurs proches.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[2rem] p-6 sm:p-7 border border-brand-border/80 shadow-warm-card flex flex-col justify-between hover:shadow-warm-card-hover transition-all relative group"
            >
              <div>
                {/* Stars & Package Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" strokeWidth={1.5} />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-brand-purple bg-brand-purple-light px-2.5 py-0.5 rounded-full">
                    {review.package}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed italic mb-6">
                  « {review.comment} »
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-brand-border/50 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-purple/30 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-brand-charcoal truncate">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-brand-muted flex items-center gap-1 truncate font-medium">
                    <MapPin className="w-3 h-3 text-brand-magenta shrink-0" strokeWidth={2} />
                    <span>{review.location}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
