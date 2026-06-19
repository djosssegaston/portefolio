import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "proj-01",
    title: "GestionPro - SaaS de gestion d'entreprise",
    slug: "gestionpro-saas",
    description:
      "Plateforme SaaS complète pour la gestion des ressources humaines, de la paie et des absences, destinée aux PME africaines.",
    longDescription:
      "GestionPro est une solution SaaS tout-en-un développée pour simplifier la gestion administrative des PME en Afrique. L'application permet de gérer les employés, les contrats, les congés, les notes de frais et la paie. Elle intègre également un module de reporting avancé avec des tableaux de bord personnalisables. Développée avec Next.js et une API Laravel, la plateforme sert aujourd'hui plus de 200 entreprises à travers le Bénin, le Sénégal et la Côte d'Ivoire.",
    problem:
      "Les PME africaines utilisent encore des processus manuels et des fichiers Excel pour la gestion RH, entraînant des erreurs et une perte de temps considérable. Les solutions existantes sont soit trop chères, soit non adaptées au contexte local (déclarations fiscales CNSS, congés légaux, etc.).",
    solution:
      "Développement d'une plateforme SaaS modulaire, abordable et adaptée aux spécificités du marché africain. L'application automatise les processus RH, génère les déclarations fiscales conformes à la réglementation locale et offre une interface intuitive en français.",
    keyFeatures: [
      "Gestion complète des employés et des contrats",
      "Module de paie avec calcul automatique des charges sociales",
      "Gestion des congés, absences et notes de frais",
      "Tableaux de bord interactifs avec export PDF/Excel",
      "Notifications email et SMS automatisées",
      "API RESTful pour intégrations tierces",
    ],
    results: [
      "200+ entreprises clientes en Afrique de l'Ouest",
      "+ de 5 000 employés gérés via la plateforme",
      "Réduction de 70% du temps de traitement de la paie",
      "Note moyenne de 4.7/5 sur les avis clients",
    ],
    challenges: [
      "Adaptation aux différentes législations sociales des pays cibles",
      "Maintien de la performance avec des connexions internet parfois instables",
      "Gestion de la sécurité des données sensibles des employés",
    ],
    technologies: [
      "Next.js",
      "Laravel",
      "PostgreSQL",
      "Tailwind CSS",
      "Docker",
    ],
    category: "saas",
    image: "/images/projects/project-1.jpg",
    gallery: [
      "/images/projects/project-1.jpg",
      "/images/projects/project-1-2.jpg",
      "/images/projects/project-1-3.jpg",
    ],
    githubUrl: "https://github.com/username/gestionpro",
    demoUrl: "https://gestionpro.example.com",
    featured: true,
    date: "2024-03-15",
    status: "published",
  },
  {
    id: "proj-02",
    title: "MarchéExpress - E-commerce multi-vendeurs",
    slug: "marche-express",
    description:
      "Place de marché e-commerce connectant des vendeurs locaux aux acheteurs, avec livraison à domicile et paiement mobile.",
    longDescription:
      "MarchéExpress est une plateforme e-commerce innovante qui permet aux commerçants locaux de vendre leurs produits en ligne. La solution intègre un système de paiement via Orange Money et MTN Mobile Money, une gestion intelligente des livraisons et un tableau de bord vendeur complet. Le projet a été réalisé pour une startup béninoise souhaitant digitaliser le commerce de proximité.",
    problem:
      "Les petits commerçants locaux n'ont pas accès aux grandes plateformes e-commerce et peinent à digitaliser leurs ventes. Les consommateurs cherchent des produits locaux sans avoir de plateforme centralisée. Les paiements en ligne restent un frein majeur dans la région.",
    solution:
      "Création d'une marketplace intuitive avec onboarding simplifié pour les vendeurs, intégration des moyens de paiement mobile les plus utilisés en Afrique, et système de livraison optimisé par zones géographiques.",
    keyFeatures: [
      "Inscription vendeur simplifiée avec validation automatique",
      "Paiement mobile (Orange Money, MTN Mobile Money, Wave)",
      "Gestion des commandes et du suivi de livraison en temps réel",
      "Chat intégré acheteur-vendeur",
      "Système de notation et d'avis vérifiés",
      "Tableau de bord vendeur avec analytics",
    ],
    results: [
      "1 500+ vendeurs inscrits en 6 mois",
      "+ de 50 000 commandes traitées",
      "Taux de satisfaction acheteur de 92%",
      "Croissance mensuelle de 25% du volume de transactions",
    ],
    challenges: [
      "Intégration complexe des APIs de paiement mobile",
      "Logistique de livraison dans les zones rurales",
      "Modération des produits et lutte contre les contrefaçons",
    ],
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Stripe",
      "Redis",
    ],
    category: "ecommerce",
    image: "/images/projects/project-2.jpg",
    gallery: [
      "/images/projects/project-2.jpg",
      "/images/projects/project-2-2.jpg",
    ],
    githubUrl: "https://github.com/username/marche-express",
    demoUrl: "https://marcheexpress.example.com",
    featured: true,
    date: "2024-01-20",
    status: "published",
  },
  {
    id: "proj-03",
    title: "HealthTrack - Application de suivi médical",
    slug: "healthtrack",
    description:
      "Application mobile de suivi des rendez-vous médicaux et de gestion des dossiers patients pour les cliniques.",
    longDescription:
      "HealthTrack est une application mobile cross-platform développée avec React Native qui permet aux cliniques et cabinets médicaux de gérer les rendez-vous, les dossiers patients et les prescriptions. L'application offre également un portail patient pour la prise de rendez-vous en ligne et le suivi des traitements. Un module de téléconsultation a été intégré en réponse à la demande croissante de soins à distance.",
    problem:
      "Les cliniques africaines gèrent encore les dossiers patients sur papier, entraînant des pertes de documents et des erreurs médicales. Les patients ont du mal à suivre leurs rendez-vous et traitements.",
    solution:
      "Développement d'une application mobile intuitive avec synchronisation cloud, permettant aux professionnels de santé de digitaliser leurs processus et aux patients d'accéder à leurs informations médicales en temps réel.",
    keyFeatures: [
      "Prise de rendez-vous en ligne avec rappels automatiques",
      "Dossier médical numérique sécurisé",
      "Prescriptions électroniques et gestion des médicaments",
      "Module de téléconsultation intégré",
      "Tableau de bord statistiques pour les cliniques",
      "Export des données au format PDF et HL7",
    ],
    results: [
      "25 cliniques partenaires au Bénin et au Togo",
      "15 000+ patients enregistrés",
      "Réduction de 60% des rendez-vous manqués",
      "Certification de conformité aux normes sanitaires",
    ],
    challenges: [
      "Conformité aux réglementations sur les données médicales",
      "Synchronisation des données en mode hors-ligne",
      "Formation des professionnels de santé peu familiers du numérique",
    ],
    technologies: [
      "React Native",
      "TypeScript",
      "Firebase",
      "Node.js",
      "Express",
    ],
    category: "mobile",
    image: "/images/projects/project-3.jpg",
    gallery: [
      "/images/projects/project-3.jpg",
      "/images/projects/project-3-2.jpg",
    ],
    demoUrl: "https://healthtrack.example.com",
    featured: true,
    date: "2023-09-10",
    status: "published",
  },
  {
    id: "proj-04",
    title: "DataViz Pro - Dashboard analytique",
    slug: "dataviz-pro",
    description:
      "Tableau de bord interactif pour la visualisation de données financières avec graphiques dynamiques et export multi-format.",
    longDescription:
      "DataViz Pro est une application web de business intelligence qui transforme des données brutes en visualisations interactives. Le projet a été développé pour une société de conseil financier qui avait besoin d'un outil sur mesure pour analyser les performances de portefeuilles d'investissement. L'application supporte l'import de données CSV/Excel et se connecte à diverses sources API.",
    problem:
      "Les analystes financiers passaient des heures à créer des rapports Excel manuellement. Les outils BI existants (Power BI, Tableau) étaient trop coûteux et complexes pour l'équipe de 15 personnes.",
    solution:
      "Création d'un dashboard sur mesure avec drag-and-drop, filtres avancés et export automatisé des rapports. L'interface a été conçue pour être utilisable sans formation préalable.",
    keyFeatures: [
      "Import de données depuis CSV, Excel, et APIs REST",
      "Graphiques interactifs (barres, lignes, camemberts, heatmaps)",
      "Filtres croisés et drill-down sur les données",
      "Export des rapports en PDF, PNG et Excel",
      "Sauvegarde de dashboards personnalisés",
      "Actualisation automatique des données en temps réel",
    ],
    results: [
      "80% de temps gagné sur la création de rapports",
      "Adoption par 100% de l'équipe d'analystes",
      "3 nouveaux clients acquis grâce à l'outil",
      "ROI positif dès le 3e mois d'utilisation",
    ],
    challenges: [
      "Optimisation des performances avec de grands volumes de données",
      "Gestion des formats de dates et devises internationaux",
      "Sécurisation de l'accès aux données financières sensibles",
    ],
    technologies: [
      "React",
      "D3.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    category: "dashboard",
    image: "/images/projects/project-4.jpg",
    gallery: [
      "/images/projects/project-4.jpg",
      "/images/projects/project-4-2.jpg",
    ],
    githubUrl: "https://github.com/username/dataviz-pro",
    featured: false,
    date: "2023-06-01",
    status: "published",
  },
  {
    id: "proj-05",
    title: "API Connect - Passerelle de paiement unifiée",
    slug: "api-connect",
    description:
      "API middleware unifiant plusieurs passerelles de paiement mobile et bancaire pour les développeurs africains.",
    longDescription:
      "API Connect est une solution middleware qui expose une API unique et standardisée pour intégrer plusieurs moyens de paiement africains (Orange Money, MTN Mobile Money, Moov Money, Wave, cartes bancaires). Le projet répond au besoin criant des développeurs qui doivent gérer des intégrations multiples et complexes pour chaque fournisseur de paiement.",
    problem:
      "Chaque fournisseur de paiement mobile en Afrique a sa propre API avec des formats de données, des protocoles de sécurité et des processus de vérification différents. Les développeurs perdent des semaines à intégrer chaque moyen de paiement séparément.",
    solution:
      "Conception d'une API RESTful unifiée avec une documentation claire, des SDK en JavaScript/PHP/Python, et un tableau de bord de suivi des transactions en temps réel.",
    keyFeatures: [
      "API unique pour 6 fournisseurs de paiement africains",
      "Webhooks pour notifications de statut en temps réel",
      "SDK clients pour JavaScript, PHP, Python et Flutter",
      "Dashboard de monitoring des transactions",
      "Système de retry automatique et fallback",
      "Journalisation complète des requêtes pour debug",
    ],
    results: [
      "500+ développeurs utilisent l'API",
      "+ de 1 million de transactions traitées",
      "Documentation technique notée 4.8/5",
      "Intégration réduite de 3 semaines à 2 jours",
    ],
    challenges: [
      "Maintien de la compatibilité lors des mises à jour des APIs partenaires",
      "Gestion des timeouts et des échecs de transactions",
      "Conformité PCI-DSS et sécurité des données bancaires",
    ],
    technologies: [
      "Node.js",
      "Express",
      "Redis",
      "Docker",
      "Stripe",
    ],
    category: "api",
    image: "/images/projects/project-5.jpg",
    gallery: [
      "/images/projects/project-5.jpg",
    ],
    githubUrl: "https://github.com/username/api-connect",
    demoUrl: "https://apiconnect.example.com",
    featured: true,
    date: "2023-03-22",
    status: "published",
  },
  {
    id: "proj-06",
    title: "EduLearn - Plateforme de formation en ligne",
    slug: "edulearn",
    description:
      "LMS (Learning Management System) complet avec cours interactifs, quiz et certifications pour le marché francophone.",
    longDescription:
      "EduLearn est une plateforme de learning management system développée pour une école de commerce africaine. Elle permet de créer et diffuser des cours en ligne avec du contenu interactif (vidéos, quiz, exercices pratiques), de suivre la progression des apprenants et de délivrer des certifications automatiques. La plateforme gère également la facturation et les inscriptions.",
    problem:
      "L'école souhaitait digitaliser ses formations pour toucher un public plus large, mais les solutions LMS existantes étaient en anglais, difficiles à personnaliser et ne géraient pas les paiements en francs CFA.",
    solution:
      "Développement d'un LMS sur mesure en français avec intégration des moyens de paiement locaux, une interface intuitive pour les enseignants et des fonctionnalités de gamification pour les apprenants.",
    keyFeatures: [
      "Création de cours avec éditeur riche et glisser-déposer",
      "Quiz interactifs avec correction automatique",
      "Certificats personnalisés générés automatiquement",
      "Gamification (badges, points, classements)",
      "Paiement en francs CFA via mobile money",
      "Application mobile pour apprendre hors-ligne",
    ],
    results: [
      "3 000+ apprenants inscrits en 9 mois",
      "150 cours publiés par 40 enseignants",
      "Taux de complétion des cours de 78%",
      "Chiffre d'affaires de 45 millions FCFA en première année",
    ],
    challenges: [
      "Hébergement vidéo et gestion de la bande passante",
      "Maintien de l'engagement des apprenants à distance",
      "Adaptation du contenu pour une connexion internet limitée",
    ],
    technologies: [
      "Next.js",
      "Laravel",
      "MySQL",
      "AWS S3",
      "FFmpeg",
    ],
    category: "web",
    image: "/images/projects/project-6.jpg",
    gallery: [
      "/images/projects/project-6.jpg",
      "/images/projects/project-6-2.jpg",
      "/images/projects/project-6-3.jpg",
    ],
    demoUrl: "https://edulearn.example.com",
    featured: true,
    date: "2023-01-10",
    status: "published",
  },
  {
    id: "proj-07",
    title: "AgriTech - Application IoT pour l'agriculture",
    slug: "agritech-iot",
    description:
      "Solution IoT de surveillance des cultures avec capteurs connectés et alertes en temps réel pour les agriculteurs.",
    longDescription:
      "AgriTech est un projet innovant combinant IoT et web pour aider les agriculteurs à optimiser leurs rendements. Des capteurs connectés installés dans les champs mesurent l'humidité du sol, la température et les précipitations. Les données sont transmises à une application web qui fournit des recommandations personnalisées et envoie des alertes en cas de conditions critiques.",
    problem:
      "Les petits agriculteurs africains subissent les aléas climatiques sans outils de prévision. Ils manquent de données pour prendre des décisions éclairées sur l'irrigation, les semis et les récoltes.",
    solution:
      "Déploiement d'un réseau de capteurs low-cost connectés à une plateforme web intuitive qui traduit les données en recommandations actionnables, accessible même sur des smartphones d'entrée de gamme.",
    keyFeatures: [
      "Monitoring en temps réel des parcelles agricoles",
      "Alertes SMS et notifications push personnalisées",
      "Recommandations d'irrigation basées sur l'IA",
      "Historique des données avec visualisations",
      "Mode hors-ligne avec synchronisation différée",
      "Carte interactive des parcelles et des capteurs",
    ],
    results: [
      "200 capteurs déployés dans 3 régions du Bénin",
      "30% d'économie d'eau grâce aux recommandations",
      "+ de 500 agriculteurs formés à l'utilisation",
      "Partenariat avec le ministère de l'Agriculture",
    ],
    challenges: [
      "Durabilité des capteurs dans des conditions climatiques extrêmes",
      "Connectivité réseau limitée dans les zones rurales",
      "Adoption par des agriculteurs peu familiers de la technologie",
    ],
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "MQTT",
      "Python",
    ],
    category: "dashboard",
    image: "/images/projects/project-7.jpg",
    gallery: [
      "/images/projects/project-7.jpg",
      "/images/projects/project-7-2.jpg",
    ],
    featured: false,
    date: "2022-11-05",
    status: "published",
  },
  {
    id: "proj-08",
    title: "CityGuide - Application touristique interactive",
    slug: "cityguide",
    description:
      "Guide touristique augmenté avec itinéraires personnalisés, réalité augmentée et recommandations locales.",
    longDescription:
      "CityGuide est une application mobile qui propose aux touristes des expériences de découverte de villes africaines grâce à la réalité augmentée et à l'intelligence artificielle. L'application génère des itinéraires personnalisés basés sur les goûts de l'utilisateur, propose des informations historiques en RA sur les monuments et recommande des restaurants et activités locales.",
    problem:
      "Le tourisme africain manque d'outils numériques modernes pour enrichir l'expérience des visiteurs. Les guides papier sont obsolètes et les applications existantes ne couvrent pas les villes africaines.",
    solution:
      "Création d'une application mobile innovante utilisant la géolocalisation, la réalité augmentée et l'IA pour offrir une expérience touristique immersive dans les grandes villes africaines.",
    keyFeatures: [
      "Itinéraires personnalisés générés par IA",
      "Réalité augmentée pour la découverte des monuments",
      "Recommandations de restaurants et activités locales",
      "Cartographie interactive hors-ligne",
      "Avis et photos des voyageurs",
      "Traduction instantanée des menus et panneaux",
    ],
    results: [
      "50 000+ téléchargements sur le Play Store",
      "Couverture de 12 villes africaines",
      "4.4/5 de note moyenne sur les stores",
      "Recommandée par l'office du tourisme de 3 pays",
    ],
    challenges: [
      "Collecte et validation des données touristiques locales",
      "Performance de la réalité augmentée sur des smartphones d'entrée de gamme",
      "Modération des avis et contenu utilisateur",
    ],
    technologies: [
      "Flutter",
      "Firebase",
      "Google Maps API",
      "TensorFlow Lite",
      "ARKit",
    ],
    category: "mobile",
    image: "/images/projects/project-8.jpg",
    gallery: [
      "/images/projects/project-8.jpg",
    ],
    demoUrl: "https://cityguide.example.com",
    featured: false,
    date: "2022-07-18",
    status: "published",
  },
  {
    id: "proj-09",
    title: "CryptoVault - Portefeuille de cryptomonnaies",
    slug: "cryptovault",
    description:
      "Application web de gestion de portefeuille crypto avec suivi en temps réel des marchés et alertes de prix.",
    longDescription:
      "CryptoVault est une application web complète pour le suivi et la gestion de portefeuilles de cryptomonnaies. Elle agrège les données de plusieurs exchanges (Binance, Kucoin, Coinbase), affiche les tendances du marché en temps réel et envoie des alertes personnalisées sur les variations de prix. Le projet était destiné à une communauté de traders africains.",
    problem:
      "Les traders de cryptomonnaies en Afrique utilisent plusieurs exchanges et peinent à avoir une vue d'ensemble de leur portefeuille. Les outils existants sont en anglais et ne supportent pas les exchanges locaux.",
    solution:
      "Développement d'une plateforme multidevises avec API aggregator, graphiques techniques avancés et alertes configurales, le tout dans une interface en français adaptée aux traders africains.",
    keyFeatures: [
      "Agrégation multi-exchanges en temps réel",
      "Graphiques avec indicateurs techniques (RSI, MACD, Bollinger)",
      "Alertes de prix par email, SMS et Telegram",
      "Historique des transactions et P&L",
      "Mode simulation pour tester des stratégies",
      "Portefeuille multi-devises avec conversion automatique",
    ],
    results: [
      "10 000 utilisateurs enregistrés",
      "Intégration de 8 exchanges majeurs",
      "Temps réel avec latence inférieure à 100ms",
      "Communauté Telegram active de 2 000 membres",
    ],
    challenges: [
      "Gestion des WebSockets pour les données en temps réel",
      "Sécurisation des clés API des utilisateurs",
      "Volatilité extrême des marchés et gestion du cache",
    ],
    technologies: [
      "Next.js",
      "Socket.io",
      "Redis",
      "Chart.js",
      "Node.js",
    ],
    category: "dashboard",
    image: "/images/projects/project-9.jpg",
    gallery: [
      "/images/projects/project-9.jpg",
    ],
    githubUrl: "https://github.com/username/cryptovault",
    featured: false,
    date: "2022-04-02",
    status: "archived",
  },
  {
    id: "proj-10",
    title: "AssurPro - Plateforme de gestion d'assurances",
    slug: "assurpro",
    description:
      "Système de gestion des polices d'assurance, sinistres et courtage pour une compagnie d'assurance africaine.",
    longDescription:
      "AssurPro est une plateforme complète de gestion des opérations d'assurance développée pour une compagnie panafricaine. Le système couvre la gestion des polices, le suivi des sinistres, la relation client et les rapports réglementaires. L'application a été développée en Laravel avec une architecture modulaire permettant de configurer les règles métier par pays.",
    problem:
      "La compagnie utilisait un système legacy développé dans les années 2000, lent, non sécurisé et impossible à faire évoluer. La gestion des sinistres était entièrement papier avec des délais de traitement de plusieurs semaines.",
    solution:
      "Migration vers une plateforme web moderne avec workflow de gestion des sinistres digitalisé, signatures électroniques et tableaux de bord en temps réel pour les gestionnaires.",
    keyFeatures: [
      "Gestion complète des polices (souscription, avenants, résiliations)",
      "Workflow de gestion des sinistres avec suivi en temps réel",
      "Signature électronique des documents",
      "Génération automatique des rapports réglementaires",
      "Portail client avec déclaration de sinistre en ligne",
      "Module de commission pour les courtiers",
    ],
    results: [
      "15 000 polices gérées sur la plateforme",
      "Réduction de 80% du temps de traitement des sinistres",
      "Zéro perte de documents depuis le déploiement",
      "Reporting réglementaire automatisé pour 5 pays",
    ],
    challenges: [
      "Migration des données de l'ancien système sans perte",
      "Formation de 200 employés à la nouvelle plateforme",
      "Conformité aux réglementations assurances de 5 pays différents",
    ],
    technologies: [
      "Laravel",
      "Vue.js",
      "MySQL",
      "RabbitMQ",
      "AWS",
    ],
    category: "saas",
    image: "/images/projects/project-10.jpg",
    gallery: [
      "/images/projects/project-10.jpg",
      "/images/projects/project-10-2.jpg",
    ],
    featured: false,
    date: "2021-12-15",
    status: "published",
  },
];
