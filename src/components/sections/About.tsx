"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Check,
  Quote,
  Play,
  Briefcase as WorkIcon,
  GraduationCap as EduIcon,
  Award as AwardIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/data/site-config";

const timelineIcons: Record<string, React.ElementType> = {
  work: WorkIcon,
  education: EduIcon,
  achievement: AwardIcon,
};

const timelineColors: Record<string, string> = {
  work: "bg-primary text-white",
  education: "bg-emerald-500 text-white",
  achievement: "bg-amber-500 text-white",
};

function TimelineItem({
  item,
  index,
  isLeft,
}: {
  item: (typeof siteConfig.about.timeline)[0];
  index: number;
  isLeft: boolean;
}) {
  const Icon = timelineIcons[item.type];
  const colorClass = timelineColors[item.type];

  return (
    <div
      data-reveal-item
      className={cn(
        "group relative flex items-start gap-6 pb-12 last:pb-0",
        isLeft ? "md:flex-row-reverse md:text-right" : "md:text-left",
      )}
    >
      <div
        className={cn(
          "surface surface-interactive p-5 transition-all duration-500 sm:p-6 md:w-[calc(50%-2rem)]",
        )}
      >
        <Badge
          variant="outline"
          className="w-fit border-primary/20 bg-primary/[0.04] px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-primary"
        >
          {item.year}
        </Badge>
        <h4 className="mt-3 font-heading text-lg font-semibold text-foreground">
          {item.title}
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-secondary">
          {item.description}
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg ring-4 ring-white",
            colorClass,
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="absolute inset-0 -z-10 rounded-2xl bg-current opacity-20 blur-md" />
        </div>
        {index < siteConfig.about.timeline.length - 1 && (
          <div className="absolute top-12 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/30 to-transparent" />
        )}
      </div>

      <div className="hidden flex-1 md:block md:w-[calc(50%-2rem)]" />
    </div>
  );
}

function WrapperTag({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}

export default function About() {
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [demoVideo, setDemoVideo] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.aboutImage) setAboutImageUrl(data.aboutImage);
        if (data.demoVideo) setDemoVideo(data.demoVideo);
      })
      .catch(() => {});
  }, []);

  const presentation = siteConfig.about.presentation;
  const paragraphs = presentation.split("\n\n").filter(Boolean);

  return (
    <section id="about" className="section-shell relative bg-white" aria-label="À propos">
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-16 text-center">
          <div className="section-label mx-auto w-fit">À propos</div>
          <h2 className="section-heading mt-5">
            Mon <span className="gradient-text">Parcours</span>
          </h2>
          <p className="section-desc">
            Découvrez mon parcours, ma vision et mes valeurs
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div data-reveal="right" className="relative">
            <div className="surface relative overflow-hidden rounded-[2rem] p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-slate-100">
                <div
                  className="flex h-full items-center justify-center"
                  style={
                    aboutImageUrl
                      ? {
                          backgroundImage: `url(${aboutImageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {aboutImageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
                  )}
                  <div className="relative z-10 text-center">
                    <WrapperTag href={demoVideo || undefined} className="mx-auto block w-fit">
                      <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full border border-primary/40"
                          style={{ animation: "ripple 2.4s ease-out infinite" }}
                        />
                        <div
                          className="absolute inset-0 rounded-full border border-primary/40"
                          style={{ animation: "ripple 2.4s ease-out infinite 0.7s" }}
                        />
                        <div
                          className="absolute inset-0 rounded-full border border-primary/40"
                          style={{ animation: "ripple 2.4s ease-out infinite 1.4s" }}
                        />
                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                          <Play className="h-9 w-9 text-primary" />
                          {demoVideo && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100">
                              <Play className="h-8 w-8 fill-white text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </WrapperTag>
                    <p
                      className={cn(
                        "font-heading text-lg font-semibold",
                        aboutImageUrl ? "text-white" : "text-foreground",
                      )}
                    >
                      {siteConfig.fullName}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        aboutImageUrl ? "text-white/70" : "text-secondary",
                      )}
                    >
                      {siteConfig.title}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-slate-950/5" />
              </div>
            </div>

            <div
              data-parallax="0.12"
              className="absolute -bottom-6 -right-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:-right-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
                  <WorkIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-semibold leading-none text-foreground">
                    2
                  </p>
                  <p className="mt-1 text-xs text-secondary">Expériences professionnelles</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  data-reveal
                  data-reveal-delay={i * 0.08}
                  className="text-base leading-relaxed text-secondary sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote
              data-reveal
              className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.05] via-white to-accent/[0.04] p-6 sm:p-8"
            >
              <Quote className="absolute right-6 top-6 h-14 w-14 text-primary/10" />
              <p className="relative z-10 font-heading text-lg font-medium italic leading-relaxed text-foreground sm:text-xl">
                &ldquo;{siteConfig.about.vision}&rdquo;
              </p>
            </blockquote>

            <div data-reveal>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Mes Valeurs
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {siteConfig.about.values.map((value, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="text-sm leading-snug text-secondary">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <a href={siteConfig.about.cvUrl} download aria-label="Télécharger le CV">
                  <Download className="h-5 w-5" />
                  Télécharger mon CV
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-28">
          <div data-reveal className="mb-14 text-center">
            <h3 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Ma <span className="gradient-text">Chronologie</span>
            </h3>
            <p className="mt-3 text-sm text-secondary sm:text-base">
              Les étapes clés qui ont façonné mon parcours
            </p>
          </div>

          <div data-reveal-group className="relative mx-auto max-w-3xl">
            {siteConfig.about.timeline.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
