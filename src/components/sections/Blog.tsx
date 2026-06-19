"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Clock, ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { blogPosts } from "@/lib/data/blog-posts"

const categoryFilters = [
  { value: "all", label: "Tous" },
  { value: "Développement", label: "Développement" },
  { value: "Technologie", label: "Technologie" },
  { value: "Business", label: "Business" },
] as const

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-600",
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return blogPosts.filter((post) => {
      if (activeCategory !== "all" && post.category !== activeCategory)
        return false
      if (
        query &&
        !post.title.toLowerCase().includes(query) &&
        !post.excerpt.toLowerCase().includes(query)
      )
        return false
      return true
    })
  }, [searchQuery, activeCategory])

  return (
    <section
      id="blog"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Blog"
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
            Blog
          </div>
          <h2 className="section-heading mt-4">
            Articles & <span className="gradient-text">Tutoriels</span>
          </h2>
          <p className="section-desc">
            Articles, tutoriels et réflexions
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 text-foreground placeholder:text-secondary/50"
              aria-label="Rechercher un article"
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

        {filteredPosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <div className="relative h-full overflow-hidden rounded-lg border border-border bg-card">
                    <div
                      className={cn(
                        "relative flex h-48 items-center justify-center bg-gradient-to-br",
                        gradients[index % gradients.length],
                      )}
                    >
                      <span className="select-none text-6xl font-bold text-white/20">
                        {post.title.charAt(0)}
                      </span>
                      <Badge className="absolute left-3 top-3 bg-background/80 text-xs font-medium text-foreground">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={post.authorAvatar}
                              alt={post.author}
                            />
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-lg font-medium text-secondary">
              Aucun article trouvé
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
            href="/blog"
            className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-primary transition-colors hover:text-primary-300"
            aria-label="Voir tous les articles"
          >
            Voir tous les articles
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
