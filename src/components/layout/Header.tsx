"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Services", href: "/services" },
  { name: "Projets", href: "/projets" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => { if (data.logo) setLogoUrl(data.logo) })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 border-b border-border backdrop-blur-md shadow-sm"
          : "bg-background/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link href="/" className="flex items-center group">
            <div className="h-20 lg:h-24 transition-transform group-hover:scale-105">
              <img
                src={logoUrl || "/images/avatars/logo.png"}
                alt="Logo"
                className="h-full w-auto"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="rounded-lg">
                Me Contacter
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative z-50 p-2 rounded-lg transition-colors bg-background/60 hover:bg-muted"
            aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-background border-l border-border shadow-2xl lg:hidden">
            <div className="flex flex-col pt-20 px-6 h-full bg-background">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pb-8">
                <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                  <Button className="w-full rounded-lg">
                    Me Contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
