"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/hooks/use-resource";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types";

const allPermissions = [
  "users.read",
  "users.write",
  "users.delete",
  "projects.read",
  "projects.write",
  "projects.delete",
  "blog.read",
  "blog.write",
  "blog.delete",
  "analytics.read",
  "settings.read",
  "settings.write",
];

const roleConfig: Record<
  AdminUser["role"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  "super_admin": {
    label: "Super Admin",
    variant: "destructive",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  admin: {
    label: "Admin",
    variant: "default",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  editor: {
    label: "Éditeur",
    variant: "secondary",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "editor" as AdminUser["role"],
  permissions: [] as string[],
  active: true,
};

export default function AdminUtilisateurs() {
  const { toast } = useToast();
  const { items: users, loading, create, update, remove } = useResource<AdminUser & { active: boolean }>("users");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const openEdit = (user: AdminUser & { active: boolean }) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: user.permissions,
      active: user.active,
    });
    setEditingId(user.id);
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
    if (!form.name || !form.email) {
      toast({ title: "Erreur", description: "Le nom et l'email sont obligatoires.", variant: "destructive" });
      return;
    }
    if (!editingId && !form.password) {
      toast({ title: "Erreur", description: "Le mot de passe est obligatoire.", variant: "destructive" });
      return;
    }

    const saved = editingId ? await update(editingId, form) : await create(form);
    if (!saved) return;
    toast(
      editingId
        ? { title: "Utilisateur modifié", description: "L'utilisateur a été mis à jour avec succès." }
        : { title: "Utilisateur créé", description: "Le nouvel utilisateur a été ajouté avec succès." }
    );
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingId) {
      const isSuperAdmin = users.find((u) => u.id === deletingId)?.role === "super_admin";
      if (isSuperAdmin) {
        toast({ title: "Action impossible", description: "Le Super Admin ne peut pas être supprimé.", variant: "destructive" });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        return;
      }
      const ok = await remove(deletingId);
      if (!ok) return;
      toast({ title: "Utilisateur supprimé", description: "L'utilisateur a été supprimé définitivement.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleActive = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const nextActive = !user.active;
    const saved = await update(id, { active: nextActive });
    if (!saved) return;
    toast({
      title: nextActive ? "Utilisateur activé" : "Utilisateur désactivé",
      description: user.name,
    });
  };

  const togglePermission = (perm: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };



  const RoleIcon = (role: AdminUser["role"]) => {
    if (role === "super_admin") return ShieldAlert;
    if (role === "admin") return ShieldCheck;
    return Shield;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading
              ? "Chargement..."
              : `${users.length} utilisateur${users.length > 1 ? "s" : ""} enregistré${users.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Modifiez les informations de l'utilisateur."
                  : "Créez un nouveau compte utilisateur."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom et prénom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mot de passe {editingId && <span className="text-muted-foreground font-normal">(laisser vide pour conserver)</span>}
                  </label>
                  <Input
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rôle</label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, role: v as AdminUser["role"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {allPermissions.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={form.permissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <span className="text-sm text-muted-foreground">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {editingId ? "Modifier" : "Créer l'utilisateur"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
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
                <p className="text-lg font-medium text-foreground">Aucun utilisateur trouvé</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search
                    ? "Essayez de modifier votre recherche."
                    : "Commencez par ajouter un utilisateur."}
                </p>
                {!search && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un utilisateur
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div key="list" className="space-y-3">
                          {filtered.map((user) => {
                const RoleIconComp = RoleIcon(user.role);
                const cfg = roleConfig[user.role];
                return (
                  <div
                    key={user.id}
                  >
                    <Card className={cn(
                      "group hover:shadow-md transition-all duration-300 hover:border-primary/20",
                      !user.active && "opacity-60"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage src={user.avatar || undefined} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                            <Badge
                              className={cn("text-xs justify-center gap-1", cfg.color)}
                            >
                              <RoleIconComp className="w-3 h-3" />
                              {cfg.label}
                            </Badge>
                            <div className="hidden lg:flex flex-wrap gap-1 max-w-[200px]">
                              {user.permissions.slice(0, 3).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {perm.split(".")[1]}
                                </Badge>
                              ))}
                              {user.permissions.length > 3 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  +{user.permissions.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.active}
                                onCheckedChange={() => toggleActive(user.id)}
                                disabled={user.role === "super_admin"}
                              />
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {user.active ? "Actif" : "Inactif"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => openEdit(user)}
                            >
                              <Edit3 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:text-destructive"
                              onClick={() => openDelete(user.id)}
                              disabled={user.role === "super_admin"}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
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
      

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
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
