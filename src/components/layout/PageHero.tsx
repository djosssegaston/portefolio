import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import LazyAmbientScene from "@/components/three/LazyAmbientScene";
import type { AmbientVariant } from "@/components/three/AmbientScene";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  breadcrumb?: Crumb[];
  variant?: AmbientVariant;
  children?: React.ReactNode;
  align?: "left" | "center";
};

export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  breadcrumb = [],
  variant = "orb",
  children,
  align = "left",
}: Props) {
  return (
    <header className="relative isolate overflow-hidden bg-[#05070f] pt-28 pb-24 sm:pt-32 sm:pb-28">
      <LazyAmbientScene
        variant={variant}
        className="absolute inset-0 z-0 h-full w-full"
        opacity={0.95}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_55%_at_20%_10%,rgba(37,99,235,0.22),transparent_65%),radial-gradient(ellipse_45%_45%_at_85%_35%,rgba(34,211,238,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,7,15,0.35)_0%,rgba(5,7,15,0.05)_35%,rgba(5,7,15,0.65)_100%)]" />
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.035]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-36 bg-gradient-to-t from-white via-white/70 to-transparent" />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          align === "center" && "text-center",
        )}
      >
        {breadcrumb.length > 0 && (
          <nav
            aria-label="Fil d'Ariane"
            className={cn(
              "mb-8 flex items-center gap-1.5 text-xs font-medium text-slate-400/80",
              align === "center" && "justify-center",
            )}
          >
            {breadcrumb.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-300">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90 backdrop-blur-md"
            data-reveal="fade"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            {eyebrow}
          </span>

          <h1 className="mt-7 font-heading text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden pb-1">
              <span className="block" data-reveal="up">
                {title}
              </span>
            </span>
            {highlight && (
              <span className="block overflow-hidden pb-1">
                <span
                  className="gradient-text-light block"
                  data-reveal="up"
                  data-reveal-delay="0.1"
                >
                  {highlight}
                </span>
              </span>
            )}
          </h1>

          {description && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-base leading-relaxed text-slate-300/85 sm:text-lg",
                align === "center" && "mx-auto",
              )}
              data-reveal="up"
              data-reveal-delay="0.16"
            >
              {description}
            </p>
          )}

          {children && (
            <div
              className={cn("mt-9", align === "center" && "flex justify-center")}
              data-reveal="up"
              data-reveal-delay="0.22"
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
