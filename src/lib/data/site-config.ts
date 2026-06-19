import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "DJOSSE Adechina",
  fullName: "DJOSSE Adechina Gaston",
  title: "Développeur Web & Consultant Digital",
  description:
    "Développeur web, développeur d'applications et consultant digital spécialisé dans la création de solutions numériques innovantes, de plateformes SaaS et d'applications modernes.",
  keywords: [
    "développeur web",
    "consultant digital",
    "développeur applications",
    "react",
    "next.js",
    "typescript",
    "node.js",
    "laravel",
    "portfolio",
    "développeur freelance",
    "création site web",
  ],
  logo: "/images/logo.svg",
  favicon: "/images/favicon.ico",
  ogImage: "/images/og-image.jpg",
  avatar: "",
  email: "contact@djosse-adechina.com",
  phone: "+229 01 23 45 67",
  location: "Cotonou, Bénin",
  socialLinks: [
    { name: "LinkedIn", url: "https://linkedin.com/in/djosse-adechina", icon: "Linkedin" },
    { name: "GitHub", url: "https://github.com/djosse-adechina", icon: "Github" },
    { name: "WhatsApp", url: "https://wa.me/22901234567", icon: "MessageCircle" },
    { name: "Facebook", url: "https://facebook.com/djosse-adechina", icon: "Facebook" },
    { name: "X", url: "https://x.com/djosse_adechina", icon: "Twitter" },
    { name: "Email", url: "mailto:contact@djosse-adechina.com", icon: "Mail" },
  ],
  stats: [
    { label: "Projets réalisés", value: 45, suffix: "+", icon: "Briefcase" },
    { label: "Technologies maîtrisées", value: 30, suffix: "+", icon: "Code2" },
    { label: "Années d'expérience", value: 8, suffix: "+", icon: "Calendar" },
    { label: "Clients satisfaits", value: 25, suffix: "+", icon: "Users" },
  ],
  about: {
    presentation: `Développeur passionné et consultant digital avec plus de 8 ans d'expérience dans la création de solutions numériques innovantes. Ma mission est de transformer des idées ambitieuses en produits digitaux performants, élégants et intuitifs.

Spécialisé en développement web full-stack, architecture d'applications et stratégie digitale, j'accompagne les entreprises et entrepreneurs dans leur transformation numérique, de la conception à la réalisation.

Mon approche allie excellence technique, design thinking et vision stratégique pour livrer des solutions qui dépassent les attentes et créent un impact durable.`,
    vision: `Devenir un leader dans l'innovation numérique en Afrique, en créant des solutions technologiques qui résolvent des problèmes concrets et contribuent au développement économique et social du continent.`,
    values: [
      "Excellence technique et qualité irréprochable",
      "Innovation et créativité au service du résultat",
      "Intégrité et transparence dans chaque projet",
      "Engagement envers la satisfaction client",
      "Apprentissage continu et veille technologique",
    ],
    timeline: [
      {
        year: "2016",
        title: "Début du parcours",
        description: "Obtention de ma licence en informatique et développement de mes premières applications web.",
        type: "education",
      },
      {
        year: "2017",
        title: "Premier poste en développement",
        description: "Intégration d'une agence digitale comme développeur junior. Découverte des frameworks modernes.",
        type: "work",
      },
      {
        year: "2019",
        title: "Spécialisation Full-Stack",
        description: "Promotion au poste de développeur full-stack. Maîtrise de React, Node.js et Laravel.",
        type: "work",
      },
      {
        year: "2020",
        title: "Lancement en freelance",
        description: "Création de mon activité de consultant digital et développeur indépendant.",
        type: "achievement",
      },
      {
        year: "2021",
        title: "Master en Génie Logiciel",
        description: "Obtention d'un master avec mention, spécialisation en architecture logicielle et IA.",
        type: "education",
      },
      {
        year: "2022",
        title: "Première plateforme SaaS",
        description: "Conception et lancement d'une plateforme SaaS innovante pour la gestion d'entreprises.",
        type: "achievement",
      },
      {
        year: "2023",
        title: "Expertise IA & Automation",
        description: "Intégration de l'intelligence artificielle dans les solutions digitales et automation des processus.",
        type: "work",
      },
      {
        year: "2024",
        title: "Leadership & Innovation",
        description: "Direction de projets digitaux d'envergure et mentoring de développeurs émergents.",
        type: "achievement",
      },
    ],
    cvUrl: "/docs/cv-djosse-adechina.pdf",
  },
};
