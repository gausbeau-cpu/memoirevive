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
  monogramOnly = false,
}: LogoProps) {
  const isDark = variant === "on-dark" || onDark;

  // Tailles :
  // Desktop : hauteur 40 px, Mobile : hauteur 34 px
  // Ratio 1025/239 conservé scrupuleusement, jamais étiré
  const imgSizes = {
    sm: "h-[28px] sm:h-[32px] w-auto",
    md: "h-[34px] sm:h-[40px] w-auto",
    lg: "h-[40px] sm:h-[48px] w-auto",
  };

  const logoSrc = isDark
    ? "/brand/memoire-vive-logo-white.webp"
    : "/brand/memoire-vive-logo.webp";

  const content = monogramOnly ? (
    <Image
      src="/brand/memoire-vive-icon.webp"
      alt="Mémoire Vive"
      width={260}
      height={239}
      priority
      className="h-[34px] sm:h-[40px] w-auto object-contain select-none"
    />
  ) : (
    <Image
      src={logoSrc}
      alt="Mémoire Vive"
      width={1025}
      height={239}
      priority
      className={`${imgSizes[size]} object-contain select-none`}
    />
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
