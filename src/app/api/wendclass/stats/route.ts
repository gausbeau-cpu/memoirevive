// =========================================================================
// GET /api/wendclass/stats — Statistiques du tableau de bord admin
// =========================================================================

// Forcer le rendu serveur à la demande (jamais de cache statique build-time)
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminStatsDB, getClientsCountDB } from "@/lib/supabase-db";

export async function GET() {
  try {
    const [stats, clientsCount] = await Promise.all([
      getAdminStatsDB(),
      getClientsCountDB(),
    ]);

    return NextResponse.json({ stats, clientsCount });
  } catch (err) {
    console.error("GET /api/wendclass/stats erreur:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques." },
      { status: 500 }
    );
  }
}
