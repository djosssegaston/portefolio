import { SiteConfig } from "@/types";
import { journey, principles, profile, vision } from "@/app/(public)/a-propos/about-data";

const timelineType = (type: string): "work" | "education" | "achievement" => {
  if (type === "education") return "education";
  if (type === "work" || type === "internship") return "work";
  return "achievement";
};

export const siteConfig: SiteConfig = {
  name: "DJOSSE Adechina",
  fullName: profile.fullName,
  title: profile.role,
  description:
    "Développeur full-stack diplômé en Systèmes Informatiques et Logiciels. Conception et développement de sites web, plateformes métier, API REST et intégrations de paiement.",
  keywords: [
    "développeur full-stack",
    "développeur web",
    "laravel",
    "react",
    "php",
    "javascript",
    "mysql",
    "postgresql",
    "api rest",
    "bénin",
    "porto-novo",
    "portfolio",
  ],
  logo: "/images/avatars/logo.png",
  favicon: "/images/favicon.ico",
  ogImage: "/images/og-image.jpg",
  avatar: "/images/avatar.jpg",
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  socialLinks: [
    { name: "LinkedIn", url: profile.linkedin, icon: "Linkedin" },
    { name: "GitHub", url: profile.github, icon: "Github" },
    { name: "Email", url: `mailto:${profile.email}`, icon: "Mail" },
  ],
  stats: [
    { label: "Projets présentés", value: 4, suffix: "", icon: "Folder" },
    { label: "Expériences professionnelles", value: 2, suffix: "", icon: "Briefcase" },
    { label: "Certificat", value: 1, suffix: "", icon: "Award" },
    { label: "Groupes de compétences", value: 7, suffix: "", icon: "Code2" },
  ],
  about: {
    presentation: profile.intro.join("\n\n"),
    vision: vision.quote,
    values: principles.map((item) => `${item.title} — ${item.description}`),
    timeline: journey.map((item) => ({
      year: item.year,
      title: `${item.title} — ${item.place}`,
      description: item.description,
      type: timelineType(item.type),
    })),
    cvUrl: profile.cvUrl,
  },
};
