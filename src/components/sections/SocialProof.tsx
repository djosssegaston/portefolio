"use client"

import { motion } from "framer-motion"
import {
  Briefcase,
  Code2,
  Users,
  Star,
} from "lucide-react"

const clientLogos = [
  { initials: "TC", name: "TechCorp" },
  { initials: "DA", name: "DigitalAfrique" },
  { initials: "MA", name: "MediApp" },
  { initials: "FS", name: "FinServ" },
  { initials: "EB", name: "EduBridge" },
  { initials: "GG", name: "GreenGrid" },
]

const stats = [
  { value: "45+", label: "Projets Livrés", icon: Briefcase },
  { value: "30+", label: "Technologies", icon: Code2 },
  { value: "60+", label: "Collaborations", icon: Users },
  { value: "98%", label: "Satisfaction Client", icon: Star },
]

function ClientLogo({ initials, name, index }: { initials: string; name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col items-center gap-3"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-card transition-colors group-hover:border-accent/30 group-hover:bg-accent/[0.03] sm:h-24 sm:w-24">
        <span className="font-heading text-2xl font-bold text-muted-foreground transition-colors group-hover:text-accent sm:text-3xl">
          {initials}
        </span>
      </div>
      <span className="text-xs font-medium text-secondary transition-colors group-hover:text-foreground sm:text-sm">
        {name}
      </span>
    </motion.div>
  )
}

export default function SocialProof() {
  return (
    <section
      id="social-proof"
      className="relative py-24 sm:py-32 bg-background"
      aria-label="Preuve sociale"
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
            Ils me font confiance
          </span>
          <h2 className="section-heading mt-4 text-foreground">
            Reconnu par des entreprises innovantes
          </h2>
          <p className="section-desc">
            Des startups aux grandes entreprises, j&apos;accompagne des organisations ambitieuses dans leur transformation numérique.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-20 grid grid-cols-3 gap-8 sm:grid-cols-3 md:grid-cols-6 md:gap-6"
        >
          {clientLogos.map((client, index) => (
            <ClientLogo key={client.name} {...client} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-accent/20"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <p className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-secondary sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
