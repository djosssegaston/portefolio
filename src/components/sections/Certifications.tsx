"use client";

import { Award, ExternalLink, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { certifications as staticCertifications } from "@/lib/data/certifications";

function formatFrenchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

const iconColors = [
  "text-blue-500 bg-blue-500/10",
  "text-emerald-500 bg-emerald-500/10",
  "text-purple-500 bg-purple-500/10",
  "text-amber-500 bg-amber-500/10",
  "text-rose-500 bg-rose-500/10",
  "text-cyan-500 bg-cyan-500/10",
  "text-violet-500 bg-violet-500/10",
  "text-orange-500 bg-orange-500/10",
  "text-fuchsia-500 bg-fuchsia-500/10",
  "text-teal-500 bg-teal-500/10",
];

export default function Certifications({
  certifications = staticCertifications,
}: {
  certifications?: Certification[];
}) {
  return (
    <section
      id="certifications"
      className="section-shell relative bg-white"
      aria-label="Certifications"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Certifications</div>
          <h2 className="section-heading mt-5">
            <span className="gradient-text">Expertise</span> Certifiée
          </h2>
          <p className="section-desc">
            Des certifications qui attestent de mon expertise technique
          </p>
        </div>

        <div data-reveal-group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => (
            <div key={cert.id} data-reveal-item className="h-full">
              <div className="surface surface-interactive group flex h-full flex-col p-5">
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105",
                    iconColors[index % iconColors.length],
                  )}
                >
                  <Award className="h-6 w-6" />
                </div>

                <h3 className="font-heading text-base font-semibold text-foreground">
                  {cert.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-primary">
                  {cert.issuer}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-secondary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatFrenchDate(cert.date)}</span>
                  {cert.expiryDate && (
                    <span>&middot; Expire {formatFrenchDate(cert.expiryDate)}</span>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-secondary">
                  {cert.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  {cert.credentialUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-full text-xs"
                      asChild
                    >
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Voir le certificat ${cert.title}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Voir le certificat
                      </a>
                    </Button>
                  )}
                  <Badge
                    variant="secondary"
                    className="border-0 bg-slate-100 text-xs font-normal text-secondary"
                  >
                    {cert.issuer}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
