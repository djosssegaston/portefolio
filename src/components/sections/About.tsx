"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Download,
  Check,
  Quote,
  Play,
  Briefcase as WorkIcon,
  GraduationCap as EduIcon,
  Award as AwardIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/data/site-config"

const timelineIcons: Record<string, React.ElementType> = {
  work: WorkIcon,
  education: EduIcon,
  achievement: AwardIcon,
}

const timelineColors: Record<string, string> = {
  work: "bg-primary text-white",
  education: "bg-emerald-500 text-white",
  achievement: "bg-amber-500 text-white",
}

function TimelineItem({
  item,
  index,
  isLeft,
}: {
  item: (typeof siteConfig.about.timeline)[0]
  index: number
  isLeft: boolean
}) {
  const Icon = timelineIcons[item.type]
  const colorClass = timelineColors[item.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className={cn(
        "relative flex items-start gap-6 pb-12 last:pb-0 group",
        isLeft ? "md:flex-row-reverse md:text-right" : "md:text-left",
      )}
    >
      <motion.div
        className={cn("rounded-lg border border-border bg-card p-5 transition-all duration-300", "md:w-[calc(50%-2rem)]")}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Badge
          variant="outline"
          className="w-fit border-primary/30 px-3 py-1 font-heading text-sm font-semibold text-primary"
        >
          {item.year}
        </Badge>
        <h4 className="mt-2 font-heading text-lg font-bold text-foreground">
          {item.title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-secondary">
          {item.description}
        </p>
      </motion.div>

      <div className="relative flex flex-col items-center">
        <motion.div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm relative z-10",
            colorClass,
          )}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Icon className="h-5 w-5 relative z-10" />
          <motion.span
            className="absolute inset-0 rounded-full bg-current opacity-30"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
        </motion.div>
        <motion.div
          className="absolute top-10 h-full w-px bg-gradient-to-b from-primary/30 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
        />
      </div>

      <div className="hidden flex-1 md:block md:w-[calc(50%-2rem)]" />
    </motion.div>
  )
}

function WrapperTag({ href, className, children }: { href?: string; className?: string; children: React.ReactNode }) {
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  }
  return <div className={className}>{children}</div>
}

export default function About() {
  const [aboutImageUrl, setAboutImageUrl] = useState("")
  const [demoVideo, setDemoVideo] = useState("")

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.aboutImage) setAboutImageUrl(data.aboutImage)
        if (data.demoVideo) setDemoVideo(data.demoVideo)
      })
      .catch(() => {})
  }, [])

  const presentation = siteConfig.about.presentation
  const paragraphs = presentation.split("\n\n").filter(Boolean)

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="À propos"
    >
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="section-label mx-auto w-fit">
            À propos
          </div>
          <h2 className="section-heading mt-4">
            Mon <span className="gradient-text">Parcours</span>
          </h2>
          <p className="section-desc">
            Découvrez mon parcours, ma vision et mes valeurs
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card">
              <div
                className="flex h-full items-center justify-center relative"
                style={aboutImageUrl ? { backgroundImage: `url(${aboutImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              >
                {aboutImageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />}
                <div className="text-center relative z-10">
                  <WrapperTag href={demoVideo || undefined} className="block">
                    <div className="mx-auto mb-4 relative h-32 w-32 flex items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        style={{ animation: "ripple 2s ease-out infinite" }}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        style={{ animation: "ripple 2s ease-out infinite 0.6s" }}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        style={{ animation: "ripple 2s ease-out infinite 1.2s" }}
                      />
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 overflow-hidden group cursor-pointer">
                        <Play className="h-10 w-10 text-primary" />
                        {demoVideo && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </WrapperTag>
                  <p className={`text-lg font-medium ${aboutImageUrl ? "text-white" : "text-secondary"}`}>
                    {siteConfig.fullName}
                  </p>
                  <p className={`text-sm ${aboutImageUrl ? "text-white/80" : "text-muted-foreground"}`}>{siteConfig.title}</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WorkIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground">8+</p>
                  <p className="text-xs text-secondary">Ans d&apos;expérience</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              {paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-base leading-relaxed text-secondary sm:text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative rounded-lg border border-border bg-card p-6 sm:p-8"
            >
              <Quote className="absolute right-6 top-6 h-12 w-12 text-primary/10" />
              <p className="relative z-10 font-heading text-lg font-medium italic leading-relaxed text-foreground sm:text-xl">
                &ldquo;{siteConfig.about.vision}&rdquo;
              </p>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="font-heading text-xl font-bold text-foreground">
                Mes Valeurs
              </h3>
              <ul className="mt-4 space-y-3">
                {siteConfig.about.values.map((value, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-secondary sm:text-base">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Button size="lg" className="gap-2" asChild>
                <a href={siteConfig.about.cvUrl} download aria-label="Télécharger le CV">
                  <Download className="h-5 w-5" />
                  Télécharger mon CV
                </a>
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-24"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="gradient-text"
            >
              Chronologie
            </motion.span>
          </motion.h3>
          <div className="relative mx-auto max-w-3xl">
            {siteConfig.about.timeline.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
