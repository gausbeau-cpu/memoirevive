// =========================================================================
// Source unique de vérité pour les offres Mémoire Vive
// Tableaux photo personnalisés pour cadeaux d’anniversaire
// =========================================================================

export type OfferId = "format_30x40" | "format_40x60" | "format_50x70";

export interface Offer {
  id: OfferId;
  name: string;
  format: string;
  price: number;
  badge?: string;
  slogan: string;
}

export const COMMON_INCLUSIONS: readonly string[] = [
  "Retouche de ton portrait (peau, lumière, fond)",
  "Ton message écrit sur la photo",
  "Tirage monté sur panneau PVC, prêt à offrir",
  "Aperçu gratuit avant tout paiement",
  "Livraison gratuite à Ouagadougou",
] as const;

export const OFFERS: readonly Offer[] = [
  {
    id: "format_30x40",
    name: "Petit",
    format: "30 x 40 cm",
    price: 12000,
    slogan: "Le petit cadeau qui touche droit au cœur",
  },
  {
    id: "format_40x60",
    name: "Coup de cœur",
    format: "40 x 60 cm",
    price: 20000,
    badge: "Notre coup de cœur",
    slogan: "Le format qui fait son effet",
  },
  {
    id: "format_50x70",
    name: "Grand",
    format: "50 x 70 cm",
    price: 30000,
    badge: "Grand format",
    slogan: "Pour une déclaration qui se voit de loin",
  },
] as const;

export const OFFERS_BY_ID: Record<OfferId, Offer> = {
  format_30x40: OFFERS[0],
  format_40x60: OFFERS[1],
  format_50x70: OFFERS[2],
};

export function isValidOfferId(id: string): id is OfferId {
  return id === "format_30x40" || id === "format_40x60" || id === "format_50x70";
}

export function getOfferById(id: string): Offer | undefined {
  if (isValidOfferId(id)) {
    return OFFERS_BY_ID[id];
  }
  return undefined;
}

/**
 * Formatage strict du prix selon les critères d'acceptation :
 * Espace insécable comme séparateur de milliers (ex: 12\u00A0000 FCFA).
 */
export function formatOfferPrice(amount: number): string {
  const formatted = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${formatted}\u00A0FCFA`;
}
