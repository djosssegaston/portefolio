"use client";

import { GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Education } from "@/types";
import { Badge } from "@/components/ui/badge";
import { education as staticEducation } from "@/lib/data/education";

const institutionColors = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
];

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export default function Education({
  education = staticEducation,
}: {
  education?: Education[];
}) {
  return (
    <section
      id="education"
      className="section-shell relative bg-card/60"
      aria-label="Formations"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Formation</div>
          <h2 className="section-heading mt-5">
            Parcours <span className="gradient-text">Académique</span>
          </h2>
          <p className="section-desc">
            Mon parcours académique et les compétences acquises
          </p>
        </div>

        <div data-reveal-group className="grid gap-5 md:grid-cols-2">
          {education.map((edu, index) => (
            <div key={edu.id} data-reveal-item>
              <div className="surface surface-interactive group relative h-full p-6 sm:p-7">
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br font-heading text-lg font-bold text-white shadow-lg",
                      institutionColors[index % institutionColors.length],
                    )}
                  >
                    {edu.institution.charAt(0)}
                  </div>
                  {edu.current && (
                    <Badge
                      variant="secondary"
                      className="border-0 bg-emerald-500/10 text-xs font-semibold text-emerald-600"
                    >
                      En cours
                    </Badge>
                  )}
                </div>

                <div className="mb-1 flex items-center gap-2 text-sm text-secondary">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>{edu.institution}</span>
                </div>

                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {edu.degree}
                </h3>

                <p className="mt-0.5 text-sm font-medium text-primary">
                  {edu.field}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-secondary">
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
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {edu.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm leading-relaxed text-secondary">
                          {highlight}
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
