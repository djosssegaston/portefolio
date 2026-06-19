import { Certification } from "@/types";

export const certifications: Certification[] = [
  {
    id: "cert-01",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2023-06-15",
    expiryDate: "2026-06-15",
    credentialUrl: "https://aws.amazon.com/verify/certification/ABC123",
    badge: "/images/certifications/aws-cloud-practitioner.png",
    description:
      "Certification fondamentale attestant d'une compréhension globale du cloud AWS, des services principaux, de la tarification, de la sécurité et de l'architecture. Connaissances validées sur le cadre Well-Architected et les bonnes pratiques cloud.",
  },
  {
    id: "cert-02",
    title: "Google Analytics Individual Qualification",
    issuer: "Google",
    date: "2024-02-10",
    expiryDate: "2025-02-10",
    credentialUrl: "https://skillshop.exceedlms.com/profiles/user/abc123",
    badge: "/images/certifications/google-analytics.png",
    description:
      "Certification validant la maîtrise de Google Analytics 4, la configuration des propriétés, la création de rapports personnalisés, l'analyse des parcours utilisateurs et l'optimisation des conversions.",
  },
  {
    id: "cert-03",
    title: "Meta Certified Front-End Developer",
    issuer: "Meta",
    date: "2024-01-20",
    expiryDate: undefined,
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/XYZ789",
    badge: "/images/certifications/meta-frontend.png",
    description:
      "Certification Meta validant les compétences en développement front-end avec React, la création d'interfaces responsives, la gestion d'état, les hooks avancés et l'intégration d'APIs RESTful.",
  },
  {
    id: "cert-04",
    title: "Professional Scrum Master I (PSM I)",
    issuer: "Scrum.org",
    date: "2022-11-08",
    expiryDate: undefined,
    credentialUrl: "https://www.scrum.org/certificates/123456",
    badge: "/images/certifications/scrum-master.png",
    description:
      "Certification internationale validant la maîtrise du framework Scrum, le rôle de Scrum Master, la gestion des sprints, la facilitation des cérémonies agiles et l'accompagnement des équipes vers l'auto-organisation.",
  },
  {
    id: "cert-05",
    title: "Laravel Certified Developer",
    issuer: "Laravel",
    date: "2023-09-12",
    expiryDate: "2025-09-12",
    credentialUrl: "https://certification.laravel.com/verify/abc-123-def",
    badge: "/images/certifications/laravel-certified.png",
    description:
      "Certification officielle Laravel couvrant l'architecture MVC, Eloquent ORM, les migrations, le système de routing, les middlewares, les jobs et queues, les events, les tests unitaires et les bonnes pratiques de sécurité.",
  },
  {
    id: "cert-06",
    title: "MongoDB Associate Developer",
    issuer: "MongoDB University",
    date: "2023-04-05",
    expiryDate: undefined,
    credentialUrl: "https://university.mongodb.com/certification/verify/ABC123",
    badge: "/images/certifications/mongodb-developer.png",
    description:
      "Certification validant les compétences en modélisation de données avec MongoDB, création d'agrégations complexes, optimisation des performances des requêtes, indexation et gestion de la réplication.",
  },
  {
    id: "cert-07",
    title: "Docker Certified Associate",
    issuer: "Docker Inc.",
    date: "2023-02-28",
    expiryDate: "2025-02-28",
    credentialUrl: "https://docker.com/certification/verify/123abc",
    badge: "/images/certifications/docker-certified.png",
    description:
      "Certification validant la maîtrise de Docker, la création d'images optimisées, l'orchestration avec Docker Compose, la gestion des réseaux et volumes, et les bonnes pratiques de sécurité des conteneurs.",
  },
  {
    id: "cert-08",
    title: "GitHub Actions Certified",
    issuer: "GitHub",
    date: "2024-03-20",
    expiryDate: undefined,
    credentialUrl: "https://github.com/certification/verify/456def",
    badge: "/images/certifications/github-actions.png",
    description:
      "Certification sur l'automatisation des workflows de CI/CD avec GitHub Actions, création d'actions personnalisées, gestion des secrets, déploiement multi-environnements et stratégies de testing automatisé.",
  },
  {
    id: "cert-09",
    title: "Meta Certified Back-End Developer",
    issuer: "Meta",
    date: "2024-05-10",
    expiryDate: undefined,
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/DEF456",
    badge: "/images/certifications/meta-backend.png",
    description:
      "Certification Meta validant les compétences en développement back-end avec Node.js, Express, la création d'APIs RESTful, la gestion des bases de données, l'authentification JWT et le déploiement d'applications.",
  },
  {
    id: "cert-10",
    title: "HashiCorp Terraform Associate",
    issuer: "HashiCorp",
    date: "2024-06-01",
    expiryDate: "2026-06-01",
    credentialUrl: "https://hashicorp.com/certification/verify/789ghi",
    badge: "/images/certifications/terraform.png",
    description:
      "Certification validant les compétences en Infrastructure as Code avec Terraform, gestion des providers, création de modules réutilisables, gestion de l'état, et déploiement d'infrastructure multi-cloud.",
  },
];
