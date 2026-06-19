import { FAQ } from "@/types";

export const faq: FAQ[] = [
  {
    id: "faq-01",
    question: "Quels types de projets développez-vous ?",
    answer:
      "Je développe principalement des applications web modernes : sites vitrine, plateformes e-commerce, SaaS, dashboards analytiques, applications mobiles cross-platform et APIs RESTful. Je travaille aussi bien avec des startups qu'avec des entreprises établies. Mon expertise couvre toute la stack : front-end (React, Next.js), back-end (Laravel, Node.js) et infrastructure cloud (AWS, Docker).",
    category: "Général",
    order: 1,
  },
  {
    id: "faq-02",
    question: "Quel est le processus de collaboration ?",
    answer:
      "Mon processus suit généralement 5 étapes : 1) Audit et analyse des besoins lors d'un appel découverte gratuit, 2) Proposition technique et devis détaillé, 3) Conception et validation des maquettes, 4) Développement itératif avec démo hebdomadaire, 5) Livraison, déploiement et formation. Je privilégie la méthodologie agile avec des sprints de 2 semaines pour une transparence totale.",
    category: "Prestations",
    order: 2,
  },
  {
    id: "faq-03",
    question: "Quels sont vos délais de livraison typiques ?",
    answer:
      "Les délais varient selon la complexité du projet : un site vitrine simple peut être livré en 2 à 4 semaines, une plateforme e-commerce en 6 à 12 semaines, et un SaaS complet en 3 à 6 mois. Je fournis toujours un calendrier détaillé dans la proposition initiale avec des jalons clairs. Je respecte scrupuleusement les délais convenus, avec une communication proactive en cas d'imprévu.",
    category: "Général",
    order: 3,
  },
  {
    id: "faq-04",
    question: "Comment gérez-vous le paiement pour les clients basés en Afrique ?",
    answer:
      "J'accepte les paiements en Francs CFA (XOF) via Orange Money, MTN Mobile Money et Wave, ainsi que les virements bancaires classiques. Pour les clients internationaux, je propose PayPal, Stripe et virement SWIFT. Le paiement s'effectue généralement en 3 tranches : 30% à la signature, 40% à la validation de la maquette, et 30% à la livraison finale.",
    category: "Business",
    order: 4,
  },
  {
    id: "faq-05",
    question: "Proposez-vous un hébergement et une maintenance après livraison ?",
    answer:
      "Oui, j'offre des formules de maintenance et d'hébergement adaptées à chaque client. La formule de base inclut : hébergement sécurisé (serveurs France ou Afrique selon votre choix), sauvegardes quotidiennes, mises à jour de sécurité, monitoring 24/7 et support technique par email/Slack. Des formules premium avec maintenance évolutive (ajout de fonctionnalités) sont également disponibles.",
    category: "Prestations",
    order: 5,
  },
  {
    id: "faq-06",
    question: "Quelles technologies utilisez-vous pour le développement mobile ?",
    answer:
      "Pour le développement mobile, j'utilise principalement React Native et Flutter pour des applications cross-platform performantes. Ces frameworks permettent de développer simultanément pour iOS et Android avec une seule codebase, réduisant les coûts et les délais. Pour des besoins spécifiques (réalité augmentée, IoT), je peux également développer des applications natives en Swift ou Kotlin.",
    category: "Technique",
    order: 6,
  },
  {
    id: "faq-07",
    question: "Comment assurez-vous la qualité et la sécurité de vos livrables ?",
    answer:
      "La qualité est une priorité absolue. Chaque projet suit un processus rigoureux : tests unitaires et d'intégration automatisés (couverture > 80%), revue de code systématique, tests de performance avec Lighthouse et K6, et audits de sécurité (OWASP Top 10). J'utilise SonarQube pour l'analyse continue de la qualité du code. Tous les projets incluent une documentation technique complète.",
    category: "Technique",
    order: 7,
  },
  {
    id: "faq-08",
    question: "Acceptez-vous les missions en télétravail ?",
    answer:
      "Absolument. Je travaille principalement à distance depuis le Bénin et je suis habitué à collaborer avec des équipes internationales. J'utilise des outils comme Slack, Notion, Jira et Figma pour une communication fluide. Je peux également me déplacer ponctuellement pour des réunions importantes (ateliers de lancement, séminaires), sous réserve de frais de déplacement.",
    category: "Général",
    order: 8,
  },
  {
    id: "faq-09",
    question: "Pouvez-vous reprendre un projet existant déjà développé par quelqu'un d'autre ?",
    answer:
      "Oui, c'est une situation courante. Je commence par un audit complet du code existant : analyse de l'architecture, qualité du code, dette technique, vulnérabilités de sécurité et performances. Je fournis ensuite un rapport détaillé avec des recommandations et un plan d'action. La reprise de projet est souvent plus rapide qu'un développement complet car une partie de la logique métier est déjà définie.",
    category: "Prestations",
    order: 9,
  },
  {
    id: "faq-10",
    question: "Qu'est-ce qui vous différencie des autres développeurs freelance ?",
    answer:
      "Mon approche combine expertise technique pointue et compréhension des réalités du marché africain. Je ne me contente pas de coder : je conçois des solutions adaptées aux contraintes locales (connexion intermittente, paiement mobile, réglementations spécifiques). Avec une expérience à la fois en startup (CTO), en agence et en freelance, j'apporte une vision stratégique qui va au-delà du simple développement technique.",
    category: "Business",
    order: 10,
  },
];
