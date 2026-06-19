"use client"

import { motion } from "framer-motion"
import {
  MessageCircle,
  ArrowRight,
  Eye,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/data/site-config"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Appel à l'action"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card/80 p-8 text-center sm:p-12 lg:p-16"
        >
          <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Transformons votre idée en{" "}
            <span className="gradient-text">solution numérique performante</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
            Que vous ayez un projet précis ou simplement une idée à explorer, je suis là pour vous accompagner de la conception à la réalisation. Discutons de vos objectifs.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" className="group gap-2 px-8 text-base sm:px-10" asChild>
              <a href="#contact" aria-label="Discutons de votre projet">
                <MessageCircle className="h-5 w-5" />
                Discutons de votre projet
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="group gap-2"
              asChild
            >
              <a href="#projects" aria-label="Voir mes réalisations">
                <Eye className="h-5 w-5" />
                Voir mes réalisations
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-border pt-8 sm:flex-row sm:gap-8">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-2 text-sm text-secondary transition-colors hover:text-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent/10">
                <Mail className="h-4 w-4" />
              </div>
              <span>{siteConfig.email}</span>
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="group flex items-center gap-2 text-sm text-secondary transition-colors hover:text-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent/10">
                <Phone className="h-4 w-4" />
              </div>
              <span>{siteConfig.phone}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
