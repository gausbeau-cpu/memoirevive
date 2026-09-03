-- =========================================================================
-- Mémoire Vive — Migration Page Aperçu Publique & Sécurité
-- À exécuter dans le SQL Editor Supabase
-- =========================================================================

-- 1. Ajout de la colonne lien_public (UUID unique non-devinable)
ALTER TABLE public.commandes 
ADD COLUMN IF NOT EXISTS lien_public UUID UNIQUE NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS idx_commandes_lien_public ON public.commandes(lien_public);

-- 2. Vue publique restreinte (Expose UNIQUEMENT les infos nécessaires à l'aperçu)
-- Zéro exposition des numéros de téléphone, adresses ou notes privées aux utilisateurs anonymes !
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

-- Accès en lecture sur la vue pour tout le monde (visiteurs non connectés)
GRANT SELECT ON public.apercu_public_view TO anon, authenticated;

-- 3. Configuration du Bucket apercus-commandes en lecture publique
-- (Nécessaire pour l'affichage de l'image et la vignette OpenGraph WhatsApp)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'apercus-commandes';

-- Politique de lecture publique pour le bucket apercus-commandes
DROP POLICY IF EXISTS "Public read apercus-commandes" ON storage.objects;
CREATE POLICY "Public read apercus-commandes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apercus-commandes');

-- =========================================================================
-- FIN DE LA MIGRATION
-- =========================================================================
