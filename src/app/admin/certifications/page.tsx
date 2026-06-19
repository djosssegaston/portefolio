"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Award,
  Calendar,
  ExternalLink,
  AlertCircle,
  Building2,
  Timer,
  CheckCircle2,
  AlertTriangle,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { certifications as initialCertifications } from "@/lib/data/certifications";
import type { Certification } from "@/types";

const emptyCertification: Omit<Certification, "id"> & { id?: string } = {
  id: "",
  title: "",
  issuer: "",
  date: "",
  expiryDate: "",
  credentialUrl: "",
  badge: "",
  description: "",
};

export default function AdminCertifications() {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Certification, "id"> & { id?: string }>({ ...emptyCertification });

  const filtered = useMemo(
    () =>
      certifications.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.issuer.toLowerCase().includes(search.toLowerCase())
      ),
    [certifications, search]
  );

  const resetForm = () => {
    setForm({ ...emptyCertification });
    setEditingId(null);
  };

  const openEdit = (cert: Certification) => {
    setForm({ ...cert, expiryDate: cert.expiryDate || "" });
    setEditingId(cert.id);
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
      expiryDate: form.expiryDate || undefined,
      credentialUrl: form.credentialUrl || undefined,
    };
    if (editingId) {
      setCertifications((prev) =>
        prev.map((c) => (c.id === editingId ? ({ ...payload, id: editingId } as Certification) : c))
      );
      toast({ title: "Certification modifiée", description: "La certification a été mise à jour avec succès." });
    } else {
      const newCert: Certification = {
        ...payload,
        badge: form.badge || "/images/certifications/default.png",
        id: `cert-${Date.now()}`,
      } as Certification;
      setCertifications((prev) => [newCert, ...prev]);
      toast({ title: "Certification ajoutée", description: "La nouvelle certification a été créée avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setCertifications((prev) => prev.filter((c) => c.id !== deletingId));
      toast({ title: "Certification supprimée", description: "La certification a été supprimée.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

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
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Certifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {certifications.length} certification{certifications.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Ajouter une certification
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une certification..."
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
                <p className="text-lg font-medium text-foreground">Aucune certification trouvée</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search ? "Essayez de modifier votre recherche." : "Commencez par ajouter votre première certification."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une certification
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((cert) => {
                const expired = isExpired(cert.expiryDate);
                return (
                  <motion.div
                    key={cert.id}
                    layout
                    variants={item}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(cert)}>
                              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-destructive" onClick={() => openDelete(cert.id)}>
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 flex-1">
                          <h3 className="font-semibold text-foreground text-sm leading-tight">{cert.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {cert.issuer}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(cert.date).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                            </span>
                            {cert.expiryDate && (
                              <span className={cn("flex items-center gap-1", expired && "text-destructive")}>
                                <Timer className="w-3 h-3" />
                                {new Date(cert.expiryDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                              </span>
                            )}
                          </div>

                          {expired ? (
                            <Badge className="mt-2 bg-red-50 text-red-700 border-red-200 text-[10px] gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Expirée
                            </Badge>
                          ) : cert.expiryDate ? (
                            <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Valide
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="mt-2 text-[10px] gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Sans expiration
                            </Badge>
                          )}

                          {cert.description && (
                            <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{cert.description}</p>
                          )}
                        </div>

                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Voir le certificat
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la certification" : "Ajouter une certification"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Modifiez les détails de cette certification." : "Ajoutez une nouvelle certification à votre portfolio."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input value={form.title} onChange={(e) => handleFormChange("title", e.target.value)} placeholder="Titre de la certification" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organisme émetteur</label>
                <Input value={form.issuer} onChange={(e) => handleFormChange("issuer", e.target.value)} placeholder="AWS, Google, Meta..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date d'obtention</label>
                <Input type="date" value={form.date} onChange={(e) => handleFormChange("date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date d'expiration (optionnelle)</label>
                <Input type="date" value={form.expiryDate || ""} onChange={(e) => handleFormChange("expiryDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL du badge (optionnelle)</label>
                <Input value={form.badge || ""} onChange={(e) => handleFormChange("badge", e.target.value)} placeholder="/images/certifications/..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL du certificat (optionnelle)</label>
              <Input value={form.credentialUrl || ""} onChange={(e) => handleFormChange("credentialUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={3} placeholder="Décrivez ce que cette certification couvre..." />
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
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cette certification ? Cette action est irréversible.</DialogDescription>
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
