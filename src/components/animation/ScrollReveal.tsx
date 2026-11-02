"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const VARIANTS: Record<string, gsap.TweenVars> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: 48 },
  right: { x: -48 },
  scale: { scale: 0.92 },
  fade: {},
};

const EASE = "power3.out";

// React attaches internal props to a DOM node once it owns it. Streamed
// server-rendered sections are inserted before they hydrate, so writing inline
// styles at that moment makes React report "Extra attributes from the server".
// We only touch nodes React already owns and retry until the stream settles.
const HYDRATION_RETRY_MS = 100;
const HYDRATION_MAX_RETRIES = 40;

function isReactHydrated(el: Element) {
  for (const key in el) {
    if (key.startsWith("__reactFiber$") || key.startsWith("__reactProps$")) {
      return true;
    }
  }
  return false;
}

type Timers = {
  frame: number;
  refreshFrame: number;
  safety: number;
  retry: number;
};

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).has("noreveal")) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const contexts: gsap.Context[] = [];
    const registered = new WeakSet<HTMLElement>();
    const safeRevealed = new WeakSet<HTMLElement>();
    const timers: Timers = { frame: 0, refreshFrame: 0, safety: 0, retry: 0 };
    let disposed = false;
    let retries = 0;

    const refresh = () => {
      if (disposed) return;
      window.cancelAnimationFrame(timers.refreshFrame);
      timers.refreshFrame = window.requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    };

    const canTouch = (el: HTMLElement) =>
      retries >= HYDRATION_MAX_RETRIES || isReactHydrated(el);

    const registerReveals = () => {
      if (disposed) return;
      timers.frame = 0;

      let pending = false;
      let didRegister = false;

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (registered.has(el)) return;
          if (!canTouch(el)) {
            pending = true;
            return;
          }
          registered.add(el);
          didRegister = true;

          const variant = el.dataset.reveal || "up";
          const from = VARIANTS[variant] ?? VARIANTS.up;
          const delay = parseFloat(el.dataset.revealDelay || "0");
          const duration = parseFloat(el.dataset.revealDuration || "0.9");

          gsap.set(el, { opacity: 0, ...from });
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration,
            delay,
            ease: EASE,
            overwrite: "auto",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          if (registered.has(group)) return;

          const items = Array.from(
            group.querySelectorAll<HTMLElement>("[data-reveal-item]"),
          );
          if (!items.length) return;
          if (!canTouch(group) || items.some((item) => !canTouch(item))) {
            pending = true;
            return;
          }
          registered.add(group);
          didRegister = true;

          gsap.set(items, { opacity: 0, y: 36 });
          ScrollTrigger.batch(items, {
            start: "top 92%",
            once: true,
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.07,
                ease: EASE,
                overwrite: true,
              });
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          if (registered.has(el)) return;
          if (!canTouch(el)) {
            pending = true;
            return;
          }
          registered.add(el);
          didRegister = true;

          const speed = parseFloat(el.dataset.parallax || "0.18");
          gsap.to(el, {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      });

      if (didRegister) {
        contexts.push(ctx);
        refresh();
      } else {
        ctx.revert();
      }

      if (pending) scheduleRetry();
    };

    const scheduleRetry = () => {
      if (disposed) return;
      window.clearTimeout(timers.retry);
      timers.retry = window.setTimeout(() => {
        if (disposed) return;
        retries += 1;
        registerReveals();
      }, HYDRATION_RETRY_MS);
    };

    // Runs after the route commit. Sections that have not hydrated yet are
    // skipped and picked up by the retry timer, so server-rendered nodes are
    // never mutated while React is still attaching to them.
    registerReveals();

    const onRefresh = () => {
      if (timers.frame) window.cancelAnimationFrame(timers.frame);
      timers.frame = window.requestAnimationFrame(registerReveals);
    };

    window.addEventListener("gsap:refresh", onRefresh);

    // Streamed routes, filtered lists and async sections can add reveal
    // targets after the first pass. Catch them before they are painted.
    const observer = new MutationObserver(onRefresh);
    observer.observe(document.body, { childList: true, subtree: true });

    // Images, fonts and the Three.js canvases change the layout after the first
    // measurement; refresh once the browser is settled.
    let loadFrame = 0;
    const onLoad = () => {
      window.cancelAnimationFrame(loadFrame);
      loadFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad).catch(() => {});

    // Safety net: if a trigger failed to fire (late layout, WebGL resize, a
    // suspended route...) reveal anything already on screen instead of leaving
    // a blank area. Elements with a running tween are left alone.
    timers.safety = window.setTimeout(() => {
      if (disposed) return;
      document
        .querySelectorAll<HTMLElement>(
          "[data-reveal], [data-reveal-item], [data-gsap-item]",
        )
        .forEach((el) => {
          if (safeRevealed.has(el) || gsap.isTweening(el)) return;
          if (!canTouch(el)) return;
          const rect = el.getBoundingClientRect();
          const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
          if (!onScreen) return;
          const opacity = parseFloat(window.getComputedStyle(el).opacity);
          if (opacity >= 0.05) return;
          safeRevealed.add(el);
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: EASE,
            overwrite: true,
          });
        });
      ScrollTrigger.refresh();
    }, 1600);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(timers.frame);
      window.cancelAnimationFrame(timers.refreshFrame);
      window.cancelAnimationFrame(loadFrame);
      window.clearTimeout(timers.safety);
      window.clearTimeout(timers.retry);
      window.removeEventListener("gsap:refresh", onRefresh);
      window.removeEventListener("load", onLoad);
      observer.disconnect();
      contexts.forEach((context) => context.revert());
    };
  }, [pathname]);

  return null;
}
