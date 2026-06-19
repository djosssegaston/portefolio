"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Palette,
  Wrench,
  Puzzle,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const defaultSettings = {
  siteName: "DJOSSE Adechina",
  siteDescription: "Portfolio & Blog - Développeur Full Stack",
  contactEmail: "contact@adechina.com",
  language: "fr",
  primaryColor: "#2563eb",
  theme: "light",
  fontHeading: "inter",
  fontBody: "inter",
  maintenance: false,
  maintenanceMessage: "Site en maintenance. Revenez bientôt !",
  gaId: "",
  fbPixelId: "",
  recaptchaSiteKey: "",
  recaptchaSecretKey: "",
};

type Settings = typeof defaultSettings;

export default function AdminParametres() {
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<Settings>({ ...defaultSettings });
  const [activeTab, setActiveTab] = useState("general");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.logo) setLogoUrl(data.logo);
        if (data.favicon) setFaviconUrl(data.favicon);
      })
      .catch(() => {});
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (section: string) => {
    toast({
      title: "Paramètres sauvegardés",
      description: `Les paramètres "${section}" ont été mis à jour avec succès.`,
    });
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    toast({
      title: "Paramètres réinitialisés",
      description: "Tous les paramètres ont été réinitialisés aux valeurs par défaut.",
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: data.url }),
      });
      setLogoUrl(data.url);
      toast({ title: "Logo mis à jour", description: "Le logo du site a été changé." });
      if (e.target) e.target.value = "";
    } catch {
      toast({ title: "Erreur", description: "Échec de l'upload du logo", variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favicon: data.url }),
      });
      setFaviconUrl(data.url);
      toast({ title: "Favicon mis à jour", description: "Le favicon du site a été changé." });
      if (e.target) e.target.value = "";
    } catch {
      toast({ title: "Erreur", description: "Échec de l'upload du favicon", variant: "destructive" });
    } finally {
      setUploadingFavicon(false);
    }
  };

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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez la configuration de votre portfolio
          </p>
        </div>
        <Button variant="outline" onClick={handleReset} className="gap-2 shrink-0">
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Puzzle className="w-4 h-4" />
            <span className="hidden sm:inline">Intégrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Informations générales
                </CardTitle>
                <CardDescription>
                  Configurez les informations de base de votre site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border-2 border-dashed border-border overflow-hidden">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}>
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingLogo ? "Upload..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Favicon</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border-2 border-dashed border-border overflow-hidden">
                        {faviconUrl ? (
                          <img src={faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={faviconInputRef}
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => faviconInputRef.current?.click()} disabled={uploadingFavicon}>
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingFavicon ? "Upload..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du site</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => update("siteName", e.target.value)}
                    placeholder="Nom de votre site"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => update("siteDescription", e.target.value)}
                    placeholder="Description de votre site"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email de contact</label>
                    <Input
                      value={settings.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      placeholder="contact@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Langue</label>
                    <Select value={settings.language} onValueChange={(v) => update("language", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => handleSave("Général")} className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l&apos;apparence visuelle de votre site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur primaire</label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-border shrink-0"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => update("primaryColor", e.target.value)}
                      type="color"
                      className="w-16 p-1 h-10 cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground font-mono">
                      {settings.primaryColor}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mode d&apos;affichage</label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.theme === "dark"}
                      onCheckedChange={(v) => update("theme", v ? "dark" : "light")}
                      id="theme-toggle"
                    />
                    <label htmlFor="theme-toggle" className="text-sm text-muted-foreground cursor-pointer">
                      {settings.theme === "dark" ? "Sombre" : "Clair"}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {settings.theme === "dark" ? "🌙 Sombre" : "☀️ Clair"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Police des titres</label>
                    <Select value={settings.fontHeading} onValueChange={(v) => update("fontHeading", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="plus-jakarta">Plus Jakarta Sans</SelectItem>
                        <SelectItem value="outfit">Outfit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Police du corps</label>
                    <Select value={settings.fontBody} onValueChange={(v) => update("fontBody", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="plus-jakarta">Plus Jakarta Sans</SelectItem>
                        <SelectItem value="outfit">Outfit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => handleSave("Apparence")} className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6 space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Mode maintenance
                </CardTitle>
                <CardDescription>
                  Activez ou désactivez le mode maintenance de votre site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {settings.maintenance && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Mode maintenance activé</p>
                      <p className="mt-1 text-amber-700">
                        Votre site est actuellement en mode maintenance. Les visiteurs seront redirigés vers une page de maintenance.{" "}
                        <a href="/admin/login" className="underline font-medium hover:text-amber-900">
                          Page de connexion
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Activer le mode maintenance</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Les visiteurs verront un message de maintenance au lieu du contenu
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance}
                    onCheckedChange={(v) => update("maintenance", v)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message de maintenance</label>
                  <Textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => update("maintenanceMessage", e.target.value)}
                    placeholder="Message affiché aux visiteurs pendant la maintenance"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => {
                      update("maintenance", true);
                      handleSave("Maintenance");
                    }}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Activer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-emerald-500" />
                  Intégrations
                </CardTitle>
                <CardDescription>
                  Configurez les services tiers connectés à votre site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Google Analytics ID</label>
                  <Input
                    value={settings.gaId}
                    onChange={(e) => update("gaId", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre identifiant de mesure Google Analytics 4
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Facebook Pixel ID</label>
                  <Input
                    value={settings.fbPixelId}
                    onChange={(e) => update("fbPixelId", e.target.value)}
                    placeholder="123456789012345"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre identifiant de pixel Facebook
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">reCAPTCHA Site Key</label>
                    <Input
                      value={settings.recaptchaSiteKey}
                      onChange={(e) => update("recaptchaSiteKey", e.target.value)}
                      placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">reCAPTCHA Secret Key</label>
                    <Input
                      value={settings.recaptchaSecretKey}
                      onChange={(e) => update("recaptchaSecretKey", e.target.value)}
                      placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                      className="font-mono text-sm"
                      type="password"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clés nécessaires pour la validation reCAPTCHA sur le formulaire de contact
                </p>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => handleSave("Intégrations")} className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
