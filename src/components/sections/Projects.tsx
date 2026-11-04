"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects as staticProjects } from "@/lib/data/projects";

const categoryLabels: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  saas: "SaaS",
  ecommerce: "E-commerce",
  dashboard: "Dashboard",
  api: "API",
};

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
];

export default function Projects({
  projects = staticProjects,
}: {
  projects?: Project[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categoryFilters = useMemo(() => {
    const values = Array.from(new Set(projects.map((project) => project.category)));
    return [
      { value: "all", label: "Tous" },
      ...values.map((value) => ({ value, label: categoryLabels[value] ?? value })),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return projects.filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory)
        return false;
      if (query && !project.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [searchQuery, activeCategory, projects]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("gsap:refresh"));
    });
    return () => cancelAnimationFrame(frame);
  }, [filteredProjects]);

  return (
    <section
      id="projects"
      className="section-shell relative bg-card/60"
      aria-label="Mes projets"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Projets</div>
          <h2 className="section-heading mt-5">
            Mes <span className="gradient-text">Réalisations</span>
          </h2>
          <p className="section-desc">
            Une sélection de projets qui reflètent mon expertise et ma passion
            pour le développement
          </p>
        </div>

        <div data-reveal className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border border-slate-200/70 bg-white pl-11 text-foreground shadow-sm placeholder:text-secondary/50"
              aria-label="Rechercher un projet"
            />
          </div>
        </div>

        <div data-reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:text-sm",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-transparent bg-white/70 text-secondary hover:border-slate-200 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <div key={project.id} data-reveal>
                <Link href={`/projets/${project.slug}`} className="group block h-full">
                  <div className="surface surface-interactive relative h-full overflow-hidden">
                    <div
                      className={cn(
                        "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br",
                        gradients[index % gradients.length],
                      )}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      <span className="relative select-none font-heading text-6xl font-bold text-white/25 transition-transform duration-500 group-hover:scale-110">
                        {project.title.charAt(0)}
                      </span>
                      {project.featured && (
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          <Star className="h-3 w-3 fill-current" />
                          Projet phare
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2 rounded-full shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/projets/${project.slug}`;
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
                          {categoryFilters.find((c) => c.value === project.category)
                            ?.label ?? project.category}
                        </Badge>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
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
                            className="border-slate-200 text-xs font-normal text-secondary"
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
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-lg font-medium text-secondary">Aucun projet trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou filtre
            </p>
          </div>
        )}

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/projets"
            className="group inline-flex items-center gap-2 font-heading text-base font-semibold text-primary transition-colors hover:text-primary-600"
            aria-label="Voir tous les projets"
          >
            Voir tous les projets
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
