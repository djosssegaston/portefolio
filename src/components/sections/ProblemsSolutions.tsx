"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  Clock,
  Smartphone,
  Database,
  ShieldOff,
  Zap,
  RefreshCw,
  Monitor,
  Database as DatabaseIcon,
  Shield,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProblemSolutionPair {
  problem: {
    icon: React.ElementType
    title: string
    description: string
  }
  solution: {
    icon: React.ElementType
    title: string
    description: string
  }
}

const pairs: ProblemSolutionPair[] = [
  {
    problem: {
      icon: AlertTriangle,
      title: "Gestion manuelle",
      description: "Processus répétitifs qui consomment un temps précieux et génèrent des erreurs.",
    },
    solution: {
      icon: Zap,
      title: "Automatisation intelligente",
      description: "Des workflows automatisés qui éliminent les tâches redondantes et réduisent les erreurs.",
    },
  },
  {
    problem: {
      icon: Clock,
      title: "Perte de temps",
      description: "Des processus inefficaces qui ralentissent votre productivité et votre croissance.",
    },
    solution: {
      icon: RefreshCw,
      title: "Optimisation des processus",
      description: "Des solutions streamlined qui accélèrent vos opérations et maximisent l'efficacité.",
    },
  },
  {
    problem: {
      icon: Smartphone,
      title: "Manque d'outils numériques",
      description: "Absence d'infrastructure digitale adaptée à vos besoins spécifiques.",
    },
    solution: {
      icon: Monitor,
      title: "Plateformes sur mesure",
      description: "Des applications et plateformes conçues précisément pour répondre à vos exigences.",
    },
  },
  {
    problem: {
      icon: Database,
      title: "Données désorganisées",
      description: "Informations éparpillées sans structure, difficiles à exploiter.",
    },
    solution: {
      icon: DatabaseIcon,
      title: "Architecture de données robuste",
      description: "Une infrastructure de données solide pour des décisions éclairées en temps réel.",
    },
  },
  {
    problem: {
      icon: ShieldOff,
      title: "Sécurité insuffisante",
      description: "Des vulnérabilités qui exposent votre entreprise à des risques majeurs.",
    },
    solution: {
      icon: Shield,
      title: "Protection avancée",
      description: "Une sécurité multi-couche pour protéger vos données et celles de vos clients.",
    },
  },
]

function ProblemSolutionCard({ pair, index }: { pair: ProblemSolutionPair; index: number }) {
  const ProblemIcon = pair.problem.icon
  const SolutionIcon = pair.solution.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative cursor-default"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/20 sm:p-8">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <ProblemIcon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-400">
              Problème
            </Badge>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">{pair.problem.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-secondary">{pair.problem.description}</p>
        </div>

        <div className="relative z-10 my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-red-500/20 via-border to-accent/20" />
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
            <ArrowRight className="h-4 w-4 text-accent" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-accent/20 via-border to-red-500/20" />
        </div>

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <SolutionIcon className="h-5 w-5" />
            </div>
            <Badge variant="secondary">Solution</Badge>
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">{pair.solution.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-secondary">{pair.solution.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProblemsSolutions() {
  return (
    <section
      id="solutions"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Problèmes et solutions"
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
            Comprendre vos défis
          </span>
          <h2 className="section-heading mt-4 text-foreground">
            Des solutions adaptées à vos besoins
          </h2>
          <p className="section-desc">
            Chaque défi est une opportunité d&apos;innovation. Je transforme vos contraintes en avantages concurrentiels.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((pair, index) => (
            <ProblemSolutionCard
              key={pair.problem.title}
              pair={pair}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
