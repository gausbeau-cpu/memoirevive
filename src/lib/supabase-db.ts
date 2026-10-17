// =========================================================================
// Mémoire Vive — Couche de Données Supabase
// Toutes les fonctions DB/Storage pour l'admin et le formulaire public.
// SERVER-SIDE ONLY : ne jamais importer ce fichier côté client.
// =========================================================================

import { getSupabaseAdmin } from "./supabase";
import type { AdminOrder, OrderStatus, StatusHistoryItem } from "./admin-db";
import { getOfferById, OfferId } from "@/content/offers";

// -------------------------------------------------------------------------
// Conversion ligne DB → objet AdminOrder
// -------------------------------------------------------------------------
function dbRowToAdminOrder(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, any>,
  historique: StatusHistoryItem[] = []
): AdminOrder {
  return {
    id: (row.id ?? "") as string,
    lienPublic: (row.lien_public ?? "") as string,
    createdAt: (row.created_at ?? "") as string,
    updatedAt: (row.updated_at ?? "") as string,
    clientNom: (row.client_nom ?? "") as string,
    clientTelephone: (row.client_telephone ?? "") as string,
    clientQuartier: (row.client_quartier ?? "") as string,
    clientAdresseDetails: (row.client_adresse_details ?? undefined) as
      | string
      | undefined,
    forfaitId: (row.forfait_id ?? "format_40x60") as OfferId,
    forfaitNom: (row.forfait_nom ?? "") as string,
    forfaitPrix: (row.forfait_prix ?? 0) as number,
    forfaitFormat: (row.forfait_format ?? "") as string,
    texteAEcrire: (row.texte_a_ecrire ?? undefined) as string | undefined,
    laisserProposerTexte: Boolean(row.laisser_proposer_texte),
    echeance: (row.echeance ?? undefined) as
      | "cette_semaine"
      | "ce_mois"
      | "plus_tard"
      | null
      | undefined,
    occasionNote: (row.occasion_note ?? undefined) as string | undefined,
    photoOriginaleUrl: (row.photo_originale_url ?? "") as string,
    photoApercuUrl: (row.photo_apercu_url ?? undefined) as string | undefined,
    statut: (row.statut ?? "nouvelle") as OrderStatus,
    modePaiement: (row.mode_paiement ?? undefined) as
      | "orange_money"
      | "moov_money"
      | null
      | undefined,
    referencePaiement: (row.reference_paiement ?? undefined) as
      | string
      | undefined,
    historique,
  };
}

// -------------------------------------------------------------------------
// Génération d'URLs signées en lot pour les photos privées
// Les paths stockés en DB (non-http) sont convertis en URLs signées (1h).
// Les URLs externes (Unsplash, etc.) sont passées telles quelles.
// -------------------------------------------------------------------------
async function addSignedUrlsToOrders(
  orders: AdminOrder[]
): Promise<AdminOrder[]> {
  if (orders.length === 0) return orders;
  const admin = getSupabaseAdmin();

  const isStoragePath = (url: string | undefined): url is string =>
    Boolean(url && !url.startsWith("http"));

  const photoPaths = orders
    .map((o) => o.photoOriginaleUrl)
    .filter(isStoragePath);
  const apercuPaths = orders
    .map((o) => o.photoApercuUrl)
    .filter(isStoragePath);

  const [photoResult, apercuResult] = await Promise.all([
    photoPaths.length > 0
      ? admin.storage
          .from("photos-commandes")
          .createSignedUrls(photoPaths, 3600)
      : Promise.resolve({ data: [], error: null }),
    apercuPaths.length > 0
      ? admin.storage
          .from("apercus-commandes")
          .createSignedUrls(apercuPaths, 3600)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const photoMap = new Map(
    (photoResult.data || []).map((item) => [item.path, item.signedUrl])
  );
  const apercuMap = new Map(
    (apercuResult.data || []).map((item) => [item.path, item.signedUrl])
  );

  return orders.map((o) => ({
    ...o,
    photoOriginaleUrl:
      (isStoragePath(o.photoOriginaleUrl)
        ? photoMap.get(o.photoOriginaleUrl)
        : null) || o.photoOriginaleUrl,
    photoApercuUrl: o.photoApercuUrl
      ? (isStoragePath(o.photoApercuUrl)
          ? apercuMap.get(o.photoApercuUrl)
          : null) || o.photoApercuUrl
      : undefined,
  }));
}

// -------------------------------------------------------------------------
// Upload d'un fichier dans Supabase Storage
// Retourne le path relatif (stocké en DB).
// -------------------------------------------------------------------------
export async function uploadToStorage(
  file: File | Blob,
  bucket: "photos-commandes" | "apercus-commandes",
  filename: string
): Promise<string> {
  const admin = getSupabaseAdmin();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType =
    file instanceof File ? file.type : "application/octet-stream";

  const { data, error } = await admin.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error || !data) {
    console.error(`Erreur upload Storage (${bucket}/${filename}):`, error);
    throw new Error(
      `Impossible de sauvegarder le fichier dans le stockage (${error?.message || "erreur inconnue"}).`
    );
  }

  return data.path;
}

// =========================================================================
// Fonctions publiques (formulaire de commande)
// =========================================================================

export interface SubmitOrderParams {
  photoFile?: File | Blob | null;
  photoExternalUrl?: string;
  forfaitId: string;
  clientNom: string;
  clientTelephone: string;
  clientQuartier: string;
  clientAdresseDetails?: string;
  texteAEcrire?: string;
  laisserProposerTexte?: boolean;
  echeance?: "cette_semaine" | "ce_mois" | "plus_tard" | null;
  occasionNote?: string;
}

/**
 * Crée une nouvelle commande dans Supabase.
 * 1. Valide le format contre offers.ts et fixe le prix côté serveur
 * 2. Upload la photo originale dans le bucket privé photos-commandes
 * 3. Insère la ligne dans la table commandes
 * 4. Insère la première entrée dans statuts_historique
 */
export async function submitOrder(
  params: SubmitOrderParams
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const admin = getSupabaseAdmin();

    // 1. Validation stricte du forfait côté serveur
    const offer = getOfferById(params.forfaitId);
    if (!offer) {
      return {
        success: false,
        error: `Format invalide (${params.forfaitId}). Choisis parmi les formats proposés.`,
      };
    }

    // 2. Gérer la photo
    let photoUrl = "";
    if (params.photoFile) {
      const ext =
        params.photoFile instanceof File
          ? params.photoFile.name.split(".").pop() || "jpg"
          : "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      photoUrl = await uploadToStorage(
        params.photoFile,
        "photos-commandes",
        filename
      );
    } else if (params.photoExternalUrl) {
      photoUrl = params.photoExternalUrl;
    } else {
      return { success: false, error: "Aucune photo fournie." };
    }

    // Limiter le texte à 100 caractères maximum
    const cleanTexte = params.texteAEcrire
      ? params.texteAEcrire.trim().slice(0, 100)
      : null;

    // 3. Insérer la commande avec prix fixé côté serveur
    const { data: newOrder, error: insertError } = await admin
      .from("commandes")
      .insert({
        client_nom: params.clientNom.trim(),
        client_telephone: params.clientTelephone.trim(),
        client_quartier: params.clientQuartier.trim(),
        client_adresse_details: params.clientAdresseDetails?.trim() || null,
        forfait_id: offer.id,
        forfait_nom: offer.name,
        forfait_prix: offer.price,
        forfait_format: offer.format,
        texte_a_ecrire: cleanTexte,
        laisser_proposer_texte: Boolean(params.laisserProposerTexte),
        echeance: params.echeance || null,
        occasion_note: params.occasionNote?.trim() || null,
        photo_originale_url: photoUrl,
        statut: "nouvelle",
      })
      .select("id")
      .single();

    if (insertError || !newOrder) {
      console.error("Erreur INSERT commande:", insertError);
      return {
        success: false,
        error: "Erreur lors de l’enregistrement. Réessaie.",
      };
    }

    // 4. Insérer l'historique initial
    await admin.from("statuts_historique").insert({
      commande_id: newOrder.id,
      ancien_statut: null,
      nouveau_statut: "nouvelle",
      commentaire: "Commande reçue depuis le site web.",
    });

    return { success: true, orderId: newOrder.id };
  } catch (err) {
    console.error("Erreur submitOrder:", err);
    return {
      success: false,
      error: "Erreur réseau. Vérifie ta connexion et réessaie.",
    };
  }
}

// =========================================================================
// Fonctions admin (espace /wendclass)
// =========================================================================

/** Liste toutes les commandes avec filtres optionnels. */
export async function getAllOrdersDB(options?: {
  status?: OrderStatus | "all";
  search?: string;
}): Promise<AdminOrder[]> {
  const admin = getSupabaseAdmin();

  let query = admin
    .from("commandes")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("statut", options.status);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("getAllOrdersDB error:", error);
    return [];
  }

  let orders = data.map((row) => dbRowToAdminOrder(row));

  // Recherche textuelle côté JS
  if (options?.search) {
    const s = options.search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.clientNom.toLowerCase().includes(s) ||
        o.clientTelephone.toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.clientQuartier.toLowerCase().includes(s) ||
        (o.texteAEcrire && o.texteAEcrire.toLowerCase().includes(s))
    );
  }

  return addSignedUrlsToOrders(orders);
}

/** Récupère une commande par son ID avec historique complet et URLs signées. */
export async function getOrderByIdDB(id: string): Promise<AdminOrder | null> {
  const admin = getSupabaseAdmin();

  const [orderResult, historyResult] = await Promise.all([
    admin.from("commandes").select("*").eq("id", id).single(),
    admin
      .from("statuts_historique")
      .select("*")
      .eq("commande_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (orderResult.error || !orderResult.data) {
    console.error("getOrderByIdDB error:", orderResult.error);
    return null;
  }

  const historique: StatusHistoryItem[] = (historyResult.data || []).map(
    (h) => ({
      id: h.id,
      ancienStatut: (h.ancien_statut as OrderStatus) || null,
      nouveauStatut: h.nouveau_statut as OrderStatus,
      commentaire: h.commentaire || undefined,
      date: h.created_at,
    })
  );

  const [orderWithSignedUrls] = await addSignedUrlsToOrders([
    dbRowToAdminOrder(orderResult.data, historique),
  ]);

  return orderWithSignedUrls || null;
}

/** Met à jour le statut d'une commande et ajoute une ligne d'historique. */
export async function updateOrderStatusDB(
  id: string,
  newStatus: OrderStatus,
  comment?: string
): Promise<AdminOrder | null> {
  const admin = getSupabaseAdmin();

  // Lire le statut actuel
  const { data: current } = await admin
    .from("commandes")
    .select("statut")
    .eq("id", id)
    .single();

  if (!current) return null;
  const oldStatus = current.statut as OrderStatus;

  // Construire les champs de date optionnels selon le statut
  const dateFields: Record<string, string | null> = {};
  const now = new Date().toISOString();
  if (newStatus === "apercu_envoye") dateFields.date_apercu_envoye = now;
  if (newStatus === "validee_payee") dateFields.date_paiement = now;
  if (newStatus === "en_impression") dateFields.date_impression = now;
  if (newStatus === "livree") dateFields.date_livraison = now;
  if (newStatus === "refusee") dateFields.date_refus = now;

  // Mettre à jour la commande
  const { error: updateError } = await admin
    .from("commandes")
    .update({ statut: newStatus, ...dateFields })
    .eq("id", id);

  if (updateError) {
    console.error("updateOrderStatusDB error:", updateError);
    return null;
  }

  // Insérer l'historique
  await admin.from("statuts_historique").insert({
    commande_id: id,
    ancien_statut: oldStatus,
    nouveau_statut: newStatus,
    commentaire:
      comment || `Changement de statut : ${oldStatus} ➔ ${newStatus}`,
  });

  return getOrderByIdDB(id);
}

/** Upload un aperçu retouché et met à jour photo_apercu_url + statut. */
export async function updateOrderPreviewDB(
  id: string,
  previewFile: File | Blob | null,
  externalUrl?: string
): Promise<AdminOrder | null> {
  const admin = getSupabaseAdmin();

  let apercuUrl = "";

  if (previewFile) {
    const ext =
      previewFile instanceof File
        ? previewFile.name.split(".").pop() || "jpg"
        : "jpg";
    const filename = `${id}/${Date.now()}.${ext}`;
    const path = await uploadToStorage(
      previewFile,
      "apercus-commandes",
      filename
    );
    const { data: publicData } = admin.storage
      .from("apercus-commandes")
      .getPublicUrl(path);
    apercuUrl = publicData.publicUrl;
  } else if (externalUrl) {
    apercuUrl = externalUrl;
  } else {
    return null;
  }

  // Mettre à jour la commande
  const { error } = await admin
    .from("commandes")
    .update({ photo_apercu_url: apercuUrl, statut: "apercu_envoye" })
    .eq("id", id);

  if (error) {
    console.error("updateOrderPreviewDB error:", error);
    return null;
  }

  // Insérer l'historique
  const { data: current } = await admin
    .from("commandes")
    .select("statut")
    .eq("id", id)
    .single();

  await admin.from("statuts_historique").insert({
    commande_id: id,
    ancien_statut: (current?.statut as string) || null,
    nouveau_statut: "apercu_envoye",
    commentaire: "Aperçu retouché téléversé par l’administrateur.",
  });

  return getOrderByIdDB(id);
}

/** Statistiques du tableau de bord admin. */
export async function getAdminStatsDB() {
  const admin = getSupabaseAdmin();

  const { data: allOrders, error } = await admin
    .from("commandes")
    .select(
      "id, created_at, forfait_prix, statut, client_nom, client_telephone, client_quartier, forfait_nom, forfait_id, photo_originale_url, photo_apercu_url, texte_a_ecrire, echeance"
    )
    .order("created_at", { ascending: false });

  if (error || !allOrders) {
    console.error("getAdminStatsDB error:", error);
    return {
      totalRevenue: 0,
      currentMonthRevenue: 0,
      totalOrdersCount: 0,
      statusCounts: {
        nouvelle: 0,
        apercu_envoye: 0,
        refusee: 0,
        validee_payee: 0,
        en_impression: 0,
        livree: 0,
      },
      chartData: [],
      recentOrders: [],
    };
  }

  const PAID_STATUSES = ["validee_payee", "en_impression", "livree"];

  const totalRevenue = allOrders
    .filter((o) => PAID_STATUSES.includes(o.statut))
    .reduce((sum, o) => sum + (o.forfait_prix || 0), 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthRevenue = allOrders
    .filter((o) => {
      if (!PAID_STATUSES.includes(o.statut)) return false;
      const d = new Date(o.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, o) => sum + (o.forfait_prix || 0), 0);

  const statusCounts: Record<OrderStatus, number> = {
    nouvelle: 0,
    apercu_envoye: 0,
    refusee: 0,
    validee_payee: 0,
    en_impression: 0,
    livree: 0,
  };

  allOrders.forEach((o) => {
    if (o.statut in statusCounts) {
      statusCounts[o.statut as OrderStatus]++;
    }
  });

  // Données graphique — 30 derniers jours
  const daysMap: Record<string, { count: number; revenue: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    daysMap[key] = { count: 0, revenue: 0 };
  }
  allOrders.forEach((o) => {
    const key = o.created_at.split("T")[0];
    if (daysMap[key]) {
      daysMap[key].count++;
      if (PAID_STATUSES.includes(o.statut)) {
        daysMap[key].revenue += o.forfait_prix || 0;
      }
    }
  });
  const chartData = Object.entries(daysMap).map(([date, data]) => ({
    date,
    commandes: data.count,
    ca: data.revenue,
  }));

  const recentOrdersRaw = allOrders.slice(0, 5).map((row) =>
    dbRowToAdminOrder(row, [])
  );
  const recentOrders = await addSignedUrlsToOrders(recentOrdersRaw);

  return {
    totalRevenue,
    currentMonthRevenue,
    totalOrdersCount: allOrders.length,
    statusCounts,
    chartData,
    recentOrders,
  };
}

/** Nombre de clients distincts (basé sur le téléphone). */
export async function getClientsCountDB(): Promise<number> {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from("commandes").select("client_telephone");
  if (!data) return 0;
  const uniquePhones = new Set(data.map((r) => r.client_telephone));
  return uniquePhones.size;
}

// -------------------------------------------------------------------------
// Consultation publique de l'aperçu (Vue restreinte sécurisée)
// -------------------------------------------------------------------------

export interface PublicPreviewData {
  lienPublic: string;
  clientNom: string;
  forfaitNom: string;
  forfaitId: string;
  forfaitFormat?: string;
  photoApercuUrl?: string;
  texteAEcrire?: string;
  statut: string;
  createdAt: string;
}

/**
 * Récupère les données d'aperçu d'une commande via son token public unique.
 * Interroge UNIQUEMENT la vue sécurisée `apercu_public_view` (jamais la table `commandes`).
 * Ne divulgue ni téléphone, ni adresse, ni données privées.
 */
export async function getPublicPreviewByToken(
  token: string
): Promise<PublicPreviewData | null> {
  try {
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from("apercu_public_view")
      .select(
        "lien_public, client_nom, forfait_nom, forfait_id, forfait_format, photo_apercu_url, texte_a_ecrire, statut, created_at"
      )
      .eq("lien_public", token)
      .single();

    if (error || !data) {
      return null;
    }

    let photoUrl = (data.photo_apercu_url as string) || undefined;
    if (photoUrl && !photoUrl.startsWith("http")) {
      const { data: publicData } = admin.storage
        .from("apercus-commandes")
        .getPublicUrl(photoUrl);
      photoUrl = publicData.publicUrl;
    }

    return {
      lienPublic: data.lien_public as string,
      clientNom: data.client_nom as string,
      forfaitNom: data.forfait_nom as string,
      forfaitId: data.forfait_id as string,
      forfaitFormat: (data.forfait_format as string) || undefined,
      photoApercuUrl: photoUrl,
      texteAEcrire: (data.texte_a_ecrire as string) || undefined,
      statut: data.statut as string,
      createdAt: data.created_at as string,
    };
  } catch (err) {
    console.error("Erreur getPublicPreviewByToken:", err);
    return null;
  }
}
