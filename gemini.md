# Mémoire Vive — Document de cadrage du projet

> Ce fichier résume le projet de A à Z. Il peut être copié tel quel dans un fichier `gemini.md` ou `cloud.md` à la racine du projet Antigravity, pour que l'agent IA garde le contexte complet à chaque tâche.

---

## 1. Présentation du projet

**Nom** : Mémoire Vive
**Activité** : Restauration et encadrement de photos personnalisées, avec l'aide de l'IA
**Marché** : Burkina Faso (Ouagadougou en priorité)
**Positionnement** : Un service pour préserver et offrir des souvenirs précieux — portraits de famille, cadeaux personnalisés, occasions spéciales. (Le positionnement n'est **pas** limité au deuil / proches disparus — c'est un service de mémoire et de cadeau au sens large.)

**Promesse commerciale clé** : Le client voit un aperçu gratuit de sa photo restaurée avant tout paiement. S'il n'est pas satisfait, il ne paie rien.

---

## 2. L'offre — 3 forfaits fixes

Pas de configurateur libre (cadre + taille + quantité à choisir séparément). Le client choisit **un seul forfait parmi 3**, pour minimiser la friction de décision (loi de Hick — moins d'options = décision plus rapide, surtout pour un public peu familier du digital).

| Forfait | Prix | Contenu |
|---|---|---|
| **Souvenir** (entrée de gamme) | 10 000 XOF | Restauration numérique basique + cadre simple, format 13x18cm |
| **Mémoire** (best-seller, à mettre en avant visuellement) | 20 000 XOF | Restauration avancée + cadre bois qualité + colorisation noir & blanc + fichier numérique HD envoyé + carte message personnalisée + 20% de réduction sur la prochaine commande |
| **Héritage** (haut de gamme) | 35 000 XOF | Restauration premium + retouches manuelles + cadre haut de gamme (30x40cm) + colorisation + fichier HD + petit tirage 10x15cm offert + carte message + 20% sur la prochaine commande |

**Garantie** : Aperçu gratuit avant paiement. Zéro franc si le résultat ne convient pas. Cadre remplacé gratuitement s'il arrive endommagé.

---

## 3. Parcours client (order flow)

Pas de compte obligatoire — commande possible avec ou sans connexion (checkout invité).

1. **Upload de la photo** (+ note optionnelle sur l'occasion)
2. **Choix du forfait** — 3 cartes visuelles (Souvenir / Mémoire / Héritage), le forfait Mémoire mis en avant comme "Best-seller"
3. **Contact et livraison** — nom, téléphone, adresse/quartier (Ouagadougou en priorité, livraison hors zone avec frais additionnels)
4. **Récapitulatif et envoi de la demande** — la commande est créée, mais **aucun paiement n'a lieu à cette étape**
5. **Traitement en coulisse (admin)** — la retouche est faite, un aperçu est envoyé au client (notification)
6. **Validation et paiement** — le client revient valider l'aperçu, et **paie uniquement à ce moment-là**, en Mobile Money

---

## 4. Statuts d'une commande

À utiliser dans la base de données (table `commandes`) :

- `nouvelle` — commande reçue, en attente de traitement
- `apercu_envoye` — retouche faite, aperçu envoyé au client
- `refusee` — client non satisfait de l'aperçu, aucun paiement
- `validee_payee` — client a validé et payé
- `en_impression` — impression/encadrement en cours
- `livree` — commande livrée au client

---

## 5. Paiement

- **Mobile Money uniquement** pour le lancement : Orange Money + Moov Money
- Le paiement se déclenche **après** validation de l'aperçu par le client (jamais avant)

---

## 6. Direction design

**Palette (3 couleurs principales, saturées et vives)** :

| Couleur | Code hex | Rôle |
|---|---|---|
| Violet vif | `#7C3AED` | Couleur de marque principale — header, boutons CTA, logo |
| Rose / Magenta | `#EC4899` | Accent secondaire — badges, hover, éléments à mettre en avant (ex : "Best-seller") |
| Or / Ambre | `#F59E0B` | Contraste chaud — prix, éléments premium |

**Fond** : blanc ou crème très léger, pour laisser les couleurs saturées ressortir sans fatiguer l'œil.

**Ambiance générale** : sobre mais attirant, vif sans être criard, adapté à un usage majoritairement mobile.

---

## 7. Stack technique

- **Frontend/Backend** : Next.js
- **Base de données + authentification** : Superbase
- **Hébergement / déploiement** : Vercel
- **Éditeur / agent IA** : Antigravity (Gemini pour le design, Claude Code pour la logique backend)
- **Versioning** : GitHub

---

## 8. État d'avancement (à mettre à jour au fil du projet)

- [x] Nom du projet choisi : Mémoire Vive
- [x] Offre définie (3 forfaits)
- [x] Parcours de commande défini
- [x] Palette de couleurs définie
- [ ] Comptes créés (GitHub, Superbase, Vercel, Antigravity)
- [ ] Formulaire de commande construit (étapes 1 à 4, données factices, sans backend)
- [ ] Base de données connectée (Superbase)
- [ ] Authentification / checkout invité implémenté
- [ ] Espace admin (traitement des commandes, upload d'aperçu, changement de statut)
- [ ] Intégration paiement Mobile Money
- [ ] Déploiement en ligne

---

## 9. Prochaine étape immédiate (le "one thing" du moment)

Construire le **formulaire de commande** (étapes 1 à 4 du parcours client ci-dessus), avec des données fictives, sans base de données ni paiement connectés. Utiliser la palette définie en section 6.
