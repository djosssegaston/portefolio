import type { Metadata } from "next"
import AProposContent from "./AProposContent"

export const metadata: Metadata = {
  title: "À propos — DJOSSE Adechina Gaston",
  description:
    "Développeur full-stack diplômé en Systèmes Informatiques et Logiciels : parcours, expériences, projets et compétences de DJOSSE Adechina Gaston.",
  alternates: { canonical: "/a-propos" },
}

export default function AboutPage() {
  return <AProposContent />
}
