import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Download,
  ExternalLink,
  Github,
  Languages as LanguagesIcon,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Quote,
  Sparkles,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import { resolveIcon } from "@/components/shared/icon-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brandGradient } from "@/lib/design";
import { cn } from "@/lib/utils";
import {
  aiApproach,
  education,
  experience,
  journey,
  languages,
  positioning,
  principles,
  profile,
  projects,
  qualities,
  quickFacts,
  skillGroups,
  vision,
} from "./about-data";

const journeyTones: Record<string, string> = {
  education: "bg-emerald-500 text-white",
  certificate: "bg-amber-500 text-white",
  work: "bg-primary text-white",
  internship: "bg-sky-500 text-white",
};

const journeyIcons: Record<string, string> = {
  education: "GraduationCap",
  certificate: "Award",
  work: "Briefcase",
  internship: "Briefcase",
};

function statusTone(status: string) {
  if (status === "En ligne") {
    return "border-emerald-300/40 bg-emerald-400/15 text-emerald-100";
  }
  if (status === "En développement") {
    return "border-amber-300/40 bg-amber-400/15 text-amber-100";
  }
  return "border-sky-300/40 bg-sky-400/15 text-sky-100";
}

function companyInitials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AProposContent() {
  return (
    <div>
      <PageHero
        eyebrow="À propos"
        title="Développeur full-stack,"
        highlight="polyvalent par choix."
        description="Diplômé en Systèmes Informatiques et Logiciels, je conçois et développe des solutions numériques en travaillant aussi bien sur le frontend que sur le backend."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
        variant="orb"
      >
        <div className="flex flex-wrap gap-2">
          {quickFacts.map((fact) => {
            const Icon = resolveIcon(fact.icon);
            return (
              <span
                key={fact.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-colors duration-300 hover:border-cyan-300/35 hover:bg-white/[0.07]"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-300" />
                {fact.label}
              </span>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-white px-6 text-slate-950 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
            asChild
          >
            <Link href="/contact" aria-label="Aller à la page de contact">
              Discutons de votre projet
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/15 bg-white/[0.03] text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
            asChild
          >
            <a href={profile.cvUrl} download aria-label="Télécharger le CV">
              <Download className="h-4 w-4" />
              Télécharger le CV
            </a>
          </Button>
          <div className="flex items-center gap-2">
            {[
              { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
              { href: profile.github, label: "GitHub", Icon: Github },
              { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </PageHero>

      <section id="profil" className="section-shell relative bg-white" aria-label="Profil professionnel">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div data-reveal="scale" className="relative">
              <div
                data-parallax="0.05"
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="surface group overflow-hidden rounded-[2rem] p-2 transition-shadow duration-500 hover:shadow-[0_45px_110px_-55px_rgba(37,99,235,0.55)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-slate-100">
                    <Image
                      src="/images/avatar.jpg"
                      alt={`Portrait de ${profile.fullName}`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-1000 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-slate-950/60 p-4 backdrop-blur-md">
                      <p className="font-heading text-lg font-semibold text-white">
                        {profile.fullName}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">{profile.role}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  data-parallax="0.08"
                  className="group absolute -bottom-5 -right-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:-right-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-transform duration-500 group-hover:scale-105">
                      <BadgeCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-sm font-semibold leading-none text-foreground">
                        Diplômé
                      </p>
                      <p className="mt-1 text-xs text-secondary">SIL · 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading
                revealTitle
                align="left"
                index="01"
                label="Profil"
                title="Développeur full-stack,"
                highlight="polyvalent par choix."
              />
              <p className="mt-4 font-heading text-sm font-medium text-primary sm:text-base">
                {profile.title}
              </p>

              <div data-reveal className="mt-6 space-y-4">
                {profile.intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-slate-600 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div
                data-reveal-group
                className="mt-8 grid gap-2.5 sm:grid-cols-2"
              >
                {positioning.map((item) => (
                  <div
                    key={item}
                    data-reveal-item
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white/60 p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-sm leading-snug text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div data-reveal className="mt-8 grid gap-2.5 sm:grid-cols-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 transition-colors hover:border-primary/25"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Email
                    </span>
                    <span className="block truncate text-sm font-medium text-slate-700 group-hover:text-primary">
                      {profile.email}
                    </span>
                  </span>
                </a>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 transition-colors hover:border-primary/25"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">
                      Téléphone
                    </span>
                    <span className="block truncate text-sm font-medium text-slate-700 group-hover:text-primary">
                      {profile.phone}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="parcours" className="section-shell relative bg-slate-50/70" aria-label="Parcours et vision">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="02"
            label="Parcours & vision"
            title="Un parcours"
            highlight="qui se construit sur le terrain."
            description="Du baccalauréat à la licence professionnelle, en passant par l'expérience en entreprise et un stage backend : chaque étape a nourri ma façon de concevoir le développement."
          />

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div data-reveal-group className="relative">
              <div className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-gradient-to-b from-primary/40 via-slate-200 to-transparent" />
              {journey.map((step) => {
                const Icon = resolveIcon(journeyIcons[step.type]);
                return (
                  <div
                    key={`${step.year}-${step.title}`}
                    data-reveal-item
                    className="group relative flex gap-5 pb-7 last:pb-0"
                  >
                    <div
                      className={cn(
                        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-500 group-hover:scale-110",
                        journeyTones[step.type],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="surface surface-interactive flex-1 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="w-fit border-primary/20 bg-primary/[0.04] px-2.5 py-1 font-heading text-[11px] font-semibold uppercase tracking-wider text-primary"
                        >
                          {step.year}
                        </Badge>
                      </div>
                      <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-primary">
                        {step.place}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-5">
              <div
                data-reveal="left"
                className="relative overflow-hidden rounded-[1.75rem] bg-[#05070f] p-7 text-white sm:p-9"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,rgba(37,99,235,0.35),transparent_65%),radial-gradient(ellipse_50%_50%_at_90%_100%,rgba(34,211,238,0.18),transparent_70%)]" />
                <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />
                <Quote className="relative h-8 w-8 text-cyan-300/70" />
                <p className="relative mt-5 font-heading text-lg font-medium italic leading-relaxed text-white sm:text-xl">
                  &ldquo;{vision.quote}&rdquo;
                </p>
              </div>

              <div data-reveal-group className="grid gap-3 sm:grid-cols-2">
                {principles.map((principle) => (
                  <div
                    key={principle.title}
                    data-reveal-item
                    className="surface surface-interactive p-5"
                  >
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>

              <div data-reveal className="surface surface-interactive p-6 sm:p-7">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Ma vision du développement
                </h3>
                <div className="mt-3 space-y-3">
                  {vision.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-slate-500"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="section-shell relative bg-white" aria-label="Expérience professionnelle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="03"
            label="Expérience"
            title="Expériences"
            highlight="professionnelles."
            description="Deux environnements, deux rôles, une même exigence : comprendre le besoin, développer une solution fiable et l'accompagner dans le temps."
          />

          <div className="space-y-6">
            {experience.map((job) => (
              <article
                key={job.company}
                data-reveal
                className="surface surface-interactive group overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-accent" />
                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                  <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform duration-500 group-hover:scale-105">
                        {companyInitials(job.company)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-xl font-semibold text-foreground">
                            {job.company}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                              job.status === "Stage"
                                ? "border-sky-200 bg-sky-50 text-sky-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700",
                            )}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {job.role}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {job.period}
                          {job.location ? ` · ${job.location}` : ""}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-slate-600">
                      {job.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Missions & activités
                    </p>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {job.missions.map((mission) => (
                        <li key={mission} className="flex items-start gap-2">
                          <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-2.5 w-2.5 text-primary" />
                          </span>
                          <span className="text-sm leading-relaxed text-slate-600">
                            {mission}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projets" className="section-shell relative bg-slate-50/70" aria-label="Réalisations et projets">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="04"
            label="Réalisations"
            title="Des projets"
            highlight="pensés pour être utilisés."
            description="Quatre projets, quatre contextes : deux plateformes en ligne, un projet académique de soutenance et une solution de gestion en cours de développement."
          />

          <div className="space-y-6">
            {projects.map((project, index) => {
              const demo = project.links.demo;
              const github = project.links.github;

              return (
                <article
                  key={project.title}
                  data-reveal
                  className="surface surface-interactive group overflow-hidden"
                >
                  <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
                    <div
                      className={cn(
                        "relative overflow-hidden bg-gradient-to-br p-6 text-white sm:p-8",
                        brandGradient(index),
                      )}
                    >
                      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />
                      <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-heading text-xs font-semibold tracking-[0.22em] text-white/60 transition-transform duration-500 group-hover:translate-x-1">
                            {project.number}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                              statusTone(project.status),
                            )}
                          >
                            {project.status}
                          </span>
                        </div>

                        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                          {project.type}
                        </p>
                        <h3 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">
                          {project.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/75">
                          {project.description}
                        </p>

                        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                              Rôle
                            </dt>
                            <dd className="mt-0.5 text-white/90">{project.role}</dd>
                          </div>
                          <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                              Contexte
                            </dt>
                            <dd className="mt-0.5 text-white/90">
                              {project.context}
                            </dd>
                          </div>
                        </dl>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {demo && (
                            <a
                              href={demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Voir le site
                            </a>
                          )}
                          {github && (
                            <a
                              href={github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                            >
                              <Github className="h-3.5 w-3.5" />
                              Code source
                            </a>
                          )}
                          {!demo && !github && (
                            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/50">
                              Lien non public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Contribution
                        </p>
                        <span className="text-xs tabular-nums text-slate-400">
                          {project.contributions.length} points
                        </span>
                      </div>
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {project.contributions.map((contribution) => (
                          <li
                            key={contribution}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-2.5 w-2.5 text-primary" />
                            </span>
                            <span className="text-sm leading-relaxed text-slate-600">
                              {contribution}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Technologies
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p data-reveal className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            ELISPOS est un projet personnel en cours de développement. Les
            fonctionnalités décrites correspondent à l&apos;état actuel du travail,
            pas à un produit commercialisé.
          </p>
        </div>
      </section>

      <section id="competences" className="section-shell relative bg-white" aria-label="Compétences techniques">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="05"
            label="Compétences"
            title="Une base technique"
            highlight="polyvalente."
            description="Des langages, des frameworks, des bases de données et des outils que j'utilise ou que j'ai pratiqués dans mes projets et ma formation."
          />

          <div
            data-reveal-group
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {skillGroups.map((group) => {
              const Icon = resolveIcon(group.icon);
              return (
                <article
                  key={group.title}
                  data-reveal-item
                  className="surface surface-interactive group flex h-full flex-col p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="icon-tile h-11 w-11 shrink-0 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {group.title}
                    </h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <p data-reveal className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            Cette liste décrit les technologies pratiquées, sans prétendre à un
            niveau d&apos;expertise certifié pour chacune.
          </p>
        </div>
      </section>

      <section
        id="ia"
        className="section-shell relative overflow-hidden bg-[#05070f]"
        aria-label="Intelligence artificielle et automatisation"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_15%_0%,rgba(37,99,235,0.28),transparent_65%),radial-gradient(ellipse_45%_45%_at_90%_80%,rgba(34,211,238,0.14),transparent_70%)]" />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.035]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div data-reveal="right">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                06 — IA & automatisation
              </span>
              <h2 className="section-heading mt-6 !text-white">
                L&apos;IA comme{" "}
                <span className="gradient-text-light">accélérateur</span>, pas
                comme étiquette.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400">
                {aiApproach.intro}
              </p>
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-slate-300">
                  {aiApproach.disclaimer}
                </p>
              </div>
            </div>

            <div data-reveal-group className="grid gap-3 sm:grid-cols-2">
              {aiApproach.uses.map((use) => {
                const Icon = resolveIcon(use.icon);
                return (
                  <div
                    key={use.title}
                    data-reveal-item
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-cyan-300/25 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-heading text-sm font-semibold text-white">
                      {use.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {use.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="formation" className="section-shell relative bg-slate-50/70" aria-label="Parcours académique">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="07"
            label="Formation"
            title="Un socle"
            highlight="académique solide."
            description="Trois étapes qui structurent mon parcours : le baccalauréat scientifique, un certificat en analyse de données et une licence professionnelle en Systèmes Informatiques et Logiciels."
          />

          <div data-reveal-group className="grid gap-4 md:grid-cols-3">
            {education.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <article
                  key={item.degree}
                  data-reveal-item
                  className="surface surface-interactive group flex h-full flex-col p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="icon-tile h-12 w-12 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge
                      variant="outline"
                      className="border-primary/20 bg-primary/[0.05] text-[10px] font-semibold uppercase tracking-wider text-primary"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.year}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground">
                    {item.degree}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {item.institution}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{item.location}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div
            data-reveal
            className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5 sm:items-center sm:p-6"
          >
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 sm:mt-0" />
            <p className="text-sm leading-relaxed text-emerald-900/80">
              La Licence Professionnelle en Systèmes Informatiques et Logiciels a
              été obtenue en 2026. Je suis diplômé, et non en cours de formation
              pour ce diplôme.
            </p>
          </div>
        </div>
      </section>

      <section id="qualites" className="section-shell relative bg-white" aria-label="Qualités professionnelles et langues">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            revealTitle
            index="08"
            label="Savoir-être"
            title="Des qualités"
            highlight="au service du concret."
            description="Au-delà des technologies, ma manière de travailler repose sur des habitudes simples : comprendre, vérifier, communiquer et continuer à apprendre."
          />

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div data-reveal-group className="grid gap-3 sm:grid-cols-2">
              {qualities.map((quality) => (
                <div
                  key={quality.title}
                  data-reveal-item
                  className="surface p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {quality.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {quality.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div data-reveal="left" className="surface surface-interactive p-6">
                <div className="flex items-center gap-2 text-primary">
                  <LanguagesIcon className="h-4 w-4" />
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.16em]">
                    Langues
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {languages.map((language) => (
                    <li
                      key={language.name}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {language.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {language.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                data-reveal="left"
                data-reveal-delay="0.1"
                className="relative overflow-hidden rounded-2xl bg-[#05070f] p-6 text-white"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgba(34,211,238,0.16),transparent_70%)]" />
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
                  En résumé
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-300">
                  Un profil capable d&apos;apprendre, de s&apos;adapter et de
                  travailler sur des environnements techniques différents, sans se
                  limiter à un seul écosystème.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell relative bg-slate-50/70" aria-label="Appel à la collaboration">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-reveal="scale"
            className="relative overflow-hidden rounded-[2rem] bg-[#05070f] px-6 py-14 text-center text-white sm:px-10 sm:py-20"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(37,99,235,0.32),transparent_65%),radial-gradient(ellipse_45%_45%_at_100%_100%,rgba(34,211,238,0.16),transparent_70%)]" />
            <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.04]" />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Collaboration
              </span>
              <h2 className="mt-6 font-heading text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                Un projet, une équipe,{" "}
                <span className="gradient-text-light">une idée ?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
                Je suis ouvert aux collaborations, aux opportunités
                professionnelles et aux projets où je peux contribuer du frontend
                au backend, de la conception au déploiement.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-6 text-slate-950 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white"
                  asChild
                >
                  <Link href="/contact">
                    Me contacter
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/[0.03] text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
                  asChild
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  asChild
                >
                  <a href={profile.cvUrl} download>
                    <Download className="h-4 w-4" />
                    CV
                  </a>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {profile.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
