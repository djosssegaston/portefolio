"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Opacity is composited by the GPU; animating background-position on a
      // full-screen masked layer repaints every frame and makes scrolling and
      // route changes stutter on modest hardware.
      gsap.to(".bg-grid-primary", {
        opacity: 0.55,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".bg-grid-accent", {
        opacity: 0.3,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".bg-aurora-primary", {
        xPercent: 14,
        yPercent: -10,
        scale: 1.08,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".bg-aurora-accent", {
        xPercent: -14,
        yPercent: 10,
        scale: 1.12,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="bg-grid-primary absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 15%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 15%, transparent 70%)",
        }}
      />
      <div
        className="bg-grid-accent absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "rotate(45deg) scale(1.5)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 45% at 60% 50%, black 10%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 45% at 60% 50%, black 10%, transparent 70%)",
        }}
      />
      <div className="bg-aurora-primary absolute -left-32 top-1/4 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16),transparent_65%)] blur-2xl" />
      <div className="bg-aurora-accent absolute -right-40 bottom-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.13),transparent_65%)] blur-2xl" />
      <div className="noise-overlay absolute inset-0 opacity-[0.025]" />
    </div>
  );
}
