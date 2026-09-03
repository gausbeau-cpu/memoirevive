"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Gift, Award, Crown, Heart, PartyPopper, Camera } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  caption: string;
  beforeImage: string;
  afterImage: string;
  resultLabel: string;
  isBirthday?: boolean;
}

export const HERO_CATEGORIES: CategoryItem[] = [
  {
    id: "memoire-familiale",
    name: "Restauration & mémoire familiale",
    shortName: "Restauration",
    icon: Heart,
    caption: "Exemple : Photo familiale ancienne restaurée & colorisée en cadre bois noble",
    beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Résultat",
  },
  {
    id: "reussite",
    name: "Portraits de réussite",
    shortName: "Réussite",
    icon: Award,
    caption: "Exemple : Diplôme & soutenance sublimés pour honorer vos accomplissements",
    beforeImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Studio",
  },
  {
    id: "traditionnelle",
    name: "Portraits en tenue traditionnelle",
    shortName: "Traditionnelle",
    icon: Crown,
    caption: "Exemple : Faso Dan Fani et parures d'apparat aux couleurs chatoyantes ravivées",
    beforeImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Colorisé",
  },
  {
    id: "celebrations",
    name: "Célébrations & cérémonies",
    shortName: "Célébrations",
    icon: Gift,
    caption: "Exemple : Cérémonie de mariage préservée et immortalisée avec émotion",
    beforeImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Édition",
  },
  {
    id: "anniversaires",
    name: "Anniversaires",
    shortName: "Anniversaires",
    icon: PartyPopper,
    caption: "Exemple : Cadre personnalisé avec message d'anniversaire festif aux accents violet, rose et or",
    beforeImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Cadeau",
    isBirthday: true,
  },
  {
    id: "modernes",
    name: "Portraits modernes",
    shortName: "Modernes",
    icon: Camera,
    caption: "Exemple : Portrait contemporain haute définition au grain cinéma raffiné",
    beforeImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    afterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85",
    resultLabel: "Galerie",
  },
];

interface BeforeAfterSliderProps {
  className?: string;
}

export default function BeforeAfterSlider({ className = "" }: BeforeAfterSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCategory = HERO_CATEGORIES[currentIndex];

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_CATEGORIES.length);
      setAnimKey((k) => k + 1);
    }, 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex]);

  const goTo = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(idx);
    setAnimKey((k) => k + 1);
  };

  const handlePrev = () => goTo((currentIndex - 1 + HERO_CATEGORIES.length) % HERO_CATEGORIES.length);
  const handleNext = () => goTo((currentIndex + 1) % HERO_CATEGORIES.length);

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Category Tabs */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 pb-3 px-1">
        {HERO_CATEGORIES.map((cat, idx) => {
          const isActive = idx === currentIndex;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => goTo(idx)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-purple text-white shadow-glow-purple scale-[1.02]"
                  : "bg-white/85 text-brand-charcoal hover:bg-brand-purple-light hover:text-brand-purple border border-brand-border/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-gold" : "text-brand-purple"}`} />
              <span className="whitespace-nowrap">{cat.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Image Frame with Automatic Curtain Reveal + Ken Burns */}
      <div className="relative w-full">
        <div
          className="relative overflow-hidden rounded-[2rem] border-4 border-white/95 shadow-warm-card bg-stone-900 aspect-[4/3] sm:aspect-[4/3.5] w-full mx-auto select-none"
          style={{ isolation: "isolate" }}
        >
          {/* Layer 1: Before (Original) Photo with Ken Burns Zoom */}
          <div
            key={`before-${animKey}`}
            className="absolute inset-0 w-full h-full hero-ken-burns"
          >
            <img
              src={currentCategory.beforeImage}
              alt={currentCategory.name}
              className="w-full h-full object-cover object-center grayscale contrast-125 brightness-[0.85] sepia-[0.4] blur-[0.3px]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.55)_100%)] opacity-70 pointer-events-none" />
            <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(0deg,#000,#000_1px,transparent_1px,transparent_4px)] pointer-events-none" />
          </div>

          {/* Layer 2: After (Restored / Fine Art) Photo revealed by Automatic Curtain Swipe */}
          <div
            key={`after-${animKey}`}
            className="absolute inset-0 w-full h-full hero-curtain-reveal"
          >
            <div className="absolute inset-0 w-full h-full hero-ken-burns">
              <img
                src={currentCategory.afterImage}
                alt={currentCategory.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

              {/* Special Birthday Dedication Overlay */}
              {currentCategory.isBirthday && (
                <div className="absolute bottom-12 inset-x-4 flex justify-center pointer-events-none">
                  <div className="bg-gradient-to-r from-brand-purple/95 via-[#7C3AED]/90 to-brand-magenta/95 backdrop-blur-md border border-brand-gold/60 text-white rounded-2xl px-4 py-2.5 shadow-glow-magenta max-w-sm text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-brand-gold uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Message personnalisé inclus</span>
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    </div>
                    <p className="font-heading text-sm font-bold text-white leading-tight">
                      « Joyeux Anniversaire Maman · Avec tout notre amour »
                    </p>
                  </div>
                </div>
              )}

              {/* Single discrete result tag (no clashing/superimposed tags) */}
              <div className="absolute bottom-4 right-4 z-20 bg-brand-purple/95 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1 rounded-full border border-brand-magenta/40 shadow-glow-purple flex items-center gap-1.5 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />
                <span>{currentCategory.resultLabel}</span>
              </div>
            </div>
          </div>

          {/* Curtain Edge Line Sweeping Across */}
          <div
            key={`edge-${animKey}`}
            className="absolute top-0 bottom-0 w-[3px] bg-white/90 z-30 pointer-events-none hero-curtain-edge"
            style={{ boxShadow: "0 0 16px 4px rgba(255,255,255,0.75)" }}
          />

          {/* Top Category Header Badge */}
          <div className="absolute top-3.5 inset-x-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3.5 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow">
              {(() => {
                const IconComponent = currentCategory.icon;
                return <IconComponent className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2} />;
              })()}
              <span>{currentCategory.name}</span>
            </div>
          </div>


          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 overflow-hidden rounded-b-[calc(2rem-4px)]">
            <div
              key={`bar-${animKey}`}
              className="h-full bg-brand-purple hero-progress-bar"
            />
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-charcoal shadow-lg border border-brand-border flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Catégorie précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-charcoal shadow-lg border border-brand-border flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Catégorie suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4" role="tablist">
        {HERO_CATEGORIES.map((cat, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={cat.id}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? "w-8 h-2.5 bg-brand-purple shadow-glow-purple"
                  : "w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`Catégorie ${cat.name} (${idx + 1} sur 6)`}
              aria-selected={isActive}
              role="tab"
            />
          );
        })}
      </div>

      {/* Bottom Descriptive Caption */}
      <p className="text-center text-xs text-brand-muted mt-2 font-medium max-w-md px-2 min-h-[32px] flex items-center justify-center">
        {currentCategory.caption}
      </p>
    </div>
  );
}

