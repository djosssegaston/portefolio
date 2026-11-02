"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Calendar,
  MapPin,
  GraduationCap,
  Mic,
  Wrench,
  Trophy,
  Users,
  ExternalLink,
  Star,
  Clock,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventTraining } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function Events({
  events = staticEvents,
}: {
  events?: EventTraining[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return events.filter((evt) => {
      if (activeType !== "all" && evt.type !== activeType) return false;
      if (
        query &&
        !evt.title.toLowerCase().includes(query) &&
        !evt.organizer.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  }, [searchQuery, activeType, events]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("gsap:refresh"));
    });
    return () => cancelAnimationFrame(frame);
  }, [filteredEvents]);

  return (
    <section
      id="events"
      className="section-shell relative bg-card/60"
      aria-label="Mes événements et formations"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">
            Événements & Formations
          </div>
          <h2 className="section-heading mt-5">
            Mon <span className="gradient-text">Parcours</span> Public
          </h2>
          <p className="section-desc">
            Les formations, conférences et événements qui enrichissent mon
            expertise
          </p>
        </div>

        <div data-reveal className="mb-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              placeholder="Rechercher un événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border border-slate-200/70 bg-white pl-11 text-foreground shadow-sm placeholder:text-secondary/50"
              aria-label="Rechercher un événement"
            />
          </div>
        </div>

        <div data-reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {typeFilters.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:text-sm",
                activeType === type.value
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-transparent bg-white/70 text-secondary hover:border-slate-200 hover:text-foreground",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt, index) => {
              const TypeIcon = typeIcons[evt.type] || Calendar;
              return (
                <div key={evt.id} data-reveal>
                  <Link href={`/evenements/${evt.slug}`} className="group block h-full">
                    <div className="surface surface-interactive relative h-full overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {evt.image ? (
                          <Image
                            src={evt.image}
                            alt={evt.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className={cn(
                              "flex h-full items-center justify-center bg-gradient-to-br",
                              gradients[index % gradients.length],
                            )}
                          >
                            <TypeIcon className="h-16 w-16 text-white/25" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                        {evt.featured && (
                          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                            <Star className="h-3 w-3 fill-current" />
                            À la une
                          </div>
                        )}
                        {evt.status === "upcoming" && (
                          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            <Clock className="h-3 w-3" />
                            À venir
                          </div>
                        )}
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 rounded-full shadow-lg"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/evenements/${evt.slug}`;
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Voir les détails
                          </Button>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge variant="default" className="text-xs font-medium">
                            {typeLabels[evt.type] || evt.type}
                          </Badge>
                          <span className="text-xs text-secondary">
                            {formatDate(evt.startDate)}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                          {evt.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
                          {evt.description}
                        </p>
                        <div className="mt-3 flex flex-col gap-1.5 text-xs text-secondary">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {evt.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {evt.endDate
                              ? `${formatDate(evt.startDate)} - ${formatDate(evt.endDate)}`
                              : formatDate(evt.startDate)}
                          </span>
                          {evt.certificate && (
                            <span className="flex items-center gap-1.5 text-amber-600">
                              <Award className="h-3.5 w-3.5" />
                              Certificat délivré
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {evt.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-slate-200 text-xs font-normal text-secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {evt.tags.length > 3 && (
                            <span className="text-xs text-secondary">
                              +{evt.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Search className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-lg font-medium text-secondary">
              Aucun événement trouvé
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou filtre
            </p>
          </div>
        )}

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/evenements"
            className="group inline-flex items-center gap-2 font-heading text-base font-semibold text-primary transition-colors hover:text-primary-600"
            aria-label="Voir tous les événements"
          >
            Voir tous les événements
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
