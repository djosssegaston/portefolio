import PageHero from "@/components/layout/PageHero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import type { Skill } from "@/types";
import { Compass, Layers, Zap } from "lucide-react";

const values = [
  {
    icon: Compass,
    title: "Comprendre avant de construire",
    description:
      "Chaque projet commence par une écoute attentive du besoin réel, du contexte et des contraintes. La technique n'est qu'un moyen au service d'un objectif clair.",
  },
  {
    icon: Layers,
    title: "Concevoir pour durer",
    description:
      "Des architectures lisibles, testables et évolutives. Je privilégie la qualité, la performance et la maintenabilité plutôt que la précipitation.",
  },
  {
    icon: Zap,
    title: "Soigner chaque détail",
    description:
      "Du premier pixel à la dernière ligne de code, l'expérience utilisateur et la fiabilité guident mes décisions. Le détail fait la différence.",
  },
];

export default function AProposContent({ skills }: { skills: Skill[] }) {
  return (
    <div>
      <PageHero
        eyebrow="À propos"
        title="Développeur,"
        highlight="bâtisseur de produits."
        description="Découvrez mon parcours, ma vision et ma passion pour la technologie. Je conçois des expériences numériques utiles, rapides et durables."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
        variant="orb"
      >
        <div className="grid max-w-xl grid-cols-3 gap-4">
          {[
            { value: "1+", label: "années d'expérience" },
            { value: "5+", label: "projets livrés" },
            { value: "30+", label: "clients accompagnés" },
          ].map((item, index) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md"
              data-reveal="up"
              data-reveal-delay={0.28 + index * 0.07}
            >
              <p className="font-heading text-2xl font-semibold text-white sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <About />

      <section className="section-shell bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-reveal="up">
            <span className="section-label">Ma philosophie</span>
            <h2 className="section-heading mt-5">
              La technologie comme{" "}
              <span className="gradient-text">levier de transformation.</span>
            </h2>
            <p className="section-desc !mx-0">
              Chaque ligne de code que j&apos;écris est guidée par une conviction : la
              technologie doit résoudre des problèmes concrets et améliorer des vies.
            </p>
          </div>

          <div
            className="mt-14 grid gap-5 md:grid-cols-3"
            data-reveal-group
          >
            {values.map((value) => (
              <article
                key={value.title}
                data-reveal-item
                className="surface surface-interactive group relative overflow-hidden p-7"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/[0.08] text-primary ring-1 ring-primary/10">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-6 font-heading text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-secondary">
                  {value.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-reveal="right">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Mon parcours
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-secondary">
                <p>
                  Je crois fermement que la technologie est un puissant levier de
                  transformation, capable de résoudre des problèmes complexes et
                  d&apos;améliorer des vies.
                </p>
                <p>
                  Mon approche du développement va au-delà de la technique : je
                  m&apos;efforce de comprendre les véritables besoins de mes clients,
                  leurs défis et leurs aspirations, pour concevoir des solutions qui
                  ont un impact réel et durable.
                </p>
              </div>
            </div>
            <div data-reveal="left" data-reveal-delay="0.1">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Ma curiosité
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-secondary">
                <p>
                  Dans un monde numérique en constante évolution, je reste
                  passionnément curieux, toujours à l&apos;affût des nouvelles
                  technologies et des meilleures pratiques.
                </p>
                <p>
                  Cette veille permanente me permet d&apos;offrir à mes clients des
                  solutions à la pointe de l&apos;innovation, sans jamais sacrifier la
                  stabilité ni la simplicité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Skills skills={skills} />
    </div>
  );
}
