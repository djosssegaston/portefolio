"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/data/site-config"

const DEFAULT_AVATAR = "/images/avatars/author.svg"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  )
}

const socialIcons = [
  { name: "GitHub", icon: Github, color: "hover:text-[#333]" },
  { name: "LinkedIn", icon: Linkedin, color: "hover:text-[#0A66C2]" },
  { name: "WhatsApp", icon: WhatsAppIcon, color: "hover:text-[#25D366]" },
  { name: "Facebook", icon: Facebook, color: "hover:text-[#1877F2]" },
]

const socialMap: Record<string, string> = {
  Github: "GitHub",
  Linkedin: "LinkedIn",
  MessageCircle: "WhatsApp",
  Facebook: "Facebook",
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
        />
      )}
    </span>
  )
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let current = 0
          const step = Math.ceil(value / 60)
          const interval = setInterval(() => {
            current += step
            if (current >= value) {
              current = value
              clearInterval(interval)
            }
            setCount(current)
          }, 30)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="font-heading text-lg sm:text-2xl md:text-3xl font-bold text-foreground">
      {count}
      {suffix}
    </div>
  )
}

export default function Hero() {
  const [avatarUrl, setAvatarUrl] = useState("")
  const sectionRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(0, { stiffness: 150, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 30 })

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.avatar) setAvatarUrl(data.avatar)
      })
      .catch(() => {})
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      rotateX.set(-y * 10)
      rotateY.set(x * 10)
    },
    [mouseX, mouseY, rotateX, rotateY]
  )

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  const stats = [
    { label: "Années d'expérience", value: 8, suffix: "+", icon: Briefcase },
    { label: "Projets réalisés", value: 45, suffix: "+", icon: Code2 },
    { label: "Satisfaction client", value: 98, suffix: "%", icon: Star },
  ]

  const socialLinks = siteConfig.socialLinks

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden pt-16 lg:pt-20"
      aria-label="Section d'accueil"
    >

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] flex-col justify-center px-4 sm:px-6 lg:px-8 lg:min-h-[calc(100vh-5rem)]">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 text-center lg:text-left lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                Je suis{" "}
                <span className="gradient-text">
                  <TypewriterText text={siteConfig.fullName} delay={0.5} />
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start"
              >
                <Badge variant="secondary" className="text-xs px-3 py-1 md:text-sm">
                  Développeur Full Stack
                </Badge>
                <Badge variant="secondary" className="text-xs px-3 py-1 md:text-sm">
                  Architecte de Solutions Digitales
                </Badge>
                <Badge variant="secondary" className="text-xs px-3 py-1 md:text-sm">
                  Consultant en Transformation Numérique
                </Badge>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary sm:text-base lg:mx-0"
              >
                Je conçois des plateformes web performantes, sécurisées et évolutives qui aident les entreprises à automatiser leurs processus et accélérer leur croissance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <Button
                  size="default"
                  className="w-full sm:w-auto shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-shadow duration-300 relative overflow-hidden group"
                  asChild
                >
                  <a href="#projects" aria-label="Voir mes réalisations">
                    <span className="relative z-10">Voir mes réalisations</span>
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </a>
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href="#contact" aria-label="Planifier une consultation">
                    <MessageCircle className="h-4 w-4" />
                    Planifier une consultation
                  </a>
                </Button>
                <Button size="default" variant="ghost" className="w-full sm:w-auto" asChild>
                  <a href={siteConfig.about.cvUrl} download aria-label="Télécharger mon CV">
                    <Download className="h-4 w-4" />
                    Télécharger mon CV
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 flex items-center justify-center lg:order-2 perspective-[1000px] mt-8 lg:mt-16"
            >
              <motion.div
                className="relative"
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute -inset-10 sm:-inset-12 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)",
                    filter: "blur(80px)",
                  }}
                />

                {/* Photo sans style */}
                <motion.div
                  className="relative"
                  style={{
                    translateZ: "30px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="h-72 w-72 sm:h-80 sm:w-80 md:h-[22rem] md:w-[22rem] lg:h-[26rem] lg:w-[26rem] overflow-hidden rounded-xl shadow-lg">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={siteConfig.fullName} className="h-full w-full object-contain" />
                    ) : (
                      <img src={DEFAULT_AVATAR} alt={siteConfig.fullName} className="h-full w-full object-contain" />
                    )}
                  </div>
                </motion.div>

                {/* Réseaux sociaux - en dessous */}
                <motion.div
                  className="mt-6 flex items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  style={{ transformStyle: "preserve-3d", translateZ: 40 }}
                >
                  {socialLinks.map((link) => {
                    const si = socialIcons.find(
                      (s) => s.name === (socialMap[link.icon] || link.icon)
                    )
                    if (!si) return null
                    const Icon = si.icon
                    return (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title={link.name}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    )
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-10 sm:mt-12 grid max-w-lg grid-cols-3 gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-border/50 bg-card/80 p-4 sm:p-6 shadow-lg backdrop-blur-sm lg:max-w-none"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 sm:gap-2 rounded-lg p-2 sm:p-3"
              >
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="text-center">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-[10px] sm:text-xs md:text-sm text-secondary">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest text-secondary/50">Scroll</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-secondary/50" />
        </div>
      </motion.div>
    </section>
  )
}
