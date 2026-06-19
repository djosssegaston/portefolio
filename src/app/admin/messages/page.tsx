"use client";

import { useState, useMemo } from "react";
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

const mockMessages: ContactMessage[] = [
  {
    id: "msg-01",
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    phone: "+33 6 12 34 56 78",
    subject: "Demande de devis pour site e-commerce",
    message:
      "Bonjour, je suis à la recherche d'un développeur pour créer une boutique en ligne. Notre entreprise souhaite vendre nos produits artisanaux sur internet. Nous avons besoin d'une plateforme complète avec gestion des stocks, paiement en ligne et dashboard admin. Pouvez-vous me faire un devis ? Cordialement, Sophie Martin",
    date: "2024-06-15T10:30:00",
    read: false,
    archived: false,
    replied: false,
  },
  {
    id: "msg-02",
    name: "Marc Dupont",
    email: "marc.dupont@entreprise.com",
    subject: "Proposition de collaboration",
    message:
      "Bonjour Adechina, Je suis le fondateur d'une startup dans la EdTech et nous cherchons un CTO technique pour nous accompagner. Votre profil correspond exactement à ce que nous recherchons. Seriez-vous disponible pour un appel découverte cette semaine ? Bien cordialement, Marc Dupont",
    date: "2024-06-14T14:15:00",
    read: true,
    archived: false,
    replied: false,
  },
  {
    id: "msg-03",
    name: "Aïcha Diallo",
    email: "aicha.diallo@agency.sn",
    phone: "+221 77 123 45 67",
    subject: "Mission développement application mobile",
    message:
      "Bonjour, Notre agence recherche un consultant pour le développement d'une application mobile cross-platform (React Native). Le projet est prévu pour démarrer en septembre. Souhaitez-vous que nous organisions un call pour discuter des détails techniques et du budget ? Merci d'avance.",
    date: "2024-06-13T09:45:00",
    read: true,
    archived: false,
    replied: true,
  },
  {
    id: "msg-04",
    name: "Thomas Bernard",
    email: "thomas.bernard@webcorp.fr",
    subject: "Merci pour la formation React",
    message:
      "Merci infiniment pour la formation React avancée que vous avez dispensée à notre équipe. Les retours sont excellents et nous avons déjà pu appliquer les bonnes pratiques que vous nous avez enseignées. Nous recommandons vivement vos services !",
    date: "2024-06-12T16:20:00",
    read: true,
    archived: true,
    replied: false,
  },
  {
    id: "msg-05",
    name: "Fatou Ndiaye",
    email: "fatou.ndiaye@startup.sn",
    subject: "Audit technique plateforme existante",
    message:
      "Bonjour Monsieur, Nous souhaiterions solliciter vos services pour un audit complet de notre plateforme SaaS actuelle. Nous rencontrons des problèmes de performance et de scalabilité. Pourriez-vous nous indiquer vos disponibilités et tarifs pour ce type de prestation ? Dans l'attente de votre retour.",
    date: "2024-06-11T11:00:00",
    read: false,
    archived: false,
    replied: false,
  },
  {
    id: "msg-06",
    name: "Jean-Pierre Koffi",
    email: "jp.koffi@africatech.ci",
    phone: "+225 01 02 03 04 05",
    subject: "Partenariat digital pour le marché ivoirien",
    message:
      "Bonjour Adechina, Je suis le directeur technique d'AfricaTech et nous souhaitons établir un partenariat avec vous pour nos projets digitaux en Côte d'Ivoire. Nous avons plusieurs gros projets en pipeline et votre expertise nous serait précieuse. Pouvons-nous planifier une réunion virtuelle cette semaine ?",
    date: "2024-06-10T08:30:00",
    read: false,
    archived: false,
    replied: false,
  },
  {
    id: "msg-07",
    name: "Émilie Rousseau",
    email: "emilie.rousseau@designstudio.fr",
    subject: "Refonte de site vitrine",
    message:
      "Bonjour, Notre studio de design souhaite refaire complètement son site vitrine. Nous aimerions un site moderne avec animations, portfolio interactif et blog. J'ai vu vos réalisations et je suis impressionnée par la qualité. Pourriez-vous me contacter pour qu'on en discute ? Belle journée !",
    date: "2024-06-09T13:45:00",
    read: true,
    archived: false,
    replied: true,
  },
  {
    id: "msg-08",
    name: "Dr. Amadou Touré",
    email: "amadou.toure@institut.edu",
    subject: "Demande de logiciel de gestion scolaire",
    message:
      "Bonjour Monsieur DJOSSE, Je dirige un institut de formation qui a besoin d'un logiciel de gestion scolaire complet : inscriptions, notes, emplois du temps, paiements. Avez-vous déjà développé ce type de solution ? Nous sommes basés à Bamako mais ouverts au 100% télétravail. Merci.",
    date: "2024-06-08T15:10:00",
    read: true,
    archived: false,
    replied: false,
  },
  {
    id: "msg-09",
    name: "Claire Lefebvre",
    email: "claire.lefebvre@digitalagency.fr",
    subject: "Développement API REST",
    message:
      "Bonjour, Nous cherchons un développeur backend expérimenté en Node.js pour la conception d'une API REST destinée à notre nouvelle plateforme. Le projet est estimé à environ 3 mois. Votre expertise en architecture de microservices nous intéresse particulièrement. Pouvez-vous me rappeler ?",
    date: "2024-06-07T10:00:00",
    read: true,
    archived: true,
    replied: false,
  },
  {
    id: "msg-10",
    name: "Mamadou Sall",
    email: "mamadou.sall@techsen.com",
    subject: "Demande d'information formation",
    message:
      "Bonjour, Je suis intéressé par vos formations en développement web. Je suis basé à Dakar et je souhaiterais suivre une formation en React/Next.js en ligne. Quels sont les tarifs et le programme détaillé ? Y a-t-il des certifications à la clé ? Merci d'avance pour votre réponse.",
    date: "2024-06-06T09:30:00",
    read: true,
    archived: false,
    replied: false,
  },
];

type FilterType = "all" | "unread" | "archived";

export default function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [mobileDetail, setMobileDetail] = useState(false);

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
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId]
  );

  const counts = useMemo(
    () => ({
      all: messages.length,
      unread: messages.filter((m) => !m.read).length,
      archived: messages.filter((m) => m.archived).length,
    }),
    [messages]
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

  const handleToggleRead = () => {
    if (!selected) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === selected.id ? { ...m, read: !m.read } : m))
    );
    toast({
      title: selected.read ? "Marqué comme non lu" : "Marqué comme lu",
      description: selected.read
        ? "Le message est maintenant non lu."
        : "Le message a été marqué comme lu.",
    });
  };

  const handleArchive = () => {
    if (!selected) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selected.id ? { ...m, archived: !m.archived } : m
      )
    );
    toast({
      title: selected.archived ? "Message désarchivé" : "Message archivé",
      description: selected.archived
        ? "Le message a été retiré des archives."
        : "Le message a été archivé.",
    });
    setSelectedId(null);
    setMobileDetail(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    setMessages((prev) => prev.filter((m) => m.id !== selected.id));
    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé définitivement.",
      variant: "destructive",
    });
    setSelectedId(null);
    setMobileDetail(false);
  };

  const handleReply = () => {
    if (!selected || !replyText.trim()) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selected.id ? { ...m, replied: true, read: true } : m
      )
    );
    toast({
      title: "Réponse envoyée",
      description: `Votre réponse à ${selected.name} a été envoyée.`,
    });
    setReplyText("");
    setReplyingTo(null);
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
            {messages.length} message{messages.length > 1 ? "s" : ""}
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
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        Aucun message trouvé
                      </p>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        {search
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
                          !msg.read && "bg-blue-50/50"
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
                      >
                        <ArchiveIcon className="w-3.5 h-3.5" />
                        {selected.archived ? "Désarchiver" : "Archiver"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={handleDelete}
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
                                disabled={!replyText.trim()}
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
