import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "on-dark";
  onDark?: boolean;
  href?: string | null;
  // Conservé pour compatibilité ascendante d'appels existants
  showTagline?: boolean;
  monogramOnly?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  variant = "default",
  onDark = false,
  href = "/",
}: LogoProps) {
  const isDark = variant === "on-dark" || onDark;

  // Tailles imposées par la spécification :
  // Desktop : hauteur 40 px, Mobile : hauteur 34 px
  // Ratio 808/197 conservé scrupuleusement, jamais étiré
  const imgSizes = {
    sm: "h-[28px] sm:h-[32px] w-auto",
    md: "h-[34px] sm:h-[40px] w-auto",
    lg: "h-[40px] sm:h-[48px] w-auto",
  };

  const logoImage = (
    <Image
      src="/brand/memoire-vive-logo.webp"
      alt="Mémoire Vive"
      width={808}
      height={197}
      priority
      className={`${imgSizes[size]} object-contain select-none`}
    />
  );

  // Marge de protection autour du logo égale à la moitié de sa hauteur
  // et zone cliquable minimale de 44 px de haut
  const content = isDark ? (
    <div
      className="inline-flex items-center justify-center p-2 rounded-[12px] bg-[#FFFBF7] shadow-sm select-none"
      style={{ borderRadius: "12px", backgroundColor: "#FFFBF7", padding: "8px" }}
    >
      {logoImage}
    </div>
  ) : (
    logoImage
  );

  const containerClasses = `min-h-[44px] py-1 px-4 sm:px-5 inline-flex items-center justify-center transition-opacity hover:opacity-95 ${className}`;

  if (!href) {
    return <div className={containerClasses}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={containerClasses}
      aria-label="Mémoire Vive — Retour à l’accueil"
    >
      {content}
    </Link>
  );
}
