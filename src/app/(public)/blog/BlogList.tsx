"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { blogPosts as staticBlogPosts } from "@/lib/data/blog-posts";

const POSTS_PER_PAGE = 6;

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

const categoryLabels: Record<string, string> = {
  all: "Tous",
  Développement: "Développement",
  Technologie: "Technologie",
  Business: "Business",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage({
  blogPosts = staticBlogPosts,
}: {
  blogPosts?: BlogPost[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const lastFilter = useRef<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((post) => post.category));
    return ["all", ...Array.from(cats)];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return blogPosts.filter((post) => {
      if (activeCategory !== "all" && post.category !== activeCategory) return false;
      if (
        query &&
        !post.title.toLowerCase().includes(query) &&
        !post.excerpt.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [searchQuery, activeCategory, blogPosts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Re-animating on every keystroke makes search feel broken; only page and
    // category changes should replay the entrance.
    const filterKey = `${activeCategory}:${currentPage}`;
    const filterChanged = lastFilter.current !== filterKey;
    lastFilter.current = filterKey;

    if (!filterChanged) {
      if (emptyRef.current) gsap.set(emptyRef.current, { opacity: 1, y: 0 });
      return;
    }

    if (reduced) {
      if (gridRef.current) gsap.set(Array.from(gridRef.current.children), { opacity: 1, y: 0 });
      return;
    }

    if (paginatedPosts.length > 0 && gridRef.current) {
      gsap.fromTo(
        Array.from(gridRef.current.children),
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
  }, [paginatedPosts, currentPage, activeCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div>
      <PageHero
        eyebrow="Journal"
        title="Idées, pratique"
        highlight="et retours d'expérience."
        description="Articles, tutoriels et réflexions sur le développement web, la technologie et l'innovation."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Blog" }]}
        variant="waves"
      >
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            {blogPosts.length} articles publiés
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5 text-cyan-300" />
            Lectures courtes et concrètes
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
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-12 rounded-xl border-border/70 bg-white pl-11 text-sm shadow-sm"
                aria-label="Rechercher un article"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-900",
                  )}
                >
                  {categoryLabels[category] ?? category}
                </button>
              ))}
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_30px_70px_-45px_rgba(37,99,235,0.5)]">
                    <div
                      className={cn(
                        "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br",
                        gradients[index % gradients.length],
                      )}
                    >
                      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
                      <span className="relative select-none font-heading text-7xl font-bold text-white/25 transition-transform duration-700 group-hover:scale-110">
                        {post.title.charAt(0)}
                      </span>
                      <Badge className="absolute left-3 top-3 border-0 bg-white/85 text-xs font-medium text-slate-900 backdrop-blur-sm hover:bg-white">
                        {post.category}
                      </Badge>
                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h2 className="font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={post.authorAvatar} alt={post.author} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(post.author)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground">
                            {post.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime} min
                          </span>
                        </div>
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
              <p className="text-lg font-medium text-muted-foreground">Aucun article trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Essayez de modifier votre recherche ou votre filtre.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setCurrentPage(1);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4" data-reveal="up">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={cn(
                      "h-9 w-9 rounded-md text-sm font-medium transition-all duration-200",
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900",
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
