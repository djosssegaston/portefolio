"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { skills } from "@/lib/data/skills"
import type { SkillCategory } from "@/types"

const categoryLabels: Record<SkillCategory, string> = {
  "web-development": "Développement Web",
  "frontend-development": "Frontend",
  "backend-development": "Backend",
  databases: "Bases de Données",
  tools: "Outils",
  devops: "DevOps",
  "digital-marketing": "Marketing Digital",
  "project-management": "Gestion de Projet",
  ai: "IA",
}

const categoryOrder: SkillCategory[] = [
  "web-development",
  "frontend-development",
  "backend-development",
  "databases",
  "tools",
  "devops",
  "digital-marketing",
  "project-management",
  "ai",
]

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName]
  return Icon || LucideIcons.HelpCircle
}

function SkillCard({ name, level, icon, description }: { name: string; level: number; icon: string; description?: string }) {
  const Icon = getIcon(icon)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-semibold text-foreground text-sm">
            {name}
          </h4>
          {description && (
            <p className="mt-0.5 text-xs text-secondary">
              {description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Progress
              value={level}
              className="h-1.5 flex-1 bg-muted"
              aria-label={`Niveau de compétence ${level}%`}
            />
            <span className="w-8 text-right text-xs font-semibold text-primary tabular-nums">
              {level}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<string>(categoryOrder[0])

  const filteredSkills = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    let filtered = skills

    filtered = filtered.filter((s) => s.category === activeTab)

    if (query) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [searchQuery, activeTab])

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-background"
      aria-label="Compétences et technologies"
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
            Compétences
          </div>
          <h2 className="section-heading mt-4">
            Technologies & <span className="gradient-text">Outils</span>
          </h2>
          <p className="section-desc">
            Les technologies et outils que je maîtrise
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-0 text-foreground placeholder:text-secondary/50"
              aria-label="Rechercher une compétence"
            />
          </div>
        </div>

        <Tabs
          defaultValue={categoryOrder[0]}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mx-auto mb-10 flex h-auto flex-wrap justify-center gap-2 bg-transparent p-1">
            {categoryOrder.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm text-secondary"
              >
                {categoryLabels[cat]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredSkills.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    icon={skill.icon}
                    description={skill.description}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-lg font-medium text-secondary">
                  Aucune compétence trouvée
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Essayez de modifier votre recherche
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
