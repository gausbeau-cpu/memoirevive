# Mémoire Vive

Service de restauration et d'encadrement de photos personnalisées assisté par l'IA au Burkina Faso (Ouagadougou).

---

## 📱 Charte & Guide Mobile-First

Le site a été conçu et validé selon une stricte approche **mobile-first** pour garantir une expérience fluide, rapide et sans friction, du smartphone le plus modeste (320 px) aux grands écrans de bureau (1280 px+).

### 1. Les 8 principes mobile-first indispensables

1. **Styles de base = mobile d'abord** : La feuille de style et les classes Tailwind définissent la mise en page smartphone par défaut. Les variantes pour écrans plus larges s'ajoutent **exclusivement** avec les préfixes progressifs `sm:` (640 px), `md:` (768 px), `lg:` (1024 px) et `xl:` (1280 px).
2. **Une seule colonne par défaut** : Grilles et rangées de cartes s'affichent sur une seule colonne verticale (`grid-cols-1` ou `flex-col`) sur mobile, et ne passent en colonnes multiples qu'à partir de `md:`.
3. **Zéro dimension fixe en pixels pour conteneurs et textes** : Privilégier `w-full`, `max-w-*`, `min-w-0` (obligatoire sur les enfants flex pour éviter l'overflow de contenu textuel), `rem`, `%`, `aspect-*` et `clamp()`.
4. **Unités de hauteur dynamiques** : Utiliser `100dvh` ou `100svh` avec repli `100vh` pour prendre en compte les barres d'URL des navigateurs mobiles (`h-[100dvh]`, `min-h-[100dvh]`, `max-h-[70svh]`).
5. **Gestion des zones sûres (Safe Areas)** : Tout élément fixé (`sticky` ou `fixed`, comme le header mobile ou la barre flottante de commande WhatsApp) prend en compte `env(safe-area-inset-top)` et `env(safe-area-inset-bottom)` (`pb-safe`, `pt-safe`).
6. **Pas de défilement horizontal & gestion des retours à la ligne** :
   - `overflow-wrap: anywhere` appliqué globalement.
   - `truncate` interdit sur les contenus critiques (titres, prix, noms, messages).
   - `text-wrap: balance` sur les titres.
7. **Accessibilité & zoom préservé** : Ne jamais bloquer le zoom utilisateur (`maximum-scale` et `user-scalable=no` interdits dans la configuration du viewport).
8. **Survols tactiles sécurisés** : Les effets au survol (`hover:`) sont protégés dans `@media (hover: hover)` pour éviter les états « coincés » sur écran tactile.

---

### 2. Échelle typographique fluide

Les tailles de police critiques utilisent des fonctions fluides `clamp()` configurées dans `tailwind.config.ts` :

| Rôle | Token Tailwind | Taille fluide | Interlignage |
|---|---|---|---|
| Titre Hero (H1) | `text-hero` | `clamp(3.25rem, 13vw, 7rem)` | 1.08 |
| Titre de section (H2) | `text-section` | `clamp(1.5rem, 5.2vw, 2.5rem)` | 1.2 |
| Sous-titre de carte (H3) | `text-card` | `clamp(1.25rem, 4.2vw, 1.75rem)` | 1.25 |
| Prix | `text-price` | `clamp(1.75rem, 6vw, 2.5rem)`, tabulaire | 1.1 |
| Texte courant | `text-base` | `1rem` (16 px minimum) | 1.6 |
| Texte secondaire | `text-sm` | `0.875rem` (14 px minimum) | 1.5 |
| Légendes & badges | `text-xs` | `0.75rem` (12 px minimum) | 1.4 |
| Boutons | `text-base` | `1rem`, graisse 600 | 1.2 |

---

### 3. Règles d'ergonomie et formulaires

- **Cibles tactiles** : Minimum 44 × 44 px pour tout élément interactif (boutons, liens, accordéons, filtres, onglets). Les boutons d'action principaux mesurent au moins 48 px de hauteur. Espacement minimum de 8 px entre deux cibles interactives adjacentes.
- **Champs de formulaire** : `font-size: 16px` minimum sur `input`, `select` et `textarea` pour neutraliser le zoom automatique forcé sur iOS Safari.
- **Attributs mobiles optimisés** :
  - Clavier adapté : `type="tel"` et `inputMode="tel"` sur les numéros de téléphone.
  - Saisie assistée : `autoComplete`, `autoCapitalize="words"` sur les noms, `enterKeyHint="next"` ou `"done"`.
- **Espace de défilement inférieur** : La page d'accueil applique `pb-28 pb-safe md:pb-0` pour que la barre sticky mobile ne masque aucun élément du pied de page.

---

### 4. Tests et audit automatisés

Une suite de tests Playwright dédiée mesure et garantit l'absence de régression sur 7 largeurs d'écran clés (320 px, 360 px, 390 px, 412 px, 768 px, 1024 px, 1280 px) :

```bash
# Lancer l'audit de conformité mobile
npm run test:mobile
```

Le script vérifie automatiquement :
- L'absence absolue de débordement horizontal (`scrollWidth <= clientWidth`).
- La conformité des cibles tactiles ($\ge 44 \times 44\text{ px}$).
- La taille de police des inputs de formulaire ($\ge 16\text{ px}$).
- La visibilité de l'accroche et du bouton d'action principal au-dessus de la ligne de flottaison sur mobile sans défilement.

---

## 🛠️ Stack technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Tests** : [Playwright](https://playwright.dev/)
- **Base de données & Auth** : Supabase
- **Paiement** : Mobile Money (Orange Money, Moov Money)
