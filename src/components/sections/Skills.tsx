"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { resolveIcon } from "@/components/shared/icon-map";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { skills as staticSkills } from "@/lib/data/skills";
import type { Skill, SkillCategory } from "@/types";

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
};

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
];

function SkillCard({
  name,
  level,
  icon,
  description,
}: {
  name: string;
  level: number;
  icon: string;
  description?: string;
}) {
  const Icon = resolveIcon(icon);

  return (
    <div
      data-reveal
      className="surface surface-interactive group p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-heading text-sm font-semibold text-foreground">
              {name}
            </h4>
            <span className="text-xs font-semibold tabular-nums text-primary">
              {level}%
            </span>
          </div>
          {description && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-secondary">
              {description}
            </p>
          )}
          <Progress
            value={level}
            className="mt-3 h-1.5 bg-slate-100"
            aria-label={`Niveau de compétence ${level}%`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Skills({ skills = staticSkills }: { skills?: Skill[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>(categoryOrder[0]);

  const filteredSkills = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = skills.filter((s) => s.category === activeTab);

    if (query) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, activeTab, skills]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("gsap:refresh"));
    });
    return () => cancelAnimationFrame(frame);
  }, [filteredSkills]);

  return (
    <section
      id="skills"
      className="section-shell relative bg-card/60"
      aria-label="Compétences et technologies"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Compétences</div>
          <h2 className="section-heading mt-5">
            Technologies & <span className="gradient-text">Outils</span>
          </h2>
          <p className="section-desc">
            Les technologies et outils que je maîtrise au quotidien
          </p>
        </div>

        <div data-reveal className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border border-slate-200/70 bg-white pl-11 text-foreground shadow-sm placeholder:text-secondary/50"
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
                className="rounded-full px-4 py-2 text-xs font-medium text-secondary transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 sm:text-sm"
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
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
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
  );
}
