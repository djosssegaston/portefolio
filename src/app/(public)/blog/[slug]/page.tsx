"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Send,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { blogPosts } from "@/lib/data/blog-posts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

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

function formatContent(content: string) {
  return content.split("\n\n").map((paragraph, idx) => {
    const trimmed = paragraph.trim()
    if (!trimmed) return null
    if (trimmed.startsWith("```")) {
      const codeMatch = trimmed.match(/```(\w+)?\n([\s\S]*?)```/)
      if (codeMatch) {
        return (
          <pre
            key={idx}
            className="my-6 overflow-x-auto rounded-xl bg-muted p-4 text-sm leading-relaxed"
          >
            <code>{codeMatch[2]}</code>
          </pre>
        )
      }
      return null
    }
    return (
      <p key={idx} className="mb-6 leading-relaxed text-muted-foreground">
        {trimmed}
      </p>
    )
  })
}

export default function BlogPostPage() {
  const params = useParams()
  const post = blogPosts.find((p) => p.slug === params.slug)

  const [commentName, setCommentName] = useState("")
  const [commentEmail, setCommentEmail] = useState("")
  const [commentContent, setCommentContent] = useState("")

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const validatedComments = post.comments.filter((c) => c.validated)
  const relatedPosts = blogPosts.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, 3)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = encodeURIComponent(post.title)

  const shareLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "X",
      url: `https://x.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`,
      bg: "bg-neutral-900 hover:bg-neutral-800",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      bg: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`,
      bg: "bg-green-600 hover:bg-green-700",
    },
  ]

  const gradient = gradients[blogPosts.indexOf(post) % gradients.length]

  return (
    <div className="pt-20">
      <div className={cn("relative py-20 bg-gradient-to-br", gradient)}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Link>
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              {post.category}
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                  <AvatarFallback className="text-sm bg-white/20 text-white">
                    {getInitials(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{post.author}</p>
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime} min de lecture
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {formatContent(post.content)}
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </motion.div>

        <Separator className="my-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-xl font-bold">Partager cet article</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                asChild
                size="sm"
                className={cn("text-white border-0", link.bg)}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </Button>
            ))}
          </div>
        </motion.div>

        <Separator className="my-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-xl font-bold">
              Commentaires ({validatedComments.length})
            </h2>
          </div>

          {validatedComments.length > 0 ? (
            <div className="space-y-6 mb-10">
              {validatedComments.map((comment) => (
                <Card key={comment.id} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {getInitials(comment.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{comment.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-10">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">Aucun commentaire pour le moment</p>
            </div>
          )}

          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold mb-2">Laisser un commentaire</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Votre adresse email ne sera pas publiée.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Votre nom"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      aria-label="Votre nom"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Votre email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      aria-label="Votre email"
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Votre commentaire..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  aria-label="Votre commentaire"
                />
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Publier le commentaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="bg-secondary-50/50 py-16 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp, idx) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                    <div
                      className={cn(
                        "relative flex h-48 items-center justify-center bg-gradient-to-br",
                        gradients[idx % gradients.length],
                      )}
                    >
                      <span className="select-none text-4xl font-bold text-white/20">
                        {rp.title.charAt(0)}
                      </span>
                      <Badge className="absolute left-3 top-3 bg-background/80 text-xs font-medium text-foreground backdrop-blur-sm">
                        {rp.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {rp.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(rp.date)}
                        <span className="mx-1">&bull;</span>
                        <Clock className="h-3.5 w-3.5" />
                        {rp.readTime} min
                      </div>
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
