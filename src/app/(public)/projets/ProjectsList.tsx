"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Search, Sparkles, Star } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { projects as staticProjects } from "@/lib/data/projects";

const categoryFilters = [
  { value: "all", label: "Tous" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Mobile" },
  { value: "dashboard", label: "Dashboard" },
  { value: "api", label: "API" },
  { value: "web", label: "Web" },
] as const;

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });
}

export default function ProjectsPage({
  projects = staticProjects,
}: {
  projects?: Project[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const lastFilter = useRef<string | null>(null);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return projects.filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory) return false;
      if (query && !project.title.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [searchQuery, activeCategory, projects]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Typing in the search box must not re-hide the grid on every keystroke:
    // only real filter changes (category/first render) get an entrance.
    const filterChanged = lastFilter.current !== activeCategory;
    lastFilter.current = activeCategory;

    if (!filterChanged) {
      if (emptyRef.current) gsap.set(emptyRef.current, { opacity: 1, y: 0 });
      return;
    }

    if (reduced) {
      if (gridRef.current) gsap.set(Array.from(gridRef.current.children), { opacity: 1, y: 0 });
      return;
    }

    if (filteredProjects.length > 0 && gridRef.current) {
      const cards = Array.from(gridRef.current.children);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
          overwrite: true,
          clearProps: "transform,opacity",
        },
      );
      return;
    }

    if (emptyRef.current) {
      gsap.fromTo(
        emptyRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true },
      );
    }
  }, [filteredProjects, activeCategory]);

  return (
    <div>
      <PageHero
        eyebrow="Portfolio"
        title="Des projets qui"
        highlight="parlent d'eux-mêmes."
        description="Une sélection de produits conçus avec soin : plateformes SaaS, applications mobiles, dashboards et outils métiers."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Projets" }]}
        variant="ribbon"
      >
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            {projects.length} projets publiés
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 text-amber-300" />
            Produits en production
          </span>
        </div>
      </PageHero>

      <section className="section-shell !pt-16 sm:!pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="surface mx-auto mb-12 max-w-4xl p-4 sm:p-5" data-reveal="up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un projet par titre..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 rounded-xl border-border/70 bg-white pl-11 text-sm shadow-sm"
                aria-label="Rechercher un projet"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryFilters.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  aria-pressed={activeCategory === category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    activeCategory === category.value
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-900",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div
              ref={gridRef}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projets/${project.slug}`}
                  className="group block h-full"
                >
                  <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_30px_70px_-45px_rgba(37,99,235,0.5)]">
                    <div
                      className={cn(
                        "relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br",
                        gradients[index % gradients.length],
                      )}
                    >
                      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
                      <span className="relative select-none font-heading text-7xl font-bold text-white/25 transition-transform duration-700 group-hover:scale-110">
                        {project.title.charAt(0)}
                      </span>
                      {project.featured && (
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                          <Star className="h-3 w-3 fill-current" />
                          Projet phare
                        </div>
                      )}
                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Voir le projet
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-xs font-medium text-primary hover:bg-primary/15"
                        >
                          {categoryFilters.find((c) => c.value === project.category)?.label ??
                            project.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(project.date)}
                        </span>
                      </div>
                      <h2 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {project.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-border/60 text-xs font-normal text-muted-foreground"
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
                    <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div ref={emptyRef} className="py-20 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">Aucun projet trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Essayez de modifier votre recherche ou votre filtre.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
