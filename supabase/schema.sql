-- =========================================================================
-- Mémoire Vive — Schéma de Base de Données Supabase & Sécurité RLS
-- =========================================================================

-- 1. Table des commandes
CREATE TABLE IF NOT EXISTS public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Informations client
    client_nom TEXT NOT NULL,
    client_telephone TEXT NOT NULL,
    client_quartier TEXT NOT NULL,
    client_adresse_details TEXT,
    
    -- Choix du forfait & personnalisation
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
    
    -- Date validation et paiement
    date_apercu_envoye TIMESTAMPTZ,
    date_paiement TIMESTAMPTZ,
    date_impression TIMESTAMPTZ,
    date_livraison TIMESTAMPTZ,
    date_refus TIMESTAMPTZ,
    
    -- Mode de paiement (Orange Money / Moov Money)
    mode_paiement TEXT CHECK (mode_paiement IN ('orange_money', 'moov_money', NULL)),
    reference_paiement TEXT
);

-- 2. Table de l'historique des changements de statut (Timeline)
CREATE TABLE IF NOT EXISTS public.statuts_historique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
    ancien_statut TEXT,
    nouveau_statut TEXT NOT NULL,
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Activation du Row Level Security (RLS)
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuts_historique ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS de sécurité stricte :
-- Seul l'administrateur authentifié (email correspondant à ADMIN_EMAIL) a accès en lecture / écriture complète.
CREATE POLICY "Admin All Access Commandes"
ON public.commandes
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
    OR auth.role() = 'service_role'
);

CREATE POLICY "Admin All Access Statuts Historique"
ON public.statuts_historique
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
    OR auth.role() = 'service_role'
);

-- 5. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON public.commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON public.commandes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_telephone ON public.commandes(client_telephone);
CREATE INDEX IF NOT EXISTS idx_statuts_historique_commande_id ON public.statuts_historique(commande_id);

-- 6. Trigger automatique pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_commandes_updated_at
BEFORE UPDATE ON public.commandes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
