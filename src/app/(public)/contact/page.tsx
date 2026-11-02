import PageHero from "@/components/layout/PageHero";
import Contact from "@/components/sections/Contact";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Donnons vie à"
        highlight="votre prochain projet."
        description="Une idée, un besoin, une question ? Décrivez-moi votre contexte et je reviens vers vous sous 24 à 48 heures."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        variant="waves"
      />
      <Contact />
    </div>
  );
}
