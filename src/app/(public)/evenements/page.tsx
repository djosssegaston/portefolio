"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search, ExternalLink, Calendar, MapPin, GraduationCap, Mic, Wrench,
  Trophy, Users, Clock, Star, Award, ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { events } from "@/lib/data/events"

const typeFilters = [
  { value: "all", label: "Tous" },
  { value: "formation", label: "Formations" },
  { value: "conference", label: "Conférences" },
  { value: "workshop", label: "Ateliers" },
  { value: "hackathon", label: "Hackathons" },
  { value: "meetup", label: "Meetups" },
] as const

const typeIcons: Record<string, React.ElementType> = {
  formation: GraduationCap,
  conference: Mic,
  workshop: Wrench,
  hackathon: Trophy,
  meetup: Users,
  autre: Calendar,
}

const typeLabels: Record<string, string> = {
  formation: "Formation",
  conference: "Conférence",
  workshop: "Atelier",
  hackathon: "Hackathon",
  meetup: "Meetup",
  autre: "Autre",
}

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState("all")

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return events.filter((evt) => {
      if (activeType !== "all" && evt.type !== activeType) return false
      if (query && !evt.title.toLowerCase().includes(query) && !evt.organizer.toLowerCase().includes(query)) return false
      return true
    })
  }, [searchQuery, activeType])

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Événements & Formations
            </h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Les formations, conférences et événements qui enrichissent mon parcours professionnel
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
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Rechercher un événement"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {typeFilters.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeType === type.value
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {type.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={activeType + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredEvents.map((evt, index) => {
                const TypeIcon = typeIcons[evt.type] || Calendar
                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <Link href={`/evenements/${evt.slug}`} className="group block h-full">
                      <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                        <div className="relative h-48 overflow-hidden">
                          {evt.image ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-primary/30" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "flex h-full items-center justify-center bg-gradient-to-br",
                                gradients[index % gradients.length],
                              )}
                            >
                              <TypeIcon className="h-16 w-16 text-white/20" />
                            </div>
                          )}
                          {evt.featured && (
                            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm z-10">
                              <Star className="h-3 w-3 fill-current" />
                              À la une
                            </div>
                          )}
                          {evt.status === "upcoming" && (
                            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm z-10">
                              <Clock className="h-3 w-3" />
                              À venir
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-2 shadow-lg"
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `/evenements/${evt.slug}`
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              Voir les détails
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-xs font-medium text-primary hover:bg-primary/20"
                            >
                              {typeLabels[evt.type] || evt.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(evt.startDate)}
                            </span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {evt.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {evt.description}
                          </p>
                          <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {evt.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {evt.endDate
                                ? `${formatDate(evt.startDate)} - ${formatDate(evt.endDate)}`
                                : formatDate(evt.startDate)}
                            </span>
                            {evt.certificate && (
                              <span className="flex items-center gap-1.5 text-amber-600">
                                <Award className="h-3.5 w-3.5" />
                                Certificat délivré
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-1.5">
                            {evt.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-border/50 text-xs font-normal text-muted-foreground"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {evt.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{evt.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </CardContent>
                        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-primary-500 transition-transform duration-300 group-hover:scale-x-100" />
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
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
              <p className="text-lg font-medium text-muted-foreground">Aucun événement trouvé</p>
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
