"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type Setters = {
  rx: ReturnType<typeof gsap.quickTo>;
  ry: ReturnType<typeof gsap.quickTo>;
};

/**
 * One delegated pointer listener for every interactive surface. Cards share
 * the exact same micro-interaction (3D tilt + light that follows the cursor)
 * instead of each section inventing its own hover effect.
 */
export default function CardTilt() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const setters = new WeakMap<HTMLElement, Setters>();
    let active: HTMLElement | null = null;

    const getSetters = (card: HTMLElement) => {
      const existing = setters.get(card);
      if (existing) return existing;

      gsap.set(card, { transformPerspective: 900, transformOrigin: "center" });
      const next = {
        rx: gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" }),
        ry: gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" }),
      };
      setters.set(card, next);
      return next;
    };

    const reset = (card?: HTMLElement | null) => {
      if (!card) return;
      const { rx, ry } = getSetters(card);
      rx(0);
      ry(0);
      gsap.to(card, { y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
      card.style.setProperty("--mx", "-30%");
      card.style.setProperty("--my", "50%");
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest<HTMLElement>(".surface-interactive") ?? null;

      if (card !== active) {
        reset(active);
        active = card;
      }
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);

      const { rx, ry } = getSetters(card);
      rx((0.5 - py) * 6);
      ry((px - 0.5) * 8);
      gsap.to(card, { y: -3, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };

    const onOut = (event: PointerEvent) => {
      if (!active) return;
      const related = event.relatedTarget as Node | null;
      if (related && active.contains(related)) return;
      reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      reset(active);
    };
  }, []);

  return null;
}
