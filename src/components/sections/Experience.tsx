"use client"

import { motion } from "framer-motion"
import { CheckCircle2, MapPin, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { experiences } from "@/lib/data/experiences"

const companyColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-violet-500",
]

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-24 sm:py-32 bg-background"
      aria-label="Expériences professionnelles"
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
            Expériences
          </div>
          <h2 className="section-heading mt-4">
            Parcours <span className="gradient-text">Professionnel</span>
          </h2>
          <p className="section-desc">
            Mon parcours professionnel dans le développement web et la tech
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm",
                  companyColors[index % companyColors.length],
                )}
              >
                {exp.company.charAt(0)}
              </div>

              <div className="flex-1 rounded-lg border border-border bg-card p-5 pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {exp.position}
                  </h3>
                  {exp.current && (
                    <Badge variant="secondary" className="text-xs font-semibold">
                      En poste
                    </Badge>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    {exp.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
                  <span>
                    {formatFrenchDate(exp.startDate)} -{" "}
                    {exp.current ? "Présent" : formatFrenchDate(exp.endDate!)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {exp.description}
                </p>

                {exp.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-sm text-secondary">
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
