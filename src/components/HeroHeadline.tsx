"use client";

import React, { useRef } from "react";
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

  const activeHeadlineIdx = currentIndex % endings.length;
  const previousHeadlineIdx =
    previousIndex !== null ? previousIndex % endings.length : null;

  return (
    <h1
      ref={containerRef}
      className={`font-heading font-bold text-brand-charcoal tracking-tight text-[clamp(1.35rem,6.2vw,3.5rem)] leading-[1.2] overflow-visible ${className}`}
    >
      {/* Texte complet pour les moteurs de recherche et les lecteurs d'écran */}
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

        {/* Fin de phrase dynamique en grille CSS sans décalage de mise en page */}
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
            let transform = "translateY(0.35em)";
            let transition = "none";
            let willChange = "auto";

            if (isDefaultFallback || isReducedStatic || isCurrentActive) {
              opacity = 1;
              transform = "translateY(0)";
            } else if (isExiting) {
              opacity = 0;
              transform = "translateY(-0.35em)";
              transition = "opacity 350ms ease-in, transform 350ms ease-in";
              willChange = "opacity, transform";
            } else if (isEntering) {
              opacity = 1;
              transform = "translateY(0)";
              transition =
                "opacity 500ms cubic-bezier(.22,1,.36,1) 150ms, transform 500ms cubic-bezier(.22,1,.36,1) 150ms";
              willChange = "opacity, transform";
            }

            return (
              <span
                key={idx}
                className="block font-heading text-brand-purple overflow-visible whitespace-nowrap"
                style={{
                  gridArea: "1 / 1",
                  opacity,
                  transform,
                  transition,
                  willChange,
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
