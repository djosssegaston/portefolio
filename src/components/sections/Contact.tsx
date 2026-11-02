"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  Phone,
  MapPin,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/lib/data/site-config";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .regex(/^[+\d\s\-()]{6,20}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(1, "Veuillez sélectionner un sujet"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message est trop long (2000 caractères max)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: "projet", label: "Demande de projet" },
  { value: "collaboration", label: "Proposition de collaboration" },
  { value: "freelance", label: "Mission freelance" },
  { value: "information", label: "Demande d'information" },
  { value: "autre", label: "Autre" },
] as const;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          title: "Message non envoyé",
          description:
            payload?.error ?? "Une erreur est survenue. Merci de réessayer.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message envoyé avec succès !",
        description: "Je vous répondrai dans les plus brefs délais.",
      });
      reset();
    } catch {
      toast({
        title: "Message non envoyé",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-shell relative bg-card/60" aria-label="Contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-14 text-center">
          <div className="section-label mx-auto w-fit">Contact</div>
          <h2 className="section-heading mt-5">
            Travaillons <span className="gradient-text">Ensemble</span>
          </h2>
          <p className="section-desc">
            Discutons de votre projet et trouvons ensemble la meilleure solution
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-reveal="right">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="surface space-y-6 p-6 sm:p-8"
              noValidate
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    {...register("name")}
                    className={cn(
                      "h-11 rounded-xl border border-slate-200 bg-slate-50/70 text-foreground placeholder:text-secondary/50 focus-visible:bg-white",
                      errors.name && "border-destructive",
                    )}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    {...register("email")}
                    className={cn(
                      "h-11 rounded-xl border border-slate-200 bg-slate-50/70 text-foreground placeholder:text-secondary/50 focus-visible:bg-white",
                      errors.email && "border-destructive",
                    )}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Téléphone (optionnel)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+229 XX XX XX XX"
                    {...register("phone")}
                    className={cn(
                      "h-11 rounded-xl border border-slate-200 bg-slate-50/70 text-foreground placeholder:text-secondary/50 focus-visible:bg-white",
                      errors.phone && "border-destructive",
                    )}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Sujet
                  </label>
                  <Select onValueChange={(value) => setValue("subject", value)}>
                    <SelectTrigger
                      id="subject"
                      className={cn(
                        "h-11 rounded-xl border border-slate-200 bg-slate-50/70 text-foreground focus:bg-white",
                        errors.subject && "border-destructive",
                      )}
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
                    <p className="text-xs text-destructive">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet..."
                  rows={6}
                  {...register("message")}
                  className={cn(
                    "resize-none rounded-xl border border-slate-200 bg-slate-50/70 text-foreground placeholder:text-secondary/50 focus-visible:bg-white",
                    errors.message && "border-destructive",
                  )}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 rounded-full sm:w-auto"
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
          </div>

          <div data-reveal="left" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="surface surface-interactive p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

              <div className="surface surface-interactive p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Téléphone</p>
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="text-sm text-secondary transition-colors hover:text-primary"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="surface surface-interactive p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Localisation</p>
                    <p className="text-sm text-secondary">{siteConfig.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Réponse sous 24h
                </p>
                <p className="text-xs text-secondary">
                  Du lundi au vendredi, de 9h à 18h
                </p>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            <div>
              <p className="mb-4 text-sm font-medium text-foreground">
                Retrouvez-moi sur les réseaux
              </p>
              <div className="flex flex-wrap gap-2">
                {siteConfig.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-secondary transition-colors hover:border-primary/30 hover:text-primary"
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
              className="group flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/[0.06] p-4 transition-colors hover:border-accent/40 hover:bg-accent/[0.1]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-accent">
                  Discutons sur WhatsApp
                </p>
                <p className="text-xs text-accent/70">Réponse sous 24h</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/60">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative text-center">
                <MapPin className="mx-auto h-7 w-7 text-primary/60" />
                <p className="mt-2 text-sm font-medium text-secondary">
                  {siteConfig.location}
                </p>
                <p className="text-xs text-muted-foreground">Disponible à distance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
