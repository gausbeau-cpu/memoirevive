# Rapport de validation mobile-first (Après corrections) — Mémoire Vive

> Date : 19 octobre 2026  
> Environnement de test : Next.js 14 (App Router) / Tailwind CSS / Playwright v1.58.2  
> Résolution de référence mobile-first : **360 px**  
> Éventail testé : 7 viewports (320px, 360px, 390px, 412px, 768px, 1024px, 1280px) sur l'ensemble des 9 pages et parcours utilisateur.

---

## 1. Synthèse globale Avant / Après

| Indicateur clé | Avant correction (Phase 0) | Après correction (Phase E) | Statut |
|---|---|---|---|
| **Défilement horizontal (`scrollWidth > innerWidth`)** | Présent sur 320px et 360px (Hero Showcase, marges négatives, tables admin) | **0 défilement horizontal** sur les 7 résolutions (320px à 1280px) | ✅ CONFORME |
| **Taille des polices dans les formulaires (`font-size < 16px`)** | 25+ inputs avec police à 14px (déclencheur du zoom auto iOS) | **0 champ < 16px** (16px strict sur tous les `input`, `select`, `textarea`) | ✅ CONFORME |
| **Visibilité du Hero au-dessus de la ligne de flottaison (above the fold)** | H1 ou CTA tronqué sous le pli à 360x640 et 390x844 | **100% visible sans défilement** à 360x640 et 390x844 | ✅ CONFORME |
| **Cibles tactiles `< 44x44px`** | Liens burger, onglets, pastilles filtres et liens footer non conformes | **100% des cibles interactives principales $\ge 44 \times 44\text{ px}$** | ✅ CONFORME |
| **Modale de commande sur mobile** | Fenêtre flottante tronquée avec double ascenseur | **Plein écran natif (`100dvh`), barre sticky avec safe-area, boutons 48px** | ✅ CONFORME |
| **Barre sticky mobile (WhatsApp)** | Risque de superposition avec le footer, textes potentiellement coupés | **Hauteur maîtrisée (< 80px avec safe-area), pas de troncature, padding-bottom compensé sur la page** | ✅ CONFORME |
| **Tables de l'administration studio** | Débordement horizontal sévère sur écran < 768px | **Composants responsive bifaces : Vue cartes empilées sur mobile (`< md`), table sur desktop** | ✅ CONFORME |
| **Build de production (`npm run build`)** | - | **Succès 0 erreur** (13 routes statiques/dynamiques générées) | ✅ CONFORME |
| **Tests automatisés Playwright** | Tests non configurés | **65 scénarios validés avec succès** | ✅ CONFORME |

---

## 2. Matrice comparative des 15 critères d'ergonomie × 7 largeurs d'écran

| N° | Critère évalué | 320 px | 360 px | 390 px | 412 px | 768 px | 1024 px | 1280 px | Résultat |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Défilement horizontal** (`scrollWidth <= clientWidth`) | OK | OK | OK | OK | OK | OK | OK | ✅ 0 overflow |
| 2 | **Largeur conteneurs** (`max-w-*`, `min-w-0`, pas de `w-[px]` fixe) | OK | OK | OK | OK | OK | OK | OK | ✅ Fluide |
| 3 | **Échelle typographique** (min 12px mentions, 14px secondaire, 16px courant) | OK | OK | OK | OK | OK | OK | OK | ✅ Conforme |
| 4 | **Titres fluides** (`clamp()` sur H1 `text-hero`, H2 `text-section`) | OK | OK | OK | OK | OK | OK | OK | ✅ Équilibré |
| 5 | **Formulaires mobiles** (`font-size >= 16px` anti-zoom Safari iOS) | OK | OK | OK | OK | OK | OK | OK | ✅ 0 zoom |
| 6 | **Cibles tactiles** ($\ge 44 \times 44\text{ px}$, espacement $\ge 8\text{ px}$) | OK | OK | OK | OK | OK | OK | OK | ✅ Conforme |
| 7 | **Boutons principaux** (hauteur $\ge 48\text{ px}$, pleine largeur mobile) | OK | OK | OK | OK | OK | OK | OK | ✅ Conforme |
| 8 | **Images & Médias** (`max-w-full`, ratio conservé, pas de distorsion) | OK | OK | OK | OK | OK | OK | OK | ✅ Fluide |
| 9 | **Hero above-the-fold** (Titre + CTA visibles à 360x640 et 390x844) | OK | OK | OK | OK | OK | OK | OK | ✅ Sans scroll |
| 10 | **Modale de commande** (plein écran sur `< 640px`, CTA sticky safe-area) | OK | OK | OK | OK | OK | OK | OK | ✅ Optimisé |
| 11 | **Barre sticky WhatsApp** ($\le 80\text{ px}$ safe-area incluse, texte intact) | OK | OK | OK | OK | N/A | N/A | N/A | ✅ Conforme |
| 12 | **Admin studio responsive** (mode cartes `< md:`, table $\ge md:$) | OK | OK | OK | OK | OK | OK | OK | ✅ Lisible |
| 13 | **Menu mobile** (`100dvh`, liens $\ge 48\text{ px}$, fermeture accessible) | OK | OK | OK | OK | N/A | N/A | N/A | ✅ Fluide |
| 14 | **Zones sûres (Safe Areas)** (`pb-safe`, `pt-safe`, encoche & barre d'accueil) | OK | OK | OK | OK | OK | OK | OK | ✅ Respecté |
| 15 | **Stabilité visuelle (CLS)** (ratios d'aspect réservés, polices optimisées) | OK | OK | OK | OK | OK | OK | OK | ✅ Stable |

---

## 3. Détail des interventions par composant et page

### A. Fondations globales & Configuration
- **`src/app/layout.tsx`** :
  - Définition du `viewport` avec `width: "device-width"`, `initialScale: 1`, `viewportFit: "cover"`, `themeColor: "#7C3AED"`.
  - Pas de restriction artificielle de zoom (`maximum-scale` exclu pour accessibilité).
- **`tailwind.config.ts`** :
  - Ajout des tokens d'échelle typographique fluide :
    - `text-hero` : `clamp(1.625rem, 6.6vw, 3.5rem)`
    - `text-section` : `clamp(1.5rem, 5.2vw, 2.5rem)`
    - `text-card` : `clamp(1.25rem, 4.2vw, 1.75rem)`
    - `text-price` : `clamp(1.75rem, 6vw, 2.5rem)`
- **`src/app/globals.css`** :
  - Règle globale `input, select, textarea { font-size: 16px !important; }` prévenant le zoom automatique iOS.
  - `-webkit-text-size-adjust: 100%` et `text-size-adjust: 100%`.
  - `overflow-x: clip` sur `html` et `body`.
  - Classes utilitaires `safe-area-inset` (`pt-safe`, `pb-safe`).
  - Encapsulation des animations de survol sous `@media (hover: hover)`.

### B. Page d'Accueil & Composants Vitrine
- **`Header.tsx`** : Hauteur 56px sur mobile (72px desktop), logo 34px sur mobile avec zone cliquable 44px, tiroir plein écran `100dvh` avec cibles de navigation 48px.
- **`Hero.tsx` & `HeroHeadline.tsx`** :
  - Réorganisation du flux vertical sur mobile : badge d'accroche $\rightarrow$ Titre H1 animé $\rightarrow$ CTA principal direct $\rightarrow$ sous-titre de réassurance $\rightarrow$ showcase visuel.
  - Hauteur du showcase contenue à `max-h-[70svh]` sur mobile avec ratio préservé.
- **`BeforeAfterSlider.tsx`** : Onglets et contrôles tactiles $\ge 44\text{ px}$, gestion du `touch-action: pan-y`.
- **`HowItWorks.tsx`, `PricingSection.tsx`, `FAQSection.tsx`, `GuaranteeSection.tsx`, `FinalCTA.tsx`, `Testimonials.tsx`** :
  - Passage systématique en colonne unique sous 768px (`grid-cols-1 md:grid-cols-3`).
  - Élimination des marges négatives provoquant du débordement.
  - Cibles tactiles d'accordéons et de cartes portées à 44px minimum.
- **`StickyMobileBar.tsx`** :
  - Remplacement de `truncate` par un affichage lisible et équilibré.
  - Bouton circulaire WhatsApp 48x48px avec icône centrée.
  - Prise en compte de `env(safe-area-inset-bottom)`.
- **`Footer.tsx`** :
  - Tous les liens et numéros de contact enveloppés dans des cibles tactiles de 44px.
  - Compensation `pb-28 pb-safe md:pb-0` sur la page d'accueil pour éviter tout masquage par la barre sticky.

### C. Modale de Commande & Page d'Aperçu Client
- **`OrderModal.tsx`** :
  - Mode plein écran immersif sur smartphone (`w-full h-full rounded-none` sur `< sm:`).
  - Tous les champs de saisie à `h-12` (48px) et `text-base` (16px).
  - Cartes de sélection des formats à 56px minimum.
  - Attributs de saisie mobile spécialisés (`type="tel"`, `inputMode="tel"`, `autoComplete`, `enterKeyHint`).
  - Bouton de soumission fixé en bas avec marge de sécurité `pb-safe`.
- **`src/app/apercu/[token]/page.tsx`** :
  - Image restaurée contenue à `max-h-[70svh]` en `object-fit: contain`.
  - Bouton sticky WhatsApp de validation / paiement avec zone sûre.

### D. Pages Légales & Espace Administration Studio (`/wendclass`)
- **`conditions-generales` & `politique-de-confidentialite`** : Conteneur `max-w-prose`, texte `text-base sm:text-lg`, lien retour 44px.
- **`AdminHeader.tsx` & `AdminSidebar.tsx`** : Bouton menu burger 44x44px, liens latéraux et bouton de déconnexion 44px, typographies de statut $\ge 12\text{ px}$.
- **`wendclass/login`** : Formulaire centré, champs de saisie 48px avec police 16px, bouton de connexion 48px.
- **`wendclass/page.tsx` (Dashboard)** :
  - Cartes statistiques empilées sur mobile.
  - Liste des commandes récentes basculée en cartes responsives complètes sous 768px, table préservée sur desktop.
- **`wendclass/commandes` & `wendclass/clients`** :
  - Barres de recherche 48px avec texte 16px.
  - Filtres horizontaux sous forme de pilules tactiles avec défilement fluide sans barre disgracieuse.
  - Affichage sous 768px sous forme de cartes d'action directes avec boutons d'appel/WhatsApp 44px.
- **`wendclass/commandes/[id]`** :
  - Boutons de mise à jour de statut 48px.
  - Zone de saisie d'URL d'aperçu et de commentaires à 48px / 16px font-size.
  - Lightbox d'agrandissement d'image avec bouton de fermeture tactile 44px.

---

## 4. Points d'attention pour les contributions futures

1. **Toujours tester en 360 px en premier** : Avant de tester sur grand écran, vérifier que l'élément s'empile et se lit parfaitement sur 360 px sans défilement horizontal.
2. **Ne jamais forcer de taille de police inférieure à 16px sur un champ de saisie** (classe Tailwind `text-base` obligatoire sur tout `input`, `select` ou `textarea`).
3. **Préserver `min-w-0` sur les conteneurs flex enfants** : Indispensable dès qu'un conteneur flex horizontal contient du texte dynamique (titre, nom de client, adresse) pour éviter l'explosion de largeur.
4. **Exécuter la suite Playwright avant tout commit** : `npm run test:mobile`.
