"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  PlusCircle,
  X,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { experiences as initialExperiences } from "@/lib/data/experiences";
import type { Experience } from "@/types";

const emptyExperience: Omit<Experience, "id"> & { id?: string } = {
  id: "",
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: [],
};

export default function AdminExperiences() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [achievementInput, setAchievementInput] = useState("");
  const [form, setForm] = useState<Omit<Experience, "id"> & { id?: string }>({ ...emptyExperience });

  const filtered = useMemo(
    () =>
      experiences.filter(
        (e) =>
          e.company.toLowerCase().includes(search.toLowerCase()) ||
          e.position.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [experiences, search]
  );

  const resetForm = () => {
    setForm({ ...emptyExperience });
    setEditingId(null);
    setAchievementInput("");
  };

  const openEdit = (exp: Experience) => {
    setForm({ ...exp, endDate: exp.endDate || "" });
    setEditingId(exp.id);
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
    const payload = {
      ...form,
      endDate: form.current ? undefined : form.endDate || undefined,
    };
    if (editingId) {
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingId ? ({ ...payload, id: editingId } as Experience) : e))
      );
      toast({ title: "Expérience modifiée", description: "L'expérience a été mise à jour avec succès." });
    } else {
      const newExp: Experience = {
        ...payload,
        id: `exp-${Date.now()}`,
      } as Experience;
      setExperiences((prev) => [newExp, ...prev]);
      toast({ title: "Expérience ajoutée", description: "La nouvelle expérience a été créée avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setExperiences((prev) => prev.filter((e) => e.id !== deletingId));
      toast({ title: "Expérience supprimée", description: "L'expérience a été supprimée.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !form.achievements.includes(achievementInput.trim())) {
      setForm((prev) => ({ ...prev, achievements: [...prev.achievements, achievementInput.trim()] }));
      setAchievementInput("");
    }
  };

  const removeAchievement = (idx: number) => {
    setForm((prev) => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
  };

  const handleFormChange = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
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
            Gestion des Expériences
          </h1>
          <p className="text-muted-foreground mt-1">
            {experiences.length} expérience{experiences.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Ajouter une expérience
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une expérience..."
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
                <p className="text-lg font-medium text-foreground">Aucune expérience trouvée</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search ? "Essayez de modifier votre recherche." : "Commencez par ajouter votre première expérience."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une expérience
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" variants={container} initial="hidden" animate="show" className="space-y-3">
            <AnimatePresence>
              {filtered.map((exp) => (
                <motion.div
                  key={exp.id}
                  layout
                  variants={item}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-base font-semibold text-foreground">{exp.position}</h3>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(exp)}>
                                <Edit3 className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 hover:text-destructive"
                                onClick={() => openDelete(exp.id)}
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(exp.startDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
                              {" — "}
                              {exp.current
                                ? "Aujourd'hui"
                                : exp.endDate
                                  ? new Date(exp.endDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
                                  : "Non spécifié"}
                            </span>
                            {exp.current && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Poste actuel
                              </Badge>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{exp.description}</p>
                          )}
                          {exp.achievements.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {exp.achievements.slice(0, 3).map((a, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                                  <span className="line-clamp-1">{a}</span>
                                </div>
                              ))}
                              {exp.achievements.length > 3 && (
                                <p className="text-xs text-primary/70 ml-3.5">+{exp.achievements.length - 3} autres</p>
                              )}
                            </div>
                          )}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'expérience" : "Ajouter une expérience"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Modifiez les détails de cette expérience professionnelle." : "Ajoutez une nouvelle expérience à votre parcours."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Entreprise</label>
                <Input value={form.company} onChange={(e) => handleFormChange("company", e.target.value)} placeholder="Nom de l'entreprise" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Poste</label>
                <Input value={form.position} onChange={(e) => handleFormChange("position", e.target.value)} placeholder="Intitulé du poste" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu</label>
                <Input value={form.location} onChange={(e) => handleFormChange("location", e.target.value)} placeholder="Ville, Pays" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <Input type="date" value={form.startDate} onChange={(e) => handleFormChange("startDate", e.target.value)} />
              </div>
              {!form.current && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de fin</label>
                  <Input type="date" value={form.endDate || ""} onChange={(e) => handleFormChange("endDate", e.target.value)} />
                </div>
              )}
              <div className="flex items-end pb-2">
                <div className="flex items-center gap-3">
                  <Switch checked={form.current} onCheckedChange={(v) => handleFormChange("current", v)} id="current" />
                  <label htmlFor="current" className="text-sm font-medium cursor-pointer">Poste actuel</label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={3} placeholder="Décrivez votre rôle et vos responsabilités..." />
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Réalisations</label>
              <div className="flex gap-2">
                <Input
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                  placeholder="Ajouter une réalisation"
                />
                <Button variant="outline" onClick={addAchievement} type="button" size="icon">
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              {form.achievements.length > 0 && (
                <div className="space-y-2 mt-2">
                  {form.achievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 group/achievement">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-sm flex-1">{a}</span>
                      <button
                        onClick={() => removeAchievement(i)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover/achievement:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Annuler</Button>
            <Button onClick={handleSave}>{editingId ? "Modifier" : "Ajouter"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
