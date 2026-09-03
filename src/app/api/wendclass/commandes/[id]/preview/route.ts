// =========================================================================
// POST /api/wendclass/commandes/[id]/preview — Upload aperçu retouché
// Upload dans le bucket "apercus-commandes" + mise à jour photo_apercu_url
// =========================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateOrderPreviewDB, getOrderByIdDB } from "@/lib/supabase-db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Vérifier que la commande existe
    const existingOrder = await getOrderByIdDB(id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: "Commande non trouvée." },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let previewFile: File | null = null;
    let externalUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      previewFile = formData.get("file") as File | null;
      const directUrl = formData.get("url") as string | null;
      if (directUrl) externalUrl = directUrl;
    } else {
      const body = await request.json();
      externalUrl = body.previewUrl || body.url || undefined;
    }

    if (!previewFile && !externalUrl) {
      return NextResponse.json(
        { error: "Veuillez fournir un fichier image ou une URL d'aperçu." },
        { status: 400 }
      );
    }

    // Validation du fichier
    if (previewFile && !previewFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image." },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderPreviewDB(id, previewFile, externalUrl);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de l'aperçu." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Aperçu retouché enregistré avec succès.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error(
      `POST /api/wendclass/commandes/${params.id}/preview erreur:`,
      err
    );
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'aperçu." },
      { status: 500 }
    );
  }
}
