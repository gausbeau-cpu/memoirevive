import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createAdminSessionToken,
} from "@/lib/admin-auth";
import { getStoredAdminCredentials } from "@/lib/admin-credentials-storage";

export async function POST(request: NextRequest) {
  // Récupérer l'adresse IP client pour le rate limiter
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Vérification du rate limiting
  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        error: "Trop de tentatives infructueuses.",
        message: `Compte temporairement verrouillé pour des raisons de sécurité. Veuillez réessayer dans ${rateLimitStatus.retryAfterSeconds} secondes.`,
        retryAfter: rateLimitStatus.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe." },
        { status: 400 }
      );
    }

    const { email: expectedEmail, password: expectedPassword } =
      getStoredAdminCredentials();

    const inputEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password);

    // 2. Vérification des identifiants
    if (inputEmail !== expectedEmail || inputPassword !== expectedPassword) {
      const failedResult = recordFailedAttempt(ip);
      return NextResponse.json(
        {
          error: "Identifiants invalides.",
          remainingAttempts: failedResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Connexion réussie -> Réinitialiser le rate limit
    clearRateLimit(ip);

    // 4. Génération du token de session sécurisé
    const token = await createAdminSessionToken(inputEmail);

    const response = NextResponse.json({
      success: true,
      message: "Connexion administrateur réussie.",
    });

    // 5. Enregistrement du cookie HTTP-only
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  } catch (err) {
    console.error("Erreur login admin:", err);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
