// =========================================================================
// Mémoire Vive — Store de Données & Workflow des Commandes
// =========================================================================

export type OrderStatus =
  | "nouvelle"
  | "apercu_envoye"
  | "refusee"
  | "validee_payee"
  | "en_impression"
  | "livree";

export interface StatusHistoryItem {
  id: string;
  ancienStatut?: OrderStatus | null;
  nouveauStatut: OrderStatus;
  commentaire?: string;
  date: string;
}

export interface AdminOrder {
  id: string;
  lienPublic?: string;
  createdAt: string;
  updatedAt: string;
  clientNom: string;
  clientTelephone: string;
  clientQuartier: string;
  clientAdresseDetails?: string;
  forfaitId: "souvenir" | "memoire" | "heritage";
  forfaitNom: string;
  forfaitPrix: number;
  forfaitFormat: string;
  occasionNote?: string;
  photoOriginaleUrl: string;
  photoApercuUrl?: string;
  statut: OrderStatus;
  modePaiement?: "orange_money" | "moov_money" | null;
  referencePaiement?: string;
  historique: StatusHistoryItem[];
}

export interface ClientSummary {
  telephone: string;
  nom: string;
  quartierPrincipal: string;
  totalCommandes: number;
  totalDepense: number;
  derniereCommandeDate: string;
  commandes: AdminOrder[];
}

// Jeu initial de démonstration représentatif pour Ouagadougou
const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "CMD-2026-001",
    lienPublic: "e8295ba1-f8a4-4a57-897b-83ffb2b2a601",
    createdAt: "2026-03-02T14:30:00Z",
    updatedAt: "2026-03-02T14:30:00Z",
    clientNom: "Aminata Ouedraogo",
    clientTelephone: "+226 70 12 34 56",
    clientQuartier: "Ouaga 2000",
    clientAdresseDetails: "Face à l'Hôtel Palace, Rue 15.42",
    forfaitId: "memoire",
    forfaitNom: "Mémoire",
    forfaitPrix: 20000,
    forfaitFormat: "Cadre Bois Noble · 20 x 30 cm",
    occasionNote: "Mariage de mes parents en 1982. Merci de raviver les visages et coloriser le costume et la robe.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    photoApercuUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
    statut: "apercu_envoye",
    historique: [
      {
        id: "h-1",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        commentaire: "Commande reçue depuis le site web.",
        date: "2026-03-02T14:30:00Z",
      },
      {
        id: "h-2",
        ancienStatut: "nouvelle",
        nouveauStatut: "apercu_envoye",
        commentaire: "Restauration IA & colorisation complétée. Lien d'aperçu envoyé par WhatsApp.",
        date: "2026-03-02T18:15:00Z",
      },
    ],
  },
  {
    id: "CMD-2026-002",
    createdAt: "2026-03-02T09:15:00Z",
    updatedAt: "2026-03-02T16:45:00Z",
    clientNom: "Ibrahim Sawadogo",
    clientTelephone: "+226 76 98 76 54",
    clientQuartier: "Dassasgho",
    clientAdresseDetails: "Non loin de l'échangeur de l'Est",
    forfaitId: "heritage",
    forfaitNom: "Héritage",
    forfaitPrix: 35000,
    forfaitFormat: "Grand Cadre Galerie · 30 x 40 cm",
    occasionNote: "Portrait de mon grand-père en tenue traditionnelle des années 1970.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    photoApercuUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90",
    statut: "en_impression",
    modePaiement: "orange_money",
    referencePaiement: "OM-88392147",
    historique: [
      {
        id: "h-3",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        commentaire: "Commande reçue.",
        date: "2026-03-02T09:15:00Z",
      },
      {
        id: "h-4",
        ancienStatut: "nouvelle",
        nouveauStatut: "apercu_envoye",
        commentaire: "Aperçu envoyé au client.",
        date: "2026-03-02T11:30:00Z",
      },
      {
        id: "h-5",
        ancienStatut: "apercu_envoye",
        nouveauStatut: "validee_payee",
        commentaire: "Paiement Orange Money validé (35 000 FCFA).",
        date: "2026-03-02T15:00:00Z",
      },
      {
        id: "h-6",
        ancienStatut: "validee_payee",
        nouveauStatut: "en_impression",
        commentaire: "Fichier HD envoyé à l'atelier d'encadrement.",
        date: "2026-03-02T16:45:00Z",
      },
    ],
  },
  {
    id: "CMD-2026-003",
    createdAt: "2026-03-01T16:20:00Z",
    updatedAt: "2026-03-02T11:00:00Z",
    clientNom: "Fatoumata Kaboré",
    clientTelephone: "+226 78 45 12 89",
    clientQuartier: "Karpala",
    clientAdresseDetails: "À 200m du goudron, vers l'école",
    forfaitId: "memoire",
    forfaitNom: "Mémoire",
    forfaitPrix: 20000,
    forfaitFormat: "Cadre Bois Noble · 20 x 30 cm",
    occasionNote: "Cadeau pour les 60 ans de maman.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    photoApercuUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=90",
    statut: "livree",
    modePaiement: "moov_money",
    referencePaiement: "MM-44910283",
    historique: [
      {
        id: "h-7",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        date: "2026-03-01T16:20:00Z",
      },
      {
        id: "h-8",
        ancienStatut: "nouvelle",
        nouveauStatut: "apercu_envoye",
        date: "2026-03-01T19:00:00Z",
      },
      {
        id: "h-9",
        ancienStatut: "apercu_envoye",
        nouveauStatut: "validee_payee",
        date: "2026-03-01T20:10:00Z",
      },
      {
        id: "h-10",
        ancienStatut: "validee_payee",
        nouveauStatut: "en_impression",
        date: "2026-03-02T08:30:00Z",
      },
      {
        id: "h-11",
        ancienStatut: "en_impression",
        nouveauStatut: "livree",
        commentaire: "Livraison effectuée avec succès par coursier.",
        date: "2026-03-02T11:00:00Z",
      },
    ],
  },
  {
    id: "CMD-2026-004",
    createdAt: "2026-03-03T01:10:00Z",
    updatedAt: "2026-03-03T01:10:00Z",
    clientNom: "Seydou Traoré",
    clientTelephone: "+226 71 23 45 67",
    clientQuartier: "Pissy",
    clientAdresseDetails: "Derrière le CMA de Pissy",
    forfaitId: "souvenir",
    forfaitNom: "Souvenir",
    forfaitPrix: 10000,
    forfaitFormat: "Cadre simple · 13 x 18 cm",
    occasionNote: "Photo de promo université.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    statut: "nouvelle",
    historique: [
      {
        id: "h-12",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        commentaire: "Nouvelle commande en attente de retouche.",
        date: "2026-03-03T01:10:00Z",
      },
    ],
  },
  {
    id: "CMD-2026-005",
    createdAt: "2026-02-28T10:00:00Z",
    updatedAt: "2026-03-01T12:00:00Z",
    clientNom: "Aminata Ouedraogo",
    clientTelephone: "+226 70 12 34 56",
    clientQuartier: "Ouaga 2000",
    forfaitId: "souvenir",
    forfaitNom: "Souvenir",
    forfaitPrix: 10000,
    forfaitFormat: "Cadre simple · 13 x 18 cm",
    occasionNote: "Photo d'enfance avec mes sœurs.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    photoApercuUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=90",
    statut: "livree",
    modePaiement: "orange_money",
    referencePaiement: "OM-77192834",
    historique: [
      {
        id: "h-13",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        date: "2026-02-28T10:00:00Z",
      },
      {
        id: "h-14",
        ancienStatut: "nouvelle",
        nouveauStatut: "apercu_envoye",
        date: "2026-02-28T15:00:00Z",
      },
      {
        id: "h-15",
        ancienStatut: "apercu_envoye",
        nouveauStatut: "validee_payee",
        date: "2026-02-28T17:30:00Z",
      },
      {
        id: "h-16",
        ancienStatut: "validee_payee",
        nouveauStatut: "livree",
        date: "2026-03-01T12:00:00Z",
      },
    ],
  },
  {
    id: "CMD-2026-006",
    createdAt: "2026-02-26T08:30:00Z",
    updatedAt: "2026-02-26T18:00:00Z",
    clientNom: "Moussa Compaoré",
    clientTelephone: "+226 75 11 22 33",
    clientQuartier: "Tampouy",
    forfaitId: "memoire",
    forfaitNom: "Mémoire",
    forfaitPrix: 20000,
    forfaitFormat: "Cadre Bois Noble · 20 x 30 cm",
    occasionNote: "Photo très abîmée.",
    photoOriginaleUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    statut: "refusee",
    historique: [
      {
        id: "h-17",
        ancienStatut: null,
        nouveauStatut: "nouvelle",
        date: "2026-02-26T08:30:00Z",
      },
      {
        id: "h-18",
        ancienStatut: "nouvelle",
        nouveauStatut: "apercu_envoye",
        date: "2026-02-26T14:00:00Z",
      },
      {
        id: "h-19",
        ancienStatut: "apercu_envoye",
        nouveauStatut: "refusee",
        commentaire: "Le client a préféré reporter son projet. Zéro franc facturé.",
        date: "2026-02-26T18:00:00Z",
      },
    ],
  },
];

// Gestionnaire global pour maintenir l'état en mémoire
const globalStore = global as unknown as {
  __mv_orders_store?: AdminOrder[];
};

if (!globalStore.__mv_orders_store) {
  globalStore.__mv_orders_store = [...INITIAL_ORDERS];
}

export function getAllOrders(): AdminOrder[] {
  return globalStore.__mv_orders_store || [];
}

export function getOrderById(id: string): AdminOrder | undefined {
  return (globalStore.__mv_orders_store || []).find((o) => o.id === id);
}

export function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  comment?: string
): AdminOrder | null {
  const orders = globalStore.__mv_orders_store || [];
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  const oldStatus = order.statut;
  const now = new Date().toISOString();

  const newHistoryItem: StatusHistoryItem = {
    id: `h-${Date.now()}`,
    ancienStatut: oldStatus,
    nouveauStatut: newStatus,
    commentaire: comment || `Changement de statut : ${oldStatus} ➔ ${newStatus}`,
    date: now,
  };

  const updatedOrder: AdminOrder = {
    ...order,
    statut: newStatus,
    updatedAt: now,
    historique: [newHistoryItem, ...order.historique],
  };

  orders[orderIndex] = updatedOrder;
  return updatedOrder;
}

export function updateOrderPreview(
  id: string,
  previewUrl: string
): AdminOrder | null {
  const orders = globalStore.__mv_orders_store || [];
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  const now = new Date().toISOString();

  const newHistoryItem: StatusHistoryItem = {
    id: `h-${Date.now()}`,
    ancienStatut: order.statut,
    nouveauStatut: "apercu_envoye",
    commentaire: "Nouvel aperçu retouché téléversé par l'administrateur.",
    date: now,
  };

  const updatedOrder: AdminOrder = {
    ...order,
    photoApercuUrl: previewUrl,
    statut: "apercu_envoye",
    updatedAt: now,
    historique: [newHistoryItem, ...order.historique],
  };

  orders[orderIndex] = updatedOrder;
  return updatedOrder;
}

export function getAdminStats() {
  const orders = getAllOrders();

  // Chiffre d'affaires total (uniquement commandes payées, en impression ou livrées)
  const paidOrders = orders.filter((o) =>
    ["validee_payee", "en_impression", "livree"].includes(o.statut)
  );
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.forfaitPrix, 0);

  // CA du mois en cours
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthPaidOrders = paidOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const currentMonthRevenue = monthPaidOrders.reduce(
    (sum, o) => sum + o.forfaitPrix,
    0
  );

  // Décompte par statut
  const statusCounts: Record<OrderStatus, number> = {
    nouvelle: 0,
    apercu_envoye: 0,
    refusee: 0,
    validee_payee: 0,
    en_impression: 0,
    livree: 0,
  };

  orders.forEach((o) => {
    if (statusCounts[o.statut] !== undefined) {
      statusCounts[o.statut]++;
    }
  });

  // Activité des 30 derniers jours pour le graphique
  const daysMap: Record<string, { count: number; revenue: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    daysMap[key] = { count: 0, revenue: 0 };
  }

  orders.forEach((o) => {
    const dayKey = o.createdAt.split("T")[0];
    if (daysMap[dayKey]) {
      daysMap[dayKey].count += 1;
      if (["validee_payee", "en_impression", "livree"].includes(o.statut)) {
        daysMap[dayKey].revenue += o.forfaitPrix;
      }
    }
  });

  const chartData = Object.entries(daysMap).map(([date, data]) => ({
    date,
    commandes: data.count,
    ca: data.revenue,
  }));

  // 5 commandes les plus récentes
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalRevenue,
    currentMonthRevenue,
    totalOrdersCount: orders.length,
    statusCounts,
    chartData,
    recentOrders,
  };
}

export function getClientsSummary(): ClientSummary[] {
  const orders = getAllOrders();
  const map = new Map<string, ClientSummary>();

  orders.forEach((order) => {
    const phone = order.clientTelephone.trim();
    if (!map.has(phone)) {
      map.set(phone, {
        telephone: phone,
        nom: order.clientNom,
        quartierPrincipal: order.clientQuartier,
        totalCommandes: 0,
        totalDepense: 0,
        derniereCommandeDate: order.createdAt,
        commandes: [],
      });
    }

    const client = map.get(phone)!;
    client.totalCommandes += 1;
    if (["validee_payee", "en_impression", "livree"].includes(order.statut)) {
      client.totalDepense += order.forfaitPrix;
    }
    if (new Date(order.createdAt) > new Date(client.derniereCommandeDate)) {
      client.derniereCommandeDate = order.createdAt;
      client.nom = order.clientNom; // nom le plus récent
      client.quartierPrincipal = order.clientQuartier;
    }
    client.commandes.push(order);
  });

  return Array.from(map.values()).sort(
    (a, b) => b.totalDepense - a.totalDepense
  );
}
