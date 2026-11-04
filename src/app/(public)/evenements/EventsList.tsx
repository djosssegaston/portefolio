"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  ImageIcon,
  MapPin,
  Mic,
  Search,
  Star,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { EventTraining } from "@/types";
import { events as staticEvents } from "@/lib/data/events";

const typeFilters = [
  { value: "all", label: "Tous" },
  { value: "formation", label: "Formations" },
  { value: "conference", label: "Conférences" },
  { value: "workshop", label: "Ateliers" },
  { value: "hackathon", label: "Hackathons" },
  { value: "meetup", label: "Meetups" },
] as const;

const typeIcons: Record<string, React.ElementType> = {
  formation: GraduationCap,
  conference: Mic,
  workshop: Wrench,
  hackathon: Trophy,
  meetup: Users,
  autre: Calendar,
};

const typeLabels: Record<string, string> = {
  formation: "Formation",
  conference: "Conférence",
  workshop: "Atelier",
  hackathon: "Hackathon",
  meetup: "Meetup",
  autre: "Autre",
};

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventsPage({
  events = staticEvents,
}: {
  events?: EventTraining[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const lastFilter = useRef<string | null>(null);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return events.filter((event) => {
      if (activeType !== "all" && event.type !== activeType) return false;
      if (
        query &&
        !event.title.toLowerCase().includes(query) &&
        !event.organizer.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [searchQuery, activeType, events]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only a real filter change animates the grid; search typing stays smooth.
    const filterChanged = lastFilter.current !== activeType;
    lastFilter.current = activeType;

    if (!filterChanged) {
      if (emptyRef.current) gsap.set(emptyRef.current, { opacity: 1, y: 0 });
      return;
    }

    if (reduced) {
      if (gridRef.current) gsap.set(Array.from(gridRef.current.children), { opacity: 1, y: 0 });
      return;
    }

    if (filteredEvents.length > 0 && gridRef.current) {
      gsap.fromTo(
        Array.from(gridRef.current.children),
        { opacity: 0, y: 24, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.045,
          ease: "power3.out",
          overwrite: true,
          clearProps: "transform,opacity",
        },
      );
      return;
    }

    if (emptyRef.current) {
      gsap.fromTo(
        emptyRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true },
      );
    }
  }, [filteredEvents, activeType]);

  return (
    <div>
      <PageHero
        eyebrow="Événements"
        title="Apprendre, partager,"
        highlight="transmettre."
        description="Formations, conférences, ateliers et hackathons : les rendez-vous qui nourrissent ma pratique et mon réseau."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Événements" }]}
        variant="grid"
      >
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-cyan-300" />
            {events.length > 0
              ? `${events.length} événement${events.length > 1 ? "s" : ""} référencé${events.length > 1 ? "s" : ""}`
              : "Aucun événement référencé"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-amber-300" />
            {events.length > 0 ? "Certifications & formations" : "Mises à jour à venir"}
          </span>
        </div>
      </PageHero>

      <section className="section-shell !pt-16 sm:!pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {events.length > 0 && (
            <div className="surface mx-auto mb-12 max-w-4xl p-4 sm:p-5" data-reveal="up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un événement ou un organisateur..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-12 rounded-xl border-border/70 bg-white pl-11 text-sm shadow-sm"
                  aria-label="Rechercher un événement"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {typeFilters.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    aria-pressed={activeType === type.value}
                    onClick={() => setActiveType(type.value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                      activeType === type.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-slate-900",
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length > 0 ? (
            <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => {
                const TypeIcon = typeIcons[event.type] || Calendar;
                return (
                  <Link
                    key={event.id}
                    href={`/evenements/${event.slug}`}
                    className="group block h-full"
                  >
                    <Card className="relative h-full overflow-hidden border-border/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_30px_70px_-45px_rgba(37,99,235,0.5)]">
                      <div className="relative h-52 overflow-hidden">
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className={cn(
                              "relative flex h-full items-center justify-center bg-gradient-to-br",
                              gradients[index % gradients.length],
                            )}
                          >
                            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
                            <TypeIcon className="relative h-16 w-16 text-white/25" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        {event.featured && (
                          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-current" />
                            À la une
                          </div>
                        )}
                        {event.status === "upcoming" && (
                          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                            <Clock className="h-3 w-3" />
                            À venir
                          </div>
                        )}
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="pointer-events-none gap-2 shadow-lg"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Voir les détails
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-xs font-medium text-primary hover:bg-primary/15"
                          >
                            {typeLabels[event.type] || event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.startDate)}
                          </span>
                        </div>
                        <h2 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                          {event.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {event.endDate
                              ? `${formatDate(event.startDate)} — ${formatDate(event.endDate)}`
                              : formatDate(event.startDate)}
                          </span>
                          {event.certificate && (
                            <span className="flex items-center gap-1.5 text-amber-600">
                              <Award className="h-3.5 w-3.5" />
                              Certificat délivré
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {event.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-border/60 text-xs font-normal text-muted-foreground"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div ref={emptyRef} className="py-20 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                {events.length === 0 ? "Aucun événement référencé pour le moment" : "Aucun événement trouvé"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {events.length === 0
                  ? "Les formations, conférences et ateliers suivis seront ajoutés ici."
                  : "Essayez de modifier votre recherche ou votre filtre."}
              </p>
              {events.length === 0 ? (
                <Button asChild className="mt-6">
                  <Link href="/projets">Voir les projets</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveType("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
