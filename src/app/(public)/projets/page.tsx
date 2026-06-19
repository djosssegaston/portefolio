"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { projects } from "@/lib/data/projects"

const categoryFilters = [
  { value: "all", label: "Tous" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Mobile" },
  { value: "dashboard", label: "Dashboard" },
  { value: "api", label: "API" },
  { value: "web", label: "Web" },
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

export default function ProjectsPage() {
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
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">Mes Projets</h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Découvrez une sélection de projets qui reflètent mon expertise et ma passion pour le développement
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Rechercher un projet"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  layout
                >
                  <Link href={`/projets/${project.slug}`} className="group block h-full">
                    <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
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
                          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-current" />
                            Projet phare
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 shadow-lg"
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
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-xs font-medium text-primary hover:bg-primary/20"
                          >
                            {categoryFilters.find((c) => c.value === project.category)?.label ?? project.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(project.date)}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="border-border/50 text-xs font-normal text-muted-foreground"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-primary-500 transition-transform duration-300 group-hover:scale-x-100" />
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">Aucun projet trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Essayez de modifier votre recherche ou filtre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
