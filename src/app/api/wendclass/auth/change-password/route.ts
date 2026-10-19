import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import {
  getStoredAdminCredentials,
  saveStoredAdminCredentials,
} from "@/lib/admin-credentials-storage";

export async function POST(request: NextRequest) {
  // 1. Vérification de la session admin en cours
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const auth = await verifyAdminSessionToken(token);

  if (!auth.valid) {
    return NextResponse.json(
      { error: "Session non autorisée ou expirée. Veuillez vous reconnecter." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // 2. Validation des champs obligatoires
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Veuillez renseigner le mot de passe actuel et le nouveau mot de passe." },
        { status: 400 }
      );
    }

    const trimmedCurrent = String(currentPassword);
    const trimmedNew = String(newPassword).trim();
    const trimmedConfirm = confirmPassword !== undefined ? String(confirmPassword).trim() : trimmedNew;

    // 3. Vérification du mot de passe actuel
    const currentCredentials = getStoredAdminCredentials();
    if (trimmedCurrent !== currentCredentials.password) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect." },
        { status: 400 }
      );
    }

    // 4. Règles de sécurité sur le nouveau mot de passe
    if (trimmedNew.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau code doit contenir au moins 6 caractères pour votre sécurité." },
        { status: 400 }
      );
    }

    if (trimmedNew === currentCredentials.password) {
      return NextResponse.json(
        { error: "Le nouveau code doit être différent du code actuel." },
        { status: 400 }
      );
    }

    if (trimmedConfirm !== trimmedNew) {
      return NextResponse.json(
        { error: "La confirmation ne correspond pas au nouveau code." },
        { status: 400 }
      );
    }

    // 5. Enregistrement persistant
    saveStoredAdminCredentials(trimmedNew);

    return NextResponse.json({
      success: true,
      message: "Code de connexion admin modifié avec succès !",
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erreur modification mot de passe admin:", err);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la mise à jour." },
      { status: 500 }
    );
  }
}
