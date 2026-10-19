"use client";

import React, { useRef, useEffect } from "react";
import { SITE_CONTENT } from "@/content/site";
import { useHeroCycle } from "@/hooks/useHeroCycle";

interface HeroHeadlineProps {
  className?: string;
}

export default function HeroHeadline({ className = "" }: HeroHeadlineProps) {
  const content = SITE_CONTENT.hero;
  const start = content.start || "Transforme ta plus belle photo en";
  const endings = content.endings || ["cadeau d’anniversaire"];
  const defaultEnding = endings[0] || "cadeau d’anniversaire";

  const {
    currentIndex,
    previousIndex,
    isTransitioning,
    isMounted,
    isReducedMotion,
  } = useHeroCycle();

  const containerRef = useRef<HTMLHeadingElement>(null);

  // Avertissement en mode développement si une fin dépasse 24 caractères (Section 5)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      endings.forEach((ending) => {
        if (ending.length > 24) {
          console.warn(
            `[HeroHeadline] Fin trop longue (${ending.length} car., max recommandé 24) : "${ending}". Elle s'affichera sur deux lignes.`
          );
        }
      });
    }
  }, [endings]);

  const activeHeadlineIdx = currentIndex % endings.length;
  const previousHeadlineIdx =
    previousIndex !== null ? previousIndex % endings.length : null;

  return (
    <h1
      ref={containerRef}
      className={`font-heading font-bold text-brand-charcoal tracking-tight text-[clamp(2.75rem,11.5vw,3.25rem)] md:text-[clamp(2.25rem,4.5vw,3rem)] lg:text-[3.5rem] leading-[1.1] lg:leading-[1.15] overflow-visible ${className}`}
    >
      {/* 4.1 Texte complet masqué visuellement pour SEO et lecteurs d'écran */}
      <span className="sr-only">
        {start} {defaultEnding}
      </span>

      {/* Couche visuelle animée */}
      <span aria-hidden="true" className="block select-none overflow-visible">
        {/* Début de phrase fixe */}
        <span
          className="block"
          style={{
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          {start}
        </span>

        {/* Fin de phrase dynamique en cellule unique de grille CSS sans décalage de mise en page */}
        <span
          className="block overflow-visible pt-1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            lineHeight: 1.25,
            paddingBottom: "0.14em",
          }}
        >
          {endings.map((ending, idx) => {
            const isDefaultFallback = !isMounted && idx === 0;
            const isReducedStatic = isReducedMotion && idx === activeHeadlineIdx;
            const isCurrentActive =
              !isTransitioning && idx === activeHeadlineIdx;
            const isExiting =
              isTransitioning && idx === previousHeadlineIdx;
            const isEntering =
              isTransitioning && idx === activeHeadlineIdx;

            let opacity = 0;
            let transform = "translateY(6px)";
            let transition = "none";
            let willChange = "auto";
            let backfaceVisibility: "visible" | "hidden" = "visible";

            if (isDefaultFallback || isReducedStatic || isCurrentActive) {
              // Netteté au repos : aucune transformation CSS au repos
              opacity = 1;
              transform = "none";
              willChange = "auto";
              backfaceVisibility = "visible";
            } else if (isExiting) {
              // Sortie : 1 -> 0 et 0 -> -6px en 350 ms, accélération ease-in
              opacity = 0;
              transform = "translateY(-6px)";
              transition = "opacity 350ms ease-in, transform 350ms ease-in";
              willChange = "opacity, transform";
              backfaceVisibility = "hidden";
            } else if (isEntering) {
              // Entrée : 0 -> 1 et +6px -> 0 en 500 ms, cubic-bezier(.22,1,.36,1) avec 150 ms de délai
              opacity = 1;
              transform = "translateY(0px)";
              transition =
                "opacity 500ms cubic-bezier(.22,1,.36,1) 150ms, transform 500ms cubic-bezier(.22,1,.36,1) 150ms";
              willChange = "opacity, transform";
              backfaceVisibility = "hidden";
            }

            return (
              <span
                key={idx}
                className="block font-heading text-brand-purple overflow-visible"
                style={{
                  gridArea: "1 / 1",
                  opacity,
                  transform,
                  transition,
                  willChange,
                  backfaceVisibility,
                  color: "#7C3AED",
                }}
              >
                {ending}
              </span>
            );
          })}
        </span>
      </span>
    </h1>
  );
}
