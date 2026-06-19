"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Calendar, CheckCircle2, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"
import { projects } from "@/lib/data/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProjectDetailPage() {
  const params = useParams()
  const project = projects.find((p) => p.slug === params.slug)

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

  const relatedProjects = projects.filter(
    (p) => p.category === project.category && p.slug !== project.slug
  ).slice(0, 3)

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/projets"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge>{categoryLabels[project.category] ?? project.category}</Badge>
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(project.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{project.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold mb-4">À propos du projet</h2>
              <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold">Problématique</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold">Solution</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{project.solution}</p>
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
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
            </motion.section>

            {project.testimonial && (
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
              </motion.section>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
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
                      {project.status === "published" ? "Terminé" : "Archivé"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="bg-secondary-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold mb-8">Projets similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rp, idx) => (
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
