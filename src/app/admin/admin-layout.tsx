"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  Code2,
  History,
  GraduationCap,
  Award,
  FileText,
  MessageSquareQuote,
  MessageSquare,
  Mail,
  HelpCircle,
  Search,
  Shield,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ImageIcon,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profil", href: "/admin/profil", icon: UserCircle },
  { name: "Projets", href: "/admin/projets", icon: Briefcase },
  { name: "Compétences", href: "/admin/competences", icon: Code2 },
  { name: "Expériences", href: "/admin/experiences", icon: History },
  { name: "Formations", href: "/admin/formations", icon: GraduationCap },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Témoignages", href: "/admin/temoignages", icon: MessageSquareQuote },
  { name: "Commentaires", href: "/admin/commentaires", icon: MessageSquare },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Événements", href: "/admin/evenements", icon: CalendarDays },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Utilisateurs", href: "/admin/utilisateurs", icon: Shield },
  { name: "Analytique", href: "/admin/analytique", icon: BarChart3 },
  { name: "Images", href: "/admin/images", icon: ImageIcon },
  { name: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const mobileAsideRef = useRef<HTMLElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const desktopIndicatorRef = useRef<HTMLSpanElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [sidebarOpen]);

  useEffect(() => {
    const aside = mobileAsideRef.current;
    const overlay = mobileOverlayRef.current;
    if (!aside || !overlay) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = aside.querySelectorAll<HTMLElement>("[data-admin-nav-item]");

    if (sidebarOpen) {
      if (reduced) {
        gsap.set([aside, overlay], { autoAlpha: 1, xPercent: 0 });
      } else {
        gsap.set(aside, { display: "block" });
        gsap.to(overlay, { autoAlpha: 1, duration: 0.22, ease: "power2.out" });
        gsap.fromTo(
          aside,
          { xPercent: -100, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
        );
        gsap.fromTo(
          items,
          { x: -18, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.025,
            delay: 0.08,
            ease: "power3.out",
          },
        );
      }
    } else {
      if (reduced) {
        gsap.set([aside, overlay], { autoAlpha: 0 });
      } else {
        gsap.to(aside, {
          xPercent: -100,
          autoAlpha: 0,
          duration: 0.32,
          ease: "power2.in",
          onComplete: () => gsap.set(aside, { display: "none" }),
        });
        gsap.to(overlay, { autoAlpha: 0, duration: 0.2 });
      }
    }

  }, [sidebarOpen]);

  useEffect(() => {
    const nav = desktopNavRef.current;
    const indicator = desktopIndicatorRef.current;
    if (!nav || !indicator) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const active = nav.querySelector<HTMLElement>('[data-admin-active="true"]');
    if (!active) {
      gsap.set(indicator, { opacity: 0 });
      return;
    }

    const y = active.offsetTop + (active.offsetHeight - 24) / 2;
    if (reduced) {
      gsap.set(indicator, { y, opacity: 1 });
      return;
    }

    gsap.to(indicator, {
      y,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  }, [pathname, sidebarCollapsed]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const blocks = Array.from(main.children) as HTMLElement[];
    if (!blocks.length) return;

    const tween = gsap.fromTo(
      blocks,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
    return () => {
      tween.kill();
    };
  }, [pathname]);

  async function checkAuth() {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid token");
      const data = await res.json();
      setAdminUser(data.admin);
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      router.replace("/admin/login");
      return;
    } finally {
      setChecking(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-white font-heading font-bold text-sm">DA</span>
          </div>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      <div
        ref={mobileOverlayRef}
        className={cn(
          "fixed inset-0 z-40 bg-black/80 opacity-0 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar */}
      <aside
        ref={mobileAsideRef}
        className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-border bg-card shadow-xl lg:hidden"
        aria-hidden={!sidebarOpen}
      >
        <SidebarContent
          isActive={isActive}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>


      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 shadow-lg hidden lg:flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                <span className="text-white font-heading font-bold text-xs">DA</span>
              </div>
              <span className="font-heading font-bold text-base">
                <span className="gradient-text">Admin DJOSSE</span>
              </span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/admin" className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-white font-heading font-bold text-xs">DA</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors hidden lg:block"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav ref={desktopNavRef} className="relative px-2 space-y-0.5">
            <span
              ref={desktopIndicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-2 top-0 h-6 w-1 rounded-r-full bg-primary opacity-0"
            />
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-admin-active={active}
                  data-admin-nav-item
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                  {!sidebarCollapsed && (
                    <span>{link.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className={cn("border-t border-gray-200 p-3", sidebarCollapsed && "px-2")}>
          {!sidebarCollapsed ? (
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir le site</span>
            </Link>
          ) : (
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center py-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <Separator orientation="vertical" className="h-8 bg-gray-200" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/images/avatar.jpg" alt="Admin" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {adminUser?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{adminUser?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500 capitalize">{adminUser?.role?.replace("_", " ") || "Administrateur"}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-900">
                  <DropdownMenuLabel className="text-gray-500">Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={() => router.push("/admin/profil")} className="hover:bg-gray-100 focus:bg-gray-100 text-gray-700">
                    <UserCircle className="w-4 h-4 mr-2 text-gray-500" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/securite")} className="hover:bg-gray-100 focus:bg-gray-100 text-gray-700">
                    <Shield className="w-4 h-4 mr-2 text-gray-500" />
                    Sécurité (2FA)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/parametres")} className="hover:bg-gray-100 focus:bg-gray-100 text-gray-700">
                    <Settings className="w-4 h-4 mr-2 text-gray-500" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 hover:bg-gray-100 focus:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main ref={mainRef} className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  isActive,
  onClose,
  onLogout,
}: {
  isActive: (href: string) => boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <span className="text-white font-heading font-bold text-xs">DA</span>
          </div>
          <span className="font-heading font-bold text-base">
            <span className="gradient-text">Admin DJOSSE</span>
          </span>
        </Link>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-0.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                data-admin-nav-item
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                  <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                <span>{link.name}</span>
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-gray-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Voir le site</span>
        </Link>
      </div>
    </div>
  );
}
