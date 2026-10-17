// =========================================================================
// Mémoire Vive — Store de Données & Workflow des Commandes
// Tableaux Photo Personnalisés Cadeaux d'Anniversaire
// =========================================================================

import { OfferId, getOfferById } from "@/content/offers";

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
  forfaitId: OfferId;
  forfaitNom: string;
  forfaitPrix: number;
  forfaitFormat: string;
  texteAEcrire?: string;
  laisserProposerTexte?: boolean;
  echeance?: "cette_semaine" | "ce_mois" | "plus_tard" | null;
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

// Les anciennes données de démonstration ont été supprimées : la base démarre vide
const INITIAL_ORDERS: AdminOrder[] = [];

// Définition d'un conteneur global en mémoire pour les tests hors Supabase
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

  const PAID_STATUSES: OrderStatus[] = [
    "validee_payee",
    "en_impression",
    "livree",
  ];

  const totalRevenue = orders
    .filter((o) => PAID_STATUSES.includes(o.statut))
    .reduce((sum, o) => sum + o.forfaitPrix, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthRevenue = orders
    .filter((o) => {
      if (!PAID_STATUSES.includes(o.statut)) return false;
      const orderDate = new Date(o.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, o) => sum + o.forfaitPrix, 0);

  const statusCounts: Record<OrderStatus, number> = {
    nouvelle: 0,
    apercu_envoye: 0,
    refusee: 0,
    validee_payee: 0,
    en_impression: 0,
    livree: 0,
  };

  orders.forEach((o) => {
    statusCounts[o.statut]++;
  });

  const daysMap: Record<string, { count: number; revenue: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    daysMap[key] = { count: 0, revenue: 0 };
  }

  orders.forEach((o) => {
    const key = o.createdAt.split("T")[0];
    if (daysMap[key]) {
      daysMap[key].count++;
      if (PAID_STATUSES.includes(o.statut)) {
        daysMap[key].revenue += o.forfaitPrix;
      }
    }
  });

  const chartData = Object.entries(daysMap).map(([date, data]) => ({
    date,
    commandes: data.count,
    ca: data.revenue,
  }));

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

export function getAllClients(): ClientSummary[] {
  const orders = getAllOrders();
  const clientsMap = new Map<string, ClientSummary>();

  orders.forEach((order) => {
    const phone = order.clientTelephone;
    if (!clientsMap.has(phone)) {
      clientsMap.set(phone, {
        telephone: phone,
        nom: order.clientNom,
        quartierPrincipal: order.clientQuartier,
        totalCommandes: 0,
        totalDepense: 0,
        derniereCommandeDate: order.createdAt,
        commandes: [],
      });
    }

    const client = clientsMap.get(phone)!;
    client.totalCommandes++;
    if (["validee_payee", "en_impression", "livree"].includes(order.statut)) {
      client.totalDepense += order.forfaitPrix;
    }
    client.commandes.push(order);
    if (new Date(order.createdAt) > new Date(client.derniereCommandeDate)) {
      client.derniereCommandeDate = order.createdAt;
      client.nom = order.clientNom;
      client.quartierPrincipal = order.clientQuartier;
    }
  });

  return Array.from(clientsMap.values());
}
