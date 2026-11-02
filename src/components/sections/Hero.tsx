"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Download,
  MessageCircle,
  Briefcase,
  Code2,
  Star,
  ChevronDown,
  Github,
  Linkedin,
  Facebook,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data/site-config";
import { gsap } from "@/lib/gsap";
import LazyHeroScene from "@/components/three/LazyHeroScene";

const DEFAULT_AVATAR = "/images/avatars/author.svg";

const roles = [
  "Développeur Full Stack",
  "Architecte de solutions",
  "Consultant digital",
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Three.js",
  "GSAP",
  "Laravel",
  "MySQL",
  "Tailwind CSS",
  "AWS",
  "Docker",
  "IA & Automation",
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

const socialIcons = [
  { name: "GitHub", icon: Github },
  { name: "LinkedIn", icon: Linkedin },
  { name: "WhatsApp", icon: WhatsAppIcon },
  { name: "Facebook", icon: Facebook },
];

const socialMap: Record<string, string> = {
  Github: "GitHub",
  Linkedin: "LinkedIn",
  MessageCircle: "WhatsApp",
  Facebook: "Facebook",
};

function RoleRotator() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = roles[roleIndex];
      charIndex = deleting ? charIndex - 1 : charIndex + 1;
      el.textContent = current.slice(0, charIndex);

      let delay = deleting ? 32 : 62;
      if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }

      timeout = setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className="inline-flex items-center">
      <span ref={ref} className="text-sky-300" />
      <span className="blink-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-sky-300" />
    </span>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const state = { value: 0 };
    const tween = gsap.to(state, {
      value,
      duration: 2,
      delay: 1.1,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${Math.round(state.value)}${suffix}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, suffix]);

  return <span ref={ref}>{`0${suffix}`}</span>;
}

export default function Hero() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.avatar) setAvatarUrl(data.avatar);
      })
      .catch(() => {});
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.7 })
        .from(
          ".hero-line-inner",
          { yPercent: 115, duration: 1.15, stagger: 0.11, ease: "power4.out" },
          "-=0.35",
        )
        .from(
          ".hero-fade",
          { y: 26, opacity: 0, duration: 0.85, stagger: 0.09 },
          "-=0.75",
        )
        .from(
          ".hero-avatar",
          { opacity: 0, scale: 0.92, duration: 1.2, ease: "power3.out" },
          "-=1.05",
        )
        .from(
          ".hero-stat",
          { y: 22, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.85",
        )
        .from(
          ".hero-marquee",
          { opacity: 0, duration: 0.9 },
          "-=0.5",
        );

      gsap.to(contentRef.current, {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const avatar = avatarRef.current;
    if (!section || !avatar) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.innerWidth < 1024) return;

    gsap.set(avatar, { transformPerspective: 1000 });

    const rotateX = gsap.quickTo(avatar, "rotationX", {
      duration: 0.7,
      ease: "power3.out",
    });
    const rotateY = gsap.quickTo(avatar, "rotationY", {
      duration: 0.7,
      ease: "power3.out",
    });

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY(x * 12);
      rotateX(-y * 10);
    };

    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(avatar);
      gsap.set(avatar, { clearProps: "transform" });
    };
  }, []);

  const stats = [
    { label: "Années d'expérience", value: 1, suffix: "+", icon: Briefcase },
    { label: "Projets réalisés", value: 5, suffix: "+", icon: Code2 },
    { label: "Satisfaction client", value: 98, suffix: "%", icon: Star },
  ];

  const socialLinks = siteConfig.socialLinks;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-shell relative min-h-screen overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-32"
      aria-label="Section d'accueil"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <LazyHeroScene className="absolute inset-0 z-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,7,15,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,7,15,0.82)_0%,rgba(5,7,15,0.45)_40%,rgba(5,7,15,0.92)_100%)] lg:hidden" />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,rgba(5,7,15,0.92)_0%,rgba(5,7,15,0.55)_45%,rgba(5,7,15,0)_78%)] lg:block" />
      <div className="pointer-events-none absolute inset-0 z-[2] noise-overlay opacity-[0.035]" />

      <div ref={contentRef} className="relative z-10">
        <div className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="order-1 text-center lg:order-1 lg:text-left">
            <div className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Disponible pour de nouveaux projets
            </div>

            <h1 className="mt-6 font-heading text-[clamp(2.9rem,9vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-white">
              <span className="block overflow-hidden pb-1">
                <span className="hero-line-inner block">DJOSSE</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-line-inner block gradient-text-light">
                  Adechina
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="hero-line-inner block">
                  Gaston<span className="text-cyan-300">.</span>
                </span>
              </span>
            </h1>

            <div className="hero-fade mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="text-sm font-medium text-slate-400 sm:text-base">
                <RoleRotator />
              </span>
            </div>

            <p className="hero-fade mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
              Je conçois des plateformes web performantes, sécurisées et
              évolutives qui aident les entreprises à automatiser leurs
              processus et accélérer leur croissance.
            </p>

            <div className="hero-fade mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-full bg-white px-7 text-slate-950 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                asChild
              >
                <a href="#projects" aria-label="Voir mes réalisations">
                  <span className="relative z-10 flex items-center gap-2">
                    Voir mes réalisations
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-white/15 bg-white/[0.03] text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.07] hover:text-white sm:w-auto"
                asChild
              >
                <a href="#contact" aria-label="Planifier une consultation">
                  <MessageCircle className="h-4 w-4" />
                  Planifier une consultation
                </a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-full text-slate-300 hover:bg-white/[0.05] hover:text-white sm:w-auto"
                asChild
              >
                <a href={siteConfig.about.cvUrl} download aria-label="Télécharger mon CV">
                  <Download className="h-4 w-4" />
                  Télécharger mon CV
                </a>
              </Button>
            </div>

            <div className="hero-fade mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Suivez-moi
              </span>
              <span className="h-px w-8 bg-white/10" />
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => {
                  const si = socialIcons.find(
                    (s) => s.name === (socialMap[link.icon] || link.icon),
                  );
                  if (!si) return null;
                  const Icon = si.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.name}
                      aria-label={link.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="order-2 flex items-center justify-center lg:order-2">
            <div
              ref={avatarRef}
              className="hero-avatar relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[430px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.32),rgba(34,211,238,0.12)_40%,transparent_70%)] blur-3xl" />

              <div className="absolute inset-0 -z-10 rounded-full border border-white/5" />
              <div className="absolute inset-6 -z-10 rounded-full border border-white/[0.07]" />
              <div className="absolute inset-12 -z-10 rounded-full border border-white/[0.09]" />

              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-2 shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(96,165,250,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.14) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                      maskImage:
                        "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                  <Image
                    src={avatarUrl || DEFAULT_AVATAR}
                    alt={siteConfig.fullName}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 1024px) 300px, 430px"
                    className="relative z-10 object-contain object-bottom"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 backdrop-blur-md">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-semibold text-white">
                        {siteConfig.fullName}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {siteConfig.title}
                      </p>
                    </div>
                    <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-8 hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 shadow-xl backdrop-blur-xl sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                  <Code2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold leading-none text-white">
                    5+
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                    Projets
                  </p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-24 hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 shadow-xl backdrop-blur-xl sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
                  <Star className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold leading-none text-white">
                    98%
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                    Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="hero-stat group relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-1.5 py-3 text-center backdrop-blur-md transition-colors duration-300 hover:border-white/20 sm:rounded-2xl sm:px-6 sm:py-5"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-sky-300 sm:h-9 sm:w-9 sm:rounded-lg">
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="mt-2 font-heading text-lg font-semibold tabular-nums text-white sm:text-3xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mx-auto mt-1 max-w-full break-words text-[10px] uppercase leading-tight tracking-[0.04em] text-slate-500 sm:text-xs sm:tracking-[0.14em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-marquee relative z-10 mt-10 border-y border-white/[0.07] bg-white/[0.015] py-3 sm:mt-12 sm:py-4">
        <div className="mask-fade-x overflow-hidden">
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-5 pr-5 sm:gap-10 sm:pr-10"
              >
                {technologies.map((tech) => (
                  <div
                    key={`${tech}-${copy}`}
                    className="flex shrink-0 items-center gap-5 sm:gap-10"
                  >
                    <span className="whitespace-nowrap font-heading text-xs font-medium tracking-wide text-slate-400 sm:text-sm">
                      {tech}
                    </span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-blue-500/50" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#about"
          className="group flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-slate-300"
          aria-label="Défiler vers la section à propos"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/15 p-1">
            <ChevronDown className="h-3 w-3 animate-bounce" />
          </span>
        </a>
      </div>
    </section>
  );
}
