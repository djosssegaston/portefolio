import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "blog-01",
    title: "10 Bonnes Pratiques React pour des Applications Performantes",
    slug: "10-bonnes-pratiques-react",
    excerpt:
      "Découvrez les techniques essentielles pour optimiser vos applications React : du lazy loading à la gestion d'état efficace en passant par les hooks personnalisés.",
    content: `Dans l'écosystème React, la performance est un enjeu crucial pour offrir une expérience utilisateur optimale. Après avoir travaillé sur de nombreuses applications React, j'ai compilé les 10 bonnes pratiques qui font vraiment la différence.

\`\`\`javascript
// Exemple : React.memo pour éviter les re-rendus inutiles
const MonComposant = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});
\`\`\`

Le lazy loading avec React.lazy et Suspense permet de réduire considérablement le temps de chargement initial. En segmentant votre bundle en plus petites parties, vous ne chargez que ce qui est nécessaire au moment opportun. Combiné avec le code splitting au niveau des routes, cette technique peut réduire le temps de chargement initial de 40 à 60%.

La gestion d'état mérite une attention particulière. Évitez de placer dans Redux ou Context des données qui pourraient rester locales à un composant. Utilisez useReducer pour des états complexes mais locaux, et réservez Context aux données réellement globales comme le thème ou l'authentification. Pour les applications de taille moyenne, un bon pattern avec useState et useContext peut suffire sans ajouter la complexité de bibliothèques externes.

Enfin, n'oubliez pas l'optimisation des images, l'utilisation de clés stables dans les listes, et les Web Workers pour les calculs lourds. Ces pratiques, appliquées dès le début du projet, vous éviteront bien des maux de tête par la suite.`,
    coverImage: "/images/blog/post-1.jpg",
    category: "Développement",
    tags: ["React", "Performance", "JavaScript", "Front-end"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2024-05-20",
    readTime: 8,
    published: true,
    popular: true,
    comments: [
      {
        id: "comment-01",
        name: "Koffi Mensah",
        email: "koffi.mensah@example.com",
        content:
          "Excellent article ! J'ai particulièrement apprécié la partie sur React.memo. Je l'ai implémenté sur mon projet et j'ai vu une nette amélioration des performances. Merci pour ces conseils pratiques.",
        date: "2024-05-22",
        validated: true,
      },
      {
        id: "comment-02",
        name: "Sophie Amoussou",
        email: "sophie.a@example.com",
        content:
          "Très utile ! Pourriez-vous faire un article dédié sur l'utilisation de useReducer vs useState ? Je galère parfois à choisir le bon outil.",
        date: "2024-05-25",
        validated: true,
      },
    ],
  },
  {
    id: "blog-02",
    title: "Comment Optimiser vos APIs Laravel pour le Passage à l'Échelle",
    slug: "optimiser-apis-laravel",
    excerpt:
      "Guide pratique pour concevoir des APIs Laravel robustes et performantes : caching, pagination avancée, queues et bonnes pratiques d'architecture.",
    content: `Laravel est un framework PHP puissant, mais sans une architecture réfléchie, vos APIs peuvent rapidement devenir un goulot d'étranglement. Voici comment les optimiser pour supporter des milliers de requêtes par seconde.

Premièrement, le caching est votre meilleur allié. Laravel offre un système de cache unifié qui supporte Redis, Memcached et le cache fichier. Utilisez-le stratégiquement pour les requêtes fréquentes et les données qui changent peu. La mise en cache des requêtes Eloquent avec remember() peut réduire le temps de réponse de 200ms à 5ms pour les endpoints populaires.

L'architecture des queues est également cruciale. Déchargez les tâches longues (envoi d'emails, génération de rapports, traitement d'images) vers des jobs asynchrones traités par Horizon. Cela libère vos serveurs web et améliore la réactivité de l'API. Configurez des queues prioritaires pour que les tâches critiques soient traitées en premier.

Pour la pagination, allez au-delà du simple paginate() de Laravel. Implémentez le cursor pagination pour les grandes collections et utilisez des indexes composés en base de données pour accélérer les requères. Une API bien paginée peut gérer des millions d'enregistrements sans ralentissement.`,
    coverImage: "/images/blog/post-2.jpg",
    category: "Développement",
    tags: ["Laravel", "API", "Performance", "PHP"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2024-04-12",
    readTime: 10,
    published: true,
    popular: true,
    comments: [
      {
        id: "comment-03",
        name: "Mamadou Ba",
        email: "mamadou.ba@example.com",
        content:
          "Super guide ! Le passage de paginate() à cursor pagination a complètement résolu nos problèmes de lenteur sur les grandes collections.",
        date: "2024-04-15",
        validated: true,
      },
    ],
  },
  {
    id: "blog-03",
    title: "Architecture SaaS Moderne : Guide Complet pour les Startups Africaines",
    slug: "architecture-saas-startups-africaines",
    excerpt:
      "Comment concevoir une architecture SaaS scalable, abordable et adaptée aux spécificités du marché africain (paiement mobile, connexion intermittente, hébergement local).",
    content: `Construire un SaaS pour le marché africain présente des défis uniques qui nécessitent une architecture adaptée. Après avoir lancé deux produits SaaS comptant plus de 200 clients, voici les leçons que j'ai apprises.

L'architecture multi-tenant est la fondation de tout SaaS. Le choix entre une base de données par tenant (isolation maximale) ou une base partagée avec scoping (coût réduit) dépend de vos clients. Pour les startups africaines, je recommande une approche hybride : base partagée pour les clients standard et base dédiée pour les entreprises ayant des exigences de conformité.

La gestion de la connectivité intermittente est cruciale. Implémentez des stratégies de cache intelligent avec Service Workers pour les applications web et de synchronisation hors-ligne pour le mobile. Un indicateur de connectivité visible et des files d'attente locales pour les actions hors-ligne améliorent considérablement l'expérience utilisateur.

Enfin, le paiement mobile n'est pas une option mais une nécessité. Intégrez dès le départ Orange Money, MTN Mobile Money et Wave. Utilisez une couche d'abstraction (comme notre API Connect) pour changer facilement de fournisseur sans impacter le reste de l'application. La gestion des webhooks de confirmation de paiement doit être robuste avec un système de retry et de logs détaillés.`,
    coverImage: "/images/blog/post-3.jpg",
    category: "Technologie",
    tags: ["SaaS", "Architecture", "Startup", "Afrique"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2024-03-08",
    readTime: 12,
    published: true,
    popular: true,
    comments: [
      {
        id: "comment-04",
        name: "Ibrahim Sylla",
        email: "ibrahim.s@example.com",
        content:
          "Merci pour cet article très pertinent ! L'approche hybride du multi-tenant est exactement ce qu'il nous fallait. Avez-vous des retours d'expérience sur le choix des providers cloud en Afrique de l'Ouest ?",
        date: "2024-03-12",
        validated: true,
      },
      {
        id: "comment-05",
        name: "Esther Zinsou",
        email: "esther.z@example.com",
        content:
          "Article très complet. La partie sur les webhooks de paiement m'a évité une erreur d'architecture. Merci pour le partage d'expérience !",
        date: "2024-03-14",
        validated: true,
      },
    ],
  },
  {
    id: "blog-04",
    title: "Guide SEO Complet pour Développeurs Web en 2024",
    slug: "guide-seo-developpeurs-web-2024",
    excerpt:
      "Les bonnes pratiques SEO que tout développeur web devrait connaître : balises sémantiques, Core Web Vitals, données structurées et performance mobile.",
    content: `Le SEO n'est pas réservé aux experts marketing. En tant que développeur, vous avez un impact direct sur le référencement de vos projets. Voici les aspects techniques à maîtriser en 2024.

Les Core Web Vitals sont devenus des facteurs de classement majeurs. Le LCP (Largest Contentful Paint) doit être inférieur à 2,5 secondes. Pour y parvenir : optimisez vos images avec le format WebP/AVIF, implémentez le lazy loading natif, utilisez un CDN et minimiser le CSS/JavaScript bloquant. Le FID (First Input Delay) se résout en optimisant le JavaScript et en utilisant les Web Workers pour les tâches lourdes.

Les données structurées (Schema.org) sont essentielles pour les rich snippets. Implémentez au minimum les schémas Article, Organization, BreadcrumbList et FAQ. Utilisez JSON-LD plutôt que les microdonnées pour une maintenance plus facile. Testez vos implémentations avec le Rich Results Test de Google.

Pour le SEO mobile, adoptez le responsive design plutôt que le dynamic serving. Assurez-vous que les polices de caractères ne bloquent pas le rendu, que les boutons et liens sont assez grands pour le tactile (minimum 48x48px), et que le contenu est lisible sans zoom. Un site bien optimisé pour le mobile verra son trafic organique augmenter significativement.`,
    coverImage: "/images/blog/post-4.jpg",
    category: "Business",
    tags: ["SEO", "Performance", "Web", "Marketing"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2024-02-25",
    readTime: 7,
    published: true,
    popular: false,
    comments: [],
  },
  {
    id: "blog-05",
    title: "L'IA au Service du Développement Web : Opportunités et Limites",
    slug: "ia-developpement-web-opportunites-limites",
    excerpt:
      "Comment l'intelligence artificielle transforme le développement web : des assistants de codage aux tests automatisés, en passant par la génération de design.",
    content: `L'intelligence artificielle révolutionne notre façon de coder, mais sépare le buzz des vraies avancées. Voici mon analyse après un an d'utilisation intensive des outils IA dans mes projets professionnels.

Les assistants de codage (GitHub Copilot, Cursor) sont devenus indispensables pour la productivité. Ils excellent dans la génération de code boilerplate, les tests unitaires et les requêtes SQL complexes. Mon expérience montre un gain de productivité d'environ 30% sur les tâches répétitives. Cependant, ils restent limités pour l'architecture logicielle complexe et la compréhension du contexte métier.

Pour la génération de design, des outils comme Galileo AI et DALL-E permettent de créer rapidement des maquettes et des assets visuels. C'est particulièrement utile pour les phases de prototypage et les projets avec des ressources design limitées. Attention toutefois à la cohérence visuelle et aux droits d'utilisation des images générées.

Dans le testing, l'IA génère des cas de test complets et identifie les edge cases que nous pourrions oublier. Couplée à des outils de test end-to-end comme Playwright, l'IA peut créer des scénarios de test réalistes et maintenir les tests à jour automatiquement. C'est sans doute l'application la plus prometteuse pour la qualité logicielle.`,
    coverImage: "/images/blog/post-5.jpg",
    category: "Technologie",
    tags: ["IA", "Productivité", "Développement", "Innovation"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2024-01-18",
    readTime: 9,
    published: true,
    popular: true,
    comments: [
      {
        id: "comment-06",
        name: "Emmanuel Togbé",
        email: "emmanuel.t@example.com",
        content:
          "Article très équilibré qui évite le piège du simple enthousiasme technologique. Je partage votre avis sur le testing assisté par IA, c'est un vrai game changer.",
        date: "2024-01-20",
        validated: true,
      },
    ],
  },
  {
    id: "blog-06",
    title: "Mettre en Place un Workflow DevOps Complet pour Projets Web",
    slug: "workflow-devops-projets-web",
    excerpt:
      "De la CI/CD à la surveillance en passant par l'infrastructure as code : comment industrialiser le déploiement de vos applications web.",
    content: `Un workflow DevOps bien conçu est ce qui différencie un projet amateur d'un projet professionnel. Voici comment j'ai structuré l'infrastructure et les pipelines pour mes projets.

La base de tout workflow DevOps est la CI/CD. J'utilise GitHub Actions pour l'intégration continue et le déploiement automatisé. Chaque push sur la branche main déclenche : exécution des tests unitaires et d'intégration, build de l'application, analyse de qualité avec SonarQube, et déploiement progressif sur staging puis production après validation manuelle.

L'infrastructure as Code avec Terraform a transformé ma façon de gérer les serveurs. Plus besoin de configurer manuellement des serveurs : tout est versionné dans Git, reproductible et documenté. Un changement d'infrastructure se fait par pull request, avec planification et validation avant application. Les environnements de développement, staging et production sont identiques, éliminant le fameux \"ça marche en local\".

Pour la surveillance, la stack Prometheus + Grafana est incontournable. Configurez des alertes proactives sur les métriques clés : latence des endpoints, taux d'erreur, utilisation mémoire et CPU. Centralisez les logs avec ELK Stack (ou Loki pour une alternative plus légère). Un bon monitoring vous permet de détecter et résoudre les problèmes avant que vos utilisateurs ne les remarquent.`,
    coverImage: "/images/blog/post-6.jpg",
    category: "Technologie",
    tags: ["DevOps", "CI/CD", "Docker", "Cloud"],
    author: "Portfolio",
    authorAvatar: "/images/avatars/author.svg",
    date: "2023-12-05",
    readTime: 11,
    published: true,
    popular: false,
    comments: [],
  },
];
