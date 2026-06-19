"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Search,
  Globe2,
  Image,
  FileText,
  Twitter,
  Settings,
  Eye,
  RotateCcw,
  AlertTriangle,
  Check,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data/site-config";
import type { SEOSettings } from "@/types";

const defaultSeo: SEOSettings = {
  metaTitle: siteConfig.title,
  metaDescription: siteConfig.description,
  keywords: siteConfig.keywords,
  ogTitle: siteConfig.title,
  ogDescription: siteConfig.description,
  ogImage: siteConfig.ogImage,
  twitterCard: "summary_large_image",
  canonicalUrl: "https://djosse-adechina.com",
  robotsTxt: `User-agent: *
Allow: /
Sitemap: https://djosse-adechina.com/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
`,
  sitemapUrl: "https://djosse-adechina.com/sitemap.xml",
};

export default function AdminSEO() {
  const { toast } = useToast();
  const [seo, setSeo] = useState<SEOSettings>(defaultSeo);
  const [keywordInput, setKeywordInput] = useState("");
  const [twitterSite, setTwitterSite] = useState("@djosse_adechina");
  const [twitterCreator, setTwitterCreator] = useState("@djosse_adechina");
  const [noIndex, setNoIndex] = useState(false);
  const [enableSitemap, setEnableSitemap] = useState(true);

  const addKeyword = () => {
    if (keywordInput.trim() && !seo.keywords.includes(keywordInput.trim())) {
      setSeo((prev) => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setSeo((prev) => ({ ...prev, keywords: prev.keywords.filter((k) => k !== kw) }));
  };

  const handleChange = (field: keyof SEOSettings, value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setSeo(defaultSeo);
    toast({ title: "Réinitialisé", description: "Les paramètres SEO ont été réinitialisés." });
  };

  const handleSave = () => {
    toast({
      title: "Paramètres SEO sauvegardés",
      description: "Toutes les modifications ont été enregistrées avec succès.",
    });
  };

  const truncatedDesc = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion SEO
          </h1>
          <p className="text-muted-foreground mt-1">
            Optimisez le référencement de votre site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Search className="w-4 h-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="og" className="gap-2">
            <Globe2 className="w-4 h-4" />
            Open Graph
          </TabsTrigger>
          <TabsTrigger value="twitter" className="gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Settings className="w-4 h-4" />
            Avancé
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Search className="w-5 h-5 text-primary" />
                    Meta-données principales
                  </CardTitle>
                  <CardDescription>
                    Ces informations apparaissent dans les résultats de recherche Google.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Titre</label>
                    <Input
                      value={seo.metaTitle}
                      onChange={(e) => handleChange("metaTitle", e.target.value)}
                      placeholder="Titre de la page"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {seo.metaTitle.length}/60 caractères
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <Textarea
                      value={seo.metaDescription}
                      onChange={(e) => handleChange("metaDescription", e.target.value)}
                      placeholder="Description de la page..."
                      rows={3}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {seo.metaDescription.length}/160 caractères
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mots-clés</label>
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                        placeholder="Ajouter un mot-clé"
                      />
                      <Button variant="outline" onClick={addKeyword} type="button" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {seo.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {seo.keywords.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="gap-1 cursor-pointer text-xs"
                            onClick={() => removeKeyword(kw)}
                          >
                            {kw}
                            <X className="w-3 h-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL canonique</label>
                    <Input
                      value={seo.canonicalUrl}
                      onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Google Preview */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-primary" />
                    Aperçu Google
                  </CardTitle>
                  <CardDescription>
                    À quoi ressemblera votre page dans les résultats de recherche.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl border border-border bg-white max-w-lg">
                    <p className="text-[10px] text-green-700 mb-0.5 uppercase tracking-wide">
                      {seo.canonicalUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>
                    <p className="text-sm text-blue-800 font-medium leading-tight hover:underline cursor-pointer truncate">
                      {truncatedDesc(seo.metaTitle, 60)}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                      {truncatedDesc(seo.metaDescription, 160)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Open Graph Tab */}
        <TabsContent value="og" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe2 className="w-5 h-5 text-primary" />
                    Open Graph
                  </CardTitle>
                  <CardDescription>
                    Configurez l&apos;affichage de votre site sur Facebook, LinkedIn et autres réseaux.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OG Titre</label>
                    <Input
                      value={seo.ogTitle}
                      onChange={(e) => handleChange("ogTitle", e.target.value)}
                      placeholder="Titre pour le partage social"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OG Description</label>
                    <Textarea
                      value={seo.ogDescription}
                      onChange={(e) => handleChange("ogDescription", e.target.value)}
                      placeholder="Description pour le partage social..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OG Image (URL)</label>
                    <Input
                      value={seo.ogImage}
                      onChange={(e) => handleChange("ogImage", e.target.value)}
                      placeholder="/images/og-image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* OG Preview */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-primary" />
                    Aperçu Open Graph
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm rounded-xl overflow-hidden border border-border shadow-sm">
                    <div className="aspect-[1.91/1] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {seo.ogImage ? (
                        <img
                          src={seo.ogImage}
                          alt="OG Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="w-10 h-10 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        djosse-adechina.com
                      </p>
                      <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">
                        {truncatedDesc(seo.ogTitle, 80)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {truncatedDesc(seo.ogDescription, 200)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Twitter Tab */}
        <TabsContent value="twitter" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Twitter className="w-5 h-5 text-primary" />
                    Twitter Card
                  </CardTitle>
                  <CardDescription>
                    Configurez l&apos;affichage de vos liens sur X (Twitter).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de carte</label>
                    <Select
                      value={seo.twitterCard}
                      onValueChange={(v) => handleChange("twitterCard", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Card</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        <SelectItem value="app">App Card</SelectItem>
                        <SelectItem value="player">Player Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">
                      {seo.twitterCard === "summary_large_image"
                        ? "Affiche une grande image avec le titre et la description."
                        : "Affiche une petite vignette avec le titre et la description."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compte Twitter du site</label>
                    <Input
                      value={twitterSite}
                      onChange={(e) => setTwitterSite(e.target.value)}
                      placeholder="@votrecompte"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compte Twitter de l&apos;auteur</label>
                    <Input
                      value={twitterCreator}
                      onChange={(e) => setTwitterCreator(e.target.value)}
                      placeholder="@votrecompte"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Twitter Preview */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-primary" />
                    Aperçu Twitter Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm rounded-xl overflow-hidden border border-border">
                    {seo.twitterCard === "summary_large_image" && (
                      <div className="aspect-[2/1] bg-gradient-to-br from-sky-200/30 to-primary/10 flex items-center justify-center border-b border-border">
                        {seo.ogImage ? (
                          <img
                            src={seo.ogImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-muted-foreground/40" />
                        )}
                      </div>
                    )}
                    <div className="p-3 bg-white">
                      <p className="text-xs text-foreground font-semibold leading-tight">
                        {truncatedDesc(seo.ogTitle, 70)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {truncatedDesc(seo.ogDescription, 200)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {seo.canonicalUrl.replace(/^https?:\/\//, "")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-primary" />
                    robots.txt
                  </CardTitle>
                  <CardDescription>
                    Contrôlez l&apos;accès des robots d&apos;indexation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={seo.robotsTxt}
                    onChange={(e) => handleChange("robotsTxt", e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="w-5 h-5 text-primary" />
                    Paramètres avancés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL du Sitemap</label>
                    <Input
                      value={seo.sitemapUrl}
                      onChange={(e) => handleChange("sitemapUrl", e.target.value)}
                      placeholder="https://.../sitemap.xml"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Activer le sitemap</p>
                      <p className="text-xs text-muted-foreground">
                        Générer automatiquement le sitemap.xml
                      </p>
                    </div>
                    <Switch checked={enableSitemap} onCheckedChange={setEnableSitemap} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Bloquer l&apos;indexation</p>
                        <p className="text-xs text-muted-foreground">
                          Empêche Google et autres moteurs d&apos;indexer le site
                        </p>
                      </div>
                    </div>
                    <Switch checked={noIndex} onCheckedChange={setNoIndex} />
                  </div>

                  {noIndex && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800">
                        Attention : L&apos;indexation est désactivée. Votre site n&apos;apparaîtra pas
                        dans les résultats de recherche.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder les paramètres
              </Button>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
