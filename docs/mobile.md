# Guide Mobile-First — Mémoire Vive

Ce guide regroupe les standards d'ergonomie et d'adaptabilité mobile pour le projet **Mémoire Vive**. Il sert de référence pour toutes les contributions ultérieures afin d'éviter toute régression sur mobile.

---

## 1. Les 8 principes fondamentaux

1. **Mobile-first par défaut** :
   - Écrire d'abord le style pour mobile (360 px de large).
   - Les écrans plus larges ne font qu'**ajouter** de l'espace et des colonnes via les préfixes Tailwind `sm:`, `md:`, `lg:`, `xl:`.
   - Interdiction formelle d'écrire du style desktop par défaut écrasé ensuite par des règles `max-width`.

2. **Une seule colonne par défaut** :
   - Les grilles et rangées passent à 2 ou 3 colonnes **uniquement** à partir de `md:` (768 px).
   - Exemple : `grid grid-cols-1 md:grid-cols-3`.

3. **Zéro dimension fixe en pixels pour conteneurs et textes** :
   - Préférer `w-full`, `max-w-*`, `min-w-0` (indispensable sur les enfants flex pour permettre au texte de revenir à la ligne sans forcer la largeur du parent).
   - Utiliser `rem`, `%`, `aspect-*` et `clamp()`.

4. **Hauteurs dynamiques d'écran** :
   - Utiliser `100dvh` ou `100svh` à la place de `100vh` (avec repli CSS).
   - Empêche les sauts d'affichage quand la barre d'adresse du navigateur mobile s'ouvre ou se rétracte.

5. **Zones sûres (Safe Areas)** :
   - Les barres ou conteneurs fixés en haut ou en bas (`fixed`, `sticky`) doivent toujours intégrer `env(safe-area-inset-top)` et `env(safe-area-inset-bottom)`.
   - Utiliser les classes utilitaires `pb-safe` et `pt-safe`.

6. **Gestion des textes et retours à la ligne** :
   - Tout texte doit pouvoir passer à la ligne (`overflow-wrap: anywhere`).
   - `truncate` / `text-overflow: ellipsis` est **interdit** sur les contenus importants (titres, prix, messages, adresses).
   - Appliquer `text-wrap: balance` sur les titres H1 et H2.

7. **Zoom utilisateur non bloqué** :
   - Ne jamais définir `user-scalable=no` ou `maximum-scale=1` dans la balise meta viewport.

8. **Survols tactiles sécurisés** :
   - Envelopper les effets de survol (`hover:`) dans `@media (hover: hover)` pour éviter les effets persistants après toucher sur mobile.

---

## 2. Échelle typographique fluide

| Rôle | Token | Valeur fluide | Interlignage |
|---|---|---|---|
| Titre du hero (H1) | `text-hero` | `clamp(3.25rem, 13vw, 7rem)` | 1.08 |
| Titre de section (H2) | `text-section` | `clamp(1.5rem, 5.2vw, 2.5rem)` | 1.2 |
| Sous-titre de carte (H3) | `text-card` | `clamp(1.25rem, 4.2vw, 1.75rem)` | 1.25 |
| Prix | `text-price` | `clamp(1.75rem, 6vw, 2.5rem)` (font-variant-numeric: tabular-nums) | 1.1 |
| Texte courant | `text-base` | `1rem` (16 px) minimum | 1.6 |
| Texte secondaire | `text-sm` | `0.875rem` (14 px) minimum | 1.5 |
| Légendes & mentions | `text-xs` | `0.75rem` (12 px) minimum | 1.4 |
| Texte des boutons | `text-base` | `1rem`, graisse 600 | 1.2 |

---

## 3. Cibles tactiles & formulaires

- **Cibles tactiles** : Minimum 44 × 44 px pour tout élément cliquable (liens, boutons, pastilles de filtre, cases à cocher, onglets).
- **Boutons principaux** : Hauteur minimum de 48 px.
- **Espacement tactile** : Minimum 8 px entre deux cibles adjacentes.
- **Formulaires mobiles** :
  - `font-size: 16px` obligatoire sur tous les inputs pour empêcher le zoom Safari iOS.
  - Hauteur des inputs : au moins 48 px (`h-12`).
  - Utilisation des attributs natifs : `type="tel"`, `inputMode="tel"`, `enterKeyHint="next"|"done"`, `autoComplete`.

---

## 4. Validation automatique

Pour tester l'absence de régression :
```bash
npm run test:mobile
```
Tous les tests doivent passer (défilement horizontal = 0, tailles de police valides, cibles tactiles conformes, hero visible au-dessus de la ligne de flottaison sur 360 px et 390 px).
