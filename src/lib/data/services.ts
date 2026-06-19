import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "web-dev",
    title: "Développement Web",
    description:
      "Sites web professionnels, vitrines, e-commerce et plateformes sur mesure avec les technologies les plus modernes.",
    longDescription:
      "Je conçois et développe des sites web et applications web sur mesure, adaptés à vos besoins spécifiques. Utilisant les frameworks les plus performants comme Next.js, React et Laravel, je crée des solutions rapides, sécurisées et évolutives. Du site vitrine à la plateforme complexe, chaque projet bénéficie d'une attention particulière à l'expérience utilisateur, aux performances et au référencement naturel.",
    icon: "Globe",
    features: [
      "Sites vitrines et institutionnels premium",
      "Plateformes e-commerce performantes",
      "Applications web progressives (PWA)",
      "Portfolios professionnels et CV en ligne",
      "Sites à fort trafic et haute disponibilité",
      "Refonte et modernisation de sites existants",
    ],
    price: "À partir de 500 000 FCFA",
  },
  {
    id: "app-dev",
    title: "Développement d'Applications",
    description:
      "Applications web et mobiles modernes avec architectures robustes, interfaces intuitives et performances optimales.",
    longDescription:
      "De la conception à la publication, je développe des applications complètes avec des architectures modernes et scalables. Que ce soit une application web complexe, une Progressive Web App ou une application mobile hybride, j'utilise les meilleures pratiques du génie logiciel pour livrer un produit fiable, maintenable et performant.",
    icon: "Smartphone",
    features: [
      "Applications web sur mesure",
      "Applications mobiles hybrides (React Native)",
      "APIs RESTful et GraphQL",
      "Architectures micro-services",
      "Systèmes de gestion de contenu (CMS)",
      "Applications temps réel et collaboratives",
    ],
    price: "À partir de 1 000 000 FCFA",
  },
  {
    id: "saas",
    title: "Plateformes SaaS",
    description:
      "Création de solutions SaaS innovantes avec architecture multi-tenant, paiement intégré et scalabilité garantie.",
    longDescription:
      "Spécialiste des architectures SaaS, je conçois et développe des plateformes logicielles multi-tenant complètes. De l'infrastructure cloud à l'interface utilisateur, chaque composant est optimisé pour offrir une expérience fluide, une sécurité maximale et une scalabilité qui suit votre croissance.",
    icon: "Cloud",
    features: [
      "Architecture multi-tenant complète",
      "Systèmes d'abonnement et facturation",
      "Tableaux de bord analytiques avancés",
      "APIs publiques et webhooks",
      "Intégrations tierces (Stripe, PayPal, etc.)",
      "Infrastructure cloud scalable et sécurisée",
    ],
    price: "Sur devis",
  },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    description:
      "Maintien de vos applications à jour, sécurisées et performantes avec un support technique réactif.",
    longDescription:
      "Je propose des contrats de maintenance et support technique pour garantir le bon fonctionnement continu de vos applications. Supervision, mises à jour de sécurité, correctifs, optimisation des performances et assistance technique sont assurés pour que vous puissiez vous concentrer sur votre cœur de métier.",
    icon: "Wrench",
    features: [
      "Maintenance préventive et corrective",
      "Mises à jour de sécurité et correctifs",
      "Optimisation des performances",
      "Sauvegardes et plan de reprise d'activité",
      "Support technique prioritaire",
      "Hébergement et infrastructure cloud",
    ],
    price: "À partir de 150 000 FCFA/mois",
  },
  {
    id: "consulting",
    title: "Consulting & Stratégie",
    description:
      "Conseil en transformation digitale, architecture technique, choix technologiques et stratégie numérique.",
    longDescription:
      "Fort de plusieurs années d'expérience dans le numérique, je vous accompagne dans vos choix stratégiques : sélection des technologies adaptées, architecture technique, planning de développement, estimation des efforts et des coûts. Mon approche de consulting vous aide à éviter les pièges courants et à maximiser votre retour sur investissement numérique.",
    icon: "Lightbulb",
    features: [
      "Audit technique et architectural",
      "Stratégie de transformation digitale",
      "Choix technologiques et feuille de route",
      "Estimation et planning de projet",
      "Accompagnement à la maîtrise d'ouvrage",
      "Formation technique et ateliers",
    ],
    price: "100 000 FCFA/jour",
  },
  {
    id: "seo",
    title: "SEO & Marketing Digital",
    description:
      "Optimisation pour les moteurs de recherche, stratégie de contenu et marketing digital pour booster votre visibilité.",
    longDescription:
      "Votre site ou application mérite d'être visible. Je propose des services complets de référencement naturel (SEO), de marketing digital et d'optimisation de la conversion. De l'audit SEO initial à la stratégie de contenu en passant par l'optimisation technique, chaque action est mesurée et orientée résultats.",
    icon: "TrendingUp",
    features: [
      "Audit SEO complet et recommandations",
      "Optimisation technique (Core Web Vitals)",
      "Stratégie de contenu et blog",
      "Campagnes Google Ads et Social Ads",
      "Analytics et suivi des performances",
      "Email marketing et newsletters",
    ],
    price: "À partir de 200 000 FCFA",
  },
  {
    id: "tech-audit",
    title: "Audit Technique",
    description:
      "Analyse approfondie de vos systèmes, identification des vulnérabilités et recommandations d'amélioration.",
    longDescription:
      "Je réalise des audits techniques complets de vos applications et infrastructures : analyse du code, performance, sécurité, architecture, SEO technique et accessibilité. Chaque audit débouche sur un rapport détaillé avec des recommandations prioritaires et un plan d'action concret pour améliorer votre système.",
    icon: "SearchCheck",
    features: [
      "Audit de code et qualité logicielle",
      "Analyse de performance et optimisation",
      "Audit de sécurité et vulnérabilités",
      "Audit SEO technique approfondi",
      "Audit d'accessibilité (WCAG)",
      "Rapport détaillé et plan d'action",
    ],
    price: "À partir de 300 000 FCFA",
  },
  {
    id: "digital-support",
    title: "Accompagnement Numérique",
    description:
      "Formation, mentoring et accompagnement personnalisé pour monter en compétences sur les technologies modernes.",
    longDescription:
      "Je propose des sessions de formation et de mentoring pour les développeurs, équipes techniques et entrepreneurs souhaitant monter en compétences. Du développement web à l'architecture logicielle en passant par l'IA et le DevOps, je conçois des programmes adaptés à vos objectifs et à votre niveau.",
    icon: "GraduationCap",
    features: [
      "Formation développement web et mobile",
      "Mentoring individuel et collectif",
      "Workshops et ateliers pratiques",
      "Bootcamps intensifs sur mesure",
      "Accompagnement à la reconversion",
      "Conférences et présentations",
    ],
    price: "Sur devis",
  },
];
