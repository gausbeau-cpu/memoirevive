"use client";

import React, { useState, useEffect, useRef } from "react";
import { SITE_CONTENT } from "@/content/site";

interface HeroHeadlineProps {
  className?: string;
}

export default function HeroHeadline({ className = "" }: HeroHeadlineProps) {
  const content = SITE_CONTENT.hero;
  const start = content.start || "Transforme ta plus belle photo en";
  const endings = content.endings || ["cadeau d’anniversaire"];
  const defaultEnding = endings[0] || "cadeau d’anniversaire";

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [animState, setAnimState] = useState<{
    phase: "idle" | "animating";
    exitingIndex: number | null;
    enteringIndex: number | null;
  }>({
    phase: "idle",
    exitingIndex: null,
    enteringIndex: null,
  });

  const containerRef = useRef<HTMLHeadingElement>(null);
  const currentIndexRef = useRef<number>(0);
  const isDocumentVisibleRef = useRef<boolean>(true);
  const isIntersectingRef = useRef<boolean>(true);

  // 1. Détection du montage et de prefers-reduced-motion
  useEffect(() => {
    setIsMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // 2. Gestion des pauses : onglet masqué ou hero hors de l'écran
  useEffect(() => {
    const handleVisibility = () => {
      isDocumentVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  // 3. Boucle d'animation sobre
  useEffect(() => {
    if (!isMounted || isReducedMotion || endings.length <= 1) return;

    let isCancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      if (isCancelled) return;

      // Pause si l'onglet est caché ou si le hero est hors champ
      if (!isDocumentVisibleRef.current || !isIntersectingRef.current) {
        timerId = setTimeout(scheduleNext, 300);
        return;
      }

      const fromIdx = currentIndexRef.current;
      const toIdx = (fromIdx + 1) % endings.length;

      // Démarrage de la transition : sortie de fromIdx (350ms) et entrée de toIdx (500ms après 150ms)
      setAnimState({
        phase: "animating",
        exitingIndex: fromIdx,
        enteringIndex: toIdx,
      });

      // Fin de transition après 650ms (150ms délai + 500ms transition)
      timerId = setTimeout(() => {
        if (isCancelled) return;
        currentIndexRef.current = toIdx;
        setCurrentIndex(toIdx);
        setAnimState({
          phase: "idle",
          exitingIndex: null,
          enteringIndex: null,
        });

        // Chaque fin reste affichée 3,2s
        timerId = setTimeout(scheduleNext, 3200);
      }, 650);
    };

    const startLifecycle = async () => {
      // Attente de la résolution des polices si supportée
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          /* continuation */
        }
      }
      if (isCancelled) return;

      // Premier changement 3,5s après montage
      timerId = setTimeout(scheduleNext, 3500);
    };

    startLifecycle();

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [isMounted, isReducedMotion, endings]);

  return (
    <h1
      ref={containerRef}
      className={`font-heading font-bold text-brand-charcoal tracking-tight text-[clamp(1.55rem,6.4vw,3.5rem)] leading-[1.2] overflow-visible ${className}`}
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
            const isReducedStatic = isReducedMotion && idx === 0;
            const isCurrentActive =
              animState.phase === "idle" && idx === currentIndex;
            const isExiting =
              animState.phase === "animating" &&
              idx === animState.exitingIndex;
            const isEntering =
              animState.phase === "animating" &&
              idx === animState.enteringIndex;

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
                className="block font-heading text-brand-purple overflow-visible"
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
