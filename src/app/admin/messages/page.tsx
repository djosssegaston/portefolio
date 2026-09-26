"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Reply,
  Star,
  Inbox,
  Archive as ArchiveIcon,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
  Send,
  Phone,
  ExternalLink,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types";

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type BulkAction = "read" | "unread" | "archive" | "unarchive" | "replied" | "delete";

async function readJson(res: Response) {
  return res.json().catch(() => ({}));
}

async function readMessages(view: "inbox" | "archived"): Promise<ContactMessage[]> {
  const res = await fetch(`/api/messages?view=${view}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur de chargement");
  return Array.isArray(payload?.data) ? (payload.data as ContactMessage[]) : [];
}

async function patchMessage(
  id: string,
  body: { read?: boolean; archived?: boolean; replied?: boolean }
): Promise<ContactMessage> {
  const res = await fetch(`/api/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur serveur");
  return payload.data as ContactMessage;
}

async function bulkAction(ids: string[], action: BulkAction): Promise<ContactMessage[]> {
  const res = await fetch("/api/messages", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ ids, action }),
  });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur serveur");
  return Array.isArray(payload?.data) ? (payload.data as ContactMessage[]) : [];
}

async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const payload = await readJson(res);
  if (!res.ok) throw new Error(payload?.error ?? "Erreur serveur");
}

type FilterType = "all" | "unread" | "archived";

export default function AdminMessages() {
  const { toast } = useToast();
  const [inbox, setInbox] = useState<ContactMessage[]>([]);
  const [archived, setArchived] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [mobileDetail, setMobileDetail] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [inboxResult, archivedResult] = await Promise.allSettled([
        readMessages("inbox"),
        readMessages("archived"),
      ]);
      if (inboxResult.status === "fulfilled") {
        setInbox(inboxResult.value);
      } else {
        setInbox([]);
        throw inboxResult.reason;
      }
      if (archivedResult.status === "fulfilled") {
        setArchived(archivedResult.value);
      } else {
        setArchived([]);
      }
    } catch (e: any) {
      setError(e?.message ?? "Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const messages = filter === "archived" ? archived : inbox;

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !m.read) ||
        (filter === "archived" && m.archived);
      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  const selected = useMemo(
    () =>
      inbox.find((m) => m.id === selectedId) ||
      archived.find((m) => m.id === selectedId) ||
      null,
    [inbox, archived, selectedId]
  );

  const counts = useMemo(
    () => ({
      all: inbox.length,
      unread: inbox.filter((m) => !m.read).length,
      archived: archived.length,
    }),
    [inbox, archived]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileDetail(true);
    setReplyingTo(null);
    setReplyText("");
  };

  const handleBack = () => {
    setMobileDetail(false);
    setSelectedId(null);
  };

  const fail = (e: any) => {
    toast({
      title: "Échec de l'opération",
      description: e?.message ?? "Erreur serveur",
      variant: "destructive",
    });
  };

  const handleToggleRead = async () => {
    if (!selected || busy) return;
    const next = !selected.read;
    setBusy(true);
    setInbox((prev) => prev.map((m) => (m.id === selected.id ? { ...m, read: next } : m)));
    setArchived((prev) =>
      prev.map((m) => (m.id === selected.id ? { ...m, read: next } : m))
    );
    try {
      await patchMessage(selected.id, { read: next });
      toast({
        title: next ? "Marqué comme lu" : "Marqué comme non lu",
        description: next
          ? "Le message a été marqué comme lu."
          : "Le message est maintenant non lu.",
      });
      await load();
    } catch (e: any) {
      setInbox((prev) =>
        prev.map((m) => (m.id === selected.id ? { ...m, read: !next } : m))
      );
      setArchived((prev) =>
        prev.map((m) => (m.id === selected.id ? { ...m, read: !next } : m))
      );
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const handleArchive = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await bulkAction([selected.id], selected.archived ? "unarchive" : "archive");
      toast({
        title: selected.archived ? "Message désarchivé" : "Message archivé",
        description: selected.archived
          ? "Le message a été retiré des archives."
          : "Le message a été archivé.",
      });
      setSelectedId(null);
      setMobileDetail(false);
      await load();
    } catch (e: any) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await deleteMessage(selected.id);
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé définitivement.",
        variant: "destructive",
      });
      setSelectedId(null);
      setMobileDetail(false);
      await load();
    } catch (e: any) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const handleReply = async () => {
    if (!selected || busy || !replyText.trim()) return;
    setBusy(true);
    try {
      await bulkAction([selected.id], "replied");
      toast({
        title: "Réponse envoyée",
        description: `Votre réponse à ${selected.name} a été envoyée.`,
      });
      setReplyText("");
      setReplyingTo(null);
      await load();
    } catch (e: any) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `${days} jours`;
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const filterBtns: { key: FilterType; label: string; icon: typeof Inbox }[] = [
    { key: "all", label: "Tous", icon: Inbox },
    { key: "unread", label: "Non lus", icon: Mail },
    { key: "archived", label: "Archivés", icon: ArchiveIcon },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Boîte de Réception
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading
              ? "Chargement des messages..."
              : `${messages.length} message${messages.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div variants={item}>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => {
                setLoading(true);
                load();
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Réessayer
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr_380px] lg:grid-cols-[200px_1fr] gap-4">
        {/* Left sidebar - Filters */}
        <motion.div variants={item} className="hidden xl:block space-y-1">
          <Card>
            <CardContent className="p-2">
              {filterBtns.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    filter === key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center",
                      filter === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {counts[key]}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Center - Messages list */}
        <motion.div variants={item} className={cn(mobileDetail && "hidden lg:block")}>
          <Card className="h-[calc(100vh-280px)] lg:h-[calc(100vh-320px)] overflow-hidden">
            <ScrollArea className="h-full">
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Chargement des messages...
                      </p>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        Aucun message trouvé
                      </p>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        {error
                          ? error
                          : search
                            ? "Essayez de modifier votre recherche."
                            : "Aucun message dans cette catégorie."}
                      </p>
                    </div>
                  ) : (
                    filtered.map((msg) => (
                      <motion.button
                        key={msg.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => handleSelect(msg.id)}
                        className={cn(
                          "w-full text-left p-4 transition-colors duration-200 hover:bg-accent/50 relative",
                          selectedId === msg.id && "bg-accent",
                          !msg.read && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-9 h-9 shrink-0 ring-2 ring-border">
                            <AvatarFallback
                              className={cn(
                                "text-xs font-medium",
                                !msg.read
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {msg.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={cn(
                                  "text-sm truncate",
                                  !msg.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                                )}
                              >
                                {msg.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {formatDate(msg.date)}
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-xs truncate mt-0.5",
                                !msg.read ? "font-medium text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {msg.subject}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {msg.message.slice(0, 80)}...
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                            {msg.archived && (
                              <ArchiveIcon className="w-3 h-3 text-muted-foreground/60" />
                            )}
                            {msg.replied && (
                              <Reply className="w-3 h-3 text-emerald-500/60" />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Right - Message detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "xl:block",
                !mobileDetail && "hidden xl:block"
              )}
            >
              {/* Mobile back button */}
              <div className="xl:hidden flex items-center gap-2 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Retour
                </Button>
              </div>
              <Card className="h-[calc(100vh-320px)] overflow-hidden">
                <ScrollArea className="h-full">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 shrink-0 ring-2 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {selected.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground">
                          {selected.name}
                        </h3>
                        <p className="text-xs text-muted-foreground break-all">
                          {selected.email}
                        </p>
                        {selected.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {selected.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(selected.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        {selected.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selected.message}
                      </p>
                    </div>

                    <Separator />

                    {selected.replied && (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1"
                      >
                        <Reply className="w-3 h-3" />
                        Répondu
                      </Badge>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={handleToggleRead}
                        disabled={busy}
                      >
                        {selected.read ? (
                          <>
                            <Mail className="w-3.5 h-3.5" />
                            Non lu
                          </>
                        ) : (
                          <>
                            <MailOpen className="w-3.5 h-3.5" />
                            Lu
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={handleArchive}
                        disabled={busy}
                      >
                        <ArchiveIcon className="w-3.5 h-3.5" />
                        {selected.archived ? "Désarchiver" : "Archiver"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={handleDelete}
                        disabled={busy}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => setReplyingTo(replyingTo === selected.id ? null : selected.id)}
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Répondre
                      </Button>
                    </div>

                    {/* Reply section */}
                    <AnimatePresence>
                      {replyingTo === selected.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
                        >
                          <Separator />
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Votre réponse à {selected.name}
                            </label>
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Écrivez votre réponse..."
                              rows={5}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 text-xs gap-1.5"
                                onClick={handleReply}
                                disabled={busy || !replyText.trim()}
                              >
                                <Send className="w-3.5 h-3.5" />
                                Envoyer
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </ScrollArea>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no message selected on desktop */}
        {!selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden xl:flex"
          >
            <Card className="h-[calc(100vh-280px)] lg:h-[calc(100vh-320px)] w-full">
              <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <MailOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Sélectionnez un message</p>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Choisissez un message dans la liste pour afficher son contenu.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
