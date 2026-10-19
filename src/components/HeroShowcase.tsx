"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { GALLERY_SLOTS } from "@/content/gallery";
import { useHeroCycle } from "@/hooks/useHeroCycle";

const PLACEHOLDER_GRADIENTS = [
  "from-[#7C3AED]/20 via-[#EC4899]/15 to-[#F59E0B]/20",
  "from-[#EC4899]/20 via-[#7C3AED]/15 to-[#F59E0B]/20",
  "from-[#7C3AED]/25 via-[#F59E0B]/15 to-[#EC4899]/20",
  "from-[#F59E0B]/20 via-[#EC4899]/20 to-[#7C3AED]/15",
];

export default function HeroShowcase() {
  const {
    currentIndex,
    previousIndex,
    isTransitioning,
    isPaused,
    isMounted,
    isReducedMotion,
    cycleKey,
    goToIndex,
  } = useHeroCycle();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Préchargement des images 2 à 4 après le montage pour éviter tout clignotement
  useEffect(() => {
    if (typeof window === "undefined") return;

    GALLERY_SLOTS.slice(1).forEach((slot) => {
      const img = new window.Image();
      img.src = slot.afterPath;
    });
  }, []);

  const activeSlot = GALLERY_SLOTS[currentIndex] || GALLERY_SLOTS[0];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Conteneur principal ratio 4/5 imposé, arrondi 20px, double ombre douce, max-h 70svh sur mobile */}
      <div className="relative w-full aspect-[4/5] max-h-[70svh] max-w-md rounded-[20px] overflow-hidden shadow-2xl shadow-stone-300/60 border border-stone-200/80 bg-[#F3E8FF] select-none">
        {/* Grille d'empilement : toutes les images empilées dans la même cellule */}
        <div className="w-full h-full grid grid-cols-1 grid-rows-1">
          {GALLERY_SLOTS.map((slot, idx) => {
            const isCurrent = idx === currentIndex;
            const isPrev = idx === previousIndex;
            const isVisible = isCurrent || isPrev || (!isMounted && idx === 0);
            const hasError = imageErrors[slot.id];

            let opacity = 0;
            let zIndex = 0;
            let willChange = "auto";

            if (!isMounted) {
              if (idx === 0) {
                opacity = 1;
                zIndex = 2;
              }
            } else if (isCurrent) {
              opacity = 1;
              zIndex = 2;
              if (isTransitioning) willChange = "opacity, transform";
            } else if (isPrev) {
              opacity = 0;
              zIndex = 1;
              if (isTransitioning) willChange = "opacity, transform";
            }

            const transition = isReducedMotion
              ? "none"
              : isTransitioning
              ? "opacity 700ms var(--ease-out)"
              : "none";

            const gradientClass =
              PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length];

            return (
              <div
                key={slot.id}
                style={{
                  gridArea: "1 / 1",
                  opacity,
                  zIndex,
                  transition,
                  willChange,
                }}
                className="w-full h-full overflow-hidden bg-[#F3E8FF]"
                aria-hidden={!isCurrent && !(!isMounted && idx === 0)}
              >
                {/* Couche Zoom lent de 1.00 à 1.06 sur 3.2s */}
                <div
                  key={isCurrent ? `zoom-${cycleKey}` : `static-${idx}`}
                  className={`w-full h-full relative ${
                    isCurrent && !isReducedMotion && isMounted
                      ? "hero-showcase-zoom"
                      : ""
                  }`}
                  style={{
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                >
                  {!hasError ? (
                    <Image
                      src={slot.afterPath}
                      alt={`${slot.name} — Tableau photo personnalisé`}
                      fill
                      priority={idx === 0}
                      sizes="(min-width: 1024px) 480px, 92vw"
                      quality={80}
                      className="object-cover"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [slot.id]: true }));
                      }}
                    />
                  ) : (
                    /* Placeholder animé élégant si image non encore déposée */
                    <div
                      className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                      {/* Silhouette de cadre tableau 3:4 */}
                      <div className="w-48 aspect-[3/4] rounded-2xl border-2 border-dashed border-brand-purple/30 bg-white/60 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center p-4 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center shadow-inner">
                          <ImageIcon className="w-6 h-6 text-brand-purple" strokeWidth={1.8} />
                        </div>

                        <div className="space-y-1">
                          <span className="font-heading text-sm font-bold text-brand-charcoal block">
                            {slot.name}
                          </span>
                          <span className="text-xs font-semibold text-brand-purple bg-brand-purple/10 px-2.5 py-0.5 rounded-full inline-block">
                            Réalisation à venir
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende discrète en bas à gauche avec contraste garanti >= 4.5:1 */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="bg-black/65 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" strokeWidth={2} />
            <span className="truncate max-w-[200px] sm:max-w-xs">
              {activeSlot.name}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation sous l'image : 4 indicateurs avec cible tactile >= 44px */}
      <nav
        aria-label="Navigation des réalisations du hero"
        className="flex items-center justify-center gap-1 sm:gap-1.5 pt-3"
      >
        {GALLERY_SLOTS.map((slot, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => goToIndex(idx)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-full"
              aria-label={`Voir la réalisation ${idx + 1} sur ${GALLERY_SLOTS.length} : ${slot.name}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="w-9 sm:w-11 h-1.5 rounded-full bg-stone-200 overflow-hidden relative block group-hover:bg-stone-300 transition-colors">
                {isActive ? (
                  <span
                    key={`bar-${cycleKey}`}
                    className={`h-full bg-brand-purple rounded-full block ${
                      isReducedMotion || !isMounted
                        ? "w-full"
                        : "showcase-indicator-fill"
                    }`}
                    style={{
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                ) : (
                  <span
                    className={`h-full bg-stone-300 rounded-full block ${
                      isPast ? "w-full" : "w-0"
                    }`}
                  />
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
