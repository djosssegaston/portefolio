import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
