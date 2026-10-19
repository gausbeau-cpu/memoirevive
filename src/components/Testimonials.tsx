import React from "react";
import { SITE_CONTENT } from "@/content/site";

export default function Testimonials() {
  const content = SITE_CONTENT.testimonials;

  // Règle stricte du projet : Aucun faux avis ou témoignage inventé.
  // La section reste désactivée tant qu'il n'y a pas d'avis clients réels collectés.
  if (!content.enabled || content.items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 relative bg-[#FFFBF7]">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-3.5 py-1.5 rounded-full">
            {content.badge}
          </span>
          <h2 className="font-heading text-fluid-h2 text-brand-charcoal mt-3">
            {content.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((review: { name: string; comment: string }, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm"
            >
              <p className="text-sm text-stone-700 italic">« {review.comment} »</p>
              <p className="font-bold text-xs text-brand-charcoal mt-4">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
