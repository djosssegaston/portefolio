"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  User,
  Wrench,
  FolderKanban,
  Calendar,
  FileText,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Services", href: "/services" },
  { name: "Projets", href: "/projets" },
  { name: "Événements", href: "/evenements" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const navIcons: Record<string, React.ElementType> = {
  Accueil: Home,
  "À Propos": User,
  Services: Wrench,
  Projets: FolderKanban,
  "Événements": Calendar,
  Blog: FileText,
  Contact: Mail,
};

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);

  const transparent = !isScrolled && !isMobileOpen;
  const darkSurface = transparent || isMobileOpen;

  useEffect(() => {
    let scrolled = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const nextScrolled = window.scrollY > 24;
      if (nextScrolled !== scrolled) {
        scrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }
      if (progressRef.current) {
        const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.logo) setLogoUrl(data.logo);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [isMobileOpen]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    menuTimeline.current?.kill();
    const items = panel.querySelectorAll<HTMLElement>("[data-mobile-link]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileOpen) {
      panel.style.display = "flex";

      if (reduced) {
        gsap.set(panel, { opacity: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.28 })
          .fromTo(
            items,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.045 },
            0.06,
          );
        menuTimeline.current = tl;
      }
    } else if (panel.style.display !== "none") {
      if (reduced) {
        gsap.set(panel, { opacity: 0 });
        panel.style.display = "none";
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            if (panelRef.current) panelRef.current.style.display = "none";
          },
        });
        tl.to(panel, { opacity: 0, duration: 0.22, ease: "power2.in" });
        menuTimeline.current = tl;
      }
    }

    return () => {
      menuTimeline.current?.kill();
    };
  }, [isMobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          transparent
            ? "border-b border-transparent bg-transparent"
            : isMobileOpen
              ? "border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"
              : "border-b border-slate-200/70 bg-white/85 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="group flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-11 items-center transition-all duration-500 group-hover:scale-105",
                  darkSurface && "brightness-0 invert",
                )}
              >
                <Image
                  src={logoUrl || "/images/avatars/logo.png"}
                  alt="Logo DJOSSE Adechina"
                  width={44}
                  height={44}
                  priority
                  unoptimized
                  className="h-full w-auto"
                />
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                      transparent
                        ? active
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                        : active
                          ? "text-primary"
                          : "text-slate-500 hover:text-slate-900",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-xl transition-all duration-300",
                        active
                          ? transparent
                            ? "bg-white/10"
                            : "bg-primary/[0.08]"
                          : "bg-transparent group-hover:bg-slate-500/5",
                      )}
                    />
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/0168552584"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-300 sm:flex",
                  transparent
                    ? "border border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/10"
                    : "bg-primary text-white shadow-sm hover:bg-primary/90",
                )}
              >
                <span>Discutons</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setIsMobileOpen((open) => !open)}
                className={cn(
                  "relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 lg:hidden",
                  transparent
                    ? "border border-white/15 bg-white/[0.05] text-white"
                    : "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25",
                )}
                aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-slate-200/50">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-accent to-primary"
          />
        </div>
      </header>

      <div
        ref={panelRef}
        className="fixed inset-0 z-40 hidden flex-col bg-slate-950/95 px-6 pb-10 pt-24 backdrop-blur-2xl lg:hidden"
        style={{ display: "none" }}
        aria-hidden={!isMobileOpen}
      >
        <div className="pointer-events-none absolute inset-0 noise-overlay opacity-[0.04]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />

        <nav className="relative z-10 mt-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = navIcons[link.name];
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                data-mobile-link
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3.5 transition-all duration-300",
                  active
                    ? "border-white/10 bg-white/[0.06] text-white"
                    : "text-slate-400 hover:border-white/5 hover:bg-white/[0.03] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    active
                      ? "bg-primary/20 text-sky-300"
                      : "bg-white/[0.04] text-slate-500 group-hover:text-sky-300",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-heading text-lg font-medium">{link.name}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-60" />
              </Link>
            );
          })}
        </nav>

        <div data-mobile-link className="relative z-10 mt-auto">
          <a
            href="https://wa.me/0168552584"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950"
          >
            Démarrer un projet
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-center text-xs text-slate-500">
            Basé à Cotonou, Bénin · Disponible à distance
          </p>
        </div>
      </div>
    </>
  );
}
