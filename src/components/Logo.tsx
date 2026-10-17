import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  monogramOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  className = "",
  showTagline = true,
  monogramOnly = false,
  size = "md",
}: LogoProps) {
  const monogramSizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="Mémoire Vive — Retour à l’accueil"
    >
      {/* Monogram MV dans un disque violet vibrant */}
      <div
        className={`${monogramSizes[size]} rounded-full bg-brand-purple flex items-center justify-center text-white font-heading font-black tracking-tight shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0`}
      >
        <span className="translate-y-[-0.5px]">MV</span>
      </div>

      {!monogramOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-heading font-black text-brand-charcoal tracking-tight group-hover:text-brand-purple transition-colors ${titleSizes[size]}`}
          >
            Mémoire Vive
          </span>
          {showTagline && (
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 tracking-wide mt-0.5">
              Tableaux photo personnalisés
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
