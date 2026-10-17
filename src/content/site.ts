// =========================================================================
// Source unique de vérité pour tous les textes du site Mémoire Vive
// Règle stricte : Tutoiement partout, apostrophes typographiques (’),
// zéro mention d'ancienne activité (restauration, cadre bois, vitre, etc.)
// =========================================================================

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22675864399";

export const SITE_CONTENT = {
  brand: {
    name: "Mémoire Vive",
    tagline: "Tableaux photo personnalisés",
    city: "Ouagadougou",
    phone: "+226 75 86 43 99",
  },

  // 8.1 Bandeau de réassurance
  trustBar: {
    items: [
      "Aperçu gratuit avant paiement",
      "Livraison gratuite à Ouagadougou",
      "0 FCFA d’avance · Zéro risque",
    ],
  },

  // 8.2 En-tête
  header: {
    logoTitle: "Mémoire Vive",
    logoSubtitle: "Tableaux photo personnalisés",
    helpButton: "Aide WhatsApp",
    helpMessage:
      "Bonjour Mémoire Vive, j’aimerais des informations sur les tableaux photo personnalisés",
    ctaButton: "Aperçu gratuit",
    ctaBadge: "0 FCFA",
    menuLinks: [
      { label: "Nos 3 formats", href: "#formats" },
      { label: "Comment ça marche", href: "#comment-ca-marche" },
      { label: "Questions fréquentes", href: "#faq" },
    ],
    mobileCta: "Commander mon tableau (0 FCFA d’avance)",
  },

  // 8.3 Hero
  hero: {
    mobileBadge: "Le cadeau d’anniversaire à Ouagadougou",
    desktopBadge: "Le cadeau d’anniversaire personnalisé à Ouagadougou",
    title: "Transforme ta plus belle photo en cadeau d’anniversaire",
    subtitle:
      "Envoie ta photo et ton message. Reçois l’aperçu gratuit sous 24 h, et ne paie que si ça te plaît.",
    desktopArguments: [
      "Aperçu gratuit avant paiement",
      "Portrait retouché + ton message écrit dessus",
      "Livraison gratuite à Ouagadougou",
      "Orange & Moov Money",
    ],
    ctaButton: "Commander mon tableau",
    mobileReassurance: "Aperçu 100 % gratuit · Zéro franc d’avance",
    desktopReassurance:
      "0 FCFA maintenant · Paiement après validation de l’aperçu",
  },

  // 8.5 Comment ça marche
  howItWorks: {
    badge: "Simple & transparent",
    title: "Comment ça marche ?",
    subtitle:
      "3 étapes. Moins d’une minute pour commander. Zéro franc avant ton accord.",
    steps: [
      {
        number: "1",
        title: "Envoie ta photo et ton message",
        description:
          "Choisis ta photo, ton format et écris ton message. Ça prend moins d’une minute.",
      },
      {
        number: "2",
        title: "Reçois ton aperçu gratuit sous 24 h",
        description:
          "On retouche ton portrait et on écrit ton message dessus. Tu vois le résultat avant de payer.",
      },
      {
        number: "3",
        title: "Valide, paie, reçois ton tableau",
        description:
          "Paie en Mobile Money après validation. Ton tableau est livré gratuitement chez toi sous 24 h.",
      },
    ],
  },

  // 8.6 Formats et prix
  pricing: {
    badge: "Tarifs clairs",
    title: "3 formats. Un prix, livraison comprise.",
    subtitle:
      "Même retouche et même message personnalisé quel que soit le format. Tu ne paies qu’après avoir validé l’aperçu gratuit.",
    paymentNotice: "0 FCFA maintenant · Paiement après aperçu",
    buttonText: "Choisir ce format",
    footerNotice: "Aperçu gratuit · Sans engagement",
  },

  // 8.7 Garantie
  guarantee: {
    badge: "Garantie Zéro Risque",
    title:
      "Tu vois l’aperçu avant de payer. Si ça ne te plaît pas, tu ne paies rien.",
    body: "On retouche d’abord ta photo et on écrit ton message dessus. Tu reçois l’aperçu sous 24 h. Si le résultat ne te convient pas à 100 %, tu ne paies absolument rien. Aucune pression.",
    engagements: [
      "Ajustements gratuits sur l’aperçu",
      "Tableau remplacé s’il arrive abîmé",
    ],
  },

  // 8.8 Témoignages (désactivés, aucun faux avis)
  testimonials: {
    enabled: false,
    badge: "Témoignages",
    title: "Ce qu’en disent nos clients",
    items: [],
  },

  // 8.9 FAQ
  faq: {
    badge: "Questions fréquentes",
    title: "Tout ce que tu dois savoir",
    subtitle: "Des réponses claires pour commander l’esprit tranquille.",
    items: [
      {
        question: "Quelle photo dois-je envoyer ?",
        answer:
          "Une photo nette où l’on voit bien le visage, prise en pleine lumière. Un selfie ou une photo de sortie convient très bien. On s’occupe de la peau, de la lumière et du fond.",
      },
      {
        question: "Comment se fait le paiement ?",
        answer:
          "Aucun paiement à la commande. Tu reçois ton aperçu sous 24 h. Si tu valides, tu paies par Orange Money ou Moov Money. Sinon, tu ne paies rien.",
      },
      {
        question: "Quels sont les délais ?",
        answer:
          "L’aperçu gratuit arrive en moins de 24 h. Après ta validation, ton tableau est fabriqué puis livré gratuitement sous 24 h. Ton cadeau est chez toi en 48 h maximum.",
      },
      {
        question: "Que peut-on écrire sur la photo ?",
        answer:
          "Un prénom, un message d’anniversaire, une date, une phrase douce ou drôle. Tu peux aussi nous laisser te proposer un texte.",
      },
      {
        question: "Et si mon tableau arrive abîmé ?",
        answer:
          "On le remplace immédiatement et gratuitement, sans discussion.",
      },
    ],
    contactBlock: {
      title: "Une autre question ?",
      subtitle: "Notre équipe te répond directement sur WhatsApp.",
      buttonText: "Discuter sur WhatsApp",
      message: "Bonjour, j’ai une question sur les tableaux Mémoire Vive",
    },
  },

  // 8.10 Appel à l’action final
  finalCta: {
    badge: "Offre un anniversaire dont on se souvient",
    title: "Ne cherche plus le cadeau parfait. Envoie ta photo.",
    subtitle:
      "Reçois ton aperçu sous 24 h. C’est 100 % gratuit et sans engagement.",
    buttonText: "Commencer mon tableau gratuit",
    reassurance:
      "0 FCFA d’avance · Paiement Mobile Money uniquement après validation",
  },

  // 8.11 Pied de page et barre mobile
  footer: {
    description:
      "Tableaux photo personnalisés à Ouagadougou. Portrait retouché, message écrit dessus, livré chez toi.",
    navLinks: [
      { label: "Nos 3 formats", href: "/#formats" },
      { label: "Comment ça marche", href: "/#comment-ca-marche" },
      { label: "Questions fréquentes", href: "/#faq" },
      { label: "Conditions Générales", href: "/conditions-generales" },
      { label: "Politique de Confidentialité", href: "/politique-de-confidentialite" },
    ],
    whatsappLabel: "WhatsApp : +226 75 86 43 99",
    paymentNotice:
      "Paiement sécurisé par Orange Money et Moov Money après validation de l’aperçu.",
    copyright: "© 2026 Mémoire Vive. Tous droits réservés.",
    signature: "Fait avec 💜 à Ouagadougou",
  },

  stickyMobileBar: {
    whatsappMessage: "Bonjour Mémoire Vive, j’ai une question",
    buttonText: "Commander mon tableau",
    buttonBadge: "0 FCFA",
  },

  // 8.12 Formulaire de commande
  orderForm: {
    title: "Commande ton tableau",
    notice: "0 FCFA maintenant · Paiement après aperçu",
    photoLabel: "Touche ici pour choisir ta photo",
    photoSub: "Galerie, appareil photo ou fichier",
    photoReady: "Photo prête ! Touche pour la changer",
    formatTitle: "Choisis ton format",
    freeDelivery: "Livraison gratuite",
    messageLabel: "Ton message à écrire sur la photo *",
    messagePlaceholder: "Ex : Joyeux anniversaire Awa, je t’aime fort",
    messageSuggestions: [
      "Joyeux anniversaire Awa, je t’aime fort",
      "Je t’aime",
      "Bon anniversaire mon amour",
      "Joyeux anniversaire ma best",
    ],
    letUsProposeLabel: "Je ne sais pas encore : propose-moi un texte",
    timingTitle: "C’est pour quand ? (optionnel)",
    timingOptions: [
      { id: "cette_semaine", label: "Cette semaine" },
      { id: "ce_mois", label: "Ce mois-ci" },
      { id: "plus_tard", label: "Plus tard" },
    ] as const,
    contact: {
      nameLabel: "Ton nom et prénom *",
      namePlaceholder: "Ex : Aminata Ouedraogo",
      phoneLabel: "Ton numéro WhatsApp pour recevoir l’aperçu *",
      phonePlaceholder: "Ex : +226 70 00 00 00",
      neighborhoodLabel: "Ton quartier à Ouagadougou *",
      neighborhoodPlaceholder: "Ex : Ouaga 2000, Karpala, Dassasgho...",
      landmarkToggle: "Ajouter un repère de livraison (optionnel)",
      landmarkLabel: "Repère de livraison (optionnel)",
      landmarkPlaceholder: "Ex : Face à la pharmacie, 2e von à droite...",
      quickNeighborhoods: [
        "Ouaga 2000",
        "Karpala",
        "Dassasgho",
        "Somgandé",
        "Pissy",
        "Gounghin",
        "Tampouy",
        "Saaba",
        "Koulouba",
        "Zone 1 / Cité An III",
        "Wayalghin",
        "Patte d’Oie",
      ],
    },
    submitButton: "Envoyer ma demande · 0 FCFA",
    submitting: {
      title: "Envoi en cours…",
      message:
        "Ta photo part en toute sécurité. Ne ferme pas cette fenêtre.",
    },
    error: {
      title: "L’envoi a échoué",
      message:
        "Tes informations sont conservées. Vérifie ta connexion internet, puis réessaie.",
      retryButton: "Réessayer",
      reviewButton: "Vérifier mes informations",
    },
    success: {
      badge: "Demande reçue",
      title: "Ta photo est entre de bonnes mains",
      thankYou: (firstName: string) =>
        `Merci ${firstName}. On commence la retouche dès aujourd’hui.`,
      reminder:
        "Tu recevras un message WhatsApp sous 24 h avec ton aperçu gratuit. Tu ne paies en Mobile Money qu’après ton accord final !",
      whatsappButton: "Suivre sur WhatsApp",
      whatsappMessage: (fullName: string) =>
        `Bonjour Mémoire Vive, je viens de commander mon tableau (${fullName})`,
      closeButton: "Fermer et revenir à l’accueil",
    },
  },

  // 8.13 Page d’aperçu client (/apercu/[token])
  publicPreview: {
    openGraph: {
      title: (clientNom: string) =>
        `${clientNom}, ton aperçu Mémoire Vive est prêt 💜`,
      description: (format: string) =>
        `Découvre le résultat de ton tableau ${format}. Tu ne paies que si ça te plaît.`,
    },
    pending: {
      badge: "Retouche en cours",
      title: "Ton aperçu est en cours de préparation",
      message: (clientNom: string, format: string) =>
        `Bonjour ${clientNom} ! On retouche ta photo avec soin pour ton tableau ${format}.`,
      notice:
        "Tu recevras une notification WhatsApp dès que ton aperçu sera prêt. Tu pourras alors le consulter ici en haute définition.",
      whatsappButton: "Nous écrire sur WhatsApp",
    },
    ready: {
      badge: "Aperçu gratuit",
      title: (clientNom: string) => `${clientNom}, ton tableau est prêt`,
      subtitle: "Découvre la retouche et ton message.",
      photoBadge: "Haute définition",
      customTextLabel: (text: string) =>
        `Texte écrit sur ton tableau : « ${text} »`,
      spellingCheckNotice: "Vérifie bien l’orthographe avant de valider.",
      guaranteeNotice:
        "Zéro risque : si le résultat te plaît, on lance l’impression et la livraison. Sinon, tu ne paies absolument rien.",
      validateButton: "🎉 Ça me plaît, je valide !",
      validateMessage: (clientNom: string, format: string) =>
        `Bonjour, je valide l’aperçu de ma commande (${clientNom} · ${format}). Comment je procède pour le paiement ?`,
      adjustButton: "Pas encore tout à fait ça ? Parlons-en",
      adjustMessage: (clientNom: string) =>
        `Bonjour, l’aperçu de ma commande (${clientNom}) ne me convient pas encore, on peut en discuter ?`,
    },
    notFound: {
      title: "Lien d’aperçu introuvable",
      message:
        "Ce lien est invalide ou a expiré. Si tu viens de commander, vérifie le lien reçu par message.",
      whatsappButton: "Contacter l’équipe sur WhatsApp",
      homeButton: "Retourner à l’accueil",
    },
  },
} as const;
