import PageHero from "@/components/layout/PageHero";
import Contact from "@/components/sections/Contact";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title="Donnons vie à"
        highlight="votre prochain projet."
        description="Une idée, un besoin, une question ? Décrivez votre contexte, vos contraintes et vos objectifs ; je vous répondrai par email ou WhatsApp."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        variant="waves"
      />
      <Contact />
    </div>
  );
}
