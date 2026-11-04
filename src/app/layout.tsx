import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
import AnimationLayer from "@/components/animation/AnimationLayer";
import ScrollReveal from "@/components/animation/ScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "DJOSSE Adechina Gaston — Développeur Full-Stack",
  description:
    "Portfolio de DJOSSE Adechina Gaston, développeur full-stack diplômé en Systèmes Informatiques et Logiciels. Sites web, plateformes métier, API REST et intégrations de paiement.",
  keywords: [
    "développeur full-stack",
    "développeur web",
    "portfolio",
    "bénin",
    "porto-novo",
    "react",
    "laravel",
    "php",
    "mysql",
    "postgresql",
  ],
  authors: [{ name: "DJOSSE Adechina Gaston" }],
  icons: { icon: "/images/favicon.ico" },
  openGraph: {
    title: "DJOSSE Adechina Gaston — Développeur Full-Stack",
    description:
      "Sites web, plateformes métier, API REST et intégrations de paiement. Portfolio de DJOSSE Adechina Gaston.",
    url: "/",
    siteName: "DJOSSE Adechina Gaston",
    images: ["/images/avatar.jpg"],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJOSSE Adechina Gaston — Développeur Full-Stack",
    description:
      "Sites web, plateformes métier, API REST et intégrations de paiement. Portfolio de DJOSSE Adechina Gaston.",
    images: ["/images/avatar.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen font-body antialiased">
        <noscript>
          <style>{`[data-reveal],[data-gsap-item],[data-reveal-group] [data-reveal-item]{opacity:1!important}`}</style>
        </noscript>
        {children}
        <ScrollReveal />
        <AnimationLayer />
      </body>
    </html>
  );
}
