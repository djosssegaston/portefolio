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
  Clock,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  FileText,
  User,
  Tag,
  Bookmark,
  Sparkles,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { blogPosts as initialBlogPosts } from "@/lib/data/blog-posts";
import type { BlogPost } from "@/types";

const categories = ["Développement", "Technologie", "Business", "Design", "Carrière"];

const emptyBlogPost: Omit<BlogPost, "id"> & { id?: string } = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Développement",
  tags: [],
  author: "Portfolio",
  authorAvatar: "/images/avatars/author.jpg",
  date: new Date().toISOString().split("T")[0],
  readTime: 5,
  published: false,
  scheduledDate: "",
  popular: false,
  comments: [],
};

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<Omit<BlogPost, "id"> & { id?: string }>({ ...emptyBlogPost });

  const getStatus = (post: BlogPost): "published" | "draft" | "scheduled" => {
    if (post.scheduledDate && new Date(post.scheduledDate) > new Date()) return "scheduled";
    if (post.published) return "published";
    return "draft";
  };

  const statusConfig = {
    published: { label: "Publié", class: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Eye },
    draft: { label: "Brouillon", class: "bg-amber-50 text-amber-700 border-amber-200", icon: EyeOff },
    scheduled: { label: "Programmé", class: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  };

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
        const status = getStatus(p);
        const matchesStatus = statusFilter === "all" || status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [posts, search, categoryFilter, statusFilter]
  );

  const resetForm = () => {
    setForm({ ...emptyBlogPost, date: new Date().toISOString().split("T")[0] });
    setEditingId(null);
    setTagInput("");
  };

  const openEdit = (post: BlogPost) => {
    setForm({ ...post, scheduledDate: post.scheduledDate || "" });
    setEditingId(post.id);
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
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = {
      ...form,
      slug,
      scheduledDate: form.scheduledDate || undefined,
    };
    if (editingId) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingId ? ({ ...payload, id: editingId } as BlogPost) : p))
      );
      toast({ title: "Article modifié", description: "L'article a été mis à jour avec succès." });
    } else {
      const newPost: BlogPost = {
        ...payload,
        id: `blog-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        comments: [],
      } as BlogPost;
      setPosts((prev) => [newPost, ...prev]);
      toast({ title: "Article créé", description: "Le nouvel article a été ajouté avec succès." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setPosts((prev) => prev.filter((p) => p.id !== deletingId));
      toast({ title: "Article supprimé", description: "L'article a été supprimé.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const togglePublish = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, published: !p.published, scheduledDate: !p.published ? "" : p.scheduledDate } : p
      )
    );
    const post = posts.find((p) => p.id === id);
    toast({
      title: post?.published ? "Article masqué" : "Article publié",
      description: post?.published ? "L'article est maintenant en brouillon." : "L'article est maintenant visible.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleFormChange = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            Gestion du Blog
          </h1>
          <p className="text-muted-foreground mt-1">
            {posts.length} article{posts.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nouvel article
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="scheduled">Programmé</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-lg font-medium text-foreground">Aucun article trouvé</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {search || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Essayez de modifier vos filtres."
                    : "Commencez par rédiger votre premier article."}
                </p>
                {!search && categoryFilter === "all" && statusFilter === "all" && (
                  <Button onClick={openNew} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Nouvel article
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" variants={container} initial="hidden" animate="show" className="space-y-3">
            <AnimatePresence>
              {filtered.map((post) => {
                const status = getStatus(post);
                const StatusIcon = statusConfig[status].icon;
                return (
                  <motion.div
                    key={post.id}
                    layout
                    variants={item}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group hover:shadow-md transition-all duration-300 hover:border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                            {post.coverImage ? (
                              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-center">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {post.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {post.author}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(post.date).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs justify-center">
                              {post.category}
                            </Badge>
                            <Badge className={cn("text-xs justify-center gap-1", statusConfig[status].class)}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[status].label}
                            </Badge>
                            {post.popular && (
                              <Badge variant="secondary" className="text-xs justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Populaire
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground hidden xl:block">
                              {post.readTime} min de lecture
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => togglePublish(post.id)}>
                              {post.published ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-emerald-500" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(post)}>
                              <Edit3 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-destructive" onClick={() => openDelete(post.id)}>
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
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
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Modifiez le contenu de l'article existant." : "Rédigez un nouvel article de blog."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Titre</label>
                <Input value={form.title} onChange={(e) => handleFormChange("title", e.target.value)} placeholder="Titre de l'article" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug} onChange={(e) => handleFormChange("slug", e.target.value)} placeholder="titre-de-l-article" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={form.category} onValueChange={(v) => handleFormChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Extrait</label>
                <Textarea value={form.excerpt} onChange={(e) => handleFormChange("excerpt", e.target.value)} rows={2} placeholder="Brève description de l'article..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image de couverture (URL)</label>
                <Input value={form.coverImage} onChange={(e) => handleFormChange("coverImage", e.target.value)} placeholder="/images/blog/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Auteur</label>
                <Input value={form.author} onChange={(e) => handleFormChange("author", e.target.value)} placeholder="Nom de l'auteur" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu (Markdown)</label>
              <Textarea
                value={form.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                rows={10}
                placeholder="Contenu de l'article en Markdown..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Ajouter un tag"
                />
                <Button variant="outline" onClick={addTag} type="button">Ajouter</Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                      <Tag className="w-3 h-3" />
                      {tag} <span className="text-muted-foreground hover:text-foreground">&times;</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de programmation (optionnelle)</label>
                <Input
                  type="datetime-local"
                  value={form.scheduledDate || ""}
                  onChange={(e) => handleFormChange("scheduledDate", e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">Si renseignée, l'article sera programmé à cette date.</p>
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center gap-3">
                  <Switch checked={form.published} onCheckedChange={(v) => handleFormChange("published", v)} id="published" />
                  <label htmlFor="published" className="text-sm font-medium cursor-pointer">Publié</label>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <Switch checked={form.popular} onCheckedChange={(v) => handleFormChange("popular", v)} id="popular" />
                  <label htmlFor="popular" className="text-sm font-medium cursor-pointer">Article populaire</label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Annuler</Button>
            <Button onClick={handleSave}>{editingId ? "Modifier" : "Créer l'article"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.</DialogDescription>
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
