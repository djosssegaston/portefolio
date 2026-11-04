"use client"

import Link from "next/link"
import PageHero from "@/components/layout/PageHero"
import { ArrowLeft, Github, ExternalLink, Calendar, CheckCircle2, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"
import type { Project } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProjectDetailPage({ project, related }: { project: Project; related: Project[] }) {

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Projet non trouvé</h1>
          <p className="text-muted-foreground mb-8">Le projet que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/projets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    saas: "SaaS",
    ecommerce: "E-commerce",
    mobile: "Mobile",
    dashboard: "Dashboard",
    api: "API",
    web: "Web",
  }

  const isInProgress = project.results.some((result) => /en cours|développement/i.test(result))
  const isAcademic = project.results.some((result) => /académique|soutenance/i.test(result))
  const projectStatusLabel = isInProgress
    ? "En développement"
    : isAcademic
      ? "Projet académique"
      : "Projet livré"

  return (
    <div>
      <PageHero
        eyebrow="Étude de cas"
        title={project.title}
        description={project.description}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Projets", href: "/projets" },
          { label: project.title },
        ]}
        variant="ribbon"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            {categoryLabels[project.category] ?? project.category}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-cyan-300" />
            {new Date(project.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            {project.status === "published" ? projectStatusLabel : "Archivé"}
          </span>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
          data-reveal="scale"
        >
          <div className="md:col-span-2 h-64 md:h-96 rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/20">{project.title.charAt(0)}</span>
          </div>
          {project.gallery.slice(0, 4).map((_, idx) => (
            <div
              key={idx}
              className="h-48 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200/50 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-secondary-300">{project.title.charAt(0)}{idx + 1}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section data-reveal="up">
              <h2 className="font-heading text-2xl font-bold mb-4">À propos du projet</h2>
              <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
            </section>

            {project.problem && (
              <section data-reveal="up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold">Problématique</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
              </section>
            )}

            {project.solution && (
              <section data-reveal="up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold">Solution</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
              </section>
            )}

            {project.keyFeatures.length > 0 && (
              <section data-reveal="up">
                <h2 className="font-heading text-2xl font-bold mb-4">Fonctionnalités clés</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.results.length > 0 && (
              <section data-reveal="up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold">Résultats</h2>
                </div>
                <ul className="space-y-3">
                  {project.results.map((result, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{result}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.testimonial && (
              <section data-reveal="up">
                <Card className="bg-primary-50 border-primary-100">
                  <CardContent className="p-8">
                    <p className="text-lg italic text-foreground mb-6">
                      &ldquo;{project.testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={project.testimonial.avatar} alt={project.testimonial.name} />
                        <AvatarFallback>{project.testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{project.testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.testimonial.position}, {project.testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          <div
            className="space-y-8"
            data-reveal="left"
            data-reveal-delay="0.1"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-heading font-semibold mb-4">Liens</h3>
                {project.githubUrl && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="w-4 h-4 mr-2" /> Code source
                    </Link>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild className="w-full justify-start">
                    <Link href={project.demoUrl} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" /> Démonstration
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Catégorie</span>
                    <span className="font-medium capitalize">{categoryLabels[project.category] ?? project.category}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date(project.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>
                      {project.status === "published" ? projectStatusLabel : "Archivé"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-secondary-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold mb-8">Projets similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link key={rp.slug} href={`/projets/${rp.slug}`} className="group">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">{rp.title.charAt(0)}</span>
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-2">{categoryLabels[rp.category] ?? rp.category}</Badge>
                      <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{rp.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
