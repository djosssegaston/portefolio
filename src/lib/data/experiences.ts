import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "exp-01",
    company: "TechSolutions Bénin",
    position: "Développeur Full Stack Junior",
    location: "Cotonou, Bénin",
    startDate: "2017-03-01",
    endDate: "2019-01-31",
    current: false,
    description:
      "Première expérience professionnelle dans une PME de services numériques. Participation au développement de sites web et d'applications internes pour des clients locaux.",
    achievements: [
      "Développement de 12 sites web clients avec WordPress et Laravel",
      "Mise en place d'un système de gestion de projet interne réduisant les délais de livraison de 20%",
      "Formation de 3 stagiaires aux bonnes pratiques de développement web",
    ],
  },
  {
    id: "exp-02",
    company: "Digital Africa Agency",
    position: "Développeur Full Stack",
    location: "Abidjan, Côte d'Ivoire",
    startDate: "2019-02-01",
    endDate: "2021-05-31",
    current: false,
    description:
      "Agence digitale panafricaine spécialisée dans la transformation numérique des entreprises. Travail sur des projets d'envergure pour des clients institutionnels et privés.",
    achievements: [
      "Architecture et développement d'une plateforme e-commerce ayant généré 500M FCFA de chiffre d'affaires",
      "Migration de 5 applications legacy vers une architecture moderne React/Laravel",
      "Mise en place d'une CI/CD réduisant les bugs en production de 40%",
    ],
  },
  {
    id: "exp-03",
    company: "WebCorp",
    position: "Lead Développeur Full Stack",
    location: "Paris, France (Télétravail)",
    startDate: "2021-06-01",
    endDate: "2023-02-28",
    current: false,
    description:
      "Startup SaaS en pleine croissance. Responsable de l'équipe technique de 5 développeurs et de l'architecture de la plateforme principale.",
    achievements: [
      "Direction technique d'une équipe de 5 développeurs avec méthodologie agile",
      "Conception et implémentation d'une architecture microservices scalable",
      "Réduction des coûts d'infrastructure de 35% via l'optimisation AWS",
    ],
  },
  {
    id: "exp-04",
    company: "Freelance",
    position: "Développeur Full Stack & Consultant",
    location: "Bénin (Télétravail)",
    startDate: "2020-01-01",
    endDate: undefined,
    current: true,
    description:
      "Activité freelance en parallèle de mes emplois principaux. Réalisation de projets web pour des clients internationaux et consulting technique pour des startups africaines.",
    achievements: [
      "Livraison de 25+ projets web pour des clients dans 8 pays différents",
      "Consulting technique pour 5 startups africaines en phase de croissance",
      "Création d'une formation en ligne suivie par 500+ développeurs africains",
    ],
  },
  {
    id: "exp-05",
    company: "StartupHub",
    position: "CTO & Co-fondateur",
    location: "Cotonou, Bénin",
    startDate: "2023-03-01",
    endDate: undefined,
    current: true,
    description:
      "Co-fondation d'une startup développant des solutions SaaS pour les PME africaines. Supervision de toute la stratégie technique et de la roadmap produit.",
    achievements: [
      "Développement et lancement de 2 produits SaaS comptant 200+ clients",
      "Recrutement et management d'une équipe technique de 8 personnes",
      "Lever de fonds de 150 000€ auprès d'investisseurs africains",
    ],
  },
  {
    id: "exp-06",
    company: "EduTech Plus",
    position: "Formateur & Mentor Technique",
    location: "Cotonou, Bénin",
    startDate: "2022-01-01",
    endDate: "2023-06-30",
    current: false,
    description:
      "Formateur dans un bootcamp de développement web. Accompagnement des apprenants dans leur montée en compétences sur les technologies web modernes.",
    achievements: [
      "Formation de 120+ développeurs juniors aux technologies React et Laravel",
      "Création du programme pédagogique full stack adopté par l'école",
      "Taux d'employabilité de 85% des apprenants dans les 6 mois suivant la formation",
    ],
  },
  {
    id: "exp-07",
    company: "Innov8 Lab",
    position: "Architecte Solutions",
    location: "Lomé, Togo",
    startDate: "2024-01-15",
    endDate: undefined,
    current: true,
    description:
      "Laboratoire d'innovation technologique. Conception d'architectures logicielles pour des projets à fort impact social en Afrique de l'Ouest.",
    achievements: [
      "Architecture d'une plateforme IoT pour l'agriculture connectée déployée dans 3 pays",
      "Conception d'un système de gestion des identités numériques pour 100 000+ utilisateurs",
      "Optimisation des performances backend réduisant les coûts serveur de 50%",
    ],
  },
];
