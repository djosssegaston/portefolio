"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { education } from "@/lib/data/education"

const institutionColors = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
]

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}

export default function Education() {
  return (
    <section
      id="education"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Formations"
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
            Formation
          </div>
          <h2 className="section-heading mt-4">
            Parcours <span className="gradient-text">Académique</span>
          </h2>
          <p className="section-desc">
            Mon parcours académique et professionnel
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="group relative h-full rounded-lg border border-border bg-card p-6 sm:p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                      institutionColors[index % institutionColors.length],
                    )}
                  >
                    <span className="text-lg font-bold">
                      {edu.institution.charAt(0)}
                    </span>
                  </div>
                  {edu.current && (
                    <Badge variant="secondary" className="text-xs font-semibold">
                      En cours
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2 text-sm text-secondary">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{edu.institution}</span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {edu.degree}
                  </h3>

                  <p className="mt-0.5 text-sm font-medium text-primary">
                    {edu.field}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-secondary">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {formatFrenchDate(edu.startDate)} -{" "}
                      {edu.current ? "Présent" : formatFrenchDate(edu.endDate!)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-secondary">
                    {edu.description}
                  </p>

                  {edu.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {edu.highlights.map((highlight, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-secondary">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
