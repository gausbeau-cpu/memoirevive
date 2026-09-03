import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Déconnexion réussie.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
