"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export const LIQUID_ACTION_DELAY_MS = 2100;

export type LiquidButtonVariant = "primary" | "secondary" | "whatsapp";

export interface LiquidButtonProps {
  as?: "button" | "a";
  variant?: LiquidButtonVariant;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  // Mode jauge (pour bouton de soumission du formulaire)
  isGauge?: boolean;
  gaugeProgress?: number; // 0 à 100
  gaugeStatus?: "idle" | "uploading" | "submitting" | "success" | "error";
  gaugeLabel?: string;
}

interface LiquidDrop {
  id: number;
  x: number;
  y: number;
  diameter: number;
  fading: boolean;
}

export default function LiquidButton({
  as = "button",
  variant = "primary",
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  className = "",
  children,
  onClick,
  "aria-label": ariaLabel,
  isGauge = false,
  gaugeProgress = 0,
  gaugeStatus = "idle",
  gaugeLabel,
}: LiquidButtonProps) {
  const [drops, setDrops] = useState<LiquidDrop[]>([]);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isPendingAction, setIsPendingAction] = useState<boolean>(false);
  const [isTextWhiteSecondary, setIsTextWhiteSecondary] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const buttonRef = useRef<HTMLElement | null>(null);
  const dropIdRef = useRef<number>(0);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Détermination si c'est un lien externe ou WhatsApp
  const isExternalOrWhatsApp = Boolean(
    href &&
      (href.startsWith("http") ||
        href.startsWith("https://wa.me") ||
        href.startsWith("mailto:") ||
        target === "_blank")
  );

  // Couleurs de fond et de liquide selon la variante
  let baseColorClass = "";
  let liquidBgColor = "#DB2777"; // Rose profond pour variante principale
  let textColorClass = "text-white";

  if (variant === "primary") {
    baseColorClass = "bg-brand-purple hover:bg-brand-purple/95 text-white shadow-md shadow-brand-purple/20";
    liquidBgColor = "#DB2777";
    textColorClass = "text-white";
  } else if (variant === "secondary") {
    baseColorClass = "bg-transparent border-2 border-brand-purple hover:bg-brand-purple/5 shadow-xs";
    liquidBgColor = "#7C3AED";
    textColorClass = isTextWhiteSecondary ? "text-white" : "text-brand-purple";
  } else if (variant === "whatsapp") {
    baseColorClass = "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-emerald-600/20";
    liquidBgColor = "#1EBE5D";
    textColorClass = "text-white";
  }

  // Création d'une goutte liquide organique au point de contact
  const createLiquidDrop = useCallback(
    (clientX?: number, clientY?: number) => {
      if (!buttonRef.current || isReducedMotion || isGauge) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      let x = w / 2;
      let y = h; // Centre du bord inférieur au clavier

      if (clientX !== undefined && clientY !== undefined) {
        x = clientX - rect.left;
        y = clientY - rect.top;
      }

      // Distance aux 4 coins
      const d1 = Math.hypot(x, y);
      const d2 = Math.hypot(w - x, y);
      const d3 = Math.hypot(x, h - y);
      const d4 = Math.hypot(w - x, h - y);
      const maxDistance = Math.max(d1, d2, d3, d4);
      const diameter = maxDistance * 2 * 1.15;

      const id = ++dropIdRef.current;
      setDrops((prev) => [...prev, { id, x, y, diameter, fading: false }]);

      // Transition couleur texte variante secondaire à mi-remplissage (2x plus long : 1500 ms)
      if (variant === "secondary") {
        setTimeout(() => setIsTextWhiteSecondary(true), 1500);
      }

      // Reste plein 900 ms puis commence le fondu (3900ms + 900ms = 4800ms)
      setTimeout(() => {
        setDrops((prev) =>
          prev.map((d) => (d.id === id ? { ...d, fading: true } : d))
        );
      }, 4800);

      // Suppression de l'élément du DOM après le fondu (4800ms + 1800ms = 6600ms)
      setTimeout(() => {
        setDrops((prev) => prev.filter((d) => d.id !== id));
        if (variant === "secondary") {
          setIsTextWhiteSecondary(false);
        }
      }, 6600);
    },
    [isReducedMotion, isGauge, variant]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (disabled || isPendingAction) return;
    setIsPressed(true);
    createLiquidDrop(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    // Si clic clavier (sans pointerdown préalable), générer liquide au bord inférieur
    if (drops.length === 0 && !isReducedMotion && !isGauge) {
      createLiquidDrop();
    }

    // Gestion du déclenchement
    if (isExternalOrWhatsApp || type === "submit" || isGauge) {
      // Pas de délai pour liens externes, WhatsApp et soumission formulaire
      if (onClick) onClick(e);
      return;
    }

    // Action interne : délai de 350 ms pour voir le liquide avant l'action
    if (onClick) {
      e.preventDefault();
      if (isPendingAction) return; // Anti double-déclenchement

      setIsPendingAction(true);
      actionTimeoutRef.current = setTimeout(() => {
        setIsPendingAction(false);
        onClick(e);
      }, LIQUID_ACTION_DELAY_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    };
  }, []);

  // Définition de la jauge (Mode jauge d'envoi du formulaire)
  const isGaugeActive = isGauge && gaugeStatus !== "idle";
  const displayedProgress =
    gaugeStatus === "uploading"
      ? Math.max(8, Math.min(100, gaugeProgress))
      : gaugeStatus === "submitting" || gaugeStatus === "success"
      ? 100
      : 0;

  const contentMarkup = isGaugeActive ? (
    <div className="flex items-center justify-center gap-2 relative z-10 w-full">
      {gaugeStatus === "success" ? (
        <span className="flex items-center gap-2 font-bold animate-in zoom-in duration-300">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
          <span>Demande envoyée ✓</span>
        </span>
      ) : gaugeStatus === "error" ? (
        <span className="font-bold text-white">Réessayer</span>
      ) : (
        <span className="font-bold text-white animate-pulse">
          {gaugeLabel ||
            (gaugeStatus === "uploading"
              ? `Envoi de ta photo… ${displayedProgress} %`
              : "Envoi en cours…")}
        </span>
      )}
    </div>
  ) : (
    <span className="relative z-10 flex items-center justify-center gap-2 w-full">
      {children}
    </span>
  );

  const sharedClasses = `relative inline-flex items-center justify-center overflow-hidden transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 ${
    isPressed ? "scale-[0.98]" : "hover:-translate-y-[1px]"
  } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${baseColorClass} ${textColorClass} ${className}`;

  const liquidDropsMarkup = (
    <>
      {/* Gouttes liquides organiques créées au clic */}
      {!isReducedMotion &&
        drops.map((drop) => {
          const radius = drop.diameter / 2;
          return (
            <span
              key={drop.id}
              className={`absolute pointer-events-none transition-opacity duration-300 liquid-blob-expand ${
                drop.fading ? "opacity-0" : "opacity-100"
              }`}
              style={{
                left: drop.x - radius,
                top: drop.y - radius,
                width: drop.diameter,
                height: drop.diameter,
                backgroundColor: liquidBgColor,
                borderRadius: "42% 58% 55% 45% / 48% 40% 60% 52%",
                zIndex: 5,
              }}
            />
          );
        })}

      {/* Jauge liquide montante pour l'envoi du formulaire */}
      {isGauge && (
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none transition-[height] duration-[400ms] ease-out overflow-hidden"
          style={{
            height: `${displayedProgress}%`,
            backgroundColor: liquidBgColor,
            zIndex: 4,
          }}
        >
          {/* Vague ondulante en SVG */}
          {!isReducedMotion && displayedProgress > 0 && displayedProgress < 100 && (
            <div className="absolute top-0 left-0 w-[200%] h-3 -translate-y-full liquid-wave-anim opacity-80">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-full fill-current"
                style={{ color: liquidBgColor }}
              >
                <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" />
              </svg>
            </div>
          )}
        </div>
      )}
    </>
  );

  // Accessibilité aria-live pour annoncer la progression de la jauge
  const liveRegion = isGaugeActive ? (
    <span className="sr-only" aria-live="polite">
      {gaugeLabel ||
        (gaugeStatus === "uploading"
          ? `Progression de l'envoi : ${displayedProgress} pour cent`
          : gaugeStatus === "submitting"
          ? "Envoi en cours"
          : gaugeStatus === "success"
          ? "Demande envoyée avec succès"
          : "Erreur lors de l'envoi, veuillez réessayer")}
    </span>
  ) : null;

  if (as === "a" || href) {
    if (isExternalOrWhatsApp) {
      return (
        <a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className={sharedClasses}
          aria-label={ariaLabel}
          style={{ isolation: "isolate" }}
        >
          {liquidDropsMarkup}
          {contentMarkup}
        </a>
      );
    }

    return (
      <Link
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href || "#"}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={sharedClasses}
        aria-label={ariaLabel}
        style={{ isolation: "isolate" }}
      >
        {liquidDropsMarkup}
        {contentMarkup}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={sharedClasses}
      aria-label={ariaLabel}
      aria-busy={isGaugeActive ? "true" : undefined}
      style={{ isolation: "isolate" }}
    >
      {liquidDropsMarkup}
      {contentMarkup}
      {liveRegion}
    </button>
  );
}
