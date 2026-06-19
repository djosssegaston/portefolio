"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Quote,
  Star,
  MessageSquareQuote,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { testimonials as initialTestimonials } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [search, setSearch] = useState("");

  const { pending, published } = useMemo(() => {
    const filtered = testimonials.filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
      );
    });
    return {
      pending: filtered.filter((t) => !t.validated),
      published: filtered.filter((t) => t.validated),
    };
  }, [testimonials, search]);

  const handleValidate = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, validated: true } : t))
    );
    toast({
      title: "Témoignage validé",
      description: "Le témoignage est maintenant visible sur le site.",
    });
  };

  const handleReject = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Témoignage rejeté",
      description: "Le témoignage a été rejeté et supprimé.",
      variant: "destructive",
    });
  };

  const handleRemove = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, validated: false } : t))
    );
    toast({
      title: "Témoignage retiré",
      description: "Le témoignage est maintenant en attente de validation.",
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-muted-foreground/20 fill-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );

  const renderCard = (testimonial: Testimonial, showActions: "pending" | "published") => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="hidden sm:flex flex-col items-center gap-2 pt-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Quote className="w-4 h-4 text-primary/60" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-10 h-10 shrink-0 ring-2 ring-border">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {testimonial.position}{testimonial.position && " · "}
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {renderStars(testimonial.rating)}
                <span className="text-[10px] text-muted-foreground">
                  {new Date(testimonial.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {testimonial.content}
            </p>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testimonial.featured && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Star className="w-3 h-3" />
                    À la une
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {showActions === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 gap-1.5 text-xs"
                      onClick={() => handleValidate(testimonial.id)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5 text-xs"
                      onClick={() => handleReject(testimonial.id)}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Rejeter
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-amber-600 border-amber-200 hover:bg-amber-50 gap-1.5 text-xs"
                    onClick={() => handleRemove(testimonial.id)}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Gestion des Témoignages
          </h1>
          <p className="text-muted-foreground mt-1">
            {testimonials.length} témoignage{testimonials.length > 1 ? "s" : ""} au total
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un témoignage..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <MessageSquareQuote className="w-4 h-4" />
            En attente
            {pending.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Publiés
            <span className="ml-1 w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium flex items-center justify-center">
              {published.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {["pending", "published"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {tab === "pending" && pending.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        Aucun témoignage en attente
                      </p>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Tous les témoignages ont été traités.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {tab === "published" && published.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        Aucun témoignage publié
                      </p>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Les témoignages validés apparaîtront ici.
                      </p>
                    </CardContent>
                  </Card>
                )}
                <AnimatePresence>
                  {(tab === "pending" ? pending : published).map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderCard(testimonial, tab as "pending" | "published")}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
