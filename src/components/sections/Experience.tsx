"use client";

import { CheckCircle2, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";
import { Badge } from "@/components/ui/badge";
import { experiences as staticExperiences } from "@/lib/data/experiences";

const companyColors = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-fuchsia-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
];

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export default function Experience({
  experiences = staticExperiences,
}: {
  experiences?: Experience[];
}) {
  return (
    <section
      id="experience"
      className="section-shell relative bg-white"
      aria-label="Expériences professionnelles"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Expériences</div>
          <h2 className="section-heading mt-5">
            Parcours <span className="gradient-text">Professionnel</span>
          </h2>
          <p className="section-desc">
            Mon parcours professionnel dans le développement web et la tech
          </p>
        </div>

        <div data-reveal-group className="relative mx-auto max-w-3xl">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              data-reveal-item
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-heading text-lg font-bold text-white shadow-lg ring-4 ring-white",
                  companyColors[index % companyColors.length],
                )}
              >
                {exp.company.charAt(0)}
              </div>

              <div className="surface surface-interactive flex-1 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                    {exp.position}
                  </h3>
                  {exp.current && (
                    <Badge
                      variant="secondary"
                      className="border-0 bg-emerald-500/10 text-xs font-semibold text-emerald-600"
                    >
                      En poste
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-secondary">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    {exp.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">
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
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-sm leading-relaxed text-secondary">
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
