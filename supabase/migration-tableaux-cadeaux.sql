-- =========================================================================
-- Mémoire Vive — Migration Tableaux Photo Cadeaux d'Anniversaire
-- À exécuter dans le SQL Editor Supabase
-- =========================================================================

-- 1. Suppression propre des anciennes tables et vues (base vide)
DROP VIEW IF EXISTS public.apercu_public_view CASCADE;
DROP TABLE IF EXISTS public.statuts_historique CASCADE;
DROP TABLE IF EXISTS public.commandes CASCADE;

-- 2. Création de la table principale commandes
CREATE TABLE public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lien_public UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Informations client
    client_nom TEXT NOT NULL,
    client_telephone TEXT NOT NULL,
    client_quartier TEXT NOT NULL,
    client_adresse_details TEXT,

    -- Format choisi (30x40, 40x60 ou 50x70)
    forfait_id TEXT NOT NULL CHECK (forfait_id IN ('format_30x40', 'format_40x60', 'format_50x70')),
    forfait_nom TEXT NOT NULL,
    forfait_prix INTEGER NOT NULL,
    forfait_format TEXT NOT NULL,

    -- Personnalisation du tableau anniversaire
    texte_a_ecrire VARCHAR(100),
    laisser_proposer_texte BOOLEAN NOT NULL DEFAULT false,
    echeance TEXT CHECK (echeance IN ('cette_semaine', 'ce_mois', 'plus_tard', NULL)),
    occasion_note TEXT,

    -- Photos
    photo_originale_url TEXT NOT NULL,
    photo_apercu_url TEXT,

    -- Statut du workflow
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

    -- Horodatages des transitions
    date_apercu_envoye TIMESTAMPTZ,
    date_paiement TIMESTAMPTZ,
    date_impression TIMESTAMPTZ,
    date_livraison TIMESTAMPTZ,
    date_refus TIMESTAMPTZ,

    -- Paiement Mobile Money
    mode_paiement TEXT CHECK (mode_paiement IN ('orange_money', 'moov_money', NULL)),
    reference_paiement TEXT
);

-- 3. Table de l'historique des statuts
CREATE TABLE public.statuts_historique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
    ancien_statut TEXT,
    nouveau_statut TEXT NOT NULL,
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Trigger updated_at automatique
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

-- 5. Vue publique sécurisée apercu_public_view
-- Expose uniquement les informations nécessaires au client (inclut texte_a_ecrire)
-- N'expose JAMAIS téléphone, quartier ni adresse personnelle
CREATE OR REPLACE VIEW public.apercu_public_view AS
SELECT
    lien_public,
    client_nom,
    forfait_nom,
    forfait_id,
    forfait_format,
    photo_apercu_url,
    texte_a_ecrire,
    statut,
    created_at
FROM public.commandes;

-- Accès en lecture sur la vue pour les visiteurs non connectés
GRANT SELECT ON public.apercu_public_view TO anon, authenticated;

-- 6. Row Level Security (RLS) strict
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuts_historique ENABLE ROW LEVEL SECURITY;

-- Autoriser l'INSERT public (formulaire sans compte)
DROP POLICY IF EXISTS "Anon INSERT commandes" ON public.commandes;
CREATE POLICY "Anon INSERT commandes"
ON public.commandes
FOR INSERT
TO anon
WITH CHECK (true);

-- Le rôle anon ne peut PAS faire de SELECT, UPDATE ou DELETE direct sur public.commandes.
-- Les routes admin utilisent la clé service_role côté serveur qui contourne le RLS.

-- 7. Index de performance
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON public.commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON public.commandes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_telephone ON public.commandes(client_telephone);
CREATE INDEX IF NOT EXISTS idx_commandes_lien_public ON public.commandes(lien_public);
CREATE INDEX IF NOT EXISTS idx_commandes_forfait ON public.commandes(forfait_id);
CREATE INDEX IF NOT EXISTS idx_statuts_historique_commande_id ON public.statuts_historique(commande_id);

-- 8. Configuration des Buckets de Stockage
-- Bucket photos-commandes : 100% PRIVÉ (photos clients originales)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos-commandes',
    'photos-commandes',
    false,
    31457280,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 31457280;

-- Bucket apercus-commandes : LECTURE PUBLIQUE (affichage fluide + vignette WhatsApp)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'apercus-commandes',
    'apercus-commandes',
    true,
    31457280,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 31457280;

-- Politiques Storage
DROP POLICY IF EXISTS "Anon upload photos-commandes" ON storage.objects;
CREATE POLICY "Anon upload photos-commandes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'photos-commandes');

DROP POLICY IF EXISTS "Public read apercus-commandes" ON storage.objects;
CREATE POLICY "Public read apercus-commandes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apercus-commandes');

-- =========================================================================
-- FIN DU SCRIPT DE MIGRATION
-- =========================================================================
