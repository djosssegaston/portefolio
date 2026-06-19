"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Send,
  Phone,
  MapPin,
  Mail,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { siteConfig } from "@/lib/data/site-config"

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .regex(
      /^[+\d\s\-()]{6,20}$/,
      "Numéro de téléphone invalide",
    )
    .optional()
    .or(z.literal("")),
  subject: z.string().min(1, "Veuillez sélectionner un sujet"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message est trop long (2000 caractères max)"),
})

type ContactFormData = z.infer<typeof contactSchema>

const subjectOptions = [
  { value: "projet", label: "Demande de projet" },
  { value: "collaboration", label: "Proposition de collaboration" },
  { value: "freelance", label: "Mission freelance" },
  { value: "information", label: "Demande d'information" },
  { value: "autre", label: "Autre" },
] as const

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(data: ContactFormData) {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message envoyé avec succès !",
        description: "Je vous répondrai dans les plus brefs délais.",
      })
      reset()
    }, 1000)
  }

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-card"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="section-label mx-auto w-fit">
            Contact
          </div>
          <h2 className="section-heading mt-4">
            Travaillons <span className="gradient-text">Ensemble</span>
          </h2>
          <p className="section-desc">
            Discutons de votre projet et trouvons ensemble la meilleure solution
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-lg border border-border bg-card p-6 sm:p-8 space-y-6"
              noValidate
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    {...register("name")}
                    className={cn("bg-muted border-0 text-foreground placeholder:text-secondary/50", errors.name && "border-destructive border")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    {...register("email")}
                    className={cn("bg-muted border-0 text-foreground placeholder:text-secondary/50", errors.email && "border-destructive border")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Téléphone (optionnel)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+229 XX XX XX XX"
                    {...register("phone")}
                    className={cn("bg-muted border-0 text-foreground placeholder:text-secondary/50", errors.phone && "border-destructive border")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-foreground"
                  >
                    Sujet
                  </label>
                  <Select
                    onValueChange={(value) => setValue("subject", value)}
                  >
                    <SelectTrigger
                      id="subject"
                      className={cn("bg-muted border-0 text-foreground", errors.subject && "border-destructive border")}
                    >
                      <SelectValue placeholder="Sélectionnez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet..."
                  rows={6}
                  {...register("message")}
                  className={cn(
                    "resize-none bg-muted border-0 text-foreground placeholder:text-secondary/50",
                    errors.message && "border-destructive border",
                  )}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Envoi en cours...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="break-all text-sm text-secondary transition-colors hover:text-primary"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Téléphone
                    </p>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="text-sm text-secondary transition-colors hover:text-primary"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Localisation
                    </p>
                    <p className="text-sm text-secondary">
                      {siteConfig.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="mb-4 text-sm font-medium text-foreground">
                Retrouvez-moi sur les réseaux
              </p>
              <div className="flex flex-wrap gap-3">
                {siteConfig.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                    aria-label={link.name}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/22901234567"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/[0.06] p-4 transition-colors hover:border-accent/40 hover:bg-accent/[0.1]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-accent">
                  Discutons sur WhatsApp
                </p>
                <p className="text-xs text-accent/70">
                  Réponse sous 24h
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-accent" />
            </a>

            <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {siteConfig.location}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
