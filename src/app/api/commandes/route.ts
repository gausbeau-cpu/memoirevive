// =========================================================================
// POST /api/commandes — Soumission publique d'une commande
// Route accessible sans authentification (formulaire public)
// =========================================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { submitOrder } from "@/lib/supabase-db";
import { isValidOfferId } from "@/content/offers";
import { formatBurkinaWhatsAppPhone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Format de requête invalide. Utilisez multipart/form-data." },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const forfaitId = (formData.get("forfait") as string)?.trim();
    const clientNom = (formData.get("nom") as string)?.trim();
    const rawTelephone = (formData.get("telephone") as string)?.trim();
    const clientQuartier = (formData.get("quartier") as string)?.trim();
    const clientAdresseDetails =
      (formData.get("adresseDetails") as string)?.trim() || undefined;
    const occasionNote =
      (formData.get("occasionNote") as string)?.trim() || undefined;
    const texteAEcrireRaw =
      (formData.get("texteAEcrire") as string)?.trim() || undefined;
    const laisserProposerTexte =
      formData.get("laisserProposerTexte") === "true";
    const echeanceRaw = (formData.get("echeance") as string)?.trim();
    const photoFile = formData.get("photo") as File | null;
    const photoExternalUrl =
      (formData.get("photoUrl") as string)?.trim() || undefined;

    // Validation basique
    if (!forfaitId || !clientNom || !rawTelephone || !clientQuartier) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (format, nom, téléphone, quartier)." },
        { status: 400 }
      );
    }

    if (!isValidOfferId(forfaitId)) {
      return NextResponse.json(
        { error: "Format invalide. Choisis l'un des formats proposés." },
        { status: 400 }
      );
    }

    if (!photoFile && !photoExternalUrl) {
      return NextResponse.json(
        { error: "Une photo est requise." },
        { status: 400 }
      );
    }

    // Validation du fichier photo
    if (photoFile) {
      if (!photoFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Le fichier doit être une image." },
          { status: 400 }
        );
      }
      const MAX_SIZE = 15 * 1024 * 1024; // 15 Mo
      if (photoFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "La photo ne doit pas dépasser 15 Mo." },
          { status: 400 }
        );
      }
    }

    const clientTelephone = formatBurkinaWhatsAppPhone(rawTelephone);
    const texteAEcrire = texteAEcrireRaw ? texteAEcrireRaw.slice(0, 100) : undefined;
    const echeance =
      echeanceRaw === "cette_semaine" ||
      echeanceRaw === "ce_mois" ||
      echeanceRaw === "plus_tard"
        ? echeanceRaw
        : null;

    const result = await submitOrder({
      photoFile,
      photoExternalUrl,
      forfaitId,
      clientNom,
      clientTelephone,
      clientQuartier,
      clientAdresseDetails,
      texteAEcrire,
      laisserProposerTexte,
      echeance,
      occasionNote,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        message: "Commande enregistrée avec succès.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/commandes erreur:", err);
    return NextResponse.json(
      { error: "Erreur serveur inattendue. Réessayez dans quelques instants." },
      { status: 500 }
    );
  }
}
