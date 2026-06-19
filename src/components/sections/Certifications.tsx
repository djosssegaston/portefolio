"use client"

import { motion } from "framer-motion"
import { Award, ExternalLink, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { certifications } from "@/lib/data/certifications"

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}

const iconColors = [
  "text-blue-500 bg-blue-500/10",
  "text-emerald-500 bg-emerald-500/10",
  "text-purple-500 bg-purple-500/10",
  "text-amber-500 bg-amber-500/10",
  "text-rose-500 bg-rose-500/10",
  "text-cyan-500 bg-cyan-500/10",
  "text-violet-500 bg-violet-500/10",
  "text-orange-500 bg-orange-500/10",
  "text-fuchsia-500 bg-fuchsia-500/10",
  "text-teal-500 bg-teal-500/10",
]

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Certifications"
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
            Certifications
          </div>
          <h2 className="section-heading mt-4">
            <span className="gradient-text">Expertise</span> Certifiée
          </h2>
          <p className="section-desc">
            Des certifications qui attestent de mon expertise technique
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <div className="group relative h-full rounded-lg border border-border bg-card p-5">
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                    iconColors[index % iconColors.length],
                  )}
                >
                  <Award className="h-6 w-6" />
                </div>

                <h3 className="font-heading text-base font-bold text-foreground">
                  {cert.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-primary">
                  {cert.issuer}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatFrenchDate(cert.date)}</span>
                  {cert.expiryDate && (
                    <span>
                      &middot; Expire {formatFrenchDate(cert.expiryDate)}
                    </span>
                  )}
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                  {cert.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {cert.credentialUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      asChild
                    >
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Voir le certificat ${cert.title}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Voir le certificat
                      </a>
                    </Button>
                  )}
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {cert.issuer}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
