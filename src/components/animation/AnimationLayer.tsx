"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AnimationLayer() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);

  useIsomorphicLayoutEffect(() => {
    const root = curtainRef.current;
    if (!root) return;

    // The first render already has the curtain hidden. StrictMode replays the
    // effect with the same pathname, so comparing paths also avoids a flash in
    // development while still animating every real navigation (including back
    // to the initial route).
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    const panels = root.querySelectorAll<HTMLElement>("[data-curtain-panel]");
    const mark = root.querySelector<HTMLElement>("[data-curtain-mark]");
    if (!panels.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(panels, { scaleY: 0 });
      gsap.set(mark, { opacity: 0 });
      return;
    }

    // The router restores the scroll position before this effect runs. Without
    // an instant reset the page visibly slides from the old offset (especially
    // with a scrolled homepage) and reveals appear out of viewport.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // The overlay is purely decorative: it never captures pointer events, so a
    // navigation can never leave the page unresponsive.
    const tl = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => gsap.set(panels, { scaleY: 0 }),
    });

    tl.set(panels, { scaleY: 1, transformOrigin: "top" })
      .set(mark, { opacity: 1, scale: 1 })
      .to(panels, {
        scaleY: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.inOut",
      })
      .to(mark, { opacity: 0, scale: 0.92, duration: 0.22 }, 0.05);

    return () => {
      tl.kill();
      gsap.set(panels, { scaleY: 0 });
      gsap.set(mark, { opacity: 0 });
    };
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: { y: target, offsetY: 88, autoKill: true },
      });
      window.history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            data-curtain-panel
            className="h-full flex-1 origin-top scale-y-0 bg-[linear-gradient(180deg,#05070f_0%,#0a1428_55%,#05070f_100%)] will-change-transform"
          />
        ))}
      </div>
      <div
        data-curtain-mark
        className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 opacity-0"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-heading text-sm font-bold text-white ring-1 ring-white/15">
          DA
        </span>
        <span className="font-heading text-sm font-semibold tracking-[0.32em] text-white/70">
          DJOSSE
        </span>
      </div>
    </div>
  );
}
