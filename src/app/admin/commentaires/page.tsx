"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Check, X, Trash2, RotateCcw, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

type Comment = {
  id: string;
  name: string;
  email: string;
  content: string;
  date: string;
  validated: boolean;
  postId: string;
  postTitle: string;
  postSlug: string | null;
};

type Filter = "all" | "pending" | "validated";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "En attente" },
  { key: "all", label: "Tous" },
  { key: "validated", label: "Validés" },
];

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function AdminCommentaires() {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [meta, setMeta] = useState({ total: 0, validated: 0, pending: 0 });
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<Comment | null>(null);

  const load = useCallback(async (nextFilter: Filter) => {
    try {
      setError(null);
      const res = await fetch(`/api/comments?filter=${nextFilter}`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error(payload?.error ?? "Erreur de chargement");
      setComments(payload.data ?? []);
      setMeta(payload.meta ?? { total: 0, validated: 0, pending: 0 });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load(filter);
  }, [filter, load]);

  const moderate = async (ids: string[], action: "validate" | "unvalidate" | "delete") => {
    if (!ids.length) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ids, action }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error ?? "Erreur serveur");
      if (action === "delete") {
        setComments((prev) => prev.filter((c) => !ids.includes(c.id)));
      } else {
        const updated: Comment[] = payload.data ?? [];
        const validated = action === "validate";
        setComments((prev) =>
          prev.map((c) => {
            const hit = updated.find((u) => u.id === c.id);
            return hit ?? (ids.includes(c.id) ? { ...c, validated } : c);
          })
        );
      }
      await load(filter);
      toast({
        title:
          action === "validate"
            ? "Commentaire publié"
            : action === "unvalidate"
              ? "Commentaire retiré"
              : "Commentaire supprimé",
        description:
          ids.length > 1 ? `${ids.length} commentaires traités.` : undefined,
        variant: action === "delete" ? "destructive" : "default",
      });
    } catch (e: any) {
      toast({ title: "Échec de l'opération", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q)
    );
  }, [comments, search]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Commentaires</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? "Chargement..." : `${meta.pending} en attente de modération`}
            </p>
          </div>
          {meta.pending > 0 && filter !== "all" && (
            <Button
              onClick={() => moderate(comments.filter((c) => !c.validated).map((c) => c.id), "validate")}
              disabled={busy}
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Valider tout
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
            <Button variant="outline" size="sm" onClick={() => load(filter)}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key === "pending" && meta.pending > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">{meta.pending}</span>
              )}
            </Button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un commentaire, un auteur, un article..."
          className="sm:max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Chargement des commentaires...
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">
              {filter === "pending" ? "Aucun commentaire en attente" : "Aucun commentaire"}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {filter === "pending"
                ? "Les commentaires soumis par les visiteurs apparaîtront ici."
                : "Essayez de changer de filtre ou votre recherche."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{comment.name}</span>
                      <span className="text-muted-foreground text-xs">{comment.email}</span>
                      <Badge variant={comment.validated ? "default" : "secondary"}>
                        {comment.validated ? "Publié" : "En attente"}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span>{formatDate(comment.date)}</span>
                      <span>Sur : {comment.postTitle}</span>
                      {comment.postSlug && (
                        <a
                          href={`/blog/${comment.postSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Voir l&apos;article
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {comment.validated ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => moderate([comment.id], "unvalidate")}
                      >
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                        Dépublier
                      </Button>
                    ) : (
                      <Button size="sm" disabled={busy} onClick={() => moderate([comment.id], "validate")}>
                        <Check className="mr-2 h-3.5 w-3.5" />
                        Valider
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={busy}
                      onClick={() => setDeleting(comment)}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce commentaire ?</DialogTitle>
            <DialogDescription>
              Le commentaire de {deleting?.name} sur « {deleting?.postTitle} » sera supprimé
              définitivement. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={async () => {
                if (!deleting) return;
                await moderate([deleting.id], "delete");
                setDeleting(null);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
