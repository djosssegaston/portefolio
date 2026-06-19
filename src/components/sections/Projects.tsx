"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight, ExternalLink, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { projects } from "@/lib/data/projects"

const categoryFilters = [
  { value: "all", label: "Tous" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "dashboard", label: "Dashboard" },
  { value: "api", label: "API" },
] as const

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-teal-400 to-cyan-600",
  "from-fuchsia-500 to-purple-600",
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  })
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return projects.filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory) return false
      if (query && !project.title.toLowerCase().includes(query)) return false
      return true
    })
  }, [searchQuery, activeCategory])

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Mes projets"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="section-label mx-auto w-fit">
            Projets
          </div>
          <h2 className="section-heading mt-4">
            Mes <span className="gradient-text">Réalisations</span>
          </h2>
          <p className="section-desc">
            Une sélection de projets qui reflètent mon expertise et ma passion
            pour le développement
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 text-foreground placeholder:text-secondary/50"
              aria-label="Rechercher un projet"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-secondary hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <Link href={`/projets/${project.slug}`} className="group block h-full">
                  <div className="relative h-full overflow-hidden rounded-lg border border-border bg-card">
                    <div
                      className={cn(
                        "relative flex h-48 items-center justify-center bg-gradient-to-br",
                        gradients[index % gradients.length],
                      )}
                    >
                      <span className="select-none text-6xl font-bold text-white/20">
                        {project.title.charAt(0)}
                      </span>
                      {project.featured && (
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          <Star className="h-3 w-3 fill-current" />
                          Projet phare
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2 shadow-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.href = `/projets/${project.slug}`
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Voir le projet
                        </Button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="default" className="text-xs font-medium">
                          {categoryFilters.find((c) => c.value === project.category)?.label ?? project.category}
                        </Badge>
                        <span className="text-xs text-secondary">
                          {formatDate(project.date)}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs font-normal text-secondary"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-secondary">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-lg font-medium text-secondary">
              Aucun projet trouvé
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou filtre
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-primary transition-colors hover:text-primary-300"
            aria-label="Voir tous les projets"
          >
            Voir tous les projets
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
