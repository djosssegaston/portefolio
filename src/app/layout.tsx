import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
import AnimationLayer from "@/components/animation/AnimationLayer";
import ScrollReveal from "@/components/animation/ScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "DJOSSE Adechina Gaston - Développeur Web & Consultant Digital",
  description:
    "Portfolio professionnel de DJOSSE Adechina Gaston, développeur web, consultant digital et entrepreneur technologique.",
  keywords: [
    "développeur web",
    "consultant digital",
    "portfolio",
    "bénin",
    "react",
    "next.js",
    "laravel",
  ],
  authors: [{ name: "DJOSSE Adechina Gaston" }],
  icons: { icon: "/images/favicon.ico" },
  openGraph: {
    title: "DJOSSE Adechina Gaston - Développeur Web & Consultant Digital",
    description:
      "Portfolio professionnel de DJOSSE Adechina Gaston, développeur web, consultant digital et entrepreneur technologique.",
    url: "/",
    siteName: "DJOSSE Adechina Gaston",
    images: ["/images/og-image.jpg"],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJOSSE Adechina Gaston - Développeur Web & Consultant Digital",
    description:
      "Portfolio professionnel de DJOSSE Adechina Gaston, développeur web, consultant digital et entrepreneur technologique.",
    images: ["/images/og-image.jpg"],
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
