"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Sparkles,
  Layers,
  Tag,
  AlertCircle,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";
import { useResource } from "@/hooks/use-resource";

const iconKeys = [
  "Globe",
  "Smartphone",
  "Cloud",
  "Wrench",
  "Lightbulb",
  "TrendingUp",
  "SearchCheck",
  "GraduationCap",
];

const emptyService: Omit<Service, "id"> & { id?: string } = {
  id: "",
  title: "",
  description: "",
  longDescription: "",
  icon: "",
  features: [],
  price: "",
};

export default function AdminServices() {
  const { toast } = useToast();
  const { items: services, loading, create, update, remove } = useResource<Service>("services");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [form, setForm] = useState<Omit<Service, "id"> & { id?: string }>({ ...emptyService });

  const filtered = useMemo(
    () => services.filter((s) => s.title.toLowerCase().includes(search.toLowerCase())),
    [services, search]
  );

  const resetForm = () => {
    setForm({ ...emptyService });
    setEditingId(null);
    setFeatureInput("");
  };

  const openEdit = (service: Service) => {
    setForm({ ...service, price: service.price || "" });
    setEditingId(service.id);
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
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription || "",
      icon: form.icon || "",
      features: form.features,
      price: form.price || "",
    };
    if (editingId) {
      const saved = await update(editingId, payload);
      if (!saved) return;
      toast({ title: "Service modifié", description: "Le service a été mis à jour avec succès." });
    } else {
      const created = await create(payload);
      if (!created) return;
      toast({ title: "Service créé", description: "Le nouveau service a été ajouté avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingId) {
      const ok = await remove(deletingId);
      if (!ok) return;
      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé définitivement.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleFormChange = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Services
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Chargement..." : `${services.length} service${services.length > 1 ? "s" : ""} au total`}
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nouveau service
        </Button>
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un service..."
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
                <p className="text-lg font-medium text-foreground">Aucun service trouvé</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search
                    ? "Essayez de modifier votre recherche."
                    : "Commencez par ajouter votre premier service."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un service
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div
            key="list"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
                          {filtered.map((service) => (
                <div
                  key={service.id}
                >
                  <Card className="group h-full hover:shadow-md transition-all duration-300 hover:border-primary/20">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => openEdit(service)}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 hover:text-destructive"
                            onClick={() => openDelete(service.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground text-sm">{service.title}</h3>
                          {service.price && (
                            <Badge variant="default" className="text-[10px]">
                              {service.price}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {service.description}
                        </p>

                        {service.icon && (
                          <Badge variant="outline" className="mt-3 font-mono text-[10px] gap-1">
                            <Tag className="w-3 h-3" />
                            {service.icon}
                          </Badge>
                        )}

                        {service.features.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-1.5 text-xs text-muted-foreground"
                              >
                                <Check className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feature}</span>
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <p className="text-xs text-primary/70 ml-5">
                                +{service.features.length - 3} autres
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            
          </div>
        )}
      

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le service" : "Nouveau service"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Mettez à jour les informations de ce service."
                : "Ajoutez un nouveau service à votre offre."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Nom du service"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Description courte</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={3}
                  placeholder="Décrivez le service en quelques lignes..."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Description détaillée</label>
                <Textarea
                  value={form.longDescription}
                  onChange={(e) => handleFormChange("longDescription", e.target.value)}
                  rows={5}
                  placeholder="Développez le contenu de la page service..."
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Icône</label>
              <Input
                value={form.icon}
                onChange={(e) => handleFormChange("icon", e.target.value)}
                placeholder="Globe"
                className="font-mono"
              />
              <div className="flex flex-wrap gap-1.5">
                {iconKeys.map((key) => (
                  <Badge
                    key={key}
                    variant={form.icon === key ? "default" : "outline"}
                    className={cn(
                      "text-[10px] font-mono cursor-pointer",
                      form.icon === key && "cursor-default"
                    )}
                    onClick={() => handleFormChange("icon", form.icon === key ? "" : key)}
                  >
                    {key}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                La clé d'icône utilisée par la page publique. Laissez vide pour l'icône par défaut.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Caractéristiques</label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Ajouter une caractéristique"
                />
                <Button variant="outline" onClick={addFeature} type="button" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.features.map((feature, i) => (
                    <span
                      key={`${feature}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted pl-2.5 pr-1.5 py-1 text-xs text-secondary-foreground"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Supprimer ${feature}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Tarif</label>
              <Input
                value={form.price || ""}
                onChange={(e) => handleFormChange("price", e.target.value)}
                placeholder="Sur devis, à partir de 500 €"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Laissez vide si le service n'est pas tarifé.
              </p>
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
              {editingId ? "Modifier" : "Créer le service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
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
