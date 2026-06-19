"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  GraduationCap,
  Calendar,
  BookOpen,
  AlertCircle,
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
import { education as initialEducation } from "@/lib/data/education";
import type { Education } from "@/types";

const emptyEducation: Omit<Education, "id"> & { id?: string } = {
  id: "",
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  highlights: [],
};

export default function AdminFormations() {
  const { toast } = useToast();
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [highlightInput, setHighlightInput] = useState("");
  const [form, setForm] = useState<Omit<Education, "id"> & { id?: string }>({ ...emptyEducation });

  const filtered = useMemo(
    () =>
      education.filter(
        (e) =>
          e.institution.toLowerCase().includes(search.toLowerCase()) ||
          e.degree.toLowerCase().includes(search.toLowerCase()) ||
          e.field.toLowerCase().includes(search.toLowerCase())
      ),
    [education, search]
  );

  const resetForm = () => {
    setForm({ ...emptyEducation });
    setEditingId(null);
    setHighlightInput("");
  };

  const openEdit = (edu: Education) => {
    setForm({ ...edu, endDate: edu.endDate || "" });
    setEditingId(edu.id);
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
      setEducation((prev) =>
        prev.map((e) => (e.id === editingId ? ({ ...payload, id: editingId } as Education) : e))
      );
      toast({ title: "Formation modifiée", description: "La formation a été mise à jour avec succès." });
    } else {
      const newEdu: Education = {
        ...payload,
        id: `edu-${Date.now()}`,
      } as Education;
      setEducation((prev) => [newEdu, ...prev]);
      toast({ title: "Formation ajoutée", description: "La nouvelle formation a été créée avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setEducation((prev) => prev.filter((e) => e.id !== deletingId));
      toast({ title: "Formation supprimée", description: "La formation a été supprimée.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const addHighlight = () => {
    if (highlightInput.trim() && !form.highlights.includes(highlightInput.trim())) {
      setForm((prev) => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (idx: number) => {
    setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));
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
            Gestion des Formations
          </h1>
          <p className="text-muted-foreground mt-1">
            {education.length} formation{education.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Ajouter une formation
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une formation..."
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
                <p className="text-lg font-medium text-foreground">Aucune formation trouvée</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search ? "Essayez de modifier votre recherche." : "Commencez par ajouter votre première formation."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une formation
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((edu) => (
                <motion.div
                  key={edu.id}
                  layout
                  variants={item}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group h-full hover:shadow-md transition-all duration-300 hover:border-primary/20">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(edu)}>
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-destructive" onClick={() => openDelete(edu.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex-1">
                        <h3 className="font-semibold text-foreground text-sm">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{edu.field}</p>

                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(edu.startDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                          {" — "}
                          {edu.current
                            ? "En cours"
                            : edu.endDate
                              ? new Date(edu.endDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })
                              : "Non spécifié"}
                          {edu.current && (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] ml-1">En cours</Badge>
                          )}
                        </div>

                        {edu.description && (
                          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{edu.description}</p>
                        )}

                        {edu.highlights.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {edu.highlights.slice(0, 2).map((h, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                                <span className="line-clamp-1">{h}</span>
                              </div>
                            ))}
                            {edu.highlights.length > 2 && (
                              <p className="text-xs text-primary/70 ml-2.5">+{edu.highlights.length - 2} autres</p>
                            )}
                          </div>
                        )}
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
            <DialogTitle>{editingId ? "Modifier la formation" : "Ajouter une formation"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Modifiez les détails de cette formation." : "Ajoutez une nouvelle formation à votre parcours."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Établissement</label>
                <Input value={form.institution} onChange={(e) => handleFormChange("institution", e.target.value)} placeholder="Nom de l'établissement" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Diplôme</label>
                <Input value={form.degree} onChange={(e) => handleFormChange("degree", e.target.value)} placeholder="Licence, Master, etc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Domaine</label>
                <Input value={form.field} onChange={(e) => handleFormChange("field", e.target.value)} placeholder="Informatique, Marketing..." />
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
                  <label htmlFor="current" className="text-sm font-medium cursor-pointer">En cours</label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={3} placeholder="Décrivez la formation..." />
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Points clés</label>
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  placeholder="Ajouter un point clé"
                />
                <Button variant="outline" onClick={addHighlight} type="button" size="icon">
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              {form.highlights.length > 0 && (
                <div className="space-y-2 mt-2">
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 group/highlight">
                      <BookOpen className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                      <span className="text-sm flex-1">{h}</span>
                      <button
                        onClick={() => removeHighlight(i)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover/highlight:opacity-100 transition-opacity"
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
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.</DialogDescription>
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
