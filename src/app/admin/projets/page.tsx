"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Archive,
  ExternalLink,
  Github,
  Globe,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { projects as initialProjects } from "@/lib/data/projects";
import type { Project } from "@/types";

const categoryLabels: Record<string, string> = {
  saas: "SaaS",
  ecommerce: "E-commerce",
  mobile: "Mobile",
  dashboard: "Dashboard",
  api: "API",
  web: "Web",
};

const statusConfig = {
  published: { label: "Publié", variant: "default" as const },
  draft: { label: "Brouillon", variant: "secondary" as const },
  archived: { label: "Archivé", variant: "outline" as const },
};

const emptyProject: Omit<Project, "id"> & { id?: string } = {
  id: "",
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  problem: "",
  solution: "",
  keyFeatures: [],
  results: [],
  challenges: [],
  technologies: [],
  category: "web",
  image: "",
  gallery: [],
  featured: false,
  date: new Date().toISOString().split("T")[0],
  status: "draft",
};

export default function AdminProjets() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState<Omit<Project, "id"> & { id?: string }>({ ...emptyProject });

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const resetForm = () => {
    setForm({ ...emptyProject, date: new Date().toISOString().split("T")[0] });
    setEditingId(null);
    setTechInput("");
  };

  const openEdit = (project: Project) => {
    setForm({ ...project });
    setEditingId(project.id);
    setDialogOpen(true);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? ({ ...form, id: editingId } as Project) : p))
      );
      toast({ title: "Projet modifié", description: "Le projet a été mis à jour avec succès." });
    } else {
      const newProject: Project = {
        ...form,
        id: `proj-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
      } as Project;
      setProjects((prev) => [newProject, ...prev]);
      toast({ title: "Projet créé", description: "Le nouveau projet a été ajouté avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setProjects((prev) => prev.filter((p) => p.id !== deletingId));
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé définitivement.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "published" ? ("draft" as const) : ("published" as const) }
          : p
      )
    );
    const project = projects.find((p) => p.id === id);
    toast({
      title: project?.status === "published" ? "Projet masqué" : "Projet publié",
      description:
        project?.status === "published"
          ? "Le projet est maintenant en brouillon."
          : "Le projet est maintenant publié.",
    });
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));
  };

  const handleFormChange = (field: string, value: string | string[] | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            Gestion des Projets
          </h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} projet{projects.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Modifiez les informations du projet existant."
                  : "Ajoutez un nouveau projet à votre portfolio."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={form.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Nom du projet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => handleFormChange("slug", e.target.value)}
                    placeholder="mon-projet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => handleFormChange("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description courte</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="Ajouter une technologie"
                  />
                  <Button variant="outline" onClick={addTech} type="button">Ajouter</Button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeTech(tech)}>
                        {tech} <span className="text-muted-foreground hover:text-foreground">&times;</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={form.image}
                    onChange={(e) => handleFormChange("image", e.target.value)}
                    placeholder="/images/projects/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    value={form.githubUrl || ""}
                    onChange={(e) => handleFormChange("githubUrl", e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Demo URL</label>
                  <Input
                    value={form.demoUrl || ""}
                    onChange={(e) => handleFormChange("demoUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 flex items-end pb-2">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.featured}
                      onCheckedChange={(v) => handleFormChange("featured", v)}
                      id="featured"
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Projet en vedette
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Modifier" : "Créer le projet"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Aucun projet trouvé</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search
                    ? "Essayez de modifier votre recherche."
                    : "Commencez par ajouter votre premier projet."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un projet
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" variants={container} initial="hidden" animate="show" className="space-y-3">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={item}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {project.title}
                            </p>
                            <Badge variant="outline" className="text-[10px] sm:text-xs">
                              {categoryLabels[project.category] || project.category}
                            </Badge>
                            <Badge
                              variant={statusConfig[project.status].variant}
                              className={cn(
                                "text-[10px] sm:text-xs",
                                project.status === "published" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                project.status === "draft" && "bg-amber-50 text-amber-700 border-amber-200",
                                project.status === "archived" && "bg-slate-50 text-slate-600 border-slate-200"
                              )}
                            >
                              {project.status === "published" && <Eye className="w-3 h-3 mr-1" />}
                              {project.status === "draft" && <EyeOff className="w-3 h-3 mr-1" />}
                              {project.status === "archived" && <Archive className="w-3 h-3 mr-1" />}
                              {statusConfig[project.status].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            onClick={() => toggleStatus(project.id)}
                          >
                            {project.status === "published" ? (
                              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            onClick={() => openEdit(project)}
                          >
                            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 sm:w-8 sm:h-8 hover:text-destructive"
                            onClick={() => openDelete(project.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
