"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_authenticated");
    }
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl lg:hidden"
          >
            <SidebarContent
              pathname={pathname}
              isActive={isActive}
              collapsed={false}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-[#0B1120] border-r border-white/10 hidden lg:flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
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
            className="p-1.5 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors hidden lg:block"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-secondary hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary" : "text-secondary group-hover:text-white")} />
                  {!sidebarCollapsed && (
                    <span>{link.name}</span>
                  )}
                  {active && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className={cn("border-t border-white/10 p-3", sidebarCollapsed && "px-2")}>
          {!sidebarCollapsed ? (
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-white hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir le site</span>
            </Link>
          ) : (
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center py-2.5 rounded-lg text-secondary hover:text-white hover:bg-white/5 transition-colors"
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
        <header className="sticky top-0 z-20 bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-secondary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <Separator orientation="vertical" className="h-8 bg-white/10" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/images/avatar.jpg" alt="Admin" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">AD</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white leading-tight">Adechina</p>
                      <p className="text-xs text-secondary">Administrateur</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-secondary hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111827] border-white/10 text-white">
                  <DropdownMenuLabel className="text-secondary">Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => router.push("/admin/profil")} className="hover:bg-white/5 focus:bg-white/5 text-white">
                    <UserCircle className="w-4 h-4 mr-2 text-secondary" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/parametres")} className="hover:bg-white/5 focus:bg-white/5 text-white">
                    <Settings className="w-4 h-4 mr-2 text-secondary" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 hover:bg-white/5 focus:bg-white/5">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  isActive,
  collapsed,
  onClose,
  onLogout,
}: {
  pathname: string;
  isActive: (href: string) => boolean;
  collapsed: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
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
          className="p-1.5 rounded-lg hover:bg-white/5 text-secondary transition-colors"
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
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary" : "text-secondary group-hover:text-white")} />
                <span>{link.name}</span>
                {active && (
                  <motion.span
                    layoutId="active-indicator-mobile"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Voir le site</span>
        </Link>
      </div>
    </div>
  );
}
