"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save,
  User,
  FileText,
  Upload,
  Globe,
  Camera,
  ExternalLink,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/lib/data/site-config";

const iconMap: Record<string, string> = {
  Linkedin: "#0A66C2",
  Github: "#333",
  MessageCircle: "#25D366",
  Facebook: "#1877F2",
  Twitter: "#1DA1F2",
  Mail: "#EA4335",
};

export default function AdminProfil() {
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  const [form, setForm] = useState({
    fullName: siteConfig.fullName,
    title: siteConfig.title,
    email: siteConfig.email,
    phone: siteConfig.phone,
    location: siteConfig.location,
    demoVideo: "",
    presentation: siteConfig.about.presentation,
  });

  const [socialLinks, setSocialLinks] = useState(
    siteConfig.socialLinks.map((link) => ({ ...link }))
  );

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.avatar) setAvatarUrl(data.avatar);
        if (data.aboutImage) setAboutImageUrl(data.aboutImage);
        if (data.demoVideo) setForm((prev) => ({ ...prev, demoVideo: data.demoVideo }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index: number, value: string) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, url: value } : link))
    );
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: data.url }),
      });

      setAvatarUrl(data.url);
      toast({ title: "Avatar mis à jour", description: "La photo de profil a été changée." });

      if (e.target) e.target.value = "";
    } catch {
      toast({ title: "Erreur", description: "Échec de l'upload", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAbout(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutImage: data.url }),
      });

      setAboutImageUrl(data.url);
      toast({ title: "Image mise à jour", description: "La photo de la section À propos a été changée." });
    } catch {
      toast({ title: "Erreur", description: "Échec de l'upload", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar: avatarUrl,
          aboutImage: aboutImageUrl,
          fullName: form.fullName,
          title: form.title,
          email: form.email,
          phone: form.phone,
          location: form.location,
          demoVideo: form.demoVideo,
          presentation: form.presentation,
          socialLinks,
        }),
      });
      toast({ title: "Profil mis à jour", description: "Les modifications ont été enregistrées." });
    } catch {
      toast({ title: "Erreur", description: "Échec de la sauvegarde", variant: "destructive" });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion du Profil
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos informations personnelles, votre présentation et vos réseaux sociaux.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Enregistrer
        </Button>
      </motion.div>

      <Tabs defaultValue="informations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="presentation">Présentation</TabsTrigger>
          <TabsTrigger value="reseaux">Réseaux</TabsTrigger>
        </TabsList>

        <TabsContent value="informations" className="space-y-6">
          <motion.div variants={container} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Modifiez vos informations de base affichées sur le portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-24 h-24 ring-4 ring-border">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt="Avatar" />
                        ) : (
                          <AvatarImage src="/images/avatars/author.svg" alt="Avatar" />
                        )}
                        <AvatarFallback className="text-2xl font-heading bg-primary/10 text-primary">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {uploading ? "Upload..." : "Photo de profil"}
                    </p>
                  </div>

                  <Separator orientation="vertical" className="hidden sm:block h-28" />

                  <div className="flex flex-col items-center sm:items-start gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">CV actuel</span>
                    </div>
                    <Badge variant="secondary" className="text-xs gap-1.5 py-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      cv-djosse-adechina.pdf
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      Remplacer le CV
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nom complet</label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Titre professionnel</label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Téléphone</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">Localisation</label>
                    <Input
                      value={form.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary" />
                      Lien vidéo de démonstration
                    </label>
                    <Input
                      value={form.demoVideo}
                      onChange={(e) => handleChange("demoVideo", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Lien vers une vidéo de démonstration (YouTube, Vimeo, etc.)
                    </p>
                  </div>

                  <Separator className="md:col-span-2" />

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Camera className="w-4 h-4 text-primary" />
                      Photo de la section À propos
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                        {aboutImageUrl ? (
                          <img src={aboutImageUrl} alt="À propos" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Camera className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          ref={aboutImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAboutImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => aboutImageInputRef.current?.click()}
                          disabled={uploadingAbout}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingAbout ? "Upload..." : "Choisir une image"}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Image d'arrière-plan pour la section À propos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="presentation" className="space-y-6">
          <motion.div variants={container} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Bio / Présentation
                </CardTitle>
                <CardDescription>
                  Rédigez votre présentation personnelle et professionnelle.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Présentation</label>
                  <Textarea
                    rows={12}
                    value={form.presentation}
                    onChange={(e) => handleChange("presentation", e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {form.presentation.length} caractères
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reseaux" className="space-y-6">
          <motion.div variants={container} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Réseaux sociaux & Liens
                </CardTitle>
                <CardDescription>
                  Gérez les liens vers vos profils sociaux et autres plateformes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.map((link, index) => {
                  const color = iconMap[link.icon] || "#666";
                  return (
                    <motion.div
                      key={index}
                      variants={item}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: color }}
                      >
                        <span className="text-xs font-bold">{link.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <p className="text-sm font-medium text-foreground truncate">
                          {link.name}
                        </p>
                        <div className="md:col-span-2">
                          <Input
                            value={link.url}
                            onChange={(e) => handleSocialChange(index, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div variants={item} className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </Button>
      </motion.div>
    </motion.div>
  );
}
