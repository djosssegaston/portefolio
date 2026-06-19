"use client";

import Link from "next/link";
import {
  Linkedin,
  Github,
  MessageCircle,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/lib/data/site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
  {
    title: "Liens Rapides",
    links: [
      { name: "Accueil", href: "/" },
      { name: "À Propos", href: "/a-propos" },
      { name: "Services", href: "/services" },
      { name: "Projets", href: "/projets" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Développement Web", href: "/services" },
      { name: "Applications Mobiles", href: "/services" },
      { name: "Consulting Digital", href: "/services" },
      { name: "UI/UX Design", href: "/services" },
      { name: "SEO & Marketing", href: "/services" },
      { name: "Formation", href: "/services" },
    ],
  },
];

const socialIcons: Record<string, React.ElementType> = {
  Linkedin,
  Github,
  MessageCircle,
  Facebook,
  Twitter,
  Mail,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div className="space-y-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                  <span className="text-white font-heading font-bold text-sm">DA</span>
                </div>
                <span className="font-heading font-bold text-base text-foreground">
                  DJOSSE Adechina
                </span>
              </Link>
              <p className="text-secondary text-sm leading-relaxed">
                Développeur web & consultant digital spécialisé dans la création de solutions numériques innovantes.
              </p>
              <div className="flex items-center gap-2.5">
                {siteConfig.socialLinks.map((social) => {
                  const Icon = socialIcons[social.icon];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-5">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-primary">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-secondary text-sm hover:text-foreground transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 text-primary opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-5">
              <h3 className="font-heading font-semibold text-sm uppercase tracking-widest text-primary">
                Contact
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-3 text-secondary text-sm hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Mail className="w-4 h-4 text-primary" />
                    </span>
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-3 text-secondary text-sm hover:text-foreground transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </span>
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-secondary text-sm group">
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                    </span>
                    {siteConfig.location}
                  </div>
                </li>
              </ul>

              <div className="pt-3 space-y-3">
                <h4 className="font-heading font-semibold text-xs uppercase tracking-widest text-secondary">
                  Newsletter
                </h4>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex gap-2"
                >
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-muted border-0 placeholder:text-secondary/50 text-foreground h-10 text-sm"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear}{" "}
              <span className="text-primary font-medium">{siteConfig.name}</span>. Tous droits
              réservés.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground text-xs">
              <Link href="/a-propos" className="hover:text-primary transition-colors">À Propos</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/admin" className="hover:text-primary transition-colors">Administration</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
