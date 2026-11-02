import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { resolveIcon } from "@/components/shared/icon-map";
import PageHero from "@/components/layout/PageHero";
import Contact from "@/components/sections/Contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services as staticServices } from "@/lib/data/services";
import type { Service } from "@/types";

const steps = [
  { number: "01", title: "Cadrage", text: "Objectifs, périmètre, contraintes et indicateurs de succès." },
  { number: "02", title: "Conception", text: "Architecture, parcours utilisateur et maquettes interactives." },
  { number: "03", title: "Développement", text: "Itérations courtes, démos régulières et code documenté." },
  { number: "04", title: "Lancement", text: "Tests, mise en production, formation et suivi des performances." },
];

export default function ServicesPage({ services = staticServices }: { services?: Service[] }) {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Des solutions digitales"
        highlight="pensées pour grandir."
        description="De la stratégie au lancement, je conçois des produits web et mobiles performants, accessibles et prêts à évoluer avec votre activité."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Services" }]}
        variant="torus"
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="group">
            <Link href="/contact">
              Discuter de votre projet
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/projets">Voir mes réalisations</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center" data-reveal="up">
            <span className="section-label">Expertises</span>
            <h2 className="section-heading mt-5">
              Une offre complète, <span className="gradient-text">sans compromis.</span>
            </h2>
            <p className="section-desc">
              Chaque mission est adaptée à votre contexte. Voici les domaines dans
              lesquels je peux vous accompagner.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2" data-reveal-group>
            {services.map((service) => {
              const Icon = resolveIcon(service.icon);
              return (
                <article
                  key={service.id}
                  data-reveal-item
                  className="surface group relative overflow-hidden p-8"
                >
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/[0.05] blur-3xl transition-all duration-700 group-hover:bg-primary/10" />
                  <div className="relative flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary ring-1 ring-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
                        {service.price && (
                          <Badge variant="secondary" className="bg-primary/[0.07] text-primary">
                            {service.price}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-secondary">
                        {service.longDescription}
                      </p>
                      <ul className="mt-5 space-y-2.5">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm text-secondary"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button asChild variant="ghost" className="mt-6 -ml-3 group/btn">
                        <Link href="/contact">
                          Demander un devis
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#05070f] py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(37,99,235,0.25),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-reveal="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Méthode
            </span>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Un processus clair, du premier échange au lancement.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
            {steps.map((step) => (
              <div
                key={step.number}
                data-reveal-item
                className="glass-panel rounded-2xl p-6 transition-colors duration-500 hover:border-white/20"
              >
                <span className="font-heading text-sm font-semibold text-cyan-300/80">
                  {step.number}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
