// =========================================================================
// Configuration de la galerie « Nos réalisations »
// =========================================================================

export const GALLERY_ENABLED = true;

export interface GallerySlot {
  id: string;
  name: string;
  beforePath: string;
  afterPath: string;
}

export const GALLERY_HEADER = {
  badge: "Nos réalisations",
  title: "Des cadeaux qui font de l’effet",
  subtitle: "Portrait retouché, message écrit dessus, tableau prêt à offrir.",
  placeholderLabel: "Réalisation à venir",
} as const;

export const GALLERY_SLOTS: readonly GallerySlot[] = [
  {
    id: "slot-1",
    name: "Anniversaire entre amis",
    beforePath: "/realisations/slot-1-avant.jpg",
    afterPath: "/realisations/slot-1-apres.jpg",
  },
  {
    id: "slot-2",
    name: "Anniversaire en couple",
    beforePath: "/realisations/slot-2-avant.jpg",
    afterPath: "/realisations/slot-2-apres.jpg",
  },
  {
    id: "slot-3",
    name: "Portrait retouché",
    beforePath: "/realisations/slot-3-avant.jpg",
    afterPath: "/realisations/slot-3-apres.jpg",
  },
  {
    id: "slot-4",
    name: "Message personnalisé",
    beforePath: "/realisations/slot-4-avant.jpg",
    afterPath: "/realisations/slot-4-apres.jpg",
  },
] as const;
