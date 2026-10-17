// =========================================================================
// GET /api/wendclass/commandes/[id]/download
// Téléchargement forcé (Content-Disposition: attachment)
// Permet à l'admin de télécharger la photo originale ou l'aperçu
// sans que le navigateur ne se contente de l'ouvrir dans un nouvel onglet.
// =========================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") === "apercu" ? "apercu" : "originale";

    const admin = getSupabaseAdmin();

    // Récupérer la commande
    const { data: order, error: orderError } = await admin
      .from("commandes")
      .select("id, client_nom, photo_originale_url, photo_apercu_url")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const targetUrlOrPath =
      type === "apercu" ? order.photo_apercu_url : order.photo_originale_url;

    if (!targetUrlOrPath) {
      return NextResponse.json(
        { error: `Aucune image ${type} disponible pour cette commande.` },
        { status: 404 }
      );
    }

    let buffer: Buffer;
    let contentType = "image/jpeg";

    if (
      targetUrlOrPath.startsWith("http://") ||
      targetUrlOrPath.startsWith("https://")
    ) {
      // Téléchargement depuis une URL externe complète
      const remoteRes = await fetch(targetUrlOrPath);
      if (!remoteRes.ok) {
        throw new Error(`Échec de récupération de l'image distante : ${remoteRes.statusText}`);
      }
      contentType = remoteRes.headers.get("content-type") || "image/jpeg";
      const arrayBuffer = await remoteRes.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // Téléchargement depuis le bucket Supabase Storage privé ou public
      const bucket = type === "apercu" ? "apercus-commandes" : "photos-commandes";
      const { data: fileBlob, error: downloadError } = await admin.storage
        .from(bucket)
        .download(targetUrlOrPath);

      if (downloadError || !fileBlob) {
        // Tentative via URL signée de secours
        const { data: signedData, error: signError } = await admin.storage
          .from(bucket)
          .createSignedUrl(targetUrlOrPath, 60);

        if (signError || !signedData?.signedUrl) {
          throw new Error(
            downloadError?.message || signError?.message || "Erreur de lecture Storage."
          );
        }

        const remoteRes = await fetch(signedData.signedUrl);
        if (!remoteRes.ok) {
          throw new Error("Impossible de télécharger le fichier signé.");
        }
        contentType = remoteRes.headers.get("content-type") || "image/jpeg";
        const arrayBuffer = await remoteRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else {
        contentType = fileBlob.type || "image/jpeg";
        const arrayBuffer = await fileBlob.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
    }

    // Déterminer l'extension
    let ext = "jpg";
    if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("heic")) ext = "heic";

    // Nom de fichier propre et sécurisé
    const safeClient = (order.client_nom || "client")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);

    const prefix = type === "apercu" ? "apercu-studio" : "photo-originale";
    const filename = `${prefix}-${safeClient}-${id.slice(0, 8)}.${ext}`;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Content-Length", String(buffer.length));
    headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    console.error("Erreur téléchargement image admin:", err);
    return NextResponse.json(
      {
        error: "Erreur lors du téléchargement du fichier.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
