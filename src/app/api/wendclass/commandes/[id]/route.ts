// =========================================================================
// GET /api/wendclass/commandes/[id] — Détail d'une commande
// PATCH /api/wendclass/commandes/[id] — Mise à jour du statut
// =========================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrderByIdDB, updateOrderStatusDB } from "@/lib/supabase-db";
import type { OrderStatus } from "@/lib/admin-db";

const VALID_STATUSES: OrderStatus[] = [
  "nouvelle",
  "apercu_envoye",
  "refusee",
  "validee_payee",
  "en_impression",
  "livree",
];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderByIdDB(params.id);
    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée." },
        { status: 404 }
      );
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error(`GET /api/wendclass/commandes/${params.id} erreur:`, err);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la commande." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { statut, commentaire } = body;

    if (!statut || !VALID_STATUSES.includes(statut)) {
      return NextResponse.json(
        { error: "Statut de commande invalide." },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatusDB(
      params.id,
      statut as OrderStatus,
      commentaire
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Commande non trouvée ou erreur de mise à jour." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Statut mis à jour : ${statut}`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error(`PATCH /api/wendclass/commandes/${params.id} erreur:`, err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut." },
      { status: 500 }
    );
  }
}
