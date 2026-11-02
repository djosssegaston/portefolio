"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Clock, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { blogPosts as staticBlogPosts } from "@/lib/data/blog-posts";

const categoryFilters = [
  { value: "all", label: "Tous" },
  { value: "Développement", label: "Développement" },
  { value: "Technologie", label: "Technologie" },
  { value: "Business", label: "Business" },
] as const;

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
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

export default function Blog({
  blogPosts = staticBlogPosts,
}: {
  blogPosts?: BlogPost[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return blogPosts.filter((post) => {
      if (activeCategory !== "all" && post.category !== activeCategory)
        return false;
      if (
        query &&
        !post.title.toLowerCase().includes(query) &&
        !post.excerpt.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  }, [searchQuery, activeCategory, blogPosts]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("gsap:refresh"));
    });
    return () => cancelAnimationFrame(frame);
  }, [filteredPosts]);

  return (
    <section id="blog" className="section-shell relative bg-card/60" aria-label="Blog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Blog</div>
          <h2 className="section-heading mt-5">
            Articles & <span className="gradient-text">Tutoriels</span>
          </h2>
          <p className="section-desc">
            Articles, tutoriels et réflexions sur le développement et la tech
          </p>
        </div>

        <div data-reveal className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border border-slate-200/70 bg-white pl-11 text-foreground shadow-sm placeholder:text-secondary/50"
              aria-label="Rechercher un article"
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

        {filteredPosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(0, 3).map((post, index) => (
              <div key={post.id} data-reveal>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
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
                        {post.title.charAt(0)}
                      </span>
                      <Badge className="absolute left-3 top-3 bg-white/15 text-xs font-medium text-white backdrop-blur-md">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
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
                        <div className="flex items-center gap-3 text-xs text-secondary">
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
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                        Lire l&rsquo;article
                        <ArrowRight className="h-4 w-4" />
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
            <p className="text-lg font-medium text-secondary">Aucun article trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou filtre
            </p>
          </div>
        )}

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-heading text-base font-semibold text-primary transition-colors hover:text-primary-600"
            aria-label="Voir tous les articles"
          >
            Voir tous les articles
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
