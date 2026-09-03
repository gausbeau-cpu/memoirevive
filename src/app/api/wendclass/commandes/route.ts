// =========================================================================
// GET /api/wendclass/commandes — Liste des commandes (admin)
// =========================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllOrdersDB } from "@/lib/supabase-db";
import type { OrderStatus } from "@/lib/admin-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as OrderStatus | "all" | null;
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const orders = await getAllOrdersDB({
      status: status || "all",
      search: search || undefined,
    });

    return NextResponse.json({ orders, total: orders.length });
  } catch (err) {
    console.error("GET /api/wendclass/commandes erreur:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des commandes." },
      { status: 500 }
    );
  }
}
