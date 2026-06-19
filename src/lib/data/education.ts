import { Education } from "@/types";

export const education: Education[] = [
  {
    id: "edu-01",
    institution: "Université d'Abomey-Calavi",
    degree: "Licence",
    field: "Informatique de Gestion",
    startDate: "2013-10-01",
    endDate: "2016-09-30",
    current: false,
    description:
      "Formation fondamentale en informatique de gestion avec un accent sur le développement logiciel, les bases de données et la gestion de projets informatiques. Obtention de la mention Bien.",
    highlights: [
      "Projet de fin d'études : Développement d'un système de gestion de bibliothèque en PHP",
      "Membre actif du club informatique de l'université",
      "Stage de 3 mois chez TechSolutions Bénin",
    ],
  },
  {
    id: "edu-02",
    institution: "Université Polytechnique de Ouagadougou",
    degree: "Master",
    field: "Génie Logiciel",
    startDate: "2019-10-01",
    endDate: "2021-09-30",
    current: false,
    description:
      "Master professionnel en génie logiciel couvrant l'architecture logicielle, les méthodologies agiles, le cloud computing et la sécurité des systèmes d'information. Formation en alternance avec Digital Africa Agency.",
    highlights: [
      "Mémoire sur l'architecture microservices pour les applications SaaS en Afrique",
      "Certification Scrum Master obtenue durant le cursus",
      "Publication d'un article sur les bonnes pratiques DevOps pour les PME africaines",
    ],
  },
  {
    id: "edu-03",
    institution: "OpenClassrooms",
    degree: "Formation en ligne",
    field: "Développement Web Avancé",
    startDate: "2018-01-01",
    endDate: "2018-06-30",
    current: false,
    description:
      "Parcours de formation intensive couvrant React, Node.js, MongoDB et les architectures REST. Projets pratiques supervisés par des mentors professionnels.",
    highlights: [
      "Développement d'une application sociale complète avec React et Node.js",
      "Mise en production d'une API REST documentée avec Swagger",
      "Obtention du certificat avec mention Excellent",
    ],
  },
  {
    id: "edu-04",
    institution: "ALX Africa",
    degree: "Bootcamp",
    field: "Software Engineering",
    startDate: "2022-03-01",
    endDate: "2022-08-31",
    current: false,
    description:
      "Bootcamp intensif de 6 mois organisé par ALX en partenariat avec Holberton School. Programme couvrant les fondamentaux de l'ingénierie logicielle, les structures de données et l'architecture des systèmes.",
    highlights: [
      "Projet final : Développement d'un moteur de recherche en Python",
      "Participation au hackathon ALX avec une solution de e-learning classée 3e",
      "Mise en réseau avec 200+ développeurs africains",
    ],
  },
];
