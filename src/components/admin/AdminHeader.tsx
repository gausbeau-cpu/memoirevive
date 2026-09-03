"use client";

import React from "react";
import { Menu, ShieldCheck, MapPin } from "lucide-react";
import { useAdmin } from "./AdminContext";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  actions,
}: AdminHeaderProps) {
  const { openMobileMenu } = useAdmin();

  return (
    <header className="bg-[#150F1B]/90 backdrop-blur-md border-b border-purple-500/15 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileMenu}
          className="md:hidden w-9 h-9 rounded-xl bg-[#241B2E] border border-white/10 text-stone-300 flex items-center justify-center hover:text-white"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-heading text-lg sm:text-xl font-bold text-[#F5F0FA] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Security Pill + Custom Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Ouagadougou timezone / security indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241B2E] border border-purple-500/20 text-xs text-purple-200">
          <MapPin className="w-3.5 h-3.5 text-brand-magenta shrink-0" />
          <span>Ouagadougou (GMT)</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Sécurisé</span>
        </div>

        {actions}
      </div>
    </header>
  );
}
