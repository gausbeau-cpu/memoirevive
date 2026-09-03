// =========================================================================
// Mémoire Vive — Clients Supabase
// =========================================================================
// Ce fichier exporte deux clients :
// - supabase       → client anon/public (formulaire côté client)
// - getSupabaseAdmin() → client service_role (API routes côté serveur UNIQUEMENT)
// =========================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client public — utilisable côté client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin — SERVER-SIDE ONLY, bypasse le RLS
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase service_role non configuré. Vérifiez .env.local.");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Vérifie si Supabase est correctement configuré
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !!supabaseServiceKey &&
    supabaseUrl.includes("supabase.co")
  );
}
