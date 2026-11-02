"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertCircle,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import type { FAQ } from "@/types";
import { useResource } from "@/hooks/use-resource";

const categories = [
  "Général",
  "Prestations",
  "Business",
  "Technique",
];

const emptyFaq: Omit<FAQ, "id"> & { id?: string } = {
  id: "",
  question: "",
  answer: "",
  category: "Général",
  order: 1,
};

export default function AdminFAQ() {
  const { toast } = useToast();
  const { items: faq, loading, create, update, remove } = useResource<FAQ>("faq");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FAQ, "id"> & { id?: string }>({ ...emptyFaq });

  const filtered = useMemo(() => {
    return faq.filter((item) => {
      const matchesSearch =
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [faq, search, categoryFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => a.order - b.order);
  }, [filtered]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(faq.map((item) => item.category));
    return Array.from(cats).sort();
  }, [faq]);

  const resetForm = () => {
    setForm({ ...emptyFaq, order: faq.length + 1 });
    setEditingId(null);
  };

  const openEdit = (item: FAQ) => {
    setForm({ ...item });
    setEditingId(item.id);
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
    if (!form.question.trim() || !form.answer.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir la question et la réponse.",
        variant: "destructive",
      });
      return;
    }
    if (editingId) {
      const saved = await update(editingId, form);
      if (!saved) return;
      toast({ title: "Question modifiée", description: "La FAQ a été mise à jour." });
    } else {
      const created = await create(form);
      if (!created) return;
      toast({ title: "Question ajoutée", description: "La nouvelle question a été ajoutée." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingId) {
      const ok = await remove(deletingId);
      if (!ok) return;
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée de la FAQ.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const moveUp = async (id: string) => {
    const idx = faq.findIndex((item) => item.id === id);
    if (idx <= 0) return;
    const current = faq[idx];
    const previous = faq[idx - 1];
    const first = await update(current.id, { order: previous.order });
    if (!first) return;
    const second = await update(previous.id, { order: current.order });
    if (!second) return;
  };

  const moveDown = async (id: string) => {
    const idx = faq.findIndex((item) => item.id === id);
    if (idx < 0 || idx >= faq.length - 1) return;
    const current = faq[idx];
    const next = faq[idx + 1];
    const first = await update(current.id, { order: next.order });
    if (!first) return;
    const second = await update(next.id, { order: current.order });
    if (!second) return;
  };

  const handleFormChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };



  return (
    <div className="space-y-6">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion de la FAQ
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Chargement..." : `${faq.length} question${faq.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Ajouter une question
        </Button>
      </div>

      <div>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans la FAQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                {uniqueCategories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

              {sorted.length === 0 ? (
          <div
            key="empty"
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Aucune question trouvée</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search || categoryFilter !== "all"
                    ? "Essayez de modifier vos filtres."
                    : "Ajoutez votre première question à la FAQ."}
                </p>
                {!search && categoryFilter === "all" && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une question
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div key="list" className="space-y-2">
                          {sorted.map((faqItem, idx) => (
                <div
                  key={faqItem.id}
                >
                  <Card
                    className={cn(
                      "group transition-all duration-200 cursor-pointer hover:border-primary/20",
                      expandedId === faqItem.id && "border-primary/30"
                    )}
                    onClick={() => setExpandedId(expandedId === faqItem.id ? null : faqItem.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveUp(faqItem.id);
                            }}
                            disabled={idx === 0}
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveDown(faqItem.id);
                            }}
                            disabled={idx === sorted.length - 1}
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge variant="outline" className="text-[10px] h-5">
                              #{faqItem.order}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5"
                            >
                              {faqItem.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm",
                                expandedId === faqItem.id
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-foreground"
                              )}
                            >
                              {faqItem.question}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(faqItem);
                            }}
                          >
                            <Edit3 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDelete(faqItem.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>

                        <div className="shrink-0">
                          {expandedId === faqItem.id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                                              {expandedId === faqItem.id && (
                          <div
                            className="overflow-hidden"
                          >
                            <Separator className="my-3" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faqItem.answer}
                            </p>
                          </div>
                        )}
                      
                    </CardContent>
                  </Card>
                </div>
              ))}
            
          </div>
        )}
      

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la question" : "Ajouter une question"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Modifiez les informations de la question."
                : "Ajoutez une nouvelle question à la FAQ."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={form.question}
                onChange={(e) => handleFormChange("question", e.target.value)}
                placeholder="Entrez la question..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Réponse</label>
              <Textarea
                value={form.answer}
                onChange={(e) => handleFormChange("answer", e.target.value)}
                placeholder="Entrez la réponse..."
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={form.category} onValueChange={(v) => handleFormChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordre</label>
                <Input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) => handleFormChange("order", parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-1.5" />
              {editingId ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
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
