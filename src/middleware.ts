import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Appliquer les règles de sécurité uniquement sur /wendclass et ses sous-routes
  if (pathname.startsWith("/wendclass")) {
    const isLoginPage = pathname === "/wendclass/login";
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const { valid } = await verifyAdminSessionToken(sessionCookie);

    // 1. Si utilisateur non connecté tente d'accéder à une page admin protégée -> Redirection /wendclass/login
    if (!valid && !isLoginPage) {
      const loginUrl = new URL("/wendclass/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return response;
    }

    // 2. Si utilisateur déjà connecté accède à /wendclass/login -> Redirection vers le dashboard /wendclass
    if (valid && isLoginPage) {
      const dashboardUrl = new URL("/wendclass", request.url);
      const response = NextResponse.redirect(dashboardUrl);
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return response;
    }

    // 3. Réponse standard pour /wendclass avec en-têtes stricts noindex & sécurité
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "same-origin");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wendclass/:path*"],
};
