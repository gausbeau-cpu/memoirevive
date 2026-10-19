"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  newOrdersCount?: number;
}

export default function AdminSidebar({
  onCloseMobile,
  newOrdersCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/wendclass/auth/logout", { method: "POST" });
      router.push("/wendclass/login");
      router.refresh();
    } catch (err) {
      console.error("Erreur déconnexion:", err);
      router.push("/wendclass/login");
    }
  };

  const navItems = [
    {
      label: "Tableau de bord",
      href: "/wendclass",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Commandes",
      href: "/wendclass/commandes",
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
    },
    {
      label: "Clients",
      href: "/wendclass/clients",
      icon: Users,
    },
    {
      label: "Sécurité & Accès",
      href: "/wendclass/parametres",
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 bg-[#241B2E] border-r border-purple-500/15 flex flex-col h-full text-[#F5F0FA] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] bg-brand-purple">
            <Image
              src="/brand/memoire-vive-icon.webp"
              alt="Mémoire Vive"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-base text-[#F5F0FA] tracking-tight leading-tight">
              Mémoire <span className="text-brand-purple">Vive</span>
            </h1>
            <span className="text-xs text-purple-300/60 font-semibold tracking-wider uppercase">
              Espace Studio Admin
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
          Gestion Principale
        </p>

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-brand-purple text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-stone-400"
                  }`}
                  strokeWidth={2}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="bg-brand-magenta text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-3 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Raccourcis
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 min-h-[44px] rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
          >
            <span>Voir le site public</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </a>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-[#150F1B] border border-white/5 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-stone-300 truncate">
              Fondateur Admin
            </p>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Session sécurisée
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 min-h-[44px] rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
