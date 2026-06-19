"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { blogPosts } from "@/lib/data/blog-posts"

const POSTS_PER_PAGE = 6

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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category))
    return ["all", ...Array.from(cats)]
  }, [])

  const categoryLabels: Record<string, string> = {
    all: "Tous",
    Développement: "Développement",
    Technologie: "Technologie",
    Business: "Business",
  }

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return blogPosts.filter((post) => {
      if (activeCategory !== "all" && post.category !== activeCategory) return false
      if (query && !post.title.toLowerCase().includes(query) && !post.excerpt.toLowerCase().includes(query))
        return false
      return true
    })
  }, [searchQuery, activeCategory])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">Blog</h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Articles, tutoriels et réflexions sur le développement web, la technologie et l&apos;innovation
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
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
              aria-label="Rechercher un article"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setCurrentPage(1)
              }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {paginatedPosts.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery + currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  layout
                >
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                      <div
                        className={cn(
                          "relative flex h-48 items-center justify-center bg-gradient-to-br",
                          gradients[index % gradients.length],
                        )}
                      >
                        <span className="select-none text-6xl font-bold text-white/20">
                          {post.title.charAt(0)}
                        </span>
                        <Badge className="absolute left-3 top-3 bg-background/80 text-xs font-medium text-foreground backdrop-blur-sm hover:bg-background/90">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={post.authorAvatar} alt={post.author} />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(post.author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground">{post.author}</span>
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
                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                          Lire l&rsquo;article
                          <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
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
              <p className="text-lg font-medium text-muted-foreground">Aucun article trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Essayez de modifier votre recherche ou filtre
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "h-9 w-9 rounded-md text-sm font-medium transition-all duration-200",
                    currentPage === page
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
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
          </motion.div>
        )}
      </div>
    </div>
  )
}
