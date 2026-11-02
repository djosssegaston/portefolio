"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Briefcase,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type DashboardStats = {
  projects: number;
  projectsPublished: number;
  blogPosts: number;
  blogPublished: number;
  messages: number;
  messagesUnread: number;
  testimonials: number;
  testimonialsValidated: number;
  skills: number;
  experiences: number;
  education: number;
  certifications: number;
  services: number;
  faq: number;
  events: number;
};

const emptyStats: DashboardStats = {
  projects: 0,
  projectsPublished: 0,
  blogPosts: 0,
  blogPublished: 0,
  messages: 0,
  messagesUnread: 0,
  testimonials: 0,
  testimonialsValidated: 0,
  skills: 0,
  experiences: 0,
  education: 0,
  certifications: 0,
  services: 0,
  faq: 0,
  events: 0,
};

type Trend = "up" | "down" | "neutral";

type ActivityItem = {
  key: string;
  label: string;
  detail: string;
  meta: string;
  type: "create" | "update" | "delete";
  icon: React.ElementType;
};

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseStats(data: any): DashboardStats {
  const d = data ?? {};
  return {
    projects: toNumber(d.projects),
    projectsPublished: toNumber(d.projectsPublished),
    blogPosts: toNumber(d.blogPosts),
    blogPublished: toNumber(d.blogPublished),
    messages: toNumber(d.messages),
    messagesUnread: toNumber(d.messagesUnread),
    testimonials: toNumber(d.testimonials),
    testimonialsValidated: toNumber(d.testimonialsValidated),
    skills: toNumber(d.skills),
    experiences: toNumber(d.experiences),
    education: toNumber(d.education),
    certifications: toNumber(d.certifications),
    services: toNumber(d.services),
    faq: toNumber(d.faq),
    events: toNumber(d.events),
  };
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readJson(res: Response) {
  return res.json().catch(() => ({}));
}

async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch("/api/stats", { headers: authHeaders(), cache: "no-store" });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur de chargement");
  return parseStats(payload?.data);
}

async function fetchMessages(view: "inbox" | "archived"): Promise<ContactMessage[]> {
  const res = await fetch(`/api/messages?view=${view}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur de chargement");
  return Array.isArray(payload?.data) ? (payload.data as ContactMessage[]) : [];
}

function relativeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function useCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return count;
}

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setError(null);
      try {
        const [statsResult, inboxResult, archivedResult] = await Promise.allSettled([
          fetchStats(),
          fetchMessages("inbox"),
          fetchMessages("archived"),
        ]);
        if (!active) return;
        if (statsResult.status === "fulfilled") {
          setStats(statsResult.value);
        } else {
          throw statsResult.reason;
        }
        const lists: ContactMessage[] = [];
        if (inboxResult.status === "fulfilled") lists.push(...inboxResult.value);
        if (archivedResult.status === "fulfilled") lists.push(...archivedResult.value);
        setMessages(
          [...lists].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (e: any) {
        if (active) setError(e?.message ?? "Impossible de charger le tableau de bord");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const recentMessages = useMemo(
    () =>
      messages.slice(0, 3).map((msg) => ({
        id: msg.id,
        name: msg.name,
        subject: msg.subject,
        date: relativeDate(msg.date),
        read: msg.read,
        avatar: msg.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      })),
    [messages]
  );

  const messageVolume = useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: cursor.toLocaleDateString("fr-FR", { month: "short" }),
        value: messages.filter((m) => {
          const date = new Date(m.date);
          return (
            !Number.isNaN(date.getTime()) &&
            date.getFullYear() === cursor.getFullYear() &&
            date.getMonth() === cursor.getMonth()
          );
        }).length,
      });
    }
    return months;
  }, [messages]);

  const contentBreakdown = useMemo(
    () => [
      { label: "Projets", value: stats.projects },
      { label: "Articles", value: stats.blogPosts },
      { label: "Messages", value: stats.messages },
      { label: "Témoignages", value: stats.testimonials },
      { label: "Compétences", value: stats.skills },
      { label: "Expériences", value: stats.experiences },
      { label: "Formations", value: stats.education },
      { label: "Certifications", value: stats.certifications },
      { label: "Services", value: stats.services },
    ],
    [stats]
  );

  const activityItems: ActivityItem[] = useMemo(
    () => [
      {
        key: "last-message",
        label: "Dernier message reçu",
        detail: messages.length ? `de ${messages[0].name}` : "aucun message en base",
        meta: messages.length ? relativeDate(messages[0].date) || "—" : "—",
        type: "create",
        icon: Clock,
      },
      {
        key: "projects",
        label: "Projets",
        detail: `${stats.projects} au total`,
        meta: `${stats.projectsPublished} publiés`,
        type: "update",
        icon: Briefcase,
      },
      {
        key: "blog",
        label: "Articles de blog",
        detail: `${stats.blogPosts} au total`,
        meta: `${stats.blogPublished} publiés`,
        type: "update",
        icon: FileText,
      },
      {
        key: "messages",
        label: "Messages",
        detail: `${stats.messages} reçus`,
        meta: `${stats.messagesUnread} non lus`,
        type: stats.messagesUnread > 0 ? "delete" : "create",
        icon: MessageSquare,
      },
      {
        key: "testimonials",
        label: "Témoignages",
        detail: `${stats.testimonials} au total`,
        meta: `${stats.testimonialsValidated} validés`,
        type: "update",
        icon: CheckCircle,
      },
      {
        key: "skills",
        label: "Compétences",
        detail: "référencées",
        meta: String(stats.skills),
        type: "update",
        icon: Sparkles,
      },
      {
        key: "experiences",
        label: "Expériences",
        detail: "parcours professionnel",
        meta: String(stats.experiences),
        type: "update",
        icon: Briefcase,
      },
      {
        key: "education",
        label: "Formations",
        detail: "diplômes et certifications",
        meta: String(stats.education),
        type: "update",
        icon: Award,
      },
      {
        key: "certifications",
        label: "Certifications",
        detail: "obtenues",
        meta: String(stats.certifications),
        type: "update",
        icon: CheckCircle,
      },
    ],
    [messages, stats]
  );

  const quickStats = useMemo(
    () => [
      {
        label: "Projets publiés",
        value: stats.projectsPublished,
        icon: Briefcase,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        label: "Articles publiés",
        value: stats.blogPublished,
        icon: FileText,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "Messages non lus",
        value: stats.messagesUnread,
        icon: MessageCircle,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        label: "Témoignages validés",
        value: stats.testimonialsValidated,
        icon: CheckCircle,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <div
      >
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          {greeting}, Adechina
        </h1>
        <p className="text-secondary mt-1">
          Voici un aperçu de votre tableau de bord.
        </p>
      </div>

      {(loading || error) && (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg",
            error
              ? "border border-rose-500/30 bg-rose-500/5"
              : "border border-border bg-card"
          )}
        >
          {error ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 text-secondary shrink-0 animate-spin" />
          )}
          <p className={cn("text-sm", error ? "text-rose-300" : "text-secondary")}>
            {error ?? "Chargement des statistiques..."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Projets"
          value={stats.projects}
          change="En direct"
          trend="neutral"
          color="text-blue-400"
          bg="bg-blue-500/10"
          delay={0}
        />
        <StatCard
          icon={FileText}
          label="Articles de blog"
          value={stats.blogPosts}
          change="En direct"
          trend="neutral"
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          delay={0.1}
        />
        <StatCard
          icon={MessageSquare}
          label="Messages reçus"
          value={stats.messages}
          change="En direct"
          trend="neutral"
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.2}
        />
        <StatCard
          icon={Sparkles}
          label="Compétences"
          value={stats.skills}
          change="En direct"
          trend="neutral"
          color="text-violet-400"
          bg="bg-violet-500/10"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading text-foreground">Messages reçus</CardTitle>
              <CardDescription className="text-secondary">Volume de messages sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52 sm:h-60">
                <Line
                  data={{
                    labels: messageVolume.map((d) => d.label),
                    datasets: [
                      {
                        label: "Messages reçus",
                        data: messageVolume.map((d) => d.value),
                        borderColor: "#2563EB",
                        backgroundColor: "rgba(37, 99, 235, 0.15)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        pointBackgroundColor: "#2563EB",
                        pointBorderColor: "#0B1120",
                        pointBorderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#94A3B8", precision: 0 },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: "#94A3B8", maxTicksLimit: 6 },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading text-foreground">Contenu du portfolio</CardTitle>
              <CardDescription className="text-secondary">Nombre d'éléments par type de contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52 sm:h-60">
                <Bar
                  data={{
                    labels: contentBreakdown.map((d) => d.label),
                    datasets: [
                      {
                        label: "Nombre d'éléments",
                        data: contentBreakdown.map((d) => d.value),
                        backgroundColor: "rgba(37, 99, 235, 0.7)",
                        borderRadius: 6,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#94A3B8", precision: 0 },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: "#94A3B8", maxTicksLimit: 9, maxRotation: 60, minRotation: 45 },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2"
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-heading text-foreground">Activité Récente</CardTitle>
                <CardDescription className="text-secondary">État des contenus du portfolio</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Chargement des données...</span>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {activityItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            item.type === "create" && "bg-emerald-500/10 text-emerald-400",
                            item.type === "update" && "bg-blue-500/10 text-blue-400",
                            item.type === "delete" && "bg-rose-500/10 text-rose-400"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{item.label}</span>{" "}
                            <span className="text-secondary">{item.detail}</span>
                          </p>
                        </div>
                        <span className="text-xs text-secondary whitespace-nowrap">{item.meta}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-heading text-foreground">Messages Récents</CardTitle>
                <CardDescription className="text-secondary">3 derniers messages</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Chargement des messages...</span>
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 px-6 text-center">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                  <p className="text-sm text-secondary">Aucun message reçu pour le moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                            {msg.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {!msg.read && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#111827]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                        <p className="text-xs text-secondary truncate">{msg.subject}</p>
                        <p className="text-xs text-secondary mt-0.5">{msg.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div
      >
        <Card className="rounded-lg border border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading text-foreground">Aperçu Rapide</CardTitle>
            <CardDescription className="text-secondary">État général de votre portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                  >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
                      <Icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xl font-bold font-heading text-foreground">{stat.value}</p>
                      <p className="text-xs text-secondary">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  color,
  bg,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  change: string;
  trend: Trend;
  color: string;
  bg: string;
  delay: number;
}) {
  const count = useCounter(value);

  return (
    <div
    >
      <Card className="rounded-lg border border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", bg)}>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium border-0",
                trend === "up" && "bg-emerald-500/10 text-emerald-400",
                trend === "down" && "bg-rose-500/10 text-rose-400",
                trend === "neutral" && "bg-white/5 text-secondary"
              )}
            >
              {trend === "up" && <TrendingUp className="w-3 h-3 mr-0.5" />}
              {trend === "down" && <TrendingDown className="w-3 h-3 mr-0.5" />}
              {trend === "neutral" && <Activity className="w-3 h-3 mr-0.5" />}
              {change}
            </Badge>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-heading text-foreground">
              {count.toLocaleString("fr-FR")}
            </p>
            <p className="text-sm text-secondary mt-0.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
