-- =========================================================================
-- Mémoire Vive — Setup Complet Supabase
-- À exécuter UNE SEULE FOIS dans l'éditeur SQL du dashboard Supabase
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. Table des commandes
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Token public sécurisé non-devinable pour la page d'aperçu
    lien_public UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),

    -- Informations client
    client_nom TEXT NOT NULL,
    client_telephone TEXT NOT NULL,
    client_quartier TEXT NOT NULL,
    client_adresse_details TEXT,

    -- Choix du forfait
    forfait_id TEXT NOT NULL CHECK (forfait_id IN ('souvenir', 'memoire', 'heritage')),
    forfait_nom TEXT NOT NULL,
    forfait_prix INTEGER NOT NULL,
    forfait_format TEXT NOT NULL,
    occasion_note TEXT,

    -- Photos
    photo_originale_url TEXT NOT NULL,
    photo_apercu_url TEXT,

    -- Statut du cycle de vie
    statut TEXT NOT NULL DEFAULT 'nouvelle' CHECK (
        statut IN (
            'nouvelle',
            'apercu_envoye',
            'refusee',
            'validee_payee',
            'en_impression',
            'livree'
        )
    ),

    -- Dates des transitions de statut
    date_apercu_envoye TIMESTAMPTZ,
    date_paiement TIMESTAMPTZ,
    date_impression TIMESTAMPTZ,
    date_livraison TIMESTAMPTZ,
    date_refus TIMESTAMPTZ,

    -- Paiement
    mode_paiement TEXT CHECK (mode_paiement IN ('orange_money', 'moov_money', NULL)),
    reference_paiement TEXT
);

-- -------------------------------------------------------------------------
-- 2. Table de l'historique des statuts
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.statuts_historique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
    ancien_statut TEXT,
    nouveau_statut TEXT NOT NULL,
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. Row Level Security
-- -------------------------------------------------------------------------
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuts_historique ENABLE ROW LEVEL SECURITY;

-- Autoriser l'INSERT public (formulaire non connecté)
CREATE POLICY "Anon INSERT commandes"
ON public.commandes
FOR INSERT
TO anon
WITH CHECK (true);

-- L'accès complet via service_role (API admin) bypasse le RLS automatiquement.
-- Pas besoin de politique supplémentaire pour le service_role.

-- -------------------------------------------------------------------------
-- 4. Vue publique restreinte pour l'aperçu client
-- -------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.apercu_public_view AS
SELECT
    lien_public,
    client_nom,
    forfait_nom,
    forfait_id,
    forfait_format,
    photo_apercu_url,
    statut,
    created_at
FROM public.commandes;

GRANT SELECT ON public.apercu_public_view TO anon, authenticated;

-- -------------------------------------------------------------------------
-- 5. Index de performance
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON public.commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON public.commandes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_telephone ON public.commandes(client_telephone);
CREATE INDEX IF NOT EXISTS idx_commandes_lien_public ON public.commandes(lien_public);
CREATE INDEX IF NOT EXISTS idx_statuts_historique_commande_id ON public.statuts_historique(commande_id);

-- -------------------------------------------------------------------------
-- 6. Trigger updated_at automatique
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_commandes_updated_at ON public.commandes;
CREATE TRIGGER trigger_update_commandes_updated_at
BEFORE UPDATE ON public.commandes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------------------------
-- 7. Buckets de stockage (Storage)
-- -------------------------------------------------------------------------

-- Bucket pour les photos originales (uploadées par les clients) — 100% PRIVÉ
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos-commandes',
    'photos-commandes',
    false,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les aperçus retouchés (uploadés par l'admin) — LECTURE PUBLIQUE (Vignettes WhatsApp & Page Aperçu)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'apercus-commandes',
    'apercus-commandes',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- -------------------------------------------------------------------------
-- 8. Politiques Storage
-- -------------------------------------------------------------------------

-- photos-commandes : upload autorisé pour tout le monde (formulaire public)
CREATE POLICY "Anon upload photos-commandes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'photos-commandes');

-- apercus-commandes : lecture publique pour afficher sur la page aperçu et WhatsApp
DROP POLICY IF EXISTS "Public read apercus-commandes" ON storage.objects;
CREATE POLICY "Public read apercus-commandes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apercus-commandes');

-- =========================================================================
-- FIN DU SCRIPT
-- =========================================================================
