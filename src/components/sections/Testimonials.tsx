"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import type { Testimonial } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { testimonials as staticTestimonials } from "@/lib/data/testimonials";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200",
          )}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Testimonials({
  testimonials = staticTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setItemsPerSlide(1);
      else if (window.innerWidth < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, testimonials.length]);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);
  const currentSlide = Math.floor(currentIndex / itemsPerSlide);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => {
      const next = prev + itemsPerSlide;
      return next >= testimonials.length ? 0 : next;
    });
  }, [itemsPerSlide, testimonials.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const next = prev - itemsPerSlide;
      if (next < 0) {
        const remainder = testimonials.length % itemsPerSlide;
        return remainder === 0
          ? testimonials.length - itemsPerSlide
          : testimonials.length - remainder;
      }
      return next;
    });
  }, [itemsPerSlide, testimonials.length]);

  function goToSlide(slideIndex: number) {
    setDirection(slideIndex > currentSlide ? 1 : -1);
    setCurrentIndex(slideIndex * itemsPerSlide);
  }

  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goToNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goToNext, totalSlides]);

  useEffect(() => {
    if (!gridRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tween = gsap.fromTo(
      gridRef.current,
      { opacity: 0, x: direction * 36 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
    );

    return () => {
      tween.kill();
    };
  }, [currentIndex, direction]);

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerSlide,
  );

  return (
    <section
      id="testimonials"
      className="section-shell relative bg-white"
      aria-label="Témoignages"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Témoignages</div>
          <h2 className="section-heading mt-5">
            Ce qu&rsquo;ils disent de <span className="gradient-text">moi</span>
          </h2>
          <p className="section-desc">
            Ce que mes clients disent de leur expérience
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              ref={gridRef}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="surface group relative h-full overflow-hidden p-6 sm:p-7"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/[0.04] blur-2xl" />
                  <Quote className="mb-4 h-8 w-8 text-primary/20" />
                  <StarRating rating={testimonial.rating} />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-secondary">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-6">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-xs text-secondary">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatDate(testimonial.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-secondary shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:text-foreground sm:-left-4"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-secondary shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:text-foreground sm:-right-4"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentSlide === i
                        ? "w-8 bg-primary"
                        : "w-2 bg-primary/25 hover:bg-primary/50",
                    )}
                    aria-label={`Aller au témoignage ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
