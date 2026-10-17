"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Gift, Heart, Users, Type } from "lucide-react";
import { GALLERY_SLOTS, GallerySlot } from "@/content/gallery";

interface DemoVisual {
  id: string;
  name: string;
  icon: React.ElementType;
  message: string;
  beforeImg: string;
  afterImg: string;
}

const DEMO_VISUALS: DemoVisual[] = [
  {
    id: "slot-1",
    name: "Entre amis",
    icon: Users,
    message: "Joyeux anniversaire Awa, je t’aime fort !",
    beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    afterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "slot-2",
    name: "En couple",
    icon: Heart,
    message: "Bon anniversaire mon amour, pour toujours",
    beforeImg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    afterImg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "slot-3",
    name: "Portrait",
    icon: Gift,
    message: "Joyeux anniversaire mon champion ✨",
    beforeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    afterImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "slot-4",
    name: "Message personnalisé",
    icon: Type,
    message: "Joyeux anniversaire ma best, merci d’être là",
    beforeImg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80",
    afterImg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function BeforeAfterSlider() {
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(55);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlot = GALLERY_SLOTS[activeSlotIndex] || GALLERY_SLOTS[0];
  const currentDemo = DEMO_VISUALS[activeSlotIndex] || DEMO_VISUALS[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 4 Onglets de sélection des réalisations */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-stone-100 rounded-2xl mb-3 max-w-full overflow-x-auto no-scrollbar">
        {GALLERY_SLOTS.map((slot, idx) => {
          const demo = DEMO_VISUALS[idx];
          const Icon = demo?.icon || Gift;
          const isSelected = idx === activeSlotIndex;

          return (
            <button
              key={slot.id}
              onClick={() => {
                setActiveSlotIndex(idx);
                setSliderPosition(55);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isSelected
                  ? "bg-white text-brand-purple shadow-sm"
                  : "text-stone-600 hover:text-brand-charcoal"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{demo?.name || slot.name}</span>
            </button>
          );
        })}
      </div>

      {/* Conteneur du comparateur interactif Avant / Tableau fini */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative w-full aspect-[4/5] sm:aspect-[4/4] max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize select-none bg-stone-100"
      >
        {/* Couche APRÈS : Tableau fini avec retouche et texte élégant */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentDemo.afterImg}
            alt={`${currentSlot.name} — Tableau final`}
            className="w-full h-full object-cover"
          />

          {/* Incrustation du message personnalisé sur le tableau fini */}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white flex flex-col items-center text-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-gold bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm mb-1.5">
              Tirage sur panneau PVC
            </span>
            <p className="font-heading italic text-base sm:text-lg font-bold text-white drop-shadow-md max-w-xs">
              « {currentDemo.message} »
            </p>
          </div>

          <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-brand-purple text-white text-[11px] font-bold shadow-md">
            Tableau fini ✨
          </div>
        </div>

        {/* Couche AVANT : Photo originale simple (découpée par clip-path) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentDemo.beforeImg}
            alt={`${currentSlot.name} — Photo brute`}
            className="w-full h-full object-cover filter brightness-90 saturate-75"
          />

          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold">
            Photo brute
          </div>
        </div>

        {/* Ligne et poignée centrale du slider */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-brand-purple shadow-xl flex items-center justify-center border-2 border-brand-purple pointer-events-auto">
            <div className="flex items-center">
              <ChevronLeft className="w-3.5 h-3.5 -mr-1" />
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Légende sous le comparateur */}
      <p className="text-[11px] text-stone-500 font-medium text-center mt-2.5 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
        <span>Fais glisser le curseur pour voir la transformation</span>
      </p>
    </div>
  );
}
