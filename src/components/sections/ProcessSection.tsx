"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  icon: string
  title: string
  description: string
}

const steps: Step[] = [
  { number: 1, icon: "🔍", title: "Analyse", description: "Comprendre vos besoins et objectifs pour définir une vision claire du projet." },
  { number: 2, icon: "✏️", title: "Conception", description: "Architecture technique et design de la solution adaptée à vos exigences." },
  { number: 3, icon: "💻", title: "Développement", description: "Construction avec les meilleures technologies et pratiques de l'industrie." },
  { number: 4, icon: "✅", title: "Tests", description: "Validation rigoureuse de chaque fonctionnalité pour une qualité irréprochable." },
  { number: 5, icon: "🚀", title: "Déploiement", description: "Mise en production sécurisée avec monitoring et optimisation continue." },
  { number: 6, icon: "🔄", title: "Maintenance", description: "Support continu et évolutions pour accompagner votre croissance." },
]

function StepCard({ step, index, isLast }: { step: Step; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "relative flex",
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <div className="flex flex-col items-center md:mx-8">
        <div
          className={cn(
            "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-xl shadow-sm transition-colors",
            "border-accent/30 bg-accent/10 text-accent"
          )}
        >
          <span>{step.icon}</span>
          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white shadow-sm">
            {step.number}
          </div>
        </div>
        {!isLast && (
          <div className="h-16 w-px bg-gradient-to-b from-accent/40 to-transparent md:h-24" />
        )}
      </div>

      <div className={cn(
        "flex-1 pb-8 md:pb-12",
        index % 2 === 0 ? "md:text-left" : "md:text-right"
      )}>
        <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/20 sm:p-6">
          <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-accent">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 bg-background"
      aria-label="Processus de développement"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="section-label">
            Ma méthodologie
          </span>
          <h2 className="section-heading mt-4 text-foreground">
            Comment je transforme vos idées en solutions
          </h2>
          <p className="section-desc">
            Une approche structurée en six étapes pour garantir la réussite de votre projet, de l&apos;idée à la mise en production.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          <div className="pointer-events-none absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent md:left-1/2 md:-translate-x-px" />

          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
