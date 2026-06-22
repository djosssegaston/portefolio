"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  Download,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  FileText,
  Briefcase,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
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
import { analytics } from "@/lib/data/analytics";

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

const recentActivity = [
  { user: "Sophie Martin", action: "a ajouté un nouveau projet", date: "Il y a 2 heures", type: "create" },
  { user: "Thomas Bernard", action: "a modifié l'article de blog", date: "Il y a 4 heures", type: "update" },
  { user: "Marie Dubois", action: "a supprimé un témoignage", date: "Il y a 6 heures", type: "delete" },
  { user: "Lucas Petit", action: "a publié une nouvelle certification", date: "Il y a 8 heures", type: "create" },
  { user: "Emma Richard", action: "a mis à jour ses compétences", date: "Il y a 1 jour", type: "update" },
];

const recentMessages = [
  { name: "Jean Dupont", subject: "Demande de devis pour site web", date: "Il y a 1 heure", read: false, avatar: "JD" },
  { name: "Marie Lambert", subject: "Proposition de collaboration", date: "Il y a 3 heures", read: false, avatar: "ML" },
  { name: "Pierre Moreau", subject: "Question sur vos services", date: "Il y a 5 heures", read: true, avatar: "PM" },
];

const quickStats = [
  { label: "Projets publiés", value: 12, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Articles publiés", value: 24, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Commentaires en attente", value: 5, icon: MessageCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Témoignages validés", value: 8, icon: CheckCircle, color: "text-violet-400", bg: "bg-violet-500/10" },
];

function useCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          {greeting}, Adechina
        </h1>
        <p className="text-secondary mt-1">
          Voici un aperçu de votre tableau de bord.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Visiteurs"
          value={analytics.visitors}
          change="+12.5%"
          positive
          color="text-blue-400"
          bg="bg-blue-500/10"
          delay={0}
        />
        <StatCard
          icon={Eye}
          label="Pages vues"
          value={analytics.pageViews}
          change="+8.2%"
          positive
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          delay={0.1}
        />
        <StatCard
          icon={Download}
          label="Téléchargements CV"
          value={analytics.cvDownloads}
          change="+23.1%"
          positive
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.2}
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={analytics.messagesCount}
          change="-3.4%"
          positive={false}
          color="text-rose-400"
          bg="bg-rose-500/10"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading text-foreground">Visiteurs</CardTitle>
              <CardDescription className="text-secondary">Évolution des visites sur 12 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52 sm:h-60">
                <Line
                  data={{
                    labels: analytics.visitorsChart.map((d) => d.label),
                    datasets: [
                      {
                        label: "Visiteurs",
                        data: analytics.visitorsChart.map((d) => d.value),
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
                        ticks: { color: "#94A3B8" },
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading text-foreground">Pages vues</CardTitle>
              <CardDescription className="text-secondary">Nombre de pages vues par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52 sm:h-60">
                <Bar
                  data={{
                    labels: analytics.pageViewsChart.map((d) => d.label),
                    datasets: [
                      {
                        label: "Pages vues",
                        data: analytics.pageViewsChart.map((d) => d.value),
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
                        ticks: { color: "#94A3B8" },
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
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-heading text-foreground">Activité Récente</CardTitle>
                <CardDescription className="text-secondary">Les dernières actions effectuées</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
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
                      {item.type === "create" && <CheckCircle className="w-4 h-4" />}
                      {item.type === "update" && <AlertCircle className="w-4 h-4" />}
                      {item.type === "delete" && <XCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{item.user}</span>{" "}
                        <span className="text-secondary">{item.action}</span>
                      </p>
                    </div>
                    <span className="text-xs text-secondary whitespace-nowrap">{item.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
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
              <div className="divide-y divide-white/5">
                {recentMessages.map((msg, i) => (
                  <div
                    key={i}
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
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
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
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  color,
  bg,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  change: string;
  positive: boolean;
  color: string;
  bg: string;
  delay: number;
}) {
  const count = useCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
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
                positive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}
            >
              {positive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {change}
            </Badge>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-heading text-foreground">
              {count.toLocaleString()}
            </p>
            <p className="text-sm text-secondary mt-0.5">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
