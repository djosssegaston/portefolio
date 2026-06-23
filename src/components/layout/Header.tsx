"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Wrench, FolderKanban, Calendar, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Services", href: "/services" },
  { name: "Projets", href: "/projets" },
  { name: "Événements", href: "/evenements" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const navIcons: Record<string, React.ElementType> = {
  Accueil: Home,
  "À Propos": User,
  Services: Wrench,
  Projets: FolderKanban,
  "Événements": Calendar,
  Blog: FileText,
  Contact: Mail,
};

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          isScrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-[0_1px_30px_-10px_rgba(0,0,0,0.1)]"
            : "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
        )}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center group relative">
              <div className="h-14 lg:h-[56px] transition-all duration-300 group-hover:scale-105 group-hover:brightness-110">
                <img
                  src={logoUrl || "/images/avatars/logo.png"}
                  alt="Logo"
                  className="h-full w-auto"
                />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 group",
                      isActive(link.href)
                        ? "text-primary"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span
                      className={cn(
                        "absolute bottom-1 left-4 right-4 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center",
                        isActive(link.href)
                          ? "bg-gradient-to-r from-primary via-accent to-primary"
                          : "bg-gradient-to-r from-primary/60 to-accent/60"
                      )}
                    />
                  </Link>
                ))}
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/0168552584"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden relative z-[60] p-2.5 rounded-xl transition-all duration-200 bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-110"
                aria-label={isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        {isMobileOpen && (
          <motion.div
            key="radial-menu"
            className="fixed top-0 right-0 z-[60] lg:hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative" style={{ marginTop: '32px', marginRight: '37px' }}>
              {navLinks.map((link, i) => {
                const Icon = navIcons[link.name];
                const angle = 90 + i * 17;
                const rad = (angle * Math.PI) / 180;
                const radius = 200;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius + 45;
                return (
                  <motion.div
                    key={link.name}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", damping: 22, stiffness: 250 }}
                  >
                    <div className="flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2">
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="pointer-events-auto"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40 shadow-lg flex items-center justify-center hover:border-primary/30 hover:shadow-primary/20 hover:scale-110 transition-all duration-300">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </Link>
                      <span className="text-[10px] font-semibold text-foreground/70 whitespace-nowrap pointer-events-none">
                        {link.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
