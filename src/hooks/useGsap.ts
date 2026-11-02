"use client";

import { useLayoutEffect, useRef } from "react";
import type { DependencyList } from "react";
import { gsap } from "@/lib/gsap";

type Setup<T extends HTMLElement> = (scope: T) => void;

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: Setup<T>,
  deps: DependencyList = [],
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    const ctx = gsap.context(() => setup(scope), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
