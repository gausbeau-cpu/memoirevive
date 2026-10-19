import React from "react";
import {
  Clock,
  Send,
  XCircle,
  CheckCircle2,
  Layers,
  Truck,
} from "lucide-react";
import { OrderStatus } from "@/lib/admin-db";

interface StatusBadgeProps {
  statut: OrderStatus;
  size?: "sm" | "md" | "lg";
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
    description: string;
  }
> = {
  nouvelle: {
    label: "Nouvelle",
    bg: "bg-amber-950/60",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: Clock,
    description: "Commande reçue, en attente de retouche",
  },
  apercu_envoye: {
    label: "Aperçu envoyé",
    bg: "bg-sky-950/60",
    text: "text-sky-400",
    border: "border-sky-500/30",
    icon: Send,
    description: "Aperçu retouché transmis au client",
  },
  refusee: {
    label: "Refusée",
    bg: "bg-rose-950/50",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: XCircle,
    description: "Client non satisfait, 0 FCFA facturé",
  },
  validee_payee: {
    label: "Validée & Payée",
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    description: "Aperçu validé et paiement Mobile Money reçu",
  },
  en_impression: {
    label: "En fabrication",
    bg: "bg-purple-950/60",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: Layers,
    description: "Impression et montage sur panneau PVC à l'atelier",
  },
  livree: {
    label: "Livrée",
    bg: "bg-pink-950/60",
    text: "text-pink-400",
    border: "border-pink-500/30",
    icon: Truck,
    description: "Tableau photo livré avec succès au client",
  },
};

export default function StatusBadge({
  statut,
  size = "md",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[statut] || STATUS_CONFIG.nouvelle;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1 font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 font-medium",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} strokeWidth={2} />
      <span>{config.label}</span>
    </span>
  );
}
