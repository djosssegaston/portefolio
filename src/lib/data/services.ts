import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "web-fullstack",
    title: "Développement web full-stack",
    description:
      "Sites et applications web sur mesure, du frontend au backend, avec une attention particulière à la qualité du code et à l'utilité réelle des fonctionnalités.",
    longDescription:
      "Je conçois et développe des sites et applications web adaptés à un besoin concret. Mon travail couvre la conception de la base de données, le développement backend avec PHP/Laravel, le développement frontend avec React et JavaScript, la conception d'API REST, le déploiement et la maintenance.",
    icon: "Globe",
    features: [
      "Sites vitrines et plateformes web",
      "Développement frontend avec React et JavaScript",
      "Développement backend avec PHP et Laravel",
      "Conception de bases de données MySQL et PostgreSQL",
      "Déploiement sur serveur et maintenance",
    ],
  },
  {
    id: "plateformes-metier",
    title: "Plateformes métier et gestion",
    description:
      "Outils de gestion adaptés aux activités réelles : candidats, votes, stocks, ventes, caisses, paiements et rapports.",
    longDescription:
      "Je développe des plateformes qui répondent à des besoins métier précis. Les projets Miss & Mister University Bénin et Miss Kétou m'ont permis de travailler sur la gestion des candidats et des votes, tandis qu'ELISPOS porte sur la gestion des produits, des stocks, des ventes et des caisses.",
    icon: "LayoutDashboard",
    features: [
      "Gestion des candidats et des votes",
      "Gestion des produits, stocks et ventes",
      "Gestion des caisses et des paiements",
      "Interfaces d'administration",
      "Gestion des rôles et des accès",
    ],
  },
  {
    id: "api-integrations",
    title: "API REST et intégrations",
    description:
      "Conception et développement d'API REST, authentification, gestion des rôles, webhooks et intégration de services tiers.",
    longDescription:
      "Je conçois des API REST structurées pour connecter une interface à un backend ou à des services externes. J'utilise Laravel Sanctum pour l'authentification, je gère les rôles et permissions, les webhooks et les échanges avec des services tiers.",
    icon: "Webhook",
    features: [
      "Conception et développement d'API REST",
      "Authentification avec Laravel Sanctum",
      "Gestion des rôles et permissions",
      "Gestion des webhooks",
      "Intégration d'API tierces",
    ],
  },
  {
    id: "paiement-en-ligne",
    title: "Intégration de paiement en ligne",
    description:
      "Mise en place de paiements en ligne avec FedaPay, gestion des transactions et des webhooks de confirmation.",
    longDescription:
      "J'intègre des solutions de paiement en ligne dans les plateformes web, notamment FedaPay. Le travail comprend le branchement du prestataire, la gestion des transactions, les webhooks de confirmation et les vérifications côté serveur.",
    icon: "CreditCard",
    features: [
      "Intégration de FedaPay",
      "Gestion des transactions",
      "Gestion des webhooks de confirmation",
      "Vérification côté serveur",
    ],
  },
  {
    id: "deploiement-maintenance",
    title: "Déploiement et maintenance",
    description:
      "Mise en production, correction des anomalies, évolution des fonctionnalités et suivi technique des applications.",
    longDescription:
      "Je prends en charge la mise en production sur serveur, la configuration de l'environnement, les corrections d'anomalies et les évolutions fonctionnelles. Je travaille avec Git, GitHub, Linux et Docker lorsque le projet le nécessite.",
    icon: "Wrench",
    features: [
      "Déploiement sur serveur",
      "Correction d'anomalies",
      "Évolution des fonctionnalités",
      "Utilisation de Git, GitHub et Linux",
      "Conteneurisation avec Docker lorsque nécessaire",
    ],
  },
  {
    id: "accompagnement-technique",
    title: "Accompagnement technique",
    description:
      "Analyse du besoin, choix des technologies, débogage et automatisation de certaines tâches avec des outils d'IA.",
    longDescription:
      "Je peux aider à clarifier un besoin, comparer des choix techniques, débloquer un problème de développement ou automatiser certaines tâches répétitives. Mon usage de l'IA reste un usage d'assistance au développement : je ne me présente pas comme spécialiste du Machine Learning.",
    icon: "Lightbulb",
    features: [
      "Analyse du besoin et des contraintes",
      "Choix des technologies",
      "Assistance au débogage",
      "Automatisation de tâches répétitives",
      "Conseil sur la structure d'une application",
    ],
  },
];
