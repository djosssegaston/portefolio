"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, Calendar, MapPin, GraduationCap, Mic, Wrench, Trophy,
  Users, Clock, Award, ExternalLink, User, Building, Tag, CheckCircle2,
  Globe, ImageIcon
} from "lucide-react"
import { events } from "@/lib/data/events"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDateRange(start: string, end?: string) {
  const startDate = new Date(start)
  if (!end) return formatDate(start)
  const endDate = new Date(end)
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `Du ${startDate.getDate()} au ${endDate.toLocaleDateString("fr-FR", opts)}`
  }
  return `Du ${formatDate(start)} au ${formatDate(end)}`
}

export default function EventDetailPage() {
  const params = useParams()
  const evt = events.find((e) => e.slug === params.slug)

  if (!evt) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Événement non trouvé</h1>
          <p className="text-muted-foreground mb-8">L&apos;événement que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/evenements">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux événements
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const TypeIcon = typeIcons[evt.type] || Calendar

  const relatedEvents = events.filter(
    (e) => (e.type === evt.type || e.tags.some((t) => evt.tags.includes(t))) && e.slug !== evt.slug
  ).slice(0, 3)

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/evenements"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux événements
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge>{typeLabels[evt.type] || evt.type}</Badge>
              {evt.status === "upcoming" && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                  <Clock className="w-3 h-3 mr-1" />
                  À venir
                </Badge>
              )}
              {evt.status === "completed" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  Terminé
                </Badge>
              )}
              {evt.featured && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                  À la une
                </Badge>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{evt.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{evt.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl font-bold mb-4">À propos de l&apos;événement</h2>
              <p className="text-muted-foreground leading-relaxed">{evt.longDescription}</p>
            </motion.section>

            {evt.gallery && evt.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-2xl font-bold mb-6">Galerie</h2>
                <div className={cn(
                  "grid gap-4",
                  evt.gallery.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}>
                  {evt.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "relative overflow-hidden rounded-xl bg-muted",
                        idx === 0 && evt.gallery.length > 2 ? "sm:col-span-2" : "",
                        evt.gallery.length === 1 ? "h-80" : "h-48"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-primary/30" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="select-none text-4xl font-bold text-primary/10">
                          {evt.title.charAt(0)}{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {evt.speaker && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold">Intervenant</h2>
                </div>
                <Card className="bg-primary-50 border-primary-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{evt.speaker}</p>
                      </div>
                    </div>
                    {evt.speakerBio && (
                      <p className="text-muted-foreground text-sm leading-relaxed">{evt.speakerBio}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {evt.skills.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold">Compétences acquises</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {evt.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-heading font-semibold mb-4">Informations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{formatDateRange(evt.startDate, evt.endDate)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Lieu</p>
                      <p className="text-muted-foreground">{evt.location}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Organisateur</p>
                      {evt.organizerUrl ? (
                        <Link
                          href={evt.organizerUrl}
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {evt.organizer}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <p className="text-muted-foreground">{evt.organizer}</p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Type</p>
                      <Badge variant="secondary">{typeLabels[evt.type] || evt.type}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Certificat</p>
                      <p className="text-muted-foreground">
                        {evt.certificate ? "Délivré" : "Non disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-heading font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {evt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(evt.registrationUrl || evt.certificateUrl) && (
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-heading font-semibold mb-4">Liens</h3>
                  {evt.registrationUrl && (
                    <Button asChild className="w-full justify-start">
                      <Link href={evt.registrationUrl} target="_blank">
                        <Globe className="w-4 h-4 mr-2" />
                        S&apos;inscrire
                      </Link>
                    </Button>
                  )}
                  {evt.certificateUrl && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={evt.certificateUrl} target="_blank">
                        <Award className="w-4 h-4 mr-2" />
                        Voir le certificat
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {relatedEvents.length > 0 && (
        <div className="bg-secondary-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold mb-8">Événements similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((re, idx) => {
                const RelIcon = typeIcons[re.type] || Calendar
                return (
                  <Link key={re.slug} href={`/evenements/${re.slug}`} className="group">
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <RelIcon className="h-12 w-12 text-primary/20" />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-2">{typeLabels[re.type] || re.type}</Badge>
                        <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                          {re.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{re.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
