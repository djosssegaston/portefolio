"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Code2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { skills as initialSkills } from "@/lib/data/skills";
import type { Skill, SkillCategory } from "@/types";

const categoryLabels: Record<SkillCategory, string> = {
  "web-development": "Développement Web",
  "frontend-development": "Frontend",
  "backend-development": "Backend",
  databases: "Bases de données",
  tools: "Outils",
  devops: "DevOps",
  "digital-marketing": "Marketing Digital",
  "project-management": "Gestion de Projet",
  ai: "IA",
};

const categoryOrder: SkillCategory[] = [
  "web-development",
  "frontend-development",
  "backend-development",
  "databases",
  "tools",
  "devops",
  "digital-marketing",
  "project-management",
  "ai",
];

const emptySkill: Omit<Skill, "id"> & { id?: string } = {
  id: "",
  name: "",
  level: 50,
  icon: "Code2",
  category: "web-development",
  description: "",
};

export default function AdminCompetences() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id"> & { id?: string }>({ ...emptySkill });

  const uniqueCategories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category))) as SkillCategory[],
    [skills]
  );

  const filtered = useMemo(
    () =>
      skills.filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.description || "").toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "all" || s.category === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [skills, search, activeCategory]
  );

  const resetForm = () => {
    setForm({ ...emptySkill });
    setEditingId(null);
  };

  const openEdit = (skill: Skill) => {
    setForm({ ...skill });
    setEditingId(skill.id);
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
      setSkills((prev) =>
        prev.map((s) => (s.id === editingId ? ({ ...form, id: editingId } as Skill) : s))
      );
      toast({ title: "Compétence modifiée", description: "La compétence a été mise à jour." });
    } else {
      const newSkill: Skill = {
        ...form,
        id: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      } as Skill;
      setSkills((prev) => [...prev, newSkill]);
      toast({ title: "Compétence ajoutée", description: "La nouvelle compétence a été créée." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setSkills((prev) => prev.filter((s) => s.id !== deletingId));
      toast({
        title: "Compétence supprimée",
        description: "La compétence a été supprimée.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Compétences
          </h1>
          <p className="text-muted-foreground mt-1">
            {skills.length} compétence{skills.length > 1 ? "s" : ""} enregistrée{skills.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une compétence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all" className="text-xs">Toutes</TabsTrigger>
            {categoryOrder
              .filter((cat) => uniqueCategories.includes(cat))
              .map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
          </TabsList>
          <TabsContent value={activeCategory} className="mt-6">
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
                      <p className="text-lg font-medium text-foreground">Aucune compétence trouvée</p>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        {search
                          ? "Essayez de modifier votre recherche ou votre filtre."
                          : "Ajoutez votre première compétence."}
                      </p>
                      {!search && (
                        <Button onClick={openNew} className="gap-2 mt-2">
                          <Plus className="w-4 h-4" />
                          Ajouter une compétence
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory + search}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <AnimatePresence>
                    {filtered.map((skill) => (
                      <motion.div
                        key={skill.id}
                        layout
                        variants={item}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7"
                                  onClick={() => openEdit(skill)}
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 hover:text-destructive"
                                  onClick={() => openDelete(skill.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-sm">{skill.name}</h3>
                              {skill.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {skill.description}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Maîtrise</span>
                                <span className="text-xs font-semibold text-foreground">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} className="h-1.5" />
                            </div>

                            <div className="mt-3">
                              <Badge variant="secondary" className="text-[10px]">
                                {categoryLabels[skill.category] || skill.category}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la compétence" : "Ajouter une compétence"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Modifiez les détails de cette compétence."
                : "Ajoutez une nouvelle compétence à votre portfolio."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la compétence"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select
                  value={form.category}
                  onValueChange={(v: SkillCategory) => setForm((prev) => ({ ...prev, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOrder.map((cat) => (
                      <SelectItem key={cat} value={cat}>{categoryLabels[cat]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l'icône (lucide-react)</label>
              <Input
                value={form.icon}
                onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="Code2, Server, Database, etc."
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Niveau : {form.level}%</label>
              </div>
              <Slider
                value={[form.level]}
                onValueChange={([v]) => setForm((prev) => ({ ...prev, level: v }))}
                min={0}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Débutant</span>
                <span>Intermédiaire</span>
                <span>Expert</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optionnelle)</label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Description de votre niveau d'expertise..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible.
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
