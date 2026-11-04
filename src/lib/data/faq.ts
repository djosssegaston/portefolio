import { FAQ } from "@/types";

export const faq: FAQ[] = [
  {
    id: "faq-01",
    question: "Quels types de projets développez-vous ?",
    answer:
      "Je développe principalement des sites web, des applications web et des plateformes métier : gestion de candidats et de votes, gestion de stocks et de ventes, interfaces d'administration, API REST et intégration de paiement en ligne.",
    category: "Général",
    order: 1,
  },
  {
    id: "faq-02",
    question: "Quelles technologies utilisez-vous ?",
    answer:
      "Je travaille notamment avec PHP, Laravel, React, JavaScript, MySQL, PostgreSQL, Git, GitHub, Linux et Docker. J'utilise aussi Bootstrap et j'intègre des services de paiement comme FedaPay.",
    category: "Technique",
    order: 2,
  },
  {
    id: "faq-03",
    question: "Travaillez-vous à distance ?",
    answer:
      "Oui. Je suis basé à Porto-Novo, au Bénin, et je travaille à distance. Les échanges peuvent se faire par email, WhatsApp ou visioconférence selon les besoins du projet.",
    category: "Général",
    order: 3,
  },
  {
    id: "faq-04",
    question: "Pouvez-vous reprendre un projet existant ?",
    answer:
      "Oui, après un premier échange et une lecture du code existant. Il est important de comprendre l'architecture, les fonctionnalités déjà en place et les problèmes rencontrés avant de proposer une suite.",
    category: "Prestations",
    order: 4,
  },
  {
    id: "faq-05",
    question: "Proposez-vous la maintenance après livraison ?",
    answer:
      "Oui. La maintenance peut couvrir les corrections d'anomalies, les mises à jour de sécurité, les évolutions fonctionnelles et le suivi du déploiement, selon les besoins du projet.",
    category: "Prestations",
    order: 5,
  },
  {
    id: "faq-06",
    question: "Intégrez-vous les paiements en ligne ?",
    answer:
      "Oui, j'ai travaillé sur l'intégration de FedaPay, notamment pour les plateformes Miss & Mister University Bénin et Miss Kétou. Cela comprend les transactions et la gestion des webhooks de confirmation.",
    category: "Technique",
    order: 6,
  },
  {
    id: "faq-07",
    question: "Comment est fixé le tarif d'un projet ?",
    answer:
      "Le tarif dépend du périmètre, des fonctionnalités attendues et du temps nécessaire. Je préfère échanger sur le besoin avant de proposer une estimation ou un devis.",
    category: "Business",
    order: 7,
  },
  {
    id: "faq-08",
    question: "Utilisez-vous l'intelligence artificielle dans votre travail ?",
    answer:
      "Oui, comme outil d'assistance pour certaines tâches : automatisation, débogage, analyse de code et amélioration des workflows. Je ne me présente pas comme ingénieur en intelligence artificielle ni comme spécialiste du Machine Learning.",
    category: "Technique",
    order: 8,
  },
];
