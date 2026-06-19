"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  TrendingDown,
  Clock,
  ExternalLink,
  Globe,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const months = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

const mockAnalytics = {
  visitors: 15234,
  pageViews: 45678,
  bounceRate: 32.4,
  avgDuration: "4m 32s",
  visitorsChart: months.map((m, i) => ({
    label: m,
    value: Math.floor(800 + Math.random() * 1200 + i * 50),
  })),
  pageViewsChart: months.map((m, i) => ({
    label: m,
    value: Math.floor(2500 + Math.random() * 2000 + i * 120),
  })),
  trafficSources: [
    { source: "Direct", visitors: 5800, percentage: 38 },
    { source: "Search", visitors: 4200, percentage: 27.5 },
    { source: "Social", visitors: 2800, percentage: 18.4 },
    { source: "Referral", visitors: 1534, percentage: 10.1 },
    { source: "Email", visitors: 900, percentage: 6 },
  ],
  devices: [
    { device: "Desktop", count: 8234, percentage: 54 },
    { device: "Mobile", count: 5212, percentage: 34.2 },
    { device: "Tablet", count: 1220, percentage: 8 },
    { device: "Others", count: 568, percentage: 3.8 },
  ],
  topPages: [
    { url: "/", title: "Accueil", views: 12500 },
    { url: "/projets", title: "Projets", views: 8900 },
    { url: "/blog", title: "Blog", views: 6700 },
    { url: "/a-propos", title: "À propos", views: 5400 },
    { url: "/contact", title: "Contact", views: 3200 },
    { url: "/competences", title: "Compétences", views: 2800 },
  ],
  countries: [
    { country: "France", visitors: 5200, flag: "🇫🇷" },
    { country: "États-Unis", visitors: 2800, flag: "🇺🇸" },
    { country: "Canada", visitors: 1900, flag: "🇨🇦" },
    { country: "Belgique", visitors: 1200, flag: "🇧🇪" },
    { country: "Suisse", visitors: 980, flag: "🇨🇭" },
    { country: "Maroc", visitors: 750, flag: "🇲🇦" },
    { country: "Côte d'Ivoire", visitors: 620, flag: "🇨🇮" },
    { country: "Sénégal", visitors: 500, flag: "🇸🇳" },
  ],
};

const dateRanges = [
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
  { label: "3 mois", days: 90 },
  { label: "12 mois", days: 365 },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#94a3b8", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(148,163,184,0.1)" },
      ticks: { color: "#94a3b8", font: { size: 11 } },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { color: "#94a3b8", padding: 16, font: { size: 11 } },
    },
  },
  cutout: "68%",
};

const lineData = (data: { label: string; value: number }[], color: string) => ({
  labels: data.map((d) => d.label),
  datasets: [
    {
      data: data.map((d) => d.value),
      borderColor: color,
      backgroundColor: color + "15",
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: color,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    },
  ],
});

const barData = (data: { label: string; value: number }[], color: string) => ({
  labels: data.map((d) => d.label),
  datasets: [
    {
      data: data.map((d) => d.value),
      backgroundColor: color + "30",
      borderColor: color,
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: color + "50",
    },
  ],
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminAnalytique() {
  const [dateRange, setDateRange] = useState(365);

  const stats = [
    { label: "Visiteurs", value: mockAnalytics.visitors.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Pages vues", value: mockAnalytics.pageViews.toLocaleString(), icon: Eye, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Taux de rebond", value: `${mockAnalytics.bounceRate}%`, icon: TrendingDown, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Durée moyenne", value: mockAnalytics.avgDuration, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Analytique
          </h1>
          <p className="text-muted-foreground mt-1">
            Statistiques et performances de votre portfolio
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {dateRanges.map((range) => (
            <Button
              key={range.days}
              variant={dateRange === range.days ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range.days)}
              className="text-xs"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Visiteurs
            </CardTitle>
            <CardDescription>Évolution des visites sur 12 mois</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <div className="h-48 sm:h-64">
              <Line data={lineData(mockAnalytics.visitorsChart, "#3b82f6")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              Pages vues
            </CardTitle>
            <CardDescription>Nombre de pages vues sur 12 mois</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <div className="h-48 sm:h-64">
              <Bar data={barData(mockAnalytics.pageViewsChart, "#10b981")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-500" />
              Sources de trafic
            </CardTitle>
            <CardDescription>Répartition par provenance</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <div className="w-full max-w-[200px] sm:max-w-[280px]">
                <Doughnut
                  data={{
                    labels: mockAnalytics.trafficSources.map((s) => s.source),
                    datasets: [
                      {
                        data: mockAnalytics.trafficSources.map((s) => s.percentage),
                        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"],
                        borderColor: "#fff",
                        borderWidth: 3,
                        hoverOffset: 8,
                      },
                    ],
                  }}
                  options={doughnutOptions}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              Appareils
            </CardTitle>
            <CardDescription>Répartition par type d&apos;appareil</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <div className="w-full max-w-[200px] sm:max-w-[280px]">
                <Pie
                  data={{
                    labels: mockAnalytics.devices.map((d) => d.device),
                    datasets: [
                      {
                        data: mockAnalytics.devices.map((d) => d.percentage),
                        backgroundColor: ["#6366f1", "#f59e0b", "#06b6d4", "#94a3b8"],
                        borderColor: "#fff",
                        borderWidth: 3,
                        hoverOffset: 8,
                      },
                    ],
                  }}
                  options={doughnutOptions}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary" />
              Pages les plus consultées
            </CardTitle>
            <CardDescription>Top 6 des pages par nombre de vues</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockAnalytics.topPages.map((page, i) => (
                <div key={page.url} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/50 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {page.views.toLocaleString()} vues
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Pays
            </CardTitle>
            <CardDescription>Visiteurs par pays</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {mockAnalytics.countries.map((country) => (
                <div key={country.country} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/50 transition-colors">
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{country.country}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(country.visitors / mockAnalytics.countries[0].visitors) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                      {country.visitors.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
