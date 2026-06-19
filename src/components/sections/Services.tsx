"use client"

import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { services } from "@/lib/data/services"

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName]
  return Icon || LucideIcons.HelpCircle
}

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const Icon = getIcon(service.icon)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="relative h-full rounded-lg border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          {service.price && (
            <Badge variant="secondary" className="text-xs font-semibold">
              {service.price}
            </Badge>
          )}
        </div>

        <h3 className="font-heading text-xl font-bold text-foreground">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-secondary">
          {service.description}
        </p>

        {service.features.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
            {service.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm text-secondary">
                  {feature}
                </span>
              </li>
            ))}
            {service.features.length > 4 && (
              <li className="text-sm font-medium text-primary">
                +{service.features.length - 4} autres fonctionnalités
              </li>
            )}
          </ul>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
          En savoir plus
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 bg-background"
      aria-label="Mes services"
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
            Services
          </div>
          <h2 className="section-heading mt-4">
            Ce que je <span className="gradient-text">propose</span>
          </h2>
          <p className="section-desc">
            Des solutions complètes pour votre transformation numérique
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <a
            href="/services"
            className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-primary transition-colors hover:text-primary-300"
            aria-label="Voir tous les services"
          >
            Découvrir tous mes services
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
