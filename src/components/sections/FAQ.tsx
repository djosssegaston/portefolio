"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import Link from "next/link"
import { faq } from "@/lib/data/faq"

const categories = [
  { value: "all", label: "Toutes" },
  { value: "Général", label: "Général" },
  { value: "Prestations", label: "Prestations" },
  { value: "Technique", label: "Technique" },
  { value: "Business", label: "Business" },
] as const

function formatAnswer(answer: string) {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const parts = answer.split(urlRegex)
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary-300"
        >
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredFaq = useMemo(() => {
    if (activeCategory === "all") return faq
    return faq.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-background" aria-label="FAQ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="section-label mx-auto w-fit">
            FAQ
          </div>
          <h2 className="section-heading mt-4">
            Questions <span className="gradient-text">Fréquentes</span>
          </h2>
          <p className="section-desc">
            Tout ce que vous devez savoir avant de collaborer
          </p>
        </motion.div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-secondary hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          {filteredFaq.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaq.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <AccordionItem value={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 text-left font-heading text-base font-semibold text-foreground hover:text-primary hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-base leading-relaxed text-secondary">
                      {formatAnswer(item.answer)}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mx-auto mt-16 max-w-2xl rounded-lg border border-border bg-card p-8 text-center sm:p-12"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
            Vous avez d&rsquo;autres questions ?
          </h3>
          <p className="mt-2 text-sm text-secondary">
            Je serais ravi de discuter de votre projet et de répondre à toutes
            vos questions
          </p>
          <Link href="/contact">
            <Button className="mt-6 gap-2" size="lg">
              <MessageSquare className="h-4 w-4" />
              Me contacter
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
