"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Star,
  Calendar,
  MapPin,
  Award,
  X,
  AlertCircle,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { EventTraining } from "@/types";
import { useResource } from "@/hooks/use-resource";

const typeLabels: Record<string, string> = {
  formation: "Formation",
  conference: "Conférence",
  workshop: "Workshop",
  hackathon: "Hackathon",
  meetup: "Meetup",
  autre: "Autre",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: { label: "À venir", className: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Terminé", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Annulé", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const emptyEvent: Omit<EventTraining, "id"> & { id?: string } = {
  id: "",
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  type: "autre",
  startDate: "",
  endDate: "",
  location: "",
  organizer: "",
  organizerUrl: "",
  image: "",
  gallery: [],
  tags: [],
  certificate: false,
  certificateUrl: "",
  registrationUrl: "",
  speaker: "",
  speakerBio: "",
  skills: [],
  featured: false,
  status: "upcoming",
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export default function AdminEvents() {
  const { toast } = useToast();
  const { items: events, loading, create, update, remove } = useResource<EventTraining>("events");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<Omit<EventTraining, "id"> & { id?: string }>({ ...emptyEvent });

  const filtered = useMemo(
    () => events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase())),
    [events, search]
  );

  const resetForm = () => {
    setForm({ ...emptyEvent });
    setEditingId(null);
    setTagInput("");
  };

  const openEdit = (event: EventTraining) => {
    setForm({
      ...event,
      slug: event.slug || "",
      endDate: event.endDate || "",
      organizerUrl: event.organizerUrl || "",
      image: event.image || "",
    });
    setEditingId(event.id);
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

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({
        title: "Champs obligatoires",
        description: "Le titre et la description sont nécessaires.",
        variant: "destructive",
      });
      return;
    }
    const startDate = form.startDate || new Date().toISOString().slice(0, 10);
    const payload = {
      title: form.title.trim(),
      slug: form.slug || "",
      description: form.description.trim(),
      longDescription: form.longDescription || "",
      type: form.type,
      startDate,
      endDate: form.endDate || (editingId ? undefined : startDate),
      location: form.location.trim(),
      organizer: form.organizer.trim(),
      organizerUrl: form.organizerUrl || "",
      image: form.image || "",
      gallery: form.gallery || [],
      tags: form.tags || [],
      certificate: form.certificate,
      certificateUrl: form.certificateUrl || "",
      registrationUrl: form.registrationUrl || "",
      speaker: form.speaker || "",
      speakerBio: form.speakerBio || "",
      skills: form.skills || [],
      featured: form.featured,
      status: form.status,
    };
    if (editingId) {
      const saved = await update(editingId, payload);
      if (!saved) return;
      toast({ title: "Événement modifié", description: "L'événement a été mis à jour avec succès." });
    } else {
      const created = await create(payload);
      if (!created) return;
      toast({ title: "Événement créé", description: "Le nouvel événement a été ajouté avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingId) {
      const ok = await remove(deletingId);
      if (!ok) return;
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé définitivement.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleFeatured = async (event: EventTraining) => {
    const saved = await update(event.id, { featured: !event.featured });
    if (!saved) return;
    toast({
      title: !event.featured ? "Mis en avant" : "Retiré de la une",
      description: !event.featured
        ? "L'événement est maintenant mis en avant sur le site."
        : "L'événement n'est plus mis en avant.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  const handleFormChange = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Événements
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Chargement..." : `${events.length} événement${events.length > 1 ? "s" : ""} au total`}
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nouvel événement
        </Button>
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un événement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </div>

              {filtered.length === 0 ? (
          <div
            key="empty"
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Aucun événement trouvé</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search
                    ? "Essayez de modifier votre recherche."
                    : "Commencez par ajouter votre premier événement."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un événement
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div key="list" className="space-y-3">
                          {filtered.map((event) => {
                const status = statusConfig[event.status] || {
                  label: event.status,
                  className: "bg-slate-50 text-slate-600 border-slate-200",
                };
                return (
                  <div
                    key={event.id}
                  >
                    <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 shrink-0"
                            title={event.featured ? "Retirer de la une" : "Mettre en avant"}
                            onClick={() => toggleFeatured(event)}
                          >
                            <Star
                              className={cn(
                                "w-4 h-4",
                                event.featured
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/40 hover:text-amber-400"
                              )}
                            />
                          </Button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {event.title}
                              </p>
                              <Badge variant="outline" className="text-[10px] sm:text-xs">
                                {typeLabels[event.type] || event.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn("text-[10px] sm:text-xs", status.className)}
                              >
                                {status.label}
                              </Badge>
                              {event.certificate && (
                                <Badge variant="secondary" className="text-[10px] gap-1">
                                  <Award className="w-3 h-3" />
                                  Certifiant
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(event.startDate)}
                                {event.endDate && event.endDate !== event.startDate
                                  ? ` — ${formatDate(event.endDate)}`
                                  : ""}
                              </span>
                              <span className="flex items-center gap-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                {event.location}
                              </span>
                              {event.organizer && (
                                <span className="flex items-center gap-1.5 truncate">
                                  <Link2 className="w-3.5 h-3.5 shrink-0" />
                                  {event.organizer}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8"
                              onClick={() => openEdit(event)}
                            >
                              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 sm:w-8 sm:h-8 hover:text-destructive"
                              onClick={() => openDelete(event.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            
          </div>
        )}
      

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'événement" : "Nouvel événement"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations de cet événement."
                : "Ajoutez une formation, une conférence ou un atelier à votre parcours."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Nom de l'événement"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={form.type} onValueChange={(v) => handleFormChange("type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={form.status} onValueChange={(v) => handleFormChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, conf]) => (
                      <SelectItem key={key} value={key}>
                        {conf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleFormChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin</label>
                <Input
                  type="date"
                  value={form.endDate || ""}
                  onChange={(e) => handleFormChange("endDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour un événement d'une seule journée.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu</label>
                <Input
                  value={form.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder="Dakar, Sénégal"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organisateur</label>
                <Input
                  value={form.organizer}
                  onChange={(e) => handleFormChange("organizer", e.target.value)}
                  placeholder="Nom de l'organisation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                rows={3}
                placeholder="Décrivez l'événement en quelques lignes..."
              />
            </div>

            {editingId && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 font-mono">
                slug : {form.slug || "—"} — généré automatiquement à partir du titre.
              </p>
            )}

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site de l'organisateur</label>
                <Input
                  value={form.organizerUrl || ""}
                  onChange={(e) => handleFormChange("organizerUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image de couverture</label>
                <Input
                  value={form.image || ""}
                  onChange={(e) => handleFormChange("image", e.target.value)}
                  placeholder="/images/events/..."
                />
              </div>
              <div className="space-y-2 sm:col-span-2 flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => handleFormChange("featured", v)}
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                  Mettre en avant sur le site
                </label>
              </div>
              <div className="space-y-2 sm:col-span-2 flex items-center gap-3">
                <Switch
                  checked={form.certificate}
                  onCheckedChange={(v) => handleFormChange("certificate", v)}
                  id="certificate"
                />
                <label htmlFor="certificate" className="text-sm font-medium cursor-pointer">
                  Délivre un certificat de participation
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un tag"
                />
                <Button variant="outline" onClick={addTag} type="button" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted pl-2.5 pr-1.5 py-1 text-xs text-secondary-foreground"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Supprimer ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {editingId ? "Modifier" : "Créer l'événement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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
    </div>
  );
}
