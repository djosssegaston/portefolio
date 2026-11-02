"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { resolveIcon } from "@/components/shared/icon-map";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { services as staticServices } from "@/lib/data/services";
import type { Service } from "@/types";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = resolveIcon(service.icon);

  return (
    <div data-reveal-item className="group relative h-full">
      <div className="surface surface-interactive relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
            <Icon className="h-6 w-6" />
          </div>
          <span className="font-heading text-xs font-medium tabular-nums text-slate-300">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-heading text-xl font-semibold text-foreground">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-secondary">
          {service.description}
        </p>

        {service.features.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
            {service.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm text-secondary">{feature}</span>
              </li>
            ))}
            {service.features.length > 4 && (
              <li className="text-sm font-medium text-primary">
                +{service.features.length - 4} autres fonctionnalités
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            En savoir plus
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          {service.price && (
            <Badge
              variant="secondary"
              className="border-0 bg-primary/[0.06] text-xs font-semibold text-primary"
            >
              {service.price}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Services({
  services = staticServices,
}: {
  services?: Service[];
}) {
  return (
    <section
      id="services"
      className="section-shell relative bg-white"
      aria-label="Mes services"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Services</div>
          <h2 className="section-heading mt-5">
            Ce que je <span className="gradient-text">propose</span>
          </h2>
          <p className="section-desc">
            Des solutions complètes pour votre transformation numérique
          </p>
        </div>

        <div data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-heading text-base font-semibold text-primary transition-colors hover:text-primary-600"
            aria-label="Voir tous les services"
          >
            Découvrir tous mes services
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
