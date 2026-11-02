"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faq as staticFaq } from "@/lib/data/faq";

const categories = [
  { value: "all", label: "Toutes" },
  { value: "Général", label: "Général" },
  { value: "Prestations", label: "Prestations" },
  { value: "Technique", label: "Technique" },
  { value: "Business", label: "Business" },
] as const;

function formatAnswer(answer: string) {
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const parts = answer.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary-600"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function FAQSection({ faq = staticFaq }: { faq?: FAQ[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaq = useMemo(() => {
    if (activeCategory === "all") return faq;
    return faq.filter((item) => item.category === activeCategory);
  }, [activeCategory, faq]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("gsap:refresh"));
    });
    return () => cancelAnimationFrame(frame);
  }, [filteredFaq]);

  return (
    <section id="faq" className="section-shell relative bg-white" aria-label="FAQ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">FAQ</div>
          <h2 className="section-heading mt-5">
            Questions <span className="gradient-text">Fréquentes</span>
          </h2>
          <p className="section-desc">
            Tout ce que vous devez savoir avant de collaborer
          </p>
        </div>

        <div data-reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:text-sm",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-transparent bg-slate-100/70 text-secondary hover:border-slate-200 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          {filteredFaq.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaq.map((item) => (
                <div key={item.id} data-reveal>
                  <AccordionItem
                    value={item.id}
                    className="surface overflow-hidden rounded-2xl border-slate-200/70 px-1"
                  >
                    <AccordionTrigger className="px-5 py-4 text-left font-heading text-base font-semibold text-foreground hover:text-primary hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-base leading-relaxed text-secondary">
                      {formatAnswer(item.answer)}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-secondary">
                Aucune question trouvée
              </p>
            </div>
          )}
        </div>

        <div
          data-reveal
          className="surface relative mx-auto mt-16 max-w-2xl overflow-hidden p-8 text-center sm:p-12"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
            <MessageSquare className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Vous avez d&rsquo;autres questions ?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-secondary">
            Je serais ravi de discuter de votre projet et de répondre à toutes
            vos questions
          </p>
          <Link href="/contact">
            <Button className="mt-6 gap-2 rounded-full" size="lg">
              <MessageSquare className="h-4 w-4" />
              Me contacter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
